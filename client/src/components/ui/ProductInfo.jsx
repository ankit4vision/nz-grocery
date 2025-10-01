import React, { useState } from 'react';
import { Button, Badge, Row, Col } from 'react-bootstrap';
import { FaHeart, FaStar, FaShoppingCart } from 'react-icons/fa';
import { CustomButton } from '../common';
import { useCartContext } from '../../context';
import '../../styles/components/ui-components/product-info.css';

/**
 * ProductInfo - Component for displaying product details and actions
 * 
 * @param {Object} product - Product data object
 * @param {function} onAddToCart - Callback when add to cart is clicked
 * @param {function} onToggleFavorite - Callback when favorite is toggled
 * @param {string} className - Additional CSS classes
 * 
 * @example
 * <ProductInfo 
 *   product={productDetailData}
 *   onAddToCart={(productId) => console.log('Add to cart:', productId)}
 *   onToggleFavorite={(productId, isFavorite) => console.log('Toggle favorite:', productId, isFavorite)}
 * />
 */
const ProductInfo = ({ 
  product, 
  onAddToCart, 
  onToggleFavorite,
  onRatingClick,
  className = '' 
}) => {
  const [isFavorite, setIsFavorite] = useState(product?.isFavorite || false);
  const [quantity, setQuantity] = useState(1);
  const { addItem, isInCart, getItemQuantity, removeItem, updateItemQuantity } = useCartContext();

  const handleToggleFavorite = () => {
    const newFavoriteState = !isFavorite;
    setIsFavorite(newFavoriteState);
    if (onToggleFavorite) {
      onToggleFavorite(product.id, newFavoriteState);
    }
  };

  const handleAddToCart = () => {
    addItem(product, quantity);
    if (onAddToCart) {
      onAddToCart(product.id, quantity);
    }
  };

  const handleQuantityChange = (change) => {
    const currentQuantity = isInCart(product.id) ? getItemQuantity(product.id) : quantity;
    const newQuantity = Math.max(1, currentQuantity + change);
    
    if (isInCart(product.id)) {
      if (newQuantity === 0) {
        removeItem(product.id);
      } else {
        updateItemQuantity(product.id, newQuantity);
      }
    } else {
      setQuantity(newQuantity);
    }
  };

  const handleRatingClick = () => {
    if (onRatingClick) {
      onRatingClick();
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <FaStar 
        key={index} 
        className={`star ${index < Math.floor(rating) ? 'filled' : 'empty'}`}
      />
    ));
  };

  const formatPrice = (price) => {
    return `$${parseFloat(price).toFixed(2)}`;
  };

  if (!product) {
    return (
      <div className={`product-info ${className}`}>
        <div className="loading-placeholder">
          <div className="placeholder-line placeholder-title"></div>
          <div className="placeholder-line placeholder-price"></div>
          <div className="placeholder-line placeholder-description"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`product-info ${className}`}>
      {/* Product Title and Unit */}
      <div className="product-header">
        <h1 className="product-title">{product.name}</h1>
        <div className="product-unit-badge">
          <span className="unit-text">{product.unit}</span>
        </div>
      </div>

      {/* Rating and Favorite */}
      <div className="product-rating-section">
        <div className="rating-container">
          <div className="rating-display" onClick={handleRatingClick}>
            <div className="stars">
              {renderStars(product.rating)}
            </div>
            <span className="rating-value">{product.rating}</span>
            <span className="rating-text">({product.reviews} reviews)</span>
          </div>
          <button 
            className={`favorite-btn ${isFavorite ? 'favorited' : ''}`}
            onClick={handleToggleFavorite}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <FaHeart />
          </button>
        </div>
      </div>

      {/* Product Description */}
      <div className="product-description">
        <p>{product.description}</p>
      </div>

      {/* Pricing */}
      <div className="product-pricing">
        <div className="pricing-main">
          <div className="current-price">
            {formatPrice(product.currentPrice)}
          </div>
          {product.discount > 0 && (
            <Badge bg="success" className="discount-badge">
              {product.discount}% OFF
            </Badge>
          )}
        </div>
        {product.originalPrice && product.originalPrice !== product.currentPrice && (
          <div className="original-price">
            Was {formatPrice(product.originalPrice)}
          </div>
        )}
      </div>

      {/* Add to Cart Section */}
      <div className="add-to-cart-section">
        <div className="quantity-section">
          <div className="quantity-controls">
            <div className="product-card__quantity-selector">
              <Button 
                variant="outline-secondary" 
                size="sm"
                onClick={() => handleQuantityChange(-1)}
                disabled={isInCart(product.id) ? getItemQuantity(product.id) <= 1 : quantity <= 1}
                className="product-card__quantity-btn"
              >
                −
              </Button>
              <span className="product-card__quantity">
                {isInCart(product.id) ? getItemQuantity(product.id) : quantity}
              </span>
              <Button 
                variant="outline-secondary" 
                size="sm"
                onClick={() => handleQuantityChange(1)}
                disabled={isInCart(product.id) ? false : quantity >= (product.stockCount || 99)}
                className="product-card__quantity-btn"
              >
                +
              </Button>
            </div>
          </div>
        </div>
        
        <div className="action-section">
          {!isInCart(product.id) ? (
            <CustomButton
              variant="success"
              size="md"
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="add-to-cart-btn"
            >
              <FaShoppingCart className="me-2" />
              Add to Cart
            </CustomButton>
          ) : (
            <div className="in-cart-indicator">
              <Badge bg="success" className="in-cart-badge">
                ✓ Added to Cart
              </Badge>
            </div>
          )}
        </div>
      </div>

      {/* Product Details */}
      <div className="product-details">
        <div className="detail-item">
          <div className="detail-icon">⭐</div>
          <div className="detail-content">
            <span className="detail-label">Customer Rating</span>
            <span className="detail-value">
              {product.rating} ★ ({product.reviews} reviews)
            </span>
          </div>
        </div>
      </div>

      {/* Tags */}
      {product.tags && product.tags.length > 0 && (
        <div className="product-tags">
          {product.tags.map((tag, index) => (
            <Badge key={index} bg="light" text="dark" className="tag">
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductInfo;
