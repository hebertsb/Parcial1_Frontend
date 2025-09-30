'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, Users, Camera, Eye, RefreshCw, Home, Mail, User, Phone } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { sincronizacionReconocimientoService, PropietarioReconocimiento } from '@/features/seguridad/sincronizacion-service';
import { getCurrentUser } from '@/lib/auth';

export default function PanelPropietariosReconocimiento() {
  const [propietarios, setPropietarios] = useState<PropietarioReconocimiento[]>([]);
  const [selectedPropietario, setSelectedPropietario] = useState<PropietarioReconocimiento | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [fotoDialogOpen, setFotoDialogOpen] = useState(false);
  const [fotoSeleccionada, setFotoSeleccionada] = useState<string | null>(null);
  const [estadisticas, setEstadisticas] = useState<any>(null);
  const [sincronizando, setSincronizando] = useState(false);

  useEffect(() => {
    cargarPropietarios();
  }, []);

  const cargarPropietarios = async () => {
    setLoading(true);
    setError(null);
    console.log('🏠 Cargando propietarios con reconocimiento facial...');

    try {
      const response = await sincronizacionReconocimientoService.obtenerPropietariosConReconocimiento();
      console.log('✅ Respuesta propietarios:', response);

      if (response.success && response.data) {
        // ✅ ACCESO CORRECTO: Backend devuelve response.data.data.propietarios
        const responseData = response.data as any;
        const propietarios = responseData.data?.propietarios || responseData.propietarios || [];
        const resumen = responseData.data?.resumen || responseData.resumen;
        
        setPropietarios(propietarios);
        setEstadisticas(resumen);
        console.log(`✅ ${propietarios.length} propietarios cargados`);
        console.log('🔍 Propietarios encontrados:', propietarios);
      } else {
        setError(response.message || 'Error al cargar propietarios');
      }
    } catch (error) {
      console.error('❌ Error cargando propietarios:', error);
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const sincronizarPropietario = async (usuarioId: number) => {
    setSincronizando(true);
    try {
      const response = await sincronizacionReconocimientoService.sincronizarFotosUsuario(usuarioId);
      if (response.success) {
        await cargarPropietarios();
        console.log('✅ Propietario sincronizado correctamente');
      } else {
        setError(response.message || 'Error al sincronizar propietario');
      }
    } catch (error) {
      console.error('❌ Error sincronizando propietario:', error);
      setError('Error al sincronizar propietario');
    } finally {
      setSincronizando(false);
    }
  };

  const sincronizarTodos = async () => {
    setSincronizando(true);
    try {
      const response = await sincronizacionReconocimientoService.sincronizarTodasLasFotos();
      if (response.success) {
        await cargarPropietarios();
        console.log('✅ Todos los propietarios sincronizados');
      } else {
        setError(response.message || 'Error al sincronizar todos');
      }
    } catch (error) {
      console.error('❌ Error sincronizando todos:', error);
      setError('Error al sincronizar todos los propietarios');
    } finally {
      setSincronizando(false);
    }
  };

  const verDetalles = (propietario: PropietarioReconocimiento) => {
    setSelectedPropietario(propietario);
    setDialogOpen(true);
  };

  const verFoto = (fotoUrl: string) => {
    setFotoSeleccionada(fotoUrl);
    setFotoDialogOpen(true);
  };

  const filteredPropietarios = propietarios.filter(propietario =>
    propietario.nombre_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    propietario.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    propietario.unidad.toLowerCase().includes(searchTerm.toLowerCase()) ||
    propietario.documento.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Home className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Propietarios con Reconocimiento Facial
              </h1>
              <p className="text-gray-600">
                Apartado específico para propietarios registrados
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {loading && (
              <div className="flex items-center space-x-2">
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span className="text-sm text-gray-600">Cargando...</span>
              </div>
            )}
            
            <Button onClick={cargarPropietarios} variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Actualizar
            </Button>
            
            <Button
              onClick={sincronizarTodos}
              variant="default"
              disabled={sincronizando}
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${sincronizando ? 'animate-spin' : ''}`} />
              {sincronizando ? 'Sincronizando...' : 'Sincronizar Todos'}
            </Button>
          </div>
        </div>

        {/* Estadísticas */}
        {estadisticas && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Propietarios</p>
                    <p className="text-2xl font-bold">{estadisticas.total_propietarios}</p>
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
                    <p className="text-2xl font-bold text-green-600">{estadisticas.con_reconocimiento}</p>
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
                    <p className="text-2xl font-bold text-orange-600">{estadisticas.sin_reconocimiento}</p>
                  </div>
                  <User className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Cobertura</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {estadisticas.porcentaje_cobertura}%
                    </p>
                  </div>
                  <Eye className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Búsqueda */}
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar por nombre, email, unidad o documento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Grid de Propietarios */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPropietarios.map((propietario) => (
            <Card key={propietario.copropietario_id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{propietario.nombre_completo}</CardTitle>
                  <Badge variant="default">
                    {propietario.estado}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span>{propietario.email}</span>
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Home className="h-4 w-4" />
                  <span>Unidad {propietario.unidad}</span>
                </div>

                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <User className="h-4 w-4" />
                  <span>Doc: {propietario.documento}</span>
                </div>

                {propietario.telefono && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{propietario.telefono}</span>
                  </div>
                )}

                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Camera className="h-4 w-4" />
                  <span>{propietario.fotos_reconocimiento.cantidad} fotos registradas</span>
                </div>

                <div className="pt-2 space-y-2">
                  <Button 
                    onClick={() => verDetalles(propietario)} 
                    className="w-full" 
                    variant="outline"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Detalles y Fotos
                  </Button>
                  
                  <Button
                    onClick={() => sincronizarPropietario(propietario.usuario_id)}
                    variant="outline"
                    size="sm"
                    disabled={sincronizando}
                    className="w-full gap-2"
                  >
                    <RefreshCw className={`h-4 w-4 ${sincronizando ? 'animate-spin' : ''}`} />
                    Sincronizar Fotos
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredPropietarios.length === 0 && !loading && (
          <div className="text-center py-12">
            <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No se encontraron propietarios
            </h3>
            <p className="text-gray-600">
              {searchTerm
                ? 'No hay propietarios que coincidan con tu búsqueda.'
                : 'No hay propietarios con reconocimiento facial registrados.'}
            </p>
            {!searchTerm && (
              <Button onClick={cargarPropietarios} className="mt-4" variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Recargar
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Modal de Detalles */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedPropietario && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2">
                  <Home className="h-5 w-5" />
                  <span>{selectedPropietario.nombre_completo}</span>
                </DialogTitle>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Información del Propietario</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <p>{selectedPropietario.email}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Home className="h-4 w-4 text-gray-400" />
                        <p>Unidad {selectedPropietario.unidad}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <p>Documento: {selectedPropietario.documento}</p>
                      </div>
                      {selectedPropietario.telefono && (
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <p>{selectedPropietario.telefono}</p>
                        </div>
                      )}
                      <div className="pt-2">
                        <Badge variant="default">
                          {selectedPropietario.estado}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">
                    🖼️ Galería de Fotos de Reconocimiento ({selectedPropietario.fotos_reconocimiento.cantidad})
                  </h3>
                  
                  {selectedPropietario.fotos_reconocimiento.urls.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {selectedPropietario.fotos_reconocimiento.urls.map((fotoUrl, index) => (
                        <div 
                          key={index}
                          className="relative group"
                        >
                          <div className="relative overflow-hidden rounded-lg shadow-md border border-gray-200">
                            <img
                              src={fotoUrl}
                              alt={`Foto de reconocimiento ${index + 1} - ${selectedPropietario.nombre_completo}`}
                              className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                              onError={(e) => {
                                console.error(`❌ Error cargando foto ${index + 1}:`, fotoUrl);
                                e.currentTarget.src = '/placeholder-avatar.png'; // Fallback
                              }}
                              loading="lazy"
                            />
                            
                            {/* Overlay con información */}
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                              <div className="flex items-center justify-between text-white text-sm">
                                <span className="font-medium">Foto {index + 1}</span>
                                <button
                                  onClick={() => verFoto(fotoUrl)}
                                  className="flex items-center gap-1 bg-white/20 hover:bg-white/30 px-2 py-1 rounded-md transition-colors"
                                  title="Ver en tamaño completo"
                                >
                                  <Eye className="h-4 w-4" />
                                  <span className="text-xs">Ampliar</span>
                                </button>
                              </div>
                            </div>
                            
                            {/* Indicador de carga */}
                            <div className="absolute top-2 right-2">
                              <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                                ✓ Sincronizada
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                      <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h4 className="text-lg font-medium text-gray-900 mb-2">Sin fotos de reconocimiento</h4>
                      <p className="text-gray-600 mb-4">Este propietario aún no ha subido fotos para reconocimiento facial</p>
                      <div className="text-sm text-gray-500">
                        <p>• El propietario puede subir fotos desde su panel</p>
                        <p>• Use el botón "Sincronizar Fotos" para actualizar</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Foto Ampliada */}
      <Dialog open={fotoDialogOpen} onOpenChange={setFotoDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          {fotoSeleccionada && selectedPropietario && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    📸 Foto de Reconocimiento Facial
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedPropietario.nombre_completo} • {selectedPropietario.unidad}
                  </p>
                </div>
                <div className="text-right text-sm text-gray-500">
                  <p>🔗 Almacenada en Dropbox</p>
                  <p>✅ Sincronizada</p>
                </div>
              </div>
              
              <div className="flex justify-center bg-gray-50 rounded-lg p-4">
                <img
                  src={fotoSeleccionada}
                  alt={`Foto de reconocimiento - ${selectedPropietario.nombre_completo}`}
                  className="max-w-full max-h-[60vh] object-contain rounded-lg shadow-lg"
                  onError={(e) => {
                    console.error('❌ Error cargando foto ampliada:', fotoSeleccionada);
                  }}
                />
              </div>
              
              <div className="flex justify-between items-center pt-2 border-t">
                <div className="text-xs text-gray-500">
                  <p>URL: {fotoSeleccionada.substring(0, 60)}...</p>
                </div>
                <button
                  onClick={() => window.open(fotoSeleccionada, '_blank')}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  🔗 Abrir en nueva ventana
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}