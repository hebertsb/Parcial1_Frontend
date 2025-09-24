import { authService } from '@/lib/services';
import type { UserRole, User } from '@/core/types';

export interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

// Authentication functions that connect to Django backend
export const authenticateUser = async (email: string, password: string): Promise<User | null> => {
  try {
    console.log('🔐 auth.ts: Iniciando autenticación para:', email);
    const response = await authService.login({ email, password });
    
    console.log('📡 auth.ts: Respuesta del authService:', response);
    
    if (response.success && response.data) {
      // The authService already extracts the user from JWT and creates the frontend user
      // We just need to return it directly
      const user = response.data.user;
      
      if (user) {
        console.log('👤 auth.ts: Usuario extraído del authService:', user);
        console.log('🔍 auth.ts: Tipo de usuario:', typeof user, 'Keys:', Object.keys(user));
        return user;
      } else {
        console.error('❌ auth.ts: El authService no devolvió usuario');
        console.log('🔍 auth.ts: response.data completo:', response.data);
        return null;
      }
    }
    
    console.error('❌ auth.ts: Login falló - no se recibió respuesta exitosa');
    return null;
  } catch (error) {
    console.error('❌ auth.ts: Error de autenticación:', error);
    return null;
  }
}

export const getCurrentUser = (): User | null => {
  if (typeof window === "undefined") return null

  const userData = localStorage.getItem("currentUser")
  console.log('🔍 auth.ts getCurrentUser: Raw data from localStorage:', userData);
  
  if (userData) {
    try {
      const parsedUser = JSON.parse(userData);
      console.log('👤 auth.ts getCurrentUser: Parsed user:', parsedUser);
      return parsedUser;
    } catch (error) {
      console.error('❌ auth.ts getCurrentUser: Error parsing user data:', error);
      return null;
    }
  }
  
  console.log('⚠️ auth.ts getCurrentUser: No user data in localStorage');
  return null;
}

export const setCurrentUser = (user: User | null) => {
  if (typeof window === "undefined") return

  if (user) {
    localStorage.setItem("currentUser", JSON.stringify(user))
  } else {
    localStorage.removeItem("currentUser")
    localStorage.removeItem("auth_token")
  }
}

export const logoutUser = async (): Promise<void> => {
  try {
    await authService.logout();
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    setCurrentUser(null);
  }
}

// Check if user has permission for specific actions
export const hasPermission = (user: User | null, permission: string): boolean => {
  if (!user) return false;
  
  const permissions: Record<UserRole, string[]> = {
    administrator: ['all'],
    security: ['security', 'incidents', 'visits'],
    owner: ['own_unit', 'payments', 'reports'],
    tenant: ['own_unit', 'payments'],
    propietario: ['own_unit', 'payments', 'reports', 'inquilinos'],
    inquilino: ['own_unit', 'payments'],
    empleado: ['security', 'maintenance']
  };
  
  const userPermissions = permissions[user.role] || [];
  return userPermissions.includes('all') || userPermissions.includes(permission);
}

// Mock users for development (keep for fallback)
export const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@facial.com",
    name: "Juan Carlos Pérez López",
    role: "administrator",
  },
  {
    id: "2",
    email: "security@condomanager.com",
    name: "Security Guard",
    role: "security",
  },
  {
    id: "3",
    email: "owner@condomanager.com",
    name: "John Owner",
    role: "owner",
    unitNumber: "A-101",
    phone: "+1 (555) 123-4567",
  },
  {
    id: "4",
    email: "tenant@condomanager.com",
    name: "Jane Tenant",
    role: "tenant",
    unitNumber: "B-205",
    phone: "+1 (555) 987-6543",
  },
]
