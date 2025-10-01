import React, { useState } from 'react';
import { Card, Form, Alert } from 'react-bootstrap';
import { CustomInput, CustomButton } from '../common';
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
            <div className="password-field">
              <CustomInput
                label="Current Password"
                type={showPasswords.current ? 'text' : 'password'}
                value={formData.currentPassword}
                onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                placeholder="Enter your current password"
                error={errors.currentPassword}
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => togglePasswordVisibility('current')}
                aria-label={showPasswords.current ? 'Hide password' : 'Show password'}
              >
                <i className={`fas ${showPasswords.current ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>

            <div className="password-field">
              <CustomInput
                label="New Password"
                type={showPasswords.new ? 'text' : 'password'}
                value={formData.newPassword}
                onChange={(e) => handleInputChange('newPassword', e.target.value)}
                placeholder="Enter your new password"
                error={errors.newPassword}
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => togglePasswordVisibility('new')}
                aria-label={showPasswords.new ? 'Hide password' : 'Show password'}
              >
                <i className={`fas ${showPasswords.new ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>

            <div className="password-field">
              <CustomInput
                label="Confirm New Password"
                type={showPasswords.confirm ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                placeholder="Confirm your new password"
                error={errors.confirmPassword}
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => togglePasswordVisibility('confirm')}
                aria-label={showPasswords.confirm ? 'Hide password' : 'Show password'}
              >
                <i className={`fas ${showPasswords.confirm ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>

            <div className="password-requirements">
              <h6 className="requirements-title">Password Requirements:</h6>
              <ul className="requirements-list">
                <li className={formData.newPassword.length >= 8 ? 'valid' : ''}>
                  <i className={`fas ${formData.newPassword.length >= 8 ? 'fa-check' : 'fa-times'}`}></i>
                  At least 8 characters long
                </li>
                <li className={formData.newPassword !== formData.currentPassword ? 'valid' : ''}>
                  <i className={`fas ${formData.newPassword !== formData.currentPassword ? 'fa-check' : 'fa-times'}`}></i>
                  Different from current password
                </li>
                <li className={formData.newPassword === formData.confirmPassword && formData.confirmPassword ? 'valid' : ''}>
                  <i className={`fas ${formData.newPassword === formData.confirmPassword && formData.confirmPassword ? 'fa-check' : 'fa-times'}`}></i>
                  Passwords match
                </li>
              </ul>
            </div>

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
