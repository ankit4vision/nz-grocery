import React, { useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { CustomButton } from '../common';
import './ValueSection.css';

const ValueSection = ({ 
  title = "Helping you find great value",
  categories = [],
  className = '',
  onViewAllClick
}) => {
  const sectionClasses = [
    'value-section',
    className
  ].filter(Boolean).join(' ');

  // Show only first 4 categories
  const displayCategories = categories.slice(0, 4);

  return (
    <section className={sectionClasses}>
      <Container>
        <div className="value-section__header">
          <div className="value-section__header-left">
            <h2 className="value-section__title">{title}</h2>
          </div>
          <div className="value-section__header-right">
            <button 
              className="value-section__view-all"
              onClick={onViewAllClick}
            >
              View all
            </button>
          </div>
        </div>
        
        <Row className="value-section__content">
          {displayCategories.map((category) => (
            <Col lg={3} md={6} key={category.id} className="mb-4">
              <Card className="value-section__card">
                <div className="value-section__card-image">
                  <img 
                    src={category.image} 
                    alt={category.title}
                    className="value-section__image"
                  />
                  <div className={`value-section__badge value-section__badge--${category.badgeType}`}>
                    {category.badge}
                  </div>
                </div>
                
                <Card.Body className="value-section__card-body">
                  <h5 className="value-section__card-title">{category.title}</h5>
                  <p className="value-section__card-description">
                    {category.description}
                  </p>
                  <CustomButton
                    variant="success"
                    size="sm"
                    className="value-section__button"
                    onClick={() => {
                      if (category.link) {
                        console.log('Navigate to:', category.link);
                      }
                    }}
                  >
                    Shop now
                  </CustomButton>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default ValueSection;
