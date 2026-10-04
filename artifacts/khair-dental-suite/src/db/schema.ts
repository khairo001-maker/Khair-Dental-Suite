import Dexie, { Table } from "dexie";
import {
  Patient, Visit, VisitDiagnosis, VisitProcedure, VisitAttachment, VisitRadiograph,
  TreatmentPlanItem, FinancialRecord, Payment, PaymentAllocation, OdontogramChart,
  ToothPhoto, ToothRadiograph, ToothRecord, PatientDocument, ClinicalPhoto, PhotoAttachment,
  Radiograph, RadiographAttachment, DicomStudy, DicomSeries, DicomInstance,
  ToothDiagnosis, ToothTreatment, ToothRestoration, RootCanalTreatment, ToothCrown,
  ToothImplant, ToothExtraction, PeriodontalEntry,
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
export type DbClinicalPhotoRecord = ClinicalPhoto;
export type DbPhotoAttachment = PhotoAttachment;
export type DbRadiographRecord = Radiograph;
export type DbRadiographAttachment = RadiographAttachment;
export type DbVisitDiagnosis = VisitDiagnosis & EntityMeta;
export type DbVisitProcedure = VisitProcedure & EntityMeta;
export type DbVisitAttachment = VisitAttachment & EntityMeta;
export type DbVisitRadiograph = VisitRadiograph & EntityMeta;
export type DbPaymentAllocation = PaymentAllocation & EntityMeta;
export type DbOdontogramChart = OdontogramChart & EntityMeta;
export type DbToothDiagnosis = ToothDiagnosis & EntityMeta;
export type DbToothTreatment = ToothTreatment & EntityMeta;
export type DbToothRestoration = ToothRestoration & EntityMeta;
export type DbRootCanalTreatment = RootCanalTreatment & EntityMeta;
export type DbToothCrown = ToothCrown & EntityMeta;
export type DbToothImplant = ToothImplant & EntityMeta;
export type DbToothExtraction = ToothExtraction & EntityMeta;
export type DbPeriodontalEntry = PeriodontalEntry & EntityMeta;

export class KhairDatabase extends Dexie {
  patients!: Table<DbPatient, string>;
  visits!: Table<DbVisit, string>;
  treatmentPlans!: Table<DbTreatmentPlan, string>;
  financialRecords!: Table<DbFinancialRecord, string>;
  payments!: Table<DbPayment, string>;
  clinicalPhotos!: Table<DbClinicalPhoto, string>;
  radiographs!: Table<DbRadiograph, string>;
  odontogramRecords!: Table<DbOdontogramRecord, [string, number]>;
  documents!: Table<DbDocument, string>;
  clinicalPhotoRecords!: Table<DbClinicalPhotoRecord, string>;
  photoAttachments!: Table<DbPhotoAttachment, string>;
  radiographRecords!: Table<DbRadiographRecord, string>;
  radiographAttachments!: Table<DbRadiographAttachment, string>;
  dicomStudies!: Table<DicomStudy, string>;
  dicomSeries!: Table<DicomSeries, string>;
  dicomInstances!: Table<DicomInstance, string>;
  odontogramCharts!: Table<DbOdontogramChart, string>;
  visitDiagnoses!: Table<DbVisitDiagnosis, string>;
  visitProcedures!: Table<DbVisitProcedure, string>;
  visitAttachments!: Table<DbVisitAttachment, string>;
  visitRadiographs!: Table<DbVisitRadiograph, string>;
  paymentAllocations!: Table<DbPaymentAllocation, string>;
  toothDiagnoses!: Table<DbToothDiagnosis, string>;
  toothTreatments!: Table<DbToothTreatment, string>;
  toothRestorations!: Table<DbToothRestoration, string>;
  rootCanalTreatments!: Table<DbRootCanalTreatment, string>;
  toothCrowns!: Table<DbToothCrown, string>;
  toothImplants!: Table<DbToothImplant, string>;
  toothExtractions!: Table<DbToothExtraction, string>;
  periodontalEntries!: Table<DbPeriodontalEntry, string>;

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
    this.version(2).stores({
      patients: "id, &patientNumber, status, registeredAt, updatedAt, deletedAt",
      visits: "id, patientId, date, status, updatedAt, deletedAt",
      treatmentPlans: "id, patientId, status, updatedAt, deletedAt",
      financialRecords: "id, patientId, date, updatedAt, deletedAt",
      payments: "id, patientId, date, currency, visitId, treatmentPlanItemId, updatedAt, deletedAt",
      clinicalPhotos: "id, patientId, visitId, toothNumber, date, updatedAt, deletedAt",
      radiographs: "id, patientId, visitId, toothNumber, date, updatedAt, deletedAt",
      odontogramRecords: "[patientId+toothNumber], patientId, toothNumber, updatedAt, deletedAt",
      documents: "id, patientId, date, updatedAt, deletedAt",
      clinicalPhotoRecords: "id, patientId, visitId, toothNumber, treatmentPlanItemId, category, dateTaken, updatedAt, deletedAt",
      photoAttachments: "id, photoId, createdAt, updatedAt, deletedAt",
    });
    this.version(3).stores({
      patients: "id, &patientNumber, status, registeredAt, updatedAt, deletedAt",
      visits: "id, patientId, date, status, updatedAt, deletedAt",
      treatmentPlans: "id, patientId, status, updatedAt, deletedAt",
      financialRecords: "id, patientId, date, updatedAt, deletedAt",
      payments: "id, patientId, date, currency, visitId, treatmentPlanItemId, updatedAt, deletedAt",
      clinicalPhotos: "id, patientId, visitId, toothNumber, date, updatedAt, deletedAt",
      radiographs: "id, patientId, visitId, toothNumber, date, updatedAt, deletedAt",
      odontogramRecords: "[patientId+toothNumber], patientId, toothNumber, updatedAt, deletedAt",
      documents: "id, patientId, date, updatedAt, deletedAt",
      clinicalPhotoRecords: "id, patientId, visitId, toothNumber, treatmentPlanItemId, category, dateTaken, updatedAt, deletedAt",
      photoAttachments: "id, photoId, createdAt, updatedAt, deletedAt",
      radiographRecords: "id, patientId, visitId, toothNumber, treatmentPlanItemId, type, date, updatedAt, deletedAt",
      radiographAttachments: "id, radiographId, createdAt, updatedAt, deletedAt",
      dicomStudies: "id, patientId, visitId, studyDate, updatedAt, deletedAt",
      dicomSeries: "id, studyId, modality, updatedAt, deletedAt",
      dicomInstances: "id, seriesId, instanceNumber, updatedAt, deletedAt",
    });
    this.version(4).stores({
      patients: "id, &patientNumber, status, registeredAt, updatedAt, deletedAt",
      visits: "id, patientId, date, status, updatedAt, deletedAt",
      treatmentPlans: "id, patientId, status, updatedAt, deletedAt",
      financialRecords: "id, patientId, date, updatedAt, deletedAt",
      payments: "id, patientId, date, currency, visitId, treatmentPlanItemId, updatedAt, deletedAt",
      clinicalPhotos: "id, patientId, visitId, toothNumber, date, updatedAt, deletedAt",
      radiographs: "id, patientId, visitId, toothNumber, date, updatedAt, deletedAt",
      odontogramRecords: "[patientId+toothNumber], patientId, toothNumber, updatedAt, deletedAt",
      documents: "id, patientId, date, updatedAt, deletedAt",
      clinicalPhotoRecords: "id, patientId, visitId, toothNumber, treatmentPlanItemId, category, dateTaken, updatedAt, deletedAt",
      photoAttachments: "id, photoId, createdAt, updatedAt, deletedAt",
      radiographRecords: "id, patientId, visitId, toothNumber, treatmentPlanItemId, type, date, updatedAt, deletedAt",
      radiographAttachments: "id, radiographId, createdAt, updatedAt, deletedAt",
      dicomStudies: "id, patientId, visitId, studyDate, updatedAt, deletedAt",
      dicomSeries: "id, studyId, modality, updatedAt, deletedAt",
      dicomInstances: "id, seriesId, instanceNumber, updatedAt, deletedAt",
      odontogramCharts: "id, patientId, date, updatedAt, deletedAt",
      visitDiagnoses: "id, patientId, visitId, toothNumber, date, updatedAt, deletedAt",
      visitProcedures: "id, patientId, visitId, date, treatmentPlanItemId, updatedAt, deletedAt",
      visitAttachments: "id, patientId, visitId, toothNumber, date, updatedAt, deletedAt",
      visitRadiographs: "id, patientId, visitId, toothNumber, date, updatedAt, deletedAt",
      paymentAllocations: "id, paymentId, treatmentPlanItemId, visitId, currency, updatedAt, deletedAt",
      toothDiagnoses: "id, patientId, toothNumber, date, updatedAt, deletedAt",
      toothTreatments: "id, patientId, toothNumber, visitId, treatmentPlanItemId, date, updatedAt, deletedAt",
      toothRestorations: "id, patientId, toothNumber, date, updatedAt, deletedAt",
      rootCanalTreatments: "id, patientId, toothNumber, date, updatedAt, deletedAt",
      toothCrowns: "id, patientId, toothNumber, date, updatedAt, deletedAt",
      toothImplants: "id, patientId, toothNumber, placementDate, updatedAt, deletedAt",
      toothExtractions: "id, patientId, toothNumber, date, updatedAt, deletedAt",
      periodontalEntries: "id, patientId, toothNumber, date, updatedAt, deletedAt",
    });
  }
}

export const db = new KhairDatabase();