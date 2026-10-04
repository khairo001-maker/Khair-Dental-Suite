import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import {
  Patient,
  ClinicalCase,
  EndoCase,
  ImplantCase,
  ProsthodonticCase,
  RadiologyEntry,
  PhotoEntry,
  OdontogramChart,
  Visit,
  TreatmentPlanItem,
  FinancialRecord,
  PatientDocument,
  // New odontogram types
  ToothRecord,
  ToothStatus,
  ToothDiagnosis,
  ToothTreatment,
  ToothRestoration,
  RootCanalTreatment,
  ToothCrown,
  ToothImplant,
  ToothExtraction,
  PeriodontalEntry,
  ToothPhoto,
  ToothRadiograph,
  VisitDiagnosis,
  VisitProcedure,
  VisitAttachment,
  VisitRadiograph,
  Payment,
  PaymentAllocation,
} from '../types';
import { repositories } from "@/db/repository";
import { db } from "@/db/schema";
import { patientService } from "@/db/services";

interface DataStoreContextType {
  // ── Patients ─────────────────────────────────────────────
  patients: Patient[];
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>;
  addPatient: (patient: Omit<Patient, 'id'>) => void;
  updatePatient: (id: string, updates: Partial<Patient>) => void;

  // ── Visits ────────────────────────────────────────────────
  visits: Visit[];
  addVisit: (v: Omit<Visit, 'id'>) => string;
  updateVisit: (id: string, v: Partial<Visit>) => void;
  deleteVisit: (id: string) => void;
  visitDiagnoses: VisitDiagnosis[];
  addVisitDiagnosis: (d: Omit<VisitDiagnosis, 'id'>) => string;
  updateVisitDiagnosis: (id: string, updates: Partial<VisitDiagnosis>) => void;
  deleteVisitDiagnosis: (id: string) => void;
  visitProcedures: VisitProcedure[];
  addVisitProcedure: (p: Omit<VisitProcedure, 'id'>) => string;
  updateVisitProcedure: (id: string, updates: Partial<VisitProcedure>) => void;
  deleteVisitProcedure: (id: string) => void;
  visitAttachments: VisitAttachment[];
  addVisitAttachment: (a: Omit<VisitAttachment, 'id'>) => string;
  visitRadiographs: VisitRadiograph[];
  addVisitRadiograph: (r: Omit<VisitRadiograph, 'id'>) => string;

  // ── Treatment Plan ─────────────────────────────────────────
  treatmentPlanItems: TreatmentPlanItem[];
  addTreatmentPlanItem: (item: Omit<TreatmentPlanItem, 'id'>) => void;
  updateTreatmentPlanItem: (id: string, item: Partial<TreatmentPlanItem>) => void;
  deleteTreatmentPlanItem: (id: string) => void;

  // ── Financial ─────────────────────────────────────────────
  financialRecords: FinancialRecord[];
  addFinancialRecord: (r: Omit<FinancialRecord, 'id'>) => void;
  updateFinancialRecord: (id: string, r: Partial<FinancialRecord>) => void;
  deleteFinancialRecord: (id: string) => void;
  payments: Payment[];
  addPayment: (p: Omit<Payment, 'id'>) => string;
  updatePayment: (id: string, updates: Partial<Payment>) => void;
  deletePayment: (id: string) => void;
  paymentAllocations: PaymentAllocation[];
  addPaymentAllocation: (a: Omit<PaymentAllocation, 'id'>) => string;

  // ── Documents ─────────────────────────────────────────────
  patientDocuments: PatientDocument[];
  addPatientDocument: (d: Omit<PatientDocument, 'id'>) => void;
  deletePatientDocument: (id: string) => void;

  // ── Clinical Cases ────────────────────────────────────────
  clinicalCases: ClinicalCase[];
  addClinicalCase: (c: Omit<ClinicalCase, 'id'>) => void;

