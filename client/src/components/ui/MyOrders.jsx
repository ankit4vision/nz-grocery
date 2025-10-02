import React, { useState } from 'react';
import { Card, Row, Col, Badge, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { CustomButton } from '../common';
import '../../styles/components/ui-components/my-orders.css';

const MyOrders = () => {
  const navigate = useNavigate();
  const [orders] = useState([
    {
      id: 'ORD-12345',
      date: '8/22/2025',
      status: 'current',
      items: [
        { name: 'Fresh Tomatoes', price: 2.99 },
        { name: 'Organic Bananas', price: 1.49 },
        { name: 'Whole Milk', price: 3.99 }
      ],
      total: 8.47
    },
    {
      id: 'ORD-12344',
      date: 'Dec 15, 2024',
      status: 'delivered',
      items: [
        { name: 'Organic Apples', price: 4.99 },
        { name: 'Fresh Bread', price: 2.49 },
        { name: 'Greek Yogurt', price: 5.51 }
      ],
      total: 12.99
    },
    {
      id: 'ORD-12343',
      date: 'Dec 10, 2024',
      status: 'delivered',
      items: [
        { name: 'Spinach', price: 2.99 },
        { name: 'Chicken Breast', price: 5.76 }
      ],
      total: 8.75
    },
    {
      id: 'ORD-12342',
      date: 'Dec 5, 2024',
      status: 'delivered',
      items: [
        { name: 'Salmon Fillet', price: 12.99 },
        { name: 'Brown Rice', price: 2.26 }
      ],
      total: 15.25
    }
  ]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'current':
        return <Badge bg="warning" className="status-badge">Processing</Badge>;
      case 'delivered':
        return <Badge bg="success" className="status-badge">Delivered</Badge>;
      case 'shipped':
        return <Badge bg="info" className="status-badge">Shipped</Badge>;
      case 'cancelled':
        return <Badge bg="danger" className="status-badge">Cancelled</Badge>;
      default:
        return <Badge bg="secondary" className="status-badge">Unknown</Badge>;
    }
  };

  const getActionButtons = (order) => {
    if (order.status === 'current') {
      return (
        <div className="order-actions-compact">
          <CustomButton
            variant="outline-primary"
            size="sm"
            onClick={() => handleViewDetails(order.id)}
            className="action-btn"
          >
            View Details
          </CustomButton>
          <CustomButton
            variant="primary"
            size="sm"
            onClick={() => handleTrackOrder(order.id)}
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
            onClick={() => handleViewDetails(order.id)}
            className="action-btn"
          >
            View Details
          </CustomButton>
          <CustomButton
            variant="primary"
            size="sm"
            onClick={() => handleReorder(order.id)}
            className="action-btn"
          >
            Reorder
          </CustomButton>
        </div>
      );
    }
  };

  const handleViewDetails = (orderId) => {
    console.log('View details for order:', orderId);
    navigate(`/order/${orderId}`);
  };

  const handleTrackOrder = (orderId) => {
    console.log('Track order:', orderId);
    navigate(`/order/${orderId}`);
  };

  const handleReorder = (orderId) => {
    console.log('Reorder:', orderId);
    // Add items to cart
  };

  const currentOrders = orders.filter(order => order.status === 'current');
  const pastOrders = orders.filter(order => order.status !== 'current');

  return (
    <div className="my-orders-compact">
      <div className="orders-header-compact">
        <h3 className="orders-title-compact">My Orders</h3>
        <p className="orders-subtitle-compact">Track your order history and current orders</p>
      </div>

      {currentOrders.length > 0 && (
        <div className="orders-section-compact">
          <h5 className="section-title-compact">Current Order</h5>
          {currentOrders.map((order) => (
            <Card key={order.id} className="order-card-compact current-order">
              <Card.Body className="p-3">
                <Row className="align-items-center">
                  <Col xs={12} md={8}>
                    <div className="order-info-compact">
                      <div className="order-header-compact">
                        <div className="order-title-section">
                          <h6 className="order-id-compact">Order #{order.id}</h6>
                          <span className="order-date-compact">Placed on: {order.date}</span>
                        </div>
                        {getStatusBadge(order.status)}
                      </div>
                      <div className="order-items-compact">
                        {order.items.map((item, index) => (
                          <div key={index} className="order-item-compact">
                            <span className="item-name-compact">{item.name}</span>
                            <span className="item-price-compact">(${item.price.toFixed(2)})</span>
                          </div>
                        ))}
                      </div>
                      <div className="order-total-compact">
                        <strong>Total: ${order.total.toFixed(2)}</strong>
                      </div>
                    </div>
                  </Col>
                  <Col xs={12} md={4} className="text-end">
                    <div className="order-actions-compact">
                      {getActionButtons(order)}
                    </div>
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
            <Card key={order.id} className="order-card-compact past-order">
              <Card.Body className="p-3">
                <Row className="align-items-center">
                  <Col xs={12} md={8}>
                    <div className="order-info-compact">
                      <div className="order-header-compact">
                        <div className="order-title-section">
                          <h6 className="order-id-compact">Order #{order.id}</h6>
                          <span className="order-date-compact">Delivered on: {order.date}</span>
                        </div>
                        {getStatusBadge(order.status)}
                      </div>
                      <div className="order-items-compact">
                        {order.items.map((item, index) => (
                          <div key={index} className="order-item-compact">
                            <span className="item-name-compact">{item.name}</span>
                            <span className="item-price-compact">(${item.price.toFixed(2)})</span>
                          </div>
                        ))}
                      </div>
                      <div className="order-total-compact">
                        <strong>Total: ${order.total.toFixed(2)}</strong>
                      </div>
                    </div>
                  </Col>
                  <Col xs={12} md={4} className="text-end">
                    <div className="order-actions-compact">
                      {getActionButtons(order)}
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}

      {orders.length === 0 && (
        <Card className="empty-orders-card-compact">
          <Card.Body className="text-center p-4">
            <div className="empty-orders-icon-compact">
              <i className="fas fa-shopping-bag"></i>
            </div>
            <h5 className="empty-orders-title-compact">No Orders Yet</h5>
            <p className="empty-orders-text-compact">You haven't placed any orders yet. Start shopping to see your orders here!</p>
            <CustomButton variant="success" size="lg">
              Start Shopping
            </CustomButton>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default MyOrders;
