import { db, DbPatient } from "./schema";
import { repositories } from "./repository";
import { Patient, ClinicalPhoto, PhotoAttachment, PhotoCategory, PhotoFilter, Radiograph, RadiographAttachment, RadiographType } from "@/types";

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
  async create(input: Omit<Patient, "id" | "patientNumber" | "createdAt" | "updatedAt" | "deletedAt">, id = uuid()) {
    return db.transaction("rw", db.patients, async () => {
      const year = new Date().getFullYear();
      const patients = await db.patients.toArray();
      const highest = patients.reduce((max, patient) => {
        const match = patient.patientNumber?.match(patientNumberPattern);
        return match && patient.patientNumber.startsWith(`KD-${year}-`) ? Math.max(max, Number(match[1])) : max;
      }, 0);
      const patientNumber = `KD-${year}-${String(highest + 1).padStart(6, "0")}`;
      const timestamp = new Date().toISOString();
      const record = { ...input, id, patientNumber, createdAt: timestamp, updatedAt: timestamp } as DbPatient;
      await db.patients.add(record);
      return record;
    });
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

function makePreview(file: File, maxEdge = 1200): Promise<Blob> {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => {
      const scale = Math.min(1, maxEdge / Math.max(image.naturalWidth, image.naturalHeight));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
      canvas.getContext("2d")?.drawImage(image, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(blob => resolve(blob || file), "image/jpeg", 0.84);
      URL.revokeObjectURL(image.src);
    };
    image.onerror = () => resolve(file);
    image.src = URL.createObjectURL(file);
  });
}

export const clinicalPhotoService = {
  async importFiles(input: {
    patientId: string;
    files: File[];
    category: PhotoCategory;
    customCategory?: string;
    caption?: string;
    dateTaken?: string;
    visitId?: string;
    toothNumber?: number;
    treatmentPlanItemId?: string;
  }) {
    const results: ClinicalPhoto[] = [];
    for (const file of input.files) {
      const id = uuid();
      const timestamp = new Date().toISOString();
      const previewBlob = await makePreview(file);
      const photo: ClinicalPhoto = {
        id, patientId: input.patientId, visitId: input.visitId,
        toothNumber: input.toothNumber, treatmentPlanItemId: input.treatmentPlanItemId,
        category: input.category, customCategory: input.customCategory,
        caption: input.caption || file.name, dateTaken: input.dateTaken || timestamp,
        createdAt: timestamp, updatedAt: timestamp, localFileReference: `indexeddb://clinical-photo/${id}`,
      };
      const attachment: PhotoAttachment = {
        id: uuid(), photoId: id, originalBlob: file, previewBlob,
        mimeType: file.type, originalSize: file.size, previewSize: previewBlob.size,
        createdAt: timestamp, updatedAt: timestamp,
      };
      await db.transaction("rw", db.clinicalPhotoRecords, db.photoAttachments, async () => {
        await db.clinicalPhotoRecords.add(photo);
        await db.photoAttachments.add(attachment);
      });
      results.push(photo);
    }
    return results;
  },
  async list(patientId: string, filter: PhotoFilter = {}) {
    const photos = (await db.clinicalPhotoRecords.where("patientId").equals(patientId).toArray())
      .filter(photo => !photo.deletedAt)
      .filter(photo => !filter.category || photo.category === filter.category)
      .filter(photo => !filter.date || photo.dateTaken.startsWith(filter.date))
      .filter(photo => !filter.visitId || photo.visitId === filter.visitId)
      .filter(photo => filter.toothNumber === undefined || photo.toothNumber === filter.toothNumber);
    return photos.sort((a, b) => b.dateTaken.localeCompare(a.dateTaken));
  },
  async getAttachment(photoId: string) {
    return db.photoAttachments.where("photoId").equals(photoId).first();
  },
  async updateMetadata(id: string, changes: Partial<ClinicalPhoto>) {
    const current = await db.clinicalPhotoRecords.get(id);
    if (!current) throw new Error(`Clinical photo not found: ${id}`);
    const updated = { ...current, ...changes, id, createdAt: current.createdAt, updatedAt: new Date().toISOString() };
    await db.clinicalPhotoRecords.put(updated);
    return updated;
  },
  async softDelete(id: string) {
    return this.updateMetadata(id, { deletedAt: new Date().toISOString() });
  },
  async listByVisit(patientId: string, visitId: string) {
    return this.list(patientId, { visitId });
  },
  async listByTooth(patientId: string, toothNumber: number) {
    return this.list(patientId, { toothNumber });
  },
};

