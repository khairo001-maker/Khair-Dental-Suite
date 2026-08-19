import Dexie, { Table } from "dexie";
import {
  Patient, Visit, TreatmentPlanItem, FinancialRecord, Payment,
  ToothPhoto, ToothRadiograph, ToothRecord, PatientDocument,
} from "@/types";

export interface EntityMeta {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export type DbPatient = Patient & EntityMeta & { patientNumber: string };
export type DbVisit = Visit & EntityMeta;
export type DbTreatmentPlan = TreatmentPlanItem & EntityMeta & {
  description?: string;
  finalCost?: number;
  currency?: string;
  date?: string;
};
export type DbFinancialRecord = FinancialRecord & EntityMeta;
export type DbPayment = Payment & EntityMeta;
export type DbClinicalPhoto = ToothPhoto & EntityMeta;
export type DbRadiograph = ToothRadiograph & EntityMeta;
export type DbOdontogramRecord = ToothRecord & EntityMeta;
export type DbDocument = PatientDocument & EntityMeta;

export class KhairDatabase extends Dexie {
  patients!: Table<DbPatient, string>;
  visits!: Table<DbVisit, string>;
  treatmentPlans!: Table<DbTreatmentPlan, string>;
  financialRecords!: Table<DbFinancialRecord, string>;
  payments!: Table<DbPayment, string>;
  clinicalPhotos!: Table<DbClinicalPhoto, string>;
  radiographs!: Table<DbRadiograph, string>;
  odontogramRecords!: Table<DbOdontogramRecord, string>;
  documents!: Table<DbDocument, string>;

  constructor() {
    super("khair-dental-suite");
    this.version(1).stores({
      patients: "id, &patientNumber, status, registeredAt, updatedAt, deletedAt",
      visits: "id, patientId, date, status, updatedAt, deletedAt",
      treatmentPlans: "id, patientId, status, updatedAt, deletedAt",
      financialRecords: "id, patientId, date, updatedAt, deletedAt",
      payments: "id, patientId, date, currency, visitId, treatmentPlanItemId, updatedAt, deletedAt",
      clinicalPhotos: "id, patientId, visitId, toothNumber, date, updatedAt, deletedAt",
      radiographs: "id, patientId, visitId, toothNumber, date, updatedAt, deletedAt",
      odontogramRecords: "[patientId+toothNumber], patientId, toothNumber, updatedAt, deletedAt",
      documents: "id, patientId, date, updatedAt, deletedAt",
    });
  }
}

export const db = new KhairDatabase();