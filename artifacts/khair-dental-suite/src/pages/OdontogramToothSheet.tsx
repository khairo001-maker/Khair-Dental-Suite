import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useDataStore } from "@/store/DataStore";
import {
  ToothStatus, TOOTH_STATUS_CONFIG,
  ToothDiagnosis, ToothTreatment, ToothRestoration,
  RootCanalTreatment, ToothCrown, ToothImplant,
  ToothExtraction, PeriodontalEntry, ToothPhoto, ToothRadiograph,
  ToothSurface,
} from "@/types";
import {
  Stethoscope, Wrench, Layers, Zap, Crown as CrownIcon,
  Anchor, Scissors, Activity, Camera, ScanLine,
  Plus, Trash2, ChevronDown, ChevronUp,
} from "lucide-react";

// ── Helpers ──────────────────────────────────────────────────────────────────

const today = () => new Date().toISOString().split('T')[0];

const SURFACES: ToothSurface[] = ['Mesial', 'Distal', 'Occlusal', 'Buccal', 'Lingual', 'Incisal'];

function SectionEmpty({ label, onAdd }: { label: string; onAdd: () => void }) {
  return (
    <div className="text-center py-8 text-muted-foreground">
      <p className="text-sm mb-3">No {label.toLowerCase()} records yet.</p>
      <Button variant="outline" size="sm" className="min-h-[40px]" onClick={onAdd}>
        <Plus className="h-3.5 w-3.5 mr-1.5" /> Add {label}
      </Button>
    </div>
  );
}

