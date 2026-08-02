export interface Patient {
  id: string;
  fullName: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  email: string;
  nationalId: string;
  bloodType: string;
  allergies: string;
  insuranceProvider: string;
  notes: string;
  status: 'Active' | 'Inactive';
  lastVisit: string;
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
