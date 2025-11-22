import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

// Initialize Stripe with publishable key from environment
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

/**
 * StripeProvider - Wraps payment components with Stripe Elements
 * 
 * @param {object} props
 * @param {React.ReactNode} props.children - Child components
 * @param {string} props.clientSecret - Payment intent client secret (required for payment)
 * @returns {JSX.Element}
 */
export const StripeProvider = ({ children, clientSecret }) => {
  const options = clientSecret ? { clientSecret } : {};
  
  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  );
};

export default StripeProvider;

