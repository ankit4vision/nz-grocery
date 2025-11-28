import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Alert } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { StripeProvider } from '../components/stripe/StripeProvider';
import PaymentForm from '../components/ui/PaymentForm';
import { Loader } from '../components/common';
import { usePageTitle } from '../hooks';
import StripeService from '../services/api/stripe';
import './Payment.css';

const Payment = () => {
  // Set page title and SEO
  usePageTitle(
    'Payment',
    'Secure payment processing at Farm2Fridge. Complete your order with our safe and encrypted payment system.'
  );
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId, orderData } = location.state || {};
  
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [clientSecret, setClientSecret] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [orderDetails, setOrderDetails] = useState(null);
  const hasCreatedPaymentIntent = useRef(false);
  const isCreatingPaymentIntent = useRef(false);

  // Create PaymentIntent when component mounts
  useEffect(() => {
    if (orderId && !hasCreatedPaymentIntent.current && !isCreatingPaymentIntent.current) {
      hasCreatedPaymentIntent.current = true;
      isCreatingPaymentIntent.current = true;
      createPaymentIntent();
    }
  }, [orderId]);

  const createPaymentIntent = async () => {
    // Prevent multiple calls
    if (isLoading === false && clientSecret) {
      return;
    }
    
    try {
      console.log('Creating payment intent for order:', orderId);
      const response = await StripeService.createPaymentIntent({
        order_id: orderId,
        currency: 'usd'
      });
      
      if (response.success) {
        console.log('Payment intent created:', response.data);
        setClientSecret(response.data.client_secret);
        setOrderDetails({
          order_id: orderId,
          amount: response.data.amount,
          currency: response.data.currency,
          description: response.data.description || `Order #${orderId}`
        });
        setIsLoading(false);
        isCreatingPaymentIntent.current = false;
      } else {
        setError('Failed to initialize payment: ' + (response.message || 'Unknown error'));
        setIsLoading(false);
        isCreatingPaymentIntent.current = false;
      }
    } catch (error) {
      console.error('Error creating payment intent:', error);
      setError('Failed to initialize payment: ' + (error.response?.data?.detail || error.message));
      setIsLoading(false);
      isCreatingPaymentIntent.current = false;
    }
  };

  const handlePaymentSuccess = (paymentIntent) => {
    console.log('Payment succeeded:', paymentIntent);
    setPaymentStatus('success');
    
    // Redirect to success page after a short delay
    setTimeout(() => {
      navigate('/payment-success', { 
        state: { 
          paymentIntent, 
          orderId,
          orderDetails
        } 
      });
    }, 2000);
  };

  const handlePaymentError = (error) => {
    console.error('Payment failed:', error);
    setPaymentStatus('error');
  };

  if (!orderId) {
    return (
      <Container fluid="lg" className="payment-page">
        <Row>
          <Col>
            <Alert variant="danger" className="mt-4">
              <Alert.Heading>Invalid Payment Request</Alert.Heading>
              <p>Missing order ID. Please try again.</p>
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/')}
              >
                Return to Home
              </button>
            </Alert>
          </Col>
        </Row>
      </Container>
    );
  }

  if (isLoading) {
    return (
      <Container fluid="lg" className="payment-page">
        <Row>
          <Col className="text-center" style={{ minHeight: '400px', paddingTop: '100px' }}>
            <Loader />
            <p className="mt-3">Initializing payment...</p>
          </Col>
        </Row>
      </Container>
    );
  }

  if (error) {
    return (
      <Container fluid="lg" className="payment-page">
        <Row>
          <Col>
            <Alert variant="danger" className="mt-4">
              <Alert.Heading>Payment Initialization Failed</Alert.Heading>
              <p>{error}</p>
              <div className="mt-3">
                <button 
                  className="btn btn-primary me-2"
                  onClick={createPaymentIntent}
                >
                  Retry
                </button>
                <button 
                  className="btn btn-outline-secondary"
                  onClick={() => navigate('/')}
                >
                  Return to Home
                </button>
              </div>
            </Alert>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container fluid="lg" className="payment-page">
      <Row>
        <Col>
          <div className="payment-header">
            <h1 className="payment-title">Complete Your Payment</h1>
            <p className="payment-subtitle">Secure payment powered by Stripe</p>
          </div>
        </Col>
      </Row>

      <Row className="payment-content">
        <Col lg={7} md={12} className="mb-4 mb-lg-0">
          <Card className="payment-form-card">
            <Card.Body>
              {clientSecret ? (
                <StripeProvider clientSecret={clientSecret}>
                  <PaymentForm
                    orderId={orderId}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                  />
                </StripeProvider>
              ) : (
                <Alert variant="warning">
                  <p>Payment form is loading...</p>
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={5} md={12}>
          <Card className="order-summary-card">
            <Card.Header>
              <h5 className="mb-0">Order Summary</h5>
            </Card.Header>
            <Card.Body>
              {orderDetails ? (
                <div className="order-details">
                  <div className="detail-row">
                    <span><strong>Order ID:</strong></span>
                    <span>#{orderDetails.order_id}</span>
                  </div>
                  <div className="detail-row">
                    <span><strong>Amount:</strong></span>
                    <span>${(orderDetails.amount / 100).toFixed(2)}</span>
                  </div>
                  <div className="detail-row">
                    <span><strong>Currency:</strong></span>
                    <span>{orderDetails.currency?.toUpperCase() || 'USD'}</span>
                  </div>
                  {orderDetails.description && (
                    <div className="detail-row">
                      <span><strong>Description:</strong></span>
                      <span className="text-muted small">{orderDetails.description}</span>
                    </div>
                  )}
                </div>
              ) : orderData ? (
                <div className="order-details">
                  <div className="detail-row">
                    <span><strong>Order ID:</strong></span>
                    <span>#{orderData.order_id || orderData.id}</span>
                  </div>
                  <div className="detail-row">
                    <span><strong>Total Amount:</strong></span>
                    <span>${(orderData.total_amount || 0).toFixed(2)}</span>
                  </div>
                </div>
              ) : (
                <div className="order-details">
                  <div className="detail-row">
                    <span><strong>Order ID:</strong></span>
                    <span>#{orderId}</span>
                  </div>
                  <p className="text-muted small">Loading order details...</p>
                </div>
              )}
            </Card.Body>
          </Card>

          <Card className="security-info-card mt-3">
            <Card.Body>
              <h6 className="security-title">
                <i className="fas fa-lock me-2"></i>
                Security Information
              </h6>
              <p className="security-text">
                Your payment information is securely processed by Stripe. 
                We never store your card details on our servers.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {paymentStatus === 'success' && (
        <Row>
          <Col>
            <Alert variant="success" className="mt-4">
              <Alert.Heading>Payment Successful!</Alert.Heading>
              <p>Redirecting to confirmation page...</p>
            </Alert>
          </Col>
        </Row>
      )}

      {paymentStatus === 'error' && (
        <Row>
          <Col>
            <Alert variant="danger" className="mt-4">
              <Alert.Heading>Payment Failed</Alert.Heading>
              <p>Please try again or contact support.</p>
              <button 
                className="btn btn-primary mt-2"
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </Alert>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Payment;

