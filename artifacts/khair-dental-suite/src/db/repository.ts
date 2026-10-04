import { EntityMeta, db } from "./schema";
import { Table } from "dexie";

export type NewEntity<T extends EntityMeta> = Omit<T, "id" | "createdAt" | "updatedAt" | "deletedAt">;

export class Repository<T extends EntityMeta, Key = string> {
  constructor(private readonly table: Table<T, Key>) {}

  async get(id: Key) {
    return this.table.get(id);
  }

  async list(includeDeleted = false) {
    const records = await this.table.toArray();
    return includeDeleted ? records : records.filter(record => !record.deletedAt);
  }

  async create(input: NewEntity<T>, id = crypto.randomUUID()) {
    const timestamp = new Date().toISOString();
    const record = { ...input, id, createdAt: timestamp, updatedAt: timestamp } as T;
    await this.table.add(record);
    return record;
  }

  async put(record: T) {
    await this.table.put(record);
    return record;
  }

  async update(id: Key, changes: Partial<Omit<T, "id" | "createdAt">>) {
    const current = await this.table.get(id);
    if (!current) throw new Error(`Cannot update missing record: ${id}`);
    const record = { ...current, ...changes, id, createdAt: current.createdAt, updatedAt: new Date().toISOString() } as T;
    await this.table.put(record);
    return record;
  }

  async softDelete(id: Key) {
    return this.update(id, { deletedAt: new Date().toISOString() } as Partial<T>);
  }
}

export const repositories = {
  patients: new Repository(db.patients),
  visits: new Repository(db.visits),
  treatmentPlans: new Repository(db.treatmentPlans),
  financialRecords: new Repository(db.financialRecords),
  payments: new Repository(db.payments),
  clinicalPhotos: new Repository(db.clinicalPhotos),
  radiographs: new Repository(db.radiographs),
  odontogramRecords: new Repository(db.odontogramRecords),
  documents: new Repository(db.documents),
  clinicalPhotoRecords: new Repository(db.clinicalPhotoRecords),
  photoAttachments: new Repository(db.photoAttachments),
  radiographRecords: new Repository(db.radiographRecords),
  radiographAttachments: new Repository(db.radiographAttachments),
  dicomStudies: new Repository(db.dicomStudies),
  dicomSeries: new Repository(db.dicomSeries),
  dicomInstances: new Repository(db.dicomInstances),
  odontogramCharts: new Repository(db.odontogramCharts),
  visitDiagnoses: new Repository(db.visitDiagnoses),
  visitProcedures: new Repository(db.visitProcedures),
  visitAttachments: new Repository(db.visitAttachments),
  visitRadiographs: new Repository(db.visitRadiographs),
  paymentAllocations: new Repository(db.paymentAllocations),
  toothDiagnoses: new Repository(db.toothDiagnoses),
  toothTreatments: new Repository(db.toothTreatments),
  toothRestorations: new Repository(db.toothRestorations),
  rootCanalTreatments: new Repository(db.rootCanalTreatments),
  toothCrowns: new Repository(db.toothCrowns),
  toothImplants: new Repository(db.toothImplants),
  toothExtractions: new Repository(db.toothExtractions),
  periodontalEntries: new Repository(db.periodontalEntries),
};