export type Patient = {
  id: string;
  name: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  email: string;
  address: string;
  bloodType: string;
  allergies: string[];
  insuranceProvider: string;
  insuranceNumber: string;
  registeredAt: string;
  lastVisit: string;
  nextAppointment: string | null;
  status: 'active' | 'inactive';
};

export type Appointment = {
  id: string;
  patientId: string;
  patientName: string;
  dentistId: string;
  dentistName: string;
  date: string;
  time: string;
  duration: number; // in minutes
  type: 'checkup' | 'cleaning' | 'filling' | 'extraction' | 'rootCanal' | 'whitening' | 'consultation';
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  notes: string;
};

export type Treatment = {
  id: string;
  patientId: string;
  patientName: string;
  dentistId: string;
  dentistName: string;
  date: string;
  toothNumber: string | null;
  procedure: string;
  description: string;
  cost: number;
  status: 'completed' | 'planned' | 'in-progress';
};

export type Invoice = {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  dueDate: string;
  items: { procedure: string; cost: number }[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'paid' | 'pending' | 'overdue';
  paymentMethod: string | null;
};

export type Staff = {
  id: string;
  name: string;
  role: 'dentist' | 'hygienist' | 'receptionist' | 'admin';
  specialization: string;
  phone: string;
  email: string;
  schedule: string[];
  avatarInitials: string;
  yearsExperience: number;
};

const mockPatients: Patient[] = [
  {
    id: 'P001',
    name: 'Eleanor Vance',
    dateOfBirth: '1985-04-12',
    gender: 'Female',
    phone: '(555) 012-3456',
    email: 'eleanor.vance@example.com',
    address: '123 Maple Street, Anytown',
    bloodType: 'A+',
    allergies: ['Penicillin'],
    insuranceProvider: 'BlueCross',
    insuranceNumber: 'BC-987654321',
    registeredAt: '2022-01-15',
    lastVisit: '2023-10-05',
    nextAppointment: '2023-11-20',
    status: 'active',
  },
  {
    id: 'P002',
    name: 'Marcus Thorne',
    dateOfBirth: '1978-08-22',
    gender: 'Male',
    phone: '(555) 098-7654',
    email: 'm.thorne@example.com',
    address: '456 Oak Avenue, Anytown',
    bloodType: 'O-',
    allergies: [],
    insuranceProvider: 'Aetna',
    insuranceNumber: 'AT-123456789',
    registeredAt: '2021-11-03',
    lastVisit: '2023-09-12',
    nextAppointment: null,
    status: 'active',
  },
  {
    id: 'P003',
    name: 'Sophia Sterling',
    dateOfBirth: '1992-12-05',
    gender: 'Female',
    phone: '(555) 234-5678',
    email: 'sophia.s@example.com',
    address: '789 Pine Road, Anytown',
    bloodType: 'B+',
    allergies: ['Latex'],
    insuranceProvider: 'Cigna',
    insuranceNumber: 'CG-456789123',
    registeredAt: '2023-02-28',
    lastVisit: '2023-10-18',
    nextAppointment: '2023-11-02',
    status: 'active',
  },
  {
    id: 'P004',
    name: 'Julian Bashir',
    dateOfBirth: '1965-03-15',
    gender: 'Male',
    phone: '(555) 345-6789',
    email: 'j.bashir@example.com',
    address: '321 Elm Street, Anytown',
    bloodType: 'AB+',
    allergies: [],
    insuranceProvider: 'UnitedHealth',
    insuranceNumber: 'UH-789123456',
    registeredAt: '2020-05-10',
    lastVisit: '2023-01-20',
    nextAppointment: null,
    status: 'inactive',
  },
  {
    id: 'P005',
    name: 'Amara Singh',
    dateOfBirth: '1988-07-30',
    gender: 'Female',
    phone: '(555) 456-7890',
    email: 'amara.singh@example.com',
    address: '654 Birch Boulevard, Anytown',
    bloodType: 'O+',
    allergies: ['Sulfa drugs'],
    insuranceProvider: 'BlueCross',
    insuranceNumber: 'BC-321654987',
    registeredAt: '2022-09-14',
    lastVisit: '2023-10-25',
    nextAppointment: '2023-11-15',
    status: 'active',
  },
  {
    id: 'P006',
    name: 'David Palmer',
    dateOfBirth: '1972-11-08',
    gender: 'Male',
    phone: '(555) 567-8901',
    email: 'd.palmer@example.com',
    address: '987 Cedar Court, Anytown',
    bloodType: 'A-',
    allergies: [],
    insuranceProvider: 'Aetna',
    insuranceNumber: 'AT-654987321',
    registeredAt: '2021-04-22',
    lastVisit: '2023-08-05',
    nextAppointment: '2024-02-05',
    status: 'active',
  },
  {
    id: 'P007',
    name: 'Chloe Decker',
    dateOfBirth: '1990-01-25',
    gender: 'Female',
    phone: '(555) 678-9012',
    email: 'c.decker@example.com',
    address: '147 Walnut Way, Anytown',
    bloodType: 'B-',
    allergies: ['Ibuprofen'],
    insuranceProvider: 'Cigna',
    insuranceNumber: 'CG-987321654',
    registeredAt: '2023-06-11',
    lastVisit: '2023-09-30',
    nextAppointment: null,
    status: 'active',
  },
  {
    id: 'P008',
    name: 'Winston Schmidt',
    dateOfBirth: '1983-09-19',
    gender: 'Male',
    phone: '(555) 789-0123',
    email: 'w.schmidt@example.com',
    address: '258 Spruce Drive, Anytown',
    bloodType: 'O+',
    allergies: [],
    insuranceProvider: 'UnitedHealth',
    insuranceNumber: 'UH-123789456',
    registeredAt: '2022-12-05',
    lastVisit: '2023-07-14',
    nextAppointment: '2023-12-10',
    status: 'active',
  },
  {
    id: 'P009',
    name: 'Jessica Day',
    dateOfBirth: '1986-05-14',
    gender: 'Female',
    phone: '(555) 890-1234',
    email: 'j.day@example.com',
    address: '369 Ash Lane, Anytown',
    bloodType: 'A+',
    allergies: ['Peanuts'],
    insuranceProvider: 'BlueCross',
    insuranceNumber: 'BC-456123789',
    registeredAt: '2021-08-30',
    lastVisit: '2023-10-01',
    nextAppointment: '2023-11-25',
    status: 'active',
  },
  {
    id: 'P010',
    name: 'Raymond Holt',
    dateOfBirth: '1960-02-18',
    gender: 'Male',
    phone: '(555) 901-2345',
    email: 'r.holt@example.com',
    address: '741 Redwood Circle, Anytown',
    bloodType: 'AB-',
    allergies: [],
    insuranceProvider: 'Aetna',
    insuranceNumber: 'AT-789456123',
    registeredAt: '2020-01-10',
    lastVisit: '2023-06-22',
    nextAppointment: null,
    status: 'active',
  },
];

const mockStaff: Staff[] = [
  {
    id: 'S001',
    name: 'Dr. Sarah Khair',
    role: 'dentist',
    specialization: 'General Dentistry & Orthodontics',
    phone: '(555) 111-2222',
    email: 'dr.khair@khairdental.com',
    schedule: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
    avatarInitials: 'SK',
    yearsExperience: 15,
  },
  {
    id: 'S002',
    name: 'Dr. Michael Chen',
    role: 'dentist',
    specialization: 'Endodontics',
    phone: '(555) 222-3333',
    email: 'dr.chen@khairdental.com',
    schedule: ['Wednesday', 'Thursday', 'Friday'],
    avatarInitials: 'MC',
    yearsExperience: 8,
  },
  {
    id: 'S003',
    name: 'Emma Watson',
    role: 'hygienist',
    specialization: 'Dental Hygiene',
    phone: '(555) 333-4444',
    email: 'emma.w@khairdental.com',
    schedule: ['Monday', 'Tuesday', 'Wednesday', 'Friday'],
    avatarInitials: 'EW',
    yearsExperience: 5,
  },
  {
    id: 'S004',
    name: 'James Rodriguez',
    role: 'hygienist',
    specialization: 'Dental Hygiene',
    phone: '(555) 444-5555',
    email: 'james.r@khairdental.com',
    schedule: ['Tuesday', 'Thursday', 'Saturday'],
    avatarInitials: 'JR',
    yearsExperience: 3,
  },
  {
    id: 'S005',
    name: 'Olivia Pope',
    role: 'admin',
    specialization: 'Clinic Management',
    phone: '(555) 555-6666',
    email: 'olivia.p@khairdental.com',
    schedule: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    avatarInitials: 'OP',
    yearsExperience: 10,
  },
];

const today = new Date().toISOString().split('T')[0];

const mockAppointments: Appointment[] = [
  { id: 'A001', patientId: 'P001', patientName: 'Eleanor Vance', dentistId: 'S001', dentistName: 'Dr. Sarah Khair', date: today, time: '09:00', duration: 30, type: 'checkup', status: 'completed', notes: 'Routine checkup.' },
  { id: 'A002', patientId: 'P003', patientName: 'Sophia Sterling', dentistId: 'S002', dentistName: 'Dr. Michael Chen', date: today, time: '10:30', duration: 60, type: 'rootCanal', status: 'completed', notes: 'Stage 1 root canal on tooth 14.' },
  { id: 'A003', patientId: 'P005', patientName: 'Amara Singh', dentistId: 'S001', dentistName: 'Dr. Sarah Khair', date: today, time: '13:00', duration: 45, type: 'cleaning', status: 'scheduled', notes: 'Deep cleaning.' },
  { id: 'A004', patientId: 'P007', patientName: 'Chloe Decker', dentistId: 'S001', dentistName: 'Dr. Sarah Khair', date: today, time: '14:30', duration: 30, type: 'consultation', status: 'scheduled', notes: 'Whitening consultation.' },
  { id: 'A005', patientId: 'P009', patientName: 'Jessica Day', dentistId: 'S002', dentistName: 'Dr. Michael Chen', date: today, time: '15:30', duration: 60, type: 'filling', status: 'scheduled', notes: 'Composite filling on tooth 3.' },
  { id: 'A006', patientId: 'P002', patientName: 'Marcus Thorne', dentistId: 'S001', dentistName: 'Dr. Sarah Khair', date: '2023-11-01', time: '10:00', duration: 30, type: 'checkup', status: 'scheduled', notes: '' },
  { id: 'A007', patientId: 'P008', patientName: 'Winston Schmidt', dentistId: 'S001', dentistName: 'Dr. Sarah Khair', date: '2023-11-02', time: '11:00', duration: 45, type: 'cleaning', status: 'scheduled', notes: '' },
  { id: 'A008', patientId: 'P006', patientName: 'David Palmer', dentistId: 'S002', dentistName: 'Dr. Michael Chen', date: '2023-11-03', time: '14:00', duration: 60, type: 'extraction', status: 'scheduled', notes: 'Wisdom tooth evaluation.' },
  { id: 'A009', patientId: 'P010', patientName: 'Raymond Holt', dentistId: 'S001', dentistName: 'Dr. Sarah Khair', date: '2023-10-20', time: '09:30', duration: 30, type: 'checkup', status: 'completed', notes: 'All clear.' },
  { id: 'A010', patientId: 'P004', patientName: 'Julian Bashir', dentistId: 'S002', dentistName: 'Dr. Michael Chen', date: '2023-10-15', time: '16:00', duration: 60, type: 'consultation', status: 'no-show', notes: '' },
  { id: 'A011', patientId: 'P001', patientName: 'Eleanor Vance', dentistId: 'S001', dentistName: 'Dr. Sarah Khair', date: '2023-11-20', time: '09:00', duration: 60, type: 'whitening', status: 'scheduled', notes: '' },
  { id: 'A012', patientId: 'P003', patientName: 'Sophia Sterling', dentistId: 'S002', dentistName: 'Dr. Michael Chen', date: '2023-11-02', time: '10:00', duration: 60, type: 'rootCanal', status: 'scheduled', notes: 'Stage 2 root canal on tooth 14.' },
  { id: 'A013', patientId: 'P005', patientName: 'Amara Singh', dentistId: 'S001', dentistName: 'Dr. Sarah Khair', date: '2023-11-15', time: '14:00', duration: 30, type: 'checkup', status: 'scheduled', notes: '' },
  { id: 'A014', patientId: 'P008', patientName: 'Winston Schmidt', dentistId: 'S001', dentistName: 'Dr. Sarah Khair', date: '2023-12-10', time: '11:00', duration: 45, type: 'cleaning', status: 'scheduled', notes: '' },
  { id: 'A015', patientId: 'P009', patientName: 'Jessica Day', dentistId: 'S001', dentistName: 'Dr. Sarah Khair', date: '2023-11-25', time: '15:30', duration: 60, type: 'filling', status: 'scheduled', notes: '' },
];

const mockTreatments: Treatment[] = [
  { id: 'T001', patientId: 'P001', patientName: 'Eleanor Vance', dentistId: 'S001', dentistName: 'Dr. Sarah Khair', date: '2023-10-05', toothNumber: null, procedure: 'Comprehensive Oral Exam', description: 'Routine checkup and x-rays.', cost: 150, status: 'completed' },
  { id: 'T002', patientId: 'P003', patientName: 'Sophia Sterling', dentistId: 'S002', dentistName: 'Dr. Michael Chen', date: '2023-10-18', toothNumber: '14', procedure: 'Root Canal Therapy - Stage 1', description: 'Extirpation of pulp, cleaning and shaping.', cost: 800, status: 'completed' },
  { id: 'T003', patientId: 'P005', patientName: 'Amara Singh', dentistId: 'S001', dentistName: 'Dr. Sarah Khair', date: '2023-10-25', toothNumber: null, procedure: 'Prophylaxis', description: 'Routine dental cleaning.', cost: 120, status: 'completed' },
  { id: 'T004', patientId: 'P002', patientName: 'Marcus Thorne', dentistId: 'S001', dentistName: 'Dr. Sarah Khair', date: '2023-09-12', toothNumber: '18', procedure: 'Simple Extraction', description: 'Removal of erupted tooth.', cost: 250, status: 'completed' },
  { id: 'T005', patientId: 'P007', patientName: 'Chloe Decker', dentistId: 'S001', dentistName: 'Dr. Sarah Khair', date: '2023-09-30', toothNumber: null, procedure: 'Teeth Whitening Consultation', description: 'Discussed options for in-office whitening.', cost: 50, status: 'completed' },
  { id: 'T006', patientId: 'P009', patientName: 'Jessica Day', dentistId: 'S002', dentistName: 'Dr. Michael Chen', date: '2023-10-01', toothNumber: '3', procedure: 'Resin-based Composite', description: 'Two surfaces, posterior.', cost: 200, status: 'completed' },
  { id: 'T007', patientId: 'P010', patientName: 'Raymond Holt', dentistId: 'S001', dentistName: 'Dr. Sarah Khair', date: '2023-06-22', toothNumber: null, procedure: 'Periodic Oral Exam', description: 'Routine 6-month checkup.', cost: 100, status: 'completed' },
  { id: 'T008', patientId: 'P008', patientName: 'Winston Schmidt', dentistId: 'S001', dentistName: 'Dr. Sarah Khair', date: '2023-07-14', toothNumber: null, procedure: 'Prophylaxis', description: 'Routine dental cleaning.', cost: 120, status: 'completed' },
  { id: 'T009', patientId: 'P001', patientName: 'Eleanor Vance', dentistId: 'S001', dentistName: 'Dr. Sarah Khair', date: '2023-11-20', toothNumber: null, procedure: 'In-office Whitening', description: 'Full mouth laser whitening.', cost: 400, status: 'planned' },
  { id: 'T010', patientId: 'P003', patientName: 'Sophia Sterling', dentistId: 'S002', dentistName: 'Dr. Michael Chen', date: '2023-11-02', toothNumber: '14', procedure: 'Root Canal Therapy - Stage 2', description: 'Obturation and temporary filling.', cost: 600, status: 'planned' },
];

const mockInvoices: Invoice[] = [
  { id: 'INV-2023-001', patientId: 'P001', patientName: 'Eleanor Vance', date: '2023-10-05', dueDate: '2023-10-19', items: [{ procedure: 'Comprehensive Oral Exam', cost: 150 }], subtotal: 150, tax: 15, total: 165, status: 'paid', paymentMethod: 'Credit Card' },
  { id: 'INV-2023-002', patientId: 'P003', patientName: 'Sophia Sterling', date: '2023-10-18', dueDate: '2023-11-01', items: [{ procedure: 'Root Canal Therapy - Stage 1', cost: 800 }], subtotal: 800, tax: 80, total: 880, status: 'pending', paymentMethod: null },
  { id: 'INV-2023-003', patientId: 'P005', patientName: 'Amara Singh', date: '2023-10-25', dueDate: '2023-11-08', items: [{ procedure: 'Prophylaxis', cost: 120 }], subtotal: 120, tax: 12, total: 132, status: 'paid', paymentMethod: 'Insurance' },
  { id: 'INV-2023-004', patientId: 'P002', patientName: 'Marcus Thorne', date: '2023-09-12', dueDate: '2023-09-26', items: [{ procedure: 'Simple Extraction', cost: 250 }], subtotal: 250, tax: 25, total: 275, status: 'overdue', paymentMethod: null },
  { id: 'INV-2023-005', patientId: 'P007', patientName: 'Chloe Decker', date: '2023-09-30', dueDate: '2023-10-14', items: [{ procedure: 'Teeth Whitening Consultation', cost: 50 }], subtotal: 50, tax: 5, total: 55, status: 'paid', paymentMethod: 'Debit Card' },
  { id: 'INV-2023-006', patientId: 'P009', patientName: 'Jessica Day', date: '2023-10-01', dueDate: '2023-10-15', items: [{ procedure: 'Resin-based Composite', cost: 200 }], subtotal: 200, tax: 20, total: 220, status: 'paid', paymentMethod: 'Credit Card' },
  { id: 'INV-2023-007', patientId: 'P010', patientName: 'Raymond Holt', date: '2023-06-22', dueDate: '2023-07-06', items: [{ procedure: 'Periodic Oral Exam', cost: 100 }], subtotal: 100, tax: 10, total: 110, status: 'paid', paymentMethod: 'Insurance' },
  { id: 'INV-2023-008', patientId: 'P008', patientName: 'Winston Schmidt', date: '2023-07-14', dueDate: '2023-07-28', items: [{ procedure: 'Prophylaxis', cost: 120 }], subtotal: 120, tax: 12, total: 132, status: 'paid', paymentMethod: 'Cash' },
];

export const dataStore = {
  patients: mockPatients,
  staff: mockStaff,
  appointments: mockAppointments,
  treatments: mockTreatments,
  invoices: mockInvoices,
};
