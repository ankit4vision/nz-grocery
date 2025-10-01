import React, { useState } from 'react';
import { Card, Row, Col, Badge, Button } from 'react-bootstrap';
import { CustomButton } from '../common';
import '../../styles/components/ui-components/my-orders.css';

const MyOrders = () => {
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
        <div className="order-actions">
          <CustomButton
            variant="outline-secondary"
            size="sm"
            onClick={() => handleViewDetails(order.id)}
            className="action-btn"
          >
            View Details
          </CustomButton>
          <CustomButton
            variant="success"
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
        <div className="order-actions">
          <CustomButton
            variant="outline-secondary"
            size="sm"
            onClick={() => handleViewDetails(order.id)}
            className="action-btn"
          >
            View Details
          </CustomButton>
          <CustomButton
            variant="success"
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
    // Navigate to order details page
  };

  const handleTrackOrder = (orderId) => {
    console.log('Track order:', orderId);
    // Navigate to tracking page
  };

  const handleReorder = (orderId) => {
    console.log('Reorder:', orderId);
    // Add items to cart
  };

  const currentOrders = orders.filter(order => order.status === 'current');
  const pastOrders = orders.filter(order => order.status !== 'current');

  return (
    <div className="my-orders">
      <div className="orders-header">
        <h2 className="orders-title">My Orders</h2>
        <p className="orders-subtitle">Track your order history and current orders</p>
      </div>

      {currentOrders.length > 0 && (
        <div className="orders-section">
          <h4 className="section-title">Current Order</h4>
          {currentOrders.map((order) => (
            <Card key={order.id} className="order-card current-order">
              <Card.Body>
                <Row className="align-items-center">
                  <Col md={8}>
                    <div className="order-info">
                      <div className="order-header">
                        <h5 className="order-id">Order #{order.id}</h5>
                        <span className="order-date">Placed on: {order.date}</span>
                      </div>
                      <div className="order-items">
                        {order.items.map((item, index) => (
                          <div key={index} className="order-item">
                            <span className="item-name">{item.name}</span>
                            {item.price && (
                              <span className="item-price">(${item.price.toFixed(2)})</span>
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="order-total">
                        <strong>Total: ${order.total.toFixed(2)}</strong>
                      </div>
                    </div>
                  </Col>
                  <Col md={4} className="text-end">
                    {getActionButtons(order)}
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}

      {pastOrders.length > 0 && (
        <div className="orders-section">
          <h4 className="section-title">Past Orders</h4>
          {pastOrders.map((order) => (
            <Card key={order.id} className="order-card past-order">
              <Card.Body>
                <Row className="align-items-center">
                  <Col md={8}>
                    <div className="order-info">
                      <div className="order-header">
                        <h5 className="order-id">Order #{order.id}</h5>
                        <span className="order-date">Delivered on: {order.date}</span>
                        {getStatusBadge(order.status)}
                      </div>
                      <div className="order-items">
                        {order.items.map((item, index) => (
                          <div key={index} className="order-item">
                            <span className="item-name">{item.name}</span>
                            {item.price && (
                              <span className="item-price">(${item.price.toFixed(2)})</span>
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="order-total">
                        <strong>Total: ${order.total.toFixed(2)}</strong>
                      </div>
                    </div>
                  </Col>
                  <Col md={4} className="text-end">
                    {getActionButtons(order)}
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}

      {orders.length === 0 && (
        <Card className="empty-orders-card">
          <Card.Body className="text-center">
            <div className="empty-orders-icon">
              <i className="fas fa-shopping-bag"></i>
            </div>
            <h5 className="empty-orders-title">No Orders Yet</h5>
            <p className="empty-orders-text">You haven't placed any orders yet. Start shopping to see your orders here!</p>
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
