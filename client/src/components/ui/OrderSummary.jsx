import React from 'react';
import { Card, Button } from 'react-bootstrap';
import '../../styles/components/ui-components/order-summary.css';

const OrderSummary = ({
  items,
  subtotal,
  total,
  discountAmount = 0,
  onPlaceOrder,
  isCreatingOrder = false
}) => {
  const formatPrice = (price) => {
    const numPrice = Number(price) || 0;
    return `$${numPrice.toFixed(2)}`;
  };

  const discount = Number(discountAmount) || 0;
  const finalTotal = Number(total) || 0;
  const displaySubtotal = Number(subtotal) || 0;

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
                  const primaryName = item.variant_name || item.product_name || item.name || `Product ${item.product_id || index + 1}`;
                  const secondaryName = item.product_name && item.product_name !== primaryName ? item.product_name : null;
                  const itemPrice = item.total_price || item.unit_price || item.currentPrice || item.price || item.discounted_sale_price || item.sale_price || item.base_price || 0;
                  const itemKey = item.cart_item_id || item.id || item.product_id || index;
                  const itemImage =
                    item.variant_image_url ||
                    item.image_url ||
                    item.product_image_url ||
                    item.image ||
                    item.variant_image ||
                    item.product_image ||
                    null;

                  return (
                    <tr key={itemKey}>
                      <td>
                        <div className="order-summary-item">
                          <div className="order-summary-item-image">
                            {itemImage ? (
                              <img src={itemImage} alt={primaryName} />
                            ) : (
                              <div className="order-summary-item-placeholder">🛒</div>
                            )}
                          </div>
                          <div className="order-summary-item-details">
                            <div className="order-summary-item-name">{primaryName}</div>
                            {secondaryName && (
                              <div className="order-summary-item-subtitle text-muted">{secondaryName}</div>
                            )}
                          </div>
                        </div>
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
            <span>{formatPrice(displaySubtotal)}</span>
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
