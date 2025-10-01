import React from 'react';
import { 
  Offcanvas, 
  Button, 
  Row, 
  Col, 
  Image, 
  Form, 
  Collapse,
  Badge
} from 'react-bootstrap';
import { FaTimes, FaTrash, FaMinus, FaPlus } from 'react-icons/fa';
import { useCartContext } from '../../context';
import { ImageWithFallback } from '../common';
import '../../styles/components/ui-components/cart-sidebar.css';

/**
 * CartSidebar - Shopping cart side panel component
 * 
 * @param {boolean} show - Whether the cart sidebar is visible
 * @param {function} onHide - Function to hide the cart sidebar
 * @param {string} className - Additional CSS classes
 * 
 * @example
 * <CartSidebar 
 *   show={isCartOpen} 
 *   onHide={() => setIsCartOpen(false)}
 *   className="custom-cart"
 * />
 */
const CartSidebar = ({ 
  show, 
  onHide, 
  className = '' 
}) => {
  const {
    items,
    totalItems,
    totalPrice,
    isLoading,
    error,
    removeItem,
    updateItemQuantity,
    clearCart
  } = useCartContext();

  // Calculate savings (example calculation)
  const calculateSavings = () => {
    return items.reduce((total, item) => {
      const originalPrice = Number(item.originalPrice || item.price || 0);
      const currentPrice = Number(item.currentPrice || item.price || 0);
      const savings = (originalPrice - currentPrice) * item.quantity;
      return total + Math.max(0, savings);
    }, 0);
  };

  const savings = calculateSavings();

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeItem(productId);
    } else {
      updateItemQuantity(productId, newQuantity);
    }
  };

  const handleRemoveItem = (productId) => {
    removeItem(productId);
  };

  const handleClearCart = () => {
    clearCart();
  };

  const handleCheckout = () => {
    // TODO: Implement checkout functionality
    console.log('Proceeding to checkout...');
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
            <div>
              <h4 className="mb-0">Cart</h4>
              <Badge bg="secondary" className="cart-sidebar__item-count">
                {totalItems} {totalItems === 1 ? 'item' : 'items'}
              </Badge>
            </div>
            <Button
              variant="link"
              onClick={onHide}
              className="cart-sidebar__close-btn p-0"
              aria-label="Close cart"
            >
              <FaTimes size={20} />
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
          <div className="cart-sidebar__empty text-center py-5">
            <div className="text-muted mb-3">
              <FaTimes size={48} />
            </div>
            <h5 className="text-muted">Your cart is empty</h5>
            <p className="text-muted">Add some items to get started</p>
            <Button variant="primary" onClick={onHide}>
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="cart-sidebar__items">
              {items.map((item) => (
                <div key={item.id} className="cart-sidebar__item">
                  <Row className="align-items-center g-3">
                    {/* Product Image */}
                    <Col xs={3}>
                      <div className="cart-sidebar__item-image">
                        <ImageWithFallback
                          src={item.image}
                          alt={item.name}
                          className="img-fluid rounded"
                          fallbackSrc="/placeholder.svg"
                        />
                      </div>
                    </Col>

                    {/* Product Details */}
                    <Col xs={9}>
                      <div className="cart-sidebar__item-details">
                        <h6 className="cart-sidebar__item-name mb-2">
                          {item.name}
                        </h6>
                        
                        {/* Quantity Controls */}
                        <div className="cart-sidebar__quantity-controls d-flex align-items-center mb-2">
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            className="cart-sidebar__quantity-btn"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <FaMinus size={12} />
                          </Button>
                          
                          <Form.Control
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                            className="cart-sidebar__quantity-input text-center"
                            size="sm"
                          />
                          
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            className="cart-sidebar__quantity-btn"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          >
                            <FaPlus size={12} />
                          </Button>
                        </div>

                        {/* Price and Remove */}
                        <div className="d-flex align-items-center justify-content-between">
                          <span className="cart-sidebar__item-price fw-bold">
                            ${Number(item.currentPrice || item.price || 0).toFixed(2)}
                          </span>
                          <Button
                            variant="link"
                            size="sm"
                            className="cart-sidebar__remove-btn text-danger p-0"
                            onClick={() => handleRemoveItem(item.id)}
                            aria-label={`Remove ${item.name}`}
                          >
                            <FaTimes size={14} />
                          </Button>
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
                >
                  <FaTrash className="me-2" />
                  Remove all
                </Button>
              </div>
            )}

            {/* Order Summary */}
            <Collapse in={items.length > 0}>
              <div className="cart-sidebar__summary">
                <div className="cart-sidebar__summary-header p-3 border-top">
                  <Button
                    variant="link"
                    className="cart-sidebar__summary-toggle w-100 text-start p-0"
                    onClick={() => {/* Toggle summary */}}
                  >
                    <h6 className="mb-0">Order Summary</h6>
                  </Button>
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
            </Collapse>

            {/* Checkout Button */}
            {items.length > 0 && (
              <div className="cart-sidebar__checkout p-3 border-top">
                <Button
                  variant="success"
                  size="lg"
                  className="w-100 cart-sidebar__checkout-btn"
                  onClick={handleCheckout}
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
