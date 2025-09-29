import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import ProductCard from './ProductCard';
import './FeaturedProducts.css';

const FeaturedProducts = ({
  title = "Featured Products",
  products = [],
  productsPerRow = 4,
  className = "",
  onAddToCart,
  onToggleFavorite
}) => {
  const [sortBy, setSortBy] = useState('featured');
  
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const getSortedProducts = () => {
    const sorted = [...products];
    switch (sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => a.currentPrice - b.currentPrice);
      case 'price-high':
        return sorted.sort((a, b) => b.currentPrice - a.currentPrice);
      case 'rating':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'discount':
        return sorted.sort((a, b) => (b.discount || 0) - (a.discount || 0));
      default:
        return sorted;
    }
  };

  const sortedProducts = getSortedProducts();

  return (
    <section className={`featured-products ${className}`}>
      <Container>
        {/* Header */}
        <div className="featured-products__header">
          <div className="featured-products__title-section">
            <h2 className="featured-products__title">{title}</h2>
            <div className="featured-products__controls">
              <Form.Select 
                value={sortBy} 
                onChange={handleSortChange}
                className="featured-products__sort"
                size="sm"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="discount">Best Discount</option>
              </Form.Select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <Row className="featured-products__grid">
          {sortedProducts.map((product) => (
            <Col 
              key={product.id} 
              xs={12} 
              sm={6} 
              md={6} 
              lg={12 / productsPerRow}
              className="featured-products__item"
            >
              <ProductCard
                {...product}
                onAddToCart={onAddToCart}
                onToggleFavorite={onToggleFavorite}
              />
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default FeaturedProducts;