  // ── Specialty Cases ───────────────────────────────────────
  endoCases: EndoCase[];
  addEndoCase: (c: Omit<EndoCase, 'id'>) => void;
  implantCases: ImplantCase[];
  addImplantCase: (c: Omit<ImplantCase, 'id'>) => void;
  prosthodonticCases: ProsthodonticCase[];
  addProsthodonticCase: (c: Omit<ProsthodonticCase, 'id'>) => void;

  // ── Radiology & Photos (global) ───────────────────────────
  radiologyEntries: RadiologyEntry[];
  addRadiologyEntry: (r: Omit<RadiologyEntry, 'id'>) => void;
  photoEntries: PhotoEntry[];
  addPhotoEntry: (p: Omit<PhotoEntry, 'id'>) => void;

  // ── Legacy Odontogram ─────────────────────────────────────
  odontogramCharts: OdontogramChart[];
  saveOdontogramChart: (chart: OdontogramChart) => void;

  // ── Interactive Odontogram ────────────────────────────────
  /** Per-tooth status records — one per (patientId, toothNumber) */
  toothRecords: ToothRecord[];
  setToothStatus: (patientId: string, toothNumber: number, status: ToothStatus) => Promise<void>;
  getToothRecord: (patientId: string, toothNumber: number) => ToothRecord | undefined;

  toothDiagnoses: ToothDiagnosis[];
  addToothDiagnosis: (d: Omit<ToothDiagnosis, 'id'>) => void;
  deleteToothDiagnosis: (id: string) => void;

  toothTreatments: ToothTreatment[];
  addToothTreatment: (t: Omit<ToothTreatment, 'id'>) => void;
  deleteToothTreatment: (id: string) => void;

  toothRestorations: ToothRestoration[];
  addToothRestoration: (r: Omit<ToothRestoration, 'id'>) => void;
  deleteToothRestoration: (id: string) => void;

  rootCanalTreatments: RootCanalTreatment[];
  addRootCanalTreatment: (r: Omit<RootCanalTreatment, 'id'>) => void;
  deleteRootCanalTreatment: (id: string) => void;

  toothCrowns: ToothCrown[];
  addToothCrown: (c: Omit<ToothCrown, 'id'>) => void;
  deleteToothCrown: (id: string) => void;

  toothImplants: ToothImplant[];
  addToothImplant: (i: Omit<ToothImplant, 'id'>) => void;
  deleteToothImplant: (id: string) => void;

  toothExtractions: ToothExtraction[];
  addToothExtraction: (e: Omit<ToothExtraction, 'id'>) => void;
  deleteToothExtraction: (id: string) => void;

  periodontalEntries: PeriodontalEntry[];
  addPeriodontalEntry: (e: Omit<PeriodontalEntry, 'id'>) => void;
  deletePeriodontalEntry: (id: string) => void;

  toothPhotos: ToothPhoto[];
  addToothPhoto: (p: Omit<ToothPhoto, 'id'>) => void;
  deleteToothPhoto: (id: string) => void;

  toothRadiographs: ToothRadiograph[];
  addToothRadiograph: (r: Omit<ToothRadiograph, 'id'>) => void;
  deleteToothRadiograph: (id: string) => void;
}

const DataStoreContext = createContext<DataStoreContextType | null>(null);

function mergeHydratedRecords<T extends { id?: string }>(stored: T[], current: T[]): T[] {
  const records = new Map<string, T>();
  stored.forEach((record, index) => records.set(record.id ?? `stored:${index}`, record));
  current.forEach((record, index) => records.set(record.id ?? `current:${index}`, record));
  return [...records.values()];
}

export const useDataStore = () => {
  const ctx = useContext(DataStoreContext);
  if (!ctx) throw new Error('useDataStore must be used within DataStoreProvider');
  return ctx;
};

