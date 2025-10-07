import React, { createContext, useContext, useReducer, useEffect } from 'react'
import PropTypes from 'prop-types'
import apiService from '../api'

// Auth Context
const AuthContext = createContext()

// Auth Actions
const AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  LOAD_USER: 'LOAD_USER',
  UPDATE_USER: 'UPDATE_USER',
  SET_LOADING: 'SET_LOADING',
}

// Auth Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
      return {
        ...state,
        loading: true,
        error: null,
      }
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null,
      }
    case AUTH_ACTIONS.LOGIN_FAILURE:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload,
      }
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      }
    case AUTH_ACTIONS.LOAD_USER:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
      }
    case AUTH_ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      }
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      }
    default:
      return state
  }
}

// Initial State
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
}

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUserFromStorage = () => {
      const token = localStorage.getItem('authToken')
      const user = localStorage.getItem('user')

      if (token && user) {
        try {
          const userData = JSON.parse(user)
          dispatch({
            type: AUTH_ACTIONS.LOAD_USER,
            payload: { user: userData, token },
          })
        } catch (error) {
          console.error('Error parsing user data:', error)
          localStorage.removeItem('authToken')
          localStorage.removeItem('user')
        }
      }
    }

    loadUserFromStorage()
  }, [])

  // Login function
  const login = async (credentials) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START })
    
    try {
      // For now, use mock authentication
      // In real app, use: const response = await apiService.login(credentials)
      const mockUsers = [
        {
          id: 1,
          email: 'admin@example.com',
          password: 'admin123',
          firstName: 'Admin',
          lastName: 'User',
          role: 'admin',
          permissions: ['user:read', 'user:write', 'user:delete', 'role:read', 'role:write', 'role:delete', 'dashboard:read', 'dashboard:write'],
          avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=007bff&color=ffffff&size=40',
          isActive: true,
        },
        {
          id: 2,
          email: 'user@example.com',
          password: 'user123',
          firstName: 'John',
          lastName: 'Doe',
          role: 'user',
          permissions: ['dashboard:read'],
          avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=28a745&color=ffffff&size=40',
          isActive: true,
        },
        {
          id: 3,
          email: 'manager@example.com',
          password: 'manager123',
          firstName: 'Jane',
          lastName: 'Smith',
          role: 'manager',
          permissions: ['user:read', 'user:write', 'dashboard:read', 'dashboard:write'],
          avatar: 'https://ui-avatars.com/api/?name=Jane+Smith&background=dc3545&color=ffffff&size=40',
          isActive: true,
        },
      ]

      const user = mockUsers.find(
        u => u.email === credentials.email && u.password === credentials.password
      )

      if (user) {
        const token = btoa(JSON.stringify({
          userId: user.id,
          role: user.role,
          exp: Date.now() + (1000 * 60 * 60 * 24), // 24 hours
        }))

        localStorage.setItem('authToken', token)
        localStorage.setItem('user', JSON.stringify(user))

        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: { user, token },
        })

        return { success: true, user }
      } else {
        throw new Error('Invalid email or password')
      }
    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: error.message,
      })
      throw error
    }
  }

  // Logout function
  const logout = async () => {
    try {
      await apiService.logout()
    } catch (error) {
      console.warn('Logout API call failed:', error)
    } finally {
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
      dispatch({ type: AUTH_ACTIONS.LOGOUT })
    }
  }

  // Update user function
  const updateUser = (userData) => {
    const updatedUser = { ...state.user, ...userData }
    localStorage.setItem('user', JSON.stringify(updatedUser))
    dispatch({
      type: AUTH_ACTIONS.UPDATE_USER,
      payload: userData,
    })
  }

  // Check if user has permission
  const hasPermission = (permission) => {
    if (!state.user || !state.user.permissions) return false
    return state.user.permissions.includes(permission)
  }

  // Check if user has role
  const hasRole = (role) => {
    if (!state.user) return false
    return state.user.role === role
  }

  // Check if user has any of the roles
  const hasAnyRole = (roles) => {
    if (!state.user) return false
    return roles.includes(state.user.role)
  }

  // Check if user has all permissions
  const hasAllPermissions = (permissions) => {
    if (!state.user || !state.user.permissions) return false
    return permissions.every(permission => state.user.permissions.includes(permission))
  }

  const value = {
    ...state,
    login,
    logout,
    updateUser,
    hasPermission,
    hasRole,
    hasAnyRole,
    hasAllPermissions,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
