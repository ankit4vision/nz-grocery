import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { FaHome, FaArrowLeft, FaList } from 'react-icons/fa';
import { OrderStatus, OrderSummaryBreakdown, OrderItems, PurchaseNote } from '../components/ui';
import { orderDetailsData } from '../data/mockData';
import './OrderDetails.css';

const OrderDetails = () => {
  const { orderId } = useParams();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if user came from dashboard orders
  const cameFromDashboard = location.state?.from === 'dashboard';

  useEffect(() => {
    // Simulate API call to fetch order details
    const fetchOrderDetails = () => {
      setLoading(true);
      
      // Mock API delay
      setTimeout(() => {
        // Find order by ID or use default
        const order = orderDetailsData.find(order => order.id === orderId) || orderDetailsData[0];
        setOrderData(order);
        setLoading(false);
      }, 1000);
    };

    fetchOrderDetails();
  }, [orderId]);

  if (loading) {
    return (
      <Container fluid="lg" className="order-details-container">
        <Row>
          <Col>
            <div className="loading-message">
              <h2>Loading order details...</h2>
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

      {/* Main Order Details Card */}
      <Row>
        <Col>
          <div className="order-details-card">
            {/* Order Status Section */}
            <OrderStatus
              orderNumber={orderData.orderNumber}
              orderDate={orderData.orderDate}
              totalAmount={orderData.totalAmount}
              paymentMethod={orderData.paymentMethod}
              paymentStatus={orderData.paymentStatus}
              orderStatus={orderData.orderStatus}
              progressSteps={orderData.progressSteps}
            />

            {/* Order Summary Section */}
            <Row className="order-summary-section">
              <Col lg={6} md={12} className="mb-4 mb-lg-0">
                <OrderSummaryBreakdown
                  subtotal={orderData.subtotal}
                  shippingCharge={orderData.shippingCharge}
                  gst={orderData.gst}
                  discount={orderData.discount}
                  total={orderData.totalAmount}
                />
              </Col>
              <Col lg={6} md={12}>
                <div className="order-details-info">
                  <h3 className="section-title">Order Details</h3>
                  <div className="detail-item">
                    <span className="detail-label">Name:</span>
                    <span className="detail-value">{orderData.customerName}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Total Item:</span>
                    <span className="detail-value">{orderData.totalItems} items</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Deliver Time:</span>
                    <span className="detail-value">{orderData.deliveryTime}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Shipping Address:</span>
                    <span className="detail-value">{orderData.shippingAddress}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Billing Address:</span>
                    <span className="detail-value">{orderData.billingAddress}</span>
                  </div>
                </div>
              </Col>
            </Row>

            {/* Order Items Section */}
            <OrderItems items={orderData.items} />

            {/* Purchase Note Section */}
            <PurchaseNote note={orderData.purchaseNote} />
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default OrderDetails;
