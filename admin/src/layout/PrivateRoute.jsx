import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'

const PrivateRoute = ({ children, requiredRole = null }) => {
  const location = useLocation()
  
  // Check if user is authenticated
  const token = localStorage.getItem('authToken')
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  if (!token || !user) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Check token expiration
  try {
    const tokenData = JSON.parse(atob(token))
    if (tokenData.exp < Date.now()) {
      // Token expired, clear storage and redirect
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
      return <Navigate to="/login" state={{ from: location }} replace />
    }
  } catch (error) {
    // Invalid token, clear storage and redirect
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Check role-based access
  if (requiredRole && user.role !== requiredRole) {
    // User doesn't have required role
    return <Navigate to="/unauthorized" replace />
  }

  // User is authenticated and authorized
  return children
}

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requiredRole: PropTypes.string
}

export default PrivateRoute
