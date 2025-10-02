import React, { useState } from 'react';
import { Card, Row, Col, Button, Container } from 'react-bootstrap';
import { CustomButton } from '../common';
import ProductCard from './ProductCard';
import { useCartContext } from '../../context';
import { productsListingData } from '../../data/mockData';
import '../../styles/components/ui-components/wishlist.css';

const Wishlist = () => {
  const { addItem } = useCartContext();
  
  // Filter products that are marked as favorites from mockData
  const [wishlistItems, setWishlistItems] = useState(
    productsListingData.filter(product => product.isFavorite === true)
  );

  const handleRemoveFromWishlist = (itemId) => {
    setWishlistItems(prev => prev.filter(item => item.id !== itemId));
  };

  const handleAddToCart = (product) => {
    addItem(product, 1);
  };

  const handleToggleFavorite = (productId) => {
    handleRemoveFromWishlist(productId);
  };


  return (
    <div className="wishlist">
      <div className="wishlist-header">
        <div className="header-content">
          <h2 className="wishlist-title">My Wishlist</h2>
          <p className="wishlist-subtitle">
            {wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} in your wishlist
          </p>
        </div>
      </div>

      {wishlistItems.length > 0 ? (
        <Container>
          <Row>
            {wishlistItems.map((item) => (
              <Col key={item.id} xs={12} sm={6} md={4} lg={4} xl={4} className="product-grid-col">
                    <ProductCard
                      id={item.id}
                      name={item.name}
                      unit={item.unit}
                      currentPrice={parseFloat(item.currentPrice)}
                      originalPrice={parseFloat(item.originalPrice)}
                      image={item.image}
                      rating={item.rating}
                      reviews={item.reviews}
                      discount={item.discount}
                      isFavorite={item.isFavorite}
                      category={item.subcategory || item.category}
                      onAddToCart={handleAddToCart}
                      onToggleFavorite={handleToggleFavorite}
                      variant="listing"
                      showDeleteIcon={true}
                    />
              </Col>
            ))}
          </Row>
        </Container>
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
    </div>
  );
};

export default Wishlist;
