import React, { useState } from 'react'
import { CContainer, CRow, CCol, CForm, CFormInput } from '@coreui/react'
import { Link, useNavigate } from 'react-router-dom'
import { cilLockLocked, cilUser, cilCheckCircle, cilArrowLeft } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useToast } from '../../components'
import { Button } from '../../components'
import '../../styles/auth.css'

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const { success, error } = useToast()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
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

    // Password validation - consistent with project standards
    if (!formData.password?.trim()) {
      newErrors.password = 'Password is required'
    } else if (formData.password.trim().length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    // Confirm password validation - consistent with project standards
    if (!formData.confirmPassword?.trim()) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password.trim() !== formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Passwords do not match'
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
      await new Promise(resolve => setTimeout(resolve, 1500))

      // In a real app, this would update the password via API
      console.log('Password reset completed for new password:', formData.password.trim())

      success('Password reset successful! Please sign in with your new password.')
      
      // Redirect to login
      setTimeout(() => {
        navigate('/login')
      }, 1000)
    } catch (err) {
      error('Password reset failed. Please try again.')
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
                <h3 className="mb-2">Reset Password</h3>
                <p className="text-muted">Enter your new password</p>
              </div>
              <CForm onSubmit={handleSubmit}>
                <div className="mb-3">
                  <div className="position-relative">
                    <CIcon icon={cilLockLocked} className="auth-input-icon" />
                    <CFormInput
                      type="password"
                      name="password"
                      placeholder="New password"
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

                <div className="mb-3">
                  <div className="position-relative">
                    <CIcon icon={cilCheckCircle} className="auth-input-icon" />
                    <CFormInput
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm new password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      invalid={!!errors.confirmPassword}
                      className={`auth-input ${errors.confirmPassword ? 'is-invalid' : ''}`}
                    />
                  </div>
                  {errors.confirmPassword && (
                    <div className="invalid-feedback d-block">{errors.confirmPassword}</div>
                  )}
                </div>

                <div className="alert alert-info border-0 mb-4">
                  <small className="mb-0">
                    <CIcon icon={cilCheckCircle} className="me-2" />
                    Password requirements:
                    <ul className="mb-0 mt-2 small">
                      <li>At least 6 characters long</li>
                      <li>Must match confirmation</li>
                    </ul>
                  </small>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="auth-button"
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>

                <div className="text-center">
                  <Link to="/login" className="text-decoration-none text-primary fw-medium">
                    <CIcon icon={cilArrowLeft} className="me-2" />
                    Back to Login
                  </Link>
                </div>
              </CForm>
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

export default ResetPassword