function RecordRow({
  children,
  onDelete,
}: {
  children: React.ReactNode;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-start gap-3 p-3 border rounded-lg bg-muted/20 group">
      <div className="flex-1 text-sm space-y-1">{children}</div>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
        onClick={onDelete}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}

function AddFormWrapper({
  title,
  open,
  onToggle,
  children,
  onSave,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  onSave: () => void;
}) {
  return (
    <Collapsible open={open} onOpenChange={onToggle}>
      <CollapsibleTrigger asChild>
        <Button variant="outline" className="w-full min-h-[40px] justify-between">
          <span className="flex items-center gap-2">
            <Plus className="h-3.5 w-3.5" /> {title}
          </span>
          {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <Card className="mt-2 border-primary/20">
          <CardContent className="p-4 space-y-3">
            {children}
            <div className="flex gap-2 pt-1">
              <Button size="sm" className="flex-1 min-h-[40px]" onClick={onSave}>Save</Button>
              <Button size="sm" variant="outline" className="min-h-[40px]" onClick={onToggle}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  );
}

// ── Tab: Status Overview ──────────────────────────────────────────────────────
function OverviewTab({
  toothNumber,
  patientId,
  currentStatus,
}: {
  toothNumber: number;
  patientId: string;
  currentStatus: ToothStatus;
}) {
  const { setToothStatus, toothDiagnoses, toothTreatments, toothRestorations,
          rootCanalTreatments, toothCrowns, toothImplants, toothExtractions,
          periodontalEntries } = useDataStore();
  const [status, setStatus] = useState<ToothStatus>(currentStatus);

  const cfg = TOOTH_STATUS_CONFIG[status];

  const counts = {
    diagnoses: toothDiagnoses.filter(r => r.patientId === patientId && r.toothNumber === toothNumber).length,
    treatments: toothTreatments.filter(r => r.patientId === patientId && r.toothNumber === toothNumber).length,
    restorations: toothRestorations.filter(r => r.patientId === patientId && r.toothNumber === toothNumber).length,
    rct: rootCanalTreatments.filter(r => r.patientId === patientId && r.toothNumber === toothNumber).length,
    crowns: toothCrowns.filter(r => r.patientId === patientId && r.toothNumber === toothNumber).length,
    implants: toothImplants.filter(r => r.patientId === patientId && r.toothNumber === toothNumber).length,
    extractions: toothExtractions.filter(r => r.patientId === patientId && r.toothNumber === toothNumber).length,
    perio: periodontalEntries.filter(r => r.patientId === patientId && r.toothNumber === toothNumber).length,
  };

  const handleSave = () => {
    setToothStatus(patientId, toothNumber, status);
  };

  return (
    <div className="space-y-5">
      <div className="p-4 border rounded-xl bg-muted/20 space-y-3">
        <p className="text-sm font-medium">Current Status</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {(Object.entries(TOOTH_STATUS_CONFIG) as [ToothStatus, typeof TOOTH_STATUS_CONFIG[ToothStatus]][]).map(
            ([key, c]) => (
              <button
                key={key}
                onClick={() => setStatus(key)}
                className={`
                  flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-all min-h-[44px]
                  ${status === key
                    ? 'ring-2 ring-primary shadow-sm'
                    : 'hover:bg-muted/50'}
                `}
                style={status === key ? { borderColor: c.stroke, backgroundColor: c.fill } : {}}
              >
                <span
                  className="w-3 h-3 rounded-sm flex-shrink-0"
                  style={{ backgroundColor: c.centerFill, border: `1px solid ${c.stroke}` }}
                />
                {c.label}
              </button>
            )
          )}
        </div>
        <Button
          className="w-full min-h-[44px]"
          onClick={handleSave}
          style={status !== currentStatus ? {} : { opacity: 0.7 }}
        >
          {status === currentStatus ? 'Status saved' : `Set to "${cfg.label}"`}
        </Button>
      </div>

      {/* Record summary */}
      <div>
        <p className="text-sm font-medium mb-2">Record Summary</p>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(counts).map(([k, v]) => (
            <div key={k} className="flex items-center justify-between px-3 py-2 border rounded-lg bg-muted/10 text-sm">
              <span className="text-muted-foreground capitalize">{k}</span>
              <Badge variant={v > 0 ? 'default' : 'secondary'} className="text-xs">{v}</Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Tab: Diagnoses ────────────────────────────────────────────────────────────
function DiagnosisTab({ toothNumber, patientId }: { toothNumber: number; patientId: string }) {
  const { toothDiagnoses, addToothDiagnosis, deleteToothDiagnosis } = useDataStore();
  const records = toothDiagnoses.filter(r => r.patientId === patientId && r.toothNumber === toothNumber);

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Omit<ToothDiagnosis, 'id' | 'toothNumber' | 'patientId'>>({
    date: today(), diagnosis: '', severity: 'Mild', status: 'Active', notes: '', dentist: '',
  });

  const save = () => {
    if (!form.diagnosis.trim()) return;
    addToothDiagnosis({ ...form, toothNumber, patientId });
    setForm({ date: today(), diagnosis: '', severity: 'Mild', status: 'Active', notes: '', dentist: '' });
    setOpen(false);
  };

  return (
    <div className="space-y-3">
      {records.length === 0 && !open
        ? <SectionEmpty label="Diagnosis" onAdd={() => setOpen(true)} />
        : (
          <>
            <div className="space-y-2">
              {records.map(r => (
                <RecordRow key={r.id} onDelete={() => deleteToothDiagnosis(r.id)}>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium">{r.diagnosis}</span>
                    <Badge variant="outline" className="text-xs">{r.severity}</Badge>
                    <Badge variant={r.status === 'Active' ? 'destructive' : 'secondary'} className="text-xs">{r.status}</Badge>
                  </div>
                  {r.notes && <p className="text-muted-foreground text-xs">{r.notes}</p>}
                  <p className="text-xs text-muted-foreground/70">{r.date}{r.dentist ? ` · ${r.dentist}` : ''}</p>
                </RecordRow>
              ))}
            </div>
            <AddFormWrapper title="Add Diagnosis" open={open} onToggle={() => setOpen(v => !v)} onSave={save}>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <Label className="text-xs">Diagnosis *</Label>
                  <Input value={form.diagnosis} onChange={e => setForm(f => ({ ...f, diagnosis: e.target.value }))} placeholder="e.g. Deep Caries, Pulpitis" className="min-h-[44px] mt-1" />
                </div>
                <div>
                  <Label className="text-xs">Severity</Label>
                  <Select value={form.severity} onValueChange={v => setForm(f => ({ ...f, severity: v as ToothDiagnosis['severity'] }))}>
                    <SelectTrigger className="min-h-[44px] mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mild">Mild</SelectItem>
                      <SelectItem value="Moderate">Moderate</SelectItem>
                      <SelectItem value="Severe">Severe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Status</Label>
                  <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v as ToothDiagnosis['status'] }))}>
                    <SelectTrigger className="min-h-[44px] mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Monitoring">Monitoring</SelectItem>
                      <SelectItem value="Resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Date</Label>
                  <Input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className="min-h-[44px] mt-1" />
                </div>
                <div>
                  <Label className="text-xs">Dentist</Label>
                  <Input value={form.dentist} onChange={e => setForm(f => ({ ...f, dentist: e.target.value }))} className="min-h-[44px] mt-1" />
                </div>
                <div className="col-span-2">
                  <Label className="text-xs">Notes</Label>
                  <Textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} className="mt-1" />
                </div>
              </div>
            </AddFormWrapper>
          </>
        )
      }
    </div>
  );
}

// ── Tab: Treatments ───────────────────────────────────────────────────────────
function TreatmentsTab({ toothNumber, patientId }: { toothNumber: number; patientId: string }) {
  const { toothTreatments, addToothTreatment, deleteToothTreatment, treatmentPlanItems } = useDataStore();
  const records = toothTreatments.filter(r => r.patientId === patientId && r.toothNumber === toothNumber);

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Omit<ToothTreatment, 'id' | 'toothNumber' | 'patientId'>>({
    date: today(), procedure: '', treatmentType: 'Other', surfaces: [], visitId: '', treatmentPlanItemId: '', notes: '', dentist: '', status: 'Planned',
  });

  const toggleSurface = (s: ToothSurface) => {
    setForm(f => ({
      ...f,
      surfaces: f.surfaces.includes(s) ? f.surfaces.filter(x => x !== s) : [...f.surfaces, s],
    }));
  };

  const save = () => {
    if (!form.procedure.trim()) return;
    addToothTreatment({ ...form, toothNumber, patientId });
    setForm({ date: today(), procedure: '', treatmentType: 'Other', surfaces: [], visitId: '', treatmentPlanItemId: '', notes: '', dentist: '', status: 'Planned' });
    setOpen(false);
  };

  const statusColor: Record<string, string> = {
    Planned: 'bg-yellow-100 text-yellow-800',
    'In Progress': 'bg-blue-100 text-blue-800',
    Completed: 'bg-green-100 text-green-800',
  };

  return (
    <div className="space-y-3">
      {records.length === 0 && !open
        ? <SectionEmpty label="Treatment" onAdd={() => setOpen(true)} />
        : (
          <>
            <div className="space-y-2">
              {records.map(r => (
                <RecordRow key={r.id} onDelete={() => deleteToothTreatment(r.id)}>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium">{r.procedure}</span>
                    <Badge variant="outline" className="text-xs">{r.treatmentType}</Badge>
                    <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${statusColor[r.status] || ''}`}>{r.status}</span>
                  </div>
                  {r.surfaces.length > 0 && <p className="text-xs text-muted-foreground">Surfaces: {r.surfaces.join(', ')}</p>}
                  {r.notes && <p className="text-muted-foreground text-xs">{r.notes}</p>}
                  {r.visitId && <p className="text-xs text-muted-foreground">Visit ID: {r.visitId}</p>}
                  {r.treatmentPlanItemId && <p className="text-xs text-muted-foreground">Linked treatment plan item</p>}
                  <p className="text-xs text-muted-foreground/70">{r.date}{r.dentist ? ` · ${r.dentist}` : ''}</p>
                </RecordRow>
              ))}
            </div>
            <AddFormWrapper title="Add Treatment" open={open} onToggle={() => setOpen(v => !v)} onSave={save}>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <Label className="text-xs">Procedure *</Label>
                  <Input value={form.procedure} onChange={e => setForm(f => ({ ...f, procedure: e.target.value }))} placeholder="e.g. Composite Restoration, Extraction" className="min-h-[44px] mt-1" />
                </div>
                <div>
                  <Label className="text-xs">Treatment Type</Label>
                  <Select value={form.treatmentType} onValueChange={v => setForm(f => ({ ...f, treatmentType: v as ToothTreatment['treatmentType'] }))}>
                    <SelectTrigger className="min-h-[44px] mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {['Restoration', 'Root Canal Treatment', 'Crown', 'Post and Core', 'Implant', 'Extraction', 'Periodontal Treatment', 'Other'].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Status</Label>
                  <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v as ToothTreatment['status'] }))}>
                    <SelectTrigger className="min-h-[44px] mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Planned">Planned</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Visit ID</Label>
                  <Input value={form.visitId} onChange={e => setForm(f => ({ ...f, visitId: e.target.value }))} placeholder="Optional" className="min-h-[44px] mt-1" />
                </div>
                <div className="col-span-2">
                  <Label className="text-xs">Linked Treatment Plan Item</Label>
                  <Select value={form.treatmentPlanItemId || "none"} onValueChange={v => setForm(f => ({ ...f, treatmentPlanItemId: v === "none" ? "" : v }))}>
                    <SelectTrigger className="min-h-[44px] mt-1"><SelectValue placeholder="Optional — select a plan item" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Not linked</SelectItem>
                      {treatmentPlanItems.filter(i => i.patientId === patientId && !i.deletedAt && (i.toothNumber === String(toothNumber) || i.toothNumber === '')).map(i => (
                        <SelectItem key={i.id} value={i.id}>{i.procedure} · {i.status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Date</Label>
                  <Input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className="min-h-[44px] mt-1" />
                </div>
                <div className="col-span-2">
                  <Label className="text-xs mb-2 block">Surfaces</Label>
                  <div className="flex flex-wrap gap-2">
                    {SURFACES.map(s => (
                      <label key={s} className="flex items-center gap-1.5 text-sm cursor-pointer">
                        <Checkbox
                          checked={form.surfaces.includes(s)}
                          onCheckedChange={() => toggleSurface(s)}
                        />
                        {s}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-xs">Dentist</Label>
                  <Input value={form.dentist} onChange={e => setForm(f => ({ ...f, dentist: e.target.value }))} className="min-h-[44px] mt-1" />
                </div>
                <div className="col-span-2">
                  <Label className="text-xs">Notes</Label>
                  <Textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} className="mt-1" />
                </div>
              </div>
            </AddFormWrapper>
          </>
        )
      }
    </div>
  );
}

// ── Tab: Restorations ─────────────────────────────────────────────────────────
function RestorationsTab({ toothNumber, patientId }: { toothNumber: number; patientId: string }) {
  const { toothRestorations, addToothRestoration, deleteToothRestoration } = useDataStore();
  const records = toothRestorations.filter(r => r.patientId === patientId && r.toothNumber === toothNumber);

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Omit<ToothRestoration, 'id' | 'toothNumber' | 'patientId'>>({
    date: today(), material: 'Composite', surfaces: [], notes: '', dentist: '',
  });

  const toggleSurface = (s: ToothSurface) =>
    setForm(f => ({ ...f, surfaces: f.surfaces.includes(s) ? f.surfaces.filter(x => x !== s) : [...f.surfaces, s] }));

  const save = () => {
    addToothRestoration({ ...form, toothNumber, patientId });
    setForm({ date: today(), material: 'Composite', surfaces: [], notes: '', dentist: '' });
    setOpen(false);
  };

  return (
    <div className="space-y-3">
      {records.length === 0 && !open
        ? <SectionEmpty label="Restoration" onAdd={() => setOpen(true)} />
        : (
          <>
            <div className="space-y-2">
              {records.map(r => (
                <RecordRow key={r.id} onDelete={() => deleteToothRestoration(r.id)}>
                  <div className="flex items-center gap-2"><span className="font-medium">{r.material}</span></div>
                  {r.surfaces.length > 0 && <p className="text-xs text-muted-foreground">Surfaces: {r.surfaces.join(', ')}</p>}
                  {r.notes && <p className="text-xs text-muted-foreground">{r.notes}</p>}
                  <p className="text-xs text-muted-foreground/70">{r.date}{r.dentist ? ` · ${r.dentist}` : ''}</p>
                </RecordRow>
              ))}
            </div>
            <AddFormWrapper title="Add Restoration" open={open} onToggle={() => setOpen(v => !v)} onSave={save}>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Material</Label>
                  <Select value={form.material} onValueChange={v => setForm(f => ({ ...f, material: v as ToothRestoration['material'] }))}>
                    <SelectTrigger className="min-h-[44px] mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {['Composite', 'Amalgam', 'GIC', 'Ceramic', 'Gold', 'Other'].map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Date</Label>
                  <Input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className="min-h-[44px] mt-1" />
                </div>
                <div className="col-span-2">
                  <Label className="text-xs mb-2 block">Surfaces</Label>
                  <div className="flex flex-wrap gap-2">
                    {SURFACES.map(s => (
                      <label key={s} className="flex items-center gap-1.5 text-sm cursor-pointer">
                        <Checkbox checked={form.surfaces.includes(s)} onCheckedChange={() => toggleSurface(s)} />
                        {s}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-xs">Dentist</Label>
                  <Input value={form.dentist} onChange={e => setForm(f => ({ ...f, dentist: e.target.value }))} className="min-h-[44px] mt-1" />
                </div>
                <div className="col-span-2">
                  <Label className="text-xs">Notes</Label>
                  <Textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} className="mt-1" />
                </div>
              </div>
            </AddFormWrapper>
          </>
        )
      }
    </div>
  );
}

// ── Tab: Root Canal ───────────────────────────────────────────────────────────
function RCTTab({ toothNumber, patientId }: { toothNumber: number; patientId: string }) {
  const { rootCanalTreatments, addRootCanalTreatment, deleteRootCanalTreatment } = useDataStore();
  const records = rootCanalTreatments.filter(r => r.patientId === patientId && r.toothNumber === toothNumber);

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Omit<RootCanalTreatment, 'id' | 'toothNumber' | 'patientId'>>({
    date: today(), canals: 1, workingLength: 0, technique: '', irrigant: 'NaOCl 2.5%',
    sealer: '', obturation: 'Gutta-Percha', status: 'Diagnosis', notes: '', dentist: '',
  });

  const save = () => {
    addRootCanalTreatment({ ...form, toothNumber, patientId });
    setForm({ date: today(), canals: 1, workingLength: 0, technique: '', irrigant: 'NaOCl 2.5%', sealer: '', obturation: 'Gutta-Percha', status: 'Diagnosis', notes: '', dentist: '' });
    setOpen(false);
  };

  const statusColor: Record<string, string> = {
    Diagnosis: 'bg-yellow-100 text-yellow-800', Access: 'bg-orange-100 text-orange-800',
    Instrumentation: 'bg-blue-100 text-blue-800', Obturation: 'bg-violet-100 text-violet-800',
    'Post & Core': 'bg-pink-100 text-pink-800', Complete: 'bg-green-100 text-green-800',
  };

  return (
    <div className="space-y-3">
      {records.length === 0 && !open
        ? <SectionEmpty label="Root Canal Treatment" onAdd={() => setOpen(true)} />
        : (
          <>
            <div className="space-y-2">
              {records.map(r => (
                <RecordRow key={r.id} onDelete={() => deleteRootCanalTreatment(r.id)}>
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="font-medium">{r.canals} canal{r.canals > 1 ? 's' : ''}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${statusColor[r.status] || ''}`}>{r.status}</span>
                    {r.workingLength > 0 && <span className="text-xs text-muted-foreground">WL: {r.workingLength}mm</span>}
                  </div>
                  <div className="text-xs text-muted-foreground flex flex-wrap gap-x-3">
                    {r.irrigant && <span>Irrigant: {r.irrigant}</span>}
                    {r.obturation && <span>Obtur: {r.obturation}</span>}
                    {r.technique && <span>Technique: {r.technique}</span>}
                  </div>
                  {r.notes && <p className="text-xs text-muted-foreground">{r.notes}</p>}
                  <p className="text-xs text-muted-foreground/70">{r.date}{r.dentist ? ` · ${r.dentist}` : ''}</p>
                </RecordRow>
              ))}
            </div>
            <AddFormWrapper title="Add RCT Record" open={open} onToggle={() => setOpen(v => !v)} onSave={save}>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Canals</Label>
                  <Input type="number" min={1} max={4} value={form.canals} onChange={e => setForm(f => ({ ...f, canals: +e.target.value }))} className="min-h-[44px] mt-1" />
                </div>
                <div>
                  <Label className="text-xs">Working Length (mm)</Label>
                  <Input type="number" step={0.5} value={form.workingLength} onChange={e => setForm(f => ({ ...f, workingLength: +e.target.value }))} className="min-h-[44px] mt-1" />
                </div>
                <div>
                  <Label className="text-xs">Status</Label>
                  <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v as RootCanalTreatment['status'] }))}>
                    <SelectTrigger className="min-h-[44px] mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {['Diagnosis', 'Access', 'Instrumentation', 'Obturation', 'Post & Core', 'Complete'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Obturation</Label>
                  <Select value={form.obturation} onValueChange={v => setForm(f => ({ ...f, obturation: v as RootCanalTreatment['obturation'] }))}>
                    <SelectTrigger className="min-h-[44px] mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {['Gutta-Percha', 'Thermoplastic', 'Paste', 'Other'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Irrigant</Label>
                  <Input value={form.irrigant} onChange={e => setForm(f => ({ ...f, irrigant: e.target.value }))} className="min-h-[44px] mt-1" />
                </div>
                <div>
                  <Label className="text-xs">Technique</Label>
                  <Input value={form.technique} onChange={e => setForm(f => ({ ...f, technique: e.target.value }))} placeholder="Crown-down, Step-back…" className="min-h-[44px] mt-1" />
                </div>
                <div>
                  <Label className="text-xs">Sealer</Label>
                  <Input value={form.sealer} onChange={e => setForm(f => ({ ...f, sealer: e.target.value }))} className="min-h-[44px] mt-1" />
                </div>
                <div>
                  <Label className="text-xs">Date</Label>
                  <Input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className="min-h-[44px] mt-1" />
                </div>
                <div>
                  <Label className="text-xs">Dentist</Label>
                  <Input value={form.dentist} onChange={e => setForm(f => ({ ...f, dentist: e.target.value }))} className="min-h-[44px] mt-1" />
                </div>
                <div className="col-span-2">
                  <Label className="text-xs">Notes</Label>
                  <Textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} className="mt-1" />
                </div>
              </div>
            </AddFormWrapper>
          </>
        )
      }
    </div>
  );
}

