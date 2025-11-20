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
    // Use variantId for cart if available, otherwise use id
    const cartId = product.variantId || product.id;
    const productForCart = {
      ...product,
      id: cartId, // Ensure cart uses variant ID
    };
    
    addItem(productForCart, quantity);
    if (onAddToCart) {
      onAddToCart(cartId, quantity);
    }
  };

  const handleQuantityChange = (change) => {
    // Use variantId for cart if available, otherwise use id
    const cartId = product.variantId || product.id;
    const currentQuantity = isInCart(cartId) ? getItemQuantity(cartId) : quantity;
    const newQuantity = Math.max(1, currentQuantity + change);
    
    if (isInCart(cartId)) {
      if (newQuantity === 0) {
        removeItem(cartId);
      } else {
        updateItemQuantity(cartId, newQuantity);
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

  const descriptionText = product.shortDescription || product.description;

  // Get display names - variant name as main, product name as secondary
  const variantDisplayName = product.variantName || product.name || 'Product';
  const productDisplayName = product.productName || '';

  return (
    <div className={`product-info ${className}`}>
      {/* Product Title */}
      <div className="product-header">
        <h1 className="product-title">{variantDisplayName}</h1>
        {productDisplayName && productDisplayName !== variantDisplayName && (
          <p className="product-name-subtitle text-muted small mb-0">{productDisplayName}</p>
        )}
      </div>

      {/* Variant Label */}
      {product.variantLabel && product.variantLabel !== variantDisplayName && (
        <div className="product-variant-label mb-3">
          <Badge bg="light" text="dark" className="text-uppercase">
            {product.variantLabel}
          </Badge>
        </div>
      )}

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
        <p>{descriptionText}</p>
      </div>

      {/* Pricing */}
      <div className="product-pricing">
        <div className="current-price">
          {formatPrice(product.currentPrice)}
        </div>
        {product.originalPrice && product.originalPrice !== product.currentPrice && (
          <div className="original-price">
            Was {formatPrice(product.originalPrice)}
          </div>
        )}
        {product.discount > 0 && (
          <Badge bg="success" className="discount-badge">
            {product.discount}% OFF
          </Badge>
        )}
      </div>

      {/* Rating */}
      <div className="product-rating-simple">
        <div className="stars">
          {renderStars(product.rating)}
        </div>
        <span className="rating-text">{product.rating} ({product.reviews} reviews)</span>
      </div>

      {/* Add to Cart */}
      <div className="add-to-cart-simple">
        <div className="quantity-controls">
          <div className="product-card__quantity-selector">
            <Button 
              variant="outline-secondary" 
              size="sm"
              onClick={() => handleQuantityChange(-1)}
              disabled={isInCart(product.variantId || product.id) ? getItemQuantity(product.variantId || product.id) <= 1 : quantity <= 1}
              className="product-card__quantity-btn"
            >
              −
            </Button>
            <span className="product-card__quantity">
              {isInCart(product.variantId || product.id) ? getItemQuantity(product.variantId || product.id) : quantity}
            </span>
            <Button 
              variant="outline-secondary" 
              size="sm"
              onClick={() => handleQuantityChange(1)}
              disabled={isInCart(product.variantId || product.id) ? false : quantity >= (product.stockCount || 99)}
              className="product-card__quantity-btn"
            >
              +
            </Button>
          </div>
        </div>
        
        {!isInCart(product.variantId || product.id) ? (
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

      {/* Tags */}
      {product.tags && product.tags.length > 0 && (
        <div className="product-tags">
          {product.tags.map((tag, index) => (
            <Badge key={index} bg="light" text="muted" className="product-tag">
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductInfo;
