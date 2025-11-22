import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { StripeProvider } from '../stripe/stripeProvider';
import PaymentForm from '../components/PaymentForm';
import axios from 'axios';

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId } = location.state || {};
  
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
  }, [orderId]); // Only depend on orderId, not createPaymentIntent

  const createPaymentIntent = async () => {
    // Prevent multiple calls
    if (isLoading === false) {
      return;
    }
    
    try {
      console.log('Creating payment intent for order:', orderId);
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/product-service/stripe/payment-intents`,
        {
          order_id: orderId,
          currency: 'usd'
        }
      );
      
      console.log('Payment intent created:', response.data);
      setClientSecret(response.data.client_secret);
      setOrderDetails({
        order_id: orderId,
        amount: response.data.amount,
        currency: response.data.currency,
        description: response.data.description
      });
      setIsLoading(false);
      isCreatingPaymentIntent.current = false;
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
      <div className="payment-page">
        <div className="container">
          <div className="error-container">
            <h2>Invalid Payment Request</h2>
            <p>Missing order ID. Please try again.</p>
            <button 
              onClick={() => navigate('/')}
              className="primary-button"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="payment-page">
        <div className="container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Initializing payment...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="payment-page">
        <div className="container">
          <div className="error-container">
            <h2>Payment Initialization Failed</h2>
            <p>{error}</p>
            <button 
              onClick={() => navigate('/')}
              className="primary-button"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <div className="container">
        <header className="page-header">
          <h1>Complete Your Payment</h1>
          <p>Secure payment powered by Stripe</p>
        </header>
        
        <div className="payment-container">
          <div className="order-summary">
            <h3>Order Summary</h3>
            {orderDetails ? (
              <div className="order-details">
                <p><strong>Order ID:</strong> #{orderDetails.order_id}</p>
                <p><strong>Amount:</strong> ${(orderDetails.amount / 100).toFixed(2)}</p>
                <p><strong>Currency:</strong> {orderDetails.currency?.toUpperCase()}</p>
                <p><strong>Description:</strong> {orderDetails.description}</p>
              </div>
            ) : (
              <div className="order-details">
                <p><strong>Order ID:</strong> #{orderId}</p>
                <p>Loading order details...</p>
              </div>
            )}
          </div>

          <div className="payment-form-container">
            <StripeProvider clientSecret={clientSecret}>
              <PaymentForm
                orderId={orderId}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />
            </StripeProvider>
          </div>

          {paymentStatus === 'success' && (
            <div className="success-message">
              <div className="success-icon">✓</div>
              <h3>Payment Successful!</h3>
              <p>Redirecting to confirmation page...</p>
            </div>
          )}

          {paymentStatus === 'error' && (
            <div className="error-message">
              <div className="error-icon">✗</div>
              <h3>Payment Failed</h3>
              <p>Please try again or contact support.</p>
              <button 
                onClick={() => window.location.reload()}
                className="primary-button"
              >
                Try Again
              </button>
            </div>
          )}
        </div>

        <div className="security-info">
          <h3>Security Information</h3>
          <p>
            Your payment information is securely processed by Stripe. 
            We never store your card details on our servers.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
