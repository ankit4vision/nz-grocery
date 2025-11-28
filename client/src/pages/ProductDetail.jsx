import React, { useRef, useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ProductImageGallery, ProductInfo, SimilarProducts, CustomerReviews } from '../components';
import { useCartContext, useUserContext, useAuthModal } from '../context';
import ProductsService from '../services/api/products';
import ReviewsService from '../services/api/reviews';
import WishlistService from '../services/api/wishlist';
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
  const { isAuthenticated } = useUserContext();
  const { openLoginModal } = useAuthModal();
  
  const [product, setProduct] = useState(null);
  const [productMeta, setProductMeta] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [variants, setVariants] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productRating, setProductRating] = useState(0);
  const [productReviewCount, setProductReviewCount] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [wishlistItemId, setWishlistItemId] = useState(null);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  // Get variant_id from query params
  const variantIdFromQuery = searchParams.get('variant_id');

  // Load product details on mount
  // Note: id from URL params is product_id
  useEffect(() => {
    if (id) {
      loadProductDetails();
    }
  }, [id, variantIdFromQuery]);

  // Check wishlist status when product/variant changes
  useEffect(() => {
    if (isAuthenticated && product && selectedVariant) {
      checkWishlistStatus();
    }
  }, [isAuthenticated, product?.productId, selectedVariant?.variantId]);

  const loadProductDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch product details, variants with images, and reviews
      const [productResponse, variantsResponse, reviewsResponse] = await Promise.all([
        ProductsService.getProductFullDetails(id),
        ProductsService.getProductVariantsWithImages(id),
        ReviewsService.getReviews({ product_id: id, is_approved: true })
      ]);

      // Handle variants response
      if (variantsResponse.success && variantsResponse.data && Array.isArray(variantsResponse.data)) {
        // Transform API response to match component expectations
        const transformedVariants = transformVariantsWithImages(variantsResponse.data);
        setVariants(transformedVariants);
        
        // Normalize product-level info from product service response
        let normalizedProduct = null;
        let normalizedImages = [];
        let normalizedAttributes = [];
        let normalizedBulkPricing = [];

        if (productResponse.success && productResponse.data) {
          const fullDetails = productResponse.data;
          normalizedProduct = fullDetails.product || fullDetails;
          normalizedImages = fullDetails.images || fullDetails.product_images || normalizedProduct?.images || [];
          normalizedAttributes = fullDetails.attributes || normalizedProduct?.attributes || [];
          normalizedBulkPricing = fullDetails.bulk_pricing || normalizedProduct?.bulk_pricing || [];
          setProductMeta({
            baseProduct: normalizedProduct,
            images: normalizedImages,
            attributes: normalizedAttributes,
            bulkPricing: normalizedBulkPricing,
          });
        } else {
          setProductMeta(null);
        }

        // Calculate rating and review count from reviews
        let calculatedRating = 0;
        let reviewCount = 0;
        
        if (reviewsResponse.success && reviewsResponse.data && Array.isArray(reviewsResponse.data)) {
          const approvedReviews = reviewsResponse.data;
          reviewCount = approvedReviews.length;
          
          if (reviewCount > 0) {
            const totalRating = approvedReviews.reduce((sum, review) => sum + (review.rating || 0), 0);
            calculatedRating = Math.round((totalRating / reviewCount) * 10) / 10; // Round to 1 decimal
          }
        }
        
        // Store rating and review count for use when variant changes
        setProductRating(calculatedRating);
        setProductReviewCount(reviewCount);
        
        // Select variant based on query param or use first variant
        const variantIdToSelect = variantIdFromQuery 
          ? parseInt(variantIdFromQuery) 
          : transformedVariants[0]?.variantId;
        
        const selected = transformedVariants.find(v => v.variantId === variantIdToSelect) || transformedVariants[0];
        setSelectedVariant(selected);
        
        // Transform selected variant to product format for display
        const transformedProduct = transformVariantToProduct(
          selected,
          transformedVariants,
          normalizedProduct,
          normalizedImages,
          normalizedAttributes,
          normalizedBulkPricing,
          calculatedRating,
          reviewCount
        );
        setProduct(transformedProduct);
        
        // Load similar products using product_id
        const categoryId = normalizedProduct?.category_id || selected?.categoryId;
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
      const images = variant.images?.map(img => img.image_url || img.url) || [];
      const defaultImage = images[0] || '/placeholder-image.jpg';
      const variantName = variant.variant_name || '';
      const variantValue = variant.variant_value || '';
      const variantLabel = variantName && variantValue
        ? `${variantName}: ${variantValue}`
        : variantValue || variantName || '';
      
      const currentPrice = variant.discounted_sale_price || variant.sale_price || variant.base_price || 0;
      const originalPrice = variant.sale_price && variant.discounted_sale_price ? variant.sale_price : null;
      
      return {
        variantId: variant.variant_id,
        productId: variant.product_id,
        variantName,
        variantValue,
        variantLabel,
        categoryId: variant.category_id,
        categoryName: variant.category_name,
        unit: variant.unit || 'each',
        basePrice: variant.base_price || 0,
        salePrice: variant.sale_price,
        discountedSalePrice: variant.discounted_sale_price,
        currentPrice,
        originalPrice,
        discountPercentage: variant.discount_percentage || 0,
        stockQuantity: variant.stock_quantity || 0,
        lowStockQuantity: variant.low_stock_quantity || 0,
        sku: variant.sku,
        weight: variant.weight,
        isActive: variant.is_active !== false,
        images,
        defaultImage,
      };
    });
  };

  // Transform selected variant to product format for display
  const transformVariantToProduct = (
    selectedVariant,
    allVariants,
    baseProduct = null,
    baseImages = [],
    attributes = [],
    bulkPricing = [],
    calculatedRating = 0,
    reviewCount = 0
  ) => {
    if (!selectedVariant) return null;
    
    const productName = baseProduct?.product_name || baseProduct?.name || selectedVariant.productName || 'Product';
    const variantLabel = selectedVariant.variantLabel || selectedVariant.variantName || selectedVariant.variantValue || '';
    const description = baseProduct?.full_description || baseProduct?.short_description || baseProduct?.description || '';
    const shortDescription = baseProduct?.short_description || baseProduct?.full_description || '';
    const categoryId = baseProduct?.category_id || selectedVariant.categoryId || null;
    const categoryName = baseProduct?.category_name || selectedVariant.categoryName || 'Uncategorized';
    const productImages = selectedVariant.images?.length
      ? selectedVariant.images
      : baseImages.map(img => img.image_url || img.url).filter(Boolean);
    const images = productImages.length ? productImages : ['/placeholder-image.jpg'];
    
    // Use variantName as main display name, fallback to variantLabel or productName
    const displayName = selectedVariant.variantName || variantLabel || productName;
    
    return {
      id: selectedVariant.productId,
      productId: selectedVariant.productId,
      variantId: selectedVariant.variantId,
      name: displayName, // Main title - variant name
      productName, // Product name for small text
      variantName: selectedVariant.variantName,
      variantValue: selectedVariant.variantValue,
      variantLabel,
      description,
      shortDescription,
      category: categoryName,
      categoryId,
      categoryName,
      images,
      currentPrice: selectedVariant.currentPrice,
      originalPrice: selectedVariant.originalPrice,
      unit: selectedVariant.unit || baseProduct?.unit || 'each',
      rating: calculatedRating || baseProduct?.rating || baseProduct?.average_rating || 0,
      reviews: reviewCount || baseProduct?.reviews_count || baseProduct?.review_count || 0,
      discount: selectedVariant.discountPercentage,
      stockQuantity: selectedVariant.stockQuantity,
      stockCount: selectedVariant.stockQuantity,
      inStock: selectedVariant.stockQuantity > 0,
      sku: selectedVariant.sku || baseProduct?.sku,
      variants: allVariants,
      attributes,
      bulkPricing,
      healthStarRating: baseProduct?.health_star_rating || 0,
    };
  };

  // Handle variant selection change
  const handleVariantChange = (variantId) => {
    const selected = variants.find(v => v.variantId === variantId);
    if (selected) {
      setSelectedVariant(selected);
      // Update URL with new variant_id
      navigate(`/product/${id}?variant_id=${variantId}`, { replace: true });
      
      const baseProduct = productMeta?.baseProduct || null;
      const baseImages = productMeta?.images || [];
      const attributes = productMeta?.attributes || [];
      const bulkPricing = productMeta?.bulkPricing || [];

      const transformedProduct = transformVariantToProduct(
        selected,
        variants,
        baseProduct,
        baseImages,
        attributes,
        bulkPricing,
        productRating,
        productReviewCount
      );
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
      
      // Determine current price: discounted_sale_price > sale_price
      const currentPrice = variant.discounted_sale_price || variant.sale_price || variant.price || variant.current_price || 0;
      const originalPrice = variant.discounted_sale_price && variant.sale_price 
        ? variant.sale_price 
        : (variant.original_price || null);
      
      return {
        id: variant.variant_id || variant.id, // Keep variant_id as id for backward compatibility
        variantId: variant.variant_id || variant.id, // Explicit variant ID
        productId: variant.product_id, // Product ID for fetching full details
        name: displayName, // Display name: "Product Name - Variant Name"
        productName: productName, // Original product name
        variantName: variantName, // Variant name
        unit: variant.unit || null, // Unit (null if not provided, don't default to 'each')
        currentPrice: currentPrice,
        originalPrice: originalPrice,
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
    if (!isAuthenticated) {
      openLoginModal();
      return;
    }

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
        variantLabel: product.variantLabel,
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
        shortDescription: product.shortDescription,
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

  const checkWishlistStatus = async () => {
    if (!isAuthenticated || !product || !selectedVariant) return;
    
    try {
      const response = await WishlistService.getDefaultWishlist();
      if (response.success && response.data) {
        const itemsResponse = await WishlistService.getWishlistItems(response.data.wishlist_id);
        if (itemsResponse.success && Array.isArray(itemsResponse.data)) {
          const item = itemsResponse.data.find(
            item => item.product_id === product.productId && 
            (item.variant_id === selectedVariant.variantId || !item.variant_id)
          );
          if (item) {
            setIsFavorite(true);
            setWishlistItemId(item.wishlist_item_id);
          } else {
            setIsFavorite(false);
            setWishlistItemId(null);
          }
        }
      }
    } catch (err) {
      // Silently fail - wishlist check is optional
      console.error('Error checking wishlist status:', err);
    }
  };

  const handleToggleFavorite = async (productId, currentFavoriteState) => {
    if (!isAuthenticated) {
      openLoginModal();
      return;
    }

    setWishlistLoading(true);
    try {
      if (isFavorite && wishlistItemId) {
        // Remove from wishlist
        const response = await WishlistService.removeItem(wishlistItemId);
        if (response.success) {
          setIsFavorite(false);
          setWishlistItemId(null);
          console.log('Successfully removed from wishlist');
        } else {
          console.error('Failed to remove from wishlist:', response.message);
        }
      } else {
        // Add to wishlist
        if (!product || !selectedVariant) {
          console.error('Product or variant information is missing');
          setWishlistLoading(false);
          return;
        }

        const response = await WishlistService.addItem({
          product_id: product.productId,
          variant_id: selectedVariant.variantId || undefined,
        });
        if (response.success && response.data) {
          setIsFavorite(true);
          const itemId = response.data.wishlist_item_id || response.data.id || response.data.item_id;
          if (itemId) {
            setWishlistItemId(itemId);
          } else {
            // Refresh wishlist status to get item ID
            setTimeout(() => checkWishlistStatus(), 500);
          }
          console.log('Successfully added to wishlist');
        } else {
          console.error('Failed to add to wishlist:', response.message || response);
        }
      }
    } catch (err) {
      console.error('Error updating wishlist:', err);
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleProductClick = (productId) => {
    // Navigate using product_id (not variant_id)
    // productId here should be the product_id from the product object
    navigate(`/product/${productId}`);
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
              isFavorite={isFavorite}
              wishlistLoading={wishlistLoading}
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
            productId={id}
            variantId={selectedVariant?.variantId || variantIdFromQuery}
            onReviewSubmitted={async () => {
              // Reload product details to update rating/review count after review submission
              await loadProductDetails();
            }}
            className="customer-reviews-section"
          />
        </div>
      </Container>
    </div>
  );
};

export default ProductDetail;
