import React, { useState } from 'react'
import { CContainer, CRow, CCol, CForm, CFormInput, CFormCheck } from '@coreui/react'
import { Link, useNavigate } from 'react-router-dom'
import { cilLockLocked, cilUser, cilEnvelopeOpen, cilInfo } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useToast } from '../../components'
import { useAuth } from '../../context/AuthContext'
import { Button } from '../../components'
import '../../styles/auth.css'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const { success, error, warning } = useToast()
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // Email validation - consistent with project standards
    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address'
    }

    // Password validation - consistent with project standards
    if (!formData.password?.trim()) {
      newErrors.password = 'Password is required'
    } else if (formData.password.trim().length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      const result = await login({
        email: formData.email.trim(),
        password: formData.password.trim(),
        remember: formData.remember
      })
      
      if (result.success) {
        success('Login successful! Welcome back.', {
          title: 'Welcome!',
          duration: 3000
        })
        
        // Redirect based on role
        setTimeout(() => {
          navigate('/dashboard')
        }, 1000)
      }
    } catch (err) {
      // Handle different types of login errors with appropriate toast types
      if (err.message === 'Invalid email or password') {
        warning('Invalid email or password. Please check your credentials and try again.', {
          title: 'Login Failed',
          duration: 6000
        })
      } else if (err.message.includes('network') || err.message.includes('connection')) {
        error('Network error. Please check your internet connection and try again.', {
          title: 'Connection Error',
          duration: 8000
        })
      } else if (err.message.includes('server') || err.message.includes('500')) {
        error('Server error. Please try again later.', {
          title: 'Server Error',
          duration: 8000
        })
      } else {
        error(err.message || 'Login failed. Please try again.', {
          title: 'Login Error',
          duration: 6000
        })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={6} lg={5} xl={4}>
            {/* Logo/Brand Section */}
            <div className="text-center mb-4">
              <div className="d-inline-flex align-items-center justify-content-center bg-white rounded-circle mb-3" 
                   style={{ width: '80px', height: '80px' }}>
                <CIcon icon={cilLockLocked} size="2xl" className="text-primary" />
              </div>
              <h2 className="text-dark fw-bold mb-1">BaseAdmin</h2>
              <p className="text-muted mb-0">Secure Admin Dashboard</p>
            </div>

            <div className="auth-card">
              <div className="text-center mb-4">
                <h3 className="mb-2">Welcome Back</h3>
                <p className="text-muted">Sign in to your account</p>
              </div>
              <CForm onSubmit={handleSubmit}>
                <div className="mb-3">
                  <div className="position-relative">
                    <CIcon icon={cilEnvelopeOpen} className="auth-input-icon" />
                    <CFormInput
                      type="email"
                      name="email"
                      placeholder="Email address"
                      value={formData.email}
                      onChange={handleChange}
                      invalid={!!errors.email}
                      className={`auth-input ${errors.email ? 'is-invalid' : ''}`}
                    />
                  </div>
                  {errors.email && (
                    <div className="invalid-feedback d-block">{errors.email}</div>
                  )}
                </div>

                <div className="mb-3">
                  <div className="position-relative">
                    <CIcon icon={cilLockLocked} className="auth-input-icon" />
                    <CFormInput
                      type="password"
                      name="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleChange}
                      invalid={!!errors.password}
                      className={`auth-input ${errors.password ? 'is-invalid' : ''}`}
                    />
                  </div>
                  {errors.password && (
                    <div className="invalid-feedback d-block">{errors.password}</div>
                  )}
                </div>

                <div className="mb-4 d-flex justify-content-between align-items-center">
                  <CFormCheck
                    type="checkbox"
                    name="remember"
                    label="Remember me"
                    checked={formData.remember}
                    onChange={handleChange}
                    className="fw-medium"
                  />
                  <Link to="/forgot-password" className="text-decoration-none text-primary fw-medium">
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="auth-button"
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </button>
              </CForm>
            </div>

            {/* Demo Credentials */}
            <div className="demo-credentials">
              <div className="d-flex align-items-center mb-3">
                <CIcon icon={cilInfo} className="me-2 text-muted" />
                <h6 className="demo-credentials-title mb-0">Demo Credentials</h6>
              </div>
              <div className="demo-credential-item">
                <span className="demo-credential-label">Admin:</span>
                <code className="demo-credential-value">admin@example.com / admin123</code>
              </div>
              <div className="demo-credential-item">
                <span className="demo-credential-label">Manager:</span>
                <code className="demo-credential-value">manager@example.com / manager123</code>
              </div>
              <div className="demo-credential-item">
                <span className="demo-credential-label">User:</span>
                <code className="demo-credential-value">user@example.com / user123</code>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center mt-4">
              <p className="text-muted small mb-0">
                © 2024 BaseAdmin. All rights reserved.
              </p>
            </div>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
