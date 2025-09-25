/**
 * Hook para gestión de inquilinos
 * Proporciona funcionalidades para registro y gestión de inquilinos
 */

import { useState, useCallback } from 'react';
import { 
  registrarInquilino as registrarInquilinoService,
  getInquilinosPropios,
  actualizarInquilino,
  desactivarInquilino,
  type RegistroInquilinoData,
  type InquilinoRegistrado
} from '@/features/inquilinos/services';

interface UseInquilinosReturn {
  // Estado
  inquilinos: InquilinoRegistrado[];
  isLoading: boolean;
  error: string | null;
  
  // Acciones
  registrarInquilino: (data: RegistroInquilinoData) => Promise<void>;
  cargarInquilinos: () => Promise<void>;
  actualizarInquilinoData: (id: number, data: Partial<RegistroInquilinoData>) => Promise<void>;
  desactivarInquilinoData: (id: number) => Promise<void>;
  
  // Utilidades
  clearError: () => void;
}

export function useInquilinos(): UseInquilinosReturn {
  const [inquilinos, setInquilinos] = useState<InquilinoRegistrado[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Registra un nuevo inquilino
   */
  const registrarInquilino = useCallback(async (data: RegistroInquilinoData) => {
    console.log('📝 useInquilinos: Registrando inquilino...', data.email);
    
    try {
      setIsLoading(true);
      setError(null);

      await registrarInquilinoService(data);
      
      console.log('✅ useInquilinos: Inquilino registrado exitosamente');
      
      // Recargar la lista de inquilinos
      await cargarInquilinos();
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      console.error('❌ useInquilinos: Error registrando inquilino:', errorMessage);
      setError(`Error al registrar inquilino: ${errorMessage}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Carga la lista de inquilinos del propietario
   */
  const cargarInquilinos = useCallback(async () => {
    console.log('📝 useInquilinos: Cargando inquilinos...');
    
    try {
      setIsLoading(true);
      setError(null);

      const response = await getInquilinosPropios();
      console.log('🔍 useInquilinos: Respuesta completa:', response);
      console.log('🔍 useInquilinos: Datos extraídos:', response.data);
      console.log('🔍 useInquilinos: Tipo de datos:', typeof response.data, Array.isArray(response.data));
      
      setInquilinos(response.data);
      
      console.log('✅ useInquilinos: Inquilinos cargados exitosamente:', response.data.length, 'inquilinos');
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      console.error('❌ useInquilinos: Error cargando inquilinos:', errorMessage);
      setError(`Error al cargar inquilinos: ${errorMessage}`);
      
      // En caso de error en la primera carga, usar datos mock temporalmente
      setInquilinos(prevInquilinos => {
        if (prevInquilinos.length === 0) {
          console.log('🔄 useInquilinos: Primera carga con error, usando datos mock temporalmente');
          return getMockInquilinos();
        } else {
          console.log('🔄 useInquilinos: Error en recarga, manteniendo datos actuales');
          return prevInquilinos;
        }
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Actualiza información de un inquilino
   */
  const actualizarInquilinoData = useCallback(async (
    id: number, 
    data: Partial<RegistroInquilinoData>
  ) => {
    console.log('📝 useInquilinos: Actualizando inquilino...', id);
    
    try {
      setIsLoading(true);
      setError(null);

      await actualizarInquilino(id, data);
      
      console.log('✅ useInquilinos: Inquilino actualizado exitosamente');
      
      // Recargar la lista
      await cargarInquilinos();
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      console.error('❌ useInquilinos: Error actualizando inquilino:', errorMessage);
      setError(`Error al actualizar inquilino: ${errorMessage}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [cargarInquilinos]);

  /**
   * Desactiva un inquilino
   */
  const desactivarInquilinoData = useCallback(async (id: number) => {
    console.log('📝 useInquilinos: Desactivando inquilino...', id);
    
    try {
      setIsLoading(true);
      setError(null);

      await desactivarInquilino(id);
      
      console.log('✅ useInquilinos: Inquilino desactivado exitosamente');
      
      // Recargar la lista
      await cargarInquilinos();
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      console.error('❌ useInquilinos: Error desactivando inquilino:', errorMessage);
      setError(`Error al desactivar inquilino: ${errorMessage}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [cargarInquilinos]);

  /**
   * Limpia el error actual
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // Estado
    inquilinos,
    isLoading,
    error,
    
    // Acciones
    registrarInquilino,
    cargarInquilinos,
    actualizarInquilinoData,
    desactivarInquilinoData,
    
    // Utilidades
    clearError,
  };
}

// ============================================================================
// DATOS MOCK PARA DESARROLLO
// ============================================================================

function getMockInquilinos(): InquilinoRegistrado[] {
  return [
    {
      id: 1,
      persona: {
        id: 1,
        nombre: 'María',
        apellido: 'González',
        documento_identidad: '12345678',
        email: 'maria@example.com',
        telefono: '71234567',
        fecha_nacimiento: '1990-05-15',
        genero: 'F',
        direccion: 'Av. Banzer #456'
      },
      numero_unidad: 'A-15',
      tipo_unidad: 'departamento',
      fecha_registro: '2024-01-15',
      activo: true,
      observaciones: 'Inquilina responsable'
    },
    {
      id: 2,
      persona: {
        id: 2,
        nombre: 'Carlos',
        apellido: 'Martínez',
        documento_identidad: '87654321',
        email: 'carlos@example.com',
        telefono: '72345678',
        fecha_nacimiento: '1985-08-22',
        genero: 'M',
        direccion: 'Calle Sucre #789'
      },
      numero_unidad: 'B-10',
      tipo_unidad: 'casa',
      fecha_registro: '2024-02-01',
      activo: true,
      observaciones: 'Contrato por 2 años'
    }
  ];
}