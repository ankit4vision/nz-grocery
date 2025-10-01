import React, { useState } from 'react';
import { Card, Form, Alert, InputGroup } from 'react-bootstrap';
import { CustomButton } from '../common';
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

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSuccessMessage('Password updated successfully!');
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      setErrors({ submit: 'Failed to update password. Please try again.' });
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
              <i className="fas fa-check-circle me-2"></i>
              {successMessage}
            </Alert>
          )}

          {errors.submit && (
            <Alert variant="danger" className="error-alert">
              <i className="fas fa-exclamation-circle me-2"></i>
              {errors.submit}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-4">
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
                  <i className={`fas ${showPasswords.current ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </InputGroup.Text>
              </InputGroup>
              {errors.currentPassword && (
                <Form.Control.Feedback type="invalid">
                  {errors.currentPassword}
                </Form.Control.Feedback>
              )}
            </Form.Group>

            <Form.Group className="mb-4">
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
                  <i className={`fas ${showPasswords.new ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </InputGroup.Text>
              </InputGroup>
              {errors.newPassword && (
                <Form.Control.Feedback type="invalid">
                  {errors.newPassword}
                </Form.Control.Feedback>
              )}
            </Form.Group>

            <Form.Group className="mb-4">
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
                  <i className={`fas ${showPasswords.confirm ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </InputGroup.Text>
              </InputGroup>
              {errors.confirmPassword && (
                <Form.Control.Feedback type="invalid">
                  {errors.confirmPassword}
                </Form.Control.Feedback>
              )}
            </Form.Group>

            <div className="password-actions">
              <CustomButton
                type="submit"
                variant="success"
                size="lg"
                disabled={isLoading}
                className="update-password-btn"
              >
                {isLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin me-2"></i>
                    Updating...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save me-2"></i>
                    Update Password
                  </>
                )}
              </CustomButton>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ChangePassword;
