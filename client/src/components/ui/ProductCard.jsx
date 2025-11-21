import React, { useState } from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faShoppingCart, faStar, faTrash } from '@fortawesome/free-solid-svg-icons';
import { ImageWithFallback } from '../common';
import { useCartContext } from '../../context';
import '../../styles/components/cards/product-card.css';

const ProductCard = ({
  id, // Variant ID (for backward compatibility)
  productId, // Product ID for fetching full details
  variantId, // Variant ID (explicit)
  name, // Display name (variant name or combined)
  productName, // Product name for small text
  variantName, // Variant name for main title
  unit,
  currentPrice,
  originalPrice,
  image,
  rating,
  reviews,
  discount: discountPercentage,
  isFavorite: initialIsFavorite,
  category,
  onAddToCart,
  onToggleFavorite,
  variant = 'default', // New prop for different variants
  showQuantitySelector = false, // New prop for quantity selector
  showDeleteIcon = false // New prop to show delete icon instead of heart
}) => {
  const [favorite, setFavorite] = useState(initialIsFavorite);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  const { addItem, toggleCart, isInCart, getItemQuantity, removeItem, updateItemQuantity } = useCartContext();

  // Check if product is already in cart (using variant ID)
  const finalVariantId = variantId || id;
  const productInCart = isInCart(finalVariantId);
  const cartQuantity = getItemQuantity(finalVariantId);

  const handleToggleFavorite = (e) => {
    e.stopPropagation();
    setFavorite(!favorite);
    onToggleFavorite?.(id, !favorite);
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    
    // Ensure we have both productId and variantId
    const finalProductId = productId || id;
    const finalVariantId = variantId || id;
    
    // Create product object for cart
    // Include both productId and variantId for cart operations
    const product = {
      productId: finalProductId, // Product ID (required)
      variantId: finalVariantId, // Variant ID (optional but should be included)
      product_id: finalProductId, // API format
      variant_id: finalVariantId, // API format
      name,
      unit,
      currentPrice,
      originalPrice,
      image,
      rating,
      reviews,
      discount: discountPercentage,
      category
    };
    
    // Add to cart using context (now uses real API)
    const result = await addItem(product, quantity);
    
    // Call custom handler if provided
    onAddToCart?.(product, quantity);
    
    // Show success feedback
    if (result.success) {
      // Optionally show toast notification here
      console.log(`Added ${quantity} x ${name} to cart`);
    } else {
      console.error('Failed to add to cart:', result.message);
    }
  };

  const handleCardClick = () => {
    // Use productId for navigation (to fetch full product details)
    // Pass variant_id as query parameter
    const productIdToUse = productId || id;
    const variantIdToUse = variantId || id;
    
    // Navigate to product detail page with variant_id as query parameter
    navigate(`/product/${productIdToUse}${variantIdToUse ? `?variant_id=${variantIdToUse}` : ''}`);
  };

  const handleQuantityChange = async (change) => {
    const finalVariantId = variantId || id;
    const newQuantity = Math.max(1, cartQuantity + change);
    
    if (newQuantity === 0) {
      // Remove from cart if quantity becomes 0
      await removeItem(finalVariantId);
    } else {
      // Update quantity in cart (uses real API)
      await updateItemQuantity(finalVariantId, newQuantity);
    }
  };

  const handleQuantityButtonClick = (e, change) => {
    e.stopPropagation(); // Prevent card click
    handleQuantityChange(change);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FontAwesomeIcon key={i} icon={faStar} className="text-warning" />);
    }

    if (hasHalfStar) {
      stars.push(<FontAwesomeIcon key="half" icon={faStar} className="text-warning" style={{ clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)' }} />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FontAwesomeIcon key={`empty-${i}`} icon={faStar} className="text-muted" />);
    }

    return stars;
  };

  const renderAddToCartButton = () => {
    // If product is already in cart, show quantity selector
    if (productInCart) {
      return (
        <div className="product-card__quantity-selector">
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={(e) => handleQuantityButtonClick(e, -1)}
            className="product-card__quantity-btn"
            disabled={cartQuantity <= 1}
          >
            -
          </Button>
          <span className="product-card__quantity">{cartQuantity}</span>
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={(e) => handleQuantityButtonClick(e, 1)}
            className="product-card__quantity-btn"
          >
            +
          </Button>
        </div>
      );
    }

    // If showQuantitySelector prop is true (for special cases)
    if (showQuantitySelector) {
      return (
        <div className="product-card__quantity-selector">
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={(e) => handleQuantityButtonClick(e, -1)}
            className="product-card__quantity-btn"
            disabled={quantity <= 1}
          >
            -
          </Button>
          <span className="product-card__quantity">{quantity}</span>
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={(e) => handleQuantityButtonClick(e, 1)}
            className="product-card__quantity-btn"
          >
            +
          </Button>
        </div>
      );
    }

    // Default Add to Cart button
    return (
      <Button variant="success" className="product-card__button" onClick={handleAddToCart}>
        <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
        Add to Cart
      </Button>
    );
  };

  return (
    <Card className={`product-card product-card--${variant}`} onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      <div className="product-card__image">
        <ImageWithFallback 
          src={image} 
          alt={name}
          className="product-card__image-element"
        />
        <button
          className={`product-card__favorite ${favorite ? 'favorited' : ''} ${showDeleteIcon ? 'delete-icon' : ''}`}
          onClick={handleToggleFavorite}
          aria-label={showDeleteIcon ? 'Remove from wishlist' : (favorite ? 'Remove from favorites' : 'Add to favorites')}
        >
          <FontAwesomeIcon icon={showDeleteIcon ? faTrash : faHeart} />
        </button>

        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <Badge bg="warning" className="product-card__badge">
            {discountPercentage}%
          </Badge>
        )}
      </div>

      <Card.Body className="product-card__body">
        <Card.Title className="product-card__title">
          {variantName || name}
        </Card.Title>
        {productName && productName !== (variantName || name) && (
          <p className="product-card__product-name text-muted small mb-1">{productName}</p>
        )}
        {unit && unit !== 'each' && (
          <p className="product-card__unit">{unit}</p>
        )}
        {category && (
          <p className="product-card__category">{category}</p>
        )}
        
        <div className="product-card__pricing">
          {originalPrice && originalPrice !== currentPrice && (
            <span className="product-card__original-price">${parseFloat(originalPrice).toFixed(2)}</span>
          )}
          <span className="product-card__current-price">${parseFloat(currentPrice).toFixed(2)}</span>
        </div>
        
        <div className="product-card__actions">
          {renderAddToCartButton()}
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
