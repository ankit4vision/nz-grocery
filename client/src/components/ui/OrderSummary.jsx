import React from 'react';
import { Card, Button, Form, ListGroup } from 'react-bootstrap';
import '../../styles/components/ui-components/order-summary.css';

const OrderSummary = ({
  items,
  subtotal,
  deliveryFee,
  tax,
  total,
  discountAmount = 0,
  promoCode,
  appliedPromo,
  onPromoCodeChange,
  onPromoCodeApply,
  onPlaceOrder,
  isCreatingOrder = false
}) => {
  const formatPrice = (price) => {
    const numPrice = Number(price) || 0;
    return `$${numPrice.toFixed(2)}`;
  };

  // Use discountAmount if provided, otherwise calculate from appliedPromo
  const discount = discountAmount > 0 
    ? discountAmount 
    : (appliedPromo 
        ? (appliedPromo.type === 'percentage' 
            ? subtotal * appliedPromo.discount 
            : appliedPromo.discount)
        : 0);
  const finalTotal = total;

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
                {items.map((item, index) => {
                  // Handle different item structures from API
                  const itemName = item.product_name || item.name || `Product ${item.product_id || index + 1}`;
                  const itemPrice = item.total_price || item.unit_price || item.currentPrice || item.price || item.discounted_sale_price || item.sale_price || item.base_price || 0;
                  const itemKey = item.cart_item_id || item.id || item.product_id || index;
                  
                  return (
                    <tr key={itemKey}>
                      <td>
                        {itemName}
                        {item.variant_name && (
                          <small className="text-muted d-block">{item.variant_name}</small>
                        )}
                      </td>
                      <td className="text-center">{item.quantity || 1}</td>
                      <td className="text-end">{formatPrice(itemPrice)}</td>
                    </tr>
                  );
                })}
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
            disabled={isCreatingOrder || items.length === 0}
          >
            {isCreatingOrder ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Creating Order...
              </>
            ) : (
              'Place Order'
            )}
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
