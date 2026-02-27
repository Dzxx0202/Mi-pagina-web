import { User, Specialist, Appointment, Sanction } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'paciente@demo.com',
    name: 'María González',
    role: 'patient',
  },
  {
    id: '2',
    email: 'admin@demo.com',
    name: 'Carlos Administrador',
    role: 'admin',
  },
];

export const mockSpecialists: Specialist[] = [
  {
    id: 's1',
    name: 'Dr. Juan Pérez',
    specialty: 'Cardiología',
    photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop',
    available: true,
  },
  {
    id: 's2',
    name: 'Dra. Ana Martínez',
    specialty: 'Dermatología',
    photo: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop',
    available: true,
  },
  {
    id: 's3',
    name: 'Dr. Roberto Sánchez',
    specialty: 'Neurología',
    photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop',
    available: true,
  },
  {
    id: 's4',
    name: 'Dra. Laura Fernández',
    specialty: 'Pediatría',
    photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop',
    available: false,
  },
  {
    id: 's5',
    name: 'Dr. Miguel Torres',
    specialty: 'Traumatología',
    photo: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop',
    available: true,
  },
  {
    id: 's6',
    name: 'Dra. Carmen Ruiz',
    specialty: 'Oftalmología',
    photo: 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=400&h=400&fit=crop',
    available: true,
  },
];

export const mockAppointments: Appointment[] = [
  {
    id: 'a1',
    patientId: '1',
    patientName: 'María González',
    specialistId: 's1',
    specialistName: 'Dr. Juan Pérez',
    specialty: 'Cardiología',
    date: '2026-03-05',
    time: '10:00',
    status: 'scheduled',
  },
  {
    id: 'a2',
    patientId: '1',
    patientName: 'María González',
    specialistId: 's2',
    specialistName: 'Dra. Ana Martínez',
    specialty: 'Dermatología',
    date: '2026-02-20',
    time: '14:30',
    status: 'completed',
  },
  {
    id: 'a3',
    patientId: '3',
    patientName: 'Pedro Rodríguez',
    specialistId: 's3',
    specialistName: 'Dr. Roberto Sánchez',
    specialty: 'Neurología',
    date: '2026-03-10',
    time: '09:00',
    status: 'scheduled',
  },
  {
    id: 'a4',
    patientId: '4',
    patientName: 'Lucía Morales',
    specialistId: 's5',
    specialistName: 'Dr. Miguel Torres',
    specialty: 'Traumatología',
    date: '2026-03-08',
    time: '11:30',
    status: 'scheduled',
  },
];

export const mockSanctions: Sanction[] = [
  {
    id: 'san1',
    patientId: '5',
    patientName: 'José García',
    reason: 'No asistió a 2 citas consecutivas sin avisar',
    date: '2026-02-15',
    type: 'warning',
  },
];

export const specialties = [
  'Cardiología',
  'Dermatología',
  'Neurología',
  'Pediatría',
  'Traumatología',
  'Oftalmología',
  'Medicina General',
  'Ginecología',
  'Psiquiatría',
  'Urología',
];
