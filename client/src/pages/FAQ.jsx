import React from 'react';
import { Container } from 'react-bootstrap';
import { HelpCenter } from '../components/ui';
import { usePageTitle } from '../hooks';
import './FAQ.css';

const FAQ = () => {
  // Set page title and SEO
  usePageTitle(
    'Frequently Asked Questions',
    'Find answers to common questions about Farm2Fridge. Learn about ordering, delivery, payments, returns, and more.'
  );

  return (
    <div className="faq-page">
      <Container>
        <HelpCenter />
      </Container>
    </div>
  );
};

export default FAQ;

