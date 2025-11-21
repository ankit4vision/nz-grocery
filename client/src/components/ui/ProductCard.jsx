import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faShoppingCart, faStar, faTrash, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { ImageWithFallback } from '../common';
import { useCartContext, useUserContext } from '../../context';
import WishlistService from '../../services/api/wishlist';
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
  showDeleteIcon = false, // New prop to show delete icon instead of heart
  skipWishlistCheck = false // Skip wishlist status check (useful when already in wishlist context)
}) => {
  const [favorite, setFavorite] = useState(initialIsFavorite);
  const [quantity, setQuantity] = useState(1);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [wishlistItemId, setWishlistItemId] = useState(null);
  const navigate = useNavigate();
  const { addItem, toggleCart, isInCart, getItemQuantity, removeItem, updateItemQuantity } = useCartContext();
  const { isAuthenticated } = useUserContext();

  // Check if product is already in cart (using variant ID)
  const finalVariantId = variantId || id;
  const finalProductId = productId || id;
  const productInCart = isInCart(finalVariantId);
  const cartQuantity = getItemQuantity(finalVariantId);

  // Check if item is in wishlist on mount (if authenticated and not skipped)
  // Use ref to prevent multiple calls
  const wishlistCheckedRef = useRef(false);
  useEffect(() => {
    // Skip check if explicitly disabled or if we're in a wishlist context
    if (skipWishlistCheck) {
      return;
    }
    
    if (isAuthenticated && finalProductId && !wishlistCheckedRef.current) {
      wishlistCheckedRef.current = true;
      checkWishlistStatus();
    }
    // Reset when product changes
    return () => {
      wishlistCheckedRef.current = false;
    };
  }, [isAuthenticated, finalProductId, finalVariantId, skipWishlistCheck]);

  const checkWishlistStatus = async () => {
    try {
      const response = await WishlistService.getDefaultWishlist();
      if (response.success && response.data) {
        const itemsResponse = await WishlistService.getWishlistItems(response.data.wishlist_id);
        if (itemsResponse.success && Array.isArray(itemsResponse.data)) {
          // Find item matching product_id and variant_id (if variant_id exists)
          const item = itemsResponse.data.find(item => {
            const productMatch = item.product_id === finalProductId;
            // If variant_id exists in wishlist item, it must match. If not, match any variant of this product
            if (item.variant_id !== null && item.variant_id !== undefined) {
              return productMatch && item.variant_id === finalVariantId;
            }
            // If no variant_id in wishlist item, it matches any variant of this product
            return productMatch;
          });
          if (item) {
            setFavorite(true);
            setWishlistItemId(item.wishlist_item_id);
          } else {
            // Not in wishlist
            setFavorite(false);
            setWishlistItemId(null);
          }
        }
      }
    } catch (err) {
      // Silently fail - wishlist check is optional
      console.error('Error checking wishlist status:', err);
    }
  };

  const handleToggleFavorite = async (e) => {
    e.stopPropagation();
    
    // If showDeleteIcon is true, we're in wishlist context - use custom handler directly
    // (The handler in wishlist context has the item ID and handles the API call)
    if (showDeleteIcon && onToggleFavorite) {
      setFavorite(!favorite);
      onToggleFavorite(id, !favorite);
      return;
    }
    
    // If authenticated, use wishlist API (and also call custom handler for UI updates if provided)
    if (isAuthenticated) {
      setWishlistLoading(true);
      try {
        if (favorite && wishlistItemId) {
          // Remove from wishlist
          console.log('[ProductCard] Removing from wishlist:', { wishlistItemId, productId: finalProductId, variantId: finalVariantId });
          const response = await WishlistService.removeItem(wishlistItemId);
          if (response.success) {
            setFavorite(false);
            setWishlistItemId(null);
            // Call custom handler for UI updates if provided
            if (onToggleFavorite) {
              onToggleFavorite(id, false);
            }
            console.log('[ProductCard] Successfully removed from wishlist');
          } else {
            console.error('[ProductCard] Failed to remove from wishlist:', response.message);
          }
        } else {
          // Add to wishlist (uses default wishlist)
          // Validate we have product_id
          if (!finalProductId) {
            console.error('[ProductCard] Cannot add to wishlist: productId is missing');
            setWishlistLoading(false);
            return;
          }
          
          console.log('[ProductCard] Adding to wishlist:', { productId: finalProductId, variantId: finalVariantId });
          const response = await WishlistService.addItem({
            product_id: finalProductId,
            variant_id: finalVariantId || undefined,
          });
          if (response.success && response.data) {
            setFavorite(true);
            // Extract wishlist_item_id from response (could be nested or direct)
            const itemId = response.data.wishlist_item_id || response.data.id || response.data.item_id;
            if (itemId) {
              setWishlistItemId(itemId);
              console.log('[ProductCard] Successfully added to wishlist, item ID:', itemId);
            } else {
              // If item ID not in response, refresh wishlist status to get it
              console.log('[ProductCard] Item ID not in response, refreshing wishlist status...');
              setTimeout(() => checkWishlistStatus(), 500);
            }
            // Call custom handler for UI updates if provided
            if (onToggleFavorite) {
              onToggleFavorite(id, true);
            }
          } else {
            console.error('[ProductCard] Failed to add to wishlist:', response.message || response);
          }
        }
      } catch (err) {
        console.error('[ProductCard] Error updating wishlist:', err);
      } finally {
        setWishlistLoading(false);
      }
      return;
    }

    // If not authenticated, use custom handler if provided, or show message
    if (onToggleFavorite) {
      setFavorite(!favorite);
      onToggleFavorite(id, !favorite);
    } else {
      console.log('[ProductCard] Not authenticated, please login to add items to wishlist');
    }
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
          disabled={wishlistLoading}
          aria-label={showDeleteIcon ? 'Remove from wishlist' : (favorite ? 'Remove from favorites' : 'Add to favorites')}
        >
          {wishlistLoading ? (
            <FontAwesomeIcon icon={faSpinner} className="fa-spin" />
          ) : (
            <FontAwesomeIcon icon={showDeleteIcon ? faTrash : faHeart} />
          )}
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
