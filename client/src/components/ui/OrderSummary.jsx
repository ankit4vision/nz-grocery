import React from 'react';
import { Card, Button, Form, Row, Col } from 'react-bootstrap';
import '../../styles/components/ui-components/order-summary.css';

const OrderSummary = ({
  items,
  subtotal,
  deliveryFee,
  tax,
  total,
  promoCode,
  appliedPromo,
  onPromoCodeChange,
  onPromoCodeApply,
  onPlaceOrder
}) => {
  const formatPrice = (price) => {
    const numPrice = Number(price) || 0;
    return `$${numPrice.toFixed(2)}`;
  };

  const calculateDiscount = () => {
    if (!appliedPromo) return 0;
    
    if (appliedPromo.type === 'percentage') {
      return subtotal * appliedPromo.discount;
    } else {
      return appliedPromo.discount;
    }
  };

  const discount = calculateDiscount();
  const finalTotal = total - discount;

  return (
    <Card className="order-summary-card">
      <Card.Header>
        <h5 className="card-title">Order Summary</h5>
      </Card.Header>
      <Card.Body>
        {/* Order Items */}
        <div className="order-items">
          <div className="items-header">
            <Row>
              <Col xs={6}><strong>Item</strong></Col>
              <Col xs={3}><strong>Qty</strong></Col>
              <Col xs={3}><strong>Price</strong></Col>
            </Row>
          </div>
          
          <div className="items-list">
            {items.map((item) => (
              <Row key={item.id} className="order-item">
                <Col xs={6} className="item-name">
                  {item.name}
                </Col>
                <Col xs={3} className="item-quantity">
                  {item.quantity}
                </Col>
                <Col xs={3} className="item-price">
                  {formatPrice(item.currentPrice || item.price || 0)}
                </Col>
              </Row>
            ))}
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="price-breakdown">
          <div className="price-row">
            <span>Subtotal:</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          
          <div className="price-row">
            <span>Delivery Fee:</span>
            <span>{formatPrice(deliveryFee)}</span>
          </div>
          
          <div className="price-row">
            <span>Tax:</span>
            <span>{formatPrice(tax)}</span>
          </div>

          {discount > 0 && (
            <div className="price-row discount-row">
              <span>Discount:</span>
              <span>-{formatPrice(discount)}</span>
            </div>
          )}
          
          <div className="price-row total-row">
            <span><strong>Total:</strong></span>
            <span><strong>{formatPrice(finalTotal)}</strong></span>
          </div>
        </div>

        {/* Promo Code */}
        <div className="promo-section">
          <h6 className="section-title">Promo Code</h6>
          <div className="promo-input-group">
            <Form.Control
              type="text"
              placeholder="Enter promo code"
              value={promoCode}
              onChange={(e) => onPromoCodeChange(e.target.value)}
              className="promo-input"
            />
            <Button
              variant="success"
              onClick={onPromoCodeApply}
              className="promo-apply-btn"
            >
              Apply
            </Button>
          </div>
          {appliedPromo && (
            <div className="promo-applied">
              <small className="text-success">
                ✓ Promo code applied successfully!
              </small>
            </div>
          )}
        </div>

        {/* Place Order Button */}
        <div className="place-order-section">
          <Button
            variant="success"
            size="lg"
            onClick={onPlaceOrder}
            className="place-order-btn w-100"
          >
            Place Order
          </Button>
          <p className="terms-text">
            By placing order, you agree to our terms and conditions.
          </p>
        </div>
      </Card.Body>
    </Card>
  );
};

export default OrderSummary;
