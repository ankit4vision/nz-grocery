import React from 'react';
import { Card, Form, Row, Col } from 'react-bootstrap';
import '../../styles/components/ui-components/payment-method.css';

const PaymentMethod = ({ paymentInfo, onPaymentInfoChange }) => {
  const paymentMethods = [
    { id: 'card', label: 'Credit/Debit Card' },
    { id: 'paypal', label: 'PayPal' },
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

        {/* Card Details */}
        {paymentInfo.paymentMethod === 'card' && (
          <div className="form-section">
            <h6 className="section-title">Card Details</h6>
            <Row>
              <Col md={8}>
                <Form.Group className="mb-3" controlId="cardNumber">
                  <Form.Label>Card Number</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={paymentInfo.cardNumber}
                    onChange={(e) => onPaymentInfoChange('cardNumber', e.target.value)}
                    maxLength={19}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3" controlId="expiryDate">
                  <Form.Label>Expiry Date</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="12/25"
                    value={paymentInfo.expiryDate}
                    onChange={(e) => onPaymentInfoChange('expiryDate', e.target.value)}
                    maxLength={5}
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3" controlId="cvv">
                  <Form.Label>CVV</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="123"
                    value={paymentInfo.cvv}
                    onChange={(e) => onPaymentInfoChange('cvv', e.target.value)}
                    maxLength={4}
                  />
                </Form.Group>
              </Col>
              <Col md={8}>
                <Form.Group className="mb-3" controlId="cardholderName">
                  <Form.Label>Cardholder Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="John Doe"
                    value={paymentInfo.cardholderName}
                    onChange={(e) => onPaymentInfoChange('cardholderName', e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
          </div>
        )}

        {/* PayPal Info */}
        {paymentInfo.paymentMethod === 'paypal' && (
          <div className="form-section">
            <div className="paypal-info">
              <p className="paypal-text">
                You will be redirected to PayPal to complete your payment securely.
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
