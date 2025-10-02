/**
 * Utilidad para camuflar URLs locales y mostrar URLs profesionales
 * Transforma localhost y IPs locales en URLs de servidor profesional
 */

interface URLConfig {
  frontend: string;
  backend: string;
  domain: string;
}

// Configuración de URLs profesionales
const URL_PROFESIONAL: URLConfig = {
  frontend: 'https://security-facial-system.netlify.app',
  backend: 'https://api-facial-recognition.herokuapp.com',
  domain: 'facial-security.pro'
};

/**
 * Camufla una URL local por una URL profesional
 */
export const camuflarURL = (url: string): string => {
  if (!url) return url;

  // Patrones de URLs locales a reemplazar
  const patronesLocales = [
    /https?:\/\/localhost:\d+/g,
    /https?:\/\/127\.0\.0\.1:\d+/g,
    /https?:\/\/192\.168\.\d+\.\d+:\d+/g,
    /https?:\/\/0\.0\.0\.0:\d+/g,
    /localhost:\d+/g,
    /127\.0\.0\.1:\d+/g,
    /192\.168\.\d+\.\d+:\d+/g
  ];

  let urlCamuflada = url;

  // Reemplazar URLs de frontend (puerto 3000, 3001, etc.)
  if (url.includes(':3000') || url.includes(':3001') || url.includes(':5173')) {
    patronesLocales.forEach(patron => {
      urlCamuflada = urlCamuflada.replace(patron, URL_PROFESIONAL.frontend);
    });
  }
  // Reemplazar URLs de backend (puerto 8000, 8080, etc.)
  else if (url.includes(':8000') || url.includes(':8080') || url.includes('/api')) {
    patronesLocales.forEach(patron => {
      urlCamuflada = urlCamuflada.replace(patron, URL_PROFESIONAL.backend);
    });
  }
  // Otros puertos - usar dominio general
  else {
    patronesLocales.forEach(patron => {
      urlCamuflada = urlCamuflada.replace(patron, `https://${URL_PROFESIONAL.domain}`);
    });
  }

  return urlCamuflada;
};

/**
 * Obtiene la URL del frontend de forma camuflada
 */
export const obtenerURLFrontend = (): string => {
  if (typeof window !== 'undefined') {
    const urlReal = window.location.origin;
    return camuflarURL(urlReal);
  }
  return URL_PROFESIONAL.frontend;
};

/**
 * Obtiene la URL del backend de forma camuflada
 */
export const obtenerURLBackend = (): string => {
  const urlReal = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
  return camuflarURL(urlReal);
};

/**
 * Camufla mensajes que contengan URLs
 */
export const camuflarMensaje = (mensaje: string): string => {
  if (!mensaje) return mensaje;

  let mensajeCamuflado = mensaje;

  // Patrones comunes de mensajes con URLs
  const reemplazos = [
    {
      patron: /Conectando a http:\/\/127\.0\.0\.1:\d+/g,
      reemplazo: `Conectando a ${URL_PROFESIONAL.backend}`
    },
    {
      patron: /Backend corriendo en http:\/\/127\.0\.0\.1:\d+/g,
      reemplazo: `Backend corriendo en ${URL_PROFESIONAL.backend}`
    },
    {
      patron: /localhost dice/g,
      reemplazo: 'Servidor informa'
    },
    {
      patron: /servidor local/gi,
      reemplazo: 'servidor remoto'
    },
    {
      patron: /desarrollo local/gi,
      reemplazo: 'servidor de producción'
    }
  ];

  reemplazos.forEach(({ patron, reemplazo }) => {
    mensajeCamuflado = mensajeCamuflado.replace(patron, reemplazo);
  });

  // Camuflar cualquier URL que aparezca en el mensaje
  mensajeCamuflado = camuflarURL(mensajeCamuflado);

  return mensajeCamuflado;
};

/**
 * Hook para obtener URLs camufladas en componentes React
 */
export const useURLsCamufladas = () => {
  return {
    frontend: obtenerURLFrontend(),
    backend: obtenerURLBackend(),
    camuflarURL,
    camuflarMensaje
  };
};

/**
 * Configuración para mostrar información del servidor de forma profesional
 */
export const INFO_SERVIDOR_PROFESIONAL = {
  nombre: 'Facial Recognition Security System',
  version: 'v2.1.3',
  proveedor: 'SecureTech Solutions',
  region: 'US-East-1',
  estado: 'Operativo',
  uptime: '99.97%'
};

/**
 * Genera información de servidor profesional para mostrar en logs
 */
export const generarInfoServidor = () => {
  return {
    servidor: INFO_SERVIDOR_PROFESIONAL.nombre,
    endpoint: URL_PROFESIONAL.backend,
    estado: 'CONECTADO',
    latencia: `${Math.floor(Math.random() * 50) + 10}ms`,
    timestamp: new Date().toISOString()
  };
};