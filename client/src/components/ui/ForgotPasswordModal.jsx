import React, { useState } from 'react';
import { Modal, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { FaTimes, FaArrowLeft } from 'react-icons/fa';
import { useUserContext } from '../../context';
import { CustomButton } from '../common';
import '../../styles/components/ui-components/auth-modal.css';

const ForgotPasswordModal = ({ show, onHide, onSwitchToLogin }) => {
  const { sendOTP, verifyOTP, resetPassword, isLoading, error, clearError } = useUserContext();
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    password: '',
    confirmPassword: ''
  });
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [validationErrors, setValidationErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear general error
    if (error) {
      clearError();
    }
  };

  const validateEmail = () => {
    const errors = {};
    
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateOTP = () => {
    const errors = {};
    
    if (!formData.otp) {
      errors.otp = 'OTP is required';
    } else if (formData.otp.length !== 6) {
      errors.otp = 'OTP must be 6 digits';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePassword = () => {
    const errors = {};
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    
    if (!validateEmail()) {
      return;
    }
    
    try {
      await sendOTP(formData.email);
      
      setStep(2);
      setSuccessMessage('OTP sent to your email address');
    } catch (error) {
      console.error('Send OTP error:', error);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    
    if (!validateOTP()) {
      return;
    }
    
    try {
      await verifyOTP(formData.email, formData.otp);
      
      setStep(3);
      setSuccessMessage('OTP verified successfully');
    } catch (error) {
      console.error('Verify OTP error:', error);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (!validatePassword()) {
      return;
    }
    
    try {
      await resetPassword(formData.email, formData.otp, formData.password);
      
      setSuccessMessage('Password reset successfully! You can now login with your new password.');
      setTimeout(() => {
        onSwitchToLogin();
      }, 2000);
    } catch (error) {
      console.error('Reset password error:', error);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setValidationErrors({});
      setSuccessMessage('');
    }
  };

  const handleClose = () => {
    setFormData({
      email: '',
      otp: '',
      password: '',
      confirmPassword: ''
    });
    setStep(1);
    setValidationErrors({});
    setSuccessMessage('');
    clearError();
    onHide();
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <Form onSubmit={handleSendOTP} className="auth-modal__form">
            <Row>
              <Col md={8} className="mx-auto">
                <div className="auth-modal__step-title">
                  <h3>Reset Password</h3>
                  <p>Enter your email address and we'll send you an OTP to reset your password.</p>
                </div>
                
                <Form.Group className="auth-modal__form-group">
                  <Form.Label className="auth-modal__label">
                    E-mail or Phone
                  </Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Enter your email or phone number"
                    value={formData.email}
                    onChange={handleInputChange}
                    isInvalid={!!validationErrors.email}
                    className="auth-modal__input"
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.email}
                  </Form.Control.Feedback>
                </Form.Group>
                
                {error && (
                  <Alert variant="danger" className="auth-modal__error">
                    {error}
                  </Alert>
                )}
                
                {successMessage && (
                  <Alert variant="success" className="auth-modal__success">
                    {successMessage}
                  </Alert>
                )}
                
                <CustomButton
                  type="submit"
                  variant="success"
                  size="lg"
                  className="auth-modal__submit-btn"
                  disabled={isLoading}
                  loading={isLoading}
                >
                  {isLoading ? 'Sending...' : 'Send OTP'}
                </CustomButton>
              </Col>
            </Row>
          </Form>
        );
        
      case 2:
        return (
          <Form onSubmit={handleVerifyOTP} className="auth-modal__form">
            <Row>
              <Col md={8} className="mx-auto">
                <div className="auth-modal__step-title">
                  <h3>Verify OTP</h3>
                  <p>Enter the 6-digit OTP sent to {formData.email}</p>
                </div>
                
                <Form.Group className="auth-modal__form-group">
                  <Form.Label className="auth-modal__label">
                    OTP
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="otp"
                    placeholder="Enter 6-digit OTP"
                    value={formData.otp}
                    onChange={handleInputChange}
                    isInvalid={!!validationErrors.otp}
                    className="auth-modal__input"
                    maxLength={6}
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.otp}
                  </Form.Control.Feedback>
                </Form.Group>
                
                {error && (
                  <Alert variant="danger" className="auth-modal__error">
                    {error}
                  </Alert>
                )}
                
                {successMessage && (
                  <Alert variant="success" className="auth-modal__success">
                    {successMessage}
                  </Alert>
                )}
                
                <CustomButton
                  type="submit"
                  variant="success"
                  size="lg"
                  className="auth-modal__submit-btn"
                  disabled={isLoading}
                  loading={isLoading}
                >
                  {isLoading ? 'Verifying...' : 'Verify OTP'}
                </CustomButton>
                
                <div className="auth-modal__resend">
                  <span>Didn't receive OTP? </span>
                  <Button variant="link" className="auth-modal__resend-link">
                    Resend OTP
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        );
        
      case 3:
        return (
          <Form onSubmit={handleResetPassword} className="auth-modal__form">
            <Row>
              <Col md={8} className="mx-auto">
                <div className="auth-modal__step-title">
                  <h3>New Password</h3>
                  <p>Enter your new password</p>
                </div>
                
                <Form.Group className="auth-modal__form-group">
                  <Form.Label className="auth-modal__label">
                    Password
                  </Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Enter new password"
                    value={formData.password}
                    onChange={handleInputChange}
                    isInvalid={!!validationErrors.password}
                    className="auth-modal__input"
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.password}
                  </Form.Control.Feedback>
                </Form.Group>
                
                <Form.Group className="auth-modal__form-group">
                  <Form.Label className="auth-modal__label">
                    Confirm Password
                  </Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm new password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    isInvalid={!!validationErrors.confirmPassword}
                    className="auth-modal__input"
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.confirmPassword}
                  </Form.Control.Feedback>
                </Form.Group>
                
                {error && (
                  <Alert variant="danger" className="auth-modal__error">
                    {error}
                  </Alert>
                )}
                
                {successMessage && (
                  <Alert variant="success" className="auth-modal__success">
                    {successMessage}
                  </Alert>
                )}
                
                <CustomButton
                  type="submit"
                  variant="success"
                  size="lg"
                  className="auth-modal__submit-btn"
                  disabled={isLoading}
                  loading={isLoading}
                >
                  {isLoading ? 'Resetting...' : 'Reset Password'}
                </CustomButton>
              </Col>
            </Row>
          </Form>
        );
        
      default:
        return null;
    }
  };

  return (
    <Modal 
      show={show} 
      onHide={handleClose}
      centered
      size="lg"
      className="auth-modal"
    >
      <Modal.Header className="auth-modal__header">
        <div className="auth-modal__logo">
          <span className="auth-modal__logo-text">Farm</span>
          <span className="auth-modal__logo-icon">🛒</span>
          <span className="auth-modal__logo-text">Fridge</span>
        </div>
        <Button 
          variant="link" 
          className="auth-modal__close-btn"
          onClick={handleClose}
        >
          <FaTimes />
        </Button>
      </Modal.Header>
      
      <Modal.Body className="auth-modal__body">
        {step > 1 && (
          <Button 
            variant="link" 
            className="auth-modal__back-btn"
            onClick={handleBack}
          >
            <FaArrowLeft /> Back
          </Button>
        )}
        
        {renderStepContent()}
        
        {/* Login Link */}
        <div className="auth-modal__switch">
          <span>Remember your password? </span>
          <Button 
            variant="link" 
            className="auth-modal__switch-link"
            onClick={onSwitchToLogin}
          >
            Login
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ForgotPasswordModal;
