import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, password: string): boolean => {
    // Mock authentication - credentials de demostración
    if (email === 'paciente@demo.com' && password === 'paciente123') {
      setUser({
        id: '1',
        email: 'paciente@demo.com',
        name: 'María González',
        role: 'patient',
      });
      return true;
    }
    if (email === 'admin@demo.com' && password === 'admin123') {
      setUser({
        id: '2',
        email: 'admin@demo.com',
        name: 'Carlos Administrador',
        role: 'admin',
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
