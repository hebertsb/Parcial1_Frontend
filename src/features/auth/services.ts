/**
 * Authentication Feature
 * Handles all authentication related operations
 * 
 * ⚠️ ESTADO ACTUAL DEL BACKEND:
 * - Solo tiene endpoints de autenticación (/api/auth/login/, /api/auth/refresh/, /api/auth/verify/)
 * - Solo tiene endpoints de propietarios bajo /api/authz/propietarios/
 * - NO TIENE endpoints para gestión genérica de usuarios (/api/authz/usuarios/, /api/authz/roles/)
 * - Las funciones getUsuarios, getRoles, crearUsuario, etc. NO FUNCIONAN y retornan 404
 * 
 * 📋 TODO: Coordinar con backend para implementar los endpoints según la nueva guía
 */

import { apiClient } from '../../core/api/client';
import type { 
  ApiResponse, 
  DjangoUser, 
  LoginRequest, 
  User,
  UserRole,
  CreateUserRequest,
  UpdateUserRequest,
  UsuarioFilters,
  PaginatedResponse,
  UsuarioSistema,
  Rol
} from '../../core/types';

// =====================
// AUTHENTICATION SERVICE
// =====================

export const authService = {
  /**
   * Login user with email and password
   */
  async login(credentials: LoginRequest): Promise<ApiResponse<{ access: string; refresh: string; user?: User }>> {
    console.log('🔐 AuthService: Enviando credenciales al backend:', credentials.email);
    console.log('🚨 USANDO ENDPOINT CORRECTO: /authz/login/');
    
    // USAR EL ENDPOINT CORRECTO SEGÚN BACKEND: /authz/login/
    const response = await apiClient.post<{ access: string; refresh: string; primary_role?: string; user?: any; roles?: any[] }>('/authz/login/', credentials);
    
    console.log('📡 AuthService: Respuesta del backend:', response);
    
    if (response.success && response.data) {
      console.log('✅ AuthService: Login exitoso, guardando tokens JWT');
      
      // Guardar tokens JWT según la guía del backend
      apiClient.setAuthToken(response.data.access, true);
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
      }
      
      // NUEVO: Usar primary_role directamente del backend
      let userRole = '';
      let userName = 'Usuario';
      let userEmail = credentials.email;
      
      if (response.data.primary_role) {
        // El backend ya nos da el rol correcto en primary_role
        userRole = response.data.primary_role.toLowerCase();
        console.log('✅ AuthService: primary_role recibido del backend:', response.data.primary_role);
        
        // Mapear los roles del backend a los del frontend
        switch(response.data.primary_role) {
          case 'Administrador':
            userRole = 'administrator';
            break;
          case 'Propietario':
            userRole = 'propietario';
            break;
          case 'Inquilino':
            userRole = 'inquilino';
            break;
          case 'Seguridad':
            userRole = 'security';
            break;
          default:
            userRole = 'propietario'; // fallback
        }
        
        console.log('🔧 AuthService: Rol mapeado para frontend:', userRole);
      }
      
      // Usar datos del usuario si están disponibles
      if (response.data.user) {
        if (response.data.user.email) {
          userEmail = response.data.user.email;
        }
        if (response.data.user.persona && response.data.user.persona.nombre && response.data.user.persona.apellido) {
          userName = `${response.data.user.persona.nombre} ${response.data.user.persona.apellido}`;
        }
        console.log('👤 AuthService: Datos del usuario del backend:', response.data.user);
      }
      
      // Decodificar el JWT para obtener el ID
      const payload = JSON.parse(atob(response.data.access.split('.')[1]));
      console.log('🔍 AuthService: Payload JWT decodificado:', payload);
      
      // Si no tenemos primary_role, usar fallback básico
      if (!userRole) {
        console.log('⚠️ AuthService: No se obtuvo primary_role del backend, usando fallback');
        if (credentials.email.includes('admin')) {
          userRole = 'administrator';
        } else if (credentials.email.includes('security') || credentials.email.includes('seguridad')) {
          userRole = 'security';
        } else {
          userRole = 'propietario'; // fallback por defecto
        }
        console.log('🔄 AuthService: Rol fallback asignado:', userRole);
      }
      
      // Crear el usuario frontend con los datos obtenidos
      let frontendUser: User;
      try {
        console.log('✅ AuthService: Creando usuario con rol:', userRole);
        
        frontendUser = {
          id: payload.user_id?.toString() || payload.sub?.toString() || '1',
          email: userEmail,
          name: userName,
          role: userRole as UserRole,
        };
        
        if (typeof window !== 'undefined') {
          localStorage.setItem('currentUser', JSON.stringify(frontendUser));
        }
        
        console.log('👤 AuthService: Usuario creado:', frontendUser);
        console.log('🎯 AuthService: Email:', userEmail);
        console.log('🎯 AuthService: Rol:', userRole);
      } catch (error) {
        console.warn('⚠️ AuthService: Error decodificando JWT, usando datos por defecto:', error);
        
        // Fallback user para testing - mejorado para usuarios de seguridad
        let fallbackRole: UserRole = 'tenant';
        let fallbackName = 'Usuario';
        
        if (credentials.email.includes('admin')) {
          fallbackRole = 'administrator';
          fallbackName = 'Usuario Administrador';
        } else if (credentials.email.includes('seguridad') || credentials.email.includes('security')) {
          fallbackRole = 'security';
          fallbackName = 'Personal de Seguridad';
        } else if (credentials.email.includes('propietario') || credentials.email.includes('owner')) {
          fallbackRole = 'propietario';
          fallbackName = 'Propietario';
        } else if (credentials.email.includes('inquilino') || credentials.email.includes('tenant')) {
          fallbackRole = 'inquilino';
          fallbackName = 'Inquilino';
        }
        
        frontendUser = {
          id: '1',
          email: credentials.email,
          name: fallbackName,
          role: fallbackRole,
        };
        
        if (typeof window !== 'undefined') {
          localStorage.setItem('currentUser', JSON.stringify(frontendUser));
        }
      }
      
      // Modificar la respuesta para incluir el usuario
      const finalResponse = {
        ...response,
        data: {
          ...response.data,
          user: frontendUser
        }
      };
      
      console.log('🚀 AuthService: Respuesta final que se devuelve:', finalResponse);
      console.log('🔍 AuthService: Usuario en respuesta final:', finalResponse.data.user);
      
      return finalResponse;
    } else {
      console.log('❌ AuthService: Login falló:', response);
    }
    
    return response;
  },

  /**
   * Logout current user
   */
  async logout(): Promise<ApiResponse> {
    console.log('🚪 AuthService: Iniciando logout...');
    
    try {
      const response = await apiClient.post('/auth/logout/');
      console.log('📡 AuthService: Respuesta de logout del backend:', response);
      
      // Clear tokens and user data
      apiClient.clearAuthToken();
      if (typeof window !== 'undefined') {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        console.log('🧹 AuthService: Tokens y datos de usuario eliminados del localStorage');
      }
      
      console.log('✅ AuthService: Logout completado exitosamente');
      return response;
    } catch (error) {
      console.error('❌ AuthService: Error durante logout:', error);
      
      // Even if server logout fails, clear local data
      apiClient.clearAuthToken();
      if (typeof window !== 'undefined') {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        console.log('🧹 AuthService: Datos locales limpiados tras error');
      }
      
      // Return a successful response locally even if server fails
      return {
        success: true,
        data: null,
        message: 'Logout local exitoso (error del servidor)'
      };
    }
  },

  /**
   * =====================
   * GESTIÓN DE USUARIOS (Admin)
   * =====================
   */

  /**
   * Obtener lista de usuarios del sistema
   */
  async getUsuarios(filters?: UsuarioFilters): Promise<ApiResponse<PaginatedResponse<UsuarioSistema>>> {
    console.log('👥 AuthService: Obteniendo lista de usuarios...', filters);
    
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.rol) params.append('rol', filters.rol);
    if (filters?.estado) params.append('estado', filters.estado);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.page_size) params.append('page_size', filters.page_size.toString());
    
    const url = `/authz/usuarios/${params.toString() ? `?${params.toString()}` : ''}`;
    return apiClient.get<PaginatedResponse<UsuarioSistema>>(url);
  },

  /**
   * Crear nuevo usuario (registro público)
   */
  async crearUsuario(userData: CreateUserRequest): Promise<ApiResponse<UsuarioSistema>> {
    console.log('➕ AuthService: Creando nuevo usuario...', userData.email);
    return apiClient.post<UsuarioSistema>('/authz/register/', userData);
  },

  /**
   * Actualizar usuario existente
   */
  async actualizarUsuario(id: number, userData: UpdateUserRequest): Promise<ApiResponse<UsuarioSistema>> {
    console.log('✏️ AuthService: Actualizando usuario...', id);
    return apiClient.put<UsuarioSistema>(`/authz/usuarios/${id}/`, userData);
  },

  /**
   * Eliminar usuario
   */
  async eliminarUsuario(id: number): Promise<ApiResponse> {
    console.log('🗑️ AuthService: Eliminando usuario...', id);
    return apiClient.delete(`/authz/usuarios/${id}/`);
  },

  /**
   * Obtener detalles de un usuario específico
   */
  async getUsuario(id: number): Promise<ApiResponse<UsuarioSistema>> {
    console.log('👤 AuthService: Obteniendo detalles del usuario...', id);
    return apiClient.get<UsuarioSistema>(`/authz/usuarios/${id}/`);
  },

  /**
   * Obtener roles disponibles
   */
  async getRoles(): Promise<ApiResponse<Rol[]>> {
    console.log('🎭 AuthService: Obteniendo roles disponibles...');
    return apiClient.get<Rol[]>('/authz/roles/');
  },

  /**
   * Cambiar estado de usuario (activar/desactivar)
   */
  async cambiarEstadoUsuario(id: number, activo: boolean): Promise<ApiResponse<UsuarioSistema>> {
    console.log(`🔄 AuthService: ${activo ? 'Activando' : 'Desactivando'} usuario...`, id);
    
    // Usar endpoints específicos de la nueva guía
    const endpoint = activo 
      ? `/authz/usuarios/${id}/reactivar/`
      : `/authz/usuarios/${id}/inhabilitar/`;
    
    return apiClient.post<UsuarioSistema>(endpoint);
  },

  /**
   * =====================
   * NUEVOS ENDPOINTS - GUÍA ACTUALIZADA
   * =====================
   */

  /**
   * Obtener perfil propio
   */
  async getPerfilPropio(): Promise<ApiResponse<UsuarioSistema>> {
    console.log('👤 AuthService: Obteniendo perfil propio...');
    return apiClient.get<UsuarioSistema>('/authz/usuarios/me/');
  },

  /**
   * Actualizar perfil propio
   */
  async actualizarPerfilPropio(userData: UpdateUserRequest): Promise<ApiResponse<UsuarioSistema>> {
    console.log('✏️ AuthService: Actualizando perfil propio...');
    return apiClient.patch<UsuarioSistema>('/authz/usuarios/me/', userData);
  },

  /**
   * Listar clientes/inquilinos (Solo Admin)
   */
  async getClientes(): Promise<ApiResponse<UsuarioSistema[]>> {
    console.log('👥 AuthService: Obteniendo lista de clientes...');
    return apiClient.get<UsuarioSistema[]>('/authz/usuarios/clientes/');
  },

  /**
   * Editar usuario como administrador
   */
  async editarUsuarioAdmin(id: number, userData: UpdateUserRequest): Promise<ApiResponse<UsuarioSistema>> {
    console.log('🔧 AuthService: Editando usuario como admin...', id);
    return apiClient.put<UsuarioSistema>(`/authz/usuarios/${id}/editar-datos/`, userData);
  },

  /**
   * Cambiar contraseña de usuario actual
   */
  async cambiarPassword(data: {
    password_actual: string;
    password_nueva: string;
    password_nueva_confirm: string;
  }): Promise<ApiResponse> {
    console.log('🔒 AuthService: Cambiando contraseña...');
    return apiClient.post('/authz/cambiar-password/', data);
  },

  /**
   * Refresh authentication token
   */
  async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    return apiClient.post('/auth/refresh/');
  },

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<ApiResponse<DjangoUser>> {
    return apiClient.get('/auth/user/');
  },

  /**
   * Change user password
   */
  async changePassword(data: { old_password: string; new_password: string }): Promise<ApiResponse> {
    return apiClient.post('/auth/change-password/', data);
  },

  /**
   * Request password reset
   */
  async resetPassword(email: string): Promise<ApiResponse> {
    return apiClient.post('/auth/reset-password/', { email });
  },

  /**
   * Verify email address
   */
  async verifyEmail(token: string): Promise<ApiResponse> {
    return apiClient.post('/auth/verify-email/', { token });
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
    const user = localStorage.getItem('currentUser');
    
    return !!(token && user);
  },

  /**
   * Get stored user data
   */
  getStoredUser(): User | null {
    if (typeof window === 'undefined') return null;
    
    const userData = localStorage.getItem('currentUser');
    return userData ? JSON.parse(userData) : null;
  },
};

