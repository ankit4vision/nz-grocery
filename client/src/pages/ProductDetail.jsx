import React, { useRef, useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
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
  const { id } = useParams(); // This is product_id
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const reviewsRef = useRef(null);
  const { addItem, toggleCart } = useCartContext();
  
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [variants, setVariants] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const reviews = customerReviewsData;

  // Get variant_id from query params
  const variantIdFromQuery = searchParams.get('variant_id');

  // Load product details on mount
  // Note: id from URL params is product_id
  useEffect(() => {
    if (id) {
      loadProductDetails();
    }
  }, [id, variantIdFromQuery]);

  const loadProductDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch both product details and variants with images
      const [productResponse, variantsResponse] = await Promise.all([
        ProductsService.getProductFullDetails(id),
        ProductsService.getProductVariantsWithImages(id)
      ]);

      // Handle variants response
      if (variantsResponse.success && variantsResponse.data && Array.isArray(variantsResponse.data)) {
        // Transform API response to match component expectations
        const transformedVariants = transformVariantsWithImages(variantsResponse.data);
        setVariants(transformedVariants);
        
        // Select variant based on query param or use first variant
        const variantIdToSelect = variantIdFromQuery 
          ? parseInt(variantIdFromQuery) 
          : transformedVariants[0]?.variantId;
        
        const selected = transformedVariants.find(v => v.variantId === variantIdToSelect) || transformedVariants[0];
        setSelectedVariant(selected);
        
        // Get product-level info from product details response
        // ProductFullDetailsOut has structure: { product, images, variants, bulk_pricing, attributes }
        let productData = null;
        if (productResponse.success && productResponse.data) {
          if (productResponse.data.product) {
            // Structure: { product: {...}, images: [...], variants: [...] }
            productData = productResponse.data.product;
          } else if (productResponse.data.product_name || productResponse.data.name) {
            // Structure: direct product object
            productData = productResponse.data;
          }
        }
        
        // Transform selected variant to product format for display
        const transformedProduct = transformVariantToProduct(selected, transformedVariants, productData);
        setProduct(transformedProduct);
        
        // Load similar products using product_id
        const categoryId = productData?.category_id || selected?.categoryId;
        if (categoryId) {
          loadSimilarProducts(categoryId, id);
        }
      } else {
        setError(variantsResponse.message || 'Product not found');
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

  // Transform variants with images from API to component format
  const transformVariantsWithImages = (apiVariants) => {
    return apiVariants.map((variant) => {
      // Get images from variant.images array
      const images = variant.images?.map(img => img.image_url || img.url) || [];
      const defaultImage = images[0] || '/placeholder-image.jpg';
      
      // Determine current price (use discounted_sale_price if available, else sale_price, else base_price)
      const currentPrice = variant.discounted_sale_price || variant.sale_price || variant.base_price || 0;
      const originalPrice = variant.sale_price && variant.discounted_sale_price ? variant.sale_price : null;
      
      return {
        variantId: variant.variant_id,
        productId: variant.product_id,
        variantName: variant.variant_name || '',
        variantValue: variant.variant_value || '',
        basePrice: variant.base_price || 0,
        salePrice: variant.sale_price,
        discountedSalePrice: variant.discounted_sale_price,
        currentPrice: currentPrice,
        originalPrice: originalPrice,
        discountPercentage: variant.discount_percentage || 0,
        stockQuantity: variant.stock_quantity || 0,
        lowStockQuantity: variant.low_stock_quantity || 0,
        sku: variant.sku,
        weight: variant.weight,
        isActive: variant.is_active !== false,
        images: images,
        defaultImage: defaultImage,
      };
    });
  };

  // Transform selected variant to product format for display
  const transformVariantToProduct = (selectedVariant, allVariants, productData = null) => {
    if (!selectedVariant) return null;
    
    // Get product name from product data or construct from variant
    const productName = productData?.product_name || productData?.name || 'Product';
    const variantName = selectedVariant.variantName || '';
    
    // Create display name: "Product Name - Variant Name" or just "Product Name" if no variant
    const displayName = variantName 
      ? `${productName} - ${variantName}` 
      : productName;
    
    return {
      id: selectedVariant.productId,
      variantId: selectedVariant.variantId,
      name: displayName,
      productName: productName,
      variantName: variantName,
      description: productData?.description || '',
      category: productData?.category_name || 'Uncategorized',
      categoryId: productData?.category_id || null,
      categoryName: productData?.category_name || 'Uncategorized',
      images: selectedVariant.images || [selectedVariant.defaultImage],
      currentPrice: selectedVariant.currentPrice,
      originalPrice: selectedVariant.originalPrice,
      unit: productData?.unit || 'each',
      rating: productData?.rating || 0,
      reviews: productData?.reviews_count || 0,
      discount: selectedVariant.discountPercentage,
      stockQuantity: selectedVariant.stockQuantity,
      sku: selectedVariant.sku,
      variants: allVariants,
      attributes: productData?.attributes || [],
      bulkPricing: productData?.bulk_pricing || [],
      healthStarRating: productData?.health_star_rating || 0,
    };
  };

  // Handle variant selection change
  const handleVariantChange = (variantId) => {
    const selected = variants.find(v => v.variantId === variantId);
    if (selected) {
      setSelectedVariant(selected);
      // Update URL with new variant_id
      navigate(`/product/${id}?variant_id=${variantId}`, { replace: true });
      
      // Transform selected variant to product format for display
      const productData = product ? {
        product_name: product.productName,
        name: product.productName,
        description: product.description,
        category_name: product.categoryName,
        category_id: product.categoryId,
        unit: product.unit,
        rating: product.rating,
        reviews_count: product.reviews,
        attributes: product.attributes,
        bulk_pricing: product.bulkPricing,
        health_star_rating: product.healthStarRating,
      } : null;
      
      const transformedProduct = transformVariantToProduct(selected, variants, productData);
      setProduct(transformedProduct);
    }
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
    // Use the selected variant for cart operations
    if (product && selectedVariant) {
      // Create product object with variant information for cart
      const productToAdd = {
        id: selectedVariant.variantId, // Use variant ID for cart
        variantId: selectedVariant.variantId,
        productId: product.id,
        name: product.name,
        productName: product.productName,
        variantName: product.variantName,
        unit: product.unit,
        currentPrice: product.currentPrice,
        originalPrice: product.originalPrice,
        image: product.images?.[0] || '/placeholder-image.jpg',
        rating: product.rating,
        reviews: product.reviews,
        discount: product.discount,
        category: product.categoryId,
        stockQuantity: product.stockQuantity,
        sku: product.sku,
      };
      
      addItem(productToAdd, quantity);
      console.log(`Added ${quantity} x ${productToAdd.name} to cart`);
    } else {
      // Fallback to similar products
      const productToAdd = similarProducts.find(p => p.id === productId) || product;
      if (productToAdd) {
        addItem(productToAdd, quantity);
        console.log(`Added ${quantity} x ${productToAdd.name} to cart`);
      }
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
