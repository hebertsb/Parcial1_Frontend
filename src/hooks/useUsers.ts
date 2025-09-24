import { useState, useEffect } from 'react';
import { userService } from '../lib/services';
import { type ApiResponse, type PaginatedResponse } from '../core/api/client';
import { type DjangoUser, type UsuarioFilters } from '../core/types';

export function useUsers(filters: UsuarioFilters = {}) {
  const [data, setData] = useState<PaginatedResponse<DjangoUser> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
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
  };

  useEffect(() => {
    fetchUsers();
  }, [JSON.stringify(filters)]);

  const refresh = () => fetchUsers();

  return { data, loading, error, refresh };
}

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
        const response = await userService.getUserById(id.toString());
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

export function useUserMutations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createUser = async (userData: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await userService.createUser(userData);
      if (response.success) {
        return response.data;
      } else {
        setError(response.message || 'Error al crear usuario');
        return null;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (id: number, userData: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await userService.updateUser(id.toString(), userData);
      if (response.success) {
        return response.data;
      } else {
        setError(response.message || 'Error al actualizar usuario');
        return null;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await userService.deleteUser(id.toString());
      if (response.success) {
        return true;
      } else {
        setError(response.message || 'Error al eliminar usuario');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (id: number) => {
    setLoading(true);
    setError(null);
    
    try {
      // Usar updateUser para cambiar el estado (is_active)
      const response = await userService.updateUser(id.toString(), { is_active: !Boolean(id) }); // Toggle del estado
      if (response.success) {
        return response.data;
      } else {
        setError(response.message || 'Error al cambiar estado del usuario');
        return null;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    createUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
    loading,
    error
  };
}