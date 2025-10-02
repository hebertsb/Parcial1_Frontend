'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

interface ActivityItem {
  id: string;
  tipo: 'acceso_autorizado' | 'acceso_denegado' | 'qr_valido' | 'qr_invalido' | 'sistema';
  usuario: string;
  descripcion: string;
  timestamp: string;
  estado: 'exitoso' | 'fallido' | 'pendiente';
  detalles?: {
    confianza?: number;
    metodo?: 'facial' | 'qr' | 'manual';
    unidad?: string;
    documento?: string;
    tipo_residente?: string;
  };
}

interface ActivityContextType {
  activities: ActivityItem[];
  addActivity: (activity: Omit<ActivityItem, 'id' | 'timestamp'>) => void;
  clearActivities: () => void;
  getRecentActivities: (limit?: number) => ActivityItem[];
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

export function ActivityProvider({ children }: { children: React.ReactNode }) {
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  const addActivity = useCallback((activity: Omit<ActivityItem, 'id' | 'timestamp'>) => {
    const newActivity: ActivityItem = {
      ...activity,
      id: `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString()
    };

    setActivities(prev => [newActivity, ...prev].slice(0, 50)); // Mantener solo las últimas 50 actividades
    
    console.log('🎯 Nueva actividad registrada:', newActivity);
  }, []);

  const clearActivities = useCallback(() => {
    setActivities([]);
  }, []);

  const getRecentActivities = useCallback((limit: number = 10) => {
    return activities.slice(0, limit);
  }, [activities]);

  return (
    <ActivityContext.Provider value={{ activities, addActivity, clearActivities, getRecentActivities }}>
      {children}
    </ActivityContext.Provider>
  );
}

export function useActivity() {
  const context = useContext(ActivityContext);
  if (context === undefined) {
    throw new Error('useActivity must be used within an ActivityProvider');
  }
  return context;
}

// Utilidad para formatear tiempo relativo
export function formatTimeAgo(timestamp: string): string {
  const now = new Date();
  const time = new Date(timestamp);
  const diffMs = now.getTime() - time.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Ahora';
  if (diffMins < 60) return `Hace ${diffMins}m`;
  if (diffHours < 24) return `Hace ${diffHours}h`;
  return `Hace ${diffDays}d`;
}

// Utilidad para formatear timestamp legible
export function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}