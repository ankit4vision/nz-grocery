import React, { useState, useRef } from 'react'
import { CCard, CCardHeader, CCardBody, CCardTitle, CButton, CSpinner } from '@coreui/react'
import { cilUser, cilPencil, cilSave, cilX } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import PropTypes from 'prop-types'
import { TextField, SelectField, FormRow } from '../../common/FormFields'

const PersonalInfoSection = ({ 
  personalData = {}, 
  onSave, 
  loading = false 
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bio: '',
    dateOfBirth: '',
    gender: '',
    ...personalData
  })
  const [errors, setErrors] = useState({})

  const handleEditClick = () => {
    setIsEditing(true)
    setErrors({})
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      bio: '',
      dateOfBirth: '',
      gender: '',
      ...personalData
    })
    setErrors({})
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // Required fields validation
    if (!formData.firstName?.trim()) {
      newErrors.firstName = 'First name is required'
    }
    if (!formData.lastName?.trim()) {
      newErrors.lastName = 'Last name is required'
    }
    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    // Phone validation (optional but if provided, should be valid)
    if (formData.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number'
    }

    // Date of birth validation
    if (formData.dateOfBirth) {
      const birthDate = new Date(formData.dateOfBirth)
      const today = new Date()
      const age = today.getFullYear() - birthDate.getFullYear()
      
      if (age < 13) {
        newErrors.dateOfBirth = 'You must be at least 13 years old'
      } else if (age > 120) {
        newErrors.dateOfBirth = 'Please enter a valid birth date'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (validateForm()) {
      try {
        await onSave(formData)
        setIsEditing(false)
        setErrors({})
      } catch (error) {
        console.error('Error saving personal info:', error)
      }
    }
  }

  return (
    <CCard>
      <CCardHeader>
        <div className="d-flex justify-content-between align-items-center w-100">
          <CCardTitle className="mb-0 d-flex align-items-center">
            <CIcon icon={cilUser} className="me-2" />
            Personal Information
          </CCardTitle>
          {!isEditing && (
            <CButton
              color="primary"
              variant="outline"
              size="sm"
              onClick={handleEditClick}
              disabled={loading}
            >
              <CIcon icon={cilPencil} className="me-1" />
              Edit
            </CButton>
          )}
        </div>
      </CCardHeader>
      <CCardBody>
        {isEditing ? (
          <div>
            <FormRow>
              <TextField
                id="firstName"
                label="First Name"
                value={formData.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                placeholder="Enter first name"
                required
                col={6}
                invalid={!!errors.firstName}
                feedback={errors.firstName}
              />
              <TextField
                id="lastName"
                label="Last Name"
                value={formData.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                placeholder="Enter last name"
                required
                col={6}
                invalid={!!errors.lastName}
                feedback={errors.lastName}
              />
            </FormRow>

            <FormRow>
              <TextField
                id="email"
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="Enter email address"
                required
                col={6}
                invalid={!!errors.email}
                feedback={errors.email}
              />
              <TextField
                id="phone"
                label="Phone Number"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="Enter phone number"
                col={6}
                invalid={!!errors.phone}
                feedback={errors.phone}
              />
            </FormRow>

            <FormRow>
              <TextField
                id="dateOfBirth"
                label="Date of Birth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                col={6}
                invalid={!!errors.dateOfBirth}
                feedback={errors.dateOfBirth}
              />
              <SelectField
                id="gender"
                label="Gender"
                value={formData.gender}
                onChange={(e) => handleChange('gender', e.target.value)}
                options={[
                  { value: '', label: 'Select Gender' },
                  { value: 'male', label: 'Male' },
                  { value: 'female', label: 'Female' },
                  { value: 'other', label: 'Other' },
                  { value: 'prefer-not-to-say', label: 'Prefer not to say' }
                ]}
                col={6}
              />
            </FormRow>

            <FormRow>
              <TextField
                id="bio"
                label="Bio"
                type="textarea"
                value={formData.bio}
                onChange={(e) => handleChange('bio', e.target.value)}
                placeholder="Tell us about yourself..."
                rows={3}
                col={12}
              />
            </FormRow>

            <div className="d-flex gap-2 justify-content-end mt-3">
              <CButton
                color="secondary"
                variant="outline"
                size="sm"
                onClick={handleCancelEdit}
                disabled={loading}
              >
                <CIcon icon={cilX} className="me-1" />
                Cancel
              </CButton>
              <CButton
                color="primary"
                size="sm"
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <CSpinner size="sm" className="me-1" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CIcon icon={cilSave} className="me-1" />
                    Save Changes
                  </>
                )}
              </CButton>
            </div>
          </div>
        ) : (
          <div className="row">
            <div className="col-md-6 mb-3">
              <strong>First Name:</strong>
              <p className="text-muted mb-0">{personalData.firstName || 'Not provided'}</p>
            </div>
            <div className="col-md-6 mb-3">
              <strong>Last Name:</strong>
              <p className="text-muted mb-0">{personalData.lastName || 'Not provided'}</p>
            </div>
            <div className="col-md-6 mb-3">
              <strong>Email:</strong>
              <p className="text-muted mb-0">{personalData.email || 'Not provided'}</p>
            </div>
            <div className="col-md-6 mb-3">
              <strong>Phone:</strong>
              <p className="text-muted mb-0">{personalData.phone || 'Not provided'}</p>
            </div>
            <div className="col-md-6 mb-3">
              <strong>Date of Birth:</strong>
              <p className="text-muted mb-0">{personalData.dateOfBirth || 'Not provided'}</p>
            </div>
            <div className="col-md-6 mb-3">
              <strong>Gender:</strong>
              <p className="text-muted mb-0">{personalData.gender || 'Not provided'}</p>
            </div>
            <div className="col-12 mb-3">
              <strong>Bio:</strong>
              <p className="text-muted mb-0">{personalData.bio || 'Not provided'}</p>
            </div>
          </div>
        )}
      </CCardBody>
    </CCard>
  )
}

PersonalInfoSection.propTypes = {
  personalData: PropTypes.object,
  onSave: PropTypes.func.isRequired,
  loading: PropTypes.bool
}

export default PersonalInfoSection
