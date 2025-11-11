import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useLocalStorage } from '../hooks';
import { STORAGE_KEYS } from '../utils/constants';
import AuthService from '../services/api/auth';

/**
 * User Context for managing user authentication and profile state globally
 */

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true, // Start with loading true to prevent premature redirects
  error: null,
  profile: null,
  preferences: {
    theme: 'light',
    language: 'en',
    notifications: true,
  },
};

// Action types
const USER_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_USER: 'SET_USER',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',
  UPDATE_PROFILE: 'UPDATE_PROFILE',
  UPDATE_PREFERENCES: 'UPDATE_PREFERENCES',
  CLEAR_ERROR: 'CLEAR_ERROR',
};

// Reducer function
const userReducer = (state, action) => {
  switch (action.type) {
    case USER_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };

    case USER_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case USER_ACTIONS.SET_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false,
        error: null,
      };

    case USER_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        profile: action.payload.profile,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };

    case USER_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        profile: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };

    case USER_ACTIONS.UPDATE_PROFILE:
      return {
        ...state,
        profile: { ...state.profile, ...action.payload },
        error: null,
      };

    case USER_ACTIONS.UPDATE_PREFERENCES:
      return {
        ...state,
        preferences: { ...state.preferences, ...action.payload },
        error: null,
      };

    case USER_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

// Create context
const UserContext = createContext();

