"use client";

import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Vivienda } from '@/features/viviendas/services';
import { 
  Home, 
  User, 
  Users, 
  MapPin, 
  Calendar,
  FileText,
  Building,
  UserCheck,
  UserX
} from "lucide-react";

interface VisualizarViviendaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vivienda: any | null;
}

export function VisualizarViviendaModal({ open, onOpenChange, vivienda }: VisualizarViviendaModalProps) {
  if (!vivienda) return null;

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'ocupada': return 'bg-blue-600';
      case 'alquilada': return 'bg-yellow-600';
      case 'disponible': return 'bg-green-600';
      default: return 'bg-gray-600';
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'ocupada': return <UserCheck className="w-4 h-4" />;
      case 'alquilada': return <Users className="w-4 h-4" />;
      case 'disponible': return <Home className="w-4 h-4" />;
      default: return <UserX className="w-4 h-4" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Home className="w-5 h-5 text-blue-500" />
            Detalles de la Vivienda {vivienda.numero_casa}
          </DialogTitle>
          <DialogDescription>
            Información completa de la unidad habitacional
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información Básica */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Building className="w-4 h-4" />
              Información Básica
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">Número de Casa</label>
                <p className="text-lg font-mono font-bold">{vivienda.numero_casa}</p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">Bloque</label>
                <p className="text-lg font-semibold">{vivienda.bloque}</p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">Tipo de Vivienda</label>
                <p className="text-lg capitalize">{vivienda.tipo_vivienda}</p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">Área</label>
                <p className="text-lg">{vivienda.metros_cuadrados} m²</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Estado de Ocupación */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Users className="w-4 h-4" />
              Estado de Ocupación
            </h3>
            
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${getEstadoColor(vivienda.estado_ocupacion || 'disponible')}`}>
                {getEstadoIcon(vivienda.estado_ocupacion || 'disponible')}
              </div>
              <div>
                <Badge
                  variant="outline"
                  className={`text-lg px-3 py-1 ${
                    vivienda.estado_ocupacion === 'ocupada' 
                      ? 'border-blue-500 text-blue-600' 
                      : vivienda.estado_ocupacion === 'alquilada'
                        ? 'border-yellow-500 text-yellow-600'
                        : 'border-green-500 text-green-600'
                  }`}
                >
                  {vivienda.estado_ocupacion === 'ocupada' ? 'OCUPADA POR PROPIETARIO' : 
                   vivienda.estado_ocupacion === 'alquilada' ? 'ALQUILADA A INQUILINO' : 'DISPONIBLE'}
                </Badge>
              </div>
            </div>

            {/* Información de los Residentes */}
            <div className="space-y-3">
              {/* Propietarios */}
              {vivienda.propiedades && vivienda.propiedades.length > 0 && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200">
                  <h4 className="font-medium mb-3 flex items-center gap-2 text-blue-700">
                    <UserCheck className="w-4 h-4" />
                    Propietario(s)
                  </h4>
                  <div className="space-y-2">
                    {vivienda.propiedades.map((prop: any, index: number) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-blue-800">
                            {prop.persona_info?.nombre_completo || 
                             `${prop.persona_info?.nombre || ''} ${prop.persona_info?.apellido || ''}`.trim()}
                          </p>
                          <p className="text-sm text-blue-600">
                            📧 {prop.persona_info?.telefono || prop.persona_info?.email || 'Sin contacto'}
                          </p>
                        </div>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                          Propietario
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Inquilinos */}
              {vivienda.inquilinos_activos && vivienda.inquilinos_activos.length > 0 && (
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200">
                  <h4 className="font-medium mb-3 flex items-center gap-2 text-yellow-700">
                    <Users className="w-4 h-4" />
                    Inquilino(s)
                  </h4>
                  <div className="space-y-2">
                    {vivienda.inquilinos_activos.map((inquilino: any, index: number) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-yellow-800">
                            {inquilino.persona_info?.nombre_completo || 
                             `${inquilino.persona_info?.nombre || ''} ${inquilino.persona_info?.apellido || ''}`.trim()}
                          </p>
                          <p className="text-sm text-yellow-600">
                            📧 {inquilino.persona_info?.telefono || inquilino.persona_info?.email || 'Sin contacto'}
                          </p>
                        </div>
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                          Inquilino
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Estado disponible */}
              {(!vivienda.propiedades || vivienda.propiedades.length === 0) && 
               (!vivienda.inquilinos_activos || vivienda.inquilinos_activos.length === 0) && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 text-center">
                  <Home className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="text-green-700 font-medium">Vivienda Disponible</p>
                  <p className="text-sm text-green-600">Sin residentes asignados</p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Información Financiera */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Información Financiera
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">Tarifa Base Expensas</label>
                <p className="text-xl font-bold text-green-600">
                  Bs {vivienda.tarifa_base_expensas}
                </p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">Cobranza Real</label>
                <p className="text-xl font-bold text-blue-600">
                  Bs {vivienda.cobranza_real || vivienda.tarifa_base_expensas}
                </p>
                {vivienda.estado_ocupacion === 'alquilada' && (
                  <p className="text-xs text-gray-500">
                    Monto cobrado al inquilino
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">Método de Cálculo</label>
                <p className="text-lg">
                  {vivienda.tipo_cobranza === 'por_casa' ? 'Por Casa (Tarifa Fija)' : 
                   vivienda.tipo_cobranza === 'por_metro_cuadrado' ? 'Por Metro Cuadrado' : 
                   vivienda.tipo_cobranza}
                </p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">Estado Sistema</label>
                <Badge
                  variant={vivienda.estado === 'activa' ? 'default' : 'secondary'}
                  className={vivienda.estado === 'activa' ? 'bg-green-600' : 'bg-gray-600'}
                >
                  {vivienda.estado === 'activa' ? 'ACTIVA' : 'INACTIVA'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Información Adicional */}
          {(vivienda.created_at || vivienda.updated_at) && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Información del Sistema
                </h3>
                
                <div className="grid grid-cols-1 gap-2 text-sm text-gray-600">
                  {vivienda.created_at && (
                    <p>📅 Registrada: {new Date(vivienda.created_at).toLocaleDateString()}</p>
                  )}
                  {vivienda.updated_at && (
                    <p>🔄 Última actualización: {new Date(vivienda.updated_at).toLocaleDateString()}</p>
                  )}
                  <p>🆔 ID Sistema: {vivienda.id}</p>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}