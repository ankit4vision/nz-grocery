import React from 'react';
import { Container } from 'react-bootstrap';
import { HeroSlider, AdsBanner, ValueSection, PriceSection, FeaturedProducts } from '../components';
import { heroSlidesData, adsBannerData, valueCategoriesData, priceSectionData, featuredProductsData } from '../data/mockData';
import './Home.css';

const Home = () => {
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
      <FeaturedProducts
        title="Featured Products - Best Deals & Fresh Picks"
        products={featuredProductsData}
        productsPerRow={4}
        className="home-featured-products"
        onAddToCart={(productId) => console.log('Add to cart:', productId)}
        onToggleFavorite={(productId, isFavorite) => console.log('Toggle favorite:', productId, isFavorite)}
      />

    </div>
  );
};

export default Home;
