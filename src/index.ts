/**
 * Src Index
 * Main export point for the entire src directory
 */

// =====================
// CORE EXPORTS
// =====================
export * from './core';

// =====================
// LIB EXPORTS
// =====================
export * from './lib';

// =====================
// HOOKS EXPORTS
// =====================
export * from './hooks';

// =====================
// LIB EXPORTS
// =====================
export * from './lib';

// =====================
// GROUPED EXPORTS
// =====================

// Core functionality
export const core = {
  api: () => import('./core/api/client'),
  types: () => import('./core/types'),
};

// Application features
export const features = {
  finanzas: () => import('./features/finanzas'), 
  unidades: () => import('./features/unidades'),
  seguridad: () => import('./features/seguridad'),
  usuarios: () => import('./features/usuarios'),
};

// UI Components
export const components = {
  auth: () => import('./components/auth'),
  dashboard: () => import('./components/dashboard'),
  layout: () => import('./components/layout'),
  finanzas: () => import('./components/finanzas'),
  unidades: () => import('./components/unidades'),
  usuarios: () => import('./components/usuarios'),
  seguridad: () => import('./components/seguridad'),
  ui: () => import('./components/ui'),
};

// Application utilities
export const utils = {
  hooks: () => import('./hooks'),
  contexts: () => import('./contexts'),
  lib: () => import('./lib'),
};