import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Badge, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faShoppingBag, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { CustomButton } from '../common';
import OrdersService from '../../services/api/orders';
import '../../styles/components/ui-components/my-orders.css';

const MyOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await OrdersService.getOrders({ limit: 50 });
      if (response.success) {
        // API returns array directly in response.data
        const ordersData = Array.isArray(response.data) ? response.data : [];
        // Sort orders by created_at descending (newest first)
        const sortedOrders = ordersData.sort((a, b) => {
          const dateA = new Date(a.created_at || 0);
          const dateB = new Date(b.created_at || 0);
          return dateB - dateA;
        });
        setOrders(sortedOrders);
      } else {
        setError(response.message || 'Failed to load orders');
      }
    } catch (err) {
      console.error('Error loading orders:', err);
      setError('An error occurred while loading orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (err) {
      return dateString;
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (err) {
      return dateString;
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { bg: 'warning', text: 'Pending' },
      confirmed: { bg: 'info', text: 'Confirmed' },
      processing: { bg: 'primary', text: 'Processing' },
      ready_for_pickup: { bg: 'info', text: 'Ready for Pickup' },
      out_for_delivery: { bg: 'info', text: 'Out for Delivery' },
      delivered: { bg: 'success', text: 'Delivered' },
      cancelled: { bg: 'danger', text: 'Cancelled' },
      refunded: { bg: 'secondary', text: 'Refunded' },
    };

    const config = statusConfig[status] || { bg: 'secondary', text: status };
    return <Badge bg={config.bg} className="status-badge">{config.text}</Badge>;
  };

  const getPaymentStatusBadge = (paymentStatus) => {
    const statusConfig = {
      pending: { bg: 'warning', text: 'Payment Pending' },
      paid: { bg: 'success', text: 'Paid' },
      failed: { bg: 'danger', text: 'Payment Failed' },
      refunded: { bg: 'secondary', text: 'Refunded' },
    };

    const config = statusConfig[paymentStatus] || { bg: 'secondary', text: paymentStatus };
    return <Badge bg={config.bg} className="payment-status-badge">{config.text}</Badge>;
  };

  const isCurrentOrder = (order) => {
    const currentStatuses = ['pending', 'confirmed', 'processing', 'ready_for_pickup', 'out_for_delivery'];
    return currentStatuses.includes(order.order_status);
  };

  const getActionButtons = (order) => {
    if (isCurrentOrder(order)) {
      return (
        <div className="order-actions-compact">
          <CustomButton
            variant="outline-primary"
            size="sm"
            onClick={() => handleViewDetails(order.order_id)}
            className="action-btn"
          >
            View Details
          </CustomButton>
          <CustomButton
            variant="primary"
            size="sm"
            onClick={() => handleTrackOrder(order.order_id)}
            className="action-btn"
          >
            Track Order
          </CustomButton>
        </div>
      );
    } else {
      return (
        <div className="order-actions-compact">
          <CustomButton
            variant="outline-primary"
            size="sm"
            onClick={() => handleViewDetails(order.order_id)}
            className="action-btn"
          >
            View Details
          </CustomButton>
        </div>
      );
    }
  };

  const handleViewDetails = (orderId) => {
    navigate(`/order/${orderId}`, { state: { from: 'dashboard' } });
  };

  const handleTrackOrder = (orderId) => {
    navigate(`/order/${orderId}`, { state: { from: 'dashboard' } });
  };

  const currentOrders = orders.filter(order => isCurrentOrder(order));
  const pastOrders = orders.filter(order => !isCurrentOrder(order));

  if (loading) {
    return (
      <div className="my-orders-compact">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <div className="text-center">
            <FontAwesomeIcon icon={faSpinner} className="fa-spin fa-2x text-primary mb-3" />
            <p>Loading orders...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-orders-compact">
      <div className="orders-header-compact">
        <h3 className="orders-title-compact">My Orders</h3>
        <p className="orders-subtitle-compact">Track your order history and current orders</p>
      </div>

      {error && (
        <Alert variant="danger" className="mb-4" dismissible onClose={() => setError(null)}>
          <FontAwesomeIcon icon={faExclamationCircle} className="me-2" />
          {error}
        </Alert>
      )}

      {currentOrders.length > 0 && (
        <div className="orders-section-compact">
          <h5 className="section-title-compact">Current Orders</h5>
          {currentOrders.map((order) => (
            <Card key={order.order_id} className="order-card-compact current-order">
              <Card.Body className="p-3">
                <Row className="align-items-center">
                  <Col xs={12} md={8}>
                    <div className="order-info-compact">
                      <div className="order-header-compact">
                        <div className="order-title-section">
                          <h6 className="order-id-compact">Order #{order.order_number || order.order_id}</h6>
                          <span className="order-date-compact">
                            Placed on: {formatDate(order.created_at)}
                          </span>
                        </div>
                        <div className="d-flex flex-column align-items-end gap-2">
                          {getStatusBadge(order.order_status)}
                          {getPaymentStatusBadge(order.payment_status)}
                        </div>
                      </div>
                      <div className="order-meta-compact mt-2">
                        <span className="order-type-badge">
                          {order.order_type === 'delivery' ? '🚚 Delivery' : '🏪 Pickup'}
                        </span>
                        {order.estimated_delivery_time && (
                          <span className="delivery-time-text ms-3">
                            Est. {order.order_type === 'delivery' ? 'Delivery' : 'Pickup'}: {formatDateTime(order.estimated_delivery_time)}
                          </span>
                        )}
                        {order.order_status === 'ready_for_pickup' && order.order_type === 'pickup' && (
                          <span className="ready-badge ms-3">✅ Ready for Pickup</span>
                        )}
                      </div>
                      <div className="order-total-compact mt-2">
                        <strong>Total: ${Number(order.total_amount || 0).toFixed(2)}</strong>
                        {order.discount_amount > 0 && (
                          <span className="discount-text ms-2">
                            (Saved ${Number(order.discount_amount || 0).toFixed(2)})
                          </span>
                        )}
                      </div>
                    </div>
                  </Col>
                  <Col xs={12} md={4} className="text-end mt-3 mt-md-0">
                    {getActionButtons(order)}
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}

      {pastOrders.length > 0 && (
        <div className="orders-section-compact">
          <h5 className="section-title-compact">Past Orders</h5>
          {pastOrders.map((order) => (
            <Card key={order.order_id} className="order-card-compact past-order">
              <Card.Body className="p-3">
                <Row className="align-items-center">
                  <Col xs={12} md={8}>
                    <div className="order-info-compact">
                      <div className="order-header-compact">
                        <div className="order-title-section">
                          <h6 className="order-id-compact">Order #{order.order_number || order.order_id}</h6>
                          <span className="order-date-compact">
                            {order.order_status === 'delivered' && order.actual_delivery_time
                              ? `Delivered on: ${formatDate(order.actual_delivery_time)}`
                              : `Placed on: ${formatDate(order.created_at)}`}
                          </span>
                        </div>
                        <div className="d-flex flex-column align-items-end gap-2">
                          {getStatusBadge(order.order_status)}
                          {getPaymentStatusBadge(order.payment_status)}
                        </div>
                      </div>
                      <div className="order-meta-compact mt-2">
                        <span className="order-type-badge">
                          {order.order_type === 'delivery' ? '🚚 Delivery' : '🏪 Pickup'}
                        </span>
                        {order.actual_delivery_time && order.order_status === 'delivered' && (
                          <span className="delivery-time-text ms-3">
                            Delivered: {formatDate(order.actual_delivery_time)}
                          </span>
                        )}
                        {order.cancellation_reason && (
                          <span className="cancellation-reason-text ms-3 text-danger">
                            Reason: {order.cancellation_reason}
                          </span>
                        )}
                      </div>
                      <div className="order-total-compact mt-2">
                        <strong>Total: ${Number(order.total_amount || 0).toFixed(2)}</strong>
                        {order.discount_amount > 0 && (
                          <span className="discount-text ms-2">
                            (Saved ${Number(order.discount_amount || 0).toFixed(2)})
                          </span>
                        )}
                      </div>
                    </div>
                  </Col>
                  <Col xs={12} md={4} className="text-end mt-3 mt-md-0">
                    {getActionButtons(order)}
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}

      {orders.length === 0 && !loading && (
        <Card className="empty-orders-card-compact">
          <Card.Body className="text-center p-4">
            <div className="empty-orders-icon-compact">
              <FontAwesomeIcon icon={faShoppingBag} className="fa-3x text-muted" />
            </div>
            <h5 className="empty-orders-title-compact">No Orders Yet</h5>
            <p className="empty-orders-text-compact">
              You haven't placed any orders yet. Start shopping to see your orders here!
            </p>
            <CustomButton variant="success" size="lg" onClick={() => navigate('/products')}>
              Start Shopping
            </CustomButton>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default MyOrders;
