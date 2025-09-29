import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './AppFooter.css';

const AppFooter = ({ 
  companyName = 'NZ Grocery Store',
  year = new Date().getFullYear(),
  links = [],
  socialLinks = [],
  className = '',
  ...props 
}) => {
  const footerClasses = [
    'app-footer',
    className
  ].filter(Boolean).join(' ');

  return (
    <footer className={footerClasses} {...props}>
      <Container>
        <Row className="app-footer__content">
          <Col md={6} className="app-footer__info">
            <h5 className="app-footer__title">{companyName}</h5>
            <p className="app-footer__description">
              Your trusted partner for fresh groceries and quality products.
            </p>
          </Col>
          
          <Col md={6} className="app-footer__links">
            <Row>
              {links.map((linkGroup, index) => (
                <Col key={index} sm={6} className="app-footer__link-group">
                  <h6 className="app-footer__link-title">{linkGroup.title}</h6>
                  <ul className="app-footer__link-list">
                    {linkGroup.items.map((link, linkIndex) => (
                      <li key={linkIndex} className="app-footer__link-item">
                        <a href={link.href} className="app-footer__link">
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
        
        <hr className="app-footer__divider" />
        
        <Row className="app-footer__bottom">
          <Col md={6} className="app-footer__copyright">
            <p className="app-footer__copyright-text">
              &copy; {year} {companyName}. All rights reserved.
            </p>
          </Col>
          
          <Col md={6} className="app-footer__social">
            <div className="app-footer__social-links">
              {socialLinks.map((social, index) => (
                <a 
                  key={index}
                  href={social.href} 
                  className="app-footer__social-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default AppFooter;
