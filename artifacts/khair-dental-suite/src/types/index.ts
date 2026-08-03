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
export interface Visit {
  id: string;
  patientId: string;
  date: string;                  // ISO date
  time: string;                  // e.g. "09:30"
  dentist: string;
  type: 'Checkup' | 'Emergency' | 'Follow-up' | 'Procedure' | 'Consultation';
  chiefComplaint: string;
  clinicalFindings: string;
  treatmentDone: string;
  nextVisitDate: string;
  nextVisitNotes: string;
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
  notes: string;
  createdAt: string;
  updatedAt: string;
}

// ── Financial ─────────────────────────────────────────────────
export type PaymentStatus = 'Pending' | 'Partial' | 'Paid' | 'Overdue' | 'Waived';
export type PaymentMethod = 'Cash' | 'Card' | 'Insurance' | 'Bank Transfer' | 'Other';

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
