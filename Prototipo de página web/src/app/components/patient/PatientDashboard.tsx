import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Calendar, Search, Clock, UserCheck, Plus, CheckCircle, XCircle } from 'lucide-react';
import { mockSpecialists, mockAppointments, specialties } from '../../data/mockData';
import { Specialist, Appointment } from '../../types';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { toast } from 'sonner';

export const PatientDashboard: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [appointments, setAppointments] = useState<Appointment[]>(
    mockAppointments.filter(a => a.patientId === user?.id)
  );
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedSpecialist, setSelectedSpecialist] = useState<Specialist | null>(null);

  const filteredSpecialists = mockSpecialists.filter(specialist => {
    const matchesSearch = specialist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         specialist.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'all' || specialist.specialty === selectedSpecialty;
    const isAvailable = specialist.available;
    
    return matchesSearch && matchesSpecialty && isAvailable;
  });

  const handleBookAppointment = (specialist: Specialist) => {
    if (!selectedDate || !selectedTime) {
      toast.error('Por favor seleccione fecha y hora');
      return;
    }

    const newAppointment: Appointment = {
      id: `a${Date.now()}`,
      patientId: user!.id,
      patientName: user!.name,
      specialistId: specialist.id,
      specialistName: specialist.name,
      specialty: specialist.specialty,
      date: selectedDate,
      time: selectedTime,
      status: 'scheduled',
    };

    setAppointments([...appointments, newAppointment]);
    setSelectedDate('');
    setSelectedTime('');
    setSelectedSpecialist(null);
    toast.success('Cita agendada exitosamente');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge className="bg-blue-500">Programada</Badge>;
      case 'completed':
        return <Badge className="bg-green-500">Completada</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500">Cancelada</Badge>;
      case 'postponed':
        return <Badge className="bg-yellow-500">Aplazada</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Bienvenido, {user?.name}</h2>
          <p className="text-gray-600 mt-1">Gestiona tus citas médicas</p>
        </div>
      </div>

      {/* Mis Citas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Mis Citas
          </CardTitle>
          <CardDescription>Historial y citas próximas</CardDescription>
        </CardHeader>
        <CardContent>
          {appointments.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No tiene citas programadas</p>
          ) : (
            <div className="space-y-3">
              {appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      {appointment.status === 'completed' ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : appointment.status === 'cancelled' ? (
                        <XCircle className="w-6 h-6 text-red-600" />
                      ) : (
                        <Clock className="w-6 h-6 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{appointment.specialistName}</p>
                      <p className="text-sm text-gray-600">{appointment.specialty}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(appointment.date).toLocaleDateString('es-ES', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })} - {appointment.time}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(appointment.status)}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Buscar y Agendar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5 text-blue-600" />
            Buscar Especialistas
          </CardTitle>
          <CardDescription>Encuentra y agenda tu próxima cita</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Buscar por nombre o especialidad</Label>
              <Input
                placeholder="Ej: Cardiología, Dr. Juan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label>Filtrar por especialidad</Label>
              <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas las especialidades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las especialidades</SelectItem>
                  {specialties.map((specialty) => (
                    <SelectItem key={specialty} value={specialty}>
                      {specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {filteredSpecialists.map((specialist) => (
              <Card key={specialist.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-square overflow-hidden bg-gray-100">
                  <img
                    src={specialist.photo}
                    alt={specialist.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">{specialist.name}</h3>
                      <p className="text-sm text-gray-600">{specialist.specialty}</p>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      <UserCheck className="w-3 h-3 mr-1" />
                      Disponible
                    </Badge>
                  </div>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        className="w-full mt-3 bg-blue-600 hover:bg-blue-700"
                        size="sm"
                        onClick={() => setSelectedSpecialist(specialist)}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Agendar Cita
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Agendar Cita</DialogTitle>
                        <DialogDescription>
                          {specialist.name} - {specialist.specialty}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        <div className="space-y-2">
                          <Label>Fecha</Label>
                          <Input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Hora</Label>
                          <Select value={selectedTime} onValueChange={setSelectedTime}>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione una hora" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="08:00">08:00</SelectItem>
                              <SelectItem value="09:00">09:00</SelectItem>
                              <SelectItem value="10:00">10:00</SelectItem>
                              <SelectItem value="11:00">11:00</SelectItem>
                              <SelectItem value="14:00">14:00</SelectItem>
                              <SelectItem value="15:00">15:00</SelectItem>
                              <SelectItem value="16:00">16:00</SelectItem>
                              <SelectItem value="17:00">17:00</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button
                          onClick={() => handleBookAppointment(specialist)}
                          className="w-full bg-blue-600 hover:bg-blue-700"
                        >
                          Confirmar Cita
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredSpecialists.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Search className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p>No se encontraron especialistas disponibles</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
