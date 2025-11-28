import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import ProductCard from './ProductCard';
import { LoadMore } from '../common';
import '../../styles/components/ui-components/featured-products.css';

const FeaturedProducts = ({
  title = "Featured Products",
  products = [],
  productsPerRow = 4,
  className = "",
  onAddToCart,
  onToggleFavorite,
  showLoadMore = false // Hide Load More button by default
}) => {
  const [visibleProducts, setVisibleProducts] = useState(8); // Show 8 products initially
  
  const handleLoadMore = () => {
    setVisibleProducts(prev => prev + 4); // Load 4 more products
  };

  const displayedProducts = products.slice(0, visibleProducts);
  const hasMoreProducts = visibleProducts < products.length;

  return (
    <section className={`featured-products ${className}`}>
      <Container>
        {/* Header */}
        <div className="featured-products__header">
          <div className="featured-products__title-section">
            <h2 className="featured-products__title">{title}</h2>
          </div>
        </div>

        {/* Products Grid */}
        <Row className="featured-products__grid">
          {displayedProducts.map((product) => {
            // Get category name - use categoryName if available, otherwise use category
            const categoryDisplay = product.categoryName || 
              (product.category && typeof product.category === 'string' ? product.category : null) ||
              'Uncategorized';
            
            return (
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
                  category={categoryDisplay}
                  onAddToCart={onAddToCart}
                  onToggleFavorite={onToggleFavorite}
                />
              </Col>
            );
          })}
        </Row>

        {/* Load More Button - Only show if showLoadMore prop is true */}
        {showLoadMore && (
          <LoadMore
            onLoadMore={handleLoadMore}
            hasMore={hasMoreProducts}
            text="Load More Products"
            size="lg"
            className="featured-products__load-more"
          />
        )}
      </Container>
    </section>
  );
};

export default FeaturedProducts;
