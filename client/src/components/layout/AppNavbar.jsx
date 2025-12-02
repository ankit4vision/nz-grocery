import React, { useState, useEffect, useRef } from 'react';
import { Navbar, Nav, Container, Form, Badge, Spinner } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaAlignJustify } from 'react-icons/fa';
import { useCartContext, useUserContext } from '../../context';
import UserProfileDropdown from './UserProfileDropdown';
import ProductsService from '../../services/api/products';
import { useDebounce } from '../../hooks/useDebounce';
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
  const { itemCount, totalItems } = useCartContext();
  const { isAuthenticated, user, logout } = useUserContext();
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  
  const navbarClasses = [
    'app-navbar',
    className
  ].filter(Boolean).join(' ');

  // Search API call when debounced query changes
  useEffect(() => {
    const performSearch = async () => {
      if (!debouncedSearchQuery || debouncedSearchQuery.trim().length < 2) {
        setSearchResults([]);
        setShowSearchDropdown(false);
        return;
      }

      setIsSearchLoading(true);
      try {
        const response = await ProductsService.getProductVariants({
          product_name: debouncedSearchQuery.trim(),
          page: 1,
          page_size: 10
        });

        if (response.success && response.data && response.data.items) {
          setSearchResults(response.data.items);
          setShowSearchDropdown(true);
        } else {
          setSearchResults([]);
          setShowSearchDropdown(false);
        }
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
        setShowSearchDropdown(false);
      } finally {
        setIsSearchLoading(false);
      }
    };

    performSearch();
  }, [debouncedSearchQuery]);

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setShowSearchDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle search result click
  const handleSearchResultClick = (variant) => {
    const productId = variant.product_id;
    if (productId) {
      navigate(`/product/${productId}`);
      setSearchQuery('');
      setSearchResults([]);
      setShowSearchDropdown(false);
    }
  };

  // Handle search form submit (optional - can navigate to products page)
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSearchResults([]);
      setShowSearchDropdown(false);
    }
  };

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
            <div className="app-navbar__search-section" ref={searchRef}>
              <Form className="app-navbar__search-form" onSubmit={handleSearchSubmit}>
                <Form.Control 
                  type="text" 
                  placeholder="Search products..." 
                  className="app-navbar__search-input"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => {
                    if (searchResults.length > 0) {
                      setShowSearchDropdown(true);
                    }
                  }}
                />
                
                {/* Search Dropdown */}
                {showSearchDropdown && (
                  <div className="app-navbar__search-dropdown" ref={dropdownRef}>
                    {isSearchLoading ? (
                      <div className="app-navbar__search-dropdown-loading">
                        <Spinner size="sm" className="me-2" />
                        <span>Searching...</span>
                      </div>
                    ) : searchResults.length > 0 ? (
                      <div className="app-navbar__search-dropdown-list">
                        {searchResults.map((variant) => {
                          const productName = variant.product_name || 'Product';
                          const variantName = variant.variant_name || '';
                          const displayName = variantName 
                            ? `${productName} - ${variantName}` 
                            : productName;
                          const price = variant.discounted_sale_price || variant.sale_price || 0;
                          const image = variant.image_url || variant.image || '/placeholder-image.jpg';
                          
                          return (
                            <div
                              key={variant.variant_id || variant.id}
                              className="app-navbar__search-dropdown-item"
                              onClick={() => handleSearchResultClick(variant)}
                            >
                              <div className="app-navbar__search-dropdown-item-image">
                                <img src={image} alt={displayName} />
                              </div>
                              <div className="app-navbar__search-dropdown-item-content">
                                <div className="app-navbar__search-dropdown-item-name">
                                  {displayName}
                                </div>
                                {price > 0 && (
                                  <div className="app-navbar__search-dropdown-item-price">
                                    ${price.toFixed(2)}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : debouncedSearchQuery.trim().length >= 2 ? (
                      <div className="app-navbar__search-dropdown-empty">
                        No products found
                      </div>
                    ) : null}
                  </div>
                )}
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
                  {itemCount > 0 && (
                    <Badge 
                      bg="danger" 
                      className="app-navbar__cart-badge"
                      title={`${itemCount} ${itemCount === 1 ? 'product' : 'products'} (${totalItems} ${totalItems === 1 ? 'item' : 'items'} total)`}
                    >
                      {itemCount}
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
          <div className="app-navbar__bottom-content">
            {/* Browse Products - Always visible on left (mobile) */}
            <Nav.Link 
              className="app-navbar__link app-navbar__browse-link app-navbar__browse-link-mobile"
              onClick={onBrowseProductsClick}
              style={{ cursor: 'pointer' }}
            >
              <FaAlignJustify className="me-2" />
              Browse Products
            </Nav.Link>

            {/* Menu Toggle - Right side (mobile) */}
            <Navbar.Toggle aria-controls="basic-navbar-nav" className="app-navbar__toggle" />
          </div>
          
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="app-navbar__nav">
              {/* Browse Products - Desktop (inside collapse) */}
              <Nav.Link 
                className="app-navbar__link app-navbar__browse-link app-navbar__browse-link-desktop"
                onClick={onBrowseProductsClick}
                style={{ cursor: 'pointer' }}
              >
                <FaAlignJustify className="me-2" />
                Browse Products
              </Nav.Link>

              {/* Products Link */}
              <LinkContainer to="/products">
                <Nav.Link className="app-navbar__link">
                  Products
                </Nav.Link>
              </LinkContainer>

              {/* About Farm2Fridge Link */}
              <LinkContainer to="/about">
                <Nav.Link className="app-navbar__link">
                  About Farm2Fridge
                </Nav.Link>
              </LinkContainer>

              {/* FAQ Link */}
              <LinkContainer to="/faq">
                <Nav.Link className="app-navbar__link">
                  FAQ
                </Nav.Link>
              </LinkContainer>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default AppNavbar;
