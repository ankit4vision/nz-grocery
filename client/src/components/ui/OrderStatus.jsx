import React from 'react';
import { Row, Col, Badge } from 'react-bootstrap';
import { FaCheck } from 'react-icons/fa';
import '../../styles/components/ui-components/order-status.css';

/**
 * OrderStatus - Component for displaying order status, payment status, and progress tracking
 * 
 * @param {string} orderNumber - Order number/ID
 * @param {string} orderDate - Order date
 * @param {number} totalAmount - Total order amount
 * @param {string} paymentMethod - Payment method used
 * @param {string} paymentStatus - Payment status (success, pending, failed)
 * @param {string} orderStatus - Current order status
 * @param {Array} progressSteps - Array of progress steps with status
 * 
 * @example
 * <OrderStatus 
 *   orderNumber="ORD-12345678"
 *   orderDate="August 21, 2025"
 *   totalAmount={19.77}
 *   paymentMethod="Credit Card"
 *   paymentStatus="payment-success"
 *   orderStatus="processing"
 *   progressSteps={progressSteps}
 * />
 */
const OrderStatus = ({
  orderNumber,
  orderDate,
  totalAmount,
  paymentMethod,
  paymentStatus,
  orderStatus,
  progressSteps = []
}) => {
  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'payment-success':
        return 'info';
      case 'payment-pending':
        return 'warning';
      case 'payment-failed':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'payment-success':
        return 'Payment Success';
      case 'payment-pending':
        return 'Payment Pending';
      case 'payment-failed':
        return 'Payment Failed';
      default:
        return status;
    }
  };

  const getProgressStepClass = (step, index) => {
    if (step.status === 'completed') return 'progress-step completed';
    if (step.status === 'current') return 'progress-step current';
    return 'progress-step pending';
  };

  const getStepIcon = (step, index) => {
    if (step.status === 'completed') {
      return <FaCheck className="step-icon" />;
    }
    return <span className="step-number">{index + 1}</span>;
  };

  return (
    <div className="order-status">
      {/* Payment Status Header */}
      <div className="payment-status-header">
        <h2 className="payment-status-title">
          Payment-status: 
          <Badge 
            bg={getStatusBadgeVariant(paymentStatus)} 
            className="ms-2 payment-status-badge"
          >
            {getStatusText(paymentStatus)}
          </Badge>
        </h2>
      </div>

      {/* Order Summary Cards */}
      <Row className="order-summary-cards">
        <Col md={3} sm={6} className="mb-3">
          <div className="summary-card">
            <div className="summary-label">Order Number</div>
            <div className="summary-value">{orderNumber}</div>
          </div>
        </Col>
        <Col md={3} sm={6} className="mb-3">
          <div className="summary-card">
            <div className="summary-label">Date</div>
            <div className="summary-value">{orderDate}</div>
          </div>
        </Col>
        <Col md={3} sm={6} className="mb-3">
          <div className="summary-card">
            <div className="summary-label">Total</div>
            <div className="summary-value">${totalAmount?.toFixed(2)}</div>
          </div>
        </Col>
        <Col md={3} sm={6} className="mb-3">
          <div className="summary-card">
            <div className="summary-label">Payment Method</div>
            <div className="summary-value">{paymentMethod}</div>
          </div>
        </Col>
      </Row>

      {/* Progress Tracker */}
      <div className="progress-tracker">
        <div className="progress-steps">
          {progressSteps.map((step, index) => (
            <div key={index} className={getProgressStepClass(step, index)}>
              <div className="step-content">
                <div className="step-icon-container">
                  {getStepIcon(step, index)}
                </div>
                <div className="step-text">
                  <div className="step-title">{step.title}</div>
                  {step.description && (
                    <div className="step-description">{step.description}</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderStatus;
