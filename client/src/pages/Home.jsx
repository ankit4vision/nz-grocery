import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { CustomButton, InfoCard, StatCard } from '../components';
import './Home.css';

const Home = () => {
  return (
    <Container>
      {/* Hero Section */}
      <div className="home-hero">
        <h1 className="home-hero-title">Welcome to NZ Grocery Store</h1>
        <p className="home-hero-subtitle">
          Your one-stop destination for fresh groceries, quality products, and exceptional service.
        </p>
        <CustomButton variant="primary" size="lg">
          Shop Now
        </CustomButton>
      </div>

      {/* Features Section */}
      <Row className="home-features">
        <Col md={4} className="mb-4">
          <InfoCard
            icon="🥬"
            title="Fresh Produce"
            description="Hand-picked fresh fruits and vegetables delivered daily from local farms."
            variant="success"
          />
        </Col>
        <Col md={4} className="mb-4">
          <InfoCard
            icon="🚚"
            title="Fast Delivery"
            description="Quick and reliable delivery service to your doorstep within 24 hours."
            variant="info"
          />
        </Col>
        <Col md={4} className="mb-4">
          <InfoCard
            icon="💰"
            title="Best Prices"
            description="Competitive prices with regular discounts and special offers for our customers."
            variant="warning"
          />
        </Col>
      </Row>

      {/* Stats Section */}
      <Row className="home-stats">
        <Col md={3} className="mb-3">
          <StatCard
            title="Products"
            value={500}
            change={12}
            changeType="positive"
            icon="📦"
            variant="primary"
          />
        </Col>
        <Col md={3} className="mb-3">
          <StatCard
            title="Happy Customers"
            value={1000}
            change={8}
            changeType="positive"
            icon="😊"
            variant="success"
          />
        </Col>
        <Col md={3} className="mb-3">
          <StatCard
            title="Customer Support"
            value="24/7"
            change={null}
            icon="🛟"
            variant="info"
          />
        </Col>
        <Col md={3} className="mb-3">
          <StatCard
            title="Average Rating"
            value="5★"
            change={null}
            icon="⭐"
            variant="warning"
          />
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
