import React, { useState } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import { FaTimes } from 'react-icons/fa';
import { useUserContext } from '../../context/UserContext';
import { CustomButton } from '../common';
import logoImage from '../../assets/logo/logo-transprant.png';
import '../../styles/components/ui-components/auth-modal.css';

const SignupModal = ({ show, onHide, onSwitchToLogin }) => {
  const { signup, isLoading, error, clearError } = useUserContext();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  const [validationErrors, setValidationErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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

  const validateForm = () => {
    const errors = {};
    
    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }
    
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.mobile) {
      errors.mobile = 'Mobile number is required';
    } else if (!/^\+?[\d\s-()]+$/.test(formData.mobile)) {
      errors.mobile = 'Please enter a valid mobile number';
    }
    
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
    
    if (!formData.agreeToTerms) {
      errors.agreeToTerms = 'You must agree to the terms and conditions';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.mobile, // Map mobile to phone for API
        password: formData.password
      };
      
      const result = await signup(userData);
      
      // Only show success and switch to login if signup was successful
      if (result && result.success) {
        // Show success message and switch to login
        alert('Account created successfully! Please login with your credentials.');
        onSwitchToLogin();
      }
      // Error is already handled by UserContext and displayed in the modal
    } catch (error) {
      // Error handling is done in UserContext, but catch here to prevent unhandled promise rejection
      console.error('Signup error:', error);
    }
  };

  const handleClose = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      mobile: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false
    });
    setValidationErrors({});
    clearError();
    onHide();
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
        <Button 
          variant="link" 
          className="auth-modal__close-btn"
          onClick={handleClose}
        >
          <FaTimes />
        </Button>
      </Modal.Header>
      
      <Modal.Body className="auth-modal__body">
        {/* Logo */}
        <div className="auth-modal__logo-container">
          <img 
            src={logoImage} 
            alt="Farm 2 Fridge Logo" 
            className="auth-modal__logo-image"
          />
        </div>
        
        {/* Title */}
        <div className="auth-modal__title">
          <h2>Create Account</h2>
          <p className="auth-modal__subtitle">Join Farm 2 Fridge and start shopping fresh groceries</p>
        </div>
        
        <Form onSubmit={handleSubmit} className="auth-modal__form">
          <Row>
            <Col md={10} className="mx-auto">
              {/* Name Fields */}
              <Row>
                <Col md={6}>
                  <Form.Group className="auth-modal__form-group">
                    <Form.Label className="auth-modal__label">
                      First Name <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="firstName"
                      placeholder="Enter"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      isInvalid={!!validationErrors.firstName}
                      className="auth-modal__input"
                    />
                    <Form.Control.Feedback type="invalid">
                      {validationErrors.firstName}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="auth-modal__form-group">
                    <Form.Label className="auth-modal__label">
                      Last Name <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="lastName"
                      placeholder="Enter"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      isInvalid={!!validationErrors.lastName}
                      className="auth-modal__input"
                    />
                    <Form.Control.Feedback type="invalid">
                      {validationErrors.lastName}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              
              {/* Email Field */}
              <Form.Group className="auth-modal__form-group">
                <Form.Label className="auth-modal__label">
                  E-mail <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Enter mail"
                  value={formData.email}
                  onChange={handleInputChange}
                  isInvalid={!!validationErrors.email}
                  className="auth-modal__input"
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.email}
                </Form.Control.Feedback>
              </Form.Group>
              
              {/* Mobile Field */}
              <Form.Group className="auth-modal__form-group">
                <Form.Label className="auth-modal__label">
                  Mobile <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="tel"
                  name="mobile"
                  placeholder="Enter Mobile Number"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  isInvalid={!!validationErrors.mobile}
                  className="auth-modal__input"
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.mobile}
                </Form.Control.Feedback>
              </Form.Group>
              
              {/* Password Field */}
              <Form.Group className="auth-modal__form-group">
                <Form.Label className="auth-modal__label">
                  Password <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Enter Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  isInvalid={!!validationErrors.password}
                  className="auth-modal__input"
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.password}
                </Form.Control.Feedback>
              </Form.Group>
              
              {/* Confirm Password Field */}
              <Form.Group className="auth-modal__form-group">
                <Form.Label className="auth-modal__label">
                  Confirm Password <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  isInvalid={!!validationErrors.confirmPassword}
                  className="auth-modal__input"
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.confirmPassword}
                </Form.Control.Feedback>
              </Form.Group>
              
              {/* Terms and Conditions */}
              <Form.Group className="auth-modal__form-group">
                <Form.Check
                  type="checkbox"
                  id="agreeToTerms"
                  name="agreeToTerms"
                  label={
                    <span>
                      I agree to the{' '}
                      <a href="/terms" target="_blank" rel="noopener noreferrer">
                        Terms and Conditions
                      </a>{' '}
                      and{' '}
                      <a href="/privacy" target="_blank" rel="noopener noreferrer">
                        Privacy Policy
                      </a>
                    </span>
                  }
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  isInvalid={!!validationErrors.agreeToTerms}
                  className="auth-modal__checkbox"
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.agreeToTerms}
                </Form.Control.Feedback>
              </Form.Group>
              
              {/* Error Message */}
              {error && (
                <div className="auth-modal__error">
                  {error}
                </div>
              )}
              
              {/* Signup Button */}
              <CustomButton
                type="submit"
                variant="success"
                size="lg"
                className="auth-modal__submit-btn"
                disabled={isLoading}
                loading={isLoading}
              >
                {isLoading ? 'Creating Account...' : 'Signup'}
              </CustomButton>
              
              {/* Login Link */}
              <div className="auth-modal__switch">
                <span>Have an account? </span>
                <Button 
                  variant="link" 
                  className="auth-modal__switch-link"
                  onClick={onSwitchToLogin}
                >
                  Signin
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default SignupModal;
