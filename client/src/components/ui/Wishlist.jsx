import React, { useState } from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import { CustomButton } from '../common';
import { useCartContext } from '../../context';
import '../../styles/components/ui-components/wishlist.css';

const Wishlist = () => {
  const { addItem } = useCartContext();
  const [wishlistItems, setWishlistItems] = useState([
    {
      id: 1,
      name: 'Fresh Tomatoes',
      description: 'Organic red tomatoes',
      price: 2.99,
      unit: 'lb',
      image: '🍅',
      category: 'Vegetables'
    },
    {
      id: 2,
      name: 'Organic Bananas',
      description: 'Fresh yellow bananas',
      price: 1.49,
      unit: 'lb',
      image: '🍌',
      category: 'Fruits'
    },
    {
      id: 3,
      name: 'Whole Milk',
      description: 'Fresh dairy milk',
      price: 3.99,
      unit: 'gallon',
      image: '🥛',
      category: 'Dairy'
    },
    {
      id: 4,
      name: 'Organic Apples',
      description: 'Fresh red apples',
      price: 1.99,
      unit: 'lb',
      image: '🍎',
      category: 'Fruits'
    },
    {
      id: 5,
      name: 'Greek Yogurt',
      description: 'Creamy Greek yogurt',
      price: 5.99,
      unit: 'container',
      image: '🥄',
      category: 'Dairy'
    },
    {
      id: 6,
      name: 'Fresh Bread',
      description: 'Artisan whole wheat bread',
      price: 4.99,
      unit: 'loaf',
      image: '🍞',
      category: 'Bakery'
    }
  ]);

  const handleRemoveFromWishlist = (itemId) => {
    setWishlistItems(prev => prev.filter(item => item.id !== itemId));
  };

  const handleAddToCart = (item) => {
    addItem(item, 1);
    // Optionally remove from wishlist after adding to cart
    // handleRemoveFromWishlist(item.id);
  };

  const handleAddAllToCart = () => {
    wishlistItems.forEach(item => {
      addItem(item, 1);
    });
    setWishlistItems([]);
  };

  const handleClearWishlist = () => {
    setWishlistItems([]);
  };

  return (
    <div className="wishlist">
      <div className="wishlist-header">
        <div className="header-content">
          <h2 className="wishlist-title">My Wishlist</h2>
          <p className="wishlist-subtitle">Save your favorite products for later</p>
        </div>
        {wishlistItems.length > 0 && (
          <div className="header-actions">
            <CustomButton
              variant="outline-success"
              size="sm"
              onClick={handleAddAllToCart}
              className="action-btn"
            >
              <i className="fas fa-shopping-cart me-2"></i>
              Add All to Cart
            </CustomButton>
            <CustomButton
              variant="outline-danger"
              size="sm"
              onClick={handleClearWishlist}
              className="action-btn"
            >
              <i className="fas fa-trash me-2"></i>
              Clear All
            </CustomButton>
          </div>
        )}
      </div>

      {wishlistItems.length > 0 ? (
        <Row className="wishlist-grid">
          {wishlistItems.map((item) => (
            <Col key={item.id} lg={4} md={6} sm={6} className="mb-4">
              <Card className="wishlist-item-card">
                <Card.Body className="text-center">
                  <div className="item-image">
                    <span className="item-emoji">{item.image}</span>
                  </div>
                  
                  <div className="item-info">
                    <h5 className="item-name">{item.name}</h5>
                    <p className="item-description">{item.description}</p>
                    <div className="item-price">
                      <span className="price">${item.price.toFixed(2)}</span>
                      <span className="unit">/{item.unit}</span>
                    </div>
                  </div>

                  <div className="item-actions">
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleRemoveFromWishlist(item.id)}
                      className="remove-btn"
                      aria-label="Remove from wishlist"
                    >
                      <i className="fas fa-trash"></i>
                    </Button>
                    <CustomButton
                      variant="success"
                      size="sm"
                      onClick={() => handleAddToCart(item)}
                      className="add-to-cart-btn"
                    >
                      Add to Cart
                    </CustomButton>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Card className="empty-wishlist-card">
          <Card.Body className="text-center">
            <div className="empty-wishlist-icon">
              <i className="fas fa-heart"></i>
            </div>
            <h5 className="empty-wishlist-title">Your Wishlist is Empty</h5>
            <p className="empty-wishlist-text">
              Save your favorite products to your wishlist and they'll appear here for easy access.
            </p>
            <CustomButton variant="success" size="lg">
              Start Shopping
            </CustomButton>
          </Card.Body>
        </Card>
      )}

      {wishlistItems.length > 0 && (
        <div className="wishlist-summary">
          <Card className="summary-card">
            <Card.Body>
              <Row className="align-items-center">
                <Col md={6}>
                  <h6 className="summary-title">
                    {wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} in your wishlist
                  </h6>
                </Col>
                <Col md={6} className="text-end">
                  <CustomButton
                    variant="success"
                    size="lg"
                    onClick={handleAddAllToCart}
                    className="add-all-btn"
                  >
                    <i className="fas fa-shopping-cart me-2"></i>
                    Add All to Cart
                  </CustomButton>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
