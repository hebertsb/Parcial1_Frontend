/**
 * Authentication Hooks
 * Custom React hooks for authentication operations
 */

import { useState, useEffect, useCallback } from 'react';
import { authService, userService, profileService } from './services';
import type { 
  DjangoUser, 
  User, 
  LoginRequest, 
  CreateUserRequest, 
  UpdateUserRequest,
  UsuarioFilters,
  PaginatedResponse 
} from '../../core/types';

// =====================
// AUTHENTICATION HOOKS
// =====================

/**
 * Hook for managing authentication state
 */
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          const storedUser = authService.getStoredUser();
          if (storedUser) {
            setUser(storedUser);
          } else {
            // Verify with server if no stored user
            const response = await authService.getCurrentUser();
            if (response.success && response.data) {
              const frontendUser: User = {
                id: response.data.id.toString(),
                email: response.data.email,
                name: `${response.data.first_name} ${response.data.last_name}`,
                role: response.data.role,
                unitNumber: response.data.unit_number,
                phone: response.data.phone,
                avatar: response.data.avatar
              };
              setUser(frontendUser);
            }
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        setError('Error inicializando autenticación');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = useCallback(async (credentials: LoginRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authService.login(credentials);
      if (response.success && response.data) {
        const frontendUser: User = {
          id: response.data.user.id.toString(),
          email: response.data.user.email,
          name: `${response.data.user.first_name} ${response.data.user.last_name}`,
          role: response.data.user.role,
          unitNumber: response.data.user.unit_number,
          phone: response.data.user.phone,
          avatar: response.data.user.avatar
        };
        setUser(frontendUser);
        return { success: true, user: frontendUser };
      } else {
        setError(response.message || 'Error en el login');
        return { success: false, error: response.message };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await authService.logout();
      setUser(null);
      setError(null);
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    if (!user) return;
    
    try {
      const response = await authService.getCurrentUser();
      if (response.success && response.data) {
        const frontendUser: User = {
          id: response.data.id.toString(),
          email: response.data.email,
          name: `${response.data.first_name} ${response.data.last_name}`,
          role: response.data.role,
          unitNumber: response.data.unit_number,
          phone: response.data.phone,
          avatar: response.data.avatar
        };
        setUser(frontendUser);
      }
    } catch (err) {
      console.error('Error refreshing user:', err);
    }
  }, [user]);

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    logout,
    refreshUser,
  };
}

/**
 * Hook for password change operations
 */
export function usePasswordChange() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const changePassword = useCallback(async (oldPassword: string, newPassword: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await authService.changePassword({
        old_password: oldPassword,
        new_password: newPassword
      });

      if (response.success) {
        setSuccess(true);
        return { success: true };
      } else {
        setError(response.message || 'Error cambiando contraseña');
        return { success: false, error: response.message };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    changePassword,
    loading,
    error,
    success,
  };
}

// =====================
// USER MANAGEMENT HOOKS
// =====================

/**
 * Hook for fetching users with filters
 */
export function useUsers(filters: UsuarioFilters = {}) {
  const [data, setData] = useState<PaginatedResponse<DjangoUser> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await userService.getUsers(filters);
      if (response.success && response.data) {
        setData(response.data);
      } else {
        setError(response.message || 'Error al cargar usuarios');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const refresh = useCallback(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { data, loading, error, refresh };
}

/**
 * Hook for fetching a single user
 */
export function useUser(id: number | null) {
  const [data, setData] = useState<DjangoUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchUser = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await userService.getUserById(id);
        if (response.success && response.data) {
          setData(response.data);
        } else {
          setError(response.message || 'Error al cargar usuario');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  return { data, loading, error };
}

/**
 * Hook for user CRUD operations
 */
export function useUserMutations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createUser = useCallback(async (userData: CreateUserRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await userService.createUser(userData);
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        setError(response.message || 'Error al crear usuario');
        return { success: false, error: response.message };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUser = useCallback(async (id: number, userData: UpdateUserRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await userService.updateUser(id, userData);
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        setError(response.message || 'Error al actualizar usuario');
        return { success: false, error: response.message };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteUser = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await userService.deleteUser(id);
      if (response.success) {
        return { success: true };
      } else {
        setError(response.message || 'Error al eliminar usuario');
        return { success: false, error: response.message };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleUserStatus = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await userService.toggleUserStatus(id);
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        setError(response.message || 'Error al cambiar estado del usuario');
        return { success: false, error: response.message };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadAvatar = useCallback(async (id: number, file: File, onProgress?: (progress: number) => void) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await userService.uploadAvatar(id, file, onProgress);
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        setError(response.message || 'Error al subir avatar');
        return { success: false, error: response.message };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    createUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
    uploadAvatar,
    loading,
    error
  };
}

// =====================
// PROFILE HOOKS
// =====================

/**
 * Hook for managing user profile
 */
export function useProfile() {
  const [data, setData] = useState<DjangoUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await profileService.getProfile();
      if (response.success && response.data) {
        setData(response.data);
      } else {
        setError(response.message || 'Error al cargar perfil');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (updates: UpdateUserRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await profileService.updateProfile(updates);
      if (response.success && response.data) {
        setData(response.data);
        return { success: true, data: response.data };
      } else {
        setError(response.message || 'Error al actualizar perfil');
        return { success: false, error: response.message };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    data,
    loading,
    error,
    updateProfile,
    refresh: fetchProfile,
  };
}

// Export all hooks
export default {
  useAuth,
  usePasswordChange,
  useUsers,
  useUser,
  useUserMutations,
  useProfile,
};