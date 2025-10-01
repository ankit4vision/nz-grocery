import React, { useState } from 'react';
import { Card, Row, Col, Button, Accordion } from 'react-bootstrap';
import { CustomButton } from '../common';
import '../../styles/components/ui-components/help-center.css';

const HelpCenter = () => {
  const [activeAccordion, setActiveAccordion] = useState('');

  const faqCategories = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: '🚀',
      color: '#dc3545',
      questions: [
        {
          question: 'How to create an account',
          answer: 'To create an account, click on the "Sign Up" button in the top right corner, fill in your details, and verify your email address.'
        },
        {
          question: 'How to place your first order',
          answer: 'Browse our products, add items to your cart, proceed to checkout, enter your delivery details, and complete payment.'
        },
        {
          question: 'How to track your order',
          answer: 'Go to "My Orders" in your account dashboard to see real-time updates on your order status and delivery tracking.'
        },
        {
          question: 'How to contact customer support',
          answer: 'You can reach us via email, phone, or live chat. Visit our Contact Us page for all available support channels.'
        }
      ]
    },
    {
      id: 'account-profile',
      title: 'Account & Profile',
      icon: '👤',
      color: '#007bff',
      questions: [
        {
          question: 'How to update your profile',
          answer: 'Go to your account dashboard and click on "Profile" to update your personal information, addresses, and preferences.'
        },
        {
          question: 'How to change your password',
          answer: 'In your account dashboard, go to "Change Password" and follow the security steps to update your password.'
        },
        {
          question: 'How to manage addresses',
          answer: 'In your profile settings, you can add, edit, or delete multiple delivery addresses for convenience.'
        },
        {
          question: 'How to view order history',
          answer: 'All your past and current orders are available in the "My Orders" section of your account dashboard.'
        }
      ]
    },
    {
      id: 'payment-billing',
      title: 'Payment & Billing',
      icon: '💳',
      color: '#ffc107',
      questions: [
        {
          question: 'Accepted payment methods',
          answer: 'We accept credit cards, debit cards, PayPal, Apple Pay, Google Pay, and cash on delivery.'
        },
        {
          question: 'How to add payment cards',
          answer: 'Go to your account settings, select "Payment Methods", and securely add your card details.'
        },
        {
          question: 'Understanding charges',
          answer: 'Your total includes item prices, delivery fees, taxes, and any applicable service charges. All fees are clearly displayed before checkout.'
        },
        {
          question: 'Refund policies',
          answer: 'We offer full refunds for damaged or incorrect items within 7 days of delivery. Process returns through your account dashboard.'
        }
      ]
    },
    {
      id: 'delivery',
      title: 'Delivery',
      icon: '🚚',
      color: '#fd7e14',
      questions: [
        {
          question: 'Delivery timeframes',
          answer: 'Standard delivery: 2-3 business days. Express delivery: Same day or next day (where available).'
        },
        {
          question: 'Delivery fees',
          answer: 'Delivery fees vary by location and order size. Free delivery is available on orders over $50 in most areas.'
        },
        {
          question: 'How to track delivery',
          answer: 'Use the tracking link in your order confirmation email or check "My Orders" for real-time delivery updates.'
        },
        {
          question: 'Contact delivery partner',
          answer: 'If you need to contact the delivery driver, use the contact information provided in your delivery notifications.'
        }
      ]
    },
    {
      id: 'returns-refunds',
      title: 'Returns & Refunds',
      icon: '🔄',
      color: '#6f42c1',
      questions: [
        {
          question: 'Return policy',
          answer: 'We accept returns within 30 days for unopened items and 7 days for perishable goods. Items must be in original condition.'
        },
        {
          question: 'How to return items',
          answer: 'Initiate a return through your account dashboard, print the return label, and schedule a pickup or drop off at a designated location.'
        },
        {
          question: 'Refund processing time',
          answer: 'Refunds are processed within 3-5 business days after we receive your returned items.'
        },
        {
          question: 'Damaged items',
          answer: 'Report damaged items immediately upon delivery. We will arrange for replacement or full refund at no cost to you.'
        }
      ]
    },
    {
      id: 'contact-us',
      title: 'Contact Us',
      icon: '📞',
      color: '#212529',
      questions: [
        {
          question: 'Customer support hours',
          answer: 'Our support team is available Monday-Friday 8AM-8PM and Saturday-Sunday 9AM-6PM (local time).'
        },
        {
          question: 'Email support',
          answer: 'Send us an email at support@farmfridge.com and we will respond within 24 hours.'
        },
        {
          question: 'Phone support',
          answer: 'Call us at 1-800-FARM-FRIDGE (1-800-327-6374) for immediate assistance with your orders.'
        },
        {
          question: 'Live chat',
          answer: 'Use our live chat feature available on the website for instant support during business hours.'
        }
      ]
    }
  ];

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
          <Col key={category.id} lg={4} md={6} className="mb-4">
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
                  activeKey={activeAccordion === category.id ? '0' : ''}
                  onSelect={() => setActiveAccordion(activeAccordion === category.id ? '' : category.id)}
                >
                  {category.questions.map((faq, index) => (
                    <Accordion.Item key={index} eventKey={index.toString()}>
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
