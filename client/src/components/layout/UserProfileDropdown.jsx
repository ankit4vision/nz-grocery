import React, { useState } from 'react';
import { NavDropdown, Badge, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaShoppingBag, FaSignOutAlt, FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import { LoginModal, SignupModal, ForgotPasswordModal } from '../ui';
import '../../styles/components/navigation/user-profile-dropdown.css';

const UserProfileDropdown = ({ onLogout, isAuthenticated = false, user = null }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsOpen(false);
    onLogout?.();
  };

  const handleNavigation = (path) => {
    setIsOpen(false);
    navigate(path);
  };

  // If user is not authenticated, show single login button
  if (!isAuthenticated) {
    return (
      <>
        <div className="user-profile-dropdown">
          <Button 
            variant="primary" 
            size="sm"
            className="auth-btn"
            onClick={() => setShowLoginModal(true)}
          >
            <FaSignInAlt className="me-1" />
            Login
          </Button>
        </div>

        {/* Authentication Modals */}
        <LoginModal
          show={showLoginModal}
          onHide={() => setShowLoginModal(false)}
          onSwitchToSignup={() => {
            setShowLoginModal(false);
            setShowSignupModal(true);
          }}
          onSwitchToForgotPassword={() => {
            setShowLoginModal(false);
            setShowForgotPasswordModal(true);
          }}
        />

        <SignupModal
          show={showSignupModal}
          onHide={() => setShowSignupModal(false)}
          onSwitchToLogin={() => {
            setShowSignupModal(false);
            setShowLoginModal(true);
          }}
        />

        <ForgotPasswordModal
          show={showForgotPasswordModal}
          onHide={() => setShowForgotPasswordModal(false)}
          onSwitchToLogin={() => {
            setShowForgotPasswordModal(false);
            setShowLoginModal(true);
          }}
        />
      </>
    );
  }

  return (
    <NavDropdown
      title={
        <div className="user-profile-trigger">
          <div className="user-avatar">
            {user ? (
              <div className="user-avatar-circle">
                {user.firstName ? user.firstName.charAt(0).toUpperCase() : 'U'}
              </div>
            ) : (
              <FaUser className="user-profile-icon" />
            )}
          </div>
          <div className="user-info">
            <span className="user-name">
              {user ? `${user.firstName} ${user.lastName}` : 'User'}
            </span>
            <span className="user-role">
              {user?.role === 'admin' ? 'Admin' : 'Customer'}
            </span>
          </div>
        </div>
      }
      id="user-profile-dropdown"
      show={isOpen}
      onToggle={(isOpen) => setIsOpen(isOpen)}
      className="user-profile-dropdown"
      align="end"
    >
      {/* User Info Section */}
      <div className="user-info-section">
        <div className="user-info-content">
          <div className="user-name-display">
            {user ? `${user.firstName} ${user.lastName}` : 'User'}
          </div>
          <div className="user-email-display">
            {user?.email}
          </div>
        </div>
      </div>


      {/* Menu Items */}
      <NavDropdown.Item 
        className="user-dropdown-item"
        onClick={() => handleNavigation('/dashboard')}
      >
        <FaUser className="dropdown-item-icon" />
        Profile
      </NavDropdown.Item>

      <NavDropdown.Item 
        className="user-dropdown-item"
        onClick={() => handleNavigation('/dashboard?tab=orders')}
      >
        <FaShoppingBag className="dropdown-item-icon" />
        My Orders
      </NavDropdown.Item>

      <NavDropdown.Item 
        className="user-dropdown-item"
        onClick={() => handleNavigation('/dashboard?tab=wishlist')}
      >
        <span className="dropdown-item-icon">❤️</span>
        Wishlist
      </NavDropdown.Item>

      <NavDropdown.Item 
        className="user-dropdown-item"
        onClick={() => handleNavigation('/checkout')}
      >
        <span className="dropdown-item-icon">🛒</span>
        Checkout
      </NavDropdown.Item>

      <NavDropdown.Divider className="user-dropdown-divider" />

      <NavDropdown.Item 
        className="user-dropdown-item logout-item"
        onClick={handleLogout}
      >
        <FaSignOutAlt className="dropdown-item-icon" />
        Logout
      </NavDropdown.Item>
    </NavDropdown>
  );
};

export default UserProfileDropdown;
