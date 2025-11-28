import React from 'react';
import { Card, Form, Row, Col } from 'react-bootstrap';
import '../../styles/components/ui-components/payment-method.css';

const PaymentMethod = ({ paymentInfo, onPaymentInfoChange }) => {
  const paymentMethods = [
    { id: 'stripe', label: 'Stripe' },
    { id: 'cod', label: 'Cash on Delivery' }
  ];

  return (
    <Card className="payment-method-card">
      <Card.Header>
        <h5 className="card-title">Payment Method</h5>
      </Card.Header>
      <Card.Body>
        {/* Payment Options */}
        <div className="form-section">
          <h6 className="section-title">Payment Options</h6>
          <div className="payment-options">
            {paymentMethods.map(method => (
              <Form.Check
                key={method.id}
                type="radio"
                id={`payment-${method.id}`}
                name="paymentMethod"
                label={method.label}
                checked={paymentInfo.paymentMethod === method.id}
                onChange={() => onPaymentInfoChange('paymentMethod', method.id)}
                className="payment-radio"
              />
            ))}
          </div>
        </div>

        {/* Stripe Info */}
        {paymentInfo.paymentMethod === 'stripe' && (
          <div className="form-section">
            <div className="stripe-info">
              <p className="stripe-text">
                You will be redirected to a secure payment page powered by Stripe to complete your payment.
              </p>
            </div>
          </div>
        )}

        {/* Cash on Delivery Info */}
        {paymentInfo.paymentMethod === 'cod' && (
          <div className="form-section">
            <div className="cod-info">
              <p className="cod-text">
                Pay with cash when your order is delivered. Please have exact change ready.
              </p>
            </div>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default PaymentMethod;
