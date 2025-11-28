import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import logoImage from '../../assets/logo/logo-transprant.png';
import '../../styles/components/layout-elements/app-footer.css';

const AppFooter = ({ 
  companyName = 'Farm 2 Fridge',
  year = new Date().getFullYear(),
  links = [],
  socialLinks = [],
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
              {socialLinks.map((link, index) => (
                <a 
                  key={index}
                  href={link.href} 
                  className="app-footer__social-link"
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </Col>

          {/* Quick Links Section */}
          <Col lg={2} md={6} className="app-footer__section">
            <h6 className="app-footer__section-title">Quick Links</h6>
            <ul className="app-footer__link-list">
              {links.map((linkGroup, groupIndex) => (
                linkGroup.title === 'Quick Links' && 
                linkGroup.items.map((item, itemIndex) => (
                  <li key={`${groupIndex}-${itemIndex}`}>
                    <a href={item.href} className="app-footer__link">
                      {item.label}
                    </a>
                  </li>
                ))
              ))}
            </ul>
          </Col>

          {/* Customer Service Section */}
          <Col lg={2} md={6} className="app-footer__section">
            <h6 className="app-footer__section-title">Customer Service</h6>
            <ul className="app-footer__link-list">
              {links.map((linkGroup, groupIndex) => (
                linkGroup.title === 'Support' && 
                linkGroup.items.map((item, itemIndex) => (
                  <li key={`${groupIndex}-${itemIndex}`}>
                    <a href={item.href} className="app-footer__link">
                      {item.label}
                    </a>
                  </li>
                ))
              ))}
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