// ── Tab: Crown ────────────────────────────────────────────────────────────────
function CrownTab({ toothNumber, patientId }: { toothNumber: number; patientId: string }) {
  const { toothCrowns, addToothCrown, deleteToothCrown } = useDataStore();
  const records = toothCrowns.filter(r => r.patientId === patientId && r.toothNumber === toothNumber);

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Omit<ToothCrown, 'id' | 'toothNumber' | 'patientId'>>({
    date: today(), type: 'Zirconia', shade: '', lab: '', status: 'Preparation', notes: '', dentist: '',
  });

  const save = () => {
    addToothCrown({ ...form, toothNumber, patientId });
    setForm({ date: today(), type: 'Zirconia', shade: '', lab: '', status: 'Preparation', notes: '', dentist: '' });
    setOpen(false);
  };

  return (
    <div className="space-y-3">
      {records.length === 0 && !open
        ? <SectionEmpty label="Crown" onAdd={() => setOpen(true)} />
        : (
          <>
            <div className="space-y-2">
              {records.map(r => (
                <RecordRow key={r.id} onDelete={() => deleteToothCrown(r.id)}>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium">{r.type} Crown</span>
                    <Badge variant="outline" className="text-xs">{r.status}</Badge>
                    {r.shade && <span className="text-xs text-muted-foreground">Shade: {r.shade}</span>}
                  </div>
                  {r.lab && <p className="text-xs text-muted-foreground">Lab: {r.lab}</p>}
                  {r.notes && <p className="text-xs text-muted-foreground">{r.notes}</p>}
                  <p className="text-xs text-muted-foreground/70">{r.date}{r.dentist ? ` · ${r.dentist}` : ''}</p>
                </RecordRow>
              ))}
            </div>
            <AddFormWrapper title="Add Crown Record" open={open} onToggle={() => setOpen(v => !v)} onSave={save}>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Type</Label>
                  <Select value={form.type} onValueChange={v => setForm(f => ({ ...f, type: v as ToothCrown['type'] }))}>
                    <SelectTrigger className="min-h-[44px] mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {['PFM', 'Zirconia', 'E.max', 'Gold', 'Temporary', 'Other'].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Status</Label>
                  <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v as ToothCrown['status'] }))}>
                    <SelectTrigger className="min-h-[44px] mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {['Preparation', 'Impression', 'Temporization', 'Try-in', 'Cemented'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Shade</Label>
                  <Input value={form.shade} onChange={e => setForm(f => ({ ...f, shade: e.target.value }))} placeholder="A2, B3…" className="min-h-[44px] mt-1" />
                </div>
                <div>
                  <Label className="text-xs">Lab</Label>
                  <Input value={form.lab} onChange={e => setForm(f => ({ ...f, lab: e.target.value }))} className="min-h-[44px] mt-1" />
                </div>
                <div>
                  <Label className="text-xs">Date</Label>
                  <Input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className="min-h-[44px] mt-1" />
                </div>
                <div>
                  <Label className="text-xs">Dentist</Label>
                  <Input value={form.dentist} onChange={e => setForm(f => ({ ...f, dentist: e.target.value }))} className="min-h-[44px] mt-1" />
                </div>
                <div className="col-span-2">
                  <Label className="text-xs">Notes</Label>
                  <Textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} className="mt-1" />
                </div>
              </div>
            </AddFormWrapper>
          </>
        )
      }
    </div>
  );
}

