/**
 * Core Index
 * Central export point for all core modules
 */

// =====================
// API CLIENT EXPORTS
// =====================
export { apiClient } from './api/client';
export type { ApiResponse, PaginatedResponse, RequestInterceptor } from './api/client';
export { API_CONFIG, HTTP_STATUS } from './api/client';

// =====================
// TYPES EXPORTS
// =====================
export * from './types';

// =====================
// UTILITIES (if any)
// =====================
// Export any utility functions here when they are created

// =====================
// CONSTANTS
// =====================
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
export const API_VERSION = 'v1';
export const APP_NAME = 'Sistema de Condominios';
export const APP_VERSION = '1.0.0';

// Default configuration
export const DEFAULT_CONFIG = {
  pagination: {
    defaultPageSize: 10,
    maxPageSize: 100,
  },
  api: {
    timeout: 30000,
    retries: 3,
  },
  upload: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
  },
  cache: {
    defaultTTL: 300000, // 5 minutes
  },
};