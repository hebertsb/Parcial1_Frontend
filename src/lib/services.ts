/**
 * Services Library
 * Re-export all feature services from a central location
 */

// Auth services - only export authService to avoid conflicts
export { authService } from '../features/auth/services';

// Finance services
export * from '../features/finanzas/services';

// User services - export specifically to avoid conflicts  
export { userService } from '../features/usuarios/services';

// Unit services
export * from '../features/unidades/services';

// Security services
export * from '../features/seguridad/services';