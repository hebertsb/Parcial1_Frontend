/**
 * Servicio para enrolamiento y autenticación facial
 * Basado en la API del backend: /api/faces/
 */

import { apiClient } from '@/core/api/client';

export interface EnrollmentResponse {
  ok: boolean;
  proveedor: string;
  face_ref: string;
  imagen_url: string;
  timestamp: string;
  copropietario_id: number;
  updated: boolean;
  confidence: number;
}

export interface VerificationResponse {
  match: boolean;
  confianza: number;
  proveedor: string;
  umbral: number;
  copropietario_id: number;
  timestamp: string;
  distance: number;
}

export interface FaceStatusResponse {
  copropietario_id: number;
  enrolled: boolean;
  provider: string;
  enrollment_date: string;
  verification_attempts: number;
  last_verification: string;
  confidence: number;
}

export const faceRecognitionService = {
  /**
   * Enrolar imagen facial a un copropietario o inquilino
   */
  async enrollFace(
    personaId: number, 
    imagen: File, 
    tipoPersona: 'copropietario' | 'inquilino' = 'copropietario'
  ): Promise<{ success: boolean; data?: EnrollmentResponse; error?: string }> {
    try {
      const formData = new FormData();
      
      // Usar copropietario_id o inquilino_id según el tipo
      const fieldName = tipoPersona === 'inquilino' ? 'inquilino_id' : 'copropietario_id';
      formData.append(fieldName, personaId.toString());
      formData.append('imagen', imagen);

      const response = await fetch('http://127.0.0.1:8000/api/faces/enroll/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data: EnrollmentResponse = await response.json();
        return { success: true, data };
      } else {
        const errorData = await response.json();
        return { 
          success: false, 
          error: errorData.error || `Error ${response.status}: ${response.statusText}` 
        };
      }
    } catch (error) {
      console.error('Error enrolling face:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error desconocido' 
      };
    }
  },

  /**
   * Verificar imagen facial (autenticación)
   */
  async verifyFace(
    personaId: number, 
    imagen: File, 
    tipoPersona: 'copropietario' | 'inquilino' = 'copropietario'
  ): Promise<{ success: boolean; data?: VerificationResponse; error?: string }> {
    try {
      const formData = new FormData();
      
      // Usar copropietario_id o inquilino_id según el tipo
      const fieldName = tipoPersona === 'inquilino' ? 'inquilino_id' : 'copropietario_id';
      formData.append(fieldName, personaId.toString());
      formData.append('imagen', imagen);

      const response = await fetch('http://127.0.0.1:8000/api/faces/verify/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data: VerificationResponse = await response.json();
        return { success: true, data };
      } else {
        const errorData = await response.json();
        return { 
          success: false, 
          error: errorData.error || `Error ${response.status}: ${response.statusText}` 
        };
      }
    } catch (error) {
      console.error('Error verifying face:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error desconocido' 
      };
    }
  },

  /**
   * Eliminar enrolamiento facial
   */
  async deleteEnrollment(copropietarioId: number): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/faces/enroll/${copropietarioId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, message: data.message };
      } else {
        const errorData = await response.json();
        return { 
          success: false, 
          error: errorData.error || `Error ${response.status}: ${response.statusText}` 
        };
      }
    } catch (error) {
      console.error('Error deleting enrollment:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error desconocido' 
      };
    }
  },

  /**
   * Consultar estado de enrolamiento
   */
  async getFaceStatus(copropietarioId: number): Promise<{ success: boolean; data?: FaceStatusResponse; error?: string }> {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/faces/status/${copropietarioId}/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data: FaceStatusResponse = await response.json();
        return { success: true, data };
      } else {
        const errorData = await response.json();
        return { 
          success: false, 
          error: errorData.error || `Error ${response.status}: ${response.statusText}` 
        };
      }
    } catch (error) {
      console.error('Error getting face status:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error desconocido' 
      };
    }
  },

  /**
   * Validar archivo de imagen
   */
  validateImageFile(file: File): { valid: boolean; error?: string } {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/bmp', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Tipo de archivo no válido. Use JPG, PNG, BMP o GIF.'
      };
    }

    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'El archivo es demasiado grande. Máximo 5MB.'
      };
    }

    return { valid: true };
  }
};