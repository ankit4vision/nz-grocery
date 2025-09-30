import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import logoImage from '../../assets/logo/logo-transprant.png';
import './AppFooter.css';

const AppFooter = ({ 
  companyName = 'Farm 2 Fridge',
  year = new Date().getFullYear(),
  className = '',
  ...props 
}) => {
  const [email, setEmail] = useState('');
  
  const footerClasses = [
    'app-footer',
    className
  ].filter(Boolean).join(' ');

  const handleSubscribe = (e) => {
    e.preventDefault();
    console.log('Newsletter subscription:', email);
    setEmail('');
  };

  return (
    <footer className={footerClasses} {...props}>
      <Container>
        <Row className="app-footer__content">
          {/* Logo and Social Media Section */}
          <Col lg={3} md={6} className="app-footer__logo-section">
            <div className="app-footer__logo">
              <img 
                src={logoImage} 
                alt="Farm Fridge Logo" 
                className="app-footer__logo-image"
              />
              <div className="app-footer__logo-sub">
                Farm 2 Fridge
              </div>
            </div>
            
            <div className="app-footer__social-links">
              <a href="#" className="app-footer__social-link">
                🐦
              </a>
              <a href="#" className="app-footer__social-link">
                📌
              </a>
            </div>
          </Col>

          {/* Quick Links Section */}
          <Col lg={2} md={6} className="app-footer__section">
            <h6 className="app-footer__section-title">Quick Links</h6>
            <ul className="app-footer__link-list">
              <li><a href="/" className="app-footer__link">Home</a></li>
              <li><a href="/products" className="app-footer__link">Products</a></li>
              <li><a href="/offers" className="app-footer__link">Offers</a></li>
              <li><a href="/contact" className="app-footer__link">Contact</a></li>
            </ul>
          </Col>

          {/* Customer Service Section */}
          <Col lg={2} md={6} className="app-footer__section">
            <h6 className="app-footer__section-title">Customer Service</h6>
            <ul className="app-footer__link-list">
              <li><a href="/help" className="app-footer__link">Help Center</a></li>
              <li><a href="/terms" className="app-footer__link">Terms & Conditions</a></li>
              <li><a href="/privacy" className="app-footer__link">Privacy Policy</a></li>
              <li><a href="/refund" className="app-footer__link">Refund Policy</a></li>
            </ul>
          </Col>

          {/* About Us Section */}
          <Col lg={2} md={6} className="app-footer__section">
            <h6 className="app-footer__section-title">About Us</h6>
            <ul className="app-footer__link-list">
              <li><a href="/about" className="app-footer__link">About eGroceryMart</a></li>
              <li><a href="/seller" className="app-footer__link">Become a Seller</a></li>
              <li><a href="/careers" className="app-footer__link">Careers</a></li>
              <li><a href="/press" className="app-footer__link">Press</a></li>
            </ul>
          </Col>

          {/* Stay Updated Section */}
          <Col lg={3} md={12} className="app-footer__newsletter-section">
            <h6 className="app-footer__section-title">Stay Updated</h6>
            <p className="app-footer__newsletter-description">
              Subscribe to our newsletter for the latest updates and offers.
            </p>
            <Form onSubmit={handleSubscribe} className="app-footer__newsletter-form">
              <div className="app-footer__newsletter-input-group">
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="app-footer__newsletter-input"
                  required
                />
                <Button 
                  type="submit" 
                  className="app-footer__newsletter-btn"
                >
                  Subscribe
                </Button>
              </div>
            </Form>
          </Col>
        </Row>
        
        <hr className="app-footer__divider" />
        
        <Row className="app-footer__bottom">
          <Col className="app-footer__copyright">
            <p className="app-footer__copyright-text">
              &copy; {year} Farm to Fridge. All rights reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default AppFooter;
