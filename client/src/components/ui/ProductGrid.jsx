import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import ProductCard from './ProductCard';
import '../../styles/components/ui-components/product-grid.css';

/**
 * ProductGrid - Grid layout for displaying products using ProductCard component
 * 
 * @param {Array} products - Array of product objects
 * @param {function} onAddToCart - Callback when product is added to cart
 * @param {function} onToggleFavorite - Callback when favorite is toggled
 * @param {string} className - Additional CSS classes
 * 
 * @example
 * <ProductGrid 
 *   products={productsData}
 *   onAddToCart={(product) => console.log('Add to cart:', product)}
 *   onToggleFavorite={(productId) => console.log('Toggle favorite:', productId)}
 * />
 */
const ProductGrid = ({ 
  products = [], 
  onAddToCart = () => {},
  onToggleFavorite = () => {},
  className = '' 
}) => {
  const handleAddToCart = (product) => {
    onAddToCart(product);
  };

  const handleToggleFavorite = (productId, isFavorite) => {
    onToggleFavorite(productId);
  };

  // Helper function to get category display name
  // Use categoryName from product if available, otherwise use categoryId
  const getCategoryName = (product) => {
    // If product has categoryName (from API), use it
    if (product.categoryName) {
      return product.categoryName;
    }
    // Otherwise, try to use category as string
    if (product.category) {
      return typeof product.category === 'string' ? product.category : `Category ${product.category}`;
    }
    return 'Uncategorized';
  };

  // Determine if product should show quantity selector
  const shouldShowQuantitySelector = (productId) => {
    // Greek Yogurt (id: 7) and Organic Carrots (id: 8) show quantity selector
    return productId === 7 || productId === 8;
  };

  if (products.length === 0) {
    return (
      <div className={`product-grid-empty ${className}`}>
        <Container>
          <Row>
            <Col className="text-center">
              <div className="product-grid-empty-content">
                <i className="fas fa-search product-grid-empty-icon"></i>
                <h4>No products found</h4>
                <p>Try adjusting your filters or search terms</p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  return (
    <div className={`product-grid ${className}`}>
      <Container>
        <Row>
          {products.map((product) => (
            <Col key={product.id} xs={6} sm={6} md={3} lg={3} xl={3} className="product-grid-col">
              <ProductCard
                id={product.id} // Variant ID (for backward compatibility)
                productId={product.productId} // Product ID for fetching full details
                variantId={product.variantId || product.id} // Variant ID (explicit)
                name={product.name}
                productName={product.productName}
                variantName={product.variantName}
                unit={product.unit}
                currentPrice={product.currentPrice}
                originalPrice={product.originalPrice}
                image={product.image}
                rating={product.rating}
                reviews={product.reviews}
                discount={product.discount}
                isFavorite={product.isFavorite}
                category={getCategoryName(product)}
                onAddToCart={handleAddToCart}
                onToggleFavorite={handleToggleFavorite}
                variant="listing"
                showQuantitySelector={shouldShowQuantitySelector(product.id)}
              />
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default ProductGrid;
