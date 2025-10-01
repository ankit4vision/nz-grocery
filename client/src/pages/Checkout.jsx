import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useCartContext } from '../context';
import { DeliveryInfo, PaymentMethod, OrderSummary } from '../components/ui';
import './Checkout.css';

const Checkout = () => {
  const { items, totalPrice, totalItems } = useCartContext();
  const [deliveryInfo, setDeliveryInfo] = useState({
    deliveryType: 'home',
    selectedDays: ['monday'],
    timeSlot: '6:00 AM To 9:00 AM',
    deliveryInstruction: '',
    fullName: 'John Doe',
    phoneNumber: '+1 (555) 123-4567',
    emailAddress: 'john.doe@example.com',
    deliveryAddress: '123 Main Street, Downtown, New York, NY 10001'
  });

  const [paymentInfo, setPaymentInfo] = useState({
    paymentMethod: 'card',
    cardNumber: '1234 5678 9012 3456',
    expiryDate: '12/25',
    cvv: '123',
    cardholderName: 'John Doe'
  });

  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);

  const deliveryFee = 2.00;
  const taxRate = 0.035; // 3.5%
  const subtotal = Number(totalPrice) || 0;
  const tax = subtotal * taxRate;
  const total = subtotal + deliveryFee + tax;

  const handleDeliveryInfoChange = (field, value) => {
    setDeliveryInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePaymentInfoChange = (field, value) => {
    setPaymentInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePromoCodeApply = () => {
    // Mock promo code validation
    const validPromoCodes = {
      'SAVE10': { discount: 0.10, type: 'percentage' },
      'FREESHIP': { discount: deliveryFee, type: 'fixed' },
      'WELCOME20': { discount: 0.20, type: 'percentage' }
    };

    if (validPromoCodes[promoCode.toUpperCase()]) {
      setAppliedPromo(validPromoCodes[promoCode.toUpperCase()]);
    } else {
      alert('Invalid promo code');
    }
  };

  const handlePlaceOrder = () => {
    if (items.length === 0) {
      alert('Your cart is empty');
      return;
    }

    // Mock order placement
    const orderData = {
      deliveryInfo,
      paymentInfo,
      items,
      subtotal,
      deliveryFee,
      tax,
      total,
      promoCode: appliedPromo,
      orderDate: new Date().toISOString()
    };

    console.log('Order placed:', orderData);
    alert('Order placed successfully!');
  };

  if (items.length === 0) {
    return (
      <Container fluid="lg" className="checkout-container">
        <Row>
          <Col>
            <div className="empty-cart-message">
              <h2>Your cart is empty</h2>
              <p>Add some items to your cart before checkout.</p>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container fluid="lg" className="checkout-container">
      <Row>
        <Col>
          <div className="checkout-header">
            <h1 className="checkout-title">Checkout</h1>
            <p className="checkout-subtitle">Complete your order</p>
          </div>
        </Col>
      </Row>

      <Row className="checkout-content">
        <Col lg={7} md={12} className="mb-4 mb-lg-0">
          <div className="checkout-forms">
            <DeliveryInfo
              deliveryInfo={deliveryInfo}
              onDeliveryInfoChange={handleDeliveryInfoChange}
            />
            
            <PaymentMethod
              paymentInfo={paymentInfo}
              onPaymentInfoChange={handlePaymentInfoChange}
            />
          </div>
        </Col>

        <Col lg={5} md={12}>
          <div className="checkout-summary">
            <OrderSummary
              items={items}
              subtotal={subtotal}
              deliveryFee={deliveryFee}
              tax={tax}
              total={total}
              promoCode={promoCode}
              appliedPromo={appliedPromo}
              onPromoCodeChange={setPromoCode}
              onPromoCodeApply={handlePromoCodeApply}
              onPlaceOrder={handlePlaceOrder}
            />
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Checkout;
