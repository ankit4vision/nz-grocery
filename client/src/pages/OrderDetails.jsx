import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Alert, Card } from 'react-bootstrap';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { FaHome, FaArrowLeft, FaExclamationTriangle } from 'react-icons/fa';
import { OrderStatus, OrderSummaryBreakdown, OrderItems, PurchaseNote } from '../components/ui';
import { Loader } from '../components/common';
import { usePageTitle } from '../hooks';
import OrdersService from '../services/api/orders';
import { useUserContext } from '../context';
import './OrderDetails.css';

const OrderDetails = () => {
  const { orderId } = useParams();
  const { user } = useUserContext();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if user came from dashboard orders
  const cameFromDashboard = location.state?.from === 'dashboard';

  // Set page title dynamically based on order
  usePageTitle(
    orderData ? `Order #${orderData.order_number || orderId}` : 'Order Details',
    orderData 
      ? `Track your order #${orderData.order_number || orderId} at Farm2Fridge. View order status, items, and delivery information.`
      : 'View your order details, track delivery status, and manage your order at Farm2Fridge.'
  );

  useEffect(() => {
    if (orderId) {
      loadOrderDetails();
    }
  }, [orderId]);

  const loadOrderDetails = async () => {
      setLoading(true);
    setError(null);

    try {
      const response = await OrdersService.getOrderDetails(orderId);

      if (response.success && response.data) {
        const order = response.data;
        setOrderData(order);
      } else {
        setError(response.message || 'Failed to load order details');
      }
    } catch (err) {
      console.error('Error loading order details:', err);
      setError('An error occurred while loading order details. Please try again.');
    } finally {
        setLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  // Format date with time
  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
  };

  // Format address for display
  const formatAddress = (address) => {
    if (!address) return 'N/A';
    const parts = [
      address.address_line1,
      address.address_line2,
      address.city,
      address.state,
      address.postal_code,
      address.country
    ].filter(Boolean);
    return parts.join(', ') || 'N/A';
  };

  // Get payment method display name
  const getPaymentMethodName = (order) => {
    if (order.stripe_payment_intent_id) {
      return 'Stripe';
    }
    if (order.payment_method_id === 0 || !order.payment_method_id) {
      return 'Cash on Delivery';
    }
    return 'Cash on Delivery'; // Default
  };

  // Map payment status to component format
  const getPaymentStatus = (paymentStatus) => {
    switch (paymentStatus) {
      case 'paid':
        return 'payment-success';
      case 'pending':
        return 'payment-pending';
      case 'failed':
        return 'payment-failed';
      case 'refunded':
        return 'payment-refunded';
      default:
        return 'payment-pending';
    }
  };

  // Generate progress steps based on order status
  const getProgressSteps = (orderStatus, orderType) => {
    const steps = [
      { title: 'Order Placed', description: 'Your order has been received', status: 'completed' },
      { title: 'Order Confirmed', description: 'Order confirmed and being prepared', status: 'pending' },
      { title: 'Processing', description: 'Your order is being processed', status: 'pending' },
    ];

    if (orderType === 'delivery') {
      steps.push(
        { title: 'Out for Delivery', description: 'Your order is on the way', status: 'pending' },
        { title: 'Delivered', description: 'Order delivered successfully', status: 'pending' }
      );
    } else {
      steps.push(
        { title: 'Ready for Pickup', description: 'Your order is ready for pickup', status: 'pending' },
        { title: 'Picked Up', description: 'Order picked up successfully', status: 'pending' }
      );
    }

    // Handle cancelled and refunded statuses
    if (orderStatus === 'cancelled') {
      return steps.map((step, index) => ({
        ...step,
        status: index === 0 ? 'completed' : 'cancelled',
        description: index === 0 ? step.description : 'Order was cancelled'
      }));
    }

    if (orderStatus === 'refunded') {
      return steps.map((step, index) => ({
        ...step,
        status: index === 0 ? 'completed' : 'refunded',
        description: index === 0 ? step.description : 'Order was refunded'
      }));
    }

    // Update step statuses based on order status
    const statusMap = {
      'pending': 0,
      'confirmed': 1,
      'processing': 2,
      'ready_for_pickup': orderType === 'pickup' ? 3 : (orderType === 'delivery' ? 2 : 2),
      'out_for_delivery': 3,
      'delivered': 4
    };

    const currentStep = statusMap[orderStatus] || 0;

    return steps.map((step, index) => {
      if (index < currentStep) {
        return { ...step, status: 'completed' };
      } else if (index === currentStep) {
        return { ...step, status: 'current' };
      } else {
        return { ...step, status: 'pending' };
      }
    });
  };

  // Get order status display info
  const getOrderStatusInfo = (orderStatus) => {
    switch (orderStatus) {
      case 'pending':
        return { text: 'Pending', variant: 'warning', color: 'warning' };
      case 'confirmed':
        return { text: 'Confirmed', variant: 'info', color: 'info' };
      case 'processing':
        return { text: 'Processing', variant: 'primary', color: 'primary' };
      case 'ready_for_pickup':
        return { text: 'Ready for Pickup', variant: 'success', color: 'success' };
      case 'out_for_delivery':
        return { text: 'Out for Delivery', variant: 'info', color: 'info' };
      case 'delivered':
        return { text: 'Delivered', variant: 'success', color: 'success' };
      case 'cancelled':
        return { text: 'Cancelled', variant: 'danger', color: 'danger' };
      case 'refunded':
        return { text: 'Refunded', variant: 'secondary', color: 'secondary' };
      default:
        return { text: orderStatus, variant: 'secondary', color: 'secondary' };
    }
  };

  // Transform order items for OrderItems component
  const transformOrderItems = (items) => {
    if (!items || !Array.isArray(items)) return [];
    
    return items.map(item => ({
      id: item.order_item_id || item.product_id,
      name: item.variant_name || item.product_name || 'Product',
      image: item.variant_image_url || null, // Use variant_image_url from API response
      quantity: item.quantity || 1,
      unit: 'piece',
      price: item.total_price || item.unit_price || 0,
      productName: item.product_name,
      variantName: item.variant_name
    }));
  };

  // Calculate total items count
  const getTotalItemsCount = (items) => {
    if (!items || !Array.isArray(items)) return 0;
    return items.reduce((sum, item) => sum + (item.quantity || 0), 0);
  };

  if (loading) {
    return (
      <Container fluid="lg" className="order-details-container">
        <Row>
          <Col>
            <div className="loading-message">
              <Loader />
              <h2 className="mt-3">Loading order details...</h2>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }

  if (error && !orderData) {
    return (
      <Container fluid="lg" className="order-details-container">
        <Row>
          <Col>
            <div className="error-message">
              <FaExclamationTriangle size={48} className="text-danger mb-3" />
              <h2>Error Loading Order</h2>
              <p>{error}</p>
              <div className="d-flex gap-2 justify-content-center">
                <Button variant="primary" onClick={loadOrderDetails}>
                  Try Again
                </Button>
                <Link to="/" className="btn btn-outline-primary">
                  <FaHome className="me-2" />
                  Back to Home
                </Link>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }

  if (!orderData) {
    return (
      <Container fluid="lg" className="order-details-container">
        <Row>
          <Col>
            <div className="error-message">
              <h2>Order not found</h2>
              <p>The order you're looking for doesn't exist.</p>
              <Link to="/" className="btn btn-primary">
                <FaHome className="me-2" />
                Back to Home
              </Link>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }

  const progressSteps = getProgressSteps(orderData.order_status, orderData.order_type);
  const transformedItems = transformOrderItems(orderData.items);
  const totalItemsCount = getTotalItemsCount(orderData.items);

  return (
    <Container fluid="lg" className="order-details-container">
      {/* Back Navigation */}
      <Row>
        <Col>
          <div className="back-to-home">
            {cameFromDashboard ? (
              <Button 
                variant="outline-primary" 
                className="back-link"
                onClick={() => navigate('/dashboard?tab=orders')}
              >
                <FaArrowLeft className="me-2" />
                <span className="back-text">Back to Orders</span>
              </Button>
            ) : (
              <Link to="/" className="back-link">
                <FaArrowLeft className="me-2" />
                <span className="back-text">Back to Home</span>
              </Link>
            )}
            <div className="order-details-breadcrumb">
              <span className="breadcrumb-item">
                <Link to="/">Home</Link>
              </span>
              <span className="breadcrumb-separator">/</span>
              {cameFromDashboard && (
                <>
                  <span className="breadcrumb-item">
                    <Link to="/dashboard?tab=orders">My Orders</Link>
                  </span>
                  <span className="breadcrumb-separator">/</span>
                </>
              )}
              <span className="breadcrumb-item active">Order Details</span>
            </div>
          </div>
        </Col>
      </Row>

      {/* Error Alert */}
      {error && (
        <Row>
          <Col>
            <Alert variant="warning" dismissible onClose={() => setError(null)}>
              <Alert.Heading>Notice</Alert.Heading>
              <p>{error}</p>
            </Alert>
          </Col>
        </Row>
      )}

      {/* Cancelled/Refunded Alert */}
      {orderData && (orderData.order_status === 'cancelled' || orderData.order_status === 'refunded') && (
        <Row>
          <Col>
            <Alert 
              variant={orderData.order_status === 'cancelled' ? 'danger' : 'secondary'}
              className="mb-4"
            >
              <Alert.Heading>
                {orderData.order_status === 'cancelled' ? 'Order Cancelled' : 'Order Refunded'}
              </Alert.Heading>
              <p className="mb-0">
                {orderData.order_status === 'cancelled' 
                  ? 'This order has been cancelled.' + (orderData.cancellation_reason ? ` Reason: ${orderData.cancellation_reason}` : '')
                  : 'This order has been refunded. If you paid via card, the refund will be processed to your original payment method.'}
              </p>
            </Alert>
          </Col>
        </Row>
      )}

      {/* Ready for Pickup Alert */}
      {orderData && orderData.order_status === 'ready_for_pickup' && orderData.order_type === 'pickup' && (
        <Row>
          <Col>
            <Alert variant="success" className="mb-4">
              <Alert.Heading>Order Ready for Pickup!</Alert.Heading>
              <p className="mb-0">
                Your order is ready for pickup. Please visit the store to collect your items.
              </p>
            </Alert>
          </Col>
        </Row>
      )}

      {/* Main Order Details Card */}
      <Row>
        <Col>
          <div className="order-details-card">
            {/* Order Status Section */}
            <OrderStatus
              orderNumber={orderData.order_number || `#${orderData.order_id}`}
              orderDate={formatDate(orderData.created_at)}
              totalAmount={orderData.total_amount}
              paymentMethod={getPaymentMethodName(orderData)}
              paymentStatus={getPaymentStatus(orderData.payment_status)}
              orderStatus={orderData.order_status}
              progressSteps={progressSteps}
              orderStatusInfo={getOrderStatusInfo(orderData.order_status)}
            />

            {/* Order Summary Section */}
            <Row className="order-summary-section">
              <Col lg={6} md={12} className="mb-4 mb-lg-0">
                <OrderSummaryBreakdown
                  subtotal={orderData.subtotal || 0}
                  shippingCharge={orderData.shipping_fee || 0}
                  gst={orderData.tax_amount || 0}
                  discount={orderData.discount_amount || 0}
                  total={orderData.total_amount || 0}
                />
              </Col>
              <Col lg={6} md={12}>
                <Card className="order-details-info-card">
                  <Card.Header className="order-info-header">
                    <h3 className="order-info-title">Order Information</h3>
                  </Card.Header>
                  <Card.Body className="order-info-body">
                    <div className="order-info-grid">
                      <div className="info-item">
                        <div className="info-label">Order Type</div>
                        <div className="info-value">
                          <span className={`info-badge ${orderData.order_type === 'delivery' ? 'badge-delivery' : 'badge-pickup'}`}>
                            {orderData.order_type === 'delivery' ? 'Delivery' : 'Pickup'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="info-item">
                        <div className="info-label">Total Items</div>
                        <div className="info-value">{totalItemsCount} items</div>
                      </div>
                      
                      {orderData.estimated_delivery_time && (
                        <div className="info-item">
                          <div className="info-label">Estimated Delivery</div>
                          <div className="info-value">{formatDateTime(orderData.estimated_delivery_time)}</div>
                        </div>
                      )}
                      
                      {orderData.actual_delivery_time && (
                        <div className="info-item">
                          <div className="info-label">Delivered On</div>
                          <div className="info-value info-value-success">
                            {formatDateTime(orderData.actual_delivery_time)}
                          </div>
                        </div>
                      )}
                      
                      {orderData.delivery_address && (
                        <div className="info-item info-item-full">
                          <div className="info-label">Delivery Address</div>
                          <div className="info-value info-value-address">
                            {formatAddress(orderData.delivery_address)}
                          </div>
                        </div>
                      )}
                      
                      {orderData.delivery_preferences && orderData.delivery_preferences.length > 0 && (
                        <div className="info-item info-item-full">
                          <div className="info-label">Delivery Preferences</div>
                          <div className="info-value info-value-preferences">
                            {orderData.delivery_preferences.map((pref, index) => (
                              <div key={pref.preference_id || index} className="preference-item">
                                <span className="preference-day">{pref.preferred_day}</span>
                                {pref.preferred_time_slot && (
                                  <span className="preference-time"> - {pref.preferred_time_slot}</span>
                                )}
                                {pref.is_available === false && (
                                  <span className="preference-unavailable"> (Not Available)</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {orderData.cancellation_reason && (
                        <div className="info-item info-item-full">
                          <div className="info-label">Cancellation Reason</div>
                          <div className="info-value info-value-error">
                            {orderData.cancellation_reason}
                          </div>
                        </div>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Order Items Section */}
            <OrderItems items={transformedItems} />

            {/* Purchase Note Section */}
            {orderData.delivery_instructions && (
              <PurchaseNote note={orderData.delivery_instructions} />
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default OrderDetails;
