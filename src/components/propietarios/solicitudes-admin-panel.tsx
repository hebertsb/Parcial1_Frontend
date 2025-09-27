'use client'

/**
 * Panel de administración de solicitudes de propietarios
 * Permite al admin revisar, aprobar o rechazar solicitudes
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  CheckCircle, 
  XCircle, 
  Eye, 
  Loader2, 
  Users, 
  Calendar,
  Mail,
  Phone,
  Home,
  FileText
} from 'lucide-react';
import { usePropietarios } from '@/hooks/usePropietarios';
import type { SolicitudPendiente } from '@/features/propietarios/services';
import { FotosReconocimientoView } from '@/components/facial/fotos-reconocimiento-view';

export function SolicitudesAdminPanel() {
  const { 
    solicitudes, 
    loading, 
    error, 
    aprobarSolicitud, 
    rechazarSolicitud,
    cargarSolicitudesPendientes 
  } = usePropietarios();

  const [selectedSolicitud, setSelectedSolicitud] = useState<SolicitudPendiente | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'aprobar' | 'rechazar' | null>(null);
  const [observaciones, setObservaciones] = useState('');
  const [motivoRechazo, setMotivoRechazo] = useState('');

  const solicitudesPendientes = solicitudes.filter(s => s.estado === 'PENDIENTE');

  const handleVerDetalle = (solicitud: SolicitudPendiente) => {
    setSelectedSolicitud(solicitud);
    setDialogOpen(true);
    setActionType(null);
    setObservaciones('');
    setMotivoRechazo('');
  };

  const handleAccion = (tipo: 'aprobar' | 'rechazar') => {
    setActionType(tipo);
  };

  const confirmarAccion = async () => {
    if (!selectedSolicitud) return;

    setActionLoading(true);
    let resultado = false;

    if (actionType === 'aprobar') {
      resultado = await aprobarSolicitud(selectedSolicitud.id, observaciones);
    } else if (actionType === 'rechazar') {
      resultado = await rechazarSolicitud(selectedSolicitud.id, motivoRechazo);
    }

    if (resultado) {
      setDialogOpen(false);
      setSelectedSolicitud(null);
      setActionType(null);
      setObservaciones('');
      setMotivoRechazo('');
    }

    setActionLoading(false);
  };

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'PENDIENTE':
        return <Badge variant="secondary">Pendiente</Badge>;
      case 'APROBADA':
        return <Badge variant="default" className="bg-green-500">Aprobada</Badge>;
      case 'RECHAZADA':
        return <Badge variant="destructive">Rechazada</Badge>;
      default:
        return <Badge variant="outline">{estado}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Solicitudes de Propietarios</h2>
          <p className="text-muted-foreground">
            Revisa y gestiona las solicitudes de registro de nuevos propietarios
          </p>
        </div>
        
        <Button 
          variant="outline" 
          onClick={cargarSolicitudesPendientes}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            'Actualizar'
          )}
        </Button>
      </div>

      {/* Alerta de error */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div className="ml-2">
                <p className="text-sm font-medium text-muted-foreground">Total Solicitudes</p>
                <p className="text-2xl font-bold">{solicitudes.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 text-orange-500" />
              <div className="ml-2">
                <p className="text-sm font-medium text-muted-foreground">Pendientes</p>
                <p className="text-2xl font-bold text-orange-500">{solicitudesPendientes.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <div className="ml-2">
                <p className="text-sm font-medium text-muted-foreground">Aprobadas</p>
                <p className="text-2xl font-bold text-green-500">
                  {solicitudes.filter(s => s.estado === 'APROBADA').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de solicitudes */}
      <Card>
        <CardHeader>
          <CardTitle>Solicitudes Pendientes de Revisión</CardTitle>
          <CardDescription>
            {solicitudesPendientes.length} solicitudes esperando aprobación
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="ml-2">Cargando solicitudes...</span>
            </div>
          ) : solicitudesPendientes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No hay solicitudes pendientes
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Solicitante</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Unidad</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {solicitudesPendientes.map((solicitud) => (
                  <TableRow key={solicitud.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {solicitud.nombres} {solicitud.apellidos}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          CI: {solicitud.documento_identidad}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{solicitud.email}</TableCell>
                    <TableCell>{solicitud.telefono}</TableCell>
                    <TableCell>{solicitud.numero_unidad || '-'}</TableCell>
                    <TableCell>{formatFecha(solicitud.fecha_solicitud)}</TableCell>
                    <TableCell>{getEstadoBadge(solicitud.estado)}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleVerDetalle(solicitud)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Ver
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Dialog de detalle y acciones */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalle de Solicitud</DialogTitle>
            <DialogDescription>
              Revisa la información y decide si aprobar o rechazar la solicitud
            </DialogDescription>
          </DialogHeader>
          
          {selectedSolicitud && (
            <div className="space-y-6">
              
              {/* Información personal */}
              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Información Personal
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label>Nombres</Label>
                    <p className="font-medium">{selectedSolicitud.nombres}</p>
                  </div>
                  <div>
                    <Label>Apellidos</Label>
                    <p className="font-medium">{selectedSolicitud.apellidos}</p>
                  </div>
                  <div>
                    <Label>Documento</Label>
                    <p className="font-medium">{selectedSolicitud.documento_identidad}</p>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <p className="font-medium">{selectedSolicitud.email}</p>
                  </div>
                  <div>
                    <Label>Teléfono</Label>
                    <p className="font-medium">{selectedSolicitud.telefono}</p>
                  </div>
                  <div>
                    <Label>Unidad</Label>
                    <p className="font-medium">{selectedSolicitud.numero_unidad || 'No especificada'}</p>
                  </div>
                </div>
              </div>

              {/* Fotos de Reconocimiento Facial - NUEVA SECCIÓN */}
              <FotosReconocimientoView
                fotosUrls={selectedSolicitud.fotos_reconocimiento_urls}
                solicitudId={selectedSolicitud.id}
                nombreSolicitante={`${selectedSolicitud.nombres} ${selectedSolicitud.apellidos}`}
                tieneReconocimiento={selectedSolicitud.tiene_reconocimiento_facial}
              />

              {/* Observaciones */}
              {selectedSolicitud.observaciones && (
                <div>
                  <Label>Observaciones del Solicitante</Label>
                  <p className="text-sm bg-gray-50 p-3 rounded-md">
                    {selectedSolicitud.observaciones}
                  </p>
                </div>
              )}

              {/* Acciones */}
              {!actionType ? (
                <div className="flex gap-3">
                  <Button 
                    onClick={() => handleAccion('aprobar')}
                    className="flex-1"
                    variant="default"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Aprobar Solicitud
                  </Button>
                  <Button 
                    onClick={() => handleAccion('rechazar')}
                    className="flex-1"
                    variant="destructive"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Rechazar Solicitud
                  </Button>
                </div>
              ) : actionType === 'aprobar' ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="observaciones">Observaciones para el Propietario (Opcional)</Label>
                    <Textarea
                      id="observaciones"
                      value={observaciones}
                      onChange={(e) => setObservaciones(e.target.value)}
                      placeholder="Información adicional para el nuevo propietario..."
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button 
                      onClick={confirmarAccion}
                      disabled={actionLoading}
                      className="flex-1"
                    >
                      {actionLoading ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <CheckCircle className="w-4 h-4 mr-2" />
                      )}
                      Confirmar Aprobación
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setActionType(null)}
                      disabled={actionLoading}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="motivoRechazo">Motivo del Rechazo *</Label>
                    <Textarea
                      id="motivoRechazo"
                      value={motivoRechazo}
                      onChange={(e) => setMotivoRechazo(e.target.value)}
                      placeholder="Explique por qué se rechaza la solicitud..."
                      rows={3}
                      required
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button 
                      onClick={confirmarAccion}
                      disabled={actionLoading || !motivoRechazo.trim()}
                      variant="destructive"
                      className="flex-1"
                    >
                      {actionLoading ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <XCircle className="w-4 h-4 mr-2" />
                      )}
                      Confirmar Rechazo
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setActionType(null)}
                      disabled={actionLoading}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default SolicitudesAdminPanel;