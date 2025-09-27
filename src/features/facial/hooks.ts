/**
 * Hook para gestión de reconocimiento facial
 * Enrolamiento, verificación y estado de rostros
 */

import { useState, useCallback } from 'react';
import { faceRecognitionService, EnrollmentResponse, VerificationResponse, FaceStatusResponse } from './services';

export function useFaceRecognition() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Enrolar imagen facial
  const enrollFace = useCallback(async (
    personaId: number, 
    imagen: File, 
    tipoPersona: 'copropietario' | 'inquilino' = 'copropietario'
  ) => {
    setLoading(true);
    setError(null);

    try {
      // Validar archivo primero
      const validation = faceRecognitionService.validateImageFile(imagen);
      if (!validation.valid) {
        setError(validation.error || 'Archivo inválido');
        return { success: false, error: validation.error };
      }

      const result = await faceRecognitionService.enrollFace(personaId, imagen, tipoPersona);
      
      if (!result.success) {
        setError(result.error || 'Error en el enrolamiento');
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Verificar imagen facial
  const verifyFace = useCallback(async (
    personaId: number, 
    imagen: File, 
    tipoPersona: 'copropietario' | 'inquilino' = 'copropietario'
  ) => {
    setLoading(true);
    setError(null);

    try {
      // Validar archivo primero
      const validation = faceRecognitionService.validateImageFile(imagen);
      if (!validation.valid) {
        setError(validation.error || 'Archivo inválido');
        return { success: false, error: validation.error };
      }

      const result = await faceRecognitionService.verifyFace(personaId, imagen, tipoPersona);
      
      if (!result.success) {
        setError(result.error || 'Error en la verificación');
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Eliminar enrolamiento
  const deleteEnrollment = useCallback(async (copropietarioId: number) => {
    setLoading(true);
    setError(null);

    try {
      const result = await faceRecognitionService.deleteEnrollment(copropietarioId);
      
      if (!result.success) {
        setError(result.error || 'Error al eliminar enrolamiento');
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener estado del enrolamiento
  const getFaceStatus = useCallback(async (copropietarioId: number) => {
    setLoading(true);
    setError(null);

    try {
      const result = await faceRecognitionService.getFaceStatus(copropietarioId);
      
      if (!result.success) {
        setError(result.error || 'Error al obtener estado');
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Limpiar errores
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    enrollFace,
    verifyFace,
    deleteEnrollment,
    getFaceStatus,
    clearError,
  };
}

export type { EnrollmentResponse, VerificationResponse, FaceStatusResponse };