// =====================
// USER MANAGEMENT SERVICE
// =====================

export const userService = {
  /**
   * Get paginated list of users with filters
   */
  async getUsers(filters: UsuarioFilters = {}): Promise<ApiResponse<PaginatedResponse<DjangoUser>>> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });
    
    return apiClient.get(`/users/?${params.toString()}`);
  },

  /**
   * Get user by ID
   */
  async getUserById(id: number): Promise<ApiResponse<DjangoUser>> {
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
  async updateUser(id: number, userData: UpdateUserRequest): Promise<ApiResponse<DjangoUser>> {
    return apiClient.patch(`/users/${id}/`, userData);
  },

  /**
   * Delete user
   */
  async deleteUser(id: number): Promise<ApiResponse> {
    return apiClient.delete(`/users/${id}/`);
  },

  /**
   * Toggle user active status
   */
  async toggleUserStatus(id: number): Promise<ApiResponse<DjangoUser>> {
    return apiClient.patch(`/users/${id}/toggle-status/`);
  },

  /**
   * Upload user avatar
   */
  async uploadAvatar(id: number, file: File, onProgress?: (progress: number) => void): Promise<ApiResponse<DjangoUser>> {
    return apiClient.upload(`/users/${id}/upload-avatar/`, file, 'avatar', undefined, onProgress);
  },

  /**
   * Get users by role
   */
  async getUsersByRole(role: string): Promise<ApiResponse<DjangoUser[]>> {
    return apiClient.get(`/users/by-role/${role}/`);
  },

  /**
   * Get user statistics
   */
  async getUserStats(): Promise<ApiResponse<{
    total_users: number;
    active_users: number;
    users_by_role: Record<string, number>;
    recent_registrations: number;
  }>> {
    return apiClient.get('/users/stats/');
  },

  /**
   * Search users
   */
  async searchUsers(query: string): Promise<ApiResponse<DjangoUser[]>> {
    return apiClient.get(`/users/search/?q=${encodeURIComponent(query)}`);
  },

  /**
   * Export users data
   */
  async exportUsers(filters: UsuarioFilters = {}): Promise<ApiResponse<{ export_url: string }>> {
    return apiClient.post('/users/export/', filters);
  },

  /**
   * Bulk update users
   */
  async bulkUpdateUsers(userIds: number[], updates: Partial<UpdateUserRequest>): Promise<ApiResponse<DjangoUser[]>> {
    return apiClient.post('/users/bulk-update/', { user_ids: userIds, updates });
  },

  /**
   * Bulk delete users
   */
  async bulkDeleteUsers(userIds: number[]): Promise<ApiResponse> {
    return apiClient.post('/users/bulk-delete/', { user_ids: userIds });
  },
};

