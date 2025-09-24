/**
 * Utilidades para redirección basada en roles
 */

import type { UserRole } from '@/core/types';

/**
 * Obtiene la ruta del dashboard según el rol del usuario
 */
export function getDashboardRoute(role: UserRole): string {
  const roleStr = role.toLowerCase();
  
  switch (roleStr) {
    case 'administrator':
    case 'admin':
      return '/dashboard'; // Panel de administración
    
    case 'propietario':
    case 'owner':
      return '/propietario/dashboard'; // Panel de propietario
    
    case 'inquilino':
    case 'tenant':
      return '/inquilino/dashboard'; // Panel de inquilino
    
    case 'empleado':
    case 'employee':
      return '/empleado/dashboard'; // Panel de empleado
    
    case 'security':
      return '/security/monitor'; // Panel de seguridad
    
    default:
      console.warn(`⚠️ Rol desconocido: ${role}, redirigiendo a dashboard genérico`);
      return '/dashboard'; // Fallback
  }
}

/**
 * Verifica si un usuario tiene acceso a una ruta específica
 */
export function hasRouteAccess(userRole: UserRole, route: string): boolean {
  const roleRoutes = {
    administrator: ['/admin', '/dashboard', '/usuarios', '/propietarios', '/unidades', '/finanzas'],
    propietario: ['/propietario', '/dashboard'],
    inquilino: ['/inquilino', '/dashboard'],
    empleado: ['/empleado', '/dashboard'],
    security: ['/security', '/dashboard']
  };

  const allowedRoutes = roleRoutes[userRole.toLowerCase() as keyof typeof roleRoutes] || [];
  
  return allowedRoutes.some(allowedRoute => 
    route.startsWith(allowedRoute)
  );
}

/**
 * Obtiene el nombre amigable del rol
 */
export function getRoleName(role: UserRole): string {
  const roleNames = {
    administrator: 'Administrador',
    propietario: 'Propietario',
    inquilino: 'Inquilino',
    empleado: 'Empleado',
    security: 'Seguridad'
  };

  return roleNames[role.toLowerCase() as keyof typeof roleNames] || role;
}