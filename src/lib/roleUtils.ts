/**
 * Utilidades para redirección basada en roles
 */

import type { UserRole } from '@/core/types';

/**
 * Obtiene la ruta del dashboard según el rol del usuario
 */
export function getDashboardRoute(role: UserRole): string {
  console.log(`🔍 getDashboardRoute: Rol recibido: "${role}" (tipo: ${typeof role})`);
  const roleStr = role.toLowerCase();
  console.log(`🔍 getDashboardRoute: Rol normalizado: "${roleStr}"`);
  
  switch (roleStr) {
    case 'administrator':
    case 'admin':
      console.log(`✅ getDashboardRoute: Redirigiendo administrador a /dashboard`);
      return '/dashboard'; // Panel de administración principal
    
    case 'propietario':
    case 'owner':
      console.log(`✅ getDashboardRoute: Redirigiendo propietario a /propietario/dashboard`);
      return '/propietario/dashboard'; // Panel de propietario
    
    case 'inquilino':
    case 'tenant':
      console.log(`✅ getDashboardRoute: Redirigiendo inquilino a /inquilino/dashboard`);
      return '/inquilino/dashboard'; // Panel de inquilino
    
    case 'empleado':
    case 'employee':
      console.log(`✅ getDashboardRoute: Redirigiendo empleado a /empleado/dashboard`);
      return '/empleado/dashboard'; // Panel de empleado
    
    case 'security':
      console.log(`✅ getDashboardRoute: Redirigiendo seguridad a /security/dashboard`);
      return '/security/dashboard'; // Panel de seguridad
    
    default:
      console.warn(`⚠️ getDashboardRoute: Rol desconocido: "${role}" (normalizado: "${roleStr}"), redirigiendo a dashboard genérico`);
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