import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useLocalStorage } from '../hooks';
import { STORAGE_KEYS, THEMES } from '../utils/constants';

/**
 * Theme Context for managing application theme and appearance globally
 */

// Initial state
const initialState = {
  theme: 'light',
  isDarkMode: false,
  fontSize: 'medium',
  colorScheme: 'default',
  animations: true,
  reducedMotion: false,
  highContrast: false,
};

// Action types
const THEME_ACTIONS = {
  SET_THEME: 'SET_THEME',
  TOGGLE_THEME: 'TOGGLE_THEME',
  SET_FONT_SIZE: 'SET_FONT_SIZE',
  SET_COLOR_SCHEME: 'SET_COLOR_SCHEME',
  TOGGLE_ANIMATIONS: 'TOGGLE_ANIMATIONS',
  SET_REDUCED_MOTION: 'SET_REDUCED_MOTION',
  TOGGLE_HIGH_CONTRAST: 'TOGGLE_HIGH_CONTRAST',
  RESET_THEME: 'RESET_THEME',
};

// Reducer function
const themeReducer = (state, action) => {
  switch (action.type) {
    case THEME_ACTIONS.SET_THEME:
      return {
        ...state,
        theme: action.payload,
        isDarkMode: action.payload === THEMES.DARK,
      };

    case THEME_ACTIONS.TOGGLE_THEME:
      const newTheme = state.theme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT;
      return {
        ...state,
        theme: newTheme,
        isDarkMode: newTheme === THEMES.DARK,
      };

    case THEME_ACTIONS.SET_FONT_SIZE:
      return {
        ...state,
        fontSize: action.payload,
      };

    case THEME_ACTIONS.SET_COLOR_SCHEME:
      return {
        ...state,
        colorScheme: action.payload,
      };

    case THEME_ACTIONS.TOGGLE_ANIMATIONS:
      return {
        ...state,
        animations: !state.animations,
      };

    case THEME_ACTIONS.SET_REDUCED_MOTION:
      return {
        ...state,
        reducedMotion: action.payload,
      };

    case THEME_ACTIONS.TOGGLE_HIGH_CONTRAST:
      return {
        ...state,
        highContrast: !state.highContrast,
      };

    case THEME_ACTIONS.RESET_THEME:
      return initialState;

    default:
      return state;
  }
};

// Create context
const ThemeContext = createContext();

// Provider component
export const ThemeProvider = ({ children }) => {
  const [state, dispatch] = useReducer(themeReducer, initialState);
  const [storedTheme, setStoredTheme] = useLocalStorage(STORAGE_KEYS.THEME, initialState.theme);

  // Load theme from localStorage on mount
  useEffect(() => {
    if (storedTheme) {
      dispatch({ type: THEME_ACTIONS.SET_THEME, payload: storedTheme });
    }
  }, [storedTheme]);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    
    // Set theme attribute
    root.setAttribute('data-theme', state.theme);
    
    // Set dark mode class
    if (state.isDarkMode) {
      root.classList.add('dark-mode');
    } else {
      root.classList.remove('dark-mode');
    }
    
    // Set font size
    root.setAttribute('data-font-size', state.fontSize);
    
    // Set color scheme
    root.setAttribute('data-color-scheme', state.colorScheme);
    
    // Set animations
    if (!state.animations) {
      root.classList.add('no-animations');
    } else {
      root.classList.remove('no-animations');
    }
    
    // Set reduced motion
    if (state.reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }
    
    // Set high contrast
    if (state.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
  }, [state]);

  // Context actions
  const actions = {
    setTheme: (theme) => {
      setStoredTheme(theme);
      dispatch({ type: THEME_ACTIONS.SET_THEME, payload: theme });
    },

    toggleTheme: () => {
      const newTheme = state.theme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT;
      setStoredTheme(newTheme);
      dispatch({ type: THEME_ACTIONS.TOGGLE_THEME });
    },

    setFontSize: (fontSize) => {
      dispatch({ type: THEME_ACTIONS.SET_FONT_SIZE, payload: fontSize });
    },

    setColorScheme: (colorScheme) => {
      dispatch({ type: THEME_ACTIONS.SET_COLOR_SCHEME, payload: colorScheme });
    },

    toggleAnimations: () => {
      dispatch({ type: THEME_ACTIONS.TOGGLE_ANIMATIONS });
    },

    setReducedMotion: (reducedMotion) => {
      dispatch({ type: THEME_ACTIONS.SET_REDUCED_MOTION, payload: reducedMotion });
    },

    toggleHighContrast: () => {
      dispatch({ type: THEME_ACTIONS.TOGGLE_HIGH_CONTRAST });
    },

    resetTheme: () => {
      setStoredTheme(initialState.theme);
      dispatch({ type: THEME_ACTIONS.RESET_THEME });
    },

    // Helper methods
    getThemeClass: () => {
      return `theme-${state.theme}`;
    },

    getFontSizeClass: () => {
      return `font-size-${state.fontSize}`;
    },

    getColorSchemeClass: () => {
      return `color-scheme-${state.colorScheme}`;
    },

    isLightTheme: () => {
      return state.theme === THEMES.LIGHT;
    },

    isDarkTheme: () => {
      return state.theme === THEMES.DARK;
    },

    getThemeColors: () => {
      const colors = {
        light: {
          primary: '#28a745',
          secondary: '#6c757d',
          background: '#ffffff',
          text: '#212529',
          surface: '#f8f9fa',
        },
        dark: {
          primary: '#34ce57',
          secondary: '#868e96',
          background: '#1a1a1a',
          text: '#f8f9fa',
          surface: '#2d2d2d',
        },
      };
      
      return colors[state.theme] || colors.light;
    },
  };

  const value = {
    ...state,
    ...actions,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme context
export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