export function DataStoreProvider({ children }: { children: React.ReactNode }) {
  const generateId = () => crypto.randomUUID();
  const now = () => new Date().toISOString();
  const hydrated = useRef(false);
  const persistRecord = (
    repository: { put: (record: any) => Promise<unknown> },
    record: Record<string, any>,
  ) => {
    const timestamp = now();
    persist(repository.put({
      ...record,
      createdAt: record.createdAt ?? timestamp,
      updatedAt: timestamp,
    }));
  };
  const softDeleteRecord = (
    repository: { softDelete: (id: string) => Promise<unknown> },
    id: string,
  ) => persist(repository.softDelete(id));

  // ── Core patient state ──────────────────────────────────
  const [patients, setPatients] = useState<Patient[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [visitDiagnoses, setVisitDiagnoses] = useState<VisitDiagnosis[]>([]);
  const [visitProcedures, setVisitProcedures] = useState<VisitProcedure[]>([]);
  const [visitAttachments, setVisitAttachments] = useState<VisitAttachment[]>([]);
  const [visitRadiographs, setVisitRadiographs] = useState<VisitRadiograph[]>([]);
  const [treatmentPlanItems, setTreatmentPlanItems] = useState<TreatmentPlanItem[]>([]);
  const [financialRecords, setFinancialRecords] = useState<FinancialRecord[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [paymentAllocations, setPaymentAllocations] = useState<PaymentAllocation[]>([]);
  const [patientDocuments, setPatientDocuments] = useState<PatientDocument[]>([]);

  // ── Clinical ────────────────────────────────────────────
  const [clinicalCases, setClinicalCases] = useState<ClinicalCase[]>([]);
  const [endoCases, setEndoCases] = useState<EndoCase[]>([]);
  const [implantCases, setImplantCases] = useState<ImplantCase[]>([]);
  const [prosthodonticCases, setProsthodonticCases] = useState<ProsthodonticCase[]>([]);
  const [radiologyEntries, setRadiologyEntries] = useState<RadiologyEntry[]>([]);
  const [photoEntries, setPhotoEntries] = useState<PhotoEntry[]>([]);
  const [odontogramCharts, setOdontogramCharts] = useState<OdontogramChart[]>([]);

  // ── Interactive Odontogram ──────────────────────────────
  const [toothRecords, setToothRecords] = useState<ToothRecord[]>([]);
  const [toothDiagnoses, setToothDiagnoses] = useState<ToothDiagnosis[]>([]);
  const [toothTreatments, setToothTreatments] = useState<ToothTreatment[]>([]);
  const [toothRestorations, setToothRestorations] = useState<ToothRestoration[]>([]);
  const [rootCanalTreatments, setRootCanalTreatments] = useState<RootCanalTreatment[]>([]);
  const [toothCrowns, setToothCrowns] = useState<ToothCrown[]>([]);
  const [toothImplants, setToothImplants] = useState<ToothImplant[]>([]);
  const [toothExtractions, setToothExtractions] = useState<ToothExtraction[]>([]);
  const [periodontalEntries, setPeriodontalEntries] = useState<PeriodontalEntry[]>([]);
  const [toothPhotos, setToothPhotos] = useState<ToothPhoto[]>([]);
  const [toothRadiographs, setToothRadiographs] = useState<ToothRadiograph[]>([]);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      repositories.patients.list(),
      repositories.visits.list(),
      repositories.treatmentPlans.list(),
      repositories.financialRecords.list(),
      repositories.payments.list(),
      repositories.documents.list(),
      repositories.clinicalPhotos.list(),
      repositories.radiographs.list(),
      repositories.odontogramRecords.list(),
      repositories.odontogramCharts.list(),
      repositories.visitDiagnoses.list(),
      repositories.visitProcedures.list(),
      repositories.visitAttachments.list(),
      repositories.visitRadiographs.list(),
      repositories.paymentAllocations.list(),
      repositories.toothDiagnoses.list(),
      repositories.toothTreatments.list(),
      repositories.toothRestorations.list(),
      repositories.rootCanalTreatments.list(),
      repositories.toothCrowns.list(),
      repositories.toothImplants.list(),
      repositories.toothExtractions.list(),
      repositories.periodontalEntries.list(),
    ]).then(([
      storedPatients, storedVisits, storedPlans, storedFinancial, storedPayments,
      storedDocuments, storedPhotos, storedRadiographs, storedOdontogram,
      storedCharts, storedVisitDiagnoses, storedVisitProcedures, storedVisitAttachments,
      storedVisitRadiographs, storedPaymentAllocations, storedToothDiagnoses,
      storedToothTreatments, storedToothRestorations, storedRootCanalTreatments,
      storedToothCrowns, storedToothImplants, storedToothExtractions, storedPeriodontalEntries,
    ]) => {
      if (cancelled) return;
      setPatients(current => mergeHydratedRecords(storedPatients as Patient[], current));
      setVisits(current => mergeHydratedRecords(storedVisits as Visit[], current));
      setTreatmentPlanItems(current => mergeHydratedRecords(storedPlans as TreatmentPlanItem[], current));
      setFinancialRecords(current => mergeHydratedRecords(storedFinancial as FinancialRecord[], current));
      setPayments(current => mergeHydratedRecords(storedPayments as Payment[], current));
      setPatientDocuments(current => mergeHydratedRecords(storedDocuments as PatientDocument[], current));
      setToothPhotos(current => mergeHydratedRecords(storedPhotos as ToothPhoto[], current));
      setToothRadiographs(current => mergeHydratedRecords(storedRadiographs as ToothRadiograph[], current));
      setToothRecords(current => {
        const merged = mergeHydratedRecords(storedOdontogram as ToothRecord[], current);
        const byTooth = new Map<string, ToothRecord>();
        for (const record of merged) {
          const key = `${record.patientId}:${record.toothNumber}`;
          const previous = byTooth.get(key);
          if (!previous || (record.lastUpdated || "").localeCompare(previous.lastUpdated || "") > 0) byTooth.set(key, record);
        }
        return [...byTooth.values()];
      });
      setOdontogramCharts(current => mergeHydratedRecords(storedCharts as OdontogramChart[], current));
      setVisitDiagnoses(current => mergeHydratedRecords(storedVisitDiagnoses as VisitDiagnosis[], current));
      setVisitProcedures(current => mergeHydratedRecords(storedVisitProcedures as VisitProcedure[], current));
      setVisitAttachments(current => mergeHydratedRecords(storedVisitAttachments as VisitAttachment[], current));
      setVisitRadiographs(current => mergeHydratedRecords(storedVisitRadiographs as VisitRadiograph[], current));
      setPaymentAllocations(current => mergeHydratedRecords(storedPaymentAllocations as PaymentAllocation[], current));
      setToothDiagnoses(current => mergeHydratedRecords(storedToothDiagnoses as ToothDiagnosis[], current));
      setToothTreatments(current => mergeHydratedRecords(storedToothTreatments as ToothTreatment[], current));
      setToothRestorations(current => mergeHydratedRecords(storedToothRestorations as ToothRestoration[], current));
      setRootCanalTreatments(current => mergeHydratedRecords(storedRootCanalTreatments as RootCanalTreatment[], current));
      setToothCrowns(current => mergeHydratedRecords(storedToothCrowns as ToothCrown[], current));
      setToothImplants(current => mergeHydratedRecords(storedToothImplants as ToothImplant[], current));
      setToothExtractions(current => mergeHydratedRecords(storedToothExtractions as ToothExtraction[], current));
      setPeriodontalEntries(current => mergeHydratedRecords(storedPeriodontalEntries as PeriodontalEntry[], current));
      hydrated.current = true;
    }).catch(error => console.error("Unable to hydrate local database", error));
    return () => { cancelled = true; };
  }, []);

  const persist = (task: Promise<unknown>) => {
    task.catch(error => console.error("Unable to persist local database change", error));
  };

  const setToothStatus = async (patientId: string, toothNumber: number, status: ToothStatus) => {
    const timestamp = now();
    const existing = toothRecords.find(r => r.patientId === patientId && r.toothNumber === toothNumber);
    const saved = await db.transaction("rw", db.odontogramRecords, async () => {
      const previous = await db.odontogramRecords.get([patientId, toothNumber]);
      const record = {
        id: previous?.id ?? existing?.id ?? `${patientId}:${toothNumber}`,
        patientId, toothNumber, status, lastUpdated: timestamp,
        createdAt: previous?.createdAt ?? timestamp,
        updatedAt: timestamp,
        deletedAt: undefined,
      };
      await db.odontogramRecords.put(record as any);
      return record;
    });
    setToothRecords(prev => [
      saved as ToothRecord,
      ...prev.filter(r => r.patientId !== patientId || r.toothNumber !== toothNumber),
    ]);
  };

  const getToothRecord = (patientId: string, toothNumber: number) =>
    toothRecords.find(r => r.patientId === patientId && r.toothNumber === toothNumber);

  return (
    <DataStoreContext.Provider
      value={{
        // Patients
        patients,
        setPatients,
        addPatient: (p) => {
          const id = generateId();
          const timestamp = now();
          const record = { ...p, id, createdAt: timestamp, updatedAt: timestamp };
          setPatients(prev => [...prev, record]);
          patientService.create(p, id).then(saved => {
            setPatients(prev => prev.map(patient => patient.id === id ? { ...patient, patientNumber: saved.patientNumber, createdAt: saved.createdAt, updatedAt: saved.updatedAt } : patient));
          }).catch(error => {
            console.error("Unable to create patient in local database", error);
            setPatients(prev => prev.filter(patient => patient.id !== id));
          });
        },
        updatePatient: (id, updates) => {
          setPatients(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
          persist(repositories.patients.update(id, updates));
        },

        // Visits
        visits,
        addVisit: (v) => { const id = generateId(); const timestamp = now(); const record = { ...v, id, createdAt: timestamp, updatedAt: timestamp }; setVisits(prev => [...prev, record]); persist(repositories.visits.put(record)); return id; },
        updateVisit: (id, updates) => { setVisits(prev => prev.map(v => v.id === id ? { ...v, ...updates, updatedAt: now() } : v)); persist(repositories.visits.update(id, updates)); },
        deleteVisit: (id) => { const updates = { deletedAt: now(), status: 'Cancelled' as const }; setVisits(prev => prev.map(v => v.id === id ? { ...v, ...updates, updatedAt: now() } : v)); persist(repositories.visits.update(id, updates)); },
        visitDiagnoses,
        addVisitDiagnosis: (d) => { const id = generateId(); const record = { ...d, id }; setVisitDiagnoses(prev => [...prev, record]); persistRecord(repositories.visitDiagnoses, record); return id; },
        updateVisitDiagnosis: (id, updates) => { const updatedAt = now(); setVisitDiagnoses(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d)); persist(repositories.visitDiagnoses.update(id, { ...updates, updatedAt })); },
        deleteVisitDiagnosis: (id) => { setVisitDiagnoses(prev => prev.filter(d => d.id !== id)); softDeleteRecord(repositories.visitDiagnoses, id); },
        visitProcedures,
        addVisitProcedure: (p) => { const id = generateId(); const record = { ...p, id }; setVisitProcedures(prev => [...prev, record]); persistRecord(repositories.visitProcedures, record); return id; },
        updateVisitProcedure: (id, updates) => { const updatedAt = now(); setVisitProcedures(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p)); persist(repositories.visitProcedures.update(id, { ...updates, updatedAt })); },
        deleteVisitProcedure: (id) => { setVisitProcedures(prev => prev.filter(p => p.id !== id)); softDeleteRecord(repositories.visitProcedures, id); },
        visitAttachments,
        addVisitAttachment: (a) => { const id = generateId(); const record = { ...a, id }; setVisitAttachments(prev => [...prev, record]); persistRecord(repositories.visitAttachments, record); return id; },
        visitRadiographs,
        addVisitRadiograph: (r) => { const id = generateId(); const record = { ...r, id }; setVisitRadiographs(prev => [...prev, record]); persistRecord(repositories.visitRadiographs, record); return id; },

        // Treatment Plan
        treatmentPlanItems,
        addTreatmentPlanItem: (item) => { const id = generateId(); const timestamp = now(); const record = { ...item, id, createdAt: item.createdAt ?? timestamp, updatedAt: timestamp }; setTreatmentPlanItems(prev => [...prev, record]); persist(repositories.treatmentPlans.put(record as any)); },
        updateTreatmentPlanItem: (id, updates) => { setTreatmentPlanItems(prev => prev.map(i => i.id === id ? { ...i, ...updates, updatedAt: now() } : i)); persist(repositories.treatmentPlans.update(id, updates)); },
        deleteTreatmentPlanItem: (id) => { const updates = { deletedAt: now() }; setTreatmentPlanItems(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i)); persist(repositories.treatmentPlans.update(id, updates)); },

        // Financial
        financialRecords,
        addFinancialRecord: (r) => { const id = generateId(); const timestamp = now(); const record = { ...r, id, createdAt: timestamp, updatedAt: timestamp }; setFinancialRecords(prev => [...prev, record]); persist(repositories.financialRecords.put(record)); },
        updateFinancialRecord: (id, updates) => { setFinancialRecords(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r)); persist(repositories.financialRecords.update(id, updates)); },
        deleteFinancialRecord: (id) => { const updates = { deletedAt: now() }; setFinancialRecords(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r)); persist(repositories.financialRecords.update(id, updates)); },
        payments,
        addPayment: (p) => { const id = generateId(); const timestamp = now(); const record = { ...p, id, createdAt: p.createdAt ?? timestamp, updatedAt: timestamp }; setPayments(prev => [...prev, record]); persist(repositories.payments.put(record)); return id; },
        updatePayment: (id, updates) => { setPayments(prev => prev.map(p => p.id === id ? { ...p, ...updates, updatedAt: now() } : p)); persist(repositories.payments.update(id, updates)); },
        deletePayment: (id) => { const updates = { deletedAt: now() }; setPayments(prev => prev.map(p => p.id === id ? { ...p, ...updates, updatedAt: now() } : p)); persist(repositories.payments.update(id, updates)); },
        paymentAllocations,
        addPaymentAllocation: (a) => { const id = generateId(); const record = { ...a, id }; setPaymentAllocations(prev => [...prev, record]); persistRecord(repositories.paymentAllocations, record); return id; },

        // Documents
        patientDocuments,
        addPatientDocument: (d) => { const id = generateId(); const timestamp = now(); const record = { ...d, id, createdAt: timestamp, updatedAt: timestamp }; setPatientDocuments(prev => [...prev, record]); persist(repositories.documents.put(record)); },
        deletePatientDocument: (id) => { const updates = { deletedAt: now() }; setPatientDocuments(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d)); persist(repositories.documents.update(id, updates)); },

        // Clinical
        clinicalCases,
        addClinicalCase: (c) => setClinicalCases(prev => [...prev, { ...c, id: generateId() }]),
        endoCases,
        addEndoCase: (c) => setEndoCases(prev => [...prev, { ...c, id: generateId() }]),
        implantCases,
        addImplantCase: (c) => setImplantCases(prev => [...prev, { ...c, id: generateId() }]),
        prosthodonticCases,
        addProsthodonticCase: (c) => setProsthodonticCases(prev => [...prev, { ...c, id: generateId() }]),
        radiologyEntries,
        addRadiologyEntry: (r) => setRadiologyEntries(prev => [...prev, { ...r, id: generateId() }]),
        photoEntries,
        addPhotoEntry: (p) => setPhotoEntries(prev => [...prev, { ...p, id: generateId() }]),
        odontogramCharts,
        saveOdontogramChart: (chart) => {
          setOdontogramCharts(prev => {
            const idx = prev.findIndex(c => c.id === chart.id);
            if (idx >= 0) { const u = [...prev]; u[idx] = chart; return u; }
            return [...prev, chart];
          });
          persistRecord(repositories.odontogramCharts, chart);
        },

        // Interactive Odontogram
        toothRecords,
        setToothStatus,
        getToothRecord,

        toothDiagnoses,
        addToothDiagnosis: (d) => { const record = { ...d, id: generateId() }; setToothDiagnoses(prev => [...prev, record]); persistRecord(repositories.toothDiagnoses, record); },
        deleteToothDiagnosis: (id) => { setToothDiagnoses(prev => prev.filter(d => d.id !== id)); softDeleteRecord(repositories.toothDiagnoses, id); },

        toothTreatments,
        addToothTreatment: (t) => { const record = { ...t, id: generateId() }; setToothTreatments(prev => [...prev, record]); persistRecord(repositories.toothTreatments, record); },
        deleteToothTreatment: (id) => { setToothTreatments(prev => prev.filter(t => t.id !== id)); softDeleteRecord(repositories.toothTreatments, id); },

        toothRestorations,
        addToothRestoration: (r) => { const record = { ...r, id: generateId() }; setToothRestorations(prev => [...prev, record]); persistRecord(repositories.toothRestorations, record); },
        deleteToothRestoration: (id) => { setToothRestorations(prev => prev.filter(r => r.id !== id)); softDeleteRecord(repositories.toothRestorations, id); },

        rootCanalTreatments,
        addRootCanalTreatment: (r) => { const record = { ...r, id: generateId() }; setRootCanalTreatments(prev => [...prev, record]); persistRecord(repositories.rootCanalTreatments, record); },
        deleteRootCanalTreatment: (id) => { setRootCanalTreatments(prev => prev.filter(r => r.id !== id)); softDeleteRecord(repositories.rootCanalTreatments, id); },

        toothCrowns,
        addToothCrown: (c) => { const record = { ...c, id: generateId() }; setToothCrowns(prev => [...prev, record]); persistRecord(repositories.toothCrowns, record); },
        deleteToothCrown: (id) => { setToothCrowns(prev => prev.filter(c => c.id !== id)); softDeleteRecord(repositories.toothCrowns, id); },

        toothImplants,
        addToothImplant: (i) => { const record = { ...i, id: generateId() }; setToothImplants(prev => [...prev, record]); persistRecord(repositories.toothImplants, record); },
        deleteToothImplant: (id) => { setToothImplants(prev => prev.filter(i => i.id !== id)); softDeleteRecord(repositories.toothImplants, id); },

        toothExtractions,
        addToothExtraction: (e) => { const record = { ...e, id: generateId() }; setToothExtractions(prev => [...prev, record]); persistRecord(repositories.toothExtractions, record); },
        deleteToothExtraction: (id) => { setToothExtractions(prev => prev.filter(e => e.id !== id)); softDeleteRecord(repositories.toothExtractions, id); },

        periodontalEntries,
        addPeriodontalEntry: (e) => { const record = { ...e, id: generateId() }; setPeriodontalEntries(prev => [...prev, record]); persistRecord(repositories.periodontalEntries, record); },
        deletePeriodontalEntry: (id) => { setPeriodontalEntries(prev => prev.filter(e => e.id !== id)); softDeleteRecord(repositories.periodontalEntries, id); },

        toothPhotos,
        addToothPhoto: (p) => { const record = { ...p, id: generateId() }; setToothPhotos(prev => [...prev, record]); persistRecord(repositories.clinicalPhotos, record); },
        deleteToothPhoto: (id) => { setToothPhotos(prev => prev.filter(p => p.id !== id)); softDeleteRecord(repositories.clinicalPhotos, id); },

        toothRadiographs,
        addToothRadiograph: (r) => { const record = { ...r, id: generateId() }; setToothRadiographs(prev => [...prev, record]); persistRecord(repositories.radiographs, record); },
        deleteToothRadiograph: (id) => { setToothRadiographs(prev => prev.filter(r => r.id !== id)); softDeleteRecord(repositories.radiographs, id); },
      }}
    >
      {children}
    </DataStoreContext.Provider>
  );
}
