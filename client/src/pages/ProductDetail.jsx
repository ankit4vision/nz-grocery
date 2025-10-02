import React, { useRef } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { ProductImageGallery, ProductInfo, SimilarProducts, CustomerReviews } from '../components';
import { useCartContext } from '../context';
import { productDetailData, similarProductsData, customerReviewsData } from '../data/mockData';
import './ProductDetail.css';

/**
 * ProductDetail - Product detail page component
 * Displays comprehensive product information including images, details, similar products, and reviews
 */
const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const reviewsRef = useRef(null);
  const { addItem, toggleCart } = useCartContext();

  // In a real app, you would fetch product data based on the ID
  // For now, we'll use the mock data
  const product = productDetailData;
  const similarProducts = similarProductsData;
  const reviews = customerReviewsData;

  const handleAddToCart = (productId, quantity = 1) => {
    // Find the product in similar products or use main product
    const productToAdd = similarProducts.find(p => p.id === productId) || product;
    
    if (productToAdd) {
      addItem(productToAdd, quantity);
      console.log(`Added ${quantity} x ${productToAdd.name} to cart`);
    }
  };

  const handleToggleFavorite = (productId, isFavorite) => {
    console.log('Toggle favorite:', productId, 'Is favorite:', isFavorite);
    // In a real app, this would update the favorite status
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleWriteReview = () => {
    console.log('Write review clicked');
    // In a real app, this would open a review form modal
  };

  const handleShowAllReviews = (showAll) => {
    console.log('Show all reviews:', showAll);
    // In a real app, this would expand/collapse reviews
  };

  const handleImageClick = (imageUrl) => {
    console.log('Image clicked:', imageUrl);
    // In a real app, this might open a lightbox or fullscreen view
  };

  const handleRatingClick = () => {
    if (reviewsRef.current) {
      reviewsRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  if (!product) {
    return (
      <Container className="product-detail-page">
        <div className="product-not-found">
          <h2>Product Not Found</h2>
          <p>The product you're looking for doesn't exist.</p>
        </div>
      </Container>
    );
  }

  return (
    <div className="product-detail-page">
      <Container>
        {/* Main Product Section */}
        <Row className="main-product-section">
          <Col lg={6} className="product-image-col">
            <ProductImageGallery
              images={product.images}
              productName={product.name}
              healthStarRating={product.healthStarRating}
              onImageClick={handleImageClick}
              className="product-image-gallery"
            />
          </Col>
          
          <Col lg={6} className="product-info-col">
            <ProductInfo
              product={product}
              onAddToCart={handleAddToCart}
              onToggleFavorite={handleToggleFavorite}
              onRatingClick={handleRatingClick}
              className="product-info"
            />
          </Col>
        </Row>

        {/* Similar Products Section */}
        <SimilarProducts
          products={similarProducts}
          title="Similar Items"
          onAddToCart={handleAddToCart}
          onToggleFavorite={handleToggleFavorite}
          onProductClick={handleProductClick}
          className="similar-products-section"
        />

        {/* Customer Reviews Section */}
        <div ref={reviewsRef}>
          <CustomerReviews
            reviewsData={reviews}
            onWriteReview={handleWriteReview}
            onShowAllReviews={handleShowAllReviews}
            className="customer-reviews-section"
          />
        </div>
      </Container>
    </div>
  );
};

export default ProductDetail;
