import { db, DbPatient } from "./schema";
import { repositories } from "./repository";
import { Patient } from "@/types";

const patientNumberPattern = /^KD-\d{4}-(\d{6})$/;

function uuid() {
  return crypto.randomUUID();
}

export const patientService = {
  async nextPatientNumber(year = new Date().getFullYear()) {
    const patients = await db.patients.toArray();
    const highest = patients.reduce((max, patient) => {
      const match = patient.patientNumber?.match(patientNumberPattern);
      return match && patient.patientNumber.startsWith(`KD-${year}-`) ? Math.max(max, Number(match[1])) : max;
    }, 0);
    return `KD-${year}-${String(highest + 1).padStart(6, "0")}`;
  },
  async create(input: Omit<Patient, "id" | "patientNumber" | "createdAt" | "updatedAt" | "deletedAt">) {
    const patientNumber = await this.nextPatientNumber();
    return repositories.patients.create({ ...input, patientNumber } as Omit<DbPatient, "id" | "createdAt" | "updatedAt" | "deletedAt">, uuid());
  },
  async update(id: string, changes: Partial<Patient>) {
    return repositories.patients.update(id, changes);
  },
  async softDelete(id: string) {
    return repositories.patients.softDelete(id);
  },
  async list() {
    return repositories.patients.list();
  },
};

export const clinicalServices = {
  visits: repositories.visits,
  treatmentPlans: repositories.treatmentPlans,
  financialRecords: repositories.financialRecords,
  payments: repositories.payments,
  clinicalPhotos: repositories.clinicalPhotos,
  radiographs: repositories.radiographs,
  odontogramRecords: repositories.odontogramRecords,
  documents: repositories.documents,
};