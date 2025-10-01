import React, { useState } from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faShoppingCart, faStar } from '@fortawesome/free-solid-svg-icons';
import { ImageWithFallback } from '../common';
import '../../styles/components/cards/product-card.css';

const ProductCard = ({
  id,
  name,
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
  showQuantitySelector = false // New prop for quantity selector
}) => {
  const [favorite, setFavorite] = useState(initialIsFavorite);
  const [quantity, setQuantity] = useState(1);

  const handleToggleFavorite = () => {
    setFavorite(!favorite);
    onToggleFavorite?.(id, !favorite);
  };

  const handleAddToCart = () => {
    onAddToCart?.({ id, quantity });
  };

  const handleQuantityChange = (change) => {
    const newQuantity = Math.max(1, quantity + change);
    setQuantity(newQuantity);
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
    if (showQuantitySelector) {
      return (
        <div className="product-card__quantity-selector">
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => handleQuantityChange(-1)}
            className="product-card__quantity-btn"
            disabled={quantity <= 1}
          >
            -
          </Button>
          <span className="product-card__quantity">{quantity}</span>
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => handleQuantityChange(1)}
            className="product-card__quantity-btn"
          >
            +
          </Button>
        </div>
      );
    }

    return (
      <Button variant="success" className="product-card__button" onClick={handleAddToCart}>
        <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
        Add to Cart
      </Button>
    );
  };

  return (
    <Card className={`product-card product-card--${variant}`}>
      <div className="product-card__image">
        <ImageWithFallback 
          src={image} 
          alt={name}
          className="product-card__image-element"
        />
        <button
          className={`product-card__favorite ${favorite ? 'favorited' : ''}`}
          onClick={handleToggleFavorite}
          aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <FontAwesomeIcon icon={faHeart} />
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
          {name}
        </Card.Title>
        <p className="product-card__unit">{unit}</p>
        {category && (
          <p className="product-card__category">{category}</p>
        )}
        
        <div className="product-card__rating">
          <div className="product-card__stars">
            {renderStars(rating)}
          </div>
          <span className="product-card__reviews">({reviews})</span>
        </div>
        
        <div className="product-card__pricing">
          {originalPrice && (
            <span className="product-card__original-price">${originalPrice}</span>
          )}
          <span className="product-card__current-price">${currentPrice}</span>
        </div>
        
        <div className="product-card__actions">
          {renderAddToCartButton()}
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
