import React from 'react';
import { Container, Row, Col, Card, ListGroup } from 'react-bootstrap';
import { CustomButton, InfoCard } from '../components';
import { usePageTitle } from '../hooks';
import './About.css';

const About = () => {
  // Set page title and SEO
  usePageTitle(
    'About Us',
    'Learn about Farm2Fridge - your trusted partner for fresh groceries. Quality produce, local sourcing, and commitment to customer satisfaction.'
  );
  return (
    <Container>
      {/* Hero Section */}
      <Row className="about-hero">
        <Col>
          <h1 className="about-title">About NZ Grocery Store</h1>
          <p className="about-subtitle">
            Your trusted partner for fresh groceries and quality products since 2020
          </p>
        </Col>
      </Row>

      {/* Company Story */}
      <Row className="about-story">
        <Col md={8} className="mx-auto">
          <Card className="about-story-card">
            <Card.Body>
              <h3 className="about-story-title">Our Story</h3>
              <p className="about-story-intro">
                Founded with a simple mission: to bring fresh, quality groceries to every New Zealand household.
              </p>
              <p className="about-story-text">
                NZ Grocery Store started as a small family business in Auckland, driven by the passion to provide 
                the community with access to fresh, locally-sourced produce and quality grocery items. Over the years, 
                we've grown to become one of the most trusted grocery retailers in New Zealand.
              </p>
              <p className="about-story-text">
                Our commitment to quality, freshness, and customer satisfaction has remained unchanged. We work 
                directly with local farmers and suppliers to ensure that our customers receive the best products 
                at competitive prices.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Values Section */}
      <Row className="about-values">
        <Col md={4} className="mb-4">
          <InfoCard
            icon="🌱"
            title="Quality First"
            description="We source only the finest products from trusted suppliers and local farmers."
            variant="success"
          />
        </Col>
        <Col md={4} className="mb-4">
          <InfoCard
            icon="🤝"
            title="Community Focus"
            description="Supporting local businesses and contributing to the growth of our community."
            variant="info"
          />
        </Col>
        <Col md={4} className="mb-4">
          <InfoCard
            icon="♻️"
            title="Sustainability"
            description="Committed to eco-friendly practices and sustainable sourcing methods."
            variant="warning"
          />
        </Col>
      </Row>

      {/* Team Section */}
      <Row className="about-team">
        <Col>
          <h3 className="about-team-title">Meet Our Team</h3>
        </Col>
      </Row>
      <Row className="about-team">
        <Col md={3} className="mb-4">
          <InfoCard
            icon="👨‍💼"
            title="John Smith"
            description="Passionate about bringing fresh groceries to every Kiwi household."
            variant="default"
            size="sm"
          />
        </Col>
        <Col md={3} className="mb-4">
          <InfoCard
            icon="👩‍💼"
            title="Sarah Johnson"
            description="Ensuring smooth operations and quality control across all stores."
            variant="default"
            size="sm"
          />
        </Col>
        <Col md={3} className="mb-4">
          <InfoCard
            icon="👨‍🍳"
            title="Mike Chen"
            description="Expert in selecting the finest ingredients for our customers."
            variant="default"
            size="sm"
          />
        </Col>
        <Col md={3} className="mb-4">
          <InfoCard
            icon="👩‍💻"
            title="Emma Wilson"
            description="Dedicated to providing exceptional customer experience."
            variant="default"
            size="sm"
          />
        </Col>
      </Row>

      {/* Contact Information */}
      <Row className="about-contact">
        <Col md={6} className="mb-4">
          <Card className="about-contact-card">
            <Card.Header className="about-contact-header">
              <h5 className="about-contact-title">Contact Information</h5>
            </Card.Header>
            <Card.Body className="p-0">
              <ListGroup variant="flush">
                <ListGroup.Item className="about-contact-item">
                  <div className="about-contact-label">📍 Address:</div>
                  <div className="about-contact-text">123 Queen Street, Auckland, New Zealand</div>
                </ListGroup.Item>
                <ListGroup.Item className="about-contact-item">
                  <div className="about-contact-label">📞 Phone:</div>
                  <div className="about-contact-text">+64 9 123 4567</div>
                </ListGroup.Item>
                <ListGroup.Item className="about-contact-item">
                  <div className="about-contact-label">📧 Email:</div>
                  <div className="about-contact-text">info@nzgrocery.co.nz</div>
                </ListGroup.Item>
                <ListGroup.Item className="about-contact-item">
                  <div className="about-contact-label">🕒 Hours:</div>
                  <div className="about-contact-text">Mon-Fri: 7AM-9PM<br />Sat-Sun: 8AM-8PM</div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} className="mb-4">
          <Card className="about-contact-card">
            <Card.Header className="about-contact-header">
              <h5 className="about-contact-title">Get In Touch</h5>
            </Card.Header>
            <Card.Body>
              <p className="about-contact-description">
                Have questions or feedback? We'd love to hear from you! 
                Our customer service team is here to help.
              </p>
              <div className="about-contact-buttons">
                <CustomButton variant="primary" fullWidth>
                  Contact Us
                </CustomButton>
                <CustomButton variant="outline-primary" fullWidth>
                  Visit Our Store
                </CustomButton>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default About;
