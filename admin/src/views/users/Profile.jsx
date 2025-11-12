import React, { useState, useEffect, useRef } from 'react'
import { Container, Row, Col, Card, Button, Form, Spinner, Image, Alert, Modal } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faSave, faX, faUpload, faTrash, faLock } from '@fortawesome/free-solid-svg-icons'
import { useToast } from '../../components'
import { profileService } from '../../services/profileService'
import { useAuth } from '../../context/AuthContext'

const Profile = () => {
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    avatar: ''
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [errors, setErrors] = useState({})
  const [avatarPreview, setAvatarPreview] = useState('')
  const [avatarLoading, setAvatarLoading] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [passwordErrors, setPasswordErrors] = useState({})
  const [changingPassword, setChangingPassword] = useState(false)
  const fileInputRef = useRef(null)

  const { success, error } = useToast()
  const { user, updateUser } = useAuth()

  useEffect(() => {
    fetchProfile()
  }, [])

  useEffect(() => {
    if (profileData.avatar) {
      setAvatarPreview(profileData.avatar)
    }
  }, [profileData.avatar])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const response = await profileService.getProfile()
      if (response.success) {
        setProfileData({
          firstName: response.data.firstName || '',
          lastName: response.data.lastName || '',
          phone: response.data.phone || '',
          dateOfBirth: response.data.dateOfBirth || '',
          gender: response.data.gender || '',
          avatar: response.data.avatar || ''
        })
      } else {
        error(response.message || 'Failed to fetch profile')
      }
    } catch (err) {
      console.error('Error fetching profile:', err)
      error('Failed to fetch profile')
    } finally {
      setLoading(false)
    }
  }

  const handleEditClick = () => {
    setIsEditing(true)
    setErrors({})
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    fetchProfile() // Reload original data
    setErrors({})
    setAvatarPreview(profileData.avatar || '')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!profileData.firstName?.trim()) {
      newErrors.firstName = 'First name is required'
    }
    if (!profileData.lastName?.trim()) {
      newErrors.lastName = 'Last name is required'
    }
    if (profileData.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(profileData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number'
    }
    if (profileData.dateOfBirth) {
      const birthDate = new Date(profileData.dateOfBirth)
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
    if (!validateForm()) {
      return
    }

    try {
      setSaving(true)
      const response = await profileService.updateProfile({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        phone: profileData.phone,
        dateOfBirth: profileData.dateOfBirth,
        gender: profileData.gender
      })
      
      if (response.success) {
        setProfileData(prev => ({
          ...prev,
          firstName: response.data.firstName || prev.firstName,
          lastName: response.data.lastName || prev.lastName,
          phone: response.data.phone || prev.phone,
          dateOfBirth: response.data.dateOfBirth || prev.dateOfBirth,
          gender: response.data.gender || prev.gender
        }))
        success('Profile updated successfully')
        setIsEditing(false)
        setErrors({})

        // Update auth context
        if (updateUser && response.data) {
          updateUser(response.data)
        }
      } else {
        error(response.message || 'Failed to update profile')
      }
    } catch (err) {
      console.error('Error updating profile:', err)
      error('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      error('Please select a valid image file (JPEG, PNG, GIF)')
      return
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      error('File size must be less than 5MB')
      return
    }

    setAvatarLoading(true)
    
    try {
      // Create preview
      const previewUrl = URL.createObjectURL(file)
      setAvatarPreview(previewUrl)

      // Convert to base64 for upload
      const reader = new FileReader()
      reader.onload = async (event) => {
        const base64 = event.target.result
        
        const response = await profileService.uploadAvatar(base64)
        
        if (response.success) {
          setProfileData(prev => ({
            ...prev,
            avatar: response.data.avatar || prev.avatar
          }))
          success('Profile picture updated successfully')
          
          // Update auth context
          if (updateUser && response.data) {
            updateUser(response.data)
          }
        } else {
          error(response.message || 'Failed to update profile picture')
          setAvatarPreview(profileData.avatar || '')
        }
        
        setAvatarLoading(false)
      }
      reader.readAsDataURL(file)
    } catch (err) {
      console.error('Error uploading avatar:', err)
      error('Failed to upload profile picture')
      setAvatarPreview(profileData.avatar || '')
      setAvatarLoading(false)
    }
  }

  const handleAvatarDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your profile picture?')) {
      return
    }

    try {
      setAvatarLoading(true)
      const response = await profileService.deleteAvatar()
      
      if (response.success) {
        setProfileData(prev => ({
          ...prev,
          avatar: ''
        }))
        setAvatarPreview('')
        success('Profile picture deleted successfully')
        
        // Update auth context
        if (updateUser && response.data) {
          updateUser(response.data)
        }
      } else {
        error(response.message || 'Failed to delete profile picture')
      }
    } catch (err) {
      console.error('Error deleting avatar:', err)
      error('Failed to delete profile picture')
    } finally {
      setAvatarLoading(false)
    }
  }

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (passwordErrors[field]) {
      setPasswordErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validatePasswordForm = () => {
    const newErrors = {}
    
    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required'
    }
    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required'
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters'
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    
    setPasswordErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
    
  const handleChangePassword = async () => {
    if (!validatePasswordForm()) {
      return
    }

    try {
      setChangingPassword(true)
      const response = await profileService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      })
      
      if (response.success) {
        success('Password changed successfully')
        setShowPasswordModal(false)
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
        setPasswordErrors({})
      } else {
        error(response.message || 'Failed to change password')
      }
    } catch (err) {
      console.error('Error changing password:', err)
      error('Failed to change password')
    } finally {
      setChangingPassword(false)
    }
  }

  const handleClosePasswordModal = () => {
    setShowPasswordModal(false)
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
    setPasswordErrors({})
  }

  if (loading) {
    return (
      <Container fluid>
        <Row>
          <Col xs={12}>
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
              <Spinner animation="border" variant="success" />
            </div>
          </Col>
        </Row>
      </Container>
    )
  }

  return (
    <Container fluid>
      <Row>
        <Col xs={12}>
          {/* Page Header */}
          <div className="d-flex align-items-center mb-4 pb-3 border-bottom">
            <h2 className="mb-0 text-dark">My Profile</h2>
            {!isEditing && (
              <div className="ms-auto d-flex gap-2">
                <Button variant="outline-warning" onClick={() => setShowPasswordModal(true)}>
                  <FontAwesomeIcon icon={faLock} className="me-2" />
                  Change Password
                </Button>
                <Button variant="success" onClick={handleEditClick}>
                  <FontAwesomeIcon icon={faUser} className="me-2" />
                  Edit Profile
                </Button>
              </div>
            )}
          </div>

          {/* Main Content Container */}
          <div className="bg-white rounded-3 shadow-sm p-4">
                {/* Profile Picture Section */}
            <div className="mb-5">
              <div className="d-flex align-items-center mb-4 pb-3 border-bottom border-success border-2">
                <FontAwesomeIcon icon={faUser} className="me-3 text-success fs-4" />
                <h4 className="mb-0 text-success">Profile Picture</h4>
              </div>
              
              <Row>
                <Col md={4}>
                  <div className="d-flex flex-column align-items-center">
                    {avatarPreview ? (
                      <Image
                        src={avatarPreview}
                        alt="Profile"
                        className="rounded-circle mb-3"
                        style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                      />
                    ) : (
                      <div 
                        className="rounded-circle bg-secondary d-flex align-items-center justify-content-center mb-3"
                        style={{ width: '150px', height: '150px' }}
                      >
                        <FontAwesomeIcon icon={faUser} size="3x" className="text-white" />
                      </div>
                    )}
                    
                    {isEditing && (
                      <div className="d-flex gap-2">
                        <Button
                          variant="outline-success"
                          size="sm"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={avatarLoading}
                        >
                          <FontAwesomeIcon icon={faUpload} className="me-2" />
                          {avatarLoading ? 'Uploading...' : 'Upload'}
                        </Button>
                        {avatarPreview && (
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={handleAvatarDelete}
                            disabled={avatarLoading}
                          >
                            <FontAwesomeIcon icon={faTrash} className="me-2" />
                            Delete
                          </Button>
                        )}
                      </div>
                    )}
                    
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/gif"
                      onChange={handleAvatarChange}
                      style={{ display: 'none' }}
                    />
                    
                    {isEditing && (
                      <Form.Text className="text-muted mt-2 text-center">
                        JPEG, PNG, GIF. Max size 5MB
                      </Form.Text>
                    )}
                  </div>
                </Col>
              </Row>
            </div>

            {/* Basic Information Section */}
            <div className="mb-5">
              <div className="d-flex align-items-center mb-4 pb-3 border-bottom border-success border-2">
                <FontAwesomeIcon icon={faUser} className="me-3 text-success fs-4" />
                <h4 className="mb-0 text-success">Basic Information</h4>
              </div>
              
              {isEditing ? (
                <Form>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">
                          First Name <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          value={profileData.firstName}
                          onChange={(e) => handleChange('firstName', e.target.value)}
                          isInvalid={!!errors.firstName}
                          className="border-2"
                          placeholder="Enter first name"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.firstName}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">
                          Last Name <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          value={profileData.lastName}
                          onChange={(e) => handleChange('lastName', e.target.value)}
                          isInvalid={!!errors.lastName}
                          className="border-2"
                          placeholder="Enter last name"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.lastName}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Phone Number</Form.Label>
                        <Form.Control
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => handleChange('phone', e.target.value)}
                          isInvalid={!!errors.phone}
                          className="border-2"
                          placeholder="Enter phone number"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.phone}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Date of Birth</Form.Label>
                        <Form.Control
                          type="date"
                          value={profileData.dateOfBirth}
                          onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                          isInvalid={!!errors.dateOfBirth}
                          className="border-2"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.dateOfBirth}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Gender</Form.Label>
                        <Form.Select
                          value={profileData.gender}
                          onChange={(e) => handleChange('gender', e.target.value)}
                          className="border-2"
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <div className="d-flex gap-2 justify-content-end mt-4">
                    <Button
                      variant="outline-secondary"
                      onClick={handleCancelEdit}
                      disabled={saving}
                    >
                      <FontAwesomeIcon icon={faX} className="me-2" />
                      Cancel
                    </Button>
                    <Button
                      variant="success"
                      onClick={handleSave}
                      disabled={saving}
                    >
                      {saving ? (
                        <>
                          <Spinner size="sm" className="me-2" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <FontAwesomeIcon icon={faSave} className="me-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </Form>
              ) : (
                <Row>
                  <Col md={6}>
                    <div className="mb-3">
                      <strong>First Name:</strong>
                      <p className="text-muted mb-0">{profileData.firstName || 'Not provided'}</p>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="mb-3">
                      <strong>Last Name:</strong>
                      <p className="text-muted mb-0">{profileData.lastName || 'Not provided'}</p>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="mb-3">
                      <strong>Phone Number:</strong>
                      <p className="text-muted mb-0">{profileData.phone || 'Not provided'}</p>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="mb-3">
                      <strong>Date of Birth:</strong>
                      <p className="text-muted mb-0">
                        {profileData.dateOfBirth 
                          ? new Date(profileData.dateOfBirth).toLocaleDateString()
                          : 'Not provided'}
                      </p>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="mb-3">
                      <strong>Gender:</strong>
                      <p className="text-muted mb-0">
                        {profileData.gender 
                          ? profileData.gender.charAt(0).toUpperCase() + profileData.gender.slice(1)
                          : 'Not provided'}
                      </p>
                    </div>
                  </Col>
                </Row>
              )}
            </div>
          </div>
        </Col>
      </Row>

      {/* Change Password Modal */}
      <Modal show={showPasswordModal} onHide={handleClosePasswordModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <FontAwesomeIcon icon={faLock} className="me-2" />
            Change Password
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">
            Current Password <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
            type="password"
            value={passwordData.currentPassword}
            onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                isInvalid={!!passwordErrors.currentPassword}
                className="border-2"
            placeholder="Enter current password"
          />
              <Form.Control.Feedback type="invalid">
              {passwordErrors.currentPassword}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">
            New Password <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
            type="password"
            value={passwordData.newPassword}
            onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                isInvalid={!!passwordErrors.newPassword}
                className="border-2"
            placeholder="Enter new password"
          />
              <Form.Control.Feedback type="invalid">
              {passwordErrors.newPassword}
              </Form.Control.Feedback>
              <Form.Text className="text-muted">
                Password must be at least 6 characters long
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">
            Confirm New Password <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
            type="password"
            value={passwordData.confirmPassword}
            onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                isInvalid={!!passwordErrors.confirmPassword}
                className="border-2"
            placeholder="Confirm new password"
          />
              <Form.Control.Feedback type="invalid">
              {passwordErrors.confirmPassword}
              </Form.Control.Feedback>
            </Form.Group>

            <Alert variant="info" className="mt-3">
              <FontAwesomeIcon icon={faLock} className="me-2" />
          <strong>Security Tip:</strong> Use a strong password with a mix of letters, numbers, and special characters.
            </Alert>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleClosePasswordModal} disabled={changingPassword}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleChangePassword} disabled={changingPassword}>
            {changingPassword ? (
              <>
                <Spinner size="sm" className="me-2" />
                Changing...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faLock} className="me-2" />
                Change Password
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default Profile
