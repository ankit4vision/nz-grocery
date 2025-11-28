import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Alert, Badge } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaReceipt, FaShoppingBag, FaQuestionCircle, FaEnvelope, FaPhone, FaCalendarAlt, FaBox, FaCreditCard } from 'react-icons/fa';
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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
  };

  const formatCurrency = (amount) => {
    return `$${Number(amount || 0).toFixed(2)}`;
  };

  const handleViewOrder = () => {
    if (orderId) {
      navigate(`/order/${orderId}`, { state: { from: 'payment-success' } });
    } else {
      navigate('/dashboard?tab=orders');
    }
  };

  const handleContinueShopping = () => {
    navigate('/');
  };

  const handleViewAllOrders = () => {
    navigate('/dashboard?tab=orders');
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
            {/* Success Icon and Title */}
            <div className="success-header">
              <div className="success-icon-wrapper">
                <FaCheckCircle className="success-icon" />
                <div className="success-icon-ring"></div>
              </div>
              <h1 className="success-title">Payment Successful!</h1>
              <p className="success-message">
                Thank you for your payment. Your order has been processed successfully and will be delivered soon.
              </p>
            </div>
            
            {error && (
              <Alert variant="warning" className="mt-4" dismissible onClose={() => setError(null)}>
                <Alert.Heading>Notice</Alert.Heading>
                <p className="mb-0">{error}</p>
              </Alert>
            )}

            {/* Order Summary Cards */}
            <Row className="summary-cards-row">
              {orderInfo && (
                <Col md={6} className="mb-4">
                  <Card className="info-card order-info-card">
                    <Card.Header className="info-card-header">
                      <FaBox className="me-2" />
                      <span>Order Information</span>
                    </Card.Header>
                    <Card.Body className="info-card-body">
                      <div className="info-item">
                        <div className="info-label">
                          <FaReceipt className="me-2" />
                          Order Number
                        </div>
                        <div className="info-value">
                          {orderInfo.order_number || `#${orderInfo.order_id || orderInfo.id || orderId}`}
                        </div>
                      </div>
                      <div className="info-item">
                        <div className="info-label">
                          <FaCalendarAlt className="me-2" />
                          Order Date
                        </div>
                        <div className="info-value">
                          {formatDate(orderInfo.created_at)}
                        </div>
                      </div>
                      <div className="info-item">
                        <div className="info-label">Order Status</div>
                        <div className="info-value">
                          <Badge bg="primary" className="status-badge">
                            {orderInfo.order_status || orderInfo.status || 'confirmed'}
                          </Badge>
                        </div>
                      </div>
                      {orderInfo.estimated_delivery_time && (
                        <div className="info-item">
                          <div className="info-label">Estimated Delivery</div>
                          <div className="info-value">
                            {formatDate(orderInfo.estimated_delivery_time)}
                          </div>
                        </div>
                      )}
                      <div className="info-item info-item-total">
                        <div className="info-label">Total Amount</div>
                        <div className="info-value total-amount">
                          {formatCurrency(orderInfo.total_amount || orderInfo.amount || 0)}
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              )}

              {paymentIntent && (
                <Col md={6} className="mb-4">
                  <Card className="info-card payment-info-card">
                    <Card.Header className="info-card-header">
                      <FaCreditCard className="me-2" />
                      <span>Payment Details</span>
                    </Card.Header>
                    <Card.Body className="info-card-body">
                      <div className="info-item">
                        <div className="info-label">Payment ID</div>
                        <div className="info-value payment-id">
                          {paymentIntent.id}
                        </div>
                      </div>
                      <div className="info-item">
                        <div className="info-label">Amount Paid</div>
                        <div className="info-value">
                          {formatCurrency(paymentIntent.amount / 100)}
                        </div>
                      </div>
                      <div className="info-item">
                        <div className="info-label">Payment Status</div>
                        <div className="info-value">
                          <Badge bg="success" className="status-badge">
                            {paymentIntent.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="info-item">
                        <div className="info-label">Currency</div>
                        <div className="info-value">
                          {paymentIntent.currency?.toUpperCase() || 'USD'}
                        </div>
                      </div>
                      {orderInfo && (
                        <div className="info-item">
                          <div className="info-label">Payment Method</div>
                          <div className="info-value">
                            <Badge bg="info" className="status-badge">
                              {orderInfo.stripe_payment_intent_id ? 'Stripe' : 'Cash on Delivery'}
                            </Badge>
                          </div>
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              )}
            </Row>

            {/* Action Buttons */}
            <div className="action-buttons">
              <Button
                variant="primary"
                size="lg"
                onClick={handleViewOrder}
                className="action-btn primary-btn"
              >
                <FaReceipt className="me-2" />
                View Order Details
              </Button>
              <Button
                variant="outline-primary"
                size="lg"
                onClick={handleViewAllOrders}
                className="action-btn"
              >
                View All Orders
              </Button>
              <Button
                variant="outline-success"
                size="lg"
                onClick={handleContinueShopping}
                className="action-btn"
              >
                <FaShoppingBag className="me-2" />
                Continue Shopping
              </Button>
            </div>

            {/* Support Information */}
            <Card className="support-info-card">
              <Card.Body>
                <div className="support-header">
                  <FaQuestionCircle className="support-icon" />
                  <h6 className="support-title">Need Help?</h6>
                </div>
                <p className="support-text">
                  If you have any questions about your order or payment, 
                  please don't hesitate to contact our friendly support team. We're here to help!
                </p>
                <div className="contact-info">
                  <div className="contact-item">
                    <FaEnvelope className="contact-icon" />
                    <div>
                      <strong>Email:</strong>
                      <span>support@nzgrocery.com</span>
                    </div>
                  </div>
                  <div className="contact-item">
                    <FaPhone className="contact-icon" />
                    <div>
                      <strong>Phone:</strong>
                      <span>+64 9 XXX XXXX</span>
                    </div>
                  </div>
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

