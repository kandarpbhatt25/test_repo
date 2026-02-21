// API response interface
export interface ApiResponse<T = any> {
  success?: boolean;
  data?: T;
  message?: string;
  error?: string;
  details?: string[];
  warnings?: string[];
  count?: number;
  token?: string;
  user?: any;
}

// API error interface
export interface ApiError {
  success: false;
  message: string;
  details?: string[];
  stack?: string;
}

// Simple fetch-based API service for SSR compatibility
class ApiService {
  private baseURL: string;

  constructor() {
    // Environment variable handling with fallback
    let apiURL = 'http://localhost:5000/api';
    
    // Try different environment variable sources
    if (typeof window !== 'undefined') {
      // Browser environment - try to get from various sources
      try {
        // Try Vite env
        const viteEnv = (globalThis as any).importMeta?.env;
        if (viteEnv?.VITE_API_URL) {
          apiURL = viteEnv.VITE_API_URL;
        }
      } catch (e) {
        // Ignore errors
      }
      
      try {
        // Try Next.js env
        const nextEnv = (globalThis as any).process?.env;
        if (nextEnv?.NEXT_PUBLIC_API_URL) {
          apiURL = nextEnv.NEXT_PUBLIC_API_URL;
        }
      } catch (e) {
        // Ignore errors
      }
    }
    
    this.baseURL = apiURL;
  }

  // Generic request method
  private async request<T = any>(
    method: string,
    url: string,
    data?: any,
    config?: any
  ): Promise<ApiResponse<T>> {
    if (typeof window === 'undefined') {
      // Server-side rendering - return mock response
      throw {
        success: false,
        message: 'API calls not available on server'
      } as ApiError;
    }

    const fullUrl = `${this.baseURL}${url}`;
    const token = localStorage.getItem('token');
    
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...config?.headers,
      },
      ...config,
    };

    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(fullUrl, options);
      
      // Handle 401 unauthorized
      if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        throw {
          success: false,
          message: 'Unauthorized - redirecting to login'
        } as ApiError;
      }

      const responseData = await response.json();

      if (!response.ok) {
        throw {
          success: false,
          message: responseData.message || responseData.error || `HTTP ${response.status}`,
          details: responseData.details
        } as ApiError;
      }

      return responseData as ApiResponse<T>;
    } catch (error) {
      if ((error as ApiError).success === false) {
        throw error;
      }
      
      // Handle network errors
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw {
            success: false,
            message: 'Request timeout. Please try again.'
          } as ApiError;
        }
        
        if (error.message.includes('fetch')) {
          throw {
            success: false,
            message: 'Network error. Please check your connection.'
          } as ApiError;
        }
      }
      
      throw {
        success: false,
        message: error instanceof Error ? error.message : 'An unexpected error occurred.'
      } as ApiError;
    }
  }

  // Generic GET request
  async get<T = any>(url: string, config?: any): Promise<ApiResponse<T>> {
    return this.request<T>('GET', url, undefined, config);
  }

  // Generic POST request
  async post<T = any>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> {
    return this.request<T>('POST', url, data, config);
  }

  // Generic PUT request
  async put<T = any>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', url, data, config);
  }

  // Generic DELETE request
  async delete<T = any>(url: string, config?: any): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', url, undefined, config);
  }

  // Generic PATCH request
  async patch<T = any>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> {
    return this.request<T>('PATCH', url, data, config);
  }

  // Set authentication token
  setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  }

  // Clear authentication token
  clearToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  }

  // Get current token
  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Get base URL
  getBaseURL(): string {
    return this.baseURL;
  }
}

// Create and export singleton instance
export const apiService = new ApiService();

// Export the class for testing or multiple instances
export { ApiService };

// Export default instance
export default apiService;
