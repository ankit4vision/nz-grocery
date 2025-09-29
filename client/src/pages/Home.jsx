import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { CustomButton, InfoCard, StatCard, HeroSlider, AdsBanner } from '../components';
import { heroSlidesData, featuresData, statsData, adsBannerData } from '../data/mockData';
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

      {/* Main Content */}
      <Container className="home-content">

        {/* Features Section */}
        <Row className="home-features">
          {featuresData.map((feature) => (
            <Col md={4} key={feature.id} className="mb-4">
              <InfoCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                variant={feature.variant}
                onClick={() => {
                  if (feature.link) {
                    console.log('Navigate to:', feature.link);
                  }
                }}
              />
            </Col>
          ))}
        </Row>

        {/* Stats Section */}
        <Row className="home-stats">
          {statsData.map((stat) => (
            <Col md={3} key={stat.id} className="mb-3">
              <StatCard
                title={stat.title}
                value={stat.value}
                change={stat.change}
                changeType={stat.changeType}
                icon={stat.icon}
                variant={stat.variant}
              />
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default Home;
