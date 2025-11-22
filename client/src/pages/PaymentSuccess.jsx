import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { Loader } from '../components/common';
import OrdersService from '../services/api/orders';
import './PaymentSuccess.css';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { paymentIntent, orderId, orderDetails } = location.state || {};
  
  const [orderInfo, setOrderInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (orderId) {
      loadOrderDetails();
    } else {
      setLoading(false);
    }
  }, [orderId]);

  const loadOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await OrdersService.getOrderDetails(orderId);
      
      if (response.success) {
        setOrderInfo(response.data);
      } else {
        setError(response.message || 'Failed to load order details');
        // Still show payment success even if order details fail
        if (orderDetails) {
          setOrderInfo(orderDetails);
        }
      }
    } catch (err) {
      console.error('Error loading order details:', err);
      setError('Failed to load order details');
      // Still show payment success even if order details fail
      if (orderDetails) {
        setOrderInfo(orderDetails);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrder = () => {
    if (orderId) {
      navigate(`/order/${orderId}`);
    } else {
      navigate('/dashboard');
    }
  };

  const handleContinueShopping = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <Container fluid="lg" className="payment-success-page">
        <Row>
          <Col className="text-center" style={{ minHeight: '400px', paddingTop: '100px' }}>
            <Loader />
            <p className="mt-3">Loading order details...</p>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container fluid="lg" className="payment-success-page">
      <Row>
        <Col>
          <div className="success-container">
            <div className="success-icon">
              <i className="fas fa-check-circle"></i>
            </div>
            <h1 className="success-title">Payment Successful!</h1>
            <p className="success-message">
              Thank you for your payment. Your order has been processed successfully.
            </p>
            
            {error && (
              <Alert variant="warning" className="mt-3">
                <small>{error}</small>
              </Alert>
            )}
            
            {paymentIntent && (
              <Card className="payment-details-card mt-4">
                <Card.Header>
                  <h5 className="mb-0">Payment Details</h5>
                </Card.Header>
                <Card.Body>
                  <div className="details-grid">
                    <div className="detail-item">
                      <strong>Payment ID:</strong>
                      <span>{paymentIntent.id}</span>
                    </div>
                    <div className="detail-item">
                      <strong>Amount:</strong>
                      <span>${(paymentIntent.amount / 100).toFixed(2)}</span>
                    </div>
                    <div className="detail-item">
                      <strong>Status:</strong>
                      <span className="badge bg-success">{paymentIntent.status}</span>
                    </div>
                    <div className="detail-item">
                      <strong>Currency:</strong>
                      <span>{paymentIntent.currency?.toUpperCase() || 'USD'}</span>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            )}

            {orderInfo && (
              <Card className="order-details-card mt-4">
                <Card.Header>
                  <h5 className="mb-0">Order Details</h5>
                </Card.Header>
                <Card.Body>
                  <div className="details-grid">
                    <div className="detail-item">
                      <strong>Order ID:</strong>
                      <span>#{orderInfo.order_id || orderInfo.id || orderId}</span>
                    </div>
                    <div className="detail-item">
                      <strong>Status:</strong>
                      <span className="badge bg-primary">
                        {orderInfo.order_status || orderInfo.status || 'confirmed'}
                      </span>
                    </div>
                    <div className="detail-item">
                      <strong>Payment Status:</strong>
                      <span className="badge bg-success">
                        {orderInfo.payment_status || 'paid'}
                      </span>
                    </div>
                    <div className="detail-item">
                      <strong>Total Amount:</strong>
                      <span>${(orderInfo.total_amount || orderInfo.amount || 0).toFixed(2)}</span>
                    </div>
                    {orderInfo.order_number && (
                      <div className="detail-item">
                        <strong>Order Number:</strong>
                        <span>{orderInfo.order_number}</span>
                      </div>
                    )}
                  </div>
                </Card.Body>
              </Card>
            )}

            <div className="action-buttons mt-4">
              <Button
                variant="success"
                size="lg"
                onClick={handleViewOrder}
                className="me-2"
              >
                <i className="fas fa-receipt me-2"></i>
                View Order Details
              </Button>
              <Button
                variant="outline-primary"
                size="lg"
                onClick={handleContinueShopping}
              >
                <i className="fas fa-shopping-bag me-2"></i>
                Continue Shopping
              </Button>
            </div>

            <Card className="support-info-card mt-4">
              <Card.Body>
                <h6 className="support-title">
                  <i className="fas fa-question-circle me-2"></i>
                  Need Help?
                </h6>
                <p className="support-text">
                  If you have any questions about your order or payment, 
                  please contact our support team.
                </p>
                <div className="contact-info">
                  <p className="mb-1"><strong>Email:</strong> support@nzgrocery.com</p>
                  <p className="mb-0"><strong>Phone:</strong> +64 9 XXX XXXX</p>
                </div>
              </Card.Body>
            </Card>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default PaymentSuccess;

