'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import propietariosService from '@/features/propietarios/services';

interface FotoReconocimiento {
  url: string;
  id: string;
}

interface FotosReconocimientoProps {
  usuarioId?: string | number;
  mostrarBotonConfigurar?: boolean;
  onConfiguracionClick?: () => void;
}

export default function FotosReconocimientoComponent({ 
  usuarioId, 
  mostrarBotonConfigurar = true,
  onConfiguracionClick 
}: FotosReconocimientoProps) {
  const { user } = useAuth();
  const [fotos, setFotos] = useState<FotoReconocimiento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalFotos, setTotalFotos] = useState(0);
  const [fechaActualizacion, setFechaActualizacion] = useState<string | null>(null);

  const idUsuario = usuarioId || user?.id;

  useEffect(() => {
    if (idUsuario) {
      cargarFotosReconocimiento();
    }
  }, [idUsuario]);

  const cargarFotosReconocimiento = async () => {
    if (!idUsuario) return;

    try {
      setLoading(true);
      setError(null);

      const response = await propietariosService.obtenerFotosReconocimiento(idUsuario);
      
      if (response.success && response.data) {
        const fotosData = response.data.fotos_urls.map((url, index) => ({
          id: `foto-${index + 1}`,
          url: url
        }));

        setFotos(fotosData);
        setTotalFotos(response.data.total_fotos);
        setFechaActualizacion(response.data.fecha_ultima_actualizacion || null);
      }
    } catch (error: any) {
      console.error('Error cargando fotos de reconocimiento:', error);
      setError(error.message || 'Error cargando fotos');
      setFotos([]);
      setTotalFotos(0);
    } finally {
      setLoading(false);
    }
  };

  const handleImageLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    event.currentTarget.style.opacity = '1';
  };

  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    event.currentTarget.style.display = 'none';
  };

  if (loading) {
    return (
      <div className="bg-gray-900 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <span className="w-6 h-6 mr-2">👤</span>
            Reconocimiento Facial
          </h3>
          <span className="bg-yellow-600 text-yellow-100 px-2 py-1 rounded text-xs">
            Cargando...
          </span>
        </div>
        
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-900 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <span className="w-6 h-6 mr-2">👤</span>
            Reconocimiento Facial
          </h3>
          <span className="bg-red-600 text-red-100 px-2 py-1 rounded text-xs">
            Error
          </span>
        </div>
        
        <div className="text-center py-8">
          <p className="text-red-400 mb-4">❌ {error}</p>
          <button
            onClick={cargarFotosReconocimiento}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            🔄 Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <span className="w-6 h-6 mr-2">👤</span>
          Reconocimiento Facial
        </h3>
        {totalFotos > 0 ? (
          <span className="bg-green-600 text-green-100 px-2 py-1 rounded text-xs">
            ✅ Configurado ({totalFotos} fotos)
          </span>
        ) : (
          <span className="bg-gray-600 text-gray-100 px-2 py-1 rounded text-xs">
            ⚪ Inactivo
          </span>
        )}
      </div>

      {totalFotos === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-700 rounded-full flex items-center justify-center">
            <span className="text-2xl">👤</span>
          </div>
          
          <p className="text-gray-400 mb-6">
            No se han registrado fotos para reconocimiento facial
          </p>
          
          {mostrarBotonConfigurar && (
            <button
              onClick={onConfiguracionClick}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors font-medium"
            >
              ➕ Configurar Reconocimiento
            </button>
          )}
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
            {fotos.map((foto, index) => (
              <div
                key={foto.id}
                className="relative group overflow-hidden rounded-lg bg-gray-800 aspect-square"
              >
                <img
                  src={foto.url}
                  alt={`Foto de reconocimiento ${index + 1}`}
                  className="w-full h-full object-cover opacity-0 transition-all duration-300 group-hover:scale-105"
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                />
                
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                  <span className="text-white opacity-0 group-hover:opacity-100 text-sm font-medium">
                    Foto {index + 1}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {fechaActualizacion && (
            <p className="text-gray-400 text-sm text-center">
              📅 Última actualización: {new Date(fechaActualizacion).toLocaleDateString('es-ES')}
            </p>
          )}

          {mostrarBotonConfigurar && (
            <div className="mt-4 text-center">
              <button
                onClick={onConfiguracionClick}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors text-sm"
              >
                🔄 Actualizar Fotos
              </button>
            </div>
          )}
        </div>
      )}

      {/* Información de seguridad */}
      <div className="mt-6 p-4 bg-blue-900 bg-opacity-30 rounded-lg border border-blue-700">
        <h4 className="text-blue-200 font-medium mb-2">ℹ️ Información de Seguridad</h4>
        <ul className="text-blue-300 text-sm space-y-1">
          <li>• Tus datos biométricos están encriptados y seguros</li>
          <li>• Solo se usan para autenticación en este edificio</li>
          <li>• Puedes solicitar su eliminación en cualquier momento</li>
        </ul>
      </div>
    </div>
  );
}