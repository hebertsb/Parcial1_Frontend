/**
 * Auth Library
 * Re-export authentication functionality from features
 */

// Re-export specific services from features/auth
export { authService } from '../features/auth';

// Re-export types from core
export type { User, AuthState } from '../core/types';

// For backwards compatibility, export the main auth service
export { authService as default } from '../features/auth';

// Import authService locally for internal use
import { authService } from '../features/auth';

// Utility functions for auth-context
export const authenticateUser = async (email: string, password: string) => {
  try {
    const response = await authService.login({ email, password });
    if (response.success && response.data) {
      return response.data.user;
    }
    return null;
  } catch (error) {
    console.error('Error en autenticación:', error);
    return null;
  }
};

export const getCurrentUser = () => {
  const storedUser = localStorage.getItem('currentUser') || localStorage.getItem('user') || sessionStorage.getItem('user');
  return storedUser ? JSON.parse(storedUser) : null;
};

export const setCurrentUser = (user: any, remember: boolean = false) => {
  const storage = remember ? localStorage : sessionStorage;
  storage.setItem('currentUser', JSON.stringify(user));
  storage.setItem('user', JSON.stringify(user)); // Para compatibilidad
};

export const logoutUser = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('currentUser');
  localStorage.removeItem('auth_token');
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  sessionStorage.removeItem('user');
  sessionStorage.removeItem('auth_token');
};