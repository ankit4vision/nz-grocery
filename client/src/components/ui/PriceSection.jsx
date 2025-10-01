import React, { useState, useRef } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { CustomButton, NavigationButtons, ImageWithFallback } from '../common';
import { useCartContext } from '../../context';
import '../../styles/components/ui-components/price-section.css';

const PriceSection = ({ 
  title = "Half Price Special",
  products = [],
  className = '',
  onViewAllClick
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef(null);
  const { addItem } = useCartContext();
  
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

  const handleAddToCart = (product) => {
    addItem(product, 1);
    console.log(`Added ${product.name} to cart`);
  };

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
            <NavigationButtons
              onPrev={handlePrevClick}
              onNext={handleNextClick}
              isPrevDisabled={currentIndex === 0}
              isNextDisabled={currentIndex >= maxIndex}
            />
          </div>
        </div>
        
        <Row className="price-section__content" ref={scrollContainerRef}>
          {visibleProducts.map((product) => (
            <Col lg={3} md={6} sm={6} key={product.id} className="mb-4">
              <Card className="product-card">
                <div className="product-card__image">
                  <ImageWithFallback
                    src={product.image}
                    alt={product.name}
                    className="product-card__image-element"
                  />
                  <div
                    className="product-card__badge"
                    style={{
                      backgroundColor: 'var(--danger-color)',
                      color: 'var(--white)'
                    }}
                  >
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
                    onClick={() => handleAddToCart(product)}
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
