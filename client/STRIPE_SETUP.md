# Stripe Payment Integration Setup

## 📦 Required Dependencies

Install Stripe dependencies for payment processing:

```bash
npm install @stripe/stripe-js @stripe/react-stripe-js
```

## 🔑 Environment Configuration

Add your Stripe publishable key to your environment file (`.env.local`, `.env.staging`, or `.env.production`):

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
```

**Note**: 
- Use `pk_test_...` for test mode
- Use `pk_live_...` for production mode

## 📁 Files Created/Updated

### New Files:
1. `client/src/services/api/stripe.js` - Stripe payment service
2. `client/src/components/stripe/StripeProvider.jsx` - Stripe Elements provider
3. `client/src/components/ui/PaymentForm.jsx` - Payment form component
4. `client/src/pages/Payment.jsx` - Payment page
5. `client/src/pages/PaymentSuccess.jsx` - Payment success page
6. `client/src/pages/Payment.css` - Payment page styles
7. `client/src/pages/PaymentSuccess.css` - Payment success page styles
8. `client/src/styles/components/ui-components/payment-form.css` - Payment form styles

### Updated Files:
1. `client/src/App.jsx` - Added payment routes
2. `client/src/utils/constants.js` - Added Stripe API endpoints
3. `client/src/services/api/index.js` - Exported StripeService
4. `client/src/components/ui/index.js` - Exported PaymentForm
5. `client/env.example` - Added Stripe publishable key variable

## 🔄 Payment Flow

1. **Checkout Page** → User fills delivery info and payment method
2. **Order Creation** → Order is created via `POST /orders/`
3. **Payment Page** → 
   - Creates payment intent via `POST /product-service/stripe/payment-intents`
   - Displays Stripe payment form
   - Processes payment
4. **Payment Success** → 
   - Shows payment confirmation
   - Displays order details
   - Redirects to order details page

## 🛠️ API Endpoints Used

- `POST /product-service/stripe/payment-intents` - Create payment intent
- `GET /product-service/stripe/payment-intents/{id}` - Get payment intent
- `POST /product-service/stripe/payment-intents/{id}/confirm` - Confirm payment intent

## ✅ Testing

1. Use Stripe test cards: https://stripe.com/docs/testing
2. Test successful payment: `4242 4242 4242 4242`
3. Test declined payment: `4000 0000 0000 0002`

## 📝 Notes

- Payment page requires `orderId` from checkout
- Payment intent is created automatically when payment page loads
- Payment success page loads order details from API
- All payment processing is handled securely by Stripe

