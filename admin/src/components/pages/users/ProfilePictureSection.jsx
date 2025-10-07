import React, { useState, useRef } from 'react'
import { CCard, CCardHeader, CCardBody, CCardTitle, CButton, CImage, CSpinner, CFormInput, CFormText, CAlert } from '@coreui/react'
import { cilUser, cilPencil, cilTrash, cilSave, cilX } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import PropTypes from 'prop-types'

const ProfilePictureSection = ({ 
  avatar, 
  onAvatarChange, 
  onAvatarDelete, 
  loading = false 
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState(avatar || '')
  const [avatarLoading, setAvatarLoading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef()

  const handleEditClick = () => {
    setIsEditing(true)
    setError('')
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setAvatarPreview(avatar || '')
    setError('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      setError('Please select a valid image file (JPEG, PNG, GIF, WebP)')
      return
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB')
      return
    }

    setAvatarLoading(true)
    setError('')
    
    try {
      // Create preview URL
      const previewUrl = URL.createObjectURL(file)
      setAvatarPreview(previewUrl)
      
      // Convert to base64 for form submission
      const reader = new FileReader()
      reader.onload = (e) => {
        const base64 = e.target.result
        setAvatarLoading(false)
        
        // Call parent callback
        if (onAvatarChange) {
          onAvatarChange(file, base64)
        }
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Error processing avatar:', error)
      setError('Error processing image')
      setAvatarLoading(false)
    }
  }

  const handleSave = () => {
    setIsEditing(false)
    setError('')
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete your profile picture?')) {
      setAvatarPreview('')
      if (onAvatarDelete) {
        onAvatarDelete()
      }
    }
  }

  return (
    <CCard>
      <CCardHeader>
        <div className="d-flex justify-content-between align-items-center w-100">
          <CCardTitle className="mb-0 d-flex align-items-center">
            <CIcon icon={cilUser} className="me-2" />
            Profile Picture
          </CCardTitle>
          {!isEditing && (
            <div className="d-flex gap-2">
              <CButton
                color="primary"
                variant="outline"
                size="sm"
                onClick={handleEditClick}
                disabled={loading}
              >
                <CIcon icon={cilPencil} className="me-1" />
                Edit Photo
              </CButton>
              {avatarPreview && (
                <CButton
                  color="danger"
                  variant="outline"
                  size="sm"
                  onClick={handleDelete}
                  disabled={loading}
                >
                  <CIcon icon={cilTrash} className="me-1" />
                  Delete Photo
                </CButton>
              )}
            </div>
          )}
        </div>
      </CCardHeader>
      <CCardBody>
        <div className="d-flex align-items-center gap-3">
          <div className="position-relative">
            {avatarPreview ? (
              <CImage
                src={avatarPreview}
                alt="Profile Avatar"
                className="rounded-circle"
                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
              />
            ) : (
              <div 
                className="rounded-circle bg-secondary d-flex align-items-center justify-content-center"
                style={{ width: '100px', height: '100px' }}
              >
                <CIcon icon={cilUser} size="xl" className="text-white" />
              </div>
            )}
            {avatarLoading && (
              <div className="position-absolute top-50 start-50 translate-middle">
                <CSpinner size="sm" />
              </div>
            )}
          </div>
          <div className="flex-grow-1">
            {isEditing ? (
              <div>
                <CFormInput
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="mb-2"
                />
                <CFormText className="text-muted mb-3">
                  JPG, PNG, GIF or WebP. Max size 5MB.
                </CFormText>
                {error && (
                  <CAlert color="danger" className="mb-3">
                    {error}
                  </CAlert>
                )}
                <div className="d-flex gap-2">
                  <CButton
                    color="primary"
                    size="sm"
                    onClick={handleSave}
                    disabled={avatarLoading}
                  >
                    <CIcon icon={cilSave} className="me-1" />
                    Save
                  </CButton>
                  <CButton
                    color="secondary"
                    variant="outline"
                    size="sm"
                    onClick={handleCancelEdit}
                    disabled={avatarLoading}
                  >
                    <CIcon icon={cilX} className="me-1" />
                    Cancel
                  </CButton>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-muted mb-0">
                  {avatarPreview ? 'Click "Edit Photo" to change your profile picture' : 'No profile picture set'}
                </p>
              </div>
            )}
          </div>
        </div>
      </CCardBody>
    </CCard>
  )
}

ProfilePictureSection.propTypes = {
  avatar: PropTypes.string,
  onAvatarChange: PropTypes.func,
  onAvatarDelete: PropTypes.func,
  loading: PropTypes.bool
}

export default ProfilePictureSection