// =====================
// PROFILE SERVICE
// =====================

export const profileService = {
  /**
   * Get current user profile
   */
  async getProfile(): Promise<ApiResponse<DjangoUser>> {
    return apiClient.get('/profile/');
  },

  /**
   * Update current user profile
   */
  async updateProfile(data: UpdateUserRequest): Promise<ApiResponse<DjangoUser>> {
    return apiClient.patch('/profile/', data);
  },

  /**
   * Upload profile avatar
   */
  async uploadProfileAvatar(file: File, onProgress?: (progress: number) => void): Promise<ApiResponse<DjangoUser>> {
    return apiClient.upload('/profile/upload-avatar/', file, 'avatar', undefined, onProgress);
  },

  /**
   * Get profile activity log
   */
  async getActivityLog(): Promise<ApiResponse<Array<{
    id: number;
    action: string;
    timestamp: string;
    ip_address: string;
    user_agent: string;
  }>>> {
    return apiClient.get('/profile/activity/');
  },

  /**
   * Update notification preferences
   */
  async updateNotificationPreferences(preferences: Record<string, boolean>): Promise<ApiResponse> {
    return apiClient.patch('/profile/notifications/', preferences);
  },

  /**
   * Get notification preferences
   */
  async getNotificationPreferences(): Promise<ApiResponse<Record<string, boolean>>> {
    return apiClient.get('/profile/notifications/');
  },
};

// =====================
// PERMISSIONS SERVICE
// =====================

export const permissionsService = {
  /**
   * Check if user has specific permission
   */
  async hasPermission(permission: string): Promise<ApiResponse<{ has_permission: boolean }>> {
    return apiClient.get(`/permissions/check/${permission}/`);
  },

  /**
   * Get user permissions
   */
  async getUserPermissions(): Promise<ApiResponse<string[]>> {
    return apiClient.get('/permissions/user/');
  },

  /**
   * Get role permissions
   */
  async getRolePermissions(role: string): Promise<ApiResponse<string[]>> {
    return apiClient.get(`/permissions/role/${role}/`);
  },
};

// Export all services
export default {
  auth: authService,
  user: userService,
  profile: profileService,
  permissions: permissionsService,
};