function makeRadiographPreview(file: File, maxEdge = 1400): Promise<Blob | undefined> {
  if (!file.type.startsWith("image/")) return Promise.resolve(undefined);
  return new Promise(resolve => {
    const image = new Image();
    image.onload = () => {
      const scale = Math.min(1, maxEdge / Math.max(image.naturalWidth, image.naturalHeight));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
      canvas.getContext("2d")?.drawImage(image, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(blob => resolve(blob || undefined), "image/jpeg", 0.88);
      URL.revokeObjectURL(image.src);
    };
    image.onerror = () => resolve(undefined);
    image.src = URL.createObjectURL(file);
  });
}

export const radiographService = {
  async importFiles(input: {
    patientId: string;
    files: File[];
    type: RadiographType;
    date?: string;
    description?: string;
    clinicalIndication?: string;
    findings?: string;
    impression?: string;
    recommendations?: string;
    notes?: string;
    visitId?: string;
    toothNumber?: number;
    treatmentPlanItemId?: string;
  }) {
    const results: Radiograph[] = [];
    for (const file of input.files) {
      const id = uuid();
      const timestamp = new Date().toISOString();
      const previewBlob = await makeRadiographPreview(file);
      const fileReference = `indexeddb://radiograph/${id}`;
      const record: Radiograph = {
        id, patientId: input.patientId, visitId: input.visitId,
        toothNumber: input.toothNumber, treatmentPlanItemId: input.treatmentPlanItemId,
        type: input.type, date: input.date || timestamp,
        description: input.description || file.name,
        clinicalIndication: input.clinicalIndication || "", findings: input.findings || "",
        impression: input.impression || "", recommendations: input.recommendations || "",
        notes: input.notes || "", fileReference, createdAt: timestamp, updatedAt: timestamp,
      };
      const attachment: RadiographAttachment = {
        id: uuid(), radiographId: id, originalBlob: file, previewBlob,
        mimeType: file.type || "application/dicom", originalSize: file.size,
        previewSize: previewBlob?.size || 0, createdAt: timestamp, updatedAt: timestamp,
      };
      await db.transaction("rw", db.radiographRecords, db.radiographAttachments, async () => {
        await db.radiographRecords.add(record);
        await db.radiographAttachments.add(attachment);
      });
      const isDicom = /\.(dcm|dicom|zip)$/i.test(file.name) || /dicom|zip/i.test(file.type);
      if (isDicom) {
        const studyId = uuid();
        const seriesId = uuid();
        const instanceId = uuid();
        await db.transaction("rw", db.dicomStudies, db.dicomSeries, db.dicomInstances, async () => {
          await db.dicomStudies.add({
            id: studyId, patientId: input.patientId, visitId: input.visitId,
            toothNumber: input.toothNumber, treatmentPlanItemId: input.treatmentPlanItemId,
            studyDate: record.date, description: record.description, seriesIds: [seriesId],
            createdAt: timestamp, updatedAt: timestamp,
          });
          await db.dicomSeries.add({
            id: seriesId, studyId, modality: "CBCT", description: file.name,
            instanceIds: [instanceId], createdAt: timestamp, updatedAt: timestamp,
          });
          await db.dicomInstances.add({
            id: instanceId, seriesId, fileReference, createdAt: timestamp, updatedAt: timestamp,
          });
        });
      }
      results.push(record);
    }
    return results;
  },
  async list(patientId: string, filters: { type?: RadiographType; date?: string; toothNumber?: number; visitId?: string; search?: string } = {}) {
    const query = (filters.search || "").toLowerCase();
    const records = (await db.radiographRecords.where("patientId").equals(patientId).toArray())
      .filter(record => !record.deletedAt)
      .filter(record => !filters.type || record.type === filters.type)
      .filter(record => !filters.date || record.date.startsWith(filters.date))
      .filter(record => filters.toothNumber === undefined || record.toothNumber === filters.toothNumber)
      .filter(record => !filters.visitId || record.visitId === filters.visitId)
      .filter(record => !query || `${record.description} ${record.findings} ${record.impression}`.toLowerCase().includes(query))
      .sort((a, b) => b.date.localeCompare(a.date));
    return records;
  },
  async getAttachment(radiographId: string) {
    return db.radiographAttachments.where("radiographId").equals(radiographId).first();
  },
  async updateMetadata(id: string, changes: Partial<Radiograph>) {
    const current = await db.radiographRecords.get(id);
    if (!current) throw new Error(`Radiograph not found: ${id}`);
    const updated = { ...current, ...changes, id, createdAt: current.createdAt, updatedAt: new Date().toISOString() };
    await db.radiographRecords.put(updated);
    return updated;
  },
  async softDelete(id: string) {
    return this.updateMetadata(id, { deletedAt: new Date().toISOString() });
  },
  async listByVisit(patientId: string, visitId: string) {
    return this.list(patientId, { visitId });
  },
  async listByTooth(patientId: string, toothNumber: number) {
    return this.list(patientId, { toothNumber });
  },
};