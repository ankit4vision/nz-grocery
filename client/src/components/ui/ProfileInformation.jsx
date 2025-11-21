import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Card, Image, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faCheck, faExclamationCircle, faUser } from '@fortawesome/free-solid-svg-icons';
import { CustomButton } from '../common';
import UsersService from '../../services/api/users';
import { useUserContext } from '../../context';
import '../../styles/components/ui-components/profile-information.css';

const ProfileInformation = () => {
  const { user, updateProfile: updateUserContext } = useUserContext();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    date_of_birth: '',
    gender: '',
  });

  const [profileImage, setProfileImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  // Load profile on mount
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await UsersService.getProfile();
      if (response.success && response.data) {
        const profile = response.data;
        setFormData({
          first_name: profile.first_name || '',
          last_name: profile.last_name || '',
          phone: profile.phone || '',
          date_of_birth: profile.date_of_birth ? profile.date_of_birth.split('T')[0] : '',
          gender: profile.gender || '',
        });
        if (profile.profile_image_url) {
          setProfileImage(profile.profile_image_url);
        }
      } else {
        setError(response.message || 'Failed to load profile');
      }
    } catch (err) {
      setError('An error occurred while loading profile');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error for this field
    if (formErrors[field]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.match('image/(jpeg|jpg|png|gif)')) {
      setError('Please select a valid image file (JPEG, PNG, or GIF)');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    setUploadingImage(true);
    setError(null);
    setSuccessMessage('');

    try {
      const formData = new FormData();
      formData.append('image_file', file);

      const response = await UsersService.uploadProfileImage(formData);
      if (response.success && response.data) {
        setProfileImage(response.data.profile_image_url);
        setImageFile(null);
        setSuccessMessage('Profile image uploaded successfully!');
        // Update user context if available
        if (updateUserContext && response.data) {
          updateUserContext(response.data);
        }
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError(response.message || 'Failed to upload image');
      }
    } catch (err) {
      setError('An error occurred while uploading image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveChanges = async () => {
    setSaving(true);
    setError(null);
    setSuccessMessage('');
    setFormErrors({});

    try {
      // Prepare profile data (only send fields that have values)
      const profileData = {};
      if (formData.first_name.trim()) profileData.first_name = formData.first_name.trim();
      if (formData.last_name.trim()) profileData.last_name = formData.last_name.trim();
      if (formData.phone.trim()) profileData.phone = formData.phone.trim();
      if (formData.date_of_birth) profileData.date_of_birth = formData.date_of_birth;
      if (formData.gender) profileData.gender = formData.gender;

      const response = await UsersService.updateProfile(profileData);
      if (response.success) {
        setSuccessMessage(response.message || 'Profile updated successfully!');
        // Update user context
        if (updateUserContext && response.data) {
          updateUserContext(response.data);
        }
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        if (response.errors && Array.isArray(response.errors)) {
          const errors = {};
          response.errors.forEach(err => {
            if (err.loc && err.loc.length > 0) {
              const field = err.loc[err.loc.length - 1];
              errors[field] = err.msg || err.message;
            }
          });
          setFormErrors(errors);
        } else {
          setError(response.message || 'Failed to update profile');
        }
      }
    } catch (err) {
      setError('An error occurred while updating profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-information">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <div className="text-center">
            <FontAwesomeIcon icon={faSpinner} className="fa-spin fa-2x text-primary mb-3" />
            <p>Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-information">
      <div className="profile-header">
        <h2 className="profile-title">Profile Information</h2>
        <p className="profile-subtitle">Update your profile information and settings</p>
      </div>

      {successMessage && (
        <Alert variant="success" className="mb-4" dismissible onClose={() => setSuccessMessage('')}>
          <FontAwesomeIcon icon={faCheck} className="me-2" />
          {successMessage}
        </Alert>
      )}

      {error && (
        <Alert variant="danger" className="mb-4" dismissible onClose={() => setError(null)}>
          <FontAwesomeIcon icon={faExclamationCircle} className="me-2" />
          {error}
        </Alert>
      )}

      <Row className="mt-4">
        <Col lg={12}>
          <Card className="profile-info-card">
            <Card.Body>
              <h5 className="form-section-title">Profile Information</h5>
              
              <Row>
                <Col lg={4} md={6}>
                  <div className="profile-image-section">
                    <div className="profile-image-container">
                      {profileImage ? (
                        <Image src={profileImage} roundedCircle className="profile-image" />
                      ) : (
                        <div className="profile-image-placeholder">
                          <FontAwesomeIcon icon={faUser} className="fa-3x" />
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-3">
                      <input
                        type="file"
                        id="profile-image-upload"
                        accept="image/jpeg,image/png,image/gif"
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                        disabled={uploadingImage}
                      />
                      <CustomButton
                        variant="outline-primary"
                        onClick={() => document.getElementById('profile-image-upload').click()}
                        className="upload-btn"
                        disabled={uploadingImage}
                      >
                        {uploadingImage ? (
                          <>
                            <FontAwesomeIcon icon={faSpinner} className="fa-spin me-2" />
                            Uploading...
                          </>
                        ) : (
                          'Upload Photo'
                        )}
                      </CustomButton>
                      <p className="upload-info">JPG, PNG or GIF. Max size 5MB</p>
                    </div>
                  </div>
                </Col>

                <Col lg={8} md={6}>
                  <div className="personal-info-section">
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3" controlId="firstName">
                          <Form.Label>First Name</Form.Label>
                          <Form.Control
                            type="text"
                            value={formData.first_name}
                            onChange={(e) => handleInputChange('first_name', e.target.value)}
                            placeholder="Enter your first name"
                            isInvalid={!!formErrors.first_name}
                          />
                          {formErrors.first_name && (
                            <Form.Control.Feedback type="invalid">
                              {formErrors.first_name}
                            </Form.Control.Feedback>
                          )}
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3" controlId="lastName">
                          <Form.Label>Last Name</Form.Label>
                          <Form.Control
                            type="text"
                            value={formData.last_name}
                            onChange={(e) => handleInputChange('last_name', e.target.value)}
                            placeholder="Enter your last name"
                            isInvalid={!!formErrors.last_name}
                          />
                          {formErrors.last_name && (
                            <Form.Control.Feedback type="invalid">
                              {formErrors.last_name}
                            </Form.Control.Feedback>
                          )}
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3" controlId="phone">
                          <Form.Label>Phone Number</Form.Label>
                          <Form.Control
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            placeholder="Enter your phone number"
                            isInvalid={!!formErrors.phone}
                          />
                          {formErrors.phone && (
                            <Form.Control.Feedback type="invalid">
                              {formErrors.phone}
                            </Form.Control.Feedback>
                          )}
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3" controlId="dateOfBirth">
                          <Form.Label>Date of Birth</Form.Label>
                          <Form.Control
                            type="date"
                            value={formData.date_of_birth}
                            onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                            isInvalid={!!formErrors.date_of_birth}
                          />
                          {formErrors.date_of_birth && (
                            <Form.Control.Feedback type="invalid">
                              {formErrors.date_of_birth}
                            </Form.Control.Feedback>
                          )}
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mb-3" controlId="gender">
                      <Form.Label>Gender</Form.Label>
                      <Form.Select
                        value={formData.gender}
                        onChange={(e) => handleInputChange('gender', e.target.value)}
                        isInvalid={!!formErrors.gender}
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </Form.Select>
                      {formErrors.gender && (
                        <Form.Control.Feedback type="invalid">
                          {formErrors.gender}
                        </Form.Control.Feedback>
                      )}
                    </Form.Group>

                    {user?.email && (
                      <Form.Group className="mb-3">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control
                          type="email"
                          value={user.email}
                          disabled
                          className="bg-light"
                        />
                        <Form.Text className="text-muted">
                          Email cannot be changed
                        </Form.Text>
                      </Form.Group>
                    )}
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <div className="profile-actions">
        <CustomButton
          variant="success"
          size="lg"
          onClick={handleSaveChanges}
          className="save-changes-btn"
          disabled={saving}
        >
          {saving ? (
            <>
              <FontAwesomeIcon icon={faSpinner} className="fa-spin me-2" />
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </CustomButton>
      </div>
    </div>
  );
};

export default ProfileInformation;
