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

  // Get user name (handle both API format and frontend format)
  const getUserName = () => {
    if (!user) return 'User';
    const firstName = user.first_name || user.firstName || '';
    const lastName = user.last_name || user.lastName || '';
    return `${firstName} ${lastName}`.trim() || 'User';
  };

  // Get user initials
  const getUserInitials = () => {
    if (!user) return 'U';
    const firstName = user.first_name || user.firstName || '';
    const lastName = user.last_name || user.lastName || '';
    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    }
    if (firstName) {
      return firstName.charAt(0).toUpperCase();
    }
    return 'U';
  };

  // Get profile image URL
  const getProfileImageUrl = () => {
    return user?.profile_image_url || user?.profileImage || user?.profile_image || null;
  };

  const profileImageUrl = getProfileImageUrl();
  const userName = getUserName();
  const userInitials = getUserInitials();

  return (
    <NavDropdown
      title={
        <div className="user-profile-trigger">
          <div className="user-avatar">
            {profileImageUrl ? (
              <img 
                src={profileImageUrl} 
                alt={userName}
                className="user-avatar-image"
                onError={(e) => {
                  // Fallback to initials if image fails to load
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div 
              className="user-avatar-circle"
              style={{ display: profileImageUrl ? 'none' : 'flex' }}
            >
              {userInitials}
            </div>
          </div>
          <div className="user-info">
            <span className="user-name">
              {userName}
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
            {userName}
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
