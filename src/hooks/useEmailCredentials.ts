/**
 * Hook para gestión de emails y credenciales
 * Proporciona funcionalidades para envío de credenciales por email
 */

import { useState, useCallback } from 'react';
import { 
  enviarCredencialesPorEmail,
  enviarNotificacionEstado,
  reenviarCredenciales,
  generarCredencialesTemporales,
  type EmailCredentialsData,
  type EmailNotificationData
} from '@/features/propietarios/email-service';

interface UseEmailCredentialsReturn {
  // Estado
  isLoading: boolean;
  error: string | null;
  success: boolean;
  
  // Acciones principales
  enviarCredenciales: (data: EmailCredentialsData) => Promise<void>;
  notificarEstado: (data: EmailNotificationData) => Promise<void>;
  reenviarCredencialesUsuario: (email: string) => Promise<void>;
  generarYEnviarCredenciales: (usuarioId: number, tipoUsuario: 'propietario' | 'inquilino', email: string, nombres: string, apellidos: string) => Promise<void>;
  
  // Utilidades
  clearError: () => void;
  clearSuccess: () => void;
}

export function useEmailCredentials(): UseEmailCredentialsReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  /**
   * Envía credenciales por email
   */
  const enviarCredenciales = useCallback(async (data: EmailCredentialsData) => {
    console.log('📧 useEmailCredentials: Enviando credenciales...', data.email);
    
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(false);

      await enviarCredencialesPorEmail(data);
      
      setSuccess(true);
      console.log('✅ useEmailCredentials: Credenciales enviadas exitosamente');
      
    } catch (error: any) {
      const errorMessage = error?.response?.data?.mensaje || 'Error al enviar credenciales por email';
      setError(errorMessage);
      console.error('❌ useEmailCredentials: Error enviando credenciales:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Envía notificación de estado
   */
  const notificarEstado = useCallback(async (data: EmailNotificationData) => {
    console.log('📧 useEmailCredentials: Enviando notificación...', data.email);
    
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(false);

      await enviarNotificacionEstado(data);
      
      setSuccess(true);
      console.log('✅ useEmailCredentials: Notificación enviada exitosamente');
      
    } catch (error: any) {
      const errorMessage = error?.response?.data?.mensaje || 'Error al enviar notificación';
      setError(errorMessage);
      console.error('❌ useEmailCredentials: Error enviando notificación:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Reenvía credenciales a un usuario
   */
  const reenviarCredencialesUsuario = useCallback(async (email: string) => {
    console.log('📧 useEmailCredentials: Reenviando credenciales...', email);
    
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(false);

      await reenviarCredenciales(email);
      
      setSuccess(true);
      console.log('✅ useEmailCredentials: Credenciales reenviadas exitosamente');
      
    } catch (error: any) {
      const errorMessage = error?.response?.data?.mensaje || 'Error al reenviar credenciales';
      setError(errorMessage);
      console.error('❌ useEmailCredentials: Error reenviando credenciales:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Genera credenciales temporales y las envía por email
   */
  const generarYEnviarCredenciales = useCallback(async (
    usuarioId: number, 
    tipoUsuario: 'propietario' | 'inquilino', 
    email: string, 
    nombres: string, 
    apellidos: string
  ) => {
    console.log('🔑 useEmailCredentials: Generando y enviando credenciales...', email);
    
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(false);

      // 1. Generar credenciales temporales
      const credencialesResponse = await generarCredencialesTemporales(usuarioId, tipoUsuario);
      
      // 2. Enviar credenciales por email
      await enviarCredencialesPorEmail({
        email,
        nombres,
        apellidos,
        usuario_temporal: credencialesResponse.data.usuario_temporal,
        password_temporal: credencialesResponse.data.password_temporal,
        tipo_usuario: tipoUsuario
      });
      
      setSuccess(true);
      console.log('✅ useEmailCredentials: Proceso completo exitoso');
      
    } catch (error: any) {
      const errorMessage = error?.response?.data?.mensaje || 'Error en el proceso de credenciales';
      setError(errorMessage);
      console.error('❌ useEmailCredentials: Error en proceso completo:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Limpia el estado de error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Limpia el estado de éxito
   */
  const clearSuccess = useCallback(() => {
    setSuccess(false);
  }, []);

  return {
    // Estado
    isLoading,
    error,
    success,
    
    // Acciones
    enviarCredenciales,
    notificarEstado,
    reenviarCredencialesUsuario,
    generarYEnviarCredenciales,
    
    // Utilidades
    clearError,
    clearSuccess,
  };
}