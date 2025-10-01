import React from 'react';
import '../../styles/components/ui-components/order-summary-breakdown.css';

/**
 * OrderSummary - Component for displaying order amount breakdown
 * 
 * @param {number} subtotal - Subtotal amount
 * @param {number} shippingCharge - Shipping charge
 * @param {number} gst - GST/Tax amount
 * @param {number} discount - Discount amount
 * @param {number} total - Total amount
 * 
 * @example
 * <OrderSummary 
 *   subtotal={16.45}
 *   shippingCharge={2.00}
 *   gst={1.32}
 *   discount={0.00}
 *   total={19.77}
 * />
 */
const OrderSummary = ({
  subtotal = 0,
  shippingCharge = 0,
  gst = 0,
  discount = 0,
  total = 0
}) => {
  const formatCurrency = (amount) => {
    return `$${Number(amount).toFixed(2)}`;
  };

  return (
    <div className="order-summary-breakdown">
      <h3 className="summary-title">Total Amount</h3>
      
      <div className="amount-breakdown">
        <div className="breakdown-item">
          <span className="breakdown-label">Sub Total</span>
          <span className="breakdown-value">{formatCurrency(subtotal)}</span>
        </div>
        
        <div className="breakdown-item">
          <span className="breakdown-label">Shipping Charge</span>
          <span className="breakdown-value">{formatCurrency(shippingCharge)}</span>
        </div>
        
        <div className="breakdown-item">
          <span className="breakdown-label">GST</span>
          <span className="breakdown-value">{formatCurrency(gst)}</span>
        </div>
        
        {discount > 0 && (
          <div className="breakdown-item discount">
            <span className="breakdown-label">Discount</span>
            <span className="breakdown-value discount-value">-{formatCurrency(discount)}</span>
          </div>
        )}
        
        <div className="breakdown-item total">
          <span className="breakdown-label">Total</span>
          <span className="breakdown-value total-value">{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
