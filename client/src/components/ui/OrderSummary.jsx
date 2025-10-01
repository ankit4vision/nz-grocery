import React from 'react';
import { Card, Button, Form, ListGroup } from 'react-bootstrap';
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
        <div>
          <h6 className="items-header">Order Items</h6>
          
          <div className="table-responsive">
            <table className="table table-sm">
              <thead>
                <tr>
                  <th>Item</th>
                  <th className="text-center">Qty</th>
                  <th className="text-end">Price</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td className="text-center">{item.quantity}</td>
                    <td className="text-end">{formatPrice(item.currentPrice || item.price || 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
            />
            <Button
              variant="success"
              onClick={onPromoCodeApply}
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
