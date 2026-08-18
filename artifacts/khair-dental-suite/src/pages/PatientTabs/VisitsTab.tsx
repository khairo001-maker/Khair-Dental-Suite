import { useMemo, useState } from "react";
import { useDataStore } from "@/store/DataStore";
import { EmptyState } from "@/components/EmptyState";
import { Calendar, Plus, Pencil, Trash2, Stethoscope, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Visit, VisitDiagnosis, VisitProcedure, VisitType, VisitProcedureType } from "@/types";

const teeth = [
  18,17,16,15,14,13,12,11,21,22,23,24,25,26,27,28,
  48,47,46,45,44,43,42,41,31,32,33,34,35,36,37,38,
];
const visitTypes: VisitType[] = [
  "Examination", "Emergency", "Consultation", "Restoration", "Endodontics",
  "Prosthodontics", "Implantology", "Periodontal", "Oral Surgery",
  "Esthetic Dentistry", "Follow-up", "Other",
];
const procedureTypes: VisitProcedureType[] = [
  "Examination", "Diagnosis", "Restoration", "Root Canal Treatment",
  "Post and Core", "Crown", "Implant", "Extraction", "Periodontal Treatment", "Other",
];

type Draft = Omit<Visit, "id" | "createdAt" | "updatedAt" | "deletedAt" | "diagnosisIds" | "procedureIds" | "attachmentIds" | "radiographIds">;

const blankDraft = (patientId: string): Draft => ({
  patientId, date: new Date().toISOString().split("T")[0], time: "09:00",
  startTime: "09:00", endTime: "", dentist: "", type: "Examination",
  chiefComplaint: "", historyPresentIllness: "", clinicalFindings: "",
  diagnosis: "", treatmentDone: "", treatmentNotes: "", followUpInstructions: "",
  generalNotes: "", nextVisitDate: "", nextVisitNotes: "", toothNumbers: [],
  treatmentPlanItemIds: [], financialRecordIds: [], status: "Completed",
  paymentStatus: "Pending",
});

