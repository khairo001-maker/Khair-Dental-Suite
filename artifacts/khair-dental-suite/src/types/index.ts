// ── Personal Info ─────────────────────────────────────────────
export interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

// ── Medical History ───────────────────────────────────────────
export interface MedicalHistory {
  allergies: string[];          // e.g. ["Penicillin", "Latex"]
  medications: string[];        // e.g. ["Metformin 500mg"]
  systemicDiseases: string[];   // e.g. ["Type 2 Diabetes", "Hypertension"]
  smoking: 'Never' | 'Former' | 'Current';
  pregnancy: 'Yes' | 'No' | 'N/A';
  notes: string;
}

// ── Dental History ────────────────────────────────────────────
export interface DentalHistory {
  lastDentalVisit: string;       // ISO date string
  previousDentist: string;
  chiefComplaint: string;
  dentalAnxiety: 'None' | 'Mild' | 'Moderate' | 'Severe';
  previousTreatments: string;   // free text
  notes: string;
}

// ── Visit (Timeline) ─────────────────────────────────────────
export type VisitType =
  | 'Examination' | 'Emergency' | 'Consultation' | 'Restoration'
  | 'Endodontics' | 'Prosthodontics' | 'Implantology' | 'Periodontal'
  | 'Oral Surgery' | 'Esthetic Dentistry' | 'Follow-up' | 'Other';
export type VisitStatus = 'Draft' | 'Open' | 'Completed' | 'Cancelled';

