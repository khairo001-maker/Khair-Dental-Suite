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
} from '../types';

interface DataStoreContextType {
  patients: Patient[];
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>;
  addPatient: (patient: Omit<Patient, 'id'>) => void;
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
