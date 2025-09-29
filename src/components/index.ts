/**
 * Components Index
 * Central export point for all components
 */

// =====================
// AUTHENTICATION COMPONENTS
// =====================
export * from './auth';

// =====================
// LAYOUT COMPONENTS
// =====================
export * from './layout';

// =====================
// DASHBOARD COMPONENTS
// =====================
export * from './dashboard';

// =====================
// ADMIN COMPONENTS
// =====================
export * from './admin';

// =====================
// FEATURE COMPONENTS
// =====================
export * from './finanzas';
export * from './unidades';
export * from './usuarios';
export * from './security';

// =====================
// UI COMPONENTS
// =====================
export * from './ui';

// =====================
// GROUPED EXPORTS FOR CONVENIENCE
// =====================

// Authentication
export const authComponents = {
  ...require('./auth'),
};

// Layout
export const layoutComponents = {
  ...require('./layout'),
};

// Dashboard
export const dashboardComponents = {
  ...require('./dashboard'),
};

// Features
export const featureComponents = {
  finanzas: () => import('./finanzas'),
  unidades: () => import('./unidades'),
  usuarios: () => import('./usuarios'),
  security: () => import('./security'),
};

// UI
export const uiComponents = {
  ...require('./ui'),
};