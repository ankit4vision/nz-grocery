import React, { useState } from 'react';
import { Card, Form, Alert, InputGroup, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faSpinner, faSave, faCheck, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import UsersService from '../../services/api/users';
import '../../styles/components/ui-components/change-password.css';

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters long';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (formData.currentPassword === formData.newPassword) {
      newErrors.newPassword = 'New password must be different from current password';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setSuccessMessage('');
    setErrors({});

    try {
      const response = await UsersService.changePassword({
        current_password: formData.currentPassword,
        new_password: formData.newPassword,
      });

      if (response.success) {
        setSuccessMessage(response.message || 'Password updated successfully!');
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        setErrors({ submit: response.message || 'Failed to update password. Please try again.' });
      }
    } catch (error) {
      setErrors({ submit: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="change-password">
      <div className="password-header">
        <h2 className="password-title">Change Password</h2>
        <p className="password-subtitle">Update your account password for enhanced security</p>
      </div>

      <Card className="password-form-card">
        <Card.Body>
          {successMessage && (
            <Alert variant="success" className="success-alert">
              <FontAwesomeIcon icon={faCheck} className="me-2" />
              {successMessage}
            </Alert>
          )}

          {errors.submit && (
            <Alert variant="danger" className="error-alert">
              <FontAwesomeIcon icon={faExclamationCircle} className="me-2" />
              {errors.submit}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="currentPassword">
              <Form.Label>Current Password</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showPasswords.current ? 'text' : 'password'}
                  value={formData.currentPassword}
                  onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                  placeholder="Enter your current password"
                  isInvalid={!!errors.currentPassword}
                  required
                />
                <InputGroup.Text 
                  as="button"
                  type="button"
                  onClick={() => togglePasswordVisibility('current')}
                  className="password-toggle-btn"
                >
                  <FontAwesomeIcon icon={showPasswords.current ? faEyeSlash : faEye} />
                </InputGroup.Text>
              </InputGroup>
              {errors.currentPassword && (
                <Form.Control.Feedback type="invalid">
                  {errors.currentPassword}
                </Form.Control.Feedback>
              )}
            </Form.Group>

            <Form.Group className="mb-3" controlId="newPassword">
              <Form.Label>New Password</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showPasswords.new ? 'text' : 'password'}
                  value={formData.newPassword}
                  onChange={(e) => handleInputChange('newPassword', e.target.value)}
                  placeholder="Enter your new password"
                  isInvalid={!!errors.newPassword}
                  required
                />
                <InputGroup.Text 
                  as="button"
                  type="button"
                  onClick={() => togglePasswordVisibility('new')}
                  className="password-toggle-btn"
                >
                  <FontAwesomeIcon icon={showPasswords.new ? faEyeSlash : faEye} />
                </InputGroup.Text>
              </InputGroup>
              {errors.newPassword && (
                <Form.Control.Feedback type="invalid">
                  {errors.newPassword}
                </Form.Control.Feedback>
              )}
            </Form.Group>

            <Form.Group className="mb-3" controlId="confirmPassword">
              <Form.Label>Confirm New Password</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showPasswords.confirm ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  placeholder="Confirm your new password"
                  isInvalid={!!errors.confirmPassword}
                  required
                />
                <InputGroup.Text 
                  as="button"
                  type="button"
                  onClick={() => togglePasswordVisibility('confirm')}
                  className="password-toggle-btn"
                >
                  <FontAwesomeIcon icon={showPasswords.confirm ? faEyeSlash : faEye} />
                </InputGroup.Text>
              </InputGroup>
              {errors.confirmPassword && (
                <Form.Control.Feedback type="invalid">
                  {errors.confirmPassword}
                </Form.Control.Feedback>
              )}
            </Form.Group>

            <div className="password-actions">
              <Button
                type="submit"
                variant="success"
                size="lg"
                disabled={isLoading}
                className="update-password-btn"
              >
                {isLoading ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} className="fa-spin me-2" />
                    Updating...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faSave} className="me-2" />
                    Update Password
                  </>
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ChangePassword;
