// Test simple de viviendas - para debugging
import { apiClient } from '@/core/api/client';

export async function testViviendas() {
  try {
    console.log('🔍 Probando conexión con /api/viviendas/...');
    const response = await apiClient.get('/api/viviendas/');
    console.log('✅ Respuesta exitosa:', response);
    return response.data;
  } catch (error) {
    console.error('❌ Error en testViviendas:', error);
    throw error;
  }
}