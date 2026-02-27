import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import {
  Calendar,
  Users,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Edit,
  FileText,
} from 'lucide-react';
import { mockAppointments, mockSanctions } from '../../data/mockData';
import { Appointment, Sanction } from '../../types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { toast } from 'sonner';

export const AdminDashboard: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [sanctions, setSanctions] = useState<Sanction[]>(mockSanctions);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [newStatus, setNewStatus] = useState<string>('');
  const [reason, setReason] = useState('');
  const [newPostponedDate, setNewPostponedDate] = useState('');
  const [newPostponedTime, setNewPostponedTime] = useState('');

  // Nueva sanción
  const [sanctionPatientName, setSanctionPatientName] = useState('');
  const [sanctionReason, setSanctionReason] = useState('');
  const [sanctionType, setSanctionType] = useState<'warning' | 'suspension'>('warning');

  const handleUpdateStatus = () => {
    if (!selectedAppointment || !newStatus) return;

    const updatedAppointments = appointments.map((apt) => {
      if (apt.id === selectedAppointment.id) {
        const updated: Appointment = {
          ...apt,
          status: newStatus as any,
          reason: reason || undefined,
        };
        
        if (newStatus === 'postponed' && newPostponedDate && newPostponedTime) {
          updated.date = newPostponedDate;
          updated.time = newPostponedTime;
        }
        
        return updated;
      }
      return apt;
    });

    setAppointments(updatedAppointments);
    setSelectedAppointment(null);
    setNewStatus('');
    setReason('');
    setNewPostponedDate('');
    setNewPostponedTime('');
    toast.success('Estado de la cita actualizado');
  };

  const handleAddSanction = () => {
    if (!sanctionPatientName || !sanctionReason) {
      toast.error('Complete todos los campos');
      return;
    }

    const newSanction: Sanction = {
      id: `san${Date.now()}`,
      patientId: `patient${Date.now()}`,
      patientName: sanctionPatientName,
      reason: sanctionReason,
      date: new Date().toISOString().split('T')[0],
      type: sanctionType,
    };

    setSanctions([...sanctions, newSanction]);
    setSanctionPatientName('');
    setSanctionReason('');
    setSanctionType('warning');
    toast.success('Sanción registrada exitosamente');
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

  const stats = {
    total: appointments.length,
    scheduled: appointments.filter((a) => a.status === 'scheduled').length,
    completed: appointments.filter((a) => a.status === 'completed').length,
    cancelled: appointments.filter((a) => a.status === 'cancelled').length,
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Panel de Administración</h2>
        <p className="text-gray-600 mt-1">Gestione citas, cancelaciones y sanciones</p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Citas</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Programadas</p>
                <p className="text-2xl font-bold text-blue-600">{stats.scheduled}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completadas</p>
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Canceladas</p>
                <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="appointments" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="appointments">Gestión de Citas</TabsTrigger>
          <TabsTrigger value="sanctions">Sanciones</TabsTrigger>
        </TabsList>

        <TabsContent value="appointments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Todas las Citas
              </CardTitle>
              <CardDescription>Procese, cancele o aplace citas médicas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {appointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="font-semibold text-gray-900">{appointment.patientName}</p>
                        {getStatusBadge(appointment.status)}
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                        <p>Especialista: {appointment.specialistName}</p>
                        <p>Especialidad: {appointment.specialty}</p>
                        <p>
                          Fecha:{' '}
                          {new Date(appointment.date).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                        <p>Hora: {appointment.time}</p>
                      </div>
                      {appointment.reason && (
                        <p className="text-sm text-gray-500 mt-2">Motivo: {appointment.reason}</p>
                      )}
                    </div>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedAppointment(appointment)}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Editar
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-lg">
                        <DialogHeader>
                          <DialogTitle>Actualizar Estado de Cita</DialogTitle>
                          <DialogDescription>
                            Paciente: {appointment.patientName} - {appointment.specialty}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 mt-4">
                          <div className="space-y-2">
                            <Label>Nuevo Estado</Label>
                            <Select value={newStatus} onValueChange={setNewStatus}>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccione un estado" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="scheduled">Programada</SelectItem>
                                <SelectItem value="completed">Completada</SelectItem>
                                <SelectItem value="cancelled">Cancelada</SelectItem>
                                <SelectItem value="postponed">Aplazada</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {newStatus === 'postponed' && (
                            <>
                              <div className="space-y-2">
                                <Label>Nueva Fecha</Label>
                                <Input
                                  type="date"
                                  value={newPostponedDate}
                                  onChange={(e) => setNewPostponedDate(e.target.value)}
                                  min={new Date().toISOString().split('T')[0]}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Nueva Hora</Label>
                                <Input
                                  type="time"
                                  value={newPostponedTime}
                                  onChange={(e) => setNewPostponedTime(e.target.value)}
                                />
                              </div>
                            </>
                          )}

                          <div className="space-y-2">
                            <Label>Motivo / Observaciones (opcional)</Label>
                            <Textarea
                              placeholder="Ingrese el motivo del cambio..."
                              value={reason}
                              onChange={(e) => setReason(e.target.value)}
                              rows={3}
                            />
                          </div>

                          <Button
                            onClick={handleUpdateStatus}
                            className="w-full bg-blue-600 hover:bg-blue-700"
                            disabled={!newStatus}
                          >
                            Actualizar Estado
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sanctions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                Registrar Nueva Sanción
              </CardTitle>
              <CardDescription>Agregue advertencias o suspensiones a pacientes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nombre del Paciente</Label>
                  <Input
                    placeholder="Nombre completo"
                    value={sanctionPatientName}
                    onChange={(e) => setSanctionPatientName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tipo de Sanción</Label>
                  <Select
                    value={sanctionType}
                    onValueChange={(value: any) => setSanctionType(value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="warning">Advertencia</SelectItem>
                      <SelectItem value="suspension">Suspensión</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Motivo de la Sanción</Label>
                <Textarea
                  placeholder="Describa el motivo de la sanción..."
                  value={sanctionReason}
                  onChange={(e) => setSanctionReason(e.target.value)}
                  rows={3}
                />
              </div>
              <Button
                onClick={handleAddSanction}
                className="w-full bg-orange-600 hover:bg-orange-700"
              >
                <FileText className="w-4 h-4 mr-2" />
                Registrar Sanción
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Historial de Sanciones</CardTitle>
              <CardDescription>Registro de advertencias y suspensiones</CardDescription>
            </CardHeader>
            <CardContent>
              {sanctions.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No hay sanciones registradas</p>
              ) : (
                <div className="space-y-3">
                  {sanctions.map((sanction) => (
                    <div
                      key={sanction.id}
                      className="p-4 border rounded-lg bg-orange-50 border-orange-200"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">{sanction.patientName}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(sanction.date).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className={
                            sanction.type === 'suspension'
                              ? 'bg-red-100 text-red-700 border-red-300'
                              : 'bg-yellow-100 text-yellow-700 border-yellow-300'
                          }
                        >
                          {sanction.type === 'warning' ? 'Advertencia' : 'Suspensión'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-700">{sanction.reason}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
