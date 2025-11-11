import React, { useState, useEffect } from 'react';
import { Container, Spinner, Alert } from 'react-bootstrap';
import { HeroSlider, AdsBanner, ValueSection, PriceSection, FeaturedProducts } from '../components';
import { useCartContext } from '../context';
import { heroSlidesData, adsBannerData, valueCategoriesData, priceSectionData } from '../data/mockData';
import ProductsService from '../services/api/products';
import './Home.css';

const Home = () => {
  const { addItem } = useCartContext();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load featured products on mount
  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  const loadFeaturedProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await ProductsService.getFeaturedProducts({ page: 1, page_size: 12 });
      if (response.success && response.data) {
        // Transform API response to match component expectations
        const transformedProducts = transformProductVariants(response.data.items || []);
        setFeaturedProducts(transformedProducts);
      } else {
        setError(response.message || 'Failed to load featured products');
      }
    } catch (err) {
      setError('Failed to load featured products');
      console.error('Error loading featured products:', err);
    } finally {
      setLoading(false);
    }
  };

  // Transform product variants from API to component format
  const transformProductVariants = (variants) => {
    return variants.map((variant) => ({
      id: variant.variant_id || variant.id,
      productId: variant.product_id,
      name: variant.product_name || variant.name,
      variantName: variant.variant_name,
      unit: variant.unit || 'each',
      currentPrice: variant.price || variant.current_price || 0,
      originalPrice: variant.original_price || variant.currentPrice || null,
      image: variant.image_url || variant.image || '/placeholder-image.jpg',
      rating: variant.rating || 0,
      reviews: variant.reviews_count || 0,
      discount: variant.discount_percentage || 0,
      category: variant.category_id,
      categoryName: variant.category_name,
      stockQuantity: variant.stock_quantity || 0,
      sku: variant.sku,
      isActive: variant.is_active !== false,
    }));
  };

  const handleAddToCart = (product) => {
    addItem(product, 1);
    console.log(`Added ${product.name} to cart`);
  };

  const handleToggleFavorite = (productId, isFavorite) => {
    console.log('Toggle favorite:', productId, 'Is favorite:', isFavorite);
    // TODO: Implement favorites functionality
  };

  return (
    <div className="home-page">
      {/* Hero Slider Section */}
      <section className="home-hero-section">
        <Container>
          <HeroSlider 
            slides={heroSlidesData}
            showBadge={true}
            showControls={true}
            showIndicators={true}
            autoPlay={true}
            interval={2000}
            className="home-hero-slider"
          />
        </Container>
      </section>

      {/* Ads Banner Section */}
      <section className="home-ads-section">
        <AdsBanner 
          ads={adsBannerData}
          autoPlay={true}
          interval={3000}
          cardsPerSlide={3}
          className="home-ads-banner"
        />
      </section>

      {/* Value Section */}
      <ValueSection 
        title="Helping you find great value"
        categories={valueCategoriesData}
        className="home-value-section"
        onViewAllClick={() => console.log('View all categories clicked')}
      />

          {/* Price Section */}
          <PriceSection
            title="Half Price Special"
            products={priceSectionData}
            className="home-price-section"
            onViewAllClick={() => console.log('View all half price specials clicked')}
          />

      {/* Section Divider */}
      <div className="section-divider"></div>

      {/* Featured Products Section */}
      {loading ? (
        <Container className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading featured products...</span>
          </Spinner>
        </Container>
      ) : error ? (
        <Container className="py-5">
          <Alert variant="warning">
            <Alert.Heading>Unable to Load Featured Products</Alert.Heading>
            <p>{error}</p>
            <button onClick={loadFeaturedProducts} className="btn btn-primary">
              Try Again
            </button>
          </Alert>
        </Container>
      ) : (
        <FeaturedProducts
          title="Featured Products - Best Deals & Fresh Picks"
          products={featuredProducts}
          productsPerRow={4}
          className="home-featured-products"
          onAddToCart={handleAddToCart}
          onToggleFavorite={handleToggleFavorite}
        />
      )}

    </div>
  );
};

export default Home;
