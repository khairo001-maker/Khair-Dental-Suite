import { useEffect, useMemo, useRef, useState } from "react";
import { Camera, ChevronLeft, ChevronRight, ImagePlus, Trash2, Pencil } from "lucide-react";
import { clinicalPhotoService } from "@/db/services";
import { ClinicalPhoto, PhotoCategory } from "@/types";
import { useDataStore } from "@/store/DataStore";
import { useLanguage } from "@/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const categories: PhotoCategory[] = [
  "Extraoral", "Frontal", "Right lateral", "Left lateral", "Maxillary occlusal",
  "Mandibular occlusal", "Retracted frontal", "Retracted right", "Retracted left",
  "Before treatment", "During treatment", "After treatment", "Shade", "Smile", "Other",
];
const accept = "image/jpeg,image/jpg,image/png,image/webp,image/heic,.jpg,.jpeg,.png,.webp,.heic";

type ViewPhoto = ClinicalPhoto & { url: string };

export function ClinicalPhotosGallery({ patientId }: { patientId: string }) {
  const { visits, treatmentPlanItems } = useDataStore();
  const { t } = useLanguage();
  const [photos, setPhotos] = useState<ViewPhoto[]>([]);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [visitFilter, setVisitFilter] = useState("all");
  const [toothFilter, setToothFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [selected, setSelected] = useState<ViewPhoto | null>(null);
  const [beforeId, setBeforeId] = useState("");
  const [afterId, setAfterId] = useState("");
  const [importOpen, setImportOpen] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [pendingPreviewUrls, setPendingPreviewUrls] = useState<string[]>([]);
  const [category, setCategory] = useState<PhotoCategory>("Extraoral");
  const [customCategory, setCustomCategory] = useState("");
  const [caption, setCaption] = useState("");
  const [dateTaken, setDateTaken] = useState(new Date().toISOString().split("T")[0]);
  const [visitId, setVisitId] = useState("");
  const [toothNumber, setToothNumber] = useState("");
  const [treatmentPlanItemId, setTreatmentPlanItemId] = useState("");
  const [editing, setEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const objectUrls = useRef<string[]>([]);

  const refresh = async () => {
    objectUrls.current.forEach(url => URL.revokeObjectURL(url));
    objectUrls.current = [];
    const records = await clinicalPhotoService.list(patientId);
    const next: ViewPhoto[] = [];
    for (const record of records) {
      const attachment = await clinicalPhotoService.getAttachment(record.id);
      if (attachment) {
        const url = URL.createObjectURL(attachment.previewBlob);
        objectUrls.current.push(url);
        next.push({ ...record, url });
      }
    }
    setPhotos(next);
  };
  useEffect(() => () => {
    pendingPreviewUrls.forEach(url => URL.revokeObjectURL(url));
  }, [pendingPreviewUrls]);
  useEffect(() => {
    setSelected(null);
    setEditing(false);
    setImportOpen(false);
    setPendingFiles([]);
    setPendingPreviewUrls([]);
    void refresh();
    return () => { objectUrls.current.forEach(url => URL.revokeObjectURL(url)); objectUrls.current = []; };
  }, [patientId]);

  const filtered = useMemo(() => photos.filter(photo =>
    (categoryFilter === "all" || photo.category === categoryFilter) &&
    (visitFilter === "all" || photo.visitId === visitFilter) &&
    (toothFilter === "all" || String(photo.toothNumber) === toothFilter) &&
    (!dateFilter || photo.dateTaken.startsWith(dateFilter))
  ), [photos, categoryFilter, visitFilter, toothFilter, dateFilter]);

  const resetImport = () => {
    setPendingPreviewUrls([]);
    setPendingFiles([]); setCaption(""); setCustomCategory(""); setVisitId(""); setToothNumber(""); setTreatmentPlanItemId("");
    setImportOpen(false);
  };
  const chooseFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []).filter(file => file.type.startsWith("image/") || /\.(heic|webp|jpe?g|png)$/i.test(file.name));
    if (files.length) {
      setPendingFiles(files);
      setPendingPreviewUrls(files.map(file => URL.createObjectURL(file)));
      setImportOpen(true);
    }
    event.target.value = "";
  };
  const saveImport = async () => {
    if (!pendingFiles.length) return;
    await clinicalPhotoService.importFiles({
      patientId, files: pendingFiles, category, customCategory: category === "Other" ? customCategory : undefined,
      caption, dateTaken, visitId: visitId || undefined, toothNumber: toothNumber ? Number(toothNumber) : undefined,
      treatmentPlanItemId: treatmentPlanItemId || undefined,
    });
    resetImport();
    await refresh();
  };
  const deletePhoto = async (photo: ViewPhoto) => {
    await clinicalPhotoService.softDelete(photo.id);
    setSelected(null);
    await refresh();
  };
  const selectedIndex = selected ? filtered.findIndex(photo => photo.id === selected.id) : -1;
  const moveSelection = (delta: number) => {
    if (!filtered.length) return;
    setSelected(filtered[(selectedIndex + delta + filtered.length) % filtered.length]);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col lg:flex-row gap-3 justify-between">
        <div className="flex flex-wrap gap-2">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}><SelectTrigger className="min-h-[44px] w-44"><SelectValue placeholder={t("photos.category")} /></SelectTrigger><SelectContent><SelectItem value="all">{t("photos.all_categories")}</SelectItem>{categories.map(value => <SelectItem key={value} value={value}>{t(`photos.category.${value}`)}</SelectItem>)}</SelectContent></Select>
          <Select value={visitFilter} onValueChange={setVisitFilter}><SelectTrigger className="min-h-[44px] w-40"><SelectValue placeholder={t("photos.visit")} /></SelectTrigger><SelectContent><SelectItem value="all">{t("photos.all_visits")}</SelectItem>{visits.filter(v => v.patientId === patientId && !v.deletedAt).map(v => <SelectItem key={v.id} value={v.id}>{v.date} · {v.type}</SelectItem>)}</SelectContent></Select>
          <Input type="date" aria-label={t("photos.filter_date")} className="min-h-[44px] w-40" value={dateFilter} onChange={event => setDateFilter(event.target.value)} />
          <Select value={toothFilter} onValueChange={setToothFilter}><SelectTrigger className="min-h-[44px] w-32"><SelectValue placeholder={t("photos.tooth")} /></SelectTrigger><SelectContent><SelectItem value="all">{t("photos.all_teeth")}</SelectItem>{[...new Set(photos.map(photo => photo.toothNumber).filter((n): n is number => n !== undefined))].sort((a,b) => a-b).map(n => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}</SelectContent></Select>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="min-h-[44px]" onClick={() => cameraInputRef.current?.click()}><Camera className="h-4 w-4 mr-2" /> {t("photos.take_photo")}</Button>
          <Button className="min-h-[44px]" onClick={() => fileInputRef.current?.click()}><ImagePlus className="h-4 w-4 mr-2" /> {t("photos.import")}</Button>
          <input ref={fileInputRef} type="file" accept={accept} multiple className="hidden" onChange={chooseFiles} />
          <input ref={cameraInputRef} type="file" accept={accept} capture="environment" className="hidden" onChange={chooseFiles} />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="border border-dashed rounded-xl py-16 text-center text-muted-foreground"><Camera className="h-10 w-10 mx-auto mb-3 opacity-40" /><p>{t("photos.empty")}</p><p className="text-sm mt-1">{t("photos.local_import_hint")}</p></div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {filtered.map(photo => <button type="button" key={photo.id} className="group text-left rounded-xl overflow-hidden border bg-card min-h-[180px] focus:outline-none focus:ring-2 focus:ring-primary" onClick={() => setSelected(photo)}>
            <div className="aspect-square bg-muted overflow-hidden"><img src={photo.url} alt={photo.caption} className="w-full h-full object-cover group-hover:scale-105 transition-transform" /></div>
            <div className="p-3"><div className="flex justify-between gap-2"><Badge variant="secondary" className="truncate">{photo.customCategory || t(`photos.category.${photo.category}`)}</Badge><span className="text-[11px] text-muted-foreground">{photo.dateTaken}</span></div><p className="text-sm mt-2 truncate">{photo.caption}</p></div>
          </button>)}
        </div>
      )}

      {photos.some(photo => photo.category === "Before treatment") && photos.some(photo => photo.category === "After treatment") && <section className="border rounded-xl p-4 space-y-3"><h4 className="font-semibold">{t("photos.before_after")}</h4><div className="grid grid-cols-2 gap-3"><Select value={beforeId} onValueChange={setBeforeId}><SelectTrigger className="min-h-[44px]"><SelectValue placeholder={t("photos.select_before")} /></SelectTrigger><SelectContent>{photos.filter(p => p.category === "Before treatment").map(p => <SelectItem key={p.id} value={p.id}>{p.dateTaken} · {p.caption}</SelectItem>)}</SelectContent></Select><Select value={afterId} onValueChange={setAfterId}><SelectTrigger className="min-h-[44px]"><SelectValue placeholder={t("photos.select_after")} /></SelectTrigger><SelectContent>{photos.filter(p => p.category === "After treatment").map(p => <SelectItem key={p.id} value={p.id}>{p.dateTaken} · {p.caption}</SelectItem>)}</SelectContent></Select></div>{(beforeId || afterId) && <div className="grid grid-cols-2 gap-3">{[beforeId, afterId].map((id, index) => { const photo = photos.find(p => p.id === id); return <div key={index} className="aspect-square rounded-lg overflow-hidden bg-muted">{photo && <img src={photo.url} alt={index === 0 ? t("photos.before") : t("photos.after")} className="w-full h-full object-contain" />}</div>; })}</div>}</section>}

      <Dialog open={selected?.patientId === patientId} onOpenChange={open => { if (!open) { setSelected(null); setEditing(false); } }}>
        <DialogContent className="max-w-none w-screen h-screen max-h-screen rounded-none p-4 overflow-y-auto">
          <DialogHeader><DialogTitle>{selected?.caption}</DialogTitle></DialogHeader>
          {selected?.patientId === patientId && <div className="space-y-4"><div className="max-h-[65vh] bg-black/5 rounded-lg flex items-center justify-center overflow-hidden" onTouchStart={event => { (event.currentTarget as HTMLDivElement).dataset.touchX = String(event.touches[0].clientX); }} onTouchEnd={event => { const start = Number((event.currentTarget as HTMLDivElement).dataset.touchX || 0); const delta = event.changedTouches[0].clientX - start; if (Math.abs(delta) > 70) moveSelection(delta < 0 ? 1 : -1); }}><img src={selected.url} alt={selected.caption} className="max-h-[65vh] max-w-full object-contain" /></div><div className="flex flex-wrap items-center justify-between gap-3"><div className="text-sm text-muted-foreground">{selected.customCategory || t(`photos.category.${selected.category}`)} · {selected.dateTaken}{selected.toothNumber ? ` · ${t("photos.tooth")} ${selected.toothNumber}` : ""}{selected.visitId ? ` · ${t("photos.visit")} ${visits.find(v => v.id === selected.visitId)?.date || ""}` : ""}{selected.treatmentPlanItemId ? ` · ${t("photos.linked_plan")}` : ""}</div><div className="flex flex-wrap gap-2"><Button variant="outline" size="icon" aria-label={t("photos.previous")} className="min-h-[44px] min-w-[44px]" onClick={() => moveSelection(-1)}><ChevronLeft className="h-4 w-4" /></Button><Button variant="outline" size="icon" aria-label={t("photos.next")} className="min-h-[44px] min-w-[44px]" onClick={() => moveSelection(1)}><ChevronRight className="h-4 w-4" /></Button><Button variant="outline" className="min-h-[44px]" onClick={() => setEditing(e => !e)}><Pencil className="h-4 w-4 mr-2" /> {t("photos.edit_details")}</Button><Button variant="destructive" className="min-h-[44px]" onClick={() => void deletePhoto(selected)}><Trash2 className="h-4 w-4 mr-2" /> {t("common.delete")}</Button></div></div>
            {editing && <div className="grid sm:grid-cols-2 gap-3 border-t pt-4"><div><Label>{t("photos.category")}</Label><Select value={selected.category} onValueChange={v => setSelected({ ...selected, category: v as PhotoCategory })}><SelectTrigger className="min-h-[44px] mt-1"><SelectValue /></SelectTrigger><SelectContent>{categories.map(value => <SelectItem key={value} value={value}>{t(`photos.category.${value}`)}</SelectItem>)}</SelectContent></Select></div>{selected.category === "Other" && <div><Label>{t("photos.custom_category")}</Label><Input value={selected.customCategory || ""} onChange={e => setSelected({ ...selected, customCategory: e.target.value })} className="min-h-[44px] mt-1" /></div>}<div><Label>{t("photos.date_taken")}</Label><Input type="date" value={selected.dateTaken.slice(0,10)} onChange={e => setSelected({ ...selected, dateTaken: e.target.value })} className="min-h-[44px] mt-1" /></div><div><Label>{t("photos.visit")}</Label><Select value={selected.visitId || "none"} onValueChange={v => setSelected({ ...selected, visitId: v === "none" ? undefined : v })}><SelectTrigger className="min-h-[44px] mt-1"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="none">{t("common.none")}</SelectItem>{visits.filter(v => v.patientId === patientId && !v.deletedAt).map(v => <SelectItem key={v.id} value={v.id}>{v.date} · {v.type}</SelectItem>)}</SelectContent></Select></div><div><Label>{t("photos.tooth")}</Label><Input value={selected.toothNumber ?? ""} onChange={e => setSelected({ ...selected, toothNumber: e.target.value ? Number(e.target.value) : undefined })} placeholder={t("photos.fdi_number")} className="min-h-[44px] mt-1" /></div><div><Label>{t("photos.treatment_plan")}</Label><Select value={selected.treatmentPlanItemId || "none"} onValueChange={v => setSelected({ ...selected, treatmentPlanItemId: v === "none" ? undefined : v })}><SelectTrigger className="min-h-[44px] mt-1"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="none">{t("common.none")}</SelectItem>{treatmentPlanItems.filter(i => i.patientId === patientId && !i.deletedAt).map(i => <SelectItem key={i.id} value={i.id}>{i.procedure}</SelectItem>)}</SelectContent></Select></div><div className="col-span-full"><Label>{t("photos.caption")}</Label><Input value={selected.caption} onChange={e => setSelected({ ...selected, caption: e.target.value })} className="min-h-[44px] mt-1" /></div><div className="col-span-full flex justify-end"><Button className="min-h-[44px]" onClick={async () => { const saved = await clinicalPhotoService.updateMetadata(selected.id, { category: selected.category, customCategory: selected.customCategory, dateTaken: selected.dateTaken, caption: selected.caption, visitId: selected.visitId, toothNumber: selected.toothNumber, treatmentPlanItemId: selected.treatmentPlanItemId }); setSelected({ ...selected, ...saved }); setPhotos(previous => previous.map(photo => photo.id === saved.id ? { ...photo, ...saved } : photo)); setEditing(false); }}>{t("photos.save_metadata")}</Button></div></div>}
          </div>}
        </DialogContent>
      </Dialog>

      <Dialog open={importOpen} onOpenChange={open => !open && resetImport()}>
        <DialogContent className="max-w-xl"><DialogHeader><DialogTitle>{t("photos.import_count").replace("{count}", String(pendingFiles.length))}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2 max-h-40 overflow-auto">{pendingPreviewUrls.map((url, index) => <img key={url} src={url} alt={pendingFiles[index]?.name || t("photos.preview")} className="aspect-square rounded object-cover" />)}</div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>{t("photos.category")}</Label><Select value={category} onValueChange={v => setCategory(v as PhotoCategory)}><SelectTrigger className="min-h-[44px] mt-1"><SelectValue /></SelectTrigger><SelectContent>{categories.map(value => <SelectItem key={value} value={value}>{t(`photos.category.${value}`)}</SelectItem>)}</SelectContent></Select></div>
              <div><Label>{t("photos.date_taken")}</Label><Input type="date" value={dateTaken} onChange={e => setDateTaken(e.target.value)} className="min-h-[44px] mt-1" /></div>
            </div>
            {category === "Other" && <div><Label>{t("photos.custom_category")}</Label><Input value={customCategory} onChange={e => setCustomCategory(e.target.value)} className="min-h-[44px] mt-1" /></div>}
            <div><Label>{t("photos.caption")}</Label><Textarea value={caption} onChange={e => setCaption(e.target.value)} rows={2} className="mt-1" /></div>
            <div className="grid grid-cols-3 gap-3">
              <div><Label>{t("photos.visit")}</Label><Select value={visitId || "none"} onValueChange={v => setVisitId(v === "none" ? "" : v)}><SelectTrigger className="min-h-[44px] mt-1"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="none">{t("common.none")}</SelectItem>{visits.filter(v => v.patientId === patientId && !v.deletedAt).map(v => <SelectItem key={v.id} value={v.id}>{v.date}</SelectItem>)}</SelectContent></Select></div>
              <div><Label>{t("photos.tooth")}</Label><Input value={toothNumber} onChange={e => setToothNumber(e.target.value)} placeholder={t("photos.fdi_number")} className="min-h-[44px] mt-1" /></div>
              <div><Label>{t("photos.treatment_plan")}</Label><Select value={treatmentPlanItemId || "none"} onValueChange={v => setTreatmentPlanItemId(v === "none" ? "" : v)}><SelectTrigger className="min-h-[44px] mt-1"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="none">{t("common.none")}</SelectItem>{treatmentPlanItems.filter(i => i.patientId === patientId && !i.deletedAt).map(i => <SelectItem key={i.id} value={i.id}>{i.procedure}</SelectItem>)}</SelectContent></Select></div>
            </div>
            <div className="flex justify-end gap-2"><Button variant="outline" className="min-h-[44px]" onClick={resetImport}>{t("form.cancel")}</Button><Button className="min-h-[44px]" onClick={() => void saveImport()}>{t("photos.save_locally")}</Button></div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}