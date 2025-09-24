/**
 * Usuarios Hooks
 * Custom React hooks for user management operations
 */

import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from './services';
import type { 
  DjangoUser, 
  CreateUserRequest, 
  UpdateUserRequest, 
  UsuarioFilters,
  PaginatedResponse 
} from '../../core/types';

// =====================
// USER MANAGEMENT HOOKS
// =====================

/**
 * Hook for getting all users with filters
 */
export function useUsers(filters?: UsuarioFilters) {
  return useQuery({
    queryKey: ['users', filters],
    queryFn: () => userService.getUsers(filters),
    select: (data) => data.data,
  });
}

/**
 * Hook for getting a specific user by ID
 */
export function useUser(id: string) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => userService.getUserById(id),
    select: (data) => data.data,
    enabled: !!id,
  });
}

/**
 * Hook for creating a new user
 */
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: CreateUserRequest) => userService.createUser(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

/**
 * Hook for updating a user
 */
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, userData }: { id: string; userData: UpdateUserRequest }) => 
      userService.updateUser(id, userData),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', id] });
    },
  });
}

/**
 * Hook for deleting a user
 */
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => userService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

/**
 * Hook for searching users
 */
export function useSearchUsers() {
  const [searchResults, setSearchResults] = useState<DjangoUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const searchUsers = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    try {
      const response = await userService.searchUsers(query);
      
      if (response.success && response.data) {
        setSearchResults(response.data);
      } else {
        setSearchError(response.message || 'Error en la búsqueda');
        setSearchResults([]);
      }
    } catch (error) {
      setSearchError('Error de conexión');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const clearSearch = useCallback(() => {
    setSearchResults([]);
    setSearchError(null);
  }, []);

  return {
    searchResults,
    isSearching,
    searchError,
    searchUsers,
    clearSearch,
  };
}

/**
 * Hook for user statistics
 */
export function useUserStats() {
  return useQuery({
    queryKey: ['users', 'stats'],
    queryFn: () => userService.getUserStats(),
    select: (data) => data.data,
  });
}

// Default export
export default {
  useUsers,
  useUser,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
  useSearchUsers,
  useUserStats,
};