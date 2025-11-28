import React, { useState, useRef } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { CustomButton, NavigationButtons, ImageWithFallback } from '../common';
import { useCartContext, useUserContext, useAuthModal } from '../../context';
import '../../styles/components/ui-components/price-section.css';

const PriceSection = ({ 
  title = "Half Price Special",
  products = [],
  className = '',
  onViewAllClick
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef(null);
  const { addItem, isInCart, getItemQuantity, removeItem, updateItemQuantity } = useCartContext();
  const { isAuthenticated } = useUserContext();
  const { openLoginModal } = useAuthModal();
  
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
    if (!isAuthenticated) {
      openLoginModal();
      return;
    }

    addItem(product, 1);
    console.log(`Added ${product.name} to cart`);
  };

  const handleQuantityChange = (product, change) => {
    if (!isAuthenticated) {
      openLoginModal();
      return;
    }

    const currentQuantity = getItemQuantity(product.id);
    const newQuantity = Math.max(1, currentQuantity + change);
    
    if (newQuantity === 0) {
      removeItem(product.id);
    } else {
      updateItemQuantity(product.id, newQuantity);
    }
  };

  const handleQuantityButtonClick = (e, product, change) => {
    e.stopPropagation(); // Prevent any parent click events
    handleQuantityChange(product, change);
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
          {visibleProducts.map((product) => {
            const productInCart = isInCart(product.id);
            const cartQuantity = getItemQuantity(product.id);
            
            return (
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
                      {product.variantName || product.name}
                    </p>
                    {product.productName && product.productName !== (product.variantName || product.name) && (
                      <p className="product-card__product-name text-muted small mb-0">{product.productName}</p>
                    )}
                    
                    {/* Dynamic Button/Quantity Selector */}
                    {productInCart ? (
                      <div className="product-card__quantity-selector">
                        <CustomButton
                          variant="outline-secondary"
                          size="sm"
                          onClick={(e) => handleQuantityButtonClick(e, product, -1)}
                          className="product-card__quantity-btn"
                          disabled={cartQuantity <= 1}
                        >
                          -
                        </CustomButton>
                        <span className="product-card__quantity">{cartQuantity}</span>
                        <CustomButton
                          variant="outline-secondary"
                          size="sm"
                          onClick={(e) => handleQuantityButtonClick(e, product, 1)}
                          className="product-card__quantity-btn"
                        >
                          +
                        </CustomButton>
                      </div>
                    ) : (
                      <CustomButton
                        variant="outline-success"
                        size="sm"
                        className="product-card__button"
                        onClick={() => handleAddToCart(product)}
                      >
                        <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
                        Add to Cart
                      </CustomButton>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </section>
  );
};

export default PriceSection;
