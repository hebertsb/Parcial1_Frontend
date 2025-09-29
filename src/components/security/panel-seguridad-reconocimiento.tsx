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
import { SecurityHeader } from './security-header';
import { getCurrentUser } from '@/lib/auth';

// Interfaz actualizada para el nuevo backend
interface UsuarioReconocimiento {
  copropietario_id: number;
  nombre_completo: string;
  email: string;
  unidad_residencial: string;
  reconocimiento_id?: number;
  tiene_fotos: boolean;
  total_fotos: number;
  fecha_ultimo_enrolamiento?: string;
  fotos_urls?: string[];
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

  useEffect(() => {
    // Obtener usuario actual
    const user = getCurrentUser();
    setUsuarioSeguridad(user);
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    setLoading(true);
    setError(null);
    setLastUpdate(new Date());
    console.log('🎉 SEGURIDAD: Cargando usuarios desde ENDPOINT CORRECTO del backend...');

    try {
      const response = await reconocimientoFacialService.obtenerUsuariosConReconocimiento();
      console.log('✅ SEGURIDAD: Respuesta del servicio:', response);
      
      if (response.success && response.data) {
        // NUEVO: Backend devuelve {total_usuarios, usuarios} según nueva documentación
        const usuarios = response.data.usuarios || [];
        console.log(`📊 SEGURIDAD: Total usuarios encontrados: ${usuarios.length}`);
        console.log('👥 SEGURIDAD: Lista de usuarios:', usuarios);
        
        // CORREGIDO: Usuarios según nueva documentación del backend con reconocimiento_facial
        const usuariosConFotos = usuarios.map((usuario: any) => {
          const fotosUrls = usuario.reconocimiento_facial?.fotos_urls || usuario.fotos_urls || [];
          console.log(`📸 SEGURIDAD: ${usuario.nombres_completos || usuario.nombre_completo} tiene ${fotosUrls.length} fotos`);
          
          return {
            copropietario_id: usuario.copropietario_id,
            nombre_completo: usuario.nombres_completos || usuario.nombre_completo,
            email: `usuario-${usuario.copropietario_id}@copropietario.com`, // Synthetic email
            unidad_residencial: usuario.unidad_residencial,
            reconocimiento_id: usuario.copropietario_id,
            total_fotos: usuario.reconocimiento_facial?.total_fotos || usuario.total_fotos || 0,
            tiene_fotos: fotosUrls.length > 0,
            fecha_ultimo_enrolamiento: usuario.reconocimiento_facial?.fecha_ultimo_enrolamiento,
            fotos_urls: fotosUrls
          };
        });
        
        setUsuarios(usuariosConFotos);
        console.log(`✅ SEGURIDAD: Total usuarios cargados con fotos: ${usuariosConFotos.length}`);
      } else {
        console.log('⚠️ SEGURIDAD: Respuesta no exitosa:', response);
        console.log('⚠️ SEGURIDAD: Error:', response.message);
        setError(response.message || 'Error al cargar los datos');
        setUsuarios([]);
      }
    } catch (error) {
      console.error('❌ SEGURIDAD: Error cargando usuarios:', error);
      setError('Error al cargar los datos del backend.');
    } finally {
      setLoading(false);
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
    usuario.unidad_residencial.toLowerCase().includes(searchTerm.toLowerCase())
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
                <p className="text-gray-600">Monitoreo y gestión del sistema de seguridad</p>
              </div>
            </div>
          
            <div className="flex items-center space-x-2">
              {loading && (
                <div className="flex items-center space-x-2">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span className="text-sm text-gray-600">Cargando...</span>
                </div>
              )}
              
              <Button onClick={cargarUsuarios} variant="outline" className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Actualizar
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Usuarios</p>
                  <p className="text-2xl font-bold">{usuarios.length}</p>
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
                  <p className="text-2xl font-bold text-green-600">{usuariosActivos.length}</p>
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
                  <p className="text-2xl font-bold text-orange-600">{usuariosInactivos.length}</p>
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
                  <span>{usuario.unidad_residencial}</span>
                </div>

                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Camera className="h-4 w-4" />
                  <span>{usuario.total_fotos} fotos registradas</span>
                </div>

                {usuario.fecha_ultimo_enrolamiento && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Último: {new Date(usuario.fecha_ultimo_enrolamiento).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                )}

                <div className="pt-2">
                  <Button 
                    onClick={() => verDetalles(usuario)} 
                    className="w-full" 
                    variant="outline"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Detalles
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
                        <p>{selectedUsuario.unidad_residencial}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Fotos de Reconocimiento ({selectedUsuario.total_fotos})
                    </h3>
                    
                    {selectedUsuario.fotos_urls && selectedUsuario.fotos_urls.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2">
                        {selectedUsuario.fotos_urls.map((fotoUrl, index) => (
                          <div 
                            key={index}
                            className="relative group cursor-pointer"
                            onClick={() => verFoto(fotoUrl)}
                          >
                            <img
                              src={fotoUrl}
                              alt={`Foto ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg group-hover:opacity-80 transition-opacity"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all duration-200 flex items-center justify-center">
                              <Eye className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
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