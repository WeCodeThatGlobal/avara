"use client";

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { 
  registerUser, 
  loginUser, 
  logoutUser, 
  checkAuthStatus, 
  getStoredUserData, 
  getStoredAuthToken,
  isLoggedIn,
  type AuthResponse,
  type RegisterData,
  type LoginData
} from '../api/auth';

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_LOADING'; payload: boolean };

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Auth reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
      
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
      
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
      
    case 'AUTH_LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
      
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
      
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
      
    default:
      return state;
  }
};

interface AuthContextType {
  state: AuthState;
  register: (data: RegisterData) => Promise<AuthResponse>;
  login: (data: LoginData) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  clearError: () => void;
  checkAuth: () => Promise<void>;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if user is logged in from localStorage
        if (isLoggedIn()) {
          const storedUser = getStoredUserData();
          const storedToken = getStoredAuthToken();
          
          console.log('Found stored auth data:', { storedUser, hasToken: !!storedToken });
          
          if (storedUser && storedToken) {
            dispatch({
              type: 'AUTH_SUCCESS',
              payload: { user: storedUser, token: storedToken }
            });
            
            console.log('Restored auth state from localStorage');
            
            // verify with backend
            try {
              await checkAuth();
            } catch (backendError) {
              console.warn('Backend auth check failed, but keeping local auth state:', backendError);
            }
          } else {
            console.log('No valid stored auth data found');
          }
        } else {
          console.log('User not logged in from localStorage');
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        dispatch({ type: 'AUTH_FAILURE', payload: 'Failed to initialize authentication' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initializeAuth();
  }, []);

  // Register function
  const register = useCallback(async (data: RegisterData): Promise<AuthResponse> => {
    dispatch({ type: 'AUTH_START' });
    
    try {
      const response = await registerUser(data);
      
      if (response.success && response.data) {
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: {
            user: response.data.customer,
            token: response.data.token
          }
        });
      } else {
        dispatch({ type: 'AUTH_FAILURE', payload: response.message });
      }
      
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      return {
        success: false,
        message: errorMessage,
      };
    }
  }, []);

  // Login function
  const login = useCallback(async (data: LoginData): Promise<AuthResponse> => {
    dispatch({ type: 'AUTH_START' });
    
    try {
      const response = await loginUser(data);
      
      if (response.success && response.data) {
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: {
            user: response.data.customer,
            token: response.data.token
          }
        });
      } else {
        dispatch({ type: 'AUTH_FAILURE', payload: response.message });
      }
      
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      return {
        success: false,
        message: errorMessage,
      };
    }
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      dispatch({ type: 'AUTH_LOGOUT' });
    }
  }, []);

  // Clear error function
  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  // Check auth status
  const checkAuth = useCallback(async () => {
    try {
      const response = await checkAuthStatus();
      
      if (response.success && response.data) {
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: {
            user: response.data.customer,
            token: response.data.token
          }
        });
      } else {
        console.warn('Auth check failed, but keeping local state');
      }
    } catch (error) {
      console.error('Auth check error:', error);
      console.warn('Network error during auth check, keeping local auth state');
    }
  }, []);

  const value: AuthContextType = {
    state,
    register,
    login,
    logout,
    clearError,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 