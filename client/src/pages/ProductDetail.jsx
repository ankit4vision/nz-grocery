import React, { useRef, useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { ProductImageGallery, ProductInfo, SimilarProducts, CustomerReviews } from '../components';
import { useCartContext } from '../context';
import { customerReviewsData } from '../data/mockData';
import ProductsService from '../services/api/products';
import './ProductDetail.css';

/**
 * ProductDetail - Product detail page component
 * Displays comprehensive product information including images, details, similar products, and reviews
 */
const ProductDetail = () => {
  const { id } = useParams(); // This is now product_id (not variant_id)
  const navigate = useNavigate();
  const reviewsRef = useRef(null);
  const { addItem, toggleCart } = useCartContext();
  
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const reviews = customerReviewsData;

  // Load product details on mount
  // Note: id from URL params is now product_id (not variant_id)
  useEffect(() => {
    if (id) {
      loadProductDetails();
    }
  }, [id]);

  const loadProductDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      // Use product_id from URL to fetch full product details
      const response = await ProductsService.getProductFullDetails(id);
      if (response.success && response.data) {
        // Transform API response to match component expectations
        const transformedProduct = transformProductDetails(response.data);
        setProduct(transformedProduct);
        
        // Load similar products using product_id
        loadSimilarProducts(response.data.category_id, id);
      } else {
        setError(response.message || 'Product not found');
      }
    } catch (err) {
      setError('Failed to load product details');
      console.error('Error loading product details:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadSimilarProducts = async (categoryId, currentProductId) => {
    try {
      const response = await ProductsService.getRelatedProducts(currentProductId, 4);
      if (response.success && response.data) {
        const transformedProducts = transformProductVariants(response.data.items || []);
        setSimilarProducts(transformedProducts);
      }
    } catch (err) {
      console.error('Error loading similar products:', err);
    }
  };

  // Transform product details from API to component format
  const transformProductDetails = (apiProduct) => {
    // Get the first variant or default variant
    const defaultVariant = apiProduct.variants?.[0] || {};
    const defaultImage = apiProduct.images?.[0]?.image_url || '/placeholder-image.jpg';
    
    return {
      id: apiProduct.product_id || apiProduct.id,
      name: apiProduct.product_name || apiProduct.name,
      description: apiProduct.description || '',
      category: apiProduct.category_name || 'Uncategorized', // Use category_name, not category_id
      categoryId: apiProduct.category_id, // Keep category_id separately if needed for filtering
      categoryName: apiProduct.category_name || 'Uncategorized', // Explicit category name
      images: apiProduct.images?.map(img => img.image_url) || [defaultImage],
      currentPrice: defaultVariant.price || defaultVariant.current_price || 0,
      originalPrice: defaultVariant.original_price || null,
      unit: defaultVariant.unit || 'each',
      rating: apiProduct.rating || 0,
      reviews: apiProduct.reviews_count || 0,
      discount: defaultVariant.discount_percentage || 0,
      stockQuantity: defaultVariant.stock_quantity || 0,
      sku: defaultVariant.sku,
      variants: apiProduct.variants || [],
      attributes: apiProduct.attributes || [],
      bulkPricing: apiProduct.bulk_pricing || [],
      healthStarRating: apiProduct.health_star_rating || 0,
    };
  };

  // Transform product variants from API to component format
  const transformProductVariants = (variants) => {
    return variants.map((variant) => {
      const productName = variant.product_name || variant.name || 'Product';
      const variantName = variant.variant_name || '';
      
      // Create display name: "Product Name - Variant Name" or just "Product Name" if no variant
      const displayName = variantName 
        ? `${productName} - ${variantName}` 
        : productName;
      
      return {
        id: variant.variant_id || variant.id, // Keep variant_id as id for backward compatibility
        variantId: variant.variant_id || variant.id, // Explicit variant ID
        productId: variant.product_id, // Product ID for fetching full details
        name: displayName, // Display name: "Product Name - Variant Name"
        productName: productName, // Original product name
        variantName: variantName, // Variant name
        unit: variant.unit || 'each',
        currentPrice: variant.price || variant.current_price || 0,
        originalPrice: variant.original_price || variant.currentPrice || null,
        image: variant.image_url || variant.image || '/placeholder-image.jpg',
        rating: variant.rating || 0,
        reviews: variant.reviews_count || 0,
        discount: variant.discount_percentage || 0,
        category: variant.category_id,
        categoryName: variant.category_name || 'Uncategorized',
        stockQuantity: variant.stock_quantity || 0,
        sku: variant.sku,
        isActive: variant.is_active !== false,
      };
    });
  };

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
    // Navigate using product_id (not variant_id)
    // productId here should be the product_id from the product object
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

  // Show loading state
  if (loading) {
    return (
      <Container className="product-detail-page">
        <div className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading product details...</span>
          </Spinner>
        </div>
      </Container>
    );
  }

  // Show error state
  if (error || !product) {
    return (
      <Container className="product-detail-page">
        <div className="product-not-found">
          <Alert variant="danger">
            <Alert.Heading>Product Not Found</Alert.Heading>
            <p>{error || 'The product you\'re looking for doesn\'t exist.'}</p>
            <button onClick={() => navigate('/products')} className="btn btn-primary">
              Browse Products
            </button>
          </Alert>
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
