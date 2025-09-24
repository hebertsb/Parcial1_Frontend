/**
 * Usuarios Feature
 * Handles all user management operations
 */

import { apiClient } from '../../core/api/client';
import type { 
  ApiResponse, 
  DjangoUser, 
  User,
  CreateUserRequest,
  UpdateUserRequest,
  UsuarioFilters,
  PaginatedResponse 
} from '../../core/types';

// =====================
// USER MANAGEMENT SERVICE
// =====================

export const userService = {
  /**
   * Get all users with optional filters
   */
  async getUsers(filters?: UsuarioFilters): Promise<ApiResponse<PaginatedResponse<DjangoUser>>> {
    return apiClient.get('/users/', { params: filters });
  },

  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<ApiResponse<DjangoUser>> {
    return apiClient.get(`/users/${id}/`);
  },

  /**
   * Create new user
   */
  async createUser(userData: CreateUserRequest): Promise<ApiResponse<DjangoUser>> {
    return apiClient.post('/users/', userData);
  },

  /**
   * Update existing user
   */
  async updateUser(id: string, userData: UpdateUserRequest): Promise<ApiResponse<DjangoUser>> {
    return apiClient.put(`/users/${id}/`, userData);
  },

  /**
   * Delete user
   */
  async deleteUser(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`/users/${id}/`);
  },

  /**
   * Search users
   */
  async searchUsers(query: string): Promise<ApiResponse<DjangoUser[]>> {
    return apiClient.get('/users/search/', { params: { q: query } });
  },

  /**
   * Get user statistics
   */
  async getUserStats(): Promise<ApiResponse<{
    total: number;
    byRole: Record<string, number>;
    active: number;
  }>> {
    return apiClient.get('/users/stats/');
  }
};

// Default export
export default {
  user: userService,
};