import React, { useState } from 'react';
import { Card, Row, Col, Button, Accordion } from 'react-bootstrap';
import { CustomButton } from '../common';
import { faqCategoriesData } from '../../data/mockData';
import '../../styles/components/ui-components/help-center.css';

const HelpCenter = () => {
  const [activeAccordion, setActiveAccordion] = useState('');

  const faqCategories = faqCategoriesData;

  const handleContactSupport = () => {
    console.log('Contact support clicked');
    // Navigate to contact page or open contact modal
  };

  const handleSendEmail = () => {
    console.log('Send email clicked');
    // Open email client or contact form
  };

  return (
    <div className="help-center">
      <div className="help-header">
        <h2 className="help-title">Help Center</h2>
        <p className="help-subtitle">Find answers to frequently asked questions</p>
      </div>

      <Row className="faq-categories">
        {faqCategories.map((category) => (
          <Col key={category.id} xs={12} className="mb-4">
            <Card 
              className="faq-category-card"
              style={{ borderLeftColor: category.color }}
            >
              <Card.Body>
                <div className="category-header">
                  <div className="category-icon" style={{ color: category.color }}>
                    {category.icon}
                  </div>
                  <h5 className="category-title">{category.title}</h5>
                </div>
                
                <Accordion 
                  activeKey={activeAccordion}
                  onSelect={(eventKey) => setActiveAccordion(eventKey)}
                >
                  {category.questions.map((faq, index) => (
                    <Accordion.Item key={index} eventKey={`${category.id}-${index}`}>
                      <Accordion.Header className="faq-question">
                        {faq.question}
                      </Accordion.Header>
                      <Accordion.Body className="faq-answer">
                        {faq.answer}
                      </Accordion.Body>
                    </Accordion.Item>
                  ))}
                </Accordion>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Card className="help-contact-card">
        <Card.Body className="text-center">
          <div className="contact-content">
            <h3 className="contact-title">Need More Help?</h3>
            <p className="contact-text">
              Can't find what you're looking for? Our support team is here to help!
            </p>
            <div className="contact-actions">
              <CustomButton
                variant="outline-success"
                size="lg"
                onClick={handleContactSupport}
                className="contact-btn"
              >
                <i className="fas fa-headset me-2"></i>
                Contact Support
              </CustomButton>
              <CustomButton
                variant="success"
                size="lg"
                onClick={handleSendEmail}
                className="contact-btn"
              >
                <i className="fas fa-envelope me-2"></i>
                Send Email
              </CustomButton>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default HelpCenter;