export default function VisitsTab({ patientId, t }: { patientId: string; t: (key: string) => string }) {
  const {
    visits, addVisit, updateVisit, deleteVisit,
    visitDiagnoses, addVisitDiagnosis, visitProcedures, addVisitProcedure,
    treatmentPlanItems,
  } = useDataStore();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft>(() => blankDraft(patientId));
  const [diagnoses, setDiagnoses] = useState<Array<Omit<VisitDiagnosis, "id" | "patientId" | "visitId">>>([]);
  const [procedures, setProcedures] = useState<Array<Omit<VisitProcedure, "id" | "patientId" | "visitId">>>([]);
  const [diagnosisDraft, setDiagnosisDraft] = useState({ diagnosis: "", notes: "", status: "Active" as VisitDiagnosis["status"], toothNumber: "" });
  const [procedureDraft, setProcedureDraft] = useState({ type: "Examination" as VisitProcedureType, notes: "", status: "Completed" as VisitProcedure["status"], toothNumbers: [] as number[], treatmentPlanItemId: "", clinician: "" });

  const patientVisits = visits
    .filter(v => v.patientId === patientId && !v.deletedAt)
    .sort((a, b) => `${b.date}T${b.startTime || b.time}`.localeCompare(`${a.date}T${a.startTime || a.time}`));
  const planItems = treatmentPlanItems.filter(i => i.patientId === patientId);

  const reset = () => {
    setDraft(blankDraft(patientId));
    setDiagnoses([]);
    setProcedures([]);
    setDiagnosisDraft({ diagnosis: "", notes: "", status: "Active", toothNumber: "" });
    setProcedureDraft({ type: "Examination", notes: "", status: "Completed", toothNumbers: [], treatmentPlanItemId: "", clinician: "" });
    setEditingId(null);
  };

  const submit = () => {
    if (!draft.chiefComplaint.trim() && !draft.generalNotes.trim()) return;
    const now = new Date().toISOString();
    const visitId = editingId || addVisit({
      ...draft, diagnosisIds: [], procedureIds: [], attachmentIds: [], radiographIds: [],
      createdAt: now, updatedAt: now,
    });
    const diagnosisIds = editingId ? (visits.find(v => v.id === editingId)?.diagnosisIds || []) : diagnoses.map(d => addVisitDiagnosis({ ...d, patientId, visitId, date: d.date || draft.date }));
    const procedureIds = editingId ? (visits.find(v => v.id === editingId)?.procedureIds || []) : procedures.map(p => addVisitProcedure({ ...p, patientId, visitId, date: p.date || draft.date, clinician: draft.dentist }));
    updateVisit(visitId, { ...draft, diagnosisIds, procedureIds, updatedAt: now });
    setOpen(false);
    reset();
  };

  const edit = (visit: Visit) => {
    setEditingId(visit.id);
    setDraft({ ...blankDraft(patientId), ...visit });
    setDiagnoses(visitDiagnoses.filter(d => d.visitId === visit.id).map(({ id, patientId: _p, visitId: _v, ...d }) => d));
    setProcedures(visitProcedures.filter(p => p.visitId === visit.id).map(({ id, patientId: _p, visitId: _v, ...p }) => p));
    setOpen(true);
  };

  const toggleTooth = (n: number) => setDraft(d => ({ ...d, toothNumbers: d.toothNumbers.includes(n) ? d.toothNumbers.filter(x => x !== n) : [...d.toothNumbers, n] }));
  const addDiagnosis = () => {
    if (!diagnosisDraft.diagnosis.trim()) return;
    setDiagnoses(ds => [...ds, { ...diagnosisDraft, date: draft.date, toothNumber: diagnosisDraft.toothNumber ? Number(diagnosisDraft.toothNumber) : undefined }]);
    setDiagnosisDraft({ diagnosis: "", notes: "", status: "Active", toothNumber: "" });
  };
  const addProcedure = () => {
    setProcedures(ps => [...ps, { ...procedureDraft, date: draft.date }]);
    setProcedureDraft({ type: "Examination", notes: "", status: "Completed", toothNumbers: [], treatmentPlanItemId: "", clinician: "" });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center gap-3">
        <div>
          <h3 className="text-lg font-semibold">Clinical Encounters</h3>
          <p className="text-sm text-muted-foreground">Chronological clinical events for this patient</p>
        </div>
        <Button className="min-h-[44px]" onClick={() => { reset(); setOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" /> {t("visits.record")}
        </Button>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          <SheetHeader className="mb-6">
            <SheetTitle>{editingId ? "Edit Clinical Encounter" : "Create New Visit"}</SheetTitle>
          </SheetHeader>
          <div className="space-y-5 pb-6">
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Date *</Label><Input type="date" value={draft.date} onChange={e => setDraft(d => ({ ...d, date: e.target.value }))} className="min-h-[48px] mt-1" /></div>
              <div><Label>Visit Type *</Label><Select value={draft.type} onValueChange={v => setDraft(d => ({ ...d, type: v as VisitType }))}><SelectTrigger className="min-h-[48px] mt-1"><SelectValue /></SelectTrigger><SelectContent>{visitTypes.map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent></Select></div>
              <div><Label>Start Time</Label><Input type="time" value={draft.startTime} onChange={e => setDraft(d => ({ ...d, startTime: e.target.value, time: e.target.value }))} className="min-h-[48px] mt-1" /></div>
              <div><Label>End Time</Label><Input type="time" value={draft.endTime} onChange={e => setDraft(d => ({ ...d, endTime: e.target.value }))} className="min-h-[48px] mt-1" /></div>
              <div><Label>Clinician *</Label><Input value={draft.dentist} onChange={e => setDraft(d => ({ ...d, dentist: e.target.value }))} className="min-h-[48px] mt-1" /></div>
              <div><Label>Visit Status</Label><Select value={draft.status} onValueChange={v => setDraft(d => ({ ...d, status: v as Visit["status"] }))}><SelectTrigger className="min-h-[48px] mt-1"><SelectValue /></SelectTrigger><SelectContent>{["Draft", "Open", "Completed", "Cancelled"].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent></Select></div>
            </div>
            <div><Label>Chief Complaint</Label><Input value={draft.chiefComplaint} onChange={e => setDraft(d => ({ ...d, chiefComplaint: e.target.value }))} className="min-h-[48px] mt-1" /></div>
            <div><Label>History of Present Illness</Label><Textarea value={draft.historyPresentIllness} onChange={e => setDraft(d => ({ ...d, historyPresentIllness: e.target.value }))} rows={3} className="mt-1" /></div>
            <div><Label>Clinical Examination</Label><Textarea value={draft.clinicalFindings} onChange={e => setDraft(d => ({ ...d, clinicalFindings: e.target.value }))} rows={3} className="mt-1" /></div>
            <div><Label>Diagnosis Summary</Label><Textarea value={draft.diagnosis} onChange={e => setDraft(d => ({ ...d, diagnosis: e.target.value }))} rows={2} className="mt-1" /></div>

            <section className="border rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between"><Label className="text-base">Teeth Treated</Label><span className="text-xs text-muted-foreground">{draft.toothNumbers.length} selected</span></div>
              <div className="grid grid-cols-8 gap-2">
                {teeth.map(n => <button key={n} type="button" onClick={() => toggleTooth(n)} className={`min-h-[40px] rounded-md border text-xs font-semibold ${draft.toothNumbers.includes(n) ? "bg-primary text-primary-foreground border-primary" : "bg-muted/30 hover:bg-muted"}`}>{n}</button>)}
              </div>
            </section>

            <section className="border rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between"><Label className="text-base">Diagnoses</Label><Button type="button" variant="outline" size="sm" className="min-h-[40px]" onClick={addDiagnosis}><Plus className="h-3 w-3 mr-1" /> Add</Button></div>
              <div className="grid grid-cols-2 gap-2"><Input placeholder="Diagnosis name" value={diagnosisDraft.diagnosis} onChange={e => setDiagnosisDraft(d => ({ ...d, diagnosis: e.target.value }))} className="min-h-[44px]" /><Input placeholder="FDI tooth (optional)" value={diagnosisDraft.toothNumber} onChange={e => setDiagnosisDraft(d => ({ ...d, toothNumber: e.target.value }))} className="min-h-[44px]" /></div>
              <Textarea placeholder="Diagnosis notes" value={diagnosisDraft.notes} onChange={e => setDiagnosisDraft(d => ({ ...d, notes: e.target.value }))} rows={2} />
              {diagnoses.map((d, i) => <div key={i} className="flex justify-between gap-2 border rounded-lg p-2 text-sm"><span>{d.diagnosis}{d.toothNumber ? ` · Tooth ${d.toothNumber}` : ""}</span><Badge variant="outline">{d.status}</Badge></div>)}
            </section>

            <section className="border rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between"><Label className="text-base">Procedures</Label><Button type="button" variant="outline" size="sm" className="min-h-[40px]" onClick={addProcedure}><Plus className="h-3 w-3 mr-1" /> Add</Button></div>
              <Select value={procedureDraft.type} onValueChange={v => setProcedureDraft(p => ({ ...p, type: v as VisitProcedureType }))}><SelectTrigger className="min-h-[44px]"><SelectValue /></SelectTrigger><SelectContent>{procedureTypes.map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent></Select>
              <div className="grid grid-cols-2 gap-2"><Input placeholder="Procedure notes" value={procedureDraft.notes} onChange={e => setProcedureDraft(p => ({ ...p, notes: e.target.value }))} className="min-h-[44px]" /><Select value={procedureDraft.treatmentPlanItemId || "none"} onValueChange={v => setProcedureDraft(p => ({ ...p, treatmentPlanItemId: v === "none" ? "" : v }))}><SelectTrigger className="min-h-[44px]"><SelectValue placeholder="Treatment plan link" /></SelectTrigger><SelectContent><SelectItem value="none">No plan link</SelectItem>{planItems.map(i => <SelectItem key={i.id} value={i.id}>{i.procedure} · Tooth {i.toothNumber}</SelectItem>)}</SelectContent></Select></div>
              {procedures.map((p, i) => <div key={i} className="flex justify-between gap-2 border rounded-lg p-2 text-sm"><span>{p.type}{p.treatmentPlanItemId ? " · linked plan" : ""}</span><Badge variant="outline">{p.status}</Badge></div>)}
            </section>

            <div><Label>Treatment Performed</Label><Textarea value={draft.treatmentDone} onChange={e => setDraft(d => ({ ...d, treatmentDone: e.target.value }))} rows={3} className="mt-1" /></div>
            <div><Label>Treatment Notes</Label><Textarea value={draft.treatmentNotes} onChange={e => setDraft(d => ({ ...d, treatmentNotes: e.target.value }))} rows={2} className="mt-1" /></div>
            <div><Label>Follow-up Instructions</Label><Textarea value={draft.followUpInstructions} onChange={e => setDraft(d => ({ ...d, followUpInstructions: e.target.value }))} rows={2} className="mt-1" /></div>
            <div><Label>General Notes</Label><Textarea value={draft.generalNotes} onChange={e => setDraft(d => ({ ...d, generalNotes: e.target.value }))} rows={2} className="mt-1" /></div>
            <div><Label>Payment Status</Label><Select value={draft.paymentStatus} onValueChange={v => setDraft(d => ({ ...d, paymentStatus: v as Visit["paymentStatus"] }))}><SelectTrigger className="min-h-[48px] mt-1"><SelectValue /></SelectTrigger><SelectContent>{["Pending", "Partial", "Paid", "Overdue", "Waived"].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent></Select></div>
            <Button onClick={submit} className="w-full min-h-[48px]">{editingId ? "Save Changes" : "Save Visit"}</Button>
          </div>
        </SheetContent>
      </Sheet>

      {patientVisits.length === 0 ? <EmptyState icon={Calendar} title={t("visits.empty")} description={t("visits.empty_subtext")} /> : (
        <div className="relative pl-6 border-l-2 border-muted space-y-6 py-2">
          {patientVisits.map(v => {
            const ds = visitDiagnoses.filter(d => d.visitId === v.id);
            const ps = visitProcedures.filter(p => p.visitId === v.id);
            return <div key={v.id} className="relative">
              <div className="absolute -left-[33px] top-2 h-4 w-4 rounded-full bg-background border-2 border-primary" />
              <div className="bg-card border rounded-xl p-5 shadow-sm space-y-4">
                <div className="flex flex-wrap justify-between gap-3">
                  <div><div className="font-bold text-lg">{v.date} · {v.startTime || v.time}</div><div className="text-sm text-muted-foreground">{v.dentist || "Clinician not specified"}</div></div>
                  <div className="flex flex-wrap gap-2"><Badge variant="secondary">{v.type}</Badge><Badge variant={v.status === "Completed" ? "default" : "outline"}>{v.status}</Badge><Badge variant="outline">Payment: {v.paymentStatus}</Badge></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div><span className="text-xs text-muted-foreground block">Chief Complaint</span>{v.chiefComplaint || "—"}</div>
                  <div><span className="text-xs text-muted-foreground block">Teeth Treated</span>{v.toothNumbers.length ? v.toothNumbers.join(", ") : "—"}</div>
                  <div><span className="text-xs text-muted-foreground block">Diagnoses</span>{ds.length ? ds.map(d => d.diagnosis).join(", ") : v.diagnosis || "—"}</div>
                  <div><span className="text-xs text-muted-foreground block">Procedures</span>{ps.length ? ps.map(p => p.type).join(", ") : v.treatmentDone || "—"}</div>
                </div>
                {(v.clinicalFindings || v.treatmentNotes || v.followUpInstructions || v.generalNotes) && <div className="border-t pt-3 text-sm space-y-2"><p>{v.clinicalFindings}</p><p>{v.treatmentNotes}</p><p>{v.followUpInstructions}</p><p>{v.generalNotes}</p></div>}
                <div className="flex justify-end gap-2 border-t pt-3"><Button variant="outline" size="sm" className="min-h-[40px]" onClick={() => edit(v)}><Pencil className="h-3.5 w-3.5 mr-1.5" /> Edit</Button><Button variant="ghost" size="sm" className="min-h-[40px] text-destructive" onClick={() => deleteVisit(v.id)}><Trash2 className="h-3.5 w-3.5 mr-1.5" /> Cancel Visit</Button></div>
              </div>
            </div>;
          })}
        </div>
      )}
    </div>
  );
}