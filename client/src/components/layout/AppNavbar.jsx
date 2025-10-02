import React from 'react';
import { Navbar, Nav, Container, Form, InputGroup, NavDropdown, Button, Badge } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { FaSearch, FaShoppingCart, FaUser } from 'react-icons/fa';
import { useCartContext, useUserContext } from '../../context';
import UserProfileDropdown from './UserProfileDropdown';
import logoImage from '../../assets/logo/logo-transprant.png';
import '../../styles/components/navigation/app-navbar.css';

const AppNavbar = ({ 
  brand = 'Farm Fridge',
  navItems = [],
  className = '',
  onBrowseProductsClick,
  onCartClick,
  onLogout,
  userPoints = 0,
  ...props 
}) => {
  const { totalItems } = useCartContext();
  const { isAuthenticated, user, logout } = useUserContext();
  
  const navbarClasses = [
    'app-navbar',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className="app-navbar-container">
      {/* Top Row: Logo, Search, Actions */}
      <div className="app-navbar__top-row">
        <Container>
          <div className="app-navbar__top-content">
            {/* Logo */}
            <LinkContainer to="/">
              <div className="app-navbar__logo">
                <img 
                  src={logoImage} 
                  alt="Farm Fridge Logo" 
                  className="app-navbar__logo-image"
                />
              </div>
            </LinkContainer>
            
            {/* Search */}
            <div className="app-navbar__search-section">
              <Form className="app-navbar__search-form">
                <InputGroup className="app-navbar__search-group">
                  <Form.Control 
                    type="text" 
                    placeholder="Search products..." 
                    className="app-navbar__search-input"
                  />
                  <Button 
                    variant="outline-secondary" 
                    className="app-navbar__search-btn"
                    type="submit"
                  >
                    <FaSearch className="app-navbar__search-icon" />
                  </Button>
                </InputGroup>
              </Form>
            </div>
            
            {/* Actions */}
            <div className="app-navbar__actions">
              <Nav.Link 
                className="app-navbar__cart"
                onClick={onCartClick}
                style={{ cursor: 'pointer' }}
              >
                <div className="app-navbar__cart-container">
                  <FaShoppingCart className="app-navbar__cart-icon" />
                  {totalItems > 0 && (
                    <Badge 
                      bg="danger" 
                      className="app-navbar__cart-badge"
                    >
                      {totalItems}
                    </Badge>
                  )}
                </div>
              </Nav.Link>
              
              {/* User Profile Dropdown */}
              <UserProfileDropdown 
                onLogout={logout}
                isAuthenticated={isAuthenticated}
                user={user}
              />
              
            </div>
          </div>
        </Container>
      </div>

      {/* Bottom Row: Navigation */}
      <Navbar expand="lg" className={navbarClasses} {...props}>
        <Container>
          <Navbar.Toggle aria-controls="basic-navbar-nav" className="app-navbar__toggle" />
          
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="app-navbar__nav">
              {/* Browse Products - Toggle Sidebar */}
              <Nav.Link 
                className="app-navbar__link"
                onClick={onBrowseProductsClick}
                style={{ cursor: 'pointer' }}
              >
                Browse products
              </Nav.Link>

              {/* Specials & Catalogue Dropdown */}
              <NavDropdown title="Specials & catalogue" id="specials-dropdown" className="app-navbar__dropdown">
                <NavDropdown.Item href="/weekly-specials">Weekly Specials</NavDropdown.Item>
                <NavDropdown.Item href="/catalogue">Digital Catalogue</NavDropdown.Item>
                <NavDropdown.Item href="/clearance">Clearance Items</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="/seasonal-offers">Seasonal Offers</NavDropdown.Item>
              </NavDropdown>

              {/* Recipes & Ideas Dropdown */}
              <NavDropdown title="Recipes & Ideas" id="recipes-dropdown" className="app-navbar__dropdown">
                <NavDropdown.Item href="/quick-recipes">Quick Recipes</NavDropdown.Item>
                <NavDropdown.Item href="/healthy-meals">Healthy Meals</NavDropdown.Item>
                <NavDropdown.Item href="/family-dinners">Family Dinners</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="/cooking-tips">Cooking Tips</NavDropdown.Item>
                <NavDropdown.Item href="/meal-planning">Meal Planning</NavDropdown.Item>
              </NavDropdown>

              {/* Get More Value Dropdown */}
              <NavDropdown title="Get more value" id="value-dropdown" className="app-navbar__dropdown">
                <NavDropdown.Item href="/loyalty-program">Loyalty Program</NavDropdown.Item>
                <NavDropdown.Item href="/bulk-buying">Bulk Buying</NavDropdown.Item>
                <NavDropdown.Item href="/coupons">Digital Coupons</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="/price-match">Price Match</NavDropdown.Item>
                <NavDropdown.Item href="/rewards">Rewards</NavDropdown.Item>
              </NavDropdown>

              {/* Ways to Shop Dropdown */}
              <NavDropdown title="Ways to Shop" id="shop-dropdown" className="app-navbar__dropdown">
                <NavDropdown.Item href="/online-shopping">Online Shopping</NavDropdown.Item>
                <NavDropdown.Item href="/click-collect">Click & Collect</NavDropdown.Item>
                <NavDropdown.Item href="/home-delivery">Home Delivery</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="/store-locator">Store Locator</NavDropdown.Item>
                <NavDropdown.Item href="/mobile-app">Mobile App</NavDropdown.Item>
              </NavDropdown>

              {/* Help Dropdown */}
              <NavDropdown title="Help" id="help-dropdown" className="app-navbar__dropdown">
                <NavDropdown.Item href="/contact-us">Contact Us</NavDropdown.Item>
                <NavDropdown.Item href="/faq">FAQ</NavDropdown.Item>
                <NavDropdown.Item href="/live-chat">Live Chat</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="/track-order">Track Order</NavDropdown.Item>
                <NavDropdown.Item href="/returns">Returns & Exchanges</NavDropdown.Item>
                <NavDropdown.Item href="/feedback">Feedback</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default AppNavbar;
