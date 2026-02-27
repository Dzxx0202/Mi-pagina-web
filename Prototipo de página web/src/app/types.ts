export interface User {
  id: string;
  email: string;
  name: string;
  role: 'patient' | 'admin';
}

export interface Specialist {
  id: string;
  name: string;
  specialty: string;
  photo: string;
  available: boolean;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  specialistId: string;
  specialistName: string;
  specialty: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'postponed';
  reason?: string;
}

export interface Sanction {
  id: string;
  patientId: string;
  patientName: string;
  reason: string;
  date: string;
  type: 'warning' | 'suspension';
}
