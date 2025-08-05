const API_BASE_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    customer: {
      id: string;
      email: string;
      first_name: string;
      last_name: string;
    };
    token: string;
  };
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

// Register new user
export async function registerUser(data: RegisterData): Promise<AuthResponse> {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (PUBLISHABLE_KEY) {
      headers['x-publishable-api-key'] = PUBLISHABLE_KEY;
    }

    const response = await fetch(`${API_BASE_URL}/store/auth/register`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    const result = await response.json();
    
    if (result.success && result.data?.token && typeof window !== 'undefined') {
      localStorage.setItem('auth_token', result.data.token);
      localStorage.setItem('user_data', JSON.stringify(result.data.customer));
    }

    return result;
  } catch (error) {
    console.error('Registration error:', error);
    return {
      success: false,
      message: 'Network error. Please try again.',
    };
  }
}

// Login user
export async function loginUser(data: LoginData): Promise<AuthResponse> {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (PUBLISHABLE_KEY) {
      headers['x-publishable-api-key'] = PUBLISHABLE_KEY;
    }

    const response = await fetch(`${API_BASE_URL}/store/auth/login`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    const result = await response.json();
    
    if (result.success && result.data?.token) {
      // Store token in localStorage
      localStorage.setItem('auth_token', result.data.token);
      localStorage.setItem('user_data', JSON.stringify(result.data.customer));
    }

    return result;
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      message: 'Network error. Please try again.',
    };
  }
}

// Logout user
export async function logoutUser(): Promise<{ success: boolean; message: string }> {
  try {
    const token = localStorage.getItem('auth_token');
    
    if (token) {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      };

      if (PUBLISHABLE_KEY) {
        headers['x-publishable-api-key'] = PUBLISHABLE_KEY;
      }

      await fetch(`${API_BASE_URL}/store/auth/logout`, {
        method: 'POST',
        headers,
      });
    }

    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');

    return {
      success: true,
      message: 'Logged out successfully',
    };
  } catch (error) {
    console.error('Logout error:', error);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    
    return {
      success: true,
      message: 'Logged out successfully',
    };
  }
}

// Check authentication status
export async function checkAuthStatus(): Promise<AuthResponse> {
  try {
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      return {
        success: false,
        message: 'Not authenticated',
      };
    }

    const headers: Record<string, string> = {
      'Authorization': `Bearer ${token}`,
    };

    if (PUBLISHABLE_KEY) {
      headers['x-publishable-api-key'] = PUBLISHABLE_KEY;
    }

    const response = await fetch(`${API_BASE_URL}/store/auth/login`, {
      method: 'GET',
      headers,
    });

    const result = await response.json();
    
    if (!result.success) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
    }

    return result;
  } catch (error) {
    console.error('Auth check error:', error);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    
    return {
      success: false,
      message: 'Authentication check failed',
    };
  }
}

// Get stored user data
export function getStoredUserData() {
  if (typeof window === 'undefined') return null;
  
  try {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error parsing stored user data:', error);
    return null;
  }
}

// Get stored auth token
export function getStoredAuthToken() {
  if (typeof window === 'undefined') return null;
  
  return localStorage.getItem('auth_token');
}

export function isLoggedIn(): boolean {
  if (typeof window === 'undefined') return false;
  
  const token = localStorage.getItem('auth_token');
  const userData = localStorage.getItem('user_data');
  
  return !!(token && userData);
}
