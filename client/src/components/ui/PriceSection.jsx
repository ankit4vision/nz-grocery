import React, { useState, useRef } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { CustomButton } from '../common';
import './PriceSection.css';

const PriceSection = ({ 
  title = "Half Price Special",
  products = [],
  className = '',
  onViewAllClick
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef(null);
  
  const sectionClasses = [
    'price-section',
    className
  ].filter(Boolean).join(' ');

  const productsPerView = 4; // Show 4 products at a time (wider cards)
  const maxIndex = Math.max(0, products.length - productsPerView);

  const handlePrevClick = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNextClick = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  const visibleProducts = products.slice(currentIndex, currentIndex + productsPerView);

  return (
    <section className={sectionClasses}>
      <Container>
        <div className="price-section__header">
          <div className="price-section__header-left">
            <h2 className="price-section__title">{title}</h2>
          </div>
          <div className="price-section__header-right">
            <button 
              className="price-section__view-all"
              onClick={onViewAllClick}
            >
              View all
            </button>
            <div className="price-section__navigation">
              <button 
                className={`price-section__nav-btn price-section__nav-btn--prev ${currentIndex === 0 ? 'price-section__nav-btn--disabled' : ''}`}
                onClick={handlePrevClick}
                disabled={currentIndex === 0}
                aria-label="Previous"
              >
                <span>‹</span>
              </button>
              <button 
                className={`price-section__nav-btn price-section__nav-btn--next ${currentIndex >= maxIndex ? 'price-section__nav-btn--disabled' : ''}`}
                onClick={handleNextClick}
                disabled={currentIndex >= maxIndex}
                aria-label="Next"
              >
                <span>›</span>
              </button>
            </div>
          </div>
        </div>
        
        <Row className="price-section__content" ref={scrollContainerRef}>
          {visibleProducts.map((product) => (
            <Col lg={3} md={6} sm={6} key={product.id} className="mb-4">
              <Card className="product-card">
                <div className="product-card__image">
                  <img 
                    src={product.image} 
                    alt={product.name}
                  />
                  <div className="product-card__badge">
                    1/2 Price
                  </div>
                </div>
                
                <Card.Body className="product-card__body">
                  <div className="product-card__pricing">
                    <span className="product-card__current-price">${product.currentPrice}</span>
                    <span className="product-card__original-price">${product.originalPrice}</span>
                  </div>
                  <p className="product-card__title">
                    {product.name}
                  </p>
                  <CustomButton
                    variant="outline-success"
                    size="sm"
                    className="product-card__button"
                    onClick={() => {
                      if (product.link) {
                        console.log('Add to cart:', product.name);
                      }
                    }}
                  >
                    <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
                    Add to Cart
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

export default PriceSection;