// Provider component
export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);
  const [storedUser, setStoredUser] = useLocalStorage(STORAGE_KEYS.USER, null);
  const [storedPreferences, setStoredPreferences] = useLocalStorage(STORAGE_KEYS.THEME, initialState.preferences);

  // Load user from localStorage and verify token on mount
  useEffect(() => {
    const loadUser = async () => {
      const token = AuthService.getToken();
      const storedUserData = AuthService.getUser();
      
      if (token && storedUserData) {
        // Set user from localStorage immediately
        dispatch({ type: USER_ACTIONS.SET_USER, payload: storedUserData });
        
        // Verify token by fetching current user
        try {
          const response = await AuthService.getCurrentUser();
          if (response.success && response.data) {
            dispatch({ type: USER_ACTIONS.SET_USER, payload: response.data });
            setStoredUser(response.data);
          }
        } catch (error) {
          // Token invalid, clear user
          AuthService.logout();
          dispatch({ type: USER_ACTIONS.SET_LOADING, payload: false });
        }
      } else {
        // No stored user, set loading to false
        dispatch({ type: USER_ACTIONS.SET_LOADING, payload: false });
      }
    };
    
    loadUser();
  }, []);

  // Load preferences from localStorage on mount
  useEffect(() => {
    if (storedPreferences) {
      dispatch({ type: USER_ACTIONS.UPDATE_PREFERENCES, payload: storedPreferences });
    }
  }, [storedPreferences]);

  // Context actions
  const actions = {
    login: async (credentials) => {
      dispatch({ type: USER_ACTIONS.SET_LOADING, payload: true });
      try {
        const response = await AuthService.login(credentials);
        
        if (!response.success) {
          const errorMessage = response.message || 'Login failed';
          dispatch({ type: USER_ACTIONS.SET_ERROR, payload: errorMessage });
          dispatch({ type: USER_ACTIONS.SET_LOADING, payload: false });
          return { success: false, message: errorMessage };
        }
        
        const user = response.data.user || response.data;
        
        // Create user profile
        const userProfile = {
          ...user,
          preferences: state.preferences,
        };

        setStoredUser(user);
        dispatch({ type: USER_ACTIONS.LOGIN_SUCCESS, payload: { user, profile: userProfile } });
        
        return { success: true, user };
      } catch (error) {
        const errorMessage = error.message || 'Login failed. Please try again.';
        dispatch({ type: USER_ACTIONS.SET_ERROR, payload: errorMessage });
        dispatch({ type: USER_ACTIONS.SET_LOADING, payload: false });
        // Don't throw error, return error response instead to prevent page reload
        return { success: false, message: errorMessage };
      }
    },

    logout: () => {
      // Clear auth data using AuthService
      AuthService.logout();
      
      setStoredUser(null);
      dispatch({ type: USER_ACTIONS.LOGOUT });
    },

    updateProfile: (profileData) => {
      try {
        const updatedProfile = { ...state.profile, ...profileData };
        dispatch({ type: USER_ACTIONS.UPDATE_PROFILE, payload: profileData });
        
        // Update stored user data
        if (state.user) {
          const updatedUser = { ...state.user, ...profileData };
          setStoredUser(updatedUser);
        }
        
        return { success: true, profile: updatedProfile };
      } catch (error) {
        dispatch({ type: USER_ACTIONS.SET_ERROR, payload: error.message });
        throw error;
      }
    },

    updatePreferences: (preferences) => {
      try {
        const updatedPreferences = { ...state.preferences, ...preferences };
        setStoredPreferences(updatedPreferences);
        dispatch({ type: USER_ACTIONS.UPDATE_PREFERENCES, payload: preferences });
        
        return { success: true, preferences: updatedPreferences };
      } catch (error) {
        dispatch({ type: USER_ACTIONS.SET_ERROR, payload: error.message });
        throw error;
      }
    },

    changePassword: async (passwordData) => {
      dispatch({ type: USER_ACTIONS.SET_LOADING, payload: true });
      try {
        const response = await AuthService.changePassword(passwordData);
        
        if (!response.success) {
          throw new Error(response.message || 'Failed to change password');
        }
        
        dispatch({ type: USER_ACTIONS.SET_LOADING, payload: false });
        return { success: true, message: response.message };
      } catch (error) {
        const errorMessage = error.message || 'Failed to change password. Please try again.';
        dispatch({ type: USER_ACTIONS.SET_ERROR, payload: errorMessage });
        dispatch({ type: USER_ACTIONS.SET_LOADING, payload: false });
        throw error;
      }
    },

    // New authentication methods
    signup: async (userData) => {
      dispatch({ type: USER_ACTIONS.SET_LOADING, payload: true });
      try {
        const response = await AuthService.register(userData);
        
        if (!response.success) {
          const errorMessage = response.message || 'Registration failed';
          dispatch({ type: USER_ACTIONS.SET_ERROR, payload: errorMessage });
          dispatch({ type: USER_ACTIONS.SET_LOADING, payload: false });
          return { success: false, message: errorMessage };
        }
        
        const user = response.data.user || response.data;
        
        // Create user profile
        const userProfile = {
          ...user,
          preferences: state.preferences,
        };

        setStoredUser(user);
        dispatch({ type: USER_ACTIONS.LOGIN_SUCCESS, payload: { user, profile: userProfile } });
        
        return { success: true, user };
      } catch (error) {
        const errorMessage = error.message || 'Registration failed. Please try again.';
        dispatch({ type: USER_ACTIONS.SET_ERROR, payload: errorMessage });
        dispatch({ type: USER_ACTIONS.SET_LOADING, payload: false });
        // Don't throw error, return error response instead to prevent page reload
        return { success: false, message: errorMessage };
      }
    },

    sendOTP: async (email) => {
      dispatch({ type: USER_ACTIONS.SET_LOADING, payload: true });
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Generate and store OTP
        const otp = authMockData.generateOTP();
        authMockData.storeOTP(email, otp);
        
        // In real app, this would send OTP via email/SMS
        console.log(`OTP for ${email}: ${otp}`); // For development
        
        dispatch({ type: USER_ACTIONS.SET_LOADING, payload: false });
        return { success: true, message: 'OTP sent successfully' };
      } catch (error) {
        dispatch({ type: USER_ACTIONS.SET_ERROR, payload: error.message });
        throw error;
      }
    },

    verifyOTP: async (email, otp) => {
      dispatch({ type: USER_ACTIONS.SET_LOADING, payload: true });
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const verification = authMockData.verifyOTP(email, otp);
        
        if (!verification.success) {
          throw new Error(verification.error);
        }
        
        dispatch({ type: USER_ACTIONS.SET_LOADING, payload: false });
        return { success: true, message: 'OTP verified successfully' };
      } catch (error) {
        dispatch({ type: USER_ACTIONS.SET_ERROR, payload: error.message });
        throw error;
      }
    },

    resetPassword: async (email, otp, newPassword) => {
      dispatch({ type: USER_ACTIONS.SET_LOADING, payload: true });
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Verify OTP first
        const otpVerification = authMockData.verifyOTP(email, otp);
        if (!otpVerification.success) {
          throw new Error(otpVerification.error);
        }
        
        // Find user and update password
        const user = authMockData.findUserByEmail(email);
        if (user) {
          user.password = newPassword;
        }
        
        dispatch({ type: USER_ACTIONS.SET_LOADING, payload: false });
        return { success: true, message: 'Password reset successfully' };
      } catch (error) {
        dispatch({ type: USER_ACTIONS.SET_ERROR, payload: error.message });
        throw error;
      }
    },

    clearError: () => {
      dispatch({ type: USER_ACTIONS.CLEAR_ERROR });
    },

    // Helper methods
    getFullName: () => {
      if (!state.user && !state.profile) return '';
      const user = state.user || state.profile;
      const firstName = user.first_name || user.firstName || '';
      const lastName = user.last_name || user.lastName || '';
      return `${firstName} ${lastName}`.trim();
    },

    getInitials: () => {
      if (!state.user && !state.profile) return '';
      const user = state.user || state.profile;
      const firstName = user.first_name || user.firstName || '';
      const lastName = user.last_name || user.lastName || '';
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    },

    hasRole: (role) => {
      return state.user?.role === role;
    },

    isAdmin: () => {
      return state.user?.role === 'admin';
    },

    isCustomer: () => {
      return state.user?.role === 'customer';
    },
  };

  const value = {
    ...state,
    ...actions,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use user context
export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};

export default UserContext;
