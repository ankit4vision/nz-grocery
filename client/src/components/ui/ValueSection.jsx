import React, { useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { CustomButton, NavigationButtons, ImageWithFallback } from '../common';
import '../../styles/components/ui-components/value-section.css';

const ValueSection = ({ 
  title = "Helping you find great value",
  categories = [],
  className = '',
  onViewAllClick
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const sectionClasses = [
    'value-section',
    className
  ].filter(Boolean).join(' ');

  const categoriesPerView = 4;
  const maxIndex = Math.max(0, categories.length - categoriesPerView);

  const handlePrevClick = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNextClick = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  const visibleCategories = categories.slice(currentIndex, currentIndex + categoriesPerView);

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
            <NavigationButtons
              onPrev={handlePrevClick}
              onNext={handleNextClick}
              isPrevDisabled={currentIndex === 0}
              isNextDisabled={currentIndex >= maxIndex}
            />
          </div>
        </div>
        
        <Row className="value-section__content">
          {visibleCategories.map((category) => (
            <Col lg={3} md={6} key={category.id} className="mb-4">
              <Card className="product-card">
                <div className="product-card__image">
                  <ImageWithFallback
                    src={category.image}
                    alt={category.title}
                    className="product-card__image-element"
                  />
                  <div 
                    className="product-card__badge"
                    style={{ 
                      backgroundColor: 'var(--danger-color)',
                      color: 'var(--white)'
                    }}
                  >
                    {category.badge}
                  </div>
                </div>

                <Card.Body className="product-card__body">
                  <h5 className="product-card__title">{category.title}</h5>
                  <p className="product-card__description">
                    {category.description}
                  </p>
                  <CustomButton
                    variant="success"
                    size="sm"
                    className="product-card__button"
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
