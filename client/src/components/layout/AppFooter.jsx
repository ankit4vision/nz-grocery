import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import logoImage from '../../assets/logo/logo-transprant.png';
import '../../styles/components/layout-elements/app-footer.css';

const AppFooter = ({ 
  companyName = 'Farm2Fridge',
  year = new Date().getFullYear(),
  className = ''
}) => {
  const footerClasses = [
    'app-footer',
    className
  ].filter(Boolean).join(' ');

  return (
    <footer className={footerClasses}>
      <Container>
        <Row className="app-footer__content">
          {/* Logo and Name Section */}
          <Col lg={4} md={6} className="app-footer__logo-section">
            <div className="app-footer__logo">
              <img 
                src={logoImage} 
                alt="Farm2Fridge Logo" 
                className="app-footer__logo-image"
              />
              <div className="app-footer__logo-sub">
                {companyName}
              </div>
            </div>
          </Col>

          {/* Links Section */}
          <Col lg={8} md={6} className="app-footer__links-section">
            <ul className="app-footer__link-list">
              <li>
                <Link to="/" className="app-footer__link">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="app-footer__link">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/about" className="app-footer__link">
                  About Farm2Fridge
                </Link>
              </li>
              <li>
                <Link to="/faq" className="app-footer__link">
                  FAQ
                </Link>
              </li>
            </ul>
          </Col>
        </Row>
        
        <hr className="app-footer__divider" />
        
        <Row className="app-footer__bottom">
          <Col className="app-footer__copyright">
            <p className="app-footer__copyright-text">
              &copy; {year} {companyName}. All rights reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default AppFooter;
