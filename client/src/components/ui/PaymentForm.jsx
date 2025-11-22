import React, { useState } from 'react';
import { Button, Alert } from 'react-bootstrap';
import {
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import '../../styles/components/ui-components/payment-form.css';

/**
 * PaymentForm - Stripe payment form component
 * 
 * @param {object} props
 * @param {string|number} props.orderId - Order ID
 * @param {function} props.onSuccess - Callback when payment succeeds
 * @param {function} props.onError - Callback when payment fails
 * @returns {JSX.Element}
 */
const PaymentForm = ({ orderId, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
        },
        redirect: 'if_required',
      });

      if (error) {
        if (error.type === 'card_error' || error.type === 'validation_error') {
          setMessage(error.message);
        } else {
          setMessage('An unexpected error occurred.');
        }
        onError?.(error);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        setMessage('Payment succeeded!');
        onSuccess?.(paymentIntent);
      }
    } catch (err) {
      console.error('Payment error:', err);
      setMessage('An unexpected error occurred.');
      onError?.(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="payment-form">
      <div className="payment-element-container">
        <PaymentElement 
          id="payment-element"
          options={{
            layout: 'tabs'
          }}
        />
      </div>
      
      <Button
        type="submit"
        variant="success"
        size="lg"
        disabled={isLoading || !stripe || !elements}
        className="payment-button w-100 mt-3"
      >
        {isLoading ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            Processing...
          </>
        ) : (
          'Pay Now'
        )}
      </Button>
      
      {message && (
        <Alert 
          variant={message.includes('succeeded') ? 'success' : 'danger'}
          className="mt-3 payment-message"
        >
          {message}
        </Alert>
      )}
    </form>
  );
};

export default PaymentForm;

