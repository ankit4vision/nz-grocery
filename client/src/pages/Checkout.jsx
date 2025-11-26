import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useCartContext, useUserContext } from '../context';
import { DeliveryInfo, PaymentMethod, OrderSummary } from '../components/ui';
import { Loader } from '../components/common';
import OrdersService from '../services/api/orders';
import UsersService from '../services/api/users';
import CartService from '../services/api/cart';
import './Checkout.css';

const Checkout = () => {
  const { items: cartItems, totalPrice: cartTotalPrice, totalItems, clearCart, isLoading: cartLoading, cartId } = useCartContext();
  const { user, isAuthenticated } = useUserContext();
  const navigate = useNavigate();
  
  // State for checkout data (loaded from API)
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [checkoutSummary, setCheckoutSummary] = useState({
    subtotal: 0,
    discount_amount: 0,
    total_amount: 0
  });
  const [loadingCheckoutData, setLoadingCheckoutData] = useState(true);
  const [checkoutDataError, setCheckoutDataError] = useState(null);
  
  // State for addresses and user data
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [addressesError, setAddressesError] = useState(null);
  
  // State for order creation
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [orderError, setOrderError] = useState(null);
  
  // Delivery info state
  const [deliveryInfo, setDeliveryInfo] = useState({
    deliveryType: 'delivery', // 'delivery' or 'pickup'
    selectedDays: ['monday'],
    timeSlot: '6:00 AM To 9:00 AM',
    deliveryInstruction: '',
    fullName: '',
    phoneNumber: '',
    emailAddress: '',
    deliveryAddress: '',
    addressId: null
  });

  const [paymentInfo, setPaymentInfo] = useState({
    paymentMethod: 'card', // 'card', 'cod', etc.
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });

  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);

  // Load checkout data (cart items and summary) on mount
  useEffect(() => {
    if (isAuthenticated && cartId) {
      loadCheckoutData();
    } else if (isAuthenticated && !cartLoading) {
      // Cart might not be loaded yet, wait a bit
      const timer = setTimeout(() => {
        if (cartId) {
          loadCheckoutData();
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, cartId, cartLoading]);

  // Load user addresses on mount
  useEffect(() => {
    if (isAuthenticated) {
      loadUserAddresses();
      // Pre-fill user info from context
      if (user) {
        setDeliveryInfo(prev => ({
          ...prev,
          fullName: `${user.first_name || ''} ${user.last_name || ''}`.trim() || prev.fullName,
          emailAddress: user.email || prev.emailAddress,
          phoneNumber: user.phone || prev.phoneNumber
        }));
      }
    }
  }, [isAuthenticated, user]);

  // Load checkout data from API (cart items and summary)
  const loadCheckoutData = async () => {
    if (!cartId) {
      setCheckoutDataError('Cart not found. Please add items to cart first.');
      setLoadingCheckoutData(false);
      return;
    }

    setLoadingCheckoutData(true);
    setCheckoutDataError(null);

    try {
      // Load cart items with pricing (includes product and variant metadata now)
      const itemsResponse = await CartService.getCartItemsWithPricing(cartId);

      if (itemsResponse.success && itemsResponse.data) {
        const cartData = itemsResponse.data;
        const cartItems = cartData.items || [];
        setCheckoutItems(cartItems);

        // Backend now returns total_amount as part of this response.
        // We use that value for both subtotal and total since there are no extra fees.
        const totalAmountFromApi = Number(cartData.total_amount ?? 0);
        const fallbackSubtotal = cartItems.reduce((sum, item) => sum + (item.total_price || 0), 0);
        const subtotal = totalAmountFromApi || fallbackSubtotal;

        setCheckoutSummary({
          subtotal,
          discount_amount: cartData.discount_amount || 0,
          total_amount: subtotal
        });
      } else {
        setCheckoutDataError(itemsResponse.message || 'Failed to load cart items');
      }
    } catch (error) {
      console.error('Error loading checkout data:', error);
      setCheckoutDataError('Failed to load checkout data. Please try again.');
    } finally {
      setLoadingCheckoutData(false);
    }
  };

  // Load user addresses
  const loadUserAddresses = async () => {
    setLoadingAddresses(true);
    setAddressesError(null);
    try {
      const response = await UsersService.getUserAddresses({ only_active: true });
      if (response.success) {
        const userAddresses = response.data || [];
        setAddresses(userAddresses);
        
        // Auto-select default address if available
        const defaultAddress = userAddresses.find(addr => addr.is_default);
        if (defaultAddress) {
          setSelectedAddressId(defaultAddress.address_id);
          setDeliveryInfo(prev => ({
            ...prev,
            addressId: defaultAddress.address_id,
            deliveryAddress: formatAddress(defaultAddress)
          }));
        } else if (userAddresses.length > 0) {
          // Select first address if no default
          setSelectedAddressId(userAddresses[0].address_id);
          setDeliveryInfo(prev => ({
            ...prev,
            addressId: userAddresses[0].address_id,
            deliveryAddress: formatAddress(userAddresses[0])
          }));
        }
      } else {
        setAddressesError(response.message || 'Failed to load addresses');
      }
    } catch (error) {
      setAddressesError('Failed to load addresses. Please try again.');
      console.error('Error loading addresses:', error);
    } finally {
      setLoadingAddresses(false);
    }
  };

  // Format address for display
  const formatAddress = (address) => {
    if (!address) return '';
    const parts = [
      address.street_address,
      address.city,
      address.state,
      address.postal_code,
      address.country
    ].filter(Boolean);
    return parts.join(', ');
  };

  // Use checkout summary from API (or fallback to cart context)
  const subtotal = checkoutSummary.subtotal || cartTotalPrice || 0;
  const discountAmount = checkoutSummary.discount_amount || 0;
  const total = checkoutSummary.total_amount || Math.max(0, subtotal - discountAmount);
  
  // Use checkout items (or fallback to cart items)
  const items = checkoutItems.length > 0 ? checkoutItems : cartItems;

  const handleDeliveryInfoChange = (field, value) => {
    setDeliveryInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddressSelect = (addressId) => {
    setSelectedAddressId(addressId);
    const selectedAddress = addresses.find(addr => addr.address_id === addressId);
    if (selectedAddress) {
      setDeliveryInfo(prev => ({
        ...prev,
        addressId: addressId,
        deliveryAddress: formatAddress(selectedAddress)
      }));
    }
  };

  const handlePaymentInfoChange = (field, value) => {
    setPaymentInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePromoCodeApply = () => {
    // Mock promo code validation (can be replaced with API call later)
    const validPromoCodes = {
      'SAVE10': { discount: 0.10, type: 'percentage' },
      'WELCOME20': { discount: 0.20, type: 'percentage' }
    };

    if (validPromoCodes[promoCode.toUpperCase()]) {
      const promo = validPromoCodes[promoCode.toUpperCase()];
      setAppliedPromo(promo);
      
      // Update discount in summary
      const discount_amount = promo.type === 'percentage' 
        ? subtotal * promo.discount 
        : promo.discount;
      
      setCheckoutSummary(prev => ({
        ...prev,
        discount_amount: discount_amount,
        total_amount: Math.max(0, (prev.subtotal || subtotal) - discount_amount)
      }));
    } else {
      alert('Invalid promo code');
    }
  };

  // Transform cart items to order items format
  // CartItemWithDetails/CartItemWithPricing has: product_id, variant_id, quantity, base_price, sale_price, discounted_sale_price, total_price
  // CartItemWithDetails also has: product_name, variant_name
  // OrderItemCreate requires: product_id, variant_id, product_name, variant_name (optional), quantity, unit_price, total_price
  const transformCartItemsToOrderItems = () => {
    return items.map(item => {
      // Determine unit price - use discounted_sale_price if available, otherwise sale_price, otherwise base_price
      // This is the price per unit that was used for calculations
      const unit_price = item.discounted_sale_price ?? item.sale_price ?? item.base_price ?? 0;
      
      // Use total_price from API (already calculated with quantity and discounts)
      // Fallback to calculated value if not provided
      const calculated_total_price = item.total_price ?? (unit_price * (item.quantity || 1));
      
      // Get product name - CartItemWithDetails has it, CartItemWithPricing might not
      const product_name = item.product_name || `Product ${item.product_id || ''}`.trim() || 'Product';
      
      return {
        product_id: item.product_id || null,
        variant_id: item.variant_id || null,
        product_name: product_name,
        variant_name: item.variant_name || null,
        quantity: item.quantity || 1,
        unit_price: unit_price,
        total_price: calculated_total_price
      };
    });
  };

  // Transform delivery preferences
  const transformDeliveryPreferences = () => {
    if (!deliveryInfo.selectedDays || deliveryInfo.selectedDays.length === 0) {
      return null;
    }

    // Map day names to proper format
    const dayMap = {
      'monday': 'Monday',
      'tuesday': 'Tuesday',
      'wednesday': 'Wednesday',
      'thursday': 'Thursday',
      'friday': 'Friday',
      'saturday': 'Saturday',
      'sunday': 'Sunday'
    };

    return deliveryInfo.selectedDays.map(day => ({
      preferred_day: dayMap[day] || day.charAt(0).toUpperCase() + day.slice(1),
      preferred_time_slot: deliveryInfo.timeSlot || 'All Day'
    }));
  };

  // Create order
  const handlePlaceOrder = async () => {
    if (items.length === 0) {
      alert('Your cart is empty');
      return;
    }

    if (!isAuthenticated) {
      alert('Please login to place an order');
      navigate('/');
      return;
    }

    // Validate required fields
    if (deliveryInfo.deliveryType === 'delivery' && !selectedAddressId) {
      alert('Please select a delivery address');
      return;
    }

    setIsCreatingOrder(true);
    setOrderError(null);

    try {
      // Transform data to API format
      const orderItems = transformCartItemsToOrderItems();
      const deliveryPreferences = transformDeliveryPreferences();

    const orderData = {
        vendor_id: 0, // Default vendor ID
        order_type: deliveryInfo.deliveryType, // 'delivery' or 'pickup'
        delivery_address_id: deliveryInfo.deliveryType === 'delivery' ? selectedAddressId : null,
        pickup_address_id: deliveryInfo.deliveryType === 'pickup' ? selectedAddressId : null,
        items: orderItems,
        subtotal: checkoutSummary.subtotal || subtotal,
        tax_amount: 0,
        shipping_fee: 0,
        discount_amount: checkoutSummary.discount_amount || discountAmount,
        total_amount: checkoutSummary.total_amount || total,
        payment_method_id: 0, // Default payment method ID
        delivery_instructions: deliveryInfo.deliveryInstruction || null,
        estimated_delivery_time: null, // Can be calculated on backend
        delivery_preferences: deliveryPreferences.length > 0 ? deliveryPreferences : null
      };

      console.log('Creating order with data:', orderData);

      // Create order via API
      const response = await OrdersService.createOrder(orderData);

      if (response.success) {
        const createdOrder = response.data;
        const orderId = createdOrder.order_id || createdOrder.id;

        console.log('Order created successfully:', createdOrder);
    
    // Clear cart after successful order
    clearCart();
    
        // Redirect based on payment method
        if (paymentInfo.paymentMethod === 'card') {
          // Redirect to payment page with order ID
          navigate('/payment', {
            state: {
              orderId: orderId,
              orderData: createdOrder
            }
          });
        } else if (paymentInfo.paymentMethod === 'cod') {
          // For COD, redirect directly to order details
          navigate(`/order/${orderId}`);
        } else {
          // Default: redirect to order details
    navigate(`/order/${orderId}`);
        }
      } else {
        setOrderError(response.message || 'Failed to create order. Please try again.');
        console.error('Order creation failed:', response);
      }
    } catch (error) {
      console.error('Error creating order:', error);
      setOrderError('An error occurred while creating your order. Please try again.');
    } finally {
      setIsCreatingOrder(false);
    }
  };

  // Check authentication
  if (!isAuthenticated) {
    return (
      <Container fluid="lg" className="checkout-container">
        <Row>
          <Col>
            <Alert variant="warning" className="mt-4">
              <Alert.Heading>Authentication Required</Alert.Heading>
              <p>Please login to proceed with checkout.</p>
            </Alert>
          </Col>
        </Row>
      </Container>
    );
  }

  // Check if cart is empty
  if (items.length === 0 && !cartLoading) {
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

  // Show loading while cart or checkout data is loading
  if (cartLoading || loadingCheckoutData) {
    return (
      <Container fluid="lg" className="checkout-container">
        <Row>
          <Col className="text-center" style={{ minHeight: '400px', paddingTop: '100px' }}>
            <Loader />
            <p className="mt-3">Loading checkout data...</p>
          </Col>
        </Row>
      </Container>
    );
  }

  // Show error if checkout data failed to load
  if (checkoutDataError && items.length === 0) {
    return (
      <Container fluid="lg" className="checkout-container">
        <Row>
          <Col>
            <Alert variant="danger" className="mt-4">
              <Alert.Heading>Failed to Load Checkout Data</Alert.Heading>
              <p>{checkoutDataError}</p>
              <button 
                className="btn btn-primary"
                onClick={loadCheckoutData}
              >
                Retry
              </button>
            </Alert>
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

      {/* Error Messages */}
      {orderError && (
        <Row>
          <Col>
            <Alert variant="danger" dismissible onClose={() => setOrderError(null)}>
              <Alert.Heading>Order Creation Failed</Alert.Heading>
              <p>{orderError}</p>
            </Alert>
          </Col>
        </Row>
      )}

      <Row className="checkout-content">
        <Col lg={7} md={12} className="mb-4 mb-lg-0">
          <div className="checkout-forms">
            <DeliveryInfo
              deliveryInfo={deliveryInfo}
              onDeliveryInfoChange={handleDeliveryInfoChange}
              addresses={addresses}
              selectedAddressId={selectedAddressId}
              onAddressSelect={handleAddressSelect}
              loadingAddresses={loadingAddresses}
              addressesError={addressesError}
              onReloadAddresses={loadUserAddresses}
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
              total={total}
              discountAmount={discountAmount}
              promoCode={promoCode}
              appliedPromo={appliedPromo}
              onPromoCodeChange={setPromoCode}
              onPromoCodeApply={handlePromoCodeApply}
              onPlaceOrder={handlePlaceOrder}
              isCreatingOrder={isCreatingOrder}
            />
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Checkout;
