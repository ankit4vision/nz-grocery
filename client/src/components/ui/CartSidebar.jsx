import React, { useEffect } from 'react';
import { 
  Offcanvas, 
  Button, 
  Row, 
  Col, 
  Badge
} from 'react-bootstrap';
import { FaTimes, FaTrash, FaMinus, FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useCartContext } from '../../context';
import { ImageWithFallback } from '../common';
import '../../styles/components/ui-components/cart-sidebar.css';

/**
 * CartSidebar - Shopping cart side panel component
 * Works with real API data structure
 * 
 * @param {boolean} show - Whether the cart sidebar is visible
 * @param {function} onHide - Function to hide the cart sidebar
 * @param {string} className - Additional CSS classes
 */
const CartSidebar = ({ 
  show, 
  onHide, 
  className = '' 
}) => {
  const navigate = useNavigate();
  const {
    items,
    itemCount,
    totalItems,
    totalPrice,
    isLoading,
    error,
    removeItem,
    updateItemQuantity,
    clearCart,
    loadCartItems
  } = useCartContext();

  // Load full cart items when sidebar opens (if not already loaded)
  useEffect(() => {
    if (show && items.length === 0 && !isLoading) {
      // Only load if we don't have items yet
      loadCartItems();
    }
  }, [show, items.length, isLoading, loadCartItems]);

  // Calculate savings from API data
  const calculateSavings = () => {
    return items.reduce((total, item) => {
      const basePrice = Number(item.base_price || 0);
      const discountedPrice = Number(item.discounted_sale_price || item.sale_price || item.base_price || 0);
      const savings = (basePrice - discountedPrice) * item.quantity;
      return total + Math.max(0, savings);
    }, 0);
  };

  // Calculate total savings using total_price if available
  const calculateTotalSavings = () => {
    return items.reduce((total, item) => {
      const baseTotal = Number(item.base_price || 0) * item.quantity;
      const actualTotal = Number(item.total_price || 0);
      const savings = baseTotal - actualTotal;
      return total + Math.max(0, savings);
    }, 0);
  };

  const savings = calculateSavings();

  const handleQuantityChange = async (item, newQuantity) => {
    if (newQuantity < 1) {
      await removeItem(item.cart_item_id);
    } else {
      await updateItemQuantity(item.cart_item_id, newQuantity);
    }
  };

  const handleRemoveItem = async (item) => {
    await removeItem(item.cart_item_id);
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      await clearCart();
    }
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      return;
    }
    onHide(); // Close the cart sidebar
    navigate('/checkout'); // Navigate to checkout page
  };

  // Get display name for item (variant name or product name)
  const getItemDisplayName = (item) => {
    if (item.variant_name) {
      return item.variant_name;
    }
    return item.product_name || 'Product';
  };

  // Get display image for item
  // Note: CartItemWithPricing doesn't include image fields
  // We might need to fetch product details or use placeholder
  const getItemImage = (item) => {
    // Try various possible image fields
    return (
      item.variant_image_url ||
      item.image_url ||
      item.product_image_url ||
      item.image ||
      item.variant_image ||
      item.product_image ||
      null
    );
  };

  // Get unit price for item (price per unit)
  const getItemUnitPrice = (item) => {
    return item.discounted_sale_price || item.sale_price || item.base_price || 0;
  };

  // Get total price for item (quantity * unit price) - from API
  const getItemTotalPrice = (item) => {
    // Use total_price from API if available (already calculated with quantity)
    if (item.total_price !== undefined && item.total_price !== null) {
      return item.total_price;
    }
    // Fallback: calculate from unit price * quantity
    const unitPrice = getItemUnitPrice(item);
    return unitPrice * item.quantity;
  };

  const cartClasses = [
    'cart-sidebar',
    className
  ].filter(Boolean).join(' ');

  return (
    <Offcanvas
      show={show}
      onHide={onHide}
      placement="end"
      className={cartClasses}
      backdrop="static"
    >
      <Offcanvas.Header className="cart-sidebar__header">
        <Offcanvas.Title className="cart-sidebar__title">
          <div className="d-flex align-items-center justify-content-between w-100">
            <div className="cart-sidebar__title-section">
              <h4 className="cart-sidebar__title-text mb-0">Shopping Cart</h4>
              <Badge bg="primary" className="cart-sidebar__item-count">
                {itemCount} {itemCount === 1 ? 'product' : 'products'}
              </Badge>
            </div>
            <Button
              variant="link"
              onClick={onHide}
              className="cart-sidebar__close-btn"
              aria-label="Close cart"
            >
              <FaTimes size={18} />
            </Button>
          </div>
        </Offcanvas.Title>
      </Offcanvas.Header>

      <Offcanvas.Body className="cart-sidebar__body p-0">
        {isLoading ? (
          <div className="cart-sidebar__loading text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Loading cart...</p>
          </div>
        ) : error ? (
          <div className="cart-sidebar__error text-center py-5">
            <div className="text-danger mb-3">
              <FaTimes size={48} />
            </div>
            <p className="text-danger">{error}</p>
            <Button variant="outline-primary" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        ) : items.length === 0 ? (
          <div className="cart-sidebar__empty text-center">
            <div className="cart-sidebar__empty-icon mb-4">
              <div className="cart-sidebar__empty-cart-icon">
                🛒
              </div>
            </div>
            <h5 className="cart-sidebar__empty-title mb-3">Your cart is empty</h5>
            <p className="cart-sidebar__empty-message mb-4">
              Looks like you haven't added any items to your cart yet. 
              Start shopping to fill it up with amazing products!
            </p>
            <div className="cart-sidebar__empty-actions">
              <Button 
                variant="primary" 
                size="lg"
                onClick={onHide}
                className="cart-sidebar__continue-shopping-btn"
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="cart-sidebar__items">
              {items.map((item) => (
                <div key={item.cart_item_id} className="cart-sidebar__item">
                  <Row className="align-items-center g-2">
                    {/* Product Image */}
                    <Col xs={3} className="pe-1">
                      <div className="cart-sidebar__item-image">
                        <ImageWithFallback
                          src={getItemImage(item)}
                          alt={getItemDisplayName(item)}
                          className="img-fluid rounded"
                        />
                      </div>
                    </Col>

                    {/* Product Details - Compact Layout */}
                    <Col xs={9} className="ps-2">
                      <div className="cart-sidebar__item-details">
                        {/* Top Row: Name and Remove */}
                        <div className="d-flex justify-content-between align-items-start mb-1">
                          <div className="flex-grow-1 pe-2" style={{ minWidth: 0 }}>
                            <h6 className="cart-sidebar__item-name mb-0" style={{ fontSize: '0.9rem', lineHeight: '1.2' }}>
                              {getItemDisplayName(item)}
                            </h6>
                            {item.product_name && item.variant_name && item.product_name !== item.variant_name && (
                              <p className="cart-sidebar__item-product-name text-muted mb-0 mt-1" style={{ fontSize: '0.75rem' }}>
                                {item.product_name}
                              </p>
                            )}
                          </div>
                          <Button
                            variant="link"
                            size="sm"
                            className="cart-sidebar__remove-btn text-danger p-0 flex-shrink-0"
                            onClick={() => handleRemoveItem(item)}
                            disabled={isLoading}
                            aria-label={`Remove ${getItemDisplayName(item)}`}
                            style={{ minWidth: '20px' }}
                          >
                            <FaTimes size={12} />
                          </Button>
                        </div>
                        
                        {/* Bottom Row: Quantity and Pricing */}
                        <div className="d-flex align-items-center justify-content-between">
                          {/* Quantity Controls */}
                          <div className="cart-sidebar__quantity-controls d-flex align-items-center">
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              className="cart-sidebar__quantity-btn p-1"
                              onClick={() => handleQuantityChange(item, item.quantity - 1)}
                              disabled={item.quantity <= 1 || isLoading}
                              style={{ width: '24px', height: '24px', padding: 0 }}
                            >
                              <FaMinus size={9} />
                            </Button>
                            
                            <span className="cart-sidebar__quantity-value mx-1" style={{ minWidth: '24px', textAlign: 'center', fontSize: '0.85rem' }}>
                              {item.quantity}
                            </span>
                            
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              className="cart-sidebar__quantity-btn p-1"
                              onClick={() => handleQuantityChange(item, item.quantity + 1)}
                              disabled={isLoading}
                              style={{ width: '24px', height: '24px', padding: 0 }}
                            >
                              <FaPlus size={9} />
                            </Button>
                          </div>

                          {/* Pricing - Compact */}
                          <div className="cart-sidebar__item-pricing text-end">
                            <div className="cart-sidebar__total-price">
                              <span className="cart-sidebar__item-price fw-bold" style={{ fontSize: '0.95rem' }}>
                                ${Number(getItemTotalPrice(item)).toFixed(2)}
                              </span>
                            </div>
                            <div className="cart-sidebar__unit-price">
                              <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                                @ ${Number(getItemUnitPrice(item)).toFixed(2)}
                              </span>
                              {item.discounted_sale_price && item.base_price > item.discounted_sale_price && (
                                <span className="text-muted text-decoration-line-through ms-1" style={{ fontSize: '0.7rem' }}>
                                  ${Number(item.base_price).toFixed(2)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>
              ))}
            </div>

            {/* Remove All Button */}
            {items.length > 0 && (
              <div className="cart-sidebar__actions p-3 border-top">
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={handleClearCart}
                  className="w-100"
                  disabled={isLoading}
                >
                  <FaTrash className="me-2" />
                  Remove all
                </Button>
              </div>
            )}

            {/* Order Summary */}
            <div className="cart-sidebar__summary">
              <div className="cart-sidebar__summary-header p-3 border-top">
                <h6 className="mb-0">Order Summary</h6>
              </div>
              
              <div className="cart-sidebar__summary-content p-3">
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal</span>
                  <span className="fw-bold">${Number(totalPrice).toFixed(2)}</span>
                </div>
                
                <div className="cart-sidebar__summary-note text-muted small mb-2">
                  Excluding service fees
                </div>
                
                {savings > 0 && (
                  <div className="cart-sidebar__savings text-primary small mb-3">
                    Saving ${Number(savings).toFixed(2)}
                  </div>
                )}
              </div>
            </div>

            {/* Checkout Button */}
            {items.length > 0 && (
              <div className="cart-sidebar__checkout p-3 border-top">
                <Button
                  variant="success"
                  size="lg"
                  className="w-100 cart-sidebar__checkout-btn"
                  onClick={handleCheckout}
                  disabled={isLoading}
                >
                  Checkout
                </Button>
              </div>
            )}
          </>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default CartSidebar;
