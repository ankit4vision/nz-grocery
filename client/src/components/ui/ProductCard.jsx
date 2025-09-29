import React, { useState } from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faShoppingCart, faStar } from '@fortawesome/free-solid-svg-icons';
import './ProductCard.css';

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
  onAddToCart,
  onToggleFavorite
}) => {
  const [favorite, setFavorite] = useState(initialIsFavorite);

  const handleToggleFavorite = () => {
    setFavorite(!favorite);
    onToggleFavorite?.(id, !favorite);
  };

  const handleAddToCart = () => {
    onAddToCart?.(id);
  };

  return (
    <Card className="product-card">
      <div className="product-card__image">
        <img src={image} alt={name} />
        <button
          className={`product-card__favorite ${favorite ? 'favorited' : ''}`}
          onClick={handleToggleFavorite}
          aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <FontAwesomeIcon icon={faHeart} />
        </button>

        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <Badge className="product-card__badge">
            {discountPercentage}%
          </Badge>
        )}
      </div>

      <Card.Body className="product-card__body">
        <Card.Title className="product-card__title">
          {name} {unit && <span className="product-card__unit">({unit})</span>}
        </Card.Title>
        <div className="product-card__rating">
          {[...Array(5)].map((_, i) => (
            <FontAwesomeIcon key={i} icon={faStar} className={i < rating ? 'text-warning' : 'text-muted'} />
          ))}
          <span className="product-card__reviews">({reviews} reviews)</span>
        </div>
        <div className="product-card__pricing">
          <span className="product-card__current-price">${currentPrice}</span>
          {originalPrice && <span className="product-card__original-price">${originalPrice}</span>}
        </div>
        <Button variant="success" className="product-card__button" onClick={handleAddToCart}>
          <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
          Cart
        </Button>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
