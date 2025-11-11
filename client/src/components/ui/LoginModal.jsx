import React, { useState } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import { FaTimes } from 'react-icons/fa';
import { useUserContext } from '../../context';
import { CustomButton } from '../common';
import logoImage from '../../assets/logo/logo-transprant.png';
import '../../styles/components/ui-components/auth-modal.css';

const LoginModal = ({ show, onHide, onSwitchToSignup, onSwitchToForgotPassword }) => {
  const { login, isLoading, error, clearError } = useUserContext();
  const [formData, setFormData] = useState({
    email: 'john.doe@example.com',
    password: 'password123',
    rememberMe: false
  });
  const [loginType, setLoginType] = useState('email'); // 'email' or 'mobile'
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
    
    if (loginType === 'email') {
      if (!formData.email) {
        errors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        errors.email = 'Please enter a valid email address';
      }
    } else {
      if (!formData.email) {
        errors.email = 'Mobile number is required';
      } else if (!/^\+?[\d\s-()]+$/.test(formData.email)) {
        errors.email = 'Please enter a valid mobile number';
      }
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
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
      const credentials = {
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe
      };
      
      const result = await login(credentials);
      
      // Only close modal if login was successful
      if (result && result.success) {
        onHide(); // Close modal on successful login
      }
      // Error is already handled by UserContext and displayed in the modal
    } catch (error) {
      // Error handling is done in UserContext, but catch here to prevent unhandled promise rejection
      console.error('Login error:', error);
    }
  };

  const handleClose = () => {
    setFormData({
      email: 'john.doe@example.com',
      password: 'password123',
      rememberMe: false
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
        <div className="auth-modal__logo">
          <img 
            src={logoImage} 
            alt="Farm Fridge Logo" 
            className="auth-modal__logo-image"
          />
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
        <div className="auth-modal__title">
          <h2>Welcome To Farm 2 Fridge</h2>
        </div>
        
        <Form onSubmit={handleSubmit} className="auth-modal__form">
          <Row>
            <Col md={8} className="mx-auto">
              {/* Login Type Selection */}
              <div className="auth-modal__login-type">
                <Form.Check
                  type="radio"
                  id="email-login"
                  name="loginType"
                  label="E-mail"
                  checked={loginType === 'email'}
                  onChange={() => setLoginType('email')}
                  className="auth-modal__radio"
                />
                <Form.Check
                  type="radio"
                  id="mobile-login"
                  name="loginType"
                  label="Mobile"
                  checked={loginType === 'mobile'}
                  onChange={() => setLoginType('mobile')}
                  className="auth-modal__radio"
                />
              </div>
              
              {/* Email/Mobile Input */}
              <Form.Group className="auth-modal__form-group">
                <Form.Control
                  type={loginType === 'email' ? 'email' : 'tel'}
                  name="email"
                  placeholder={loginType === 'email' ? 'Enter Email' : 'Enter Mobile'}
                  value={formData.email}
                  onChange={handleInputChange}
                  isInvalid={!!validationErrors.email}
                  className="auth-modal__input"
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.email}
                </Form.Control.Feedback>
              </Form.Group>
              
              {/* Password Input */}
              <Form.Group className="auth-modal__form-group">
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  isInvalid={!!validationErrors.password}
                  className="auth-modal__input"
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.password}
                </Form.Control.Feedback>
              </Form.Group>
              
              {/* Remember Me */}
              <Form.Group className="auth-modal__form-group">
                <Form.Check
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  label="Remember me"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="auth-modal__checkbox"
                />
              </Form.Group>
              
              {/* Error Message */}
              {error && (
                <div className="auth-modal__error">
                  {error}
                </div>
              )}
              
              {/* Login Button */}
              <CustomButton
                type="submit"
                variant="success"
                size="lg"
                className="auth-modal__submit-btn"
                disabled={isLoading}
                loading={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </CustomButton>
              
              {/* Signup Link */}
              <div className="auth-modal__switch">
                <span>Don't have an account? </span>
                <Button 
                  variant="link" 
                  className="auth-modal__switch-link"
                  onClick={onSwitchToSignup}
                >
                  Signup
                </Button>
              </div>
              
              {/* Forgot Password Link */}
              <div className="auth-modal__forgot-password">
                <Button 
                  variant="link" 
                  className="auth-modal__forgot-link"
                  onClick={onSwitchToForgotPassword}
                >
                  Forgot Password?
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default LoginModal;
