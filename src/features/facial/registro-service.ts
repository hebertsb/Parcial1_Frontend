/**
 * Servicio para manejo de enrolamiento facial en el proceso de registro
 * Gestiona el flujo: Solicitud -> Aprobación -> Enrolamiento
 */

import { faceRecognitionService } from './services';

export interface RegistroFacialData {
  personaId: number;
  tipoPersona: 'copropietario' | 'inquilino';
  foto: File;
  solicitudId?: number;
}

export const registroFacialService = {
  /**
   * Almacenar foto temporalmente durante el registro
   * (En localStorage o IndexedDB para persistencia local)
   */
  guardarFotoTemporal(solicitudId: string, foto: File): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        const reader = new FileReader();
        reader.onload = () => {
          const fotoData = {
            nombre: foto.name,
            tipo: foto.type,
            tamaño: foto.size,
            data: reader.result as string,
            timestamp: new Date().toISOString()
          };
          
          localStorage.setItem(`foto_temporal_${solicitudId}`, JSON.stringify(fotoData));
          resolve(true);
        };
        reader.onerror = () => resolve(false);
        reader.readAsDataURL(foto);
      } catch (error) {
        console.error('Error guardando foto temporal:', error);
        resolve(false);
      }
    });
  },

  /**
   * Recuperar foto temporal
   */
  async recuperarFotoTemporal(solicitudId: string): Promise<File | null> {
    try {
      const fotoDataStr = localStorage.getItem(`foto_temporal_${solicitudId}`);
      if (!fotoDataStr) return null;

      const fotoData = JSON.parse(fotoDataStr);
      
      // Convertir base64 de vuelta a File
      const response = await fetch(fotoData.data);
      const blob = await response.blob();
      
      return new File([blob], fotoData.nombre, { type: fotoData.tipo });
    } catch (error) {
      console.error('Error recuperando foto temporal:', error);
      return null;
    }
  },

  /**
   * Guardar foto base64 temporalmente para visualización en admin
   */
  guardarFotoBase64Temporal(solicitudId: string, fotoBase64: string): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        const key = `temp_foto_base64_${solicitudId}`;
        const fotoData = {
          base64: fotoBase64,
          timestamp: new Date().toISOString()
        };
        localStorage.setItem(key, JSON.stringify(fotoData));
        resolve(true);
      } catch (error) {
        console.error('Error guardando foto base64 temporal:', error);
        resolve(false);
      }
    });
  },

  /**
   * Recuperar foto base64 temporal
   */
  recuperarFotoBase64Temporal(solicitudId: string): string | null {
    try {
      const key = `temp_foto_base64_${solicitudId}`;
      const data = localStorage.getItem(key);
      if (data) {
        const fotoData = JSON.parse(data);
        return fotoData.base64;
      }
      return null;
    } catch (error) {
      console.error('Error recuperando foto base64 temporal:', error);
      return null;
    }
  },

  /**
   * Limpiar foto temporal
   */
  limpiarFotoTemporal(solicitudId: string): void {
    localStorage.removeItem(`foto_temporal_${solicitudId}`);
    localStorage.removeItem(`temp_foto_base64_${solicitudId}`);
  },

  /**
   * Enrolar después de aprobación (para usar desde panel de admin)
   */
  async enrolarDespuesDeAprobacion(data: RegistroFacialData): Promise<{
    success: boolean;
    data?: any;
    error?: string;
  }> {
    try {
      const result = await faceRecognitionService.enrollFace(
        data.personaId,
        data.foto,
        data.tipoPersona
      );

      // Si hay solicitudId, limpiar foto temporal
      if (data.solicitudId) {
        this.limpiarFotoTemporal(data.solicitudId.toString());
      }

      return result;
    } catch (error) {
      console.error('Error en enrolamiento post-aprobación:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  },

  /**
   * Verificar si hay foto temporal para una solicitud
   */
  tieneFotoTemporal(solicitudId: string): boolean {
    return localStorage.getItem(`foto_temporal_${solicitudId}`) !== null;
  },

  /**
   * Listar todas las fotos temporales (para cleanup)
   */
  listarFotosTemporales(): string[] {
    const keys = Object.keys(localStorage);
    return keys.filter(key => key.startsWith('foto_temporal_'));
  },

  /**
   * Limpiar fotos temporales antiguas (más de 7 días)
   */
  limpiezaFotosTemporales(): void {
    const keys = this.listarFotosTemporales();
    const diasLimite = 7;
    const timestampLimite = Date.now() - (diasLimite * 24 * 60 * 60 * 1000);

    keys.forEach(key => {
      try {
        const fotoDataStr = localStorage.getItem(key);
        if (!fotoDataStr) return;

        const fotoData = JSON.parse(fotoDataStr);
        const fotoTimestamp = new Date(fotoData.timestamp).getTime();

        if (fotoTimestamp < timestampLimite) {
          localStorage.removeItem(key);
          console.log(`Foto temporal eliminada: ${key}`);
        }
      } catch (error) {
        // Si hay error parseando, eliminar la entrada corrupta
        localStorage.removeItem(key);
      }
    });
  }
};