import React, { useState } from 'react';
import { NavDropdown, Badge } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaShoppingBag, FaSignOutAlt } from 'react-icons/fa';
import '../../styles/components/navigation/user-profile-dropdown.css';

const UserProfileDropdown = ({ userPoints = 0, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsOpen(false);
    onLogout?.();
  };

  const handleNavigation = (path) => {
    setIsOpen(false);
    navigate(path);
  };

  return (
    <NavDropdown
      title={
        <div className="user-profile-trigger">
          <FaUser className="user-profile-icon" />
        </div>
      }
      id="user-profile-dropdown"
      show={isOpen}
      onToggle={(isOpen) => setIsOpen(isOpen)}
      className="user-profile-dropdown"
      align="end"
    >
      {/* Points Section */}
      <div className="user-points-section">
        <div className="user-points-content">
          <span className="user-points-label">Points</span>
          <span className="user-points-value">{userPoints}</span>
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
