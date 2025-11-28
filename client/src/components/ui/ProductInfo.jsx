import React, { useState, useEffect } from 'react';
import { Button, Badge, Row, Col } from 'react-bootstrap';
import { FaHeart, FaStar, FaShoppingCart } from 'react-icons/fa';
import { CustomButton } from '../common';
import { useCartContext, useUserContext, useAuthModal } from '../../context';
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
  isFavorite: externalIsFavorite,
  wishlistLoading = false,
  className = '' 
}) => {
  const [isFavorite, setIsFavorite] = useState(externalIsFavorite !== undefined ? externalIsFavorite : (product?.isFavorite || false));
  const [quantity, setQuantity] = useState(1);
  const { addItem, isInCart, getItemQuantity, removeItem, updateItemQuantity } = useCartContext();
  const { isAuthenticated } = useUserContext();
  const { openLoginModal } = useAuthModal();

  // Update favorite state when external prop changes
  useEffect(() => {
    if (externalIsFavorite !== undefined) {
      setIsFavorite(externalIsFavorite);
    }
  }, [externalIsFavorite]);

  const handleToggleFavorite = () => {
    if (!isAuthenticated) {
      openLoginModal();
      return;
    }

    const newFavoriteState = !isFavorite;
    setIsFavorite(newFavoriteState);
    if (onToggleFavorite) {
      onToggleFavorite(product.id, newFavoriteState);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      openLoginModal();
      return;
    }

    // Ensure we have both productId and variantId
    const productId = product.productId || product.product_id || product.id;
    const variantId = product.variantId || product.variant_id || product.id;
    
    // Create product object for cart with proper IDs
    const productForCart = {
      productId: productId, // Product ID (required)
      variantId: variantId, // Variant ID (optional but should be included)
      product_id: productId, // API format
      variant_id: variantId, // API format
      ...product,
    };
    
    const result = await addItem(productForCart, quantity);
    if (onAddToCart) {
      onAddToCart(variantId, quantity);
    }
    
    if (!result.success) {
      console.error('Failed to add to cart:', result.message);
    }
  };

  const handleQuantityChange = async (change) => {
    if (!isAuthenticated) {
      openLoginModal();
      return;
    }

    const variantId = product.variantId || product.variant_id || product.id;
    const currentQuantity = isInCart(variantId) ? getItemQuantity(variantId) : quantity;
    const newQuantity = Math.max(1, currentQuantity + change);
    
    if (isInCart(variantId)) {
      if (newQuantity === 0) {
        await removeItem(variantId);
      } else {
        await updateItemQuantity(variantId, newQuantity);
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
            disabled={wishlistLoading}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            {wishlistLoading ? (
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            ) : (
              <FaHeart />
            )}
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

      {/* Add to Cart */}
      <div className="add-to-cart-simple">
        <div className="quantity-controls">
          <div className="product-card__quantity-selector">
            <Button 
              variant="outline-secondary" 
              size="sm"
              onClick={() => handleQuantityChange(-1)}
              disabled={(isInCart(product.variantId || product.variant_id || product.id) ? getItemQuantity(product.variantId || product.variant_id || product.id) : quantity) <= 1}
              className="product-card__quantity-btn"
            >
              −
            </Button>
            <span className="product-card__quantity">
              {isInCart(product.variantId || product.variant_id || product.id) ? getItemQuantity(product.variantId || product.variant_id || product.id) : quantity}
            </span>
            <Button 
              variant="outline-secondary" 
              size="sm"
              onClick={() => handleQuantityChange(1)}
              disabled={isInCart(product.variantId || product.variant_id || product.id) ? false : quantity >= (product.stockCount || 99)}
              className="product-card__quantity-btn"
            >
              +
            </Button>
          </div>
        </div>
        
        {!isInCart(product.variantId || product.variant_id || product.id) ? (
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
