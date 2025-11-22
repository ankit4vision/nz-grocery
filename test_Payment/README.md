# eGrocery Stripe Payment Test Frontend

This is a React frontend application designed to test the Stripe payment integration with your FastAPI backend.

## 🚀 Quick Start

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn
- Your FastAPI backend running on port 8000
- Stripe account with test keys

### Installation

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend_app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   # Copy the example environment file
   cp env.example .env
   
   # Edit .env file with your Stripe publishable key
   # Replace pk_test_your_publishable_key_here with your actual key
   ```

4. **Start the development server:**
   ```bash
   npm start
   ```

5. **Open your browser:**
   Navigate to `http://localhost:3000`

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the `frontend_app` directory with the following variables:

```env
# Stripe Configuration
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
REACT_APP_API_BASE_URL=http://localhost:8000

# Development settings
GENERATE_SOURCEMAP=false
```

### Getting Your Stripe Keys

1. **Log in to your Stripe Dashboard**
2. **Go to Developers > API Keys**
3. **Copy your Publishable key** (starts with `pk_test_`)
4. **Paste it in your `.env` file**

## 🧪 Testing the Application

### 1. Test Stripe Connection
- Click "Test Stripe Connection" on the home page
- This will verify your backend is properly configured

### 2. Test Payment Process
- Enter a test amount (in cents, e.g., 2000 for $20.00)
- Click "Start Test Payment"
- Use the test card numbers provided on the home page

### 3. Test Cards
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **3D Secure**: `4000 0025 0000 3155`

Use any future expiry date, any 3-digit CVC, and any postal code.

## 📁 Project Structure

```
frontend_app/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   └── PaymentForm.js
│   ├── pages/
│   │   ├── HomePage.js
│   │   ├── PaymentPage.js
│   │   └── PaymentSuccess.js
│   ├── stripe/
│   │   └── stripeProvider.js
│   ├── styles/
│   │   └── App.css
│   ├── App.js
│   └── index.js
├── package.json
├── env.example
└── README.md
```

## 🔗 API Endpoints

The application communicates with these backend endpoints:

- `GET /product-service/stripe/config` - Get Stripe configuration
- `POST /product-service/stripe/payment-intents` - Create payment intent
- `GET /product-service/stripe/payment-intents/{id}` - Get payment intent
- `POST /product-service/stripe/payment-intents/{id}/confirm` - Confirm payment
- `POST /product-service/stripe/webhooks` - Handle webhooks

## 🎯 Features

- ✅ **Payment Intent Creation** - Secure payment processing
- ✅ **Stripe Elements Integration** - PCI-compliant card input
- ✅ **Real-time Payment Status** - Live updates during payment
- ✅ **Error Handling** - Comprehensive error management
- ✅ **Responsive Design** - Works on all devices
- ✅ **Test Mode Support** - Safe testing environment

## 🚨 Troubleshooting

### Common Issues

1. **"Stripe connection failed"**
   - Check if your backend is running on port 8000
   - Verify your Stripe secret key is configured in the backend
   - Check browser console for detailed error messages

2. **"Payment form not loading"**
   - Verify your Stripe publishable key is correct
   - Check if the key starts with `pk_test_`
   - Ensure the key is properly set in the `.env` file

3. **"Payment failed"**
   - Use the correct test card numbers
   - Check if your backend webhook is properly configured
   - Verify the payment amount is valid (minimum 50 cents)

4. **"In order to create a payment element, you must pass a clientSecret"**
   - This error has been fixed in the current version
   - The PaymentIntent is now created before rendering the payment form
   - Make sure your backend is running and accessible

### Debug Mode

Enable debug logging by opening browser developer tools and checking the console for detailed error messages.

## 🔒 Security Notes

- This is a **test application** - never use real card numbers
- The publishable key is safe to expose in frontend code
- Never expose your Stripe secret key in frontend code
- Always use HTTPS in production

## 📚 Additional Resources

- [Stripe Documentation](https://stripe.com/docs)
- [React Stripe.js Documentation](https://stripe.com/docs/stripe-js/react)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)

## 🤝 Support

If you encounter any issues:

1. Check the browser console for error messages
2. Verify your backend is running and accessible
3. Ensure all environment variables are correctly set
4. Test with the provided test card numbers

## 🎉 Success!

Once everything is working, you should be able to:
- Create payment intents
- Process test payments
- See payment confirmations
- Handle payment errors gracefully

Your Stripe integration is now ready for production! 🚀
