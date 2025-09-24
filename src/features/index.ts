/**
 * Features Index
 * Central export point for all feature modules
 */

// =====================
// AUTHENTICATION EXPORTS
// =====================
export { default as authServices } from './auth/services';
export { default as authHooks } from './auth/hooks';
export * from './auth/services';
export * from './auth/hooks';

// =====================
// FINANZAS EXPORTS
// =====================
export { default as finanzasServices } from './finanzas/services';
export { default as finanzasHooks } from './finanzas/hooks';
export * from './finanzas/services';
export * from './finanzas/hooks';

// =====================
// UNIDADES EXPORTS
// =====================
export { default as unidadesServices } from './unidades/services';
export { default as unidadesHooks } from './unidades/hooks';
export * from './unidades/services';
export * from './unidades/hooks';

// =====================
// SEGURIDAD EXPORTS
// =====================
export { default as seguridadServices } from './seguridad/services';
export { default as seguridadHooks } from './seguridad/hooks';
export * from './seguridad/services';
export * from './seguridad/hooks';

// =====================
// GROUPED EXPORTS FOR CONVENIENCE
// =====================

// All Services
export const services = {
  auth: () => import('./auth/services'),
  finanzas: () => import('./finanzas/services'),
  unidades: () => import('./unidades/services'),
  seguridad: () => import('./seguridad/services'),
};

// All Hooks
export const hooks = {
  auth: () => import('./auth/hooks'),
  finanzas: () => import('./finanzas/hooks'),
  unidades: () => import('./unidades/hooks'),
  seguridad: () => import('./seguridad/hooks'),
};

// Feature-based imports
export const features = {
  authentication: {
    services: () => import('./auth/services'),
    hooks: () => import('./auth/hooks'),
  },
  finances: {
    services: () => import('./finanzas/services'),
    hooks: () => import('./finanzas/hooks'),
  },
  units: {
    services: () => import('./unidades/services'),
    hooks: () => import('./unidades/hooks'),
  },
  security: {
    services: () => import('./seguridad/services'),
    hooks: () => import('./seguridad/hooks'),
  },
};