// ── Tab: Implant ──────────────────────────────────────────────────────────────
function ImplantTab({ toothNumber, patientId }: { toothNumber: number; patientId: string }) {
  const { toothImplants, addToothImplant, deleteToothImplant } = useDataStore();
  const records = toothImplants.filter(r => r.patientId === patientId && r.toothNumber === toothNumber);

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Omit<ToothImplant, 'id' | 'toothNumber' | 'patientId'>>({
    placementDate: today(), brand: '', diameter: 3.5, length: 10, torque: 35,
    boneGraft: false, membrane: false, abutmentDate: '', crownDate: '',
    stage: 'Planning', notes: '', surgeon: '',
  });

  const save = () => {
    if (!form.brand.trim()) return;
    addToothImplant({ ...form, toothNumber, patientId });
    setForm({ placementDate: today(), brand: '', diameter: 3.5, length: 10, torque: 35, boneGraft: false, membrane: false, abutmentDate: '', crownDate: '', stage: 'Planning', notes: '', surgeon: '' });
    setOpen(false);
  };

  return (
    <div className="space-y-3">
      {records.length === 0 && !open
        ? <SectionEmpty label="Implant" onAdd={() => setOpen(true)} />
        : (
          <>
            <div className="space-y-2">
              {records.map(r => (
                <RecordRow key={r.id} onDelete={() => deleteToothImplant(r.id)}>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium">{r.brand}</span>
                    <Badge variant="outline" className="text-xs">{r.stage}</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground flex gap-3">
                    <span>Ø {r.diameter}mm × {r.length}mm</span>
                    <span>{r.torque} Ncm</span>
                    {r.boneGraft && <span>Bone graft</span>}
                    {r.membrane && <span>Membrane</span>}
                  </div>
                  {r.notes && <p className="text-xs text-muted-foreground">{r.notes}</p>}
                  <p className="text-xs text-muted-foreground/70">{r.placementDate}{r.surgeon ? ` · ${r.surgeon}` : ''}</p>
                </RecordRow>
              ))}
            </div>
            <AddFormWrapper title="Add Implant" open={open} onToggle={() => setOpen(v => !v)} onSave={save}>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <Label className="text-xs">Brand *</Label>
                  <Input value={form.brand} onChange={e => setForm(f => ({ ...f, brand: e.target.value }))} placeholder="Straumann, Nobel, Zimmer…" className="min-h-[44px] mt-1" />
                </div>
                <div>
                  <Label className="text-xs">Diameter (mm)</Label>
                  <Input type="number" step={0.1} value={form.diameter} onChange={e => setForm(f => ({ ...f, diameter: +e.target.value }))} className="min-h-[44px] mt-1" />
                </div>
                <div>
                  <Label className="text-xs">Length (mm)</Label>
                  <Input type="number" step={0.5} value={form.length} onChange={e => setForm(f => ({ ...f, length: +e.target.value }))} className="min-h-[44px] mt-1" />
                </div>
                <div>
                  <Label className="text-xs">Torque (Ncm)</Label>
                  <Input type="number" value={form.torque} onChange={e => setForm(f => ({ ...f, torque: +e.target.value }))} className="min-h-[44px] mt-1" />
                </div>
                <div>
                  <Label className="text-xs">Stage</Label>
                  <Select value={form.stage} onValueChange={v => setForm(f => ({ ...f, stage: v as ToothImplant['stage'] }))}>
                    <SelectTrigger className="min-h-[44px] mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {['Planning', 'Placement', 'Healing', 'Abutment', 'Crown', 'Maintenance'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2 flex gap-4 py-1">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <Checkbox checked={form.boneGraft} onCheckedChange={v => setForm(f => ({ ...f, boneGraft: !!v }))} />
                    Bone Graft
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <Checkbox checked={form.membrane} onCheckedChange={v => setForm(f => ({ ...f, membrane: !!v }))} />
                    Membrane
                  </label>
                </div>
                <div>
                  <Label className="text-xs">Placement Date</Label>
                  <Input type="date" value={form.placementDate} onChange={e => setForm(f => ({ ...f, placementDate: e.target.value }))} className="min-h-[44px] mt-1" />
                </div>
                <div>
                  <Label className="text-xs">Surgeon</Label>
                  <Input value={form.surgeon} onChange={e => setForm(f => ({ ...f, surgeon: e.target.value }))} className="min-h-[44px] mt-1" />
                </div>
                <div className="col-span-2">
                  <Label className="text-xs">Notes</Label>
                  <Textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} className="mt-1" />
                </div>
              </div>
            </AddFormWrapper>
          </>
        )
      }
    </div>
  );
}

