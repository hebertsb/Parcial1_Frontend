/**
 * Componente para gestión completa de inquilinos
 * Incluye list  // Función mock para eliminar inquilino
  const eliminarInquilino = useCallback(async (id: number) => {  // Función para formatear nombre completo
  const formatNombreCompleto = (inquilino: any) => {
    const nombre = inquilino.persona?.nombre || '';
    const apellido = inquilino.persona?.apellido || '';
    return `${nombre} ${apellido}`.trim() || 'Sin nombre';
  };

  // Cargar inquilinos al montar el componente
  useEffect(() => {
    cargarInquilinos();
  }, [cargarInquilinos]);

  // Función para formatear fechainos + funcionalidad para agregar nuevos
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RegistroInquilinoForm } from '@/components/inquilinos/registro-inquilino-form';
import { useInquilinos } from '@/hooks/useInquilinos';
import {
  Users,
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  Phone,
  Mail,
  Home,
  Calendar,
  UserPlus,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Filter,
  User
} from 'lucide-react';



export function GestionInquilinos() {
  const [searchTerm, setSearchTerm] = useState('');
  const [nuevoInquilinoModalOpen, setNuevoInquilinoModalOpen] = useState(false);
  const [detalleModalOpen, setDetalleModalOpen] = useState(false);
  const [inquilinoSeleccionado, setInquilinoSeleccionado] = useState<any>(null);

  // Hook para gestión de inquilinos - reconectado con la API
  const {
    inquilinos,
    isLoading: loading,
    error,
    cargarInquilinos,
    desactivarInquilinoData
  } = useInquilinos();

  // Función wrapper para recargar datos
  const refetch = useCallback(() => {
    cargarInquilinos();
  }, [cargarInquilinos]);

  // Función mock para eliminar inquilino
  const eliminarInquilino = useCallback(async (id: number) => {
    console.log('�️ GestionInquilinos: Mock eliminar inquilino', id);
    alert('Funcionalidad de eliminación (mock)');
  }, []);

  // Datos de inquilinos procesados correctamente

  // Función para filtrar inquilinos - usar estructura real del backend
  const inquilinosFiltrados = Array.isArray(inquilinos) ? inquilinos.filter(inquilino => {
    // El backend devuelve inquilino_info en lugar de persona
    const info = (inquilino as any).inquilino_info || {};
    const nombre = info.nombre || '';
    const apellido = info.apellido || '';
    const email = info.email || '';
    const documento = info.documento_identidad || '';
    
    return (
      nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      documento.includes(searchTerm)
    );
  }) : [];



  // Función para formatear nombre completo - estructura real del backend
  const formatNombreCompleto = (inquilino: any) => {
    const info = inquilino.inquilino_info || {};
    const nombre = info.nombre || '';
    const apellido = info.apellido || '';
    return `${nombre} ${apellido}`.trim() || 'Sin nombre';
  };

  // Función para obtener iniciales
  const getInitials = (inquilino: any) => {
    const nombre = formatNombreCompleto(inquilino);
    return nombre.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) || 'IN';
  };

  // Función para formatear fecha
  const formatFecha = (fecha: string) => {
    if (!fecha) return 'N/A';
    try {
      // Para fechas en formato YYYY-MM-DD, parsear directamente sin crear objeto Date
      // que puede causar problemas de zona horaria
      if (fecha.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const [year, month, day] = fecha.split('-');
        return `${day}/${month}/${year}`;
      }
      
      // Para otros formatos, usar Date
      const date = new Date(fecha);
      if (isNaN(date.getTime())) return fecha;
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    } catch (error) {
      return fecha;
    }
  };

  // Función para manejar ver detalles
  const handleVerDetalles = (inquilino: any) => {
    setInquilinoSeleccionado(inquilino);
    setDetalleModalOpen(true);
  };

  // Función para manejar eliminación
  const handleEliminar = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar este inquilino?')) {
      await desactivarInquilinoData(id);
    }
  };

  // Función para obtener estado del contrato
  const getEstadoContrato = (inquilino: any) => {
    // Por ahora usar estado simple basado en si está activo
    return inquilino.activo 
      ? { estado: 'ACTIVO', color: 'bg-green-600' }
      : { estado: 'INACTIVO', color: 'bg-gray-600' };
  };



  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <Users className="h-6 w-6" />
              Gestionar Inquilinos
            </h1>
            <p className="text-muted-foreground">Cargando inquilinos...</p>
          </div>
        </div>
        <div className="bg-card rounded-lg p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando datos de inquilinos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Users className="h-6 w-6" />
            Gestionar Inquilinos
          </h1>
          <p className="text-muted-foreground">Error al cargar inquilinos</p>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="mb-4">
            {error}
          </AlertDescription>
          <Button onClick={refetch} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Reintentar
          </Button>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Users className="h-6 w-6" />
            Gestionar Inquilinos
          </h1>
          <p className="text-muted-foreground">
            Administre sus inquilinos registrados y agregue nuevos
          </p>
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold">{Array.isArray(inquilinos) ? inquilinos.length : 0}</p>
          <p className="text-sm text-muted-foreground">Inquilinos registrados</p>
        </div>
      </div>

      {/* Controles */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar inquilinos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-80 pl-10"
            />
          </div>
          <Button 
            variant="outline"
            onClick={refetch}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </div>
        
        <Dialog open={nuevoInquilinoModalOpen} onOpenChange={setNuevoInquilinoModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Inquilino
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Registrar Nuevo Inquilino
              </DialogTitle>
              <DialogDescription>
                Complete el formulario para registrar un nuevo inquilino en sus propiedades
              </DialogDescription>
            </DialogHeader>
            <div className="mt-6">
              <RegistroInquilinoForm 
                onSuccess={() => {
                  setNuevoInquilinoModalOpen(false);
                  // Forzar recarga después de un breve delay
                  setTimeout(() => {
                    refetch();
                  }, 500);
                }}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabla de Inquilinos */}
      {inquilinosFiltrados.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No hay inquilinos registrados</h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm ? 'No se encontraron inquilinos que coincidan con su búsqueda' : 'Comience registrando su primer inquilino'}
            </p>
            {!searchTerm && (
              <Dialog open={nuevoInquilinoModalOpen} onOpenChange={setNuevoInquilinoModalOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Registrar Primer Inquilino
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <UserPlus className="h-5 w-5" />
                      Registrar Nuevo Inquilino
                    </DialogTitle>
                    <DialogDescription>
                      Complete el formulario para registrar un nuevo inquilino en sus propiedades
                    </DialogDescription>
                  </DialogHeader>
                  <div className="mt-6">
                    <RegistroInquilinoForm 
                      onSuccess={() => {
                        setNuevoInquilinoModalOpen(false);
                        refetch();
                      }}
                    />
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Lista de Inquilinos</CardTitle>
            <CardDescription>
              {inquilinosFiltrados.length} inquilino{inquilinosFiltrados.length !== 1 ? 's' : ''} 
              {searchTerm && ` encontrado${inquilinosFiltrados.length !== 1 ? 's' : ''} para "${searchTerm}"`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Inquilino</TableHead>
                    <TableHead>Contacto</TableHead>
                    <TableHead>Unidad</TableHead>
                    <TableHead>Estado Contrato</TableHead>
                    <TableHead>Fecha Inicio</TableHead>
                    <TableHead>Fecha Fin</TableHead>
                    <TableHead>Monto</TableHead>
                    <TableHead className="text-center">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inquilinosFiltrados.map((inquilino) => {
                    const estadoContrato = getEstadoContrato(inquilino);
                    return (
                      <TableRow key={inquilino.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src="/placeholder.svg" />
                              <AvatarFallback className="text-xs">
                                {getInitials(inquilino)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{formatNombreCompleto(inquilino)}</p>
                              <p className="text-sm text-muted-foreground">
                                {(inquilino as any).inquilino_info?.documento_identidad || 'Sin documento'}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-sm">
                              <Mail className="w-3 h-3" />
                              {(inquilino as any).inquilino_info?.email || 'Sin email'}
                            </div>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Phone className="w-3 h-3" />
                              {(inquilino as any).inquilino_info?.telefono || 'Sin teléfono'}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Home className="w-4 h-4 text-muted-foreground" />
                            {(inquilino as any).vivienda_info?.numero_casa || 'Sin asignar'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-green-600 text-white">
                            ACTIVO
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <Calendar className="w-3 h-3" />
                            {formatFecha((inquilino as any).fecha_inicio)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <Calendar className="w-3 h-3" />
                            {formatFecha((inquilino as any).fecha_fin)}
                          </div>
                        </TableCell>
                        <TableCell className="font-mono">
                          Bs. {(inquilino as any).monto_alquiler || '0'}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-1">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0"
                              onClick={() => handleVerDetalles(inquilino)}
                              title="Ver detalles"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                              onClick={() => handleEliminar(inquilino.id)}
                              title="Eliminar inquilino"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modal de detalles */}
      <Dialog open={detalleModalOpen} onOpenChange={setDetalleModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Detalles del Inquilino
            </DialogTitle>
          </DialogHeader>
          {inquilinoSeleccionado && (
            <div className="space-y-6">
              {/* Información Personal */}
              <div>
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Información Personal
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Nombre completo</p>
                    <p className="font-medium">{formatNombreCompleto(inquilinoSeleccionado)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Documento</p>
                    <p className="font-mono">{(inquilinoSeleccionado as any).inquilino_info?.documento_identidad || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Email</p>
                    <p>{(inquilinoSeleccionado as any).inquilino_info?.email || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Teléfono</p>
                    <p>{(inquilinoSeleccionado as any).inquilino_info?.telefono || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Bloque</p>
                    <p>{(inquilinoSeleccionado as any).vivienda_info?.bloque || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Monto Alquiler</p>
                    <p>Bs. {(inquilinoSeleccionado as any).monto_alquiler || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Información del Contrato */}
              <div>
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Información del Inquilino
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Unidad</p>
                    <p className="font-medium">{(inquilinoSeleccionado as any).vivienda_info?.numero_casa || 'Sin asignar'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Tipo unidad</p>
                    <p className="capitalize">{(inquilinoSeleccionado as any).vivienda_info?.tipo_vivienda || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Estado</p>
                    <Badge className={`${getEstadoContrato(inquilinoSeleccionado).color} text-white`}>
                      {getEstadoContrato(inquilinoSeleccionado).estado}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Fecha inicio</p>
                    <p>{formatFecha((inquilinoSeleccionado as any).fecha_inicio)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Fecha fin</p>
                    <p>{formatFecha((inquilinoSeleccionado as any).fecha_fin)}</p>
                  </div>
                </div>
                {inquilinoSeleccionado.observaciones && (
                  <div className="mt-4">
                    <p className="text-muted-foreground">Observaciones</p>
                    <p className="text-sm bg-muted p-3 rounded-md mt-1">
                      {inquilinoSeleccionado.observaciones}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}