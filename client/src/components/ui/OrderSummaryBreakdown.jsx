import React from 'react';
import { Card } from 'react-bootstrap';
import '../../styles/components/ui-components/order-summary-breakdown.css';

/**
 * OrderSummaryBreakdown - Component for displaying order amount breakdown
 * 
 * @param {number} subtotal - Subtotal amount
 * @param {number} shippingCharge - Shipping charge
 * @param {number} gst - Tax amount (legacy prop name, displayed as "Tax")
 * @param {number} discount - Discount amount
 * @param {number} total - Total amount
 * 
 * @example
 * <OrderSummaryBreakdown 
 *   subtotal={16.45}
 *   shippingCharge={2.00}
 *   gst={1.32}
 *   discount={0.00}
 *   total={19.77}
 * />
 */
const OrderSummaryBreakdown = ({
  subtotal = 0,
  shippingCharge = 0,
  gst = 0,
  discount = 0,
  total = 0
}) => {
  const formatCurrency = (amount) => {
    return `$${Number(amount).toFixed(2)}`;
  };

  const tax = gst; // Support both prop names

  return (
    <Card className="order-summary-breakdown-card">
      <Card.Header className="breakdown-header">
        <h3 className="breakdown-title">Total Amount</h3>
      </Card.Header>
      <Card.Body className="breakdown-body">
        <div className="amount-breakdown">
          <div className="breakdown-row">
            <span className="breakdown-label">Subtotal</span>
            <span className="breakdown-value">{formatCurrency(subtotal)}</span>
          </div>
          
          {shippingCharge > 0 && (
            <div className="breakdown-row">
              <span className="breakdown-label">Shipping Charge</span>
              <span className="breakdown-value">{formatCurrency(shippingCharge)}</span>
            </div>
          )}
          
          {tax > 0 && (
            <div className="breakdown-row">
              <span className="breakdown-label">Tax</span>
              <span className="breakdown-value">{formatCurrency(tax)}</span>
            </div>
          )}
          
          {discount > 0 && (
            <div className="breakdown-row breakdown-row-discount">
              <span className="breakdown-label">Discount</span>
              <span className="breakdown-value breakdown-value-discount">-{formatCurrency(discount)}</span>
            </div>
          )}
          
          <div className="breakdown-divider"></div>
          
          <div className="breakdown-row breakdown-row-total">
            <span className="breakdown-label breakdown-label-total">Total</span>
            <span className="breakdown-value breakdown-value-total">{formatCurrency(total)}</span>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default OrderSummaryBreakdown;
