import React, { useState } from 'react';
import AppNavbar from './AppNavbar';
import AppFooter from './AppFooter';
import BrowseSidebar from './BrowseSidebar';
import { CartSidebar } from '../ui';
import { useCartContext } from '../../context';
import '../../styles/components/layout-elements/layout-wrapper.css';

const LayoutWrapper = ({ 
  children,
  navbarProps = {},
  footerProps = {},
  className = '',
  showNavbar = true,
  showFooter = true,
  ...props 
}) => {
  const [showBrowseSidebar, setShowBrowseSidebar] = useState(false);
  const { isOpen: isCartOpen, toggleCart } = useCartContext();

  const handleBrowseProductsClick = () => {
    setShowBrowseSidebar(true);
  };

  const handleCloseBrowseSidebar = () => {
    setShowBrowseSidebar(false);
  };

  const handleCartToggle = () => {
    toggleCart();
  };

  const wrapperClasses = [
    'layout-wrapper',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={wrapperClasses} {...props}>
      {showNavbar && (
        <AppNavbar 
          {...navbarProps} 
          onBrowseProductsClick={handleBrowseProductsClick}
          onCartClick={handleCartToggle}
        />
      )}
      
      <main className="layout-wrapper__main">
        {children}
      </main>
      
      {showFooter && <AppFooter {...footerProps} />}
      
      {/* Browse Products Sidebar */}
      <BrowseSidebar 
        show={showBrowseSidebar} 
        onHide={handleCloseBrowseSidebar} 
      />
      
      {/* Cart Sidebar */}
      <CartSidebar 
        show={isCartOpen} 
        onHide={handleCartToggle} 
      />
    </div>
  );
};

export default LayoutWrapper;
