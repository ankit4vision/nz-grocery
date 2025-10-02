import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useLocalStorage } from '../hooks';
import { STORAGE_KEYS } from '../utils/constants';
import { authMockData } from '../data/mockData';

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

  // Load user from localStorage on mount
  useEffect(() => {
    if (storedUser) {
      dispatch({ type: USER_ACTIONS.SET_USER, payload: storedUser });
    } else {
      // No stored user, set loading to false
      dispatch({ type: USER_ACTIONS.SET_LOADING, payload: false });
    }
  }, [storedUser]);

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
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Validate credentials using mock data
        const validation = authMockData.validateCredentials(credentials.email, credentials.password);
        
        if (!validation.success) {
          throw new Error(validation.error);
        }
        
        const user = validation.user;
        const sessionId = authMockData.createSession(user.id);
        
        // Remove password from user object
        const { password, ...userWithoutPassword } = user;
        
        // Create user profile
        const userProfile = {
          ...userWithoutPassword,
          preferences: state.preferences,
        };

        setStoredUser(userWithoutPassword);
        dispatch({ type: USER_ACTIONS.LOGIN_SUCCESS, payload: { user: userWithoutPassword, profile: userProfile } });
        
        return { success: true, user: userWithoutPassword };
      } catch (error) {
        dispatch({ type: USER_ACTIONS.SET_ERROR, payload: error.message });
        throw error;
      }
    },

    logout: () => {
      // Destroy session in mock data
      const sessionId = localStorage.getItem('sessionId');
      if (sessionId) {
        authMockData.destroySession(sessionId);
        localStorage.removeItem('sessionId');
      }
      
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
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In real app, this would validate current password and update new password
        // For mock, we'll just simulate success
        
        dispatch({ type: USER_ACTIONS.SET_LOADING, payload: false });
        return { success: true };
      } catch (error) {
        dispatch({ type: USER_ACTIONS.SET_ERROR, payload: error.message });
        throw error;
      }
    },

    // New authentication methods
    signup: async (userData) => {
      dispatch({ type: USER_ACTIONS.SET_LOADING, payload: true });
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Check if user already exists
        const existingUser = authMockData.findUserByEmail(userData.email);
        if (existingUser) {
          throw new Error('User with this email already exists');
        }
        
        // Create new user
        const newUser = {
          id: (authMockData.users.length + 1).toString(),
          ...userData,
          role: 'customer',
          isEmailVerified: false,
          isMobileVerified: false,
          createdAt: new Date().toISOString(),
          lastLogin: null,
          profile: {
            avatar: null,
            dateOfBirth: null,
            gender: null,
            address: null,
            preferences: {
              newsletter: true,
              smsNotifications: true,
              emailNotifications: true
            }
          }
        };
        
        // Add to mock data
        authMockData.users.push(newUser);
        
        dispatch({ type: USER_ACTIONS.SET_LOADING, payload: false });
        return { success: true, user: newUser };
      } catch (error) {
        dispatch({ type: USER_ACTIONS.SET_ERROR, payload: error.message });
        throw error;
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
      if (!state.profile) return '';
      return `${state.profile.firstName || ''} ${state.profile.lastName || ''}`.trim();
    },

    getInitials: () => {
      if (!state.profile) return '';
      const firstName = state.profile.firstName || '';
      const lastName = state.profile.lastName || '';
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
