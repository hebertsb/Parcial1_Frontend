/**
 * Componente para gestión de solicitudes de registro por parte del administrador
 * Permite aprobar/rechazar solicitudes y enviar credenciales automáticamente
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Mail, 
  User, 
  Home, 
  AlertCircle, 
  RefreshCw,
  Loader2
} from 'lucide-react';

import { 
  obtenerSolicitudesRegistro, 
  procesarSolicitudCompleta,
  type SolicitudRegistroAPI 
} from '@/features/admin/solicitudes-service';

// Componente de estado de backend
const BackendStatus: React.FC<{
  isConnected: boolean;
  lastUpdate: Date | null;
  endpoint: string;
}> = ({ isConnected, lastUpdate, endpoint }) => (
  <div className="flex items-center gap-2 text-sm">
    <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
    <span className={isConnected ? 'text-green-700' : 'text-red-700'}>
      {endpoint}: {isConnected ? 'Conectado' : 'Desconectado'}
    </span>
    {lastUpdate && (
      <span className="text-gray-500">
        ({lastUpdate.toLocaleTimeString()})
      </span>
    )}
  </div>
);

export function GestionSolicitudesRegistro() {
  const [solicitudes, setSolicitudes] = useState<SolicitudRegistroAPI[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSolicitud, setSelectedSolicitud] = useState<SolicitudRegistroAPI | null>(null);
  const [observaciones, setObservaciones] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [lastBackendUpdate, setLastBackendUpdate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const viviendas = [
    '006D', '007C', '008E', '009C', '010C', '011D', '012B', '013E', '014E', 
    '015A', '016C', '017D', '018A', '019B', '020B', '201A', '202B', '203C'
  ];

  // Función para crear solicitud de prueba con datos únicos
  const crearSolicitudPrueba = async () => {
    const nombres = ['Carlos', 'Ana', 'Luis', 'María', 'José', 'Carmen', 'Pedro', 'Laura', 'Diego', 'Sofia'];
    const apellidos = ['García', 'López', 'Martínez', 'González', 'Rodríguez', 'Fernández', 'Sánchez', 'Pérez', 'Morales', 'Torres'];
    
    // Generar timestamp único para evitar duplicados
    const timestamp = Date.now();
    const nombreAleatorio = nombres[Math.floor(Math.random() * nombres.length)];
    const apellidoAleatorio = apellidos[Math.floor(Math.random() * apellidos.length)];
    const cedulaAleatoria = `${Math.floor(Math.random() * 90000000) + 10000000}${timestamp.toString().slice(-3)}`;
    const emailAleatorio = `${nombreAleatorio.toLowerCase()}.${apellidoAleatorio.toLowerCase()}.${timestamp}@ejemplo.com`;
    const viviendaAleatoria = viviendas[Math.floor(Math.random() * viviendas.length)];
    const telefonoAleatorio = `${Math.floor(Math.random() * 90000000) + 70000000}${timestamp.toString().slice(-2)}`;
    
    try {
      console.log('🔄 Creando solicitud de prueba...');
      
      const response = await fetch('http://localhost:8000/api/authz/propietarios/solicitud/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          nombres: nombreAleatorio,
          apellidos: apellidoAleatorio,
          documento_identidad: cedulaAleatoria,
          email: emailAleatorio,
          telefono: telefonoAleatorio,
          numero_casa: viviendaAleatoria,
          fecha_nacimiento: '1990-01-01',
          acepta_terminos: true,
          acepta_tratamiento_datos: true,
          password: 'TempPass123!',
          password_confirm: 'TempPass123!',  // Campo adicional requerido
          confirm_password: 'TempPass123!'   // Campo adicional requerido
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('✅ Solicitud creada:', result);
        alert(`✅ ¡Solicitud creada exitosamente!\n\n📝 Detalles:\n• Nombre: ${nombreAleatorio} ${apellidoAleatorio}\n• Email: ${emailAleatorio}\n• Vivienda: ${viviendaAleatoria}\n• Cédula: ${cedulaAleatoria}\n\n🔄 Recargando lista...`);
        
        // Recargar la lista de solicitudes
        await cargarSolicitudes();
      } else {
        const errorData = await response.json();
        console.error('❌ Error creando solicitud:', errorData);
        alert(`❌ Error creando solicitud: ${errorData.detail || errorData.message || 'Error desconocido'}`);
      }
      
    } catch (error) {
      console.error('❌ Error de conexión:', error);
      alert('❌ Error de conexión con el backend. Verifique que Django esté ejecutándose.');
    }
  };

  const cargarSolicitudes = async () => {
    setIsLoading(true);
    setEmailError(null);
    
    try {
      const resultado = await obtenerSolicitudesRegistro();
      
      if (resultado.success) {
        setSolicitudes(resultado.data || []);
        setIsBackendConnected(true);
        setLastBackendUpdate(new Date());
        console.log('✅ Solicitudes cargadas desde API');
      } else {
        setEmailError(resultado.message || 'Error al cargar solicitudes');
        setIsBackendConnected(false);
        setLastBackendUpdate(null);
      }
    } catch (error) {
      console.error('Error cargando solicitudes:', error);
      setEmailError('Error de conexión con el servidor');
      setIsBackendConnected(false);
      setLastBackendUpdate(null);
    } finally {
      setIsLoading(false);
    }
  };

  const procesarDecision = async (decision: {
    solicitudId: number;
    decision: 'aprobar' | 'rechazar';
    observaciones: string;
  }) => {
    setIsProcessing(true);
    
    try {
      // Encontrar la solicitud seleccionada para mejor debug
      const solicitudActual = solicitudes.find(s => s.id === decision.solicitudId);
      console.log(`📋 Procesando ${decision.decision} para solicitud ${decision.solicitudId}`);
      console.log(`🔍 [DEBUG] Datos de la solicitud:`, {
        id: solicitudActual?.id,
        nombre: `${solicitudActual?.primer_nombre} ${solicitudActual?.primer_apellido}`,
        email: solicitudActual?.email,
        estado_actual: solicitudActual?.estado,
        casa: solicitudActual?.numero_casa
      });

      // Procesar solicitud usando la API integrada
      const resultado = await procesarSolicitudCompleta(decision.solicitudId, {
        decision: decision.decision,
        observaciones_admin: decision.observaciones
      });

      // Verificar si es un mensaje de "ya procesada" (que significa éxito)
      if (!resultado.success) {
        console.error('❌ Error del backend:', resultado.message);
        
        if (resultado.message?.includes('ya fue procesada') || resultado.message?.includes('Estado actual: APROBADO')) {
          console.log('✅ Solicitud ya estaba aprobada - Tratando como éxito');
          alert(`✅ ¡Solicitud procesada exitosamente!\n\n${resultado.message}\n\n🔄 Actualizando lista...`);
          
          // Tratar como éxito y actualizar la UI
          setSolicitudes(prev => prev.map(s => 
            s.id === decision.solicitudId 
              ? { ...s, estado: decision.decision === 'aprobar' ? 'aprobado' : 'rechazado' }
              : s
          ));
          
          setTimeout(() => {
            setIsModalOpen(false);
            setSelectedSolicitud(null);
            setObservaciones('');
          }, 500);
          
          // Recargar la lista para estar seguros
          await cargarSolicitudes();
          
        } else if (resultado.message?.includes('UNIQUE constraint') || resultado.message?.includes('usuario_creado_id') || resultado.message?.includes('ya fue procesada')) {
          console.log('⚠️ Solicitud ya procesada - Cerrando modal automáticamente');
          alert(`⚠️ Solicitud ya procesada\n\n${resultado.message}\n\n💡 Esta solicitud ya fue aprobada anteriormente. Use el botón "➕ Nueva Solicitud" para crear una solicitud limpia para pruebas.`);
          
          // Cerrar el modal automáticamente para solicitudes ya procesadas
          setTimeout(() => {
            setIsModalOpen(false);
            setSelectedSolicitud(null);
            setObservaciones('');
          }, 1000);
          
          // Recargar la lista para mostrar el estado actualizado
          await cargarSolicitudes();
          
        } else {
          alert(`❌ Error del backend:\n\n${resultado.message}\n\n💡 Verifique que:\n• La vivienda esté disponible\n• No haya conflictos en los datos\n• El backend esté funcionando correctamente`);
        }
        
        // Actualizar estado de conexión (conectado pero con error de negocio)
        setIsBackendConnected(true);
        setLastBackendUpdate(new Date());
        return;
      }

      console.log('✅ Solicitud procesada exitosamente:', resultado.data);
      
      // Actualizar estado de conexión exitosa
      setIsBackendConnected(true);
      setLastBackendUpdate(new Date());

      // 5. Actualizar estado local
      setSolicitudes(prev => prev.map(s => 
        s.id === decision.solicitudId 
          ? { ...s, estado: decision.decision === 'aprobar' ? 'aprobado' : 'rechazado' }
          : s
      ));

      // Mostrar mensaje de éxito primero
      alert(`Solicitud ${decision.decision === 'aprobar' ? 'aprobada' : 'rechazada'} exitosamente!\n\nDetalles del proceso:\nUsuario ID: ${resultado.data?.usuario_id}\nEmail enviado a: ${resultado.data?.email_propietario}\nContraseña temporal: temporal123\n\nEl usuario recibira un email con sus credenciales de acceso.\nDebera cambiar la contraseña temporal en su primer login.`);
      
      // ✅ CERRAR MODAL AUTOMÁTICAMENTE después del mensaje
      setTimeout(() => {
        setIsModalOpen(false);
        setSelectedSolicitud(null);
        setObservaciones('');
        console.log('✅ Modal cerrado automáticamente');
      }, 500);
      
      console.log('✅ Proceso completado exitosamente');
      
    } catch (error) {
      console.error('❌ Error procesando decisión:', error);
      // Actualizar estado de conexión fallida
      setIsBackendConnected(false);
      setLastBackendUpdate(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return <Badge variant="secondary" className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          Pendiente
        </Badge>;
      case 'aprobado':
        return <Badge variant="default" className="flex items-center gap-1 bg-green-500">
          <CheckCircle className="w-3 h-3" />
          Aprobado
        </Badge>;
      case 'rechazado':
        return <Badge variant="destructive" className="flex items-center gap-1">
          <XCircle className="w-3 h-3" />
          Rechazado
        </Badge>;
      default:
        return <Badge variant="outline">{estado}</Badge>;
    }
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  useEffect(() => {
    cargarSolicitudes();
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Gestión de Solicitudes de Registro
            </CardTitle>
            
            <div className="flex gap-2">
              <Button 
                onClick={() => cargarSolicitudes()}
                disabled={isLoading}
                variant="outline"
                size="sm"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                🔄 Recargar Datos
              </Button>
              <Button 
                onClick={crearSolicitudPrueba}
                disabled={isLoading}
                variant="outline"
                size="sm"
                className="text-xs bg-green-100"
                title="Crear solicitud de prueba con vivienda disponible"
              >
                ➕ Nueva Solicitud
              </Button>
            </div>
          </div>

          {/* Estado de conexión al backend */}
          <div className="flex justify-end">
            <BackendStatus 
              isConnected={isBackendConnected}
              lastUpdate={lastBackendUpdate}
              endpoint="API Django"
            />
          </div>

          {emailError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {emailError}
              </AlertDescription>
            </Alert>
          )}
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="flex items-center gap-2">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>Cargando solicitudes...</span>
              </div>
            </div>
          ) : solicitudes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No hay solicitudes de registro pendientes</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Solicitante</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Unidad</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {solicitudes.map((solicitud) => {
                  console.log(`🔍 [DEBUG] Renderizando solicitud ID ${solicitud.id}: ${solicitud.primer_nombre} ${solicitud.primer_apellido} - Estado: "${solicitud.estado}"`);
                  return (
                    <TableRow key={solicitud.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {solicitud.primer_nombre} {solicitud.primer_apellido}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            CI: {solicitud.cedula}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{solicitud.email}</TableCell>
                      <TableCell>{solicitud.numero_casa}</TableCell>
                      <TableCell>{getEstadoBadge(solicitud.estado)}</TableCell>
                      <TableCell className="text-sm">
                        {formatearFecha(solicitud.fecha_solicitud)}
                      </TableCell>
                      <TableCell>
                        {/* Mostrar botones para TODOS los estados para debug */}
                        {(solicitud.estado === 'pendiente' || true) && (
                          <div className="flex items-center gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => {
                                console.log('🔍 [DEBUG] Seleccionando solicitud:', {
                                  id: solicitud.id,
                                  nombre: `${solicitud.primer_nombre} ${solicitud.primer_apellido}`,
                                  email: solicitud.email,
                                  casa: solicitud.numero_casa
                                });
                                setSelectedSolicitud(solicitud);
                                setIsModalOpen(true);
                              }}
                            >
                              Revisar
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Dialog para revisar solicitud - FUERA del loop para evitar duplicados */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          {selectedSolicitud && (
            <>
              <DialogHeader>
                <DialogTitle>Revisar Solicitud de {selectedSolicitud.primer_nombre} {selectedSolicitud.primer_apellido}</DialogTitle>
                <DialogDescription>
                  Revise los detalles y tome una decisión sobre esta solicitud
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-6">
                {/* Información básica */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span className="font-medium">Información Personal</span>
                    </div>
                    <div className="text-sm space-y-1">
                      <p><strong>Nombre:</strong> {selectedSolicitud.primer_nombre} {selectedSolicitud.primer_apellido}</p>
                      <p><strong>CI:</strong> {selectedSolicitud.cedula}</p>
                      <p><strong>Email:</strong> {selectedSolicitud.email}</p>
                      <p><strong>Teléfono:</strong> {selectedSolicitud.telefono}</p>
                      <p><strong>Género:</strong> {selectedSolicitud.genero}</p>
                      <p><strong>Fecha Nacimiento:</strong> {selectedSolicitud.fecha_nacimiento ? (() => {
                        console.log(`🔍 [DEBUG] Fecha raw del backend para ${selectedSolicitud.primer_nombre}:`, selectedSolicitud.fecha_nacimiento);
                        const fechaParseada = new Date(selectedSolicitud.fecha_nacimiento + 'T00:00:00');
                        console.log(`🔍 [DEBUG] Fecha parseada:`, fechaParseada);
                        console.log(`🔍 [DEBUG] Fecha formateada:`, fechaParseada.toLocaleDateString('es-ES'));
                        return fechaParseada.toLocaleDateString('es-ES');
                      })() : 'No especificada'}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Home className="w-4 h-4" />
                      <span className="font-medium">Propiedad</span>
                    </div>
                    <div className="text-sm space-y-1">
                      <p><strong>Unidad:</strong> {selectedSolicitud.numero_casa}</p>
                      <p><strong>Fecha Solicitud:</strong> {formatearFecha(selectedSolicitud.fecha_solicitud)}</p>
                    </div>
                  </div>
                </div>

                {/* Observaciones del Solicitante */}
                <div className="space-y-2">
                  <h4 className="font-medium">Observaciones del Solicitante</h4>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                    {selectedSolicitud.observaciones || 'Sin observaciones adicionales'}
                  </p>
                </div>

                {/* Observaciones del Admin */}
                <div className="space-y-2">
                  <label className="font-medium">Observaciones (Opcional)</label>
                  <Textarea
                    value={observaciones}
                    onChange={(e) => setObservaciones(e.target.value)}
                    placeholder="Agregue observaciones sobre esta decisión..."
                    rows={3}
                  />
                </div>

                {/* Botones de acción */}
                <div className="flex justify-end gap-2">
                  <Button
                    variant="destructive"
                    onClick={() => procesarDecision({
                      solicitudId: selectedSolicitud.id,
                      decision: 'rechazar',
                      observaciones: observaciones
                    })}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Procesando...
                      </>
                    ) : (
                      'Rechazar'
                    )}
                  </Button>
                  
                  <Button
                    onClick={() => procesarDecision({
                      solicitudId: selectedSolicitud.id,
                      decision: 'aprobar',
                      observaciones: observaciones
                    })}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creando usuario y enviando email...
                      </>
                    ) : (
                      'Aprobar y Enviar Credenciales'
                    )}
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}