// ── Tab: Extraction ───────────────────────────────────────────────────────────
function ExtractionTab({ toothNumber, patientId }: { toothNumber: number; patientId: string }) {
  const { toothExtractions, addToothExtraction, deleteToothExtraction } = useDataStore();
  const records = toothExtractions.filter(r => r.patientId === patientId && r.toothNumber === toothNumber);

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Omit<ToothExtraction, 'id' | 'toothNumber' | 'patientId'>>({
    date: today(), reason: '', technique: 'Simple', complications: '', postOpInstructions: '', dentist: '', notes: '',
  });

  const save = () => {
    if (!form.reason.trim()) return;
    addToothExtraction({ ...form, toothNumber, patientId });
    setForm({ date: today(), reason: '', technique: 'Simple', complications: '', postOpInstructions: '', dentist: '', notes: '' });
    setOpen(false);
  };

  return (
    <div className="space-y-3">
      {records.length === 0 && !open
        ? <SectionEmpty label="Extraction" onAdd={() => setOpen(true)} />
        : (
          <>
            <div className="space-y-2">
              {records.map(r => (
                <RecordRow key={r.id} onDelete={() => deleteToothExtraction(r.id)}>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium">{r.technique} Extraction</span>
                    {r.complications && <Badge variant="destructive" className="text-xs">Complications</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground">Reason: {r.reason}</p>
                  {r.complications && <p className="text-xs text-muted-foreground">Complications: {r.complications}</p>}
                  {r.notes && <p className="text-xs text-muted-foreground">{r.notes}</p>}
                  <p className="text-xs text-muted-foreground/70">{r.date}{r.dentist ? ` · ${r.dentist}` : ''}</p>
                </RecordRow>
              ))}
            </div>
            <AddFormWrapper title="Add Extraction" open={open} onToggle={() => setOpen(v => !v)} onSave={save}>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <Label className="text-xs">Reason *</Label>
                  <Input value={form.reason} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))} placeholder="Non-restorable caries, periodontal disease…" className="min-h-[44px] mt-1" />
                </div>
                <div>
                  <Label className="text-xs">Technique</Label>
                  <Select value={form.technique} onValueChange={v => setForm(f => ({ ...f, technique: v as ToothExtraction['technique'] }))}>
                    <SelectTrigger className="min-h-[44px] mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Simple">Simple</SelectItem>
                      <SelectItem value="Surgical">Surgical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Date</Label>
                  <Input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className="min-h-[44px] mt-1" />
                </div>
                <div className="col-span-2">
                  <Label className="text-xs">Complications</Label>
                  <Input value={form.complications} onChange={e => setForm(f => ({ ...f, complications: e.target.value }))} className="min-h-[44px] mt-1" />
                </div>
                <div className="col-span-2">
                  <Label className="text-xs">Post-op Instructions</Label>
                  <Textarea value={form.postOpInstructions} onChange={e => setForm(f => ({ ...f, postOpInstructions: e.target.value }))} rows={2} className="mt-1" />
                </div>
                <div>
                  <Label className="text-xs">Dentist</Label>
                  <Input value={form.dentist} onChange={e => setForm(f => ({ ...f, dentist: e.target.value }))} className="min-h-[44px] mt-1" />
                </div>
                <div className="col-span-2">
                  <Label className="text-xs">Notes</Label>
                  <Textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} className="mt-1" />
                </div>
              </div>
            </AddFormWrapper>
          </>
        )
      }
    </div>
  );
}

