import React, { useState } from 'react';
import { Container, Row, Col, Button, Badge } from 'react-bootstrap';
import { FaChevronLeft, FaChevronRight, FaHeart, FaShoppingCart } from 'react-icons/fa';
import { ImageWithFallback } from '../common';
import { useCartContext } from '../../context';
import '../../styles/components/ui-components/similar-products.css';

/**
 * SimilarProducts - Component for displaying similar/related products
 * 
 * @param {Array} products - Array of similar products
 * @param {string} title - Section title
 * @param {function} onAddToCart - Callback when add to cart is clicked
 * @param {function} onToggleFavorite - Callback when favorite is toggled
 * @param {function} onProductClick - Callback when product is clicked
 * @param {string} className - Additional CSS classes
 * 
 * @example
 * <SimilarProducts 
 *   products={similarProductsData}
 *   title="Similar Items"
 *   onAddToCart={(productId) => console.log('Add to cart:', productId)}
 *   onToggleFavorite={(productId, isFavorite) => console.log('Toggle favorite:', productId, isFavorite)}
 *   onProductClick={(productId) => console.log('Product clicked:', productId)}
 * />
 */
const SimilarProducts = ({ 
  products = [], 
  title = "Similar Items",
  onAddToCart,
  onToggleFavorite,
  onProductClick,
  className = '' 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [favorites, setFavorites] = useState({});
  const { addItem, isInCart, getItemQuantity, removeItem, updateItemQuantity } = useCartContext();
  const productsPerView = 4; // Number of products to show at once
  const maxIndex = Math.max(0, products.length - productsPerView);

  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  const handleToggleFavorite = (productId, isFavorite) => {
    setFavorites(prev => ({
      ...prev,
      [productId]: isFavorite
    }));
    if (onToggleFavorite) {
      onToggleFavorite(productId, isFavorite);
    }
  };

  const handleAddToCart = (product) => {
    addItem(product, 1);
    if (onAddToCart) {
      onAddToCart(product.id);
    }
  };

  const handleQuantityChange = (product, change) => {
    const currentQuantity = getItemQuantity(product.id);
    const newQuantity = Math.max(1, currentQuantity + change);
    
    if (newQuantity === 0) {
      removeItem(product.id);
    } else {
      updateItemQuantity(product.id, newQuantity);
    }
  };

  const handleQuantityButtonClick = (e, product, change) => {
    e.stopPropagation();
    handleQuantityChange(product, change);
  };

  const handleProductClick = (productId) => {
    if (onProductClick) {
      onProductClick(productId);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span 
        key={index} 
        className={`star ${index < Math.floor(rating) ? 'filled' : 'empty'}`}
      >
        ★
      </span>
    ));
  };

  const formatPrice = (price) => {
    return `$${parseFloat(price).toFixed(2)}`;
  };

  if (products.length === 0) {
    return null;
  }

  const visibleProducts = products.slice(currentIndex, currentIndex + productsPerView);

  return (
    <section className={`similar-products ${className}`}>
      <Container>
        {/* Section Header */}
        <header className="section-header">
          <h2 className="section-title">{title}</h2>
          {products.length > productsPerView && (
            <nav className="navigation-controls">
              <Button 
                variant="outline-secondary" 
                size="sm"
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className="nav-btn"
                aria-label="Previous products"
              >
                <FaChevronLeft />
              </Button>
              <Button 
                variant="outline-secondary" 
                size="sm"
                onClick={handleNext}
                disabled={currentIndex >= maxIndex}
                className="nav-btn"
                aria-label="Next products"
              >
                <FaChevronRight />
              </Button>
            </nav>
          )}
        </header>

        {/* Products Grid */}
        <Row className="products-grid">
          {visibleProducts.map((product) => (
            <Col key={product.id} xs={6} md={3} className="product-col">
              <article className="product-card" onClick={() => handleProductClick(product.id)}>
                {/* Product Image */}
                <div className="product-image-container">
                  <ImageWithFallback 
                    src={product.image} 
                    alt={product.name}
                    className="product-image"
                  />
                  
                  {/* Badge */}
                  {product.badge && (
                    <Badge bg="success" className="product-badge">
                      {product.badge}
                    </Badge>
                  )}

                  {/* Favorite Button */}
                  <button 
                    className={`favorite-btn ${favorites[product.id] !== undefined ? (favorites[product.id] ? 'favorited' : '') : (product.isFavorite ? 'favorited' : '')}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      const currentFavorite = favorites[product.id] !== undefined ? favorites[product.id] : product.isFavorite;
                      handleToggleFavorite(product.id, !currentFavorite);
                    }}
                    aria-label={favorites[product.id] !== undefined ? (favorites[product.id] ? 'Remove from favorites' : 'Add to favorites') : (product.isFavorite ? 'Remove from favorites' : 'Add to favorites')}
                  >
                    <FaHeart />
                  </button>
                </div>

                {/* Product Info */}
                <div className="product-info">
                  {/* Price */}
                  <div className="product-price">
                    {formatPrice(product.currentPrice)}
                    {product.unit && <span className="price-unit"> / {product.unit}</span>}
                  </div>

                  {/* Product Name - Variant as main, Product as small */}
                  <h3 className="product-name">{product.variantName || product.name}</h3>
                  {product.productName && product.productName !== (product.variantName || product.name) && (
                    <p className="product-name-subtitle text-muted small mb-0">{product.productName}</p>
                  )}

                  {/* Rating */}
                  <div className="product-rating">
                    <span className="rating-value">{product.rating}</span>
                    <div className="stars">
                      {renderStars(product.rating)}
                    </div>
                    <span className="reviews-count">({product.reviews})</span>
                  </div>

                  {/* Dynamic Button/Quantity Selector */}
                  {isInCart(product.id) ? (
                    <div className="product-card__quantity-selector">
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={(e) => handleQuantityButtonClick(e, product, -1)}
                        className="product-card__quantity-btn"
                        disabled={getItemQuantity(product.id) <= 1}
                      >
                        -
                      </Button>
                      <span className="product-card__quantity">{getItemQuantity(product.id)}</span>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={(e) => handleQuantityButtonClick(e, product, 1)}
                        className="product-card__quantity-btn"
                      >
                        +
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      variant="success"
                      className="product-card__button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                    >
                      <FaShoppingCart className="me-2" />
                      Add to Cart
                    </Button>
                  )}
                </div>
              </article>
            </Col>
          ))}
        </Row>

        {/* Pagination Indicators */}
        {products.length > productsPerView && (
          <nav className="pagination-indicators">
            {Array.from({ length: maxIndex + 1 }, (_, index) => (
              <button
                key={index}
                className={`indicator ${index === currentIndex ? 'active' : ''}`}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to page ${index + 1}`}
              />
            ))}
          </nav>
        )}
      </Container>
    </section>
  );
};

export default SimilarProducts;
