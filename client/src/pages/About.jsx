import React from 'react';
import { Container, Row, Col, Card, ListGroup, Badge } from 'react-bootstrap';
import { CustomButton, InfoCard } from '../components';
import { usePageTitle } from '../hooks';
import { FaLeaf, FaHandshake, FaRecycle, FaTruck, FaAward, FaUsers, FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from 'react-icons/fa';
import './About.css';

const About = () => {
  // Set page title and SEO
  usePageTitle(
    'About Us',
    'Learn about Farm2Fridge - your trusted partner for fresh groceries. Quality produce, local sourcing, and commitment to customer satisfaction.'
  );

  return (
    <div className="about-page">
      <Container>
        {/* Hero Section */}
        <Row className="about-hero">
          <Col>
            <div className="about-hero-content">
              <h1 className="about-title">About Farm2Fridge</h1>
              <p className="about-subtitle">
                Bringing fresh, quality groceries from farm to your fridge since 2020
              </p>
              <div className="about-hero-badges">
                <Badge bg="success" className="about-badge">100% Fresh</Badge>
                <Badge bg="info" className="about-badge">Local Sourced</Badge>
                <Badge bg="warning" className="about-badge">Fast Delivery</Badge>
              </div>
            </div>
          </Col>
        </Row>

        {/* Statistics Section */}
        <Row className="about-stats">
          <Col md={3} sm={6} className="mb-4">
            <Card className="about-stat-card">
              <Card.Body className="text-center">
                <div className="about-stat-number">50K+</div>
                <div className="about-stat-label">Happy Customers</div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} sm={6} className="mb-4">
            <Card className="about-stat-card">
              <Card.Body className="text-center">
                <div className="about-stat-number">500+</div>
                <div className="about-stat-label">Local Farmers</div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} sm={6} className="mb-4">
            <Card className="about-stat-card">
              <Card.Body className="text-center">
                <div className="about-stat-number">10K+</div>
                <div className="about-stat-label">Products</div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} sm={6} className="mb-4">
            <Card className="about-stat-card">
              <Card.Body className="text-center">
                <div className="about-stat-number">24/7</div>
                <div className="about-stat-label">Support</div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Mission & Vision Section */}
        <Row className="about-mission-vision">
          <Col md={6} className="mb-4">
            <Card className="about-mission-card">
              <Card.Body>
                <div className="about-mission-icon">
                  <FaAward />
                </div>
                <h3 className="about-mission-title">Our Mission</h3>
                <p className="about-mission-text">
                  To revolutionize grocery shopping in New Zealand by providing fresh, locally-sourced produce 
                  directly from farms to customers' fridges. We're committed to supporting local farmers, 
                  reducing food waste, and making quality groceries accessible to every household.
                </p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} className="mb-4">
            <Card className="about-vision-card">
              <Card.Body>
                <div className="about-vision-icon">
                  <FaUsers />
                </div>
                <h3 className="about-vision-title">Our Vision</h3>
                <p className="about-vision-text">
                  To become New Zealand's most trusted online grocery platform, known for exceptional quality, 
                  sustainable practices, and outstanding customer service. We envision a future where every 
                  Kiwi family has easy access to fresh, healthy, and affordable groceries delivered right to their door.
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Company Story */}
        <Row className="about-story">
          <Col md={10} className="mx-auto">
            <Card className="about-story-card">
              <Card.Body>
                <div className="about-story-header">
                  <h2 className="about-story-title">Our Story</h2>
                  <div className="about-story-divider"></div>
                </div>
                <div className="about-story-content">
                  <p className="about-story-intro">
                    Farm2Fridge was born from a simple idea: <strong>fresh groceries should be accessible to everyone, 
                    directly from the source.</strong>
                  </p>
                  <p className="about-story-text">
                    Founded in 2020 by a group of passionate food enthusiasts in Auckland, we started as a small 
                    family business with a mission to bridge the gap between local farmers and consumers. We recognized 
                    that many New Zealanders wanted access to fresh, locally-sourced produce but found it challenging 
                    to find quality products at reasonable prices.
                  </p>
                  <p className="about-story-text">
                    Today, Farm2Fridge has grown into one of New Zealand's most trusted online grocery platforms, 
                    partnering with over 500 local farmers and suppliers across the country. We've maintained our 
                    commitment to quality, freshness, and supporting local communities while expanding our reach 
                    to serve thousands of happy customers nationwide.
                  </p>
                  <p className="about-story-text">
                    Our direct relationships with farmers ensure that you receive the freshest produce possible, 
                    often harvested just days before it reaches your door. We're proud to support local agriculture 
                    and contribute to New Zealand's food security while providing you with the best grocery shopping 
                    experience.
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Values Section */}
        <Row className="about-values">
          <Col className="text-center mb-5">
            <h2 className="about-section-title">Our Core Values</h2>
            <p className="about-section-subtitle">The principles that guide everything we do</p>
          </Col>
        </Row>
        <Row className="about-values">
          <Col lg={4} md={6} className="mb-4">
            <Card className="about-value-card">
              <Card.Body>
                <div className="about-value-icon">
                  <FaLeaf />
                </div>
                <h4 className="about-value-title">Quality First</h4>
                <p className="about-value-text">
                  We source only the finest products from trusted suppliers and local farmers. Every item 
                  is carefully selected to meet our high standards for freshness, quality, and taste.
                </p>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4} md={6} className="mb-4">
            <Card className="about-value-card">
              <Card.Body>
                <div className="about-value-icon">
                  <FaHandshake />
                </div>
                <h4 className="about-value-title">Community Focus</h4>
                <p className="about-value-text">
                  Supporting local businesses and contributing to the growth of our community. We believe 
                  in building strong relationships with farmers, suppliers, and customers.
                </p>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4} md={6} className="mb-4">
            <Card className="about-value-card">
              <Card.Body>
                <div className="about-value-icon">
                  <FaRecycle />
                </div>
                <h4 className="about-value-title">Sustainability</h4>
                <p className="about-value-text">
                  Committed to eco-friendly practices and sustainable sourcing methods. We minimize waste, 
                  use recyclable packaging, and support environmentally responsible farming practices.
                </p>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4} md={6} className="mb-4">
            <Card className="about-value-card">
              <Card.Body>
                <div className="about-value-icon">
                  <FaTruck />
                </div>
                <h4 className="about-value-title">Fast & Reliable</h4>
                <p className="about-value-text">
                  We understand the importance of timely delivery. Our efficient logistics ensure your 
                  groceries arrive fresh and on time, every time.
                </p>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4} md={6} className="mb-4">
            <Card className="about-value-card">
              <Card.Body>
                <div className="about-value-icon">
                  <FaAward />
                </div>
                <h4 className="about-value-title">Customer Satisfaction</h4>
                <p className="about-value-text">
                  Your happiness is our priority. We go above and beyond to ensure every shopping experience 
                  is exceptional, from browsing to delivery.
                </p>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4} md={6} className="mb-4">
            <Card className="about-value-card">
              <Card.Body>
                <div className="about-value-icon">
                  <FaUsers />
                </div>
                <h4 className="about-value-title">Transparency</h4>
                <p className="about-value-text">
                  We believe in honest pricing, clear communication, and transparent sourcing. You always 
                  know where your food comes from and how it's produced.
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Team Section */}
        <Row className="about-team">
          <Col className="text-center mb-5">
            <h2 className="about-section-title">Meet Our Team</h2>
            <p className="about-section-subtitle">The passionate people behind Farm2Fridge</p>
          </Col>
        </Row>
        <Row className="about-team">
          <Col lg={3} md={6} className="mb-4">
            <Card className="about-team-card">
              <Card.Body className="text-center">
                <div className="about-team-avatar">JS</div>
                <h5 className="about-team-name">John Smith</h5>
                <p className="about-team-role">Founder & CEO</p>
                <p className="about-team-description">
                  Passionate about bringing fresh groceries to every Kiwi household. 
                  Over 15 years of experience in the food industry.
                </p>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={3} md={6} className="mb-4">
            <Card className="about-team-card">
              <Card.Body className="text-center">
                <div className="about-team-avatar">SJ</div>
                <h5 className="about-team-name">Sarah Johnson</h5>
                <p className="about-team-role">Operations Director</p>
                <p className="about-team-description">
                  Ensuring smooth operations and quality control across all our services. 
                  Expert in supply chain management.
                </p>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={3} md={6} className="mb-4">
            <Card className="about-team-card">
              <Card.Body className="text-center">
                <div className="about-team-avatar">MC</div>
                <h5 className="about-team-name">Mike Chen</h5>
                <p className="about-team-role">Head of Procurement</p>
                <p className="about-team-description">
                  Expert in selecting the finest ingredients for our customers. 
                  Builds relationships with local farmers and suppliers.
                </p>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={3} md={6} className="mb-4">
            <Card className="about-team-card">
              <Card.Body className="text-center">
                <div className="about-team-avatar">EW</div>
                <h5 className="about-team-name">Emma Wilson</h5>
                <p className="about-team-role">Customer Experience Lead</p>
                <p className="about-team-description">
                  Dedicated to providing exceptional customer experience. 
                  Ensures every customer interaction is positive and helpful.
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Contact Information */}
        <Row className="about-contact">
          <Col className="text-center mb-4">
            <h2 className="about-section-title">Get In Touch</h2>
            <p className="about-section-subtitle">We'd love to hear from you</p>
          </Col>
        </Row>
        <Row className="about-contact">
          <Col md={6} className="mb-4">
            <Card className="about-contact-card">
              <Card.Header className="about-contact-header">
                <h5 className="about-contact-title">
                  <FaMapMarkerAlt className="me-2" />
                  Contact Information
                </h5>
              </Card.Header>
              <Card.Body className="p-0">
                <ListGroup variant="flush">
                  <ListGroup.Item className="about-contact-item">
                    <div className="about-contact-icon">
                      <FaMapMarkerAlt />
                    </div>
                    <div className="about-contact-content">
                      <div className="about-contact-label">Address</div>
                      <div className="about-contact-text">
                        123 Queen Street, Auckland Central<br />
                        Auckland 1010, New Zealand
                      </div>
                    </div>
                  </ListGroup.Item>
                  <ListGroup.Item className="about-contact-item">
                    <div className="about-contact-icon">
                      <FaPhone />
                    </div>
                    <div className="about-contact-content">
                      <div className="about-contact-label">Phone</div>
                      <div className="about-contact-text">+64 9 123 4567</div>
                    </div>
                  </ListGroup.Item>
                  <ListGroup.Item className="about-contact-item">
                    <div className="about-contact-icon">
                      <FaEnvelope />
                    </div>
                    <div className="about-contact-content">
                      <div className="about-contact-label">Email</div>
                      <div className="about-contact-text">info@farm2fridge.co.nz</div>
                    </div>
                  </ListGroup.Item>
                  <ListGroup.Item className="about-contact-item">
                    <div className="about-contact-icon">
                      <FaClock />
                    </div>
                    <div className="about-contact-content">
                      <div className="about-contact-label">Business Hours</div>
                      <div className="about-contact-text">
                        Monday - Friday: 7:00 AM - 9:00 PM<br />
                        Saturday - Sunday: 8:00 AM - 8:00 PM
                      </div>
                    </div>
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} className="mb-4">
            <Card className="about-contact-card">
              <Card.Header className="about-contact-header">
                <h5 className="about-contact-title">Need Help?</h5>
              </Card.Header>
              <Card.Body>
                <p className="about-contact-description">
                  Have questions, feedback, or need assistance? Our friendly customer service team 
                  is here to help you 24/7. We're committed to providing exceptional support and 
                  ensuring your satisfaction.
                </p>
                <div className="about-contact-buttons">
                  <CustomButton variant="success" fullWidth className="mb-3">
                    <FaEnvelope className="me-2" />
                    Send Us a Message
                  </CustomButton>
                  <CustomButton variant="outline-success" fullWidth>
                    <FaPhone className="me-2" />
                    Call Us Now
                  </CustomButton>
                </div>
                <div className="about-contact-note">
                  <small className="text-muted">
                    💡 For order-related inquiries, please visit your dashboard or contact our support team.
                  </small>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default About;