// ── Tab: Periodontal ──────────────────────────────────────────────────────────
function PerioTab({ toothNumber, patientId }: { toothNumber: number; patientId: string }) {
  const { periodontalEntries, addPeriodontalEntry, deletePeriodontalEntry } = useDataStore();
  const records = periodontalEntries.filter(r => r.patientId === patientId && r.toothNumber === toothNumber);

  const [open, setOpen] = useState(false);
  const emptyPockets: [number, number, number, number, number, number] = [0, 0, 0, 0, 0, 0];
  const emptyBleeding: [boolean, boolean, boolean, boolean, boolean, boolean] = [false, false, false, false, false, false];

  const [form, setForm] = useState<Omit<PeriodontalEntry, 'id' | 'toothNumber' | 'patientId'>>({
    date: today(), pocketDepths: [...emptyPockets] as [number,number,number,number,number,number],
    bleeding: [...emptyBleeding] as [boolean,boolean,boolean,boolean,boolean,boolean],
    furcation: 'None', recession: 0, mobility: 'None', notes: '', dentist: '',
  });

  const pocketLabels = ['MB', 'B', 'DB', 'ML', 'L', 'DL'];

  const setPocket = (idx: number, val: number) =>
    setForm(f => { const p = [...f.pocketDepths] as typeof f.pocketDepths; p[idx] = val; return { ...f, pocketDepths: p }; });

  const toggleBleeding = (idx: number) =>
    setForm(f => { const b = [...f.bleeding] as typeof f.bleeding; b[idx] = !b[idx]; return { ...f, bleeding: b }; });

  const save = () => {
    addPeriodontalEntry({ ...form, toothNumber, patientId });
    setForm({ date: today(), pocketDepths: [...emptyPockets] as [number,number,number,number,number,number], bleeding: [...emptyBleeding] as [boolean,boolean,boolean,boolean,boolean,boolean], furcation: 'None', recession: 0, mobility: 'None', notes: '', dentist: '' });
    setOpen(false);
  };

  return (
    <div className="space-y-3">
      {records.length === 0 && !open
        ? <SectionEmpty label="Periodontal Entry" onAdd={() => setOpen(true)} />
        : (
          <>
            <div className="space-y-2">
              {records.map(r => (
                <RecordRow key={r.id} onDelete={() => deletePeriodontalEntry(r.id)}>
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="font-medium">Pocket depths:</span>
                    <span className="text-xs text-muted-foreground font-mono">
                      {pocketLabels.map((l, i) => `${l}:${r.pocketDepths[i]}`).join('  ')}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground flex gap-3 flex-wrap">
                    <span>Recession: {r.recession}mm</span>
                    <span>Mobility: {r.mobility}</span>
                    <span>Furcation: {r.furcation}</span>
                    {r.bleeding.some(Boolean) && <span className="text-red-600">Bleeding+</span>}
                  </div>
                  {r.notes && <p className="text-xs text-muted-foreground">{r.notes}</p>}
                  <p className="text-xs text-muted-foreground/70">{r.date}{r.dentist ? ` · ${r.dentist}` : ''}</p>
                </RecordRow>
              ))}
            </div>
            <AddFormWrapper title="Add Perio Entry" open={open} onToggle={() => setOpen(v => !v)} onSave={save}>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs mb-2 block">Pocket Depths (mm) — MB · B · DB · ML · L · DL</Label>
                  <div className="grid grid-cols-6 gap-1.5">
                    {pocketLabels.map((l, i) => (
                      <div key={l} className="flex flex-col items-center gap-1">
                        <span className="text-[10px] text-muted-foreground font-medium">{l}</span>
                        <Input
                          type="number" min={0} max={12} step={0.5}
                          value={form.pocketDepths[i]}
                          onChange={e => setPocket(i, +e.target.value)}
                          className="text-center h-10 p-1 text-sm"
                        />
                        <label className="flex flex-col items-center gap-0.5 cursor-pointer">
                          <Checkbox checked={form.bleeding[i]} onCheckedChange={() => toggleBleeding(i)} />
                          <span className="text-[9px] text-muted-foreground">BOP</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Furcation</Label>
                    <Select value={form.furcation} onValueChange={v => setForm(f => ({ ...f, furcation: v as PeriodontalEntry['furcation'] }))}>
                      <SelectTrigger className="min-h-[44px] mt-1"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {['None', 'Class I', 'Class II', 'Class III'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs">Mobility</Label>
                    <Select value={form.mobility} onValueChange={v => setForm(f => ({ ...f, mobility: v as PeriodontalEntry['mobility'] }))}>
                      <SelectTrigger className="min-h-[44px] mt-1"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {['None', 'Grade I', 'Grade II', 'Grade III'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs">Recession (mm)</Label>
                    <Input type="number" step={0.5} value={form.recession} onChange={e => setForm(f => ({ ...f, recession: +e.target.value }))} className="min-h-[44px] mt-1" />
                  </div>
                  <div>
                    <Label className="text-xs">Date</Label>
                    <Input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className="min-h-[44px] mt-1" />
                  </div>
                  <div>
                    <Label className="text-xs">Dentist</Label>
                    <Input value={form.dentist} onChange={e => setForm(f => ({ ...f, dentist: e.target.value }))} className="min-h-[44px] mt-1" />
                  </div>
                  <div className="col-span-2">
                    <Label className="text-xs">Notes</Label>
                    <Textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} className="mt-1" />
                  </div>
                </div>
              </div>
            </AddFormWrapper>
          </>
        )
      }
    </div>
  );
}

// ── Tab: Photos ───────────────────────────────────────────────────────────────
function PhotosTab({ toothNumber, patientId }: { toothNumber: number; patientId: string }) {
  const { toothPhotos, addToothPhoto, deleteToothPhoto } = useDataStore();
  const records = toothPhotos.filter(r => r.patientId === patientId && r.toothNumber === toothNumber);

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Omit<ToothPhoto, 'id' | 'toothNumber' | 'patientId'>>({
    date: today(), visitId: '', category: 'Intraoral', caption: '', notes: '',
  });

  const save = () => {
    addToothPhoto({ ...form, toothNumber, patientId });
    setForm({ date: today(), visitId: '', category: 'Intraoral', caption: '', notes: '' });
    setOpen(false);
  };

  return (
    <div className="space-y-3">
      {records.length === 0 && !open
        ? (
          <div className="text-center py-8 text-muted-foreground">
            <Camera className="h-8 w-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm mb-3">No photos on record.</p>
            <p className="text-xs text-muted-foreground/70 mb-3">File storage will be added in a future update.</p>
            <Button variant="outline" size="sm" className="min-h-[40px]" onClick={() => setOpen(true)}>
              <Plus className="h-3.5 w-3.5 mr-1.5" /> Add Photo Record
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              {records.map(r => (
                <RecordRow key={r.id} onDelete={() => deleteToothPhoto(r.id)}>
                  <div className="flex items-center gap-2">
                    <Camera className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{r.category} Photo</span>
                  </div>
                  {r.caption && <p className="text-xs text-muted-foreground">{r.caption}</p>}
                  {r.notes && <p className="text-xs text-muted-foreground">{r.notes}</p>}
                  {r.visitId && <p className="text-xs text-muted-foreground">Visit ID: {r.visitId}</p>}
                  <p className="text-xs text-muted-foreground/70">{r.date}</p>
                </RecordRow>
              ))}
            </div>
            <AddFormWrapper title="Add Photo Record" open={open} onToggle={() => setOpen(v => !v)} onSave={save}>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Category</Label>
                  <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v as ToothPhoto['category'] }))}>
                    <SelectTrigger className="min-h-[44px] mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {['Before', 'After', 'Intraoral', 'Other'].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Date</Label>
                  <Input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className="min-h-[44px] mt-1" />
                </div>
                <div>
                  <Label className="text-xs">Visit ID</Label>
                  <Input value={form.visitId} onChange={e => setForm(f => ({ ...f, visitId: e.target.value }))} placeholder="Optional" className="min-h-[44px] mt-1" />
                </div>
                <div className="col-span-2">
                  <Label className="text-xs">Caption</Label>
                  <Input value={form.caption} onChange={e => setForm(f => ({ ...f, caption: e.target.value }))} placeholder="Describe the photo" className="min-h-[44px] mt-1" />
                </div>
                <div className="col-span-2">
                  <Label className="text-xs">Notes</Label>
                  <Textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} className="mt-1" />
                </div>
              </div>
            </AddFormWrapper>
          </>
        )
      }
    </div>
  );
}

// ── Tab: Radiographs ──────────────────────────────────────────────────────────
function RadiographsTab({ toothNumber, patientId }: { toothNumber: number; patientId: string }) {
  const { toothRadiographs, addToothRadiograph, deleteToothRadiograph } = useDataStore();
  const records = toothRadiographs.filter(r => r.patientId === patientId && r.toothNumber === toothNumber);

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Omit<ToothRadiograph, 'id' | 'toothNumber' | 'patientId'>>({
    date: today(), visitId: '', type: 'Periapical', findings: '', interpretation: '',
  });

  const save = () => {
    addToothRadiograph({ ...form, toothNumber, patientId });
    setForm({ date: today(), visitId: '', type: 'Periapical', findings: '', interpretation: '' });
    setOpen(false);
  };

  return (
    <div className="space-y-3">
      {records.length === 0 && !open
        ? (
          <div className="text-center py-8 text-muted-foreground">
            <ScanLine className="h-8 w-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm mb-3">No radiographs on record.</p>
            <p className="text-xs text-muted-foreground/70 mb-3">File storage will be added in a future update.</p>
            <Button variant="outline" size="sm" className="min-h-[40px]" onClick={() => setOpen(true)}>
              <Plus className="h-3.5 w-3.5 mr-1.5" /> Add Radiograph
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              {records.map(r => (
                <RecordRow key={r.id} onDelete={() => deleteToothRadiograph(r.id)}>
                  <div className="flex items-center gap-2">
                    <ScanLine className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{r.type}</span>
                  </div>
                  {r.findings && <p className="text-xs text-muted-foreground">Findings: {r.findings}</p>}
                  {r.interpretation && <p className="text-xs text-muted-foreground">Interpretation: {r.interpretation}</p>}
                  {r.visitId && <p className="text-xs text-muted-foreground">Visit ID: {r.visitId}</p>}
                  <p className="text-xs text-muted-foreground/70">{r.date}</p>
                </RecordRow>
              ))}
            </div>
            <AddFormWrapper title="Add Radiograph" open={open} onToggle={() => setOpen(v => !v)} onSave={save}>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Type</Label>
                  <Select value={form.type} onValueChange={v => setForm(f => ({ ...f, type: v as ToothRadiograph['type'] }))}>
                    <SelectTrigger className="min-h-[44px] mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Periapical">Periapical</SelectItem>
                      <SelectItem value="Bitewing">Bitewing</SelectItem>
                      <SelectItem value="OPG">OPG</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Date</Label>
                  <Input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className="min-h-[44px] mt-1" />
                </div>
                <div>
                  <Label className="text-xs">Visit ID</Label>
                  <Input value={form.visitId} onChange={e => setForm(f => ({ ...f, visitId: e.target.value }))} placeholder="Optional" className="min-h-[44px] mt-1" />
                </div>
                <div className="col-span-2">
                  <Label className="text-xs">Findings</Label>
                  <Textarea value={form.findings} onChange={e => setForm(f => ({ ...f, findings: e.target.value }))} rows={2} className="mt-1" />
                </div>
                <div className="col-span-2">
                  <Label className="text-xs">Interpretation</Label>
                  <Textarea value={form.interpretation} onChange={e => setForm(f => ({ ...f, interpretation: e.target.value }))} rows={2} className="mt-1" />
                </div>
              </div>
            </AddFormWrapper>
          </>
        )
      }
    </div>
  );
}

// ── Tab: Unified chronological timeline ───────────────────────────────────────
function TimelineTab({ toothNumber, patientId }: { toothNumber: number; patientId: string }) {
  const {
    toothDiagnoses, toothTreatments, toothPhotos, toothRadiographs, periodontalEntries,
  } = useDataStore();

  const events = [
    ...toothDiagnoses.filter(r => r.patientId === patientId && r.toothNumber === toothNumber)
      .map(r => ({ id: r.id, date: r.date, kind: 'Diagnosis', title: r.diagnosis, notes: r.notes, meta: `${r.status} · ${r.severity}` })),
    ...toothTreatments.filter(r => r.patientId === patientId && r.toothNumber === toothNumber)
      .map(r => ({ id: r.id, date: r.date, kind: 'Treatment', title: r.procedure, notes: r.notes, meta: `${r.treatmentType} · ${r.status}` })),
    ...toothPhotos.filter(r => r.patientId === patientId && r.toothNumber === toothNumber)
      .map(r => ({ id: r.id, date: r.date, kind: 'Photo', title: r.caption || `${r.category} photo`, notes: r.notes, meta: r.visitId ? `Visit ${r.visitId}` : r.category })),
    ...toothRadiographs.filter(r => r.patientId === patientId && r.toothNumber === toothNumber)
      .map(r => ({ id: r.id, date: r.date, kind: 'Radiograph', title: r.type, notes: r.interpretation || r.findings, meta: r.visitId ? `Visit ${r.visitId}` : '' })),
    ...periodontalEntries.filter(r => r.patientId === patientId && r.toothNumber === toothNumber)
      .map(r => ({ id: r.id, date: r.date, kind: 'Periodontal', title: 'Periodontal assessment', notes: r.notes, meta: `Mobility ${r.mobility} · Furcation ${r.furcation}` })),
  ].sort((a, b) => b.date.localeCompare(a.date));

  const iconFor = (kind: string) => {
    if (kind === 'Diagnosis') return <Stethoscope className="h-4 w-4" />;
    if (kind === 'Treatment') return <Wrench className="h-4 w-4" />;
    if (kind === 'Photo') return <Camera className="h-4 w-4" />;
    if (kind === 'Radiograph') return <ScanLine className="h-4 w-4" />;
    return <Activity className="h-4 w-4" />;
  };

  if (events.length === 0) {
    return <SectionEmpty label="Timeline Event" onAdd={() => undefined} />;
  }

  return (
    <div className="relative space-y-3">
      <div className="absolute left-5 top-2 bottom-2 w-px bg-border" />
      {events.map(event => (
        <div key={`${event.kind}-${event.id}`} className="relative flex gap-3">
          <div className="z-10 h-10 w-10 rounded-full border bg-card flex items-center justify-center text-primary shrink-0">
            {iconFor(event.kind)}
          </div>
          <div className="flex-1 border rounded-lg p-3 bg-muted/10">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-medium text-sm">{event.title}</p>
                <p className="text-xs text-muted-foreground">{event.kind} · {event.date}</p>
              </div>
              {event.meta && <Badge variant="outline" className="text-[10px] shrink-0">{event.meta}</Badge>}
            </div>
            {event.notes && <p className="text-xs text-muted-foreground mt-2">{event.notes}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Tab Config ────────────────────────────────────────────────────────────────
const TABS = [
  { value: 'overview',    label: 'Overview',    Icon: Stethoscope },
  { value: 'timeline',    label: 'Timeline',    Icon: Activity },
  { value: 'diagnosis',   label: 'Diagnosis',   Icon: Stethoscope },
  { value: 'treatments',  label: 'Treatments',  Icon: Wrench },
  { value: 'restorations',label: 'Restorations',Icon: Layers },
  { value: 'rct',         label: 'Root Canal',  Icon: Zap },
  { value: 'crown',       label: 'Crown',       Icon: CrownIcon },
  { value: 'implant',     label: 'Implant',     Icon: Anchor },
  { value: 'extraction',  label: 'Extraction',  Icon: Scissors },
  { value: 'perio',       label: 'Periodontal', Icon: Activity },
  { value: 'photos',      label: 'Photos',      Icon: Camera },
  { value: 'radiographs', label: 'X-rays',      Icon: ScanLine },
];

// ── Main Sheet ────────────────────────────────────────────────────────────────
export function OdontogramToothSheet({
  open,
  onOpenChange,
  toothNumber,
  toothName,
  patientId,
  currentStatus,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  toothNumber: number;
  toothName: string;
  patientId: string;
  currentStatus: ToothStatus;
}) {
  const cfg = TOOTH_STATUS_CONFIG[currentStatus];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-2xl flex flex-col p-0 overflow-hidden"
      >
        {/* Fixed header */}
        <SheetHeader className="px-5 py-4 border-b bg-card shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <SheetTitle className="text-xl leading-tight">
                Tooth {toothNumber}
              </SheetTitle>
              <p className="text-sm text-muted-foreground mt-0.5">{toothName}</p>
            </div>
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border shrink-0"
              style={{ backgroundColor: cfg.fill, borderColor: cfg.stroke, color: cfg.stroke }}
            >
              <span
                className="w-2.5 h-2.5 rounded-sm"
                style={{ backgroundColor: cfg.centerFill, border: `1px solid ${cfg.stroke}` }}
              />
              {cfg.label}
            </div>
          </div>
        </SheetHeader>

        {/* Scrollable tab content */}
        <Tabs defaultValue="overview" className="flex-1 flex flex-col min-h-0">
          {/* Tab strip — horizontally scrollable */}
          <div className="border-b bg-muted/20 shrink-0 overflow-x-auto">
            <TabsList className="h-auto p-0 bg-transparent rounded-none inline-flex min-w-full">
              {TABS.map(({ value, label, Icon }) => (
                <TabsTrigger
                  key={value}
                  value={value}
                  className="
                    flex flex-col items-center gap-1 px-3 py-2.5 min-h-[60px] min-w-[64px]
                    rounded-none border-b-2 border-transparent
                    text-xs font-medium text-muted-foreground
                    data-[state=active]:border-primary data-[state=active]:text-primary
                    data-[state=active]:bg-primary/5
                    hover:text-foreground hover:bg-muted/40
                    transition-colors whitespace-nowrap
                  "
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Tab bodies */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-5">
              <TabsContent value="overview" className="m-0 focus-visible:outline-none">
                <OverviewTab toothNumber={toothNumber} patientId={patientId} currentStatus={currentStatus} />
              </TabsContent>
              <TabsContent value="timeline" className="m-0 focus-visible:outline-none">
                <TimelineTab toothNumber={toothNumber} patientId={patientId} />
              </TabsContent>
              <TabsContent value="diagnosis" className="m-0 focus-visible:outline-none">
                <DiagnosisTab toothNumber={toothNumber} patientId={patientId} />
              </TabsContent>
              <TabsContent value="treatments" className="m-0 focus-visible:outline-none">
                <TreatmentsTab toothNumber={toothNumber} patientId={patientId} />
              </TabsContent>
              <TabsContent value="restorations" className="m-0 focus-visible:outline-none">
                <RestorationsTab toothNumber={toothNumber} patientId={patientId} />
              </TabsContent>
              <TabsContent value="rct" className="m-0 focus-visible:outline-none">
                <RCTTab toothNumber={toothNumber} patientId={patientId} />
              </TabsContent>
              <TabsContent value="crown" className="m-0 focus-visible:outline-none">
                <CrownTab toothNumber={toothNumber} patientId={patientId} />
              </TabsContent>
              <TabsContent value="implant" className="m-0 focus-visible:outline-none">
                <ImplantTab toothNumber={toothNumber} patientId={patientId} />
              </TabsContent>
              <TabsContent value="extraction" className="m-0 focus-visible:outline-none">
                <ExtractionTab toothNumber={toothNumber} patientId={patientId} />
              </TabsContent>
              <TabsContent value="perio" className="m-0 focus-visible:outline-none">
                <PerioTab toothNumber={toothNumber} patientId={patientId} />
              </TabsContent>
              <TabsContent value="photos" className="m-0 focus-visible:outline-none">
                <PhotosTab toothNumber={toothNumber} patientId={patientId} />
              </TabsContent>
              <TabsContent value="radiographs" className="m-0 focus-visible:outline-none">
                <RadiographsTab toothNumber={toothNumber} patientId={patientId} />
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
