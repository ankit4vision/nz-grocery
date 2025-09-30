import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useLocalStorage } from '../hooks';
import { STORAGE_KEYS, NOTIFICATION_TYPES } from '../utils/constants';

/**
 * App Context for managing global application state
 */

// Initial state
const initialState = {
  isLoading: false,
  notifications: [],
  sidebarOpen: false,
  searchQuery: '',
  searchResults: [],
  isSearching: false,
  language: 'en',
  currency: 'NZD',
  offline: false,
  lastSync: null,
  appVersion: '1.0.0',
  maintenanceMode: false,
};

// Action types
const APP_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
  CLEAR_NOTIFICATIONS: 'CLEAR_NOTIFICATIONS',
  TOGGLE_SIDEBAR: 'TOGGLE_SIDEBAR',
  SET_SIDEBAR_OPEN: 'SET_SIDEBAR_OPEN',
  SET_SEARCH_QUERY: 'SET_SEARCH_QUERY',
  SET_SEARCH_RESULTS: 'SET_SEARCH_RESULTS',
  SET_SEARCHING: 'SET_SEARCHING',
  SET_LANGUAGE: 'SET_LANGUAGE',
  SET_CURRENCY: 'SET_CURRENCY',
  SET_OFFLINE: 'SET_OFFLINE',
  SET_LAST_SYNC: 'SET_LAST_SYNC',
  SET_MAINTENANCE_MODE: 'SET_MAINTENANCE_MODE',
  RESET_APP_STATE: 'RESET_APP_STATE',
};

// Reducer function
const appReducer = (state, action) => {
  switch (action.type) {
    case APP_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };

    case APP_ACTIONS.ADD_NOTIFICATION: {
      const notification = {
        id: Date.now() + Math.random(),
        timestamp: new Date().toISOString(),
        ...action.payload,
      };
      return {
        ...state,
        notifications: [...state.notifications, notification],
      };
    }

    case APP_ACTIONS.REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload),
      };

    case APP_ACTIONS.CLEAR_NOTIFICATIONS:
      return {
        ...state,
        notifications: [],
      };

    case APP_ACTIONS.TOGGLE_SIDEBAR:
      return {
        ...state,
        sidebarOpen: !state.sidebarOpen,
      };

    case APP_ACTIONS.SET_SIDEBAR_OPEN:
      return {
        ...state,
        sidebarOpen: action.payload,
      };

    case APP_ACTIONS.SET_SEARCH_QUERY:
      return {
        ...state,
        searchQuery: action.payload,
      };

    case APP_ACTIONS.SET_SEARCH_RESULTS:
      return {
        ...state,
        searchResults: action.payload,
        isSearching: false,
      };

    case APP_ACTIONS.SET_SEARCHING:
      return {
        ...state,
        isSearching: action.payload,
      };

    case APP_ACTIONS.SET_LANGUAGE:
      return {
        ...state,
        language: action.payload,
      };

    case APP_ACTIONS.SET_CURRENCY:
      return {
        ...state,
        currency: action.payload,
      };

    case APP_ACTIONS.SET_OFFLINE:
      return {
        ...state,
        offline: action.payload,
      };

    case APP_ACTIONS.SET_LAST_SYNC:
      return {
        ...state,
        lastSync: action.payload,
      };

    case APP_ACTIONS.SET_MAINTENANCE_MODE:
      return {
        ...state,
        maintenanceMode: action.payload,
      };

    case APP_ACTIONS.RESET_APP_STATE:
      return initialState;

    default:
      return state;
  }
};

// Create context
const AppContext = createContext();

// Provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [storedLanguage, setStoredLanguage] = useLocalStorage(STORAGE_KEYS.LANGUAGE, initialState.language);

  // Load language from localStorage on mount
  useEffect(() => {
    if (storedLanguage) {
      dispatch({ type: APP_ACTIONS.SET_LANGUAGE, payload: storedLanguage });
    }
  }, [storedLanguage]);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      dispatch({ type: APP_ACTIONS.SET_OFFLINE, payload: false });
      dispatch({ type: APP_ACTIONS.SET_LAST_SYNC, payload: new Date().toISOString() });
    };

    const handleOffline = () => {
      dispatch({ type: APP_ACTIONS.SET_OFFLINE, payload: true });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Set initial offline status
    dispatch({ type: APP_ACTIONS.SET_OFFLINE, payload: !navigator.onLine });

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Auto-remove notifications after 5 seconds
  useEffect(() => {
    state.notifications.forEach(notification => {
      if (!notification.persistent) {
        setTimeout(() => {
          dispatch({ type: APP_ACTIONS.REMOVE_NOTIFICATION, payload: notification.id });
        }, 5000);
      }
    });
  }, [state.notifications]);

  // Context actions
  const actions = {
    setLoading: (isLoading) => {
      dispatch({ type: APP_ACTIONS.SET_LOADING, payload: isLoading });
    },

    addNotification: (notification) => {
      dispatch({ type: APP_ACTIONS.ADD_NOTIFICATION, payload: notification });
    },

    removeNotification: (id) => {
      dispatch({ type: APP_ACTIONS.REMOVE_NOTIFICATION, payload: id });
    },

    clearNotifications: () => {
      dispatch({ type: APP_ACTIONS.CLEAR_NOTIFICATIONS });
    },

    showSuccess: (message, title = 'Success') => {
      actions.addNotification({
        type: NOTIFICATION_TYPES.SUCCESS,
        title,
        message,
      });
    },

    showError: (message, title = 'Error') => {
      actions.addNotification({
        type: NOTIFICATION_TYPES.ERROR,
        title,
        message,
        persistent: true,
      });
    },

    showWarning: (message, title = 'Warning') => {
      actions.addNotification({
        type: NOTIFICATION_TYPES.WARNING,
        title,
        message,
      });
    },

    showInfo: (message, title = 'Info') => {
      actions.addNotification({
        type: NOTIFICATION_TYPES.INFO,
        title,
        message,
      });
    },

    toggleSidebar: () => {
      dispatch({ type: APP_ACTIONS.TOGGLE_SIDEBAR });
    },

    setSidebarOpen: (open) => {
      dispatch({ type: APP_ACTIONS.SET_SIDEBAR_OPEN, payload: open });
    },

    setSearchQuery: (query) => {
      dispatch({ type: APP_ACTIONS.SET_SEARCH_QUERY, payload: query });
    },

    setSearchResults: (results) => {
      dispatch({ type: APP_ACTIONS.SET_SEARCH_RESULTS, payload: results });
    },

    setSearching: (isSearching) => {
      dispatch({ type: APP_ACTIONS.SET_SEARCHING, payload: isSearching });
    },

    setLanguage: (language) => {
      setStoredLanguage(language);
      dispatch({ type: APP_ACTIONS.SET_LANGUAGE, payload: language });
    },

    setCurrency: (currency) => {
      dispatch({ type: APP_ACTIONS.SET_CURRENCY, payload: currency });
    },

    setMaintenanceMode: (enabled) => {
      dispatch({ type: APP_ACTIONS.SET_MAINTENANCE_MODE, payload: enabled });
    },

    resetAppState: () => {
      dispatch({ type: APP_ACTIONS.RESET_APP_STATE });
    },

    // Helper methods
    getNotificationCount: () => {
      return state.notifications.length;
    },

    hasNotifications: () => {
      return state.notifications.length > 0;
    },

    getUnreadNotificationCount: () => {
      return state.notifications.filter(n => !n.read).length;
    },

    isOnline: () => {
      return !state.offline;
    },

    getLastSyncTime: () => {
      return state.lastSync ? new Date(state.lastSync) : null;
    },

    getTimeSinceLastSync: () => {
      if (!state.lastSync) return null;
      const now = new Date();
      const lastSync = new Date(state.lastSync);
      return Math.floor((now - lastSync) / 1000); // seconds
    },
  };

  const value = {
    ...state,
    ...actions,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use app context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
