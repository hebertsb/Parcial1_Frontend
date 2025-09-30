'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, Users, Camera, Eye, RefreshCw, AlertCircle, User, Mail, Home, Calendar } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { reconocimientoFacialService } from '@/features/seguridad/services';
import { sincronizacionReconocimientoService, UsuarioReconocimientoSincronizado } from '@/features/seguridad/sincronizacion-service';
import { SecurityHeader } from './security-header';
import { getCurrentUser } from '@/lib/auth';

// Interfaz actualizada para el nuevo backend integrado
interface UsuarioReconocimiento {
  copropietario_id: number;
  usuario_id: number;
  nombre_completo: string;
  email: string;
  unidad: string;
  documento: string;
  telefono?: string;
  foto_perfil?: string;
  reconocimiento_id?: number;
  tiene_fotos: boolean;
  total_fotos: number;
  fecha_ultimo_enrolamiento?: string;
  fotos_urls: string[];
  estado: string;
  tipo_residente: string;
}

export default function PanelSeguridadReconocimiento() {
  const [usuarios, setUsuarios] = useState<UsuarioReconocimiento[]>([]);
  const [selectedUsuario, setSelectedUsuario] = useState<UsuarioReconocimiento | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [fotoDialogOpen, setFotoDialogOpen] = useState(false);
  const [fotoSeleccionada, setFotoSeleccionada] = useState<string | null>(null);
  const [usuarioSeguridad, setUsuarioSeguridad] = useState<any>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [sincronizando, setSincronizando] = useState(false);
  const [vistaActual, setVistaActual] = useState<'todos' | 'propietarios'>('todos');
  const [estadisticas, setEstadisticas] = useState<any>(null);

  useEffect(() => {
    // Obtener usuario actual
    const user = getCurrentUser();
    setUsuarioSeguridad(user);
    cargarUsuarios();
    cargarEstadisticas();
  }, []);

  useEffect(() => {
    // Recargar cuando cambie la vista
    cargarUsuarios(vistaActual);
  }, [vistaActual]);

  const cargarUsuarios = async (vista: 'todos' | 'propietarios' = vistaActual) => {
    setLoading(true);
    setError(null);
    setLastUpdate(new Date());
    console.log(`🎉 SEGURIDAD: Cargando ${vista} desde ENDPOINTS SINCRONIZADOS...`);

    try {
      let response;
      
      if (vista === 'propietarios') {
        // Usar endpoint específico para propietarios
        response = await sincronizacionReconocimientoService.obtenerPropietariosConReconocimiento();
      } else {
        // Usar endpoint general para todos los usuarios
        response = await sincronizacionReconocimientoService.obtenerUsuariosConReconocimiento();
      }
      
      console.log('✅ SEGURIDAD: Respuesta del servicio integrado:', response);
      console.log('🔍 SEGURIDAD: Estructura de datos recibida:', {
        success: response.success,
        hasData: !!response.data,
        dataKeys: response.data ? Object.keys(response.data) : [],
        nestedData: response.data?.data ? Object.keys(response.data.data) : []
      });
      
      if (response.success && response.data) {
        // ✅ ACCESO CORRECTO: El backend devuelve response.data.data.propietarios
        let usuariosLista: any[];
        
        if (vista === 'propietarios') {
          usuariosLista = response.data.data?.propietarios || response.data.propietarios || [];
          setEstadisticas(response.data.data?.resumen || response.data.resumen);
          console.log('🏠 SEGURIDAD: Propietarios encontrados:', usuariosLista.length);
        } else {
          usuariosLista = response.data.data?.usuarios || response.data.usuarios || [];
          setEstadisticas(response.data.data?.resumen || response.data.resumen);
          console.log('👥 SEGURIDAD: Usuarios encontrados:', usuariosLista.length);
        }
        
        console.log(`📊 SEGURIDAD: Total ${vista} encontrados: ${usuariosLista.length}`);
        console.log(`👥 SEGURIDAD: Lista de ${vista}:`, usuariosLista);
        
        // Mapear usuarios según la nueva estructura integrada
        const usuariosConFotos = usuariosLista.map((usuario: any) => {
          const fotosUrls = usuario.fotos_reconocimiento?.urls || [];
          console.log(`📸 SEGURIDAD: ${usuario.nombre_completo} tiene ${fotosUrls.length} fotos sincronizadas`);
          
          return {
            copropietario_id: usuario.copropietario_id,
            usuario_id: usuario.usuario_id,
            nombre_completo: usuario.nombre_completo,
            email: usuario.email,
            unidad: usuario.unidad,
            documento: usuario.documento,
            telefono: usuario.telefono,
            foto_perfil: usuario.foto_perfil,
            reconocimiento_id: usuario.copropietario_id, // Usar copropietario_id como reconocimiento_id
            total_fotos: usuario.fotos_reconocimiento?.cantidad || 0,
            tiene_fotos: fotosUrls.length > 0,
            fecha_ultimo_enrolamiento: usuario.fotos_reconocimiento?.fecha_registro,
            fotos_urls: fotosUrls,
            estado: usuario.estado || 'Activo con reconocimiento',
            tipo_residente: usuario.tipo_residente || 'Propietario'
          };
        });
        
        setUsuarios(usuariosConFotos);
        console.log(`✅ SEGURIDAD: Total ${vista} cargados: ${usuariosConFotos.length}`);
        
        // También cargar estadísticas si no están disponibles
        if (!estadisticas) {
          cargarEstadisticas();
        }
      } else {
        console.log('⚠️ SEGURIDAD: Respuesta no exitosa:', response);
        setError(response.message || `Error al cargar ${vista}`);
        setUsuarios([]);
      }
    } catch (error) {
      console.error(`❌ SEGURIDAD: Error cargando ${vista}:`, error);
      setError(`Error al cargar ${vista} del backend.`);
    } finally {
      setLoading(false);
    }
  };

  const cargarEstadisticas = async () => {
    try {
      const response = await sincronizacionReconocimientoService.obtenerEstadisticasSincronizacion();
      if (response.success && response.data) {
        // ✅ ACCESO CORRECTO: Estadísticas pueden venir anidadas
        setEstadisticas((response.data as any).data || response.data);
      }
    } catch (error) {
      console.error('❌ Error cargando estadísticas:', error);
    }
  };

  const sincronizarUsuario = async (usuarioId: number) => {
    setSincronizando(true);
    try {
      const response = await sincronizacionReconocimientoService.sincronizarFotosUsuario(usuarioId);
      if (response.success) {
        // Recargar usuarios después de sincronizar
        await cargarUsuarios();
        console.log('✅ Usuario sincronizado correctamente');
      } else {
        setError(response.message || 'Error al sincronizar usuario');
      }
    } catch (error) {
      console.error('❌ Error sincronizando usuario:', error);
      setError('Error al sincronizar usuario');
    } finally {
      setSincronizando(false);
    }
  };

  const sincronizarTodos = async () => {
    setSincronizando(true);
    try {
      const response = await sincronizacionReconocimientoService.sincronizarTodasLasFotos();
      if (response.success) {
        // Recargar usuarios después de sincronizar
        await cargarUsuarios();
        console.log('✅ Todos los usuarios sincronizados correctamente');
      } else {
        setError(response.message || 'Error al sincronizar todos los usuarios');
      }
    } catch (error) {
      console.error('❌ Error sincronizando todos:', error);
      setError('Error al sincronizar todos los usuarios');
    } finally {
      setSincronizando(false);
    }
  };

  const verDetalles = (usuario: UsuarioReconocimiento) => {
    setSelectedUsuario(usuario);
    setDialogOpen(true);
  };

  const verFoto = (fotoUrl: string) => {
    setFotoSeleccionada(fotoUrl);
    setFotoDialogOpen(true);
  };

  const filteredUsuarios = usuarios.filter(usuario =>
    usuario.nombre_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.unidad.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const usuariosActivos = usuarios.filter(u => u.tiene_fotos);
  const usuariosInactivos = usuarios.filter(u => !u.tiene_fotos);

  return (
    <div className="space-y-6">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header del Panel */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Camera className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Panel de Reconocimiento Facial</h1>
                <p className="text-gray-600">Monitoreo y gestión del sistema de seguridad sincronizado</p>
              </div>
            </div>
          
            <div className="flex items-center space-x-2">
              {loading && (
                <div className="flex items-center space-x-2">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span className="text-sm text-gray-600">Cargando...</span>
                </div>
              )}
              
              <Button onClick={() => cargarUsuarios()} variant="outline" className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Actualizar
              </Button>
            </div>
          </div>
        </div>

        {/* Controles de Vista y Sincronización */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Selector de Vista */}
              <div className="flex items-center space-x-4">
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <Button
                    onClick={() => setVistaActual('todos')}
                    variant={vistaActual === 'todos' ? 'default' : 'ghost'}
                    size="sm"
                    className="px-4"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Todos los Usuarios
                  </Button>
                  <Button
                    onClick={() => setVistaActual('propietarios')}
                    variant={vistaActual === 'propietarios' ? 'default' : 'ghost'}
                    size="sm"
                    className="px-4"
                  >
                    <Home className="h-4 w-4 mr-2" />
                    Solo Propietarios
                  </Button>
                </div>
                
                {/* Estadísticas de Sincronización */}
                {estadisticas && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">
                      {estadisticas.porcentaje_cobertura || estadisticas.porcentaje_sincronizacion || 0}% sincronizado
                    </span>
                    {` • ${estadisticas.total_fotos || estadisticas.total_fotos_sincronizadas || 0} fotos`}
                  </div>
                )}
              </div>

              {/* Controles de Sincronización */}
              <div className="flex items-center space-x-2">
                <Button
                  onClick={sincronizarTodos}
                  variant="outline"
                  size="sm"
                  disabled={sincronizando}
                  className="gap-2"
                >
                  <RefreshCw className={`h-4 w-4 ${sincronizando ? 'animate-spin' : ''}`} />
                  {sincronizando ? 'Sincronizando...' : 'Sincronizar Todos'}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {vistaActual === 'propietarios' ? 'Total Propietarios' : 'Total Usuarios'}
                  </p>
                  <p className="text-2xl font-bold">
                    {estadisticas?.total_propietarios || estadisticas?.total_usuarios || usuarios.length}
                  </p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Con Reconocimiento</p>
                  <p className="text-2xl font-bold text-green-600">
                    {estadisticas?.con_reconocimiento || usuariosActivos.length}
                  </p>
                </div>
                <Camera className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Sin Reconocimiento</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {estadisticas?.sin_reconocimiento || usuariosInactivos.length}
                  </p>
                </div>
                <AlertCircle className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Fotos</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {usuarios.reduce((sum, u) => sum + u.total_fotos, 0)}
                  </p>
                </div>
                <Eye className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar por nombre, email o unidad..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Users Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsuarios.map((usuario) => (
            <Card key={usuario.copropietario_id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{usuario.nombre_completo}</CardTitle>
                  <Badge variant={usuario.tiene_fotos ? "default" : "secondary"}>
                    {usuario.tiene_fotos ? "Activo" : "Inactivo"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span>{usuario.email}</span>
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Home className="h-4 w-4" />
                  <span>{usuario.unidad}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Camera className="h-4 w-4" />
                    <span>{usuario.total_fotos} fotos</span>
                  </div>
                  
                  <Badge variant="outline" className="text-xs">
                    {usuario.tipo_residente}
                  </Badge>
                </div>

                {usuario.documento && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <User className="h-4 w-4" />
                    <span>Doc: {usuario.documento}</span>
                  </div>
                )}

                {usuario.fecha_ultimo_enrolamiento && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Último: {new Date(usuario.fecha_ultimo_enrolamiento).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                )}

                <div className="pt-2 space-y-2">
                  <Button 
                    onClick={() => verDetalles(usuario)} 
                    className="w-full" 
                    variant="outline"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Detalles
                  </Button>
                  
                  <Button
                    onClick={() => sincronizarUsuario(usuario.usuario_id)}
                    variant="outline"
                    size="sm"
                    disabled={sincronizando}
                    className="w-full gap-2"
                  >
                    <RefreshCw className={`h-4 w-4 ${sincronizando ? 'animate-spin' : ''}`} />
                    Sincronizar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredUsuarios.length === 0 && !loading && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-xl font-semibold text-gray-900 mb-2">No se encontraron usuarios</p>
            <p className="text-gray-600">
              {searchTerm ? 'Intenta ajustar los términos de búsqueda' : 'No hay usuarios registrados en el sistema'}
            </p>
          </div>
        )}
      </div>

      {/* Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          {selectedUsuario && (
            <div className="space-y-6">
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <p className="text-lg font-semibold">{selectedUsuario.nombre_completo}</p>
                </DialogTitle>
                <div className="flex items-center space-x-2">
                  <Badge variant={selectedUsuario.tiene_fotos ? "default" : "secondary"}>
                    {selectedUsuario.tiene_fotos ? "Reconocimiento Activo" : "Sin Reconocimiento"}
                  </Badge>
                </div>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Información Personal</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <p>{selectedUsuario.email}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Home className="h-4 w-4 text-gray-400" />
                        <p>{selectedUsuario.unidad}</p>
                      </div>
                      {selectedUsuario.documento && (
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <p>Documento: {selectedUsuario.documento}</p>
                        </div>
                      )}
                      {selectedUsuario.telefono && (
                        <div className="flex items-center space-x-2">
                          <Camera className="h-4 w-4 text-gray-400" />
                          <p>Teléfono: {selectedUsuario.telefono}</p>
                        </div>
                      )}
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {selectedUsuario.tipo_residente}
                        </Badge>
                        <Badge variant={selectedUsuario.tiene_fotos ? "default" : "secondary"}>
                          {selectedUsuario.estado}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Fotos de Reconocimiento ({selectedUsuario.total_fotos})
                    </h3>
                    
                    {selectedUsuario.fotos_urls && selectedUsuario.fotos_urls.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {selectedUsuario.fotos_urls.map((fotoUrl, index) => (
                          <div 
                            key={index}
                            className="relative group cursor-pointer rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                            onClick={() => verFoto(fotoUrl)}
                          >
                            <img
                              src={fotoUrl}
                              alt={`Foto ${index + 1} de ${selectedUsuario.nombre_completo}`}
                              className="w-full h-64 object-cover"
                              onLoad={(e) => {
                                e.currentTarget.style.display = 'block';
                              }}
                              onError={(e) => {
                                console.error('Error cargando foto:', fotoUrl);
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="absolute bottom-0 left-0 right-0 p-3 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">
                                  Foto {index + 1}
                                </span>
                                <div className="flex items-center space-x-1">
                                  <Eye className="h-4 w-4" />
                                  <span className="text-xs">Ver</span>
                                </div>
                              </div>
                              <div className="text-xs text-green-300 mt-1">
                                Sincronizada
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600">No hay fotos de reconocimiento</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {selectedUsuario.fecha_ultimo_enrolamiento && (
                <div className="text-sm text-gray-600 border-t pt-4">
                  Última actualización: {new Date(selectedUsuario.fecha_ultimo_enrolamiento).toLocaleDateString('es-ES')}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Photo Viewer Dialog */}
      <Dialog open={fotoDialogOpen} onOpenChange={setFotoDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Vista de Foto</DialogTitle>
          </DialogHeader>
          {fotoSeleccionada && (
            <div className="flex justify-center">
              <img
                src={fotoSeleccionada}
                alt="Foto seleccionada"
                className="max-w-full max-h-[70vh] object-contain rounded-lg"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}