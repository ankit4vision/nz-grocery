import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { paymentIntent, orderId, orderDetails } = location.state || {};
  
  const [orderInfo, setOrderInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderDetails) {
      setOrderInfo(orderDetails);
      setLoading(false);
    } else if (orderId) {
      // Simulate fetching order details
      setTimeout(() => {
        setOrderInfo({
          id: orderId,
          status: 'paid',
          estimated_delivery: '2-3 business days',
          created_at: new Date().toISOString()
        });
        setLoading(false);
      }, 1000);
    } else {
      setLoading(false);
    }
  }, [orderId, orderDetails]);

  const handleNewPayment = () => {
    navigate('/');
  };

  const handleViewOrders = () => {
    // In a real app, this would navigate to orders page
    alert('Orders page would open here');
  };

  if (loading) {
    return (
      <div className="payment-success-page">
        <div className="container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-success-page">
      <div className="container">
        <div className="success-container">
          <div className="success-icon">✓</div>
          <h1>Payment Successful!</h1>
          <p className="success-message">
            Thank you for your payment. Your order has been processed successfully.
          </p>
          
          {paymentIntent && (
            <div className="payment-details">
              <h3>Payment Details</h3>
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
                  <span className="status-success">{paymentIntent.status}</span>
                </div>
                <div className="detail-item">
                  <strong>Currency:</strong>
                  <span>{paymentIntent.currency?.toUpperCase()}</span>
                </div>
              </div>
            </div>
          )}

          {orderInfo && (
            <div className="order-details">
              <h3>Order Details</h3>
              <div className="details-grid">
                <div className="detail-item">
                  <strong>Order ID:</strong>
                  <span>#{orderInfo.order_id || orderInfo.id}</span>
                </div>
                <div className="detail-item">
                  <strong>Status:</strong>
                  <span className="status-paid">{orderInfo.status || 'paid'}</span>
                </div>
                <div className="detail-item">
                  <strong>Amount:</strong>
                  <span>${(orderInfo.amount / 100).toFixed(2)}</span>
                </div>
                <div className="detail-item">
                  <strong>Currency:</strong>
                  <span>{orderInfo.currency?.toUpperCase() || 'USD'}</span>
                </div>
              </div>
            </div>
          )}


          <div className="action-buttons">
            <button 
              onClick={handleViewOrders}
              className="primary-button"
            >
              View All Orders
            </button>
            <button 
              onClick={handleNewPayment}
              className="secondary-button"
            >
              Make Another Payment
            </button>
          </div>

          <div className="support-info">
            <h3>Need Help?</h3>
            <p>
              If you have any questions about your order or payment, 
              please contact our support team.
            </p>
            <div className="contact-info">
              <p><strong>Email:</strong> support@egrocery.com</p>
              <p><strong>Phone:</strong> +1 (555) 123-4567</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
