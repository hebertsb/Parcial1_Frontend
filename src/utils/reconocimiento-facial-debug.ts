/**
 * 🔧 UTILIDADES DE TESTING Y DEBUGGING - RECONOCIMIENTO FACIAL
 * 
 * Funciones de utilidad basadas en las recomendaciones críticas del backend
 * para diagnosticar y solucionar problemas de conexión e integración.
 */

// 🚨 CONFIGURACIÓN ANTI-PROXY SEGÚN SOLUCIÓN DEL BACKEND
export const API_CONFIG = {
  BASE_URL: 'http://127.0.0.1:8000', // NO localhost (evita proxy corporativo)
  TIMEOUT: 30000, // 30 segundos para IA real
  ENDPOINTS: {
    VERIFICACION: '/api/seguridad/verificacion-tiempo-real/',
    HEALTH: '/api/seguridad/health/', // Sin autenticación
    DASHBOARD: '/api/seguridad/dashboard/', // Requiere autenticación
    PROPIETARIOS: '/api/seguridad/propietarios-reconocimiento/',
    USUARIOS: '/api/seguridad/usuarios-reconocimiento/'
  }
};

/**
 * 🚨 FUNCIÓN EXACTA DEL BACKEND PARA EVITAR PROXY
 */
export const verificarRostroSinProxy = async (formData: FormData) => {
  try {
    const response = await fetch(
      'http://127.0.0.1:8000/api/seguridad/verificacion-tiempo-real/',
      {
        method: 'POST',
        body: formData
        // NO proxy, NO Content-Type manual
      }
    );
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

/**
 * 🔍 Test de conexión básica con el backend
 */
export async function testConexionBackend(): Promise<{
  success: boolean;
  message: string;
  details?: any;
}> {
  try {
    console.log('🔍 Testing conexión con backend...');
    console.log('🎯 URL:', `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.HEALTH}`);

    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.HEALTH}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    console.log('📊 Status:', response.status);
    console.log('📊 Headers:', Object.fromEntries(response.headers.entries()));

    if (response.ok) {
      const data = await response.json();
      return {
        success: true,
        message: '✅ Backend conectado correctamente',
        details: {
          status: response.status,
          data: data
        }
      };
    } else {
      return {
        success: false,
        message: `❌ Backend respondió con error: ${response.status}`,
        details: {
          status: response.status,
          statusText: response.statusText
        }
      };
    }

  } catch (error: any) {
    console.error('💥 Error en test de conexión:', error);
    
    let mensaje = '❌ Error de conexión';
    if (error.message.includes('proxy')) {
      mensaje = '🚨 Error de proxy - Desactivar proxy para 127.0.0.1';
    } else if (error.message.includes('CORS')) {
      mensaje = '🔒 Error CORS - Verificar backend en http://127.0.0.1:8000';
    } else if (error.message.includes('fetch')) {
      mensaje = '🔌 Backend no disponible - Ejecutar: python manage.py runserver';
    }

    return {
      success: false,
      message: mensaje,
      details: {
        error: error.message,
        type: error.name
      }
    };
  }
}

/**
 * 🎯 Test específico del endpoint de verificación facial
 */
export async function testEndpointVerificacion(): Promise<{
  success: boolean;
  message: string;
  details?: any;
}> {
  try {
    console.log('🎯 Testing endpoint de verificación facial...');
    
    // Crear FormData de prueba (sin foto, debe dar error esperado)
    const formData = new FormData();
    formData.append('umbral_confianza', '70.0');
    formData.append('buscar_en', 'propietarios');
    formData.append('usar_ia_real', 'false');
    
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.VERIFICACION}`;
    console.log('🎯 URL completa:', url);

    const response = await fetch(url, {
      method: 'POST',
      body: formData
      // NO incluir Content-Type - se auto-genera
    });

    console.log('📊 Status:', response.status);
    
    const data = await response.json();
    console.log('📋 Response:', data);

    // Error esperado: "Se requiere subir una foto"
    if (response.status === 400 && data.error?.includes('foto')) {
      return {
        success: true,
        message: '✅ Endpoint funciona correctamente (error esperado sin foto)',
        details: {
          status: response.status,
          error: data.error
        }
      };
    } else {
      return {
        success: false,
        message: `⚠️ Respuesta inesperada del endpoint: ${response.status}`,
        details: {
          status: response.status,
          data: data
        }
      };
    }

  } catch (error: any) {
    console.error('💥 Error en test de endpoint:', error);
    return {
      success: false,
      message: `❌ Endpoint no disponible: ${error.message}`,
      details: {
        error: error.message
      }
    };
  }
}

/**
 * 📝 Validar archivo antes de envío
 */
export function validarArchivo(file: File): {
  valid: boolean;
  message: string;
  details?: any;
} {
  console.log('📁 Validando archivo:', {
    nombre: file.name,
    tamaño: file.size,
    tipo: file.type,
    ultimaModificacion: new Date(file.lastModified).toISOString()
  });

  // Validar tipo MIME
  if (!file.type.startsWith('image/')) {
    return {
      valid: false,
      message: '❌ Formato no válido. Solo JPEG/PNG permitidos',
      details: { tipo_actual: file.type, tipos_permitidos: ['image/jpeg', 'image/png'] }
    };
  }

  // Validar tamaño (5MB máximo)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    return {
      valid: false,
      message: `❌ Archivo muy grande: ${(file.size / 1024 / 1024).toFixed(2)}MB. Máximo 5MB`,
      details: { 
        tamaño_actual: file.size,
        tamaño_maximo: maxSize,
        tamaño_mb: (file.size / 1024 / 1024).toFixed(2)
      }
    };
  }

  // Validar que no esté vacío
  if (file.size === 0) {
    return {
      valid: false,
      message: '❌ Archivo vacío',
      details: { tamaño: file.size }
    };
  }

  return {
    valid: true,
    message: '✅ Archivo válido',
    details: {
      nombre: file.name,
      tamaño_mb: (file.size / 1024 / 1024).toFixed(2),
      tipo: file.type
    }
  };
}

/**
 * 🎨 Crear FormData para verificación (debugging)
 */
export function crearFormDataDebug(
  foto: File,
  opciones: {
    umbralConfianza?: string;
    buscarEn?: string;
    usarIAReal?: boolean;
  } = {}
): FormData {
  const formData = new FormData();
  
  formData.append('foto_verificacion', foto);
  formData.append('umbral_confianza', opciones.umbralConfianza || '70.0');
  formData.append('buscar_en', opciones.buscarEn || 'propietarios');
  formData.append('usar_ia_real', opciones.usarIAReal ? 'true' : 'false');

  console.log('📤 FormData creado:');
  for (let [key, value] of formData.entries()) {
    if (value instanceof File) {
      console.log(`  ${key}: ${value.name} (${value.size} bytes, ${value.type})`);
    } else {
      console.log(`  ${key}: ${value}`);
    }
  }

  return formData;
}

/**
 * 🕐 Formatear tiempo de procesamiento
 */
export function formatearTiempo(ms: number): string {
  if (ms < 1000) {
    return `${Math.round(ms)}ms`;
  } else if (ms < 60000) {
    return `${(ms / 1000).toFixed(1)}s`;
  } else {
    return `${Math.floor(ms / 60000)}m ${Math.round((ms % 60000) / 1000)}s`;
  }
}

/**
 * 🎯 Analizar respuesta de verificación
 */
export function analizarRespuesta(data: any): {
  tipo: 'AUTORIZADO' | 'DENEGADO' | 'ERROR';
  mensaje: string;
  detalles: any;
} {
  console.log('📊 Analizando respuesta:', JSON.stringify(data, null, 2));

  if (!data) {
    return {
      tipo: 'ERROR',
      mensaje: 'Respuesta vacía del servidor',
      detalles: { data }
    };
  }

  if (!data.success) {
    return {
      tipo: 'ERROR',
      mensaje: data.error || 'Error desconocido del servidor',
      detalles: { error: data.error, data }
    };
  }

  const verificacion = data.verificacion;
  if (!verificacion) {
    return {
      tipo: 'ERROR',
      mensaje: 'Respuesta sin datos de verificación',
      detalles: { data }
    };
  }

  if (verificacion.resultado === 'ACEPTADO') {
    const persona = verificacion.persona_identificada;
    return {
      tipo: 'AUTORIZADO',
      mensaje: `Acceso autorizado para ${persona?.nombre_completo || 'persona identificada'}`,
      detalles: {
        persona: persona,
        confianza: verificacion.confianza,
        umbral: verificacion.umbral_usado,
        estadisticas: data.estadisticas
      }
    };
  } else {
    return {
      tipo: 'DENEGADO',
      mensaje: `Acceso denegado - Confianza: ${verificacion.confianza}% (requerido: ${verificacion.umbral_usado}%)`,
      detalles: {
        confianza: verificacion.confianza,
        umbral: verificacion.umbral_usado,
        estadisticas: data.estadisticas
      }
    };
  }
}

/**
 * 🚨 TEST ESPECÍFICO PARA PROBLEMA DE PROXY
 */
export async function testProxyIssue(): Promise<{
  success: boolean;
  message: string;
  details?: any;
}> {
  try {
    console.log('🚨 Testing problema de proxy específico...');
    
    // Test 1: localhost vs 127.0.0.1 (usando endpoint sin autenticación)
    const testLocalhost = fetch('http://localhost:8000/api/seguridad/health/');
    const test127 = fetch('http://127.0.0.1:8000/api/seguridad/health/');
    
    const results = await Promise.allSettled([testLocalhost, test127]);
    
    const localhostResult = results[0];
    const ip127Result = results[1];
    
    console.log('📊 localhost result:', localhostResult.status);
    console.log('📊 127.0.0.1 result:', ip127Result.status);
    
    if (localhostResult.status === 'rejected' && ip127Result.status === 'fulfilled') {
      return {
        success: true,
        message: '✅ Problema de proxy confirmado - 127.0.0.1 funciona, localhost no',
        details: {
          localhost_error: localhostResult.reason?.message,
          ip127_success: true,
          recommendation: 'Usar 127.0.0.1 en lugar de localhost'
        }
      };
    } else if (localhostResult.status === 'fulfilled' && ip127Result.status === 'fulfilled') {
      return {
        success: true,
        message: '✅ Sin problemas de proxy detectados',
        details: {
          localhost_ok: true,
          ip127_ok: true
        }
      };
    } else {
      return {
        success: false,
        message: '❌ Problemas de conexión generales',
        details: {
          localhost_error: localhostResult.status === 'rejected' ? localhostResult.reason?.message : null,
          ip127_error: ip127Result.status === 'rejected' ? ip127Result.reason?.message : null
        }
      };
    }
    
  } catch (error: any) {
    return {
      success: false,
      message: `❌ Error en test de proxy: ${error.message}`,
      details: { error: error.message }
    };
  }
}

/**
 * 🚨 Diagnóstico completo del sistema
 */
export async function diagnosticoCompleto(): Promise<void> {
  console.log('🔧 Iniciando diagnóstico completo del sistema...');
  console.log('===============================================');

  // Test 1: Conexión básica
  console.log('🔍 Test 1: Conexión con backend');
  const testConexion = await testConexionBackend();
  console.log(testConexion.message);
  if (testConexion.details) {
    console.log('  Detalles:', testConexion.details);
  }
  console.log('');

  // Test 2: Problema de proxy específico
  console.log('🚨 Test 2: Problema de proxy');
  const testProxy = await testProxyIssue();
  console.log(testProxy.message);
  if (testProxy.details) {
    console.log('  Detalles:', testProxy.details);
  }
  console.log('');

  // Test 3: Endpoint específico
  console.log('🎯 Test 3: Endpoint de verificación');
  const testEndpoint = await testEndpointVerificacion();
  console.log(testEndpoint.message);
  if (testEndpoint.details) {
    console.log('  Detalles:', testEndpoint.details);
  }
  console.log('');

  // Test 4: Configuración del navegador
  console.log('🌐 Test 4: Configuración del navegador');
  console.log('  User Agent:', navigator.userAgent);
  console.log('  Cookies habilitadas:', navigator.cookieEnabled);
  console.log('  Online:', navigator.onLine);
  console.log('  Idioma:', navigator.language);
  console.log('');

  // Test 5: Soporte de tecnologías
  console.log('📷 Test 5: Soporte de tecnologías');
  console.log('  File API:', typeof File !== 'undefined');
  console.log('  FormData:', typeof FormData !== 'undefined');
  console.log('  fetch:', typeof fetch !== 'undefined');
  console.log('  getUserMedia:', !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia));
  console.log('');

  console.log('✅ Diagnóstico completo finalizado');
  console.log('===============================================');
}

// Exportar como utilidad global para testing en consola
if (typeof window !== 'undefined') {
  (window as any).reconocimientoFacialDebug = {
    testConexionBackend,
    testEndpointVerificacion,
    testProxyIssue,
    verificarRostroSinProxy,
    validarArchivo,
    crearFormDataDebug,
    formatearTiempo,
    analizarRespuesta,
    diagnosticoCompleto,
    API_CONFIG
  };
  
  console.log('🔧 Utilidades de debugging disponibles en: window.reconocimientoFacialDebug');
  console.log('🚨 Función anti-proxy disponible: window.reconocimientoFacialDebug.verificarRostroSinProxy');
}