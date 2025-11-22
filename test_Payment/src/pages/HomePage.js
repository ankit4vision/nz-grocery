import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const HomePage = () => {
  const navigate = useNavigate();
  const [testOrderId, setTestOrderId] = useState(1); // Default test order ID
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTestPayment = async () => {
    setIsLoading(true);
    setError('');

    try {
      // Navigate to payment page with order ID
      navigate('/payment', {
        state: {
          orderId: testOrderId
        }
      });
    } catch (err) {
      setError('Failed to start payment process: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const testStripeConnection = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/product-service/stripe/config`
      );
      alert('Stripe connection successful!\n\n' + JSON.stringify(response.data, null, 2));
    } catch (error) {
      alert('Stripe connection failed:\n' + (error.response?.data?.detail || error.message));
    }
  };

  return (
    <div className="home-page">
      <div className="container">
        <header className="page-header">
          <h1>eGrocery Stripe Payment Test</h1>
          <p>Test your Stripe payment integration with this demo application</p>
        </header>

        <div className="test-section">
          <h2>Test Payment</h2>
          <div className="test-form">
            <div className="form-group">
              <label htmlFor="orderId">Test Order ID:</label>
              <input
                type="number"
                id="orderId"
                value={testOrderId}
                onChange={(e) => setTestOrderId(parseInt(e.target.value) || 1)}
                min="1"
                placeholder="1"
              />
              <small>Enter an existing order ID from your database</small>
            </div>

            <div className="button-group">
              <button
                onClick={handleTestPayment}
                disabled={isLoading || testOrderId < 1}
                className="primary-button"
              >
                {isLoading ? 'Starting Payment...' : 'Start Test Payment'}
              </button>

              <button
                onClick={testStripeConnection}
                className="secondary-button"
              >
                Test Stripe Connection
              </button>
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
          </div>
        </div>

        <div className="info-section">
          <h2>Test Information</h2>
          <div className="info-grid">
            <div className="info-card">
              <h3>Test Cards</h3>
              <ul>
                <li><strong>Success:</strong> 4242 4242 4242 4242</li>
                <li><strong>Decline:</strong> 4000 0000 0000 0002</li>
                <li><strong>3D Secure:</strong> 4000 0025 0000 3155</li>
              </ul>
            </div>

            <div className="info-card">
              <h3>Test Details</h3>
              <ul>
                <li>Use any future expiry date</li>
                <li>Use any 3-digit CVC</li>
                <li>Use any postal code</li>
              </ul>
            </div>

            <div className="info-card">
              <h3>API Endpoints</h3>
              <ul>
                <li>Backend: {process.env.REACT_APP_API_BASE_URL}</li>
                <li>Stripe Config: /product-service/stripe/config</li>
                <li>Payment Intents: /product-service/stripe/payment-intents</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="instructions-section">
          <h2>Setup Instructions</h2>
          <ol>
            <li>Make sure your FastAPI backend is running on port 8000</li>
            <li>Set your Stripe publishable key in the .env file</li>
            <li>Ensure your Stripe secret key is configured in the backend</li>
            <li>Click "Test Stripe Connection" to verify the setup</li>
            <li>Use the test cards above to simulate payments</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
