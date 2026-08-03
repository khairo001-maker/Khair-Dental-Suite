import React, { createContext, useContext, useState } from 'react';
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
  PatientDocument
} from '../types';

interface DataStoreContextType {
  patients: Patient[];
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>;
  addPatient: (patient: Omit<Patient, 'id'>) => void;
  updatePatient: (id: string, updates: Partial<Patient>) => void;
  visits: Visit[];
  addVisit: (v: Omit<Visit, 'id'>) => void;
  updateVisit: (id: string, v: Partial<Visit>) => void;
  deleteVisit: (id: string) => void;
  treatmentPlanItems: TreatmentPlanItem[];
  addTreatmentPlanItem: (item: Omit<TreatmentPlanItem, 'id'>) => void;
  updateTreatmentPlanItem: (id: string, item: Partial<TreatmentPlanItem>) => void;
  deleteTreatmentPlanItem: (id: string) => void;
  financialRecords: FinancialRecord[];
  addFinancialRecord: (r: Omit<FinancialRecord, 'id'>) => void;
  updateFinancialRecord: (id: string, r: Partial<FinancialRecord>) => void;
  deleteFinancialRecord: (id: string) => void;
  patientDocuments: PatientDocument[];
  addPatientDocument: (d: Omit<PatientDocument, 'id'>) => void;
  deletePatientDocument: (id: string) => void;
  clinicalCases: ClinicalCase[];
  addClinicalCase: (c: Omit<ClinicalCase, 'id'>) => void;
  endoCases: EndoCase[];
  addEndoCase: (c: Omit<EndoCase, 'id'>) => void;
  implantCases: ImplantCase[];
  addImplantCase: (c: Omit<ImplantCase, 'id'>) => void;
  prosthodonticCases: ProsthodonticCase[];
  addProsthodonticCase: (c: Omit<ProsthodonticCase, 'id'>) => void;
  radiologyEntries: RadiologyEntry[];
  addRadiologyEntry: (r: Omit<RadiologyEntry, 'id'>) => void;
  photoEntries: PhotoEntry[];
  addPhotoEntry: (p: Omit<PhotoEntry, 'id'>) => void;
  odontogramCharts: OdontogramChart[];
  saveOdontogramChart: (chart: OdontogramChart) => void;
}

const DataStoreContext = createContext<DataStoreContextType | null>(null);

export const useDataStore = () => {
  const ctx = useContext(DataStoreContext);
  if (!ctx) throw new Error('useDataStore must be used within DataStoreProvider');
  return ctx;
};

export function DataStoreProvider({ children }: { children: React.ReactNode }) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [treatmentPlanItems, setTreatmentPlanItems] = useState<TreatmentPlanItem[]>([]);
  const [financialRecords, setFinancialRecords] = useState<FinancialRecord[]>([]);
  const [patientDocuments, setPatientDocuments] = useState<PatientDocument[]>([]);
  const [clinicalCases, setClinicalCases] = useState<ClinicalCase[]>([]);
  const [endoCases, setEndoCases] = useState<EndoCase[]>([]);
  const [implantCases, setImplantCases] = useState<ImplantCase[]>([]);
  const [prosthodonticCases, setProsthodonticCases] = useState<ProsthodonticCase[]>([]);
  const [radiologyEntries, setRadiologyEntries] = useState<RadiologyEntry[]>([]);
  const [photoEntries, setPhotoEntries] = useState<PhotoEntry[]>([]);
  const [odontogramCharts, setOdontogramCharts] = useState<OdontogramChart[]>([]);

  const generateId = () => Math.random().toString(36).substring(2, 9);

  return (
    <DataStoreContext.Provider
      value={{
        patients,
        setPatients,
        addPatient: (p) => setPatients((prev) => [...prev, { ...p, id: generateId() }]),
        updatePatient: (id, updates) => setPatients(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p)),
        visits,
        addVisit: (v) => setVisits(prev => [...prev, { ...v, id: generateId() }]),
        updateVisit: (id, updates) => setVisits(prev => prev.map(v => v.id === id ? { ...v, ...updates } : v)),
        deleteVisit: (id) => setVisits(prev => prev.filter(v => v.id !== id)),
        treatmentPlanItems,
        addTreatmentPlanItem: (item) => setTreatmentPlanItems(prev => [...prev, { ...item, id: generateId() }]),
        updateTreatmentPlanItem: (id, updates) => setTreatmentPlanItems(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i)),
        deleteTreatmentPlanItem: (id) => setTreatmentPlanItems(prev => prev.filter(i => i.id !== id)),
        financialRecords,
        addFinancialRecord: (r) => setFinancialRecords(prev => [...prev, { ...r, id: generateId() }]),
        updateFinancialRecord: (id, updates) => setFinancialRecords(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r)),
        deleteFinancialRecord: (id) => setFinancialRecords(prev => prev.filter(r => r.id !== id)),
        patientDocuments,
        addPatientDocument: (d) => setPatientDocuments(prev => [...prev, { ...d, id: generateId() }]),
        deletePatientDocument: (id) => setPatientDocuments(prev => prev.filter(d => d.id !== id)),
        clinicalCases,
        addClinicalCase: (c) => setClinicalCases((prev) => [...prev, { ...c, id: generateId() }]),
        endoCases,
        addEndoCase: (c) => setEndoCases((prev) => [...prev, { ...c, id: generateId() }]),
        implantCases,
        addImplantCase: (c) => setImplantCases((prev) => [...prev, { ...c, id: generateId() }]),
        prosthodonticCases,
        addProsthodonticCase: (c) => setProsthodonticCases((prev) => [...prev, { ...c, id: generateId() }]),
        radiologyEntries,
        addRadiologyEntry: (r) => setRadiologyEntries((prev) => [...prev, { ...r, id: generateId() }]),
        photoEntries,
        addPhotoEntry: (p) => setPhotoEntries((prev) => [...prev, { ...p, id: generateId() }]),
        odontogramCharts,
        saveOdontogramChart: (chart) => {
          setOdontogramCharts((prev) => {
            const exists = prev.findIndex((c) => c.id === chart.id);
            if (exists >= 0) {
              const updated = [...prev];
              updated[exists] = chart;
              return updated;
            }
            return [...prev, chart];
          });
        },
      }}
    >
      {children}
    </DataStoreContext.Provider>
  );
}