export interface Visit {
  id: string;
  patientId: string;
  date: string;                  // ISO date
  time: string;                  // legacy start time
  startTime: string;
  endTime: string;
  dentist: string;
  type: VisitType;
  chiefComplaint: string;
  historyPresentIllness: string;
  clinicalFindings: string;
  diagnosis: string;
  treatmentDone: string;
  treatmentNotes: string;
  followUpInstructions: string;
  generalNotes: string;
  nextVisitDate: string;
  nextVisitNotes: string;
  toothNumbers: number[];
  diagnosisIds: string[];
  procedureIds: string[];
  attachmentIds: string[];
  radiographIds: string[];
  treatmentPlanItemIds: string[];
  financialRecordIds: string[];
  status: VisitStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export type VisitProcedureType =
  | 'Examination' | 'Diagnosis' | 'Restoration' | 'Root Canal Treatment'
  | 'Post and Core' | 'Crown' | 'Implant' | 'Extraction'
  | 'Periodontal Treatment' | 'Other';
export type VisitProcedureStatus = 'Planned' | 'In Progress' | 'Completed' | 'Cancelled';

export interface VisitDiagnosis {
  id: string;
  patientId: string;
  visitId: string;
  toothNumber?: number;
  diagnosis: string;
  notes: string;
  date: string;
  status: 'Active' | 'Resolved' | 'Monitoring';
}

export interface VisitProcedure {
  id: string;
  patientId: string;
  visitId: string;
  toothNumbers: number[];
  type: VisitProcedureType;
  date: string;
  status: VisitProcedureStatus;
  notes: string;
  clinician: string;
  treatmentPlanItemId?: string;
}

export type VisitAttachmentCategory = 'Before' | 'After' | 'Intraoral' | 'Extraoral' | 'Other';

export interface VisitAttachment {
  id: string;
  patientId: string;
  visitId: string;
  toothNumber?: number;
  category: VisitAttachmentCategory;
  caption: string;
  date: string;
  fileReference?: string;
}

export interface VisitRadiograph {
  id: string;
  patientId: string;
  visitId: string;
  toothNumber?: number;
  type: 'Periapical' | 'Bitewing' | 'OPG' | 'Other';
  date: string;
  findings: string;
  interpretation: string;
  fileReference?: string;
}

// ── Treatment Plan ────────────────────────────────────────────
export type TreatmentPriority = 'Immediate' | 'Short-term' | 'Long-term' | 'Elective';
export type TreatmentItemStatus = 'Planned' | 'In Progress' | 'Completed' | 'Cancelled';

export interface TreatmentPlanItem {
  id: string;
  patientId: string;
  toothNumber: string;     // e.g. "16" or "Upper Right" or "Full Arch"
  procedure: string;
  priority: TreatmentPriority;
  status: TreatmentItemStatus;
  estimatedSessions: number;
  completedSessions: number;
  estimatedCost?: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

// ── Financial ─────────────────────────────────────────────────
export type PaymentStatus = 'Pending' | 'Partial' | 'Paid' | 'Overdue' | 'Waived';
export type PaymentMethod = 'Cash' | 'Card' | 'Bank Transfer' | 'Electronic Wallet' | 'Insurance' | 'Other';
export type Currency = 'EUR' | 'USD' | 'TRY' | 'SYP';

export interface FinancialAccount {
  id: string;
  patientId: string;
  currency: Currency;
  createdAt: string;
  updatedAt: string;
}

export interface TreatmentCost {
  id: string;
  patientId: string;
  treatmentPlanItemId: string;
  toothNumbers: number[];
  procedure: string;
  description: string;
  estimatedCost: number;
  finalCost?: number;
  currency: Currency;
  status: TreatmentItemStatus;
  date: string;
}

export interface Payment {
  id: string;
  patientId: string;
  date: string;
  amount: number;
  currency: Currency;
  paymentMethod: PaymentMethod;
  visitId?: string;
  treatmentPlanItemId?: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface PaymentAllocation {
  id: string;
  paymentId: string;
  treatmentPlanItemId?: string;
  visitId?: string;
  amount: number;
  currency: Currency;
}

export interface FinancialTransaction {
  id: string;
  patientId: string;
  date: string;
  type: 'Treatment' | 'Payment';
  treatmentPlanItemId?: string;
  paymentId?: string;
  amount: number;
  currency: Currency;
  balanceAfter: number;
  notes: string;
}

export interface FinancialRecord {
  id: string;
  patientId: string;
  date: string;
  description: string;
  procedure: string;
  toothNumber: string;
  fee: number;              // exact fee entered by dentist — no calculations
  discount: number;         // exact discount entered
  amountPaid: number;       // exact amount entered
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  notes: string;
}

// ── Document ──────────────────────────────────────────────────
export type DocumentCategory = 'Consent Form' | 'Referral' | 'Lab Result' | 'Insurance' | 'Prescription' | 'Other';

export interface PatientDocument {
  id: string;
  patientId: string;
  name: string;
  category: DocumentCategory;
  date: string;
  notes: string;
  // fileUrl will be added when file storage is implemented
}

// ── Patient (expanded) ────────────────────────────────────────
export interface Patient {
  id: string;
  // Personal
  fullName: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  email: string;
  address: string;
  occupation: string;
  nationalId: string;
  bloodType: string;
  emergencyContact: EmergencyContact;
  // Medical
  medicalHistory: MedicalHistory;
  // Dental
  dentalHistory: DentalHistory;
  // Insurance
  insuranceProvider: string;
  insuranceNumber: string;
  // Meta
  registeredAt: string;
  lastVisit: string;
  status: 'Active' | 'Inactive';
}

export interface ClinicalCase {
  id: string;
  patientId: string;
  type: string;
  chiefComplaint: string;
  diagnosis: string;
  treatmentPlan: string;
  specialty: 'General' | 'Endodontics' | 'Implantology' | 'Prosthodontics';
  priority: 'Routine' | 'Urgent' | 'Emergency';
  status: 'Open' | 'In Progress' | 'Closed';
  dateOpened: string;
}

export interface EndoCase {
  id: string;
  patientId: string;
  toothNumber: number;
  diagnosis: string;
  workingLength: number;
  canals: number;
  fileSystem: string;
  irrigant: string;
  obturation: string;
  notes: string;
  status: 'Diagnosis' | 'Instrumentation' | 'Obturation' | 'Review' | 'Complete';
  date: string;
}

export interface ImplantCase {
  id: string;
  patientId: string;
  toothPosition: number;
  brand: string;
  diameter: number;
  length: number;
  torque: number;
  boneGraft: 'Yes' | 'No';
  membrane: 'Yes' | 'No';
  placementDate: string;
  surgeon: string;
  notes: string;
  stage: 'Planning' | 'Placement' | 'Healing' | 'Loading' | 'Maintenance';
  status: 'Active' | 'Completed';
}

export interface ProsthodonticCase {
  id: string;
  patientId: string;
  type: 'Crown' | 'Bridge' | 'Denture' | 'Veneer' | 'Inlay' | 'Onlay';
  teethInvolved: number[];
  material: 'Metal-Ceramic' | 'Zirconia' | 'E.max' | 'Composite' | 'Acrylic';
  shade: string;
  labName: string;
  sentDate: string;
  returnDate: string;
  notes: string;
  status: 'Impression' | 'Lab' | 'Try-in' | 'Delivery' | 'Complete';
}

export interface RadiologyEntry {
  id: string;
  patientId: string;
  type: 'Periapical' | 'Bitewing' | 'Panoramic' | 'CBCT' | 'Cephalometric';
  date: string;
  region: string;
  findings: string;
  interpretation: string;
  recommendations: string;
}

export interface PhotoEntry {
  id: string;
  patientId: string;
  category: 'Extraoral' | 'Intraoral' | 'Smile' | 'Before' | 'After' | 'Other';
  date: string;
  notes: string;
}

// ── Legacy Odontogram (preserved for backward compatibility) ──
export type ToothCondition = 'Healthy' | 'Caries' | 'Filled (amalgam)' | 'Filled (composite)' | 'Crown' | 'Missing' | 'Implant' | 'Root Canal';

export interface ToothSurfaceState {
  condition: ToothCondition;
}

export interface ToothState {
  toothNumber: number;
  overallCondition?: ToothCondition;
  surfaces: {
    mesial: ToothSurfaceState;
    distal: ToothSurfaceState;
    occlusal: ToothSurfaceState;
    buccal: ToothSurfaceState;
    lingual: ToothSurfaceState;
  };
  note: string;
}

export interface OdontogramChart {
  id: string;
  patientId: string;
  date: string;
  dentist: string;
  notes: string;
  teethData: Record<number, ToothState>;
}

// ─────────────────────────────────────────────────────────────
// ── NEW: Comprehensive Interactive Odontogram Types ───────────
// ─────────────────────────────────────────────────────────────

/** Current clinical status of a tooth — drives chart color coding */
export type ToothStatus =
  | 'Healthy'
  | 'Caries'
  | 'Filled'
  | 'Crown'
  | 'Missing'
  | 'Implant'
  | 'Root Canal'
  | 'Extracted'
  | 'Bridge Pontic'
  | 'Watch';

/** Visual config per status — used by both chart and legend */
export const TOOTH_STATUS_CONFIG: Record<
  ToothStatus,
  { fill: string; centerFill: string; stroke: string; dotColor: string; label: string }
> = {
  Healthy:         { fill: '#f8fafc', centerFill: '#f1f5f9', stroke: '#cbd5e1', dotColor: '#94a3b8', label: 'Healthy' },
  Caries:          { fill: '#fee2e2', centerFill: '#fca5a5', stroke: '#ef4444', dotColor: '#ef4444', label: 'Caries' },
  Filled:          { fill: '#dbeafe', centerFill: '#93c5fd', stroke: '#3b82f6', dotColor: '#3b82f6', label: 'Filled' },
  Crown:           { fill: '#fef3c7', centerFill: '#fde68a', stroke: '#f59e0b', dotColor: '#f59e0b', label: 'Crown' },
  Missing:         { fill: '#f1f5f9', centerFill: '#e2e8f0', stroke: '#94a3b8', dotColor: '#94a3b8', label: 'Missing' },
  Implant:         { fill: '#d1fae5', centerFill: '#6ee7b7', stroke: '#10b981', dotColor: '#10b981', label: 'Implant' },
  'Root Canal':    { fill: '#ede9fe', centerFill: '#c4b5fd', stroke: '#8b5cf6', dotColor: '#8b5cf6', label: 'Root Canal' },
  Extracted:       { fill: '#f1f5f9', centerFill: '#e2e8f0', stroke: '#64748b', dotColor: '#64748b', label: 'Extracted' },
  'Bridge Pontic': { fill: '#e0f2fe', centerFill: '#bae6fd', stroke: '#0ea5e9', dotColor: '#0ea5e9', label: 'Bridge Pontic' },
  Watch:           { fill: '#fefce8', centerFill: '#fef08a', stroke: '#eab308', dotColor: '#eab308', label: 'Watch' },
};

/**
 * Canonical tooth record — one row per (patientId, toothNumber) in the DB.
 * Acts as the chart state anchor; all child records reference this pair.
 */
export interface ToothRecord {
  patientId: string;
  toothNumber: number;       // FDI number (11-18, 21-28, 31-38, 41-48)
  status: ToothStatus;
  lastUpdated: string;       // ISO timestamp of last change
}

// ── Child record types (each row has patientId + toothNumber as FK) ──

export type DiagnosisSeverity = 'Mild' | 'Moderate' | 'Severe';

export interface ToothDiagnosis {
  id: string;
  toothNumber: number;
  patientId: string;
  date: string;
  diagnosis: string;         // e.g. "Deep Caries", "Irreversible Pulpitis"
  severity: DiagnosisSeverity;
  status: 'Active' | 'Resolved' | 'Monitoring';
  notes: string;
  dentist: string;
}

export type ToothSurface = 'Mesial' | 'Distal' | 'Occlusal' | 'Buccal' | 'Lingual' | 'Incisal';
export type TreatmentStatus = 'Planned' | 'In Progress' | 'Completed';

export interface ToothTreatment {
  id: string;
  toothNumber: number;
  patientId: string;
  date: string;
  procedure: string;
  treatmentType: 'Restoration' | 'Root Canal Treatment' | 'Crown' | 'Post and Core' | 'Implant' | 'Extraction' | 'Periodontal Treatment' | 'Other';
  surfaces: ToothSurface[];
  visitId: string;
  treatmentPlanItemId?: string;
  notes: string;
  dentist: string;
  status: TreatmentStatus;
}

export type RestorationMaterial = 'Composite' | 'Amalgam' | 'GIC' | 'Ceramic' | 'Gold' | 'Other';

export interface ToothRestoration {
  id: string;
  toothNumber: number;
  patientId: string;
  date: string;
  material: RestorationMaterial;
  surfaces: ToothSurface[];
  notes: string;
  dentist: string;
}

export type RCTStatus = 'Diagnosis' | 'Access' | 'Instrumentation' | 'Obturation' | 'Post & Core' | 'Complete';
export type ObtuationMaterial = 'Gutta-Percha' | 'Thermoplastic' | 'Paste' | 'Other';

export interface RootCanalTreatment {
  id: string;
  toothNumber: number;
  patientId: string;
  date: string;
  canals: number;
  workingLength: number;     // mm
  technique: string;         // e.g. "Crown-down", "Step-back"
  irrigant: string;          // e.g. "NaOCl 2.5%"
  sealer: string;
  obturation: ObtuationMaterial;
  status: RCTStatus;
  notes: string;
  dentist: string;
}

export type CrownType = 'PFM' | 'Zirconia' | 'E.max' | 'Gold' | 'Temporary' | 'Other';
export type CrownStatus = 'Preparation' | 'Impression' | 'Temporization' | 'Try-in' | 'Cemented';

export interface ToothCrown {
  id: string;
  toothNumber: number;
  patientId: string;
  date: string;
  type: CrownType;
  shade: string;
  lab: string;
  status: CrownStatus;
  notes: string;
  dentist: string;
}

export type ImplantStage = 'Planning' | 'Placement' | 'Healing' | 'Abutment' | 'Crown' | 'Maintenance';

export interface ToothImplant {
  id: string;
  toothNumber: number;
  patientId: string;
  placementDate: string;
  brand: string;
  diameter: number;          // mm
  length: number;            // mm
  torque: number;            // Ncm
  boneGraft: boolean;
  membrane: boolean;
  abutmentDate: string;
  crownDate: string;
  stage: ImplantStage;
  notes: string;
  surgeon: string;
}

export type ExtractionTechnique = 'Simple' | 'Surgical';

export interface ToothExtraction {
  id: string;
  toothNumber: number;
  patientId: string;
  date: string;
  reason: string;
  technique: ExtractionTechnique;
  complications: string;
  postOpInstructions: string;
  dentist: string;
  notes: string;
}

export type FurcationClass = 'None' | 'Class I' | 'Class II' | 'Class III';
export type MobilityGrade = 'None' | 'Grade I' | 'Grade II' | 'Grade III';

export interface PeriodontalEntry {
  id: string;
  toothNumber: number;
  patientId: string;
  date: string;
  /**
   * 6 measurements in order: MB, B, DB, ML, L, DL
   * Stored as a fixed-length array for future charting
   */
  pocketDepths: [number, number, number, number, number, number];
  bleeding: [boolean, boolean, boolean, boolean, boolean, boolean];
  furcation: FurcationClass;
  recession: number;         // mm
  mobility: MobilityGrade;
  notes: string;
  dentist: string;
}

export interface ToothPhoto {
  id: string;
  toothNumber: number;
  patientId: string;
  date: string;
  visitId: string;
  category: 'Before' | 'After' | 'Intraoral' | 'Other';
  caption: string;
  notes: string;
  // fileUrl will be added when object storage is implemented
}

export interface ToothRadiograph {
  id: string;
  toothNumber: number;
  patientId: string;
  date: string;
  visitId: string;
  type: 'Periapical' | 'Bitewing' | 'OPG' | 'Other';
  findings: string;
  interpretation: string;
  // fileUrl will be added when object storage is implemented
}

/** A normalized event projection for the tooth timeline. Source records remain
 * in their own collections so future Dexie tables can preserve domain shape. */
export interface ToothTimelineEvent {
  id: string;
  toothNumber: number;
  patientId: string;
  date: string;
  kind: 'Diagnosis' | 'Treatment' | 'Photo' | 'Radiograph' | 'Periodontal';
  title: string;
  notes: string;
  sourceId: string;
}
