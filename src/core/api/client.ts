/**
 * Core API Configuration and HTTP Client
 * Centralizes all API communication with Django backend
 */

// Environment configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  WS_URL: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000/ws',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
} as const;

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
  meta?: {
    total?: number;
    page?: number;
    per_page?: number;
    last_page?: number;
  };
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Request interceptor type
export interface RequestInterceptor {
  onRequest?: (config: RequestInit) => RequestInit | Promise<RequestInit>;
  onResponse?: (response: Response) => Response | Promise<Response>;
  onError?: (error: Error) => Error | Promise<Error>;
}

// HTTP Status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
} as const;

/**
 * Enhanced HTTP Client with advanced features
 */
class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;
  private interceptors: RequestInterceptor[] = [];
  private requestQueue: Map<string, Promise<any>> = new Map();

  constructor(baseURL: string = API_CONFIG.BASE_URL) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }

  /**
   * Add request interceptor
   */
  addInterceptor(interceptor: RequestInterceptor): void {
    this.interceptors.push(interceptor);
  }

  /**
   * Get authentication token from storage
   */
  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    // Usar access_token según la guía del backend
    return localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
  }

  /**
   * Set authentication token
   */
  setAuthToken(token: string, persistent: boolean = true): void {
    if (typeof window === 'undefined') return;
    
    if (persistent) {
      localStorage.setItem('access_token', token);
      sessionStorage.removeItem('access_token');
    } else {
      sessionStorage.setItem('access_token', token);
      localStorage.removeItem('access_token');
    }
  }

  /**
   * Clear authentication token
   */
  clearAuthToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    sessionStorage.removeItem('access_token');
    localStorage.removeItem('currentUser');
  }

  /**
   * Build request configuration
   */
  private async buildRequestConfig(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<RequestInit> {
    const token = this.getAuthToken();
    
    let config: RequestInit = {
      headers: {
        ...this.defaultHeaders,
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    // Apply interceptors
    for (const interceptor of this.interceptors) {
      if (interceptor.onRequest) {
        config = await interceptor.onRequest(config);
      }
    }

    return config;
  }

  /**
   * Process response through interceptors
   */
  private async processResponse(response: Response): Promise<Response> {
    let processedResponse = response;

    for (const interceptor of this.interceptors) {
      if (interceptor.onResponse) {
        processedResponse = await interceptor.onResponse(processedResponse);
      }
    }

    return processedResponse;
  }

  /**
   * Handle errors through interceptors
   */
  private async handleError(error: Error): Promise<never> {
    let processedError = error;

    for (const interceptor of this.interceptors) {
      if (interceptor.onError) {
        processedError = await interceptor.onError(processedError);
      }
    }

    throw processedError;
  }

  /**
   * Generate cache key for request deduplication
   */
  private getCacheKey(endpoint: string, options: RequestInit): string {
    const method = options.method || 'GET';
    const body = options.body || '';
    return `${method}:${endpoint}:${body}`;
  }

  /**
   * Core request method with advanced error handling
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const cacheKey = this.getCacheKey(endpoint, options);
    
    // Prevent duplicate requests for GET operations
    if (!options.method || options.method === 'GET') {
      if (this.requestQueue.has(cacheKey)) {
        return this.requestQueue.get(cacheKey);
      }
    }

    const requestPromise = this.executeRequest<T>(endpoint, options);
    
    if (!options.method || options.method === 'GET') {
      this.requestQueue.set(cacheKey, requestPromise);
      
      // Clean up cache after request completes
      requestPromise.finally(() => {
        this.requestQueue.delete(cacheKey);
      });
    }

    return requestPromise;
  }

  /**
   * Execute the actual HTTP request
   */
  private async executeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const config = await this.buildRequestConfig(endpoint, options);
      const url = `${this.baseURL}${endpoint}`;

      console.log('📡 API Client: Haciendo request a:', url);
      console.log('📡 API Client: Config:', { ...config, body: config.body ? 'DATA' : 'NO_BODY' });

      const response = await fetch(url, {
        ...config,
        mode: 'cors',
        credentials: 'include',
        signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
      });

      console.log('📡 API Client: Status respuesta:', response.status, response.statusText);

      const processedResponse = await this.processResponse(response);

      // Parse response
      const contentType = processedResponse.headers.get('content-type');
      let data: any;

      if (contentType?.includes('application/json')) {
        data = await processedResponse.json();
      } else {
        data = await processedResponse.text();
      }

      console.log('📡 API Client: Data respuesta:', data);

      // Handle HTTP errors but return ApiResponse format
      if (!processedResponse.ok) {
        console.log('❌ API Client: Error HTTP:', processedResponse.status);
        return {
          success: false,
          message: data.detail || data.message || `HTTP Error: ${response.status}`,
          errors: data.errors || data,
        };
      }

      console.log('✅ API Client: Respuesta exitosa');
      return {
        success: true,
        data: data as T,
        meta: this.extractMeta(processedResponse),
      };

    } catch (error) {
      console.error('💥 API Client: Error de red:', error);
      return {
        success: false,
        message: error.message || 'Network error occurred',
        errors: { network: [error.message] },
      };
    }
  }

  /**
   * Handle HTTP error responses
   */
  private async handleHttpError(response: Response): Promise<never> {
    const errorData = await response.json().catch(() => ({}));

    // Handle authentication errors
    if (response.status === HTTP_STATUS.UNAUTHORIZED) {
      this.clearAuthToken();
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
    }

    const error = new Error(
      errorData.message || 
      errorData.detail || 
      `HTTP Error: ${response.status} ${response.statusText}`
    );

    // Add additional error context
    Object.assign(error, {
      status: response.status,
      statusText: response.statusText,
      errors: errorData.errors || errorData,
      response: errorData,
    });

    throw error;
  }

  /**
   * Extract metadata from response headers
   */
  private extractMeta(response: Response): ApiResponse['meta'] {
    const meta: ApiResponse['meta'] = {};

    // Extract pagination info from headers if available
    const totalCount = response.headers.get('X-Total-Count');
    const page = response.headers.get('X-Page');
    const perPage = response.headers.get('X-Per-Page');

    if (totalCount) meta.total = parseInt(totalCount, 10);
    if (page) meta.page = parseInt(page, 10);
    if (perPage) meta.per_page = parseInt(perPage, 10);

    return Object.keys(meta).length > 0 ? meta : undefined;
  }

  // HTTP Methods
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.request<T>(`${endpoint}${queryString}`, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  /**
   * Upload file with progress tracking
   */
  async upload<T>(
    endpoint: string,
    file: File,
    fieldName: string = 'file',
    additionalData?: Record<string, any>,
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append(fieldName, file);

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    const token = this.getAuthToken();

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      // Track upload progress
      if (onProgress) {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const progress = (event.loaded / event.total) * 100;
            onProgress(progress);
          }
        });
      }

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText);
            resolve({ success: true, data });
          } catch {
            resolve({ success: true, data: xhr.responseText as unknown as T });
          }
        } else {
          reject(new Error(`Upload failed: ${xhr.status} ${xhr.statusText}`));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed'));
      });

      xhr.open('POST', `${this.baseURL}${endpoint}`);
      
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }

      xhr.send(formData);
    });
  }

  /**
   * Health check endpoint
   */
  async health(): Promise<ApiResponse<{ status: string; timestamp: string }>> {
    return this.get('/health/');
  }
}

// Create singleton instance
export const apiClient = new ApiClient();

// Default interceptors
apiClient.addInterceptor({
  onRequest: async (config) => {
    // Add request timestamp for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 API Request: ${config.method || 'GET'}`, config);
    }
    return config;
  },
  
  onResponse: async (response) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ API Response: ${response.status}`, response);
    }
    return response;
  },
  
  onError: async (error) => {
    console.error('❌ API Error:', error);
    return error;
  },
});

export default apiClient;