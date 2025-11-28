import React, { useState, useEffect } from 'react';
import { Container, Spinner, Alert } from 'react-bootstrap';
import { HeroSlider, AdsBanner, PriceSection, FeaturedProducts } from '../components';
import { useCartContext } from '../context';
import { heroSlidesData, adsBannerData, priceSectionData } from '../data/mockData';
import ProductsService from '../services/api/products';
import BannersService from '../services/api/banners';
import './Home.css';

const Home = () => {
  const { addItem } = useCartContext();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [heroSlides, setHeroSlides] = useState(heroSlidesData);
  const [heroLoading, setHeroLoading] = useState(true);
  const [heroError, setHeroError] = useState(null);

  // Load featured products and hero banners on mount
  useEffect(() => {
    loadFeaturedProducts();
    loadHeroBanners();
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

  const loadHeroBanners = async () => {
    setHeroLoading(true);
    setHeroError(null);
    try {
      const response = await BannersService.getBanners({
        is_active: true,
      });

      if (response.success && Array.isArray(response.data)) {
        // Filter banners where banner_type === "homepage"
        const homepageBanners = response.data.filter(
          (banner) => banner.banner_type === 'homepage'
        );

        if (homepageBanners.length > 0) {
          const transformedSlides = transformHeroBanners(homepageBanners);
          setHeroSlides(transformedSlides.length ? transformedSlides : heroSlidesData);
        } else {
          // No homepage banners found, use fallback
          setHeroSlides(heroSlidesData);
        }
      } else {
        setHeroError(response.message || 'Failed to load hero banners');
        setHeroSlides(heroSlidesData);
      }
    } catch (err) {
      console.error('Error loading hero banners:', err);
      setHeroError('Failed to load hero banners');
      setHeroSlides(heroSlidesData);
    } finally {
      setHeroLoading(false);
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
      const currentPrice = variant.discounted_sale_price || variant.sale_price || 0;
      const originalPrice = variant.discounted_sale_price && variant.sale_price 
        ? variant.sale_price 
        : null;
      
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

  const transformHeroBanners = (banners = []) => {
    return banners
      .filter((banner) => banner?.image_url)
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
      .map((banner) => ({
        id: banner.banner_id,
        image: banner.image_url,
        title: banner.banner_title,
        description: banner.banner_description,
        linkUrl: banner.link_url,
        position: banner.position || 'left', // Default to 'left' if not provided
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
          {heroLoading ? (
            <div className="text-center py-5">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading hero banners...</span>
              </Spinner>
            </div>
          ) : (
            <>
              {heroError && (
                <Alert variant="warning" className="mb-4">
                  <Alert.Heading>Unable to Load Hero Banners</Alert.Heading>
                  <p>{heroError}</p>
                  <button onClick={loadHeroBanners} className="btn btn-outline-primary btn-sm">
                    Try Again
                  </button>
                </Alert>
              )}
              <HeroSlider 
                slides={heroSlides}
                showBadge={true}
                showControls={true}
                showIndicators={true}
                autoPlay={true}
                interval={2000}
                className="home-hero-slider"
              />
            </>
          )}
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

      {/* Price Section - Hidden for now */}
      {/* <PriceSection
            title="Half Price Special"
            products={priceSectionData}
            className="home-price-section"
            onViewAllClick={() => console.log('View all half price specials clicked')}
          /> */}

      {/* Section Divider */}
      {/* <div className="section-divider"></div> */}

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
