import React from 'react';
import { useAuth } from '../context/AuthContext';
import { PatientDashboard } from './patient/PatientDashboard';
import { AdminDashboard } from './admin/AdminDashboard';

export const DashboardRouter: React.FC = () => {
  const { user } = useAuth();
  
  if (!user) return null;
  
  if (user.role === 'admin') {
    return <AdminDashboard />;
  }
  
  return <PatientDashboard />;
};
