import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FileImage, ImagePlus, RotateCcw, RotateCw, ScanLine, Search, Trash2, ZoomIn, ZoomOut } from "lucide-react";
import { radiographService } from "@/db/services";
import { Radiograph, RadiographType } from "@/types";
import { useDataStore } from "@/store/DataStore";
import { useLanguage } from "@/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const types: RadiographType[] = ["Periapical", "Bitewing", "Panoramic (OPG)", "Occlusal", "Cephalometric", "CBCT", "Other"];
const accept = "image/jpeg,image/jpg,image/png,image/webp,image/heic,.jpg,.jpeg,.png,.webp,.heic,.dcm,.dicom,application/dicom,application/zip,.zip";
type ViewRadiograph = Radiograph & { url?: string; isImage: boolean };

export function RadiologyGallery({ patientId }: { patientId: string }) {
  const { patients, visits, treatmentPlanItems } = useDataStore();
  const { t } = useLanguage();
  const patient = patients.find(p => p.id === patientId);
  const [records, setRecords] = useState<ViewRadiograph[]>([]);
  const [selected, setSelected] = useState<ViewRadiograph | null>(null);
  const [importOpen, setImportOpen] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [pendingPreviewUrls, setPendingPreviewUrls] = useState<string[]>([]);
  const [type, setType] = useState<RadiographType>("Periapical");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [description, setDescription] = useState("");
  const [clinicalIndication, setClinicalIndication] = useState("");
  const [findings, setFindings] = useState("");
  const [impression, setImpression] = useState("");
  const [recommendations, setRecommendations] = useState("");
  const [notes, setNotes] = useState("");
  const [visitId, setVisitId] = useState("");
  const [toothNumber, setToothNumber] = useState("");
  const [treatmentPlanItemId, setTreatmentPlanItemId] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [visitFilter, setVisitFilter] = useState("all");
  const [toothFilter, setToothFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const dragStart = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const recordUrls = useRef<string[]>([]);

  useEffect(() => {
    const urls = pendingFiles.map(file =>
      file.type.startsWith("image/") ? URL.createObjectURL(file) : ""
    );
    setPendingPreviewUrls(urls);
    return () => urls.forEach(url => url && URL.revokeObjectURL(url));
  }, [pendingFiles]);

  const refresh = useCallback(async () => {
    recordUrls.current.forEach(url => URL.revokeObjectURL(url));
    recordUrls.current = [];
    const results = await radiographService.list(patientId);
    const loaded: ViewRadiograph[] = [];
    for (const result of results) {
      const attachment = await radiographService.getAttachment(result.id);
      const url = attachment?.previewBlob ? URL.createObjectURL(attachment.previewBlob) : undefined;
      if (url) recordUrls.current.push(url);
      loaded.push({
        ...result, isImage: Boolean(attachment?.previewBlob),
        url,
      });
    }
    setRecords(loaded);
  }, [patientId]);
  useEffect(() => {
    setSelected(null);
    setEditing(false);
    setPendingFiles([]);
    resetView();
    void refresh();
    return () => {
      recordUrls.current.forEach(url => URL.revokeObjectURL(url));
      recordUrls.current = [];
    };
  }, [refresh]);

  const filtered = useMemo(() => records.filter(r =>
    (typeFilter === "all" || r.type === typeFilter) &&
    (!dateFilter || r.date.startsWith(dateFilter)) &&
    (visitFilter === "all" || r.visitId === visitFilter) &&
    (toothFilter === "all" || String(r.toothNumber) === toothFilter) &&
    (!search || `${r.description} ${r.findings} ${r.impression}`.toLowerCase().includes(search.toLowerCase()))
  ), [records, typeFilter, dateFilter, visitFilter, toothFilter, search]);

  const chooseFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []).filter(file => file.type.startsWith("image/") || /\.(heic|webp|jpe?g|png|dcm|dicom|zip)$/i.test(file.name));
    if (files.length) setPendingFiles(files);
    event.target.value = "";
  };
  const saveImport = async () => {
    await radiographService.importFiles({
      patientId, files: pendingFiles, type, date, description, clinicalIndication,
      findings, impression, recommendations, notes, visitId: visitId || undefined,
      toothNumber: toothNumber ? Number(toothNumber) : undefined,
      treatmentPlanItemId: treatmentPlanItemId || undefined,
    });
    setPendingFiles([]);
    setImportOpen(false);
    await refresh();
  };
  const deleteSelected = async () => {
    if (!selected) return;
    await radiographService.softDelete(selected.id);
    setSelected(null);
    setEditing(false);
    await refresh();
  };
  const updateView = async () => {
    if (!selected) return;
    const saved = await radiographService.updateMetadata(selected.id, {
      type: selected.type, date: selected.date, description: selected.description,
      clinicalIndication: selected.clinicalIndication, findings: selected.findings,
      impression: selected.impression, recommendations: selected.recommendations, notes: selected.notes,
      visitId: selected.visitId, toothNumber: selected.toothNumber,
      treatmentPlanItemId: selected.treatmentPlanItemId,
    });
    setSelected({ ...selected, ...saved });
    setRecords(previous => previous.map(record => record.id === saved.id ? { ...record, ...saved } : record));
    setEditing(false);
  };
  const resetView = () => { setZoom(1); setRotation(0); setPan({ x: 0, y: 0 }); };
  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (zoom <= 1) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragStart.current = { x: event.clientX, y: event.clientY, panX: pan.x, panY: pan.y };
  };
  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStart.current) return;
    setPan({ x: dragStart.current.panX + event.clientX - dragStart.current.x, y: dragStart.current.panY + event.clientY - dragStart.current.y });
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-48"><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input value={search} onChange={e => setSearch(e.target.value)} placeholder={t("radiology.search")} className="pl-9 min-h-[44px]" /></div>
        <Select value={typeFilter} onValueChange={setTypeFilter}><SelectTrigger className="min-h-[44px] w-44"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">{t("radiology.all_types")}</SelectItem>{types.map(v => <SelectItem key={v} value={v}>{t(`radiology.type.${v}`)}</SelectItem>)}</SelectContent></Select>
        <Input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)} aria-label={t("photos.filter_date")} className="min-h-[44px] w-40" />
        <Select value={visitFilter} onValueChange={setVisitFilter}><SelectTrigger className="min-h-[44px] w-40"><SelectValue placeholder={t("radiology.visit")} /></SelectTrigger><SelectContent><SelectItem value="all">{t("radiology.all_visits")}</SelectItem>{visits.filter(v => v.patientId === patientId && !v.deletedAt).map(v => <SelectItem key={v.id} value={v.id}>{v.date} · {v.type}</SelectItem>)}</SelectContent></Select>
        <Select value={toothFilter} onValueChange={setToothFilter}><SelectTrigger className="min-h-[44px] w-32"><SelectValue placeholder={t("radiology.tooth")} /></SelectTrigger><SelectContent><SelectItem value="all">{t("radiology.all_teeth")}</SelectItem>{[...new Set(records.map(r => r.toothNumber).filter((n): n is number => n !== undefined))].sort((a,b)=>a-b).map(n => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}</SelectContent></Select>
        <Button className="min-h-[44px]" onClick={() => fileInput.current?.click()}><ImagePlus className="h-4 w-4 mr-2" /> {t("radiology.import")}</Button>
        <input ref={fileInput} type="file" accept={accept} multiple className="hidden" onChange={chooseFiles} />
      </div>
      <div className="rounded-lg border border-dashed p-3 text-xs text-muted-foreground">{t("radiology.local_storage_hint")}</div>
      {filtered.length === 0 ? <div className="border border-dashed rounded-xl py-16 text-center text-muted-foreground"><ScanLine className="h-10 w-10 mx-auto mb-3 opacity-40" /><p>{t("radiology.empty")}</p><p className="text-sm mt-1">{t("radiology.empty_hint")}</p></div> : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
          {filtered.map(record => <button type="button" key={record.id} onClick={() => { setSelected(record); resetView(); }} className="text-left border rounded-xl overflow-hidden bg-card hover:ring-2 hover:ring-primary focus:outline-none focus:ring-2 focus:ring-primary">
            <div className="aspect-square bg-muted flex items-center justify-center overflow-hidden">{record.url ? <img src={record.url} alt={record.description} className="w-full h-full object-cover" /> : <FileImage className="w-14 h-14 text-muted-foreground" />}</div>
            <div className="p-3 space-y-1"><div className="flex justify-between gap-2"><Badge variant="secondary">{t(`radiology.type.${record.type}`)}</Badge><span className="text-[11px] text-muted-foreground">{record.date.slice(0,10)}</span></div><p className="font-medium text-sm truncate">{record.description}</p><p className="text-xs text-muted-foreground">{record.toothNumber ? `${t("radiology.tooth")} ${record.toothNumber}` : t("radiology.no_tooth")}{record.visitId ? ` · ${t("radiology.visit")} ${visits.find(v => v.id === record.visitId)?.date || ""}` : ""}</p></div>
          </button>)}
        </div>
      )}

      <Dialog open={selected?.patientId === patientId} onOpenChange={open => { if (!open) { setSelected(null); setEditing(false); resetView(); } }}>
        <DialogContent className="max-w-6xl w-[98vw] h-[94vh] flex flex-col p-4 overflow-y-auto">
          <DialogHeader><DialogTitle>{selected?.description || t("nav.radiology")}</DialogTitle></DialogHeader>
          {selected?.patientId === patientId && <div className="grid lg:grid-cols-[minmax(0,1fr)_320px] gap-4 flex-1 min-h-0">
            <div className="flex flex-col min-h-[45vh] bg-black text-white rounded-lg overflow-hidden">
              <div className="flex gap-2 p-2 justify-center bg-black/80">
                <Button variant="secondary" size="icon" aria-label={t("radiology.zoom_out")} className="min-h-[44px] min-w-[44px]" onClick={() => setZoom(z => Math.max(0.5, z - 0.25))}><ZoomOut className="h-4 w-4" /></Button>
                <Button variant="secondary" size="icon" aria-label={t("radiology.zoom_in")} className="min-h-[44px] min-w-[44px]" onClick={() => setZoom(z => Math.min(5, z + 0.25))}><ZoomIn className="h-4 w-4" /></Button>
                <Button variant="secondary" size="icon" aria-label={t("radiology.rotate_left")} className="min-h-[44px] min-w-[44px]" onClick={() => setRotation(r => r - 90)}><RotateCcw className="h-4 w-4" /></Button>
                <Button variant="secondary" size="icon" aria-label={t("radiology.rotate_right")} className="min-h-[44px] min-w-[44px]" onClick={() => setRotation(r => r + 90)}><RotateCw className="h-4 w-4" /></Button>
                <Button variant="secondary" className="min-h-[44px]" onClick={resetView}>{t("radiology.fit_reset")}</Button>
              </div>
              <div className="flex-1 flex items-center justify-center overflow-hidden touch-none" onWheel={e => setZoom(z => Math.max(0.5, Math.min(5, z + (e.deltaY < 0 ? 0.1 : -0.1))))} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={() => { dragStart.current = null; }}>
                {selected.url ? <img src={selected.url} alt={selected.description} draggable={false} className="max-w-full max-h-full object-contain select-none" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom}) rotate(${rotation}deg)` }} /> : <div className="text-center p-8"><FileImage className="h-16 w-16 mx-auto mb-3 opacity-50" /><p>{t("radiology.dicom_stored")}</p><p className="text-sm text-white/60">{t("radiology.viewer_future")}</p></div>}
              </div>
            </div>
            <div className="space-y-3 overflow-y-auto">
              <div className="text-sm text-muted-foreground"><p>{t("radiology.patient")}: {patient?.fullName || "—"}</p><p>{t("radiology.type")}: {t(`radiology.type.${selected.type}`)}</p></div>
              {!editing ? <div className="space-y-3 text-sm"><p><b>{t("radiology.date")}:</b> {selected.date.slice(0,10)}</p><p><b>{t("radiology.tooth")}:</b> {selected.toothNumber || "—"}</p><p><b>{t("radiology.visit")}:</b> {visits.find(v => v.id === selected.visitId)?.date || "—"}</p><p><b>{t("radiology.clinical_indication")}:</b> {selected.clinicalIndication || "—"}</p><p><b>{t("radiology.findings")}:</b> {selected.findings || "—"}</p><p><b>{t("radiology.impression")}:</b> {selected.impression || "—"}</p><p><b>{t("radiology.recommendations")}:</b> {selected.recommendations || "—"}</p><p><b>{t("radiology.notes")}:</b> {selected.notes || "—"}</p><Button variant="outline" className="min-h-[44px] w-full" onClick={() => setEditing(true)}>{t("radiology.edit_metadata")}</Button></div> : <div className="space-y-3">
                <div><Label>{t("radiology.type")}</Label><Select value={selected.type} onValueChange={v => setSelected({ ...selected, type: v as RadiographType })}><SelectTrigger className="min-h-[44px] mt-1"><SelectValue /></SelectTrigger><SelectContent>{types.map(v => <SelectItem key={v} value={v}>{t(`radiology.type.${v}`)}</SelectItem>)}</SelectContent></Select></div>
                <div><Label>{t("radiology.date")}</Label><Input type="date" value={selected.date.slice(0,10)} onChange={e => setSelected({ ...selected, date: e.target.value })} className="min-h-[44px] mt-1" /></div>
                <div><Label>{t("radiology.description")}</Label><Input value={selected.description} onChange={e => setSelected({ ...selected, description: e.target.value })} className="min-h-[44px] mt-1" /></div>
                <div><Label>{t("radiology.clinical_indication")}</Label><Textarea value={selected.clinicalIndication} onChange={e => setSelected({ ...selected, clinicalIndication: e.target.value })} rows={2} /></div>
                <div><Label>{t("radiology.findings")}</Label><Textarea value={selected.findings} onChange={e => setSelected({ ...selected, findings: e.target.value })} rows={2} /></div>
                <div><Label>{t("radiology.impression")}</Label><Textarea value={selected.impression} onChange={e => setSelected({ ...selected, impression: e.target.value })} rows={2} /></div>
                <div><Label>{t("radiology.recommendations")}</Label><Textarea value={selected.recommendations} onChange={e => setSelected({ ...selected, recommendations: e.target.value })} rows={2} /></div>
                <div><Label>{t("radiology.notes")}</Label><Textarea value={selected.notes} onChange={e => setSelected({ ...selected, notes: e.target.value })} rows={2} /></div>
                <div className="flex gap-2"><Button className="min-h-[44px] flex-1" onClick={() => void updateView()}>{t("form.save")}</Button><Button variant="outline" className="min-h-[44px]" onClick={() => setEditing(false)}>{t("form.cancel")}</Button></div>
              </div>}
              <Button variant="destructive" className="min-h-[44px] w-full" onClick={() => void deleteSelected()}><Trash2 className="h-4 w-4 mr-2" /> {t("radiology.soft_delete")}</Button>
            </div>
          </div>}
        </DialogContent>
      </Dialog>

      <Dialog open={pendingFiles.length > 0} onOpenChange={open => !open && setPendingFiles([])}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto"><DialogHeader><DialogTitle>{t("radiology.import_count").replace("{count}", String(pendingFiles.length))}</DialogTitle></DialogHeader>
          <div className="space-y-4">
             <div className="flex gap-2 overflow-x-auto">{pendingFiles.map((file, index) => <div key={`${file.name}-${file.size}`} className="shrink-0 w-24 h-24 rounded border bg-muted flex items-center justify-center overflow-hidden">{pendingPreviewUrls[index] ? <img src={pendingPreviewUrls[index]} alt={file.name} className="w-full h-full object-cover" /> : <FileImage className="h-8 w-8" />}</div>)}</div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div><Label>{t("radiology.type")}</Label><Select value={type} onValueChange={v => setType(v as RadiographType)}><SelectTrigger className="min-h-[44px] mt-1"><SelectValue /></SelectTrigger><SelectContent>{types.map(v => <SelectItem key={v} value={v}>{t(`radiology.type.${v}`)}</SelectItem>)}</SelectContent></Select></div>
              <div><Label>{t("radiology.date")}</Label><Input type="date" value={date} onChange={e => setDate(e.target.value)} className="min-h-[44px] mt-1" /></div>
              <div><Label>{t("radiology.description")}</Label><Input value={description} onChange={e => setDescription(e.target.value)} placeholder={pendingFiles[0]?.name} className="min-h-[44px] mt-1" /></div>
              <div><Label>{t("radiology.clinical_indication")}</Label><Input value={clinicalIndication} onChange={e => setClinicalIndication(e.target.value)} className="min-h-[44px] mt-1" /></div>
              <div><Label>{t("radiology.visit_optional")}</Label><Select value={visitId || "none"} onValueChange={v => setVisitId(v === "none" ? "" : v)}><SelectTrigger className="min-h-[44px] mt-1"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="none">{t("common.none")}</SelectItem>{visits.filter(v => v.patientId === patientId && !v.deletedAt).map(v => <SelectItem key={v.id} value={v.id}>{v.date} · {v.type}</SelectItem>)}</SelectContent></Select></div>
              <div><Label>{t("radiology.tooth_optional")}</Label><Input value={toothNumber} onChange={e => setToothNumber(e.target.value)} placeholder={t("photos.fdi_number")} className="min-h-[44px] mt-1" /></div>
              <div className="sm:col-span-2"><Label>{t("radiology.treatment_plan_item_optional")}</Label><Select value={treatmentPlanItemId || "none"} onValueChange={v => setTreatmentPlanItemId(v === "none" ? "" : v)}><SelectTrigger className="min-h-[44px] mt-1"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="none">{t("common.none")}</SelectItem>{treatmentPlanItems.filter(i => i.patientId === patientId && !i.deletedAt).map(i => <SelectItem key={i.id} value={i.id}>{i.procedure} · {t("radiology.tooth")} {i.toothNumber}</SelectItem>)}</SelectContent></Select></div>
              <div><Label>{t("radiology.findings")}</Label><Textarea value={findings} onChange={e => setFindings(e.target.value)} rows={2} /></div><div><Label>{t("radiology.impression")}</Label><Textarea value={impression} onChange={e => setImpression(e.target.value)} rows={2} /></div><div><Label>{t("radiology.recommendations")}</Label><Textarea value={recommendations} onChange={e => setRecommendations(e.target.value)} rows={2} /></div><div><Label>{t("radiology.notes")}</Label><Textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} /></div>
            </div>
            <div className="flex justify-end gap-2"><Button variant="outline" className="min-h-[44px]" onClick={() => setPendingFiles([])}>{t("form.cancel")}</Button><Button className="min-h-[44px]" onClick={() => void saveImport()}>{t("radiology.save_locally")}</Button></div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}