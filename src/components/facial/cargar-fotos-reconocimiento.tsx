'use client'

/**
 * Componente para que los propietarios carguen fotos adicionales para reconocimiento facial
 * Las fotos se suben a Dropbox y se asocian al usuario para aparecer en el panel de seguridad
 */

import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Camera, 
  Upload, 
  X, 
  CheckCircle, 
  AlertCircle, 
  Eye, 
  Trash2,
  Plus,
  Image as ImageIcon,
  Loader2
} from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { propietariosService } from '@/features/propietarios/services';
import propietariosServiceInstance from '@/features/propietarios/services';

interface FotoReconocimiento {
  id?: string;
  file?: File;
  preview: string;
  uploaded: boolean;
  dropboxUrl?: string;
  error?: string;
}

interface CargarFotosReconocimientoProps {
  onFotosActualizadas?: (fotos: string[]) => void;
  fotosExistentes?: string[];
  maxFotos?: number;
}

export function CargarFotosReconocimiento({ 
  onFotosActualizadas,
  fotosExistentes = [],
  maxFotos = 10 
}: CargarFotosReconocimientoProps) {
  const { user } = useAuth();
  const [fotos, setFotos] = useState<FotoReconocimiento[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [verificandoFotos, setVerificandoFotos] = useState(false);
  const [fotosEnDropbox, setFotosEnDropbox] = useState<string[]>([]);

  // Función para verificar fotos existentes en Dropbox
  const verificarFotosExistentes = async () => {
    if (!user?.id) {
      setError('Usuario no identificado');
      return;
    }

    setVerificandoFotos(true);
    setError(null);

    try {
      console.log('🔍 Verificando fotos existentes para usuario:', user.id);
      const response = await propietariosServiceInstance.obtenerFotosReconocimiento(user.id);
      
      console.log('📸 Respuesta de verificación:', response);

      if (response.success && response.data) {
        setFotosEnDropbox(response.data.fotos_urls);
        
        if (response.data.fotos_urls.length > 0) {
          setSuccess(`✅ Encontradas ${response.data.fotos_urls.length} fotos en Dropbox`);
          console.log('✅ FOTOS ENCONTRADAS EN DROPBOX:');
          response.data.fotos_urls.forEach((url, index) => {
            console.log(`📸 Foto ${index + 1}:`, url);
          });
        } else {
          setError('❌ No se encontraron fotos de reconocimiento en Dropbox para este usuario');
          console.log('❌ NO HAY FOTOS GUARDADAS EN DROPBOX');
        }
      } else {
        setError('Error al verificar fotos existentes');
      }

    } catch (err: any) {
      console.error('❌ Error verificando fotos:', err);
      setError(`Error al verificar fotos: ${err.message}`);
    } finally {
      setVerificandoFotos(false);
    }
  };

  // Función para validar archivos
  const validarArchivo = (file: File): { valid: boolean; error?: string } => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Solo se permiten archivos JPG, JPEG y PNG'
      };
    }

    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'El archivo no debe superar los 5MB'
      };
    }

    return { valid: true };
  };

  // Función para manejar la selección de archivos
  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files) return;

    const nuevasFotos: FotoReconocimiento[] = [];
    const errores: string[] = [];

    Array.from(files).forEach((file, index) => {
      const validation = validarArchivo(file);
      
      if (!validation.valid) {
        errores.push(`${file.name}: ${validation.error}`);
        return;
      }

      // Verificar límite de fotos
      if (fotos.length + nuevasFotos.length >= maxFotos) {
        errores.push(`Máximo ${maxFotos} fotos permitidas`);
        return;
      }

      const preview = URL.createObjectURL(file);
      nuevasFotos.push({
        id: `${Date.now()}-${index}`,
        file,
        preview,
        uploaded: false
      });
    });

    if (errores.length > 0) {
      setError(errores.join('. '));
    } else {
      setError(null);
    }

    setFotos(prev => [...prev, ...nuevasFotos]);
  }, [fotos.length, maxFotos]);

  // Función para eliminar una foto
  const eliminarFoto = (id: string) => {
    setFotos(prev => {
      const nuevasFotos = prev.filter(foto => foto.id !== id);
      // Liberar URL del preview
      const fotoAEliminar = prev.find(foto => foto.id === id);
      if (fotoAEliminar && fotoAEliminar.preview.startsWith('blob:')) {
        URL.revokeObjectURL(fotoAEliminar.preview);
      }
      return nuevasFotos;
    });
  };

  // Función para subir fotos al backend (que las enviará a Dropbox)
  const subirFotos = async () => {
    if (!user?.id) {
      setError('Usuario no identificado');
      return;
    }

    const fotosParaSubir = fotos.filter(foto => !foto.uploaded && foto.file);
    if (fotosParaSubir.length === 0) {
      setError('No hay fotos para subir');
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(null);
    setUploadProgress(0);

    try {
      // Extraer solo los archivos File
      const archivos = fotosParaSubir
        .map(foto => foto.file)
        .filter((file): file is File => file !== undefined);

      // Debug: Verificar datos del usuario actual
      console.log('👤 Usuario actual completo:', user);
      console.log('🆔 ID que se enviará:', user.id);
      console.log('📧 Email usuario:', user.email);
      console.log('👥 Rol usuario:', user.role);

      // Usar el servicio de propietarios para subir fotos
      const response = await propietariosServiceInstance.subirFotosReconocimiento(user.id, archivos);

      console.log('📤 Respuesta completa del servicio:', response);

      if (response.success && response.data) {
        // Actualizar estado de las fotos como subidas
        setFotos(prev => prev.map(foto => ({
          ...foto,
          uploaded: true,
          dropboxUrl: response.data!.fotos_urls?.find((url: string) => 
            url.includes(foto.file?.name.split('.')[0] || ''))
        })));

        const mensajeExito = `🎉 ¡ÉXITO! ${fotosParaSubir.length} foto(s) subida(s) a Dropbox correctamente`;
        setSuccess(mensajeExito);
        
        // Log detallado del éxito
        console.log('✅ FOTOS SUBIDAS EXITOSAMENTE');
        console.log('📸 Total fotos subidas:', fotosParaSubir.length);
        console.log('🔗 URLs de Dropbox generadas:', response.data.fotos_urls);
        console.log('📝 Mensaje del backend:', response.message);

        // Notificar a componente padre
        if (onFotosActualizadas && response.data.fotos_urls) {
          onFotosActualizadas(response.data.fotos_urls);
        }

        // Limpiar fotos después de un tiempo
        setTimeout(() => {
          setFotos([]);
          setSuccess(null);
        }, 5000); // Aumentamos el tiempo para que sea más visible

      } else {
        console.error('❌ RESPUESTA NO EXITOSA:', response);
        throw new Error(response.message || 'Error al subir las fotos - respuesta no exitosa');
      }

    } catch (err: any) {
      console.error('❌ ERROR COMPLETO SUBIENDO FOTOS:', err);
      
      const mensajeError = `❌ ERROR: No se pudieron subir las fotos a Dropbox. ${err.message || 'Inténtalo de nuevo.'}`;
      setError(mensajeError);
      
      // Log detallado del error
      console.log('💥 DETALLES DEL ERROR:');
      console.log('👤 Usuario ID:', user.id);
      console.log('📁 Fotos que se intentaron subir:', fotosParaSubir.length);
      console.log('🔍 Error mensaje:', err.message);
      console.log('📡 Error stack:', err.stack);
      
      // Marcar fotos con error
      setFotos(prev => prev.map(foto => ({
        ...foto,
        error: foto.file && !foto.uploaded ? 'Error al subir a Dropbox' : foto.error
      })));
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFileSelect(e.dataTransfer.files);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          Cargar Fotos para Reconocimiento Facial
        </CardTitle>
        <CardDescription>
          Sube fotos adicionales para mejorar la precisión del reconocimiento facial.
          Las fotos se almacenarán de forma segura y aparecerán en el sistema de seguridad.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Información del estado actual */}
        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <ImageIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium text-blue-900">Estado Actual</h4>
              <p className="text-sm text-blue-700">
                {fotosExistentes.length} foto(s) registrada(s) | 
                {fotos.filter(f => f.uploaded).length} nueva(s) subida(s)
              </p>
            </div>
          </div>
          <Badge variant="outline" className="text-blue-700 border-blue-200">
            {fotosExistentes.length + fotos.filter(f => f.uploaded).length} / {maxFotos}
          </Badge>
        </div>

        {/* Fotos existentes en Dropbox */}
        {fotosEnDropbox.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h4 className="font-medium text-green-900">
                Fotos Almacenadas en Dropbox ({fotosEnDropbox.length})
              </h4>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {fotosEnDropbox.map((url, index) => (
                <div key={index} className="relative group">
                  <img 
                    src={url} 
                    alt={`Foto ${index + 1}`}
                    className="w-full h-20 object-cover rounded-lg border border-green-200"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-image.png';
                    }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity rounded-lg flex items-center justify-center">
                    <Eye className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <Badge className="absolute -top-2 -right-2 bg-green-600 text-white text-xs">
                    {index + 1}
                  </Badge>
                </div>
              ))}
            </div>
            <p className="text-sm text-green-700 mt-2">
              ✅ Estas fotos están guardadas correctamente en Dropbox y disponibles para el sistema de reconocimiento.
            </p>
          </div>
        )}

        {/* Zona de carga de archivos */}
        <div 
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Arrastra fotos aquí o haz clic para seleccionar
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            JPG, JPEG, PNG hasta 5MB cada una
          </p>
          <input
            type="file"
            multiple
            accept="image/jpeg,image/jpg,image/png"
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
            id="file-upload"
            disabled={uploading}
          />
          <Button
            asChild
            variant="outline"
            disabled={uploading || fotos.length >= maxFotos}
          >
            <label htmlFor="file-upload" className="cursor-pointer">
              <Plus className="w-4 h-4 mr-2" />
              Seleccionar Fotos
            </label>
          </Button>
        </div>

        {/* Vista previa de fotos */}
        {fotos.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Vista Previa ({fotos.length})
            </h4>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {fotos.map((foto) => (
                <div key={foto.id} className="relative group">
                  <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                    <img
                      src={foto.preview}
                      alt="Vista previa"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Estado de la foto */}
                  <div className="absolute top-2 right-2">
                    {foto.uploaded ? (
                      <Badge className="bg-green-500 text-white">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Subida
                      </Badge>
                    ) : foto.error ? (
                      <Badge variant="destructive">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Error
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Pendiente</Badge>
                    )}
                  </div>

                  {/* Botón eliminar */}
                  <Button
                    size="sm"
                    variant="destructive"
                    className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => eliminarFoto(foto.id!)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Progreso de carga */}
        {uploading && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Subiendo fotos...</span>
              <span className="text-sm text-gray-600">{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="w-full" />
          </div>
        )}

        {/* Mensajes de error y éxito */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        {/* Botones de acción */}
        <div className="flex gap-3">
          <Button
            onClick={verificarFotosExistentes}
            disabled={verificandoFotos}
            variant="outline"
            className="flex-1"
          >
            {verificandoFotos ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Verificando...
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 mr-2" />
                Ver Fotos en Dropbox
              </>
            )}
          </Button>

          <Button
            onClick={subirFotos}
            disabled={uploading || fotos.filter(f => !f.uploaded).length === 0}
            className="flex-1"
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Subiendo...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Subir {fotos.filter(f => !f.uploaded).length} Foto(s)
              </>
            )}
          </Button>

          {fotos.length > 0 && !uploading && (
            <Button
              variant="outline"
              onClick={() => {
                fotos.forEach(foto => {
                  if (foto.preview.startsWith('blob:')) {
                    URL.revokeObjectURL(foto.preview);
                  }
                });
                setFotos([]);
                setError(null);
              }}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Limpiar
            </Button>
          )}
        </div>

        {/* Información adicional */}
        <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-600">
          <h4 className="font-medium mb-2">📋 Información importante:</h4>
          <ul className="space-y-1">
            <li>• Las fotos se almacenan de forma segura en Dropbox</li>
            <li>• Serán visibles para el personal de seguridad del edificio</li>
            <li>• Se recomienda subir fotos con buena iluminación y desde diferentes ángulos</li>
            <li>• Las fotos procesadas aparecerán automáticamente en el sistema de control de acceso</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

export default CargarFotosReconocimiento;