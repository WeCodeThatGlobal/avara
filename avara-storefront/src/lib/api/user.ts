import { getApiAuth, putApiAuth } from '../api-client';

export interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  created_at: string;
  updated_at: string;
  metadata?: Record<string, any>;
}

export interface UpdateProfileData {
  first_name?: string;
  last_name?: string;
  email?: string;
}

/**
 * Get current user profile
 */
export async function getCurrentUser(): Promise<{
  success: boolean;
  data?: UserProfile;
  message?: string;
}> {
  try {
    const response = await getApiAuth('/store/customers/me');
    const data = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Failed to fetch user profile',
      };
    }
    
    return {
      success: true,
      data: data.data.customer,
    };
  } catch (error) {
    console.error('Get current user error:', error);
    return {
      success: false,
      message: 'Failed to fetch user profile',
    };
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  profileData: UpdateProfileData
): Promise<{
  success: boolean;
  data?: UserProfile;
  message?: string;
}> {
  try {
    const response = await putApiAuth('/store/customers/me', profileData);
    const data = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Failed to update user profile',
      };
    }
    
    return {
      success: true,
      data: data.data.customer,
    };
  } catch (error) {
    console.error('Update user profile error:', error);
    return {
      success: false,
      message: 'Failed to update user profile',
    };
  }
}

/**
 * Get user orders (placeholder for future implementation)
 */
export async function getUserOrders(): Promise<{
  success: boolean;
  data?: any[];
  message?: string;
}> {
  try {
    const response = await getApiAuth('/store/orders');
    const data = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Failed to fetch user orders',
      };
    }
    
    return {
      success: true,
      data: data.data?.orders || [],
    };
  } catch (error) {
    console.error('Get user orders error:', error);
    return {
      success: false,
      message: 'Failed to fetch user orders',
    };
  }
} 