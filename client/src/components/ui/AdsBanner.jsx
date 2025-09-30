import React from 'react';
import { Container, Row, Col, Carousel } from 'react-bootstrap';
import { CustomButton } from '../common';
import '../../styles/components/ui-components/ads-banner.css';

const AdsBanner = ({ 
  ads = [],
  autoPlay = true,
  interval = 3000,
  cardsPerSlide = 3,
  className = '',
  ...props 
}) => {
  if (!ads || ads.length === 0) {
    return null;
  }

  const bannerClasses = [
    'ads-banner',
    className
  ].filter(Boolean).join(' ');

  // Group ads into slides
  const groupedAds = [];
  for (let i = 0; i < ads.length; i += cardsPerSlide) {
    groupedAds.push(ads.slice(i, i + cardsPerSlide));
  }

  const renderAdCard = (ad) => (
    <Col key={ad.id} className="ads-banner__col">
      <div 
        className="ads-banner__card"
        style={{ background: ad.backgroundColor }}
      >
        <div className="ads-banner__content">
          <div className="ads-banner__icon">
            {ad.image}
          </div>
          <div className="ads-banner__text">
            <h4 className="ads-banner__title">{ad.title}</h4>
            <p className="ads-banner__description">{ad.description}</p>
          </div>
          <div className="ads-banner__action">
            <CustomButton
              variant={ad.buttonVariant || 'primary'}
              size="sm"
              className="ads-banner__button"
              onClick={() => {
                console.log('Ad clicked:', ad.title);
              }}
            >
              {ad.buttonText}
            </CustomButton>
          </div>
        </div>
      </div>
    </Col>
  );

  const renderSlide = (slideAds, index) => (
    <Carousel.Item key={index}>
      <Container>
        <Row className="ads-banner__slide">
          {slideAds.map(renderAdCard)}
          {/* Fill remaining columns if needed */}
          {Array.from({ length: cardsPerSlide - slideAds.length }).map((_, i) => (
            <Col key={`empty-${i}`} className="ads-banner__col">
              <div className="ads-banner__empty"></div>
            </Col>
          ))}
        </Row>
      </Container>
    </Carousel.Item>
  );

  return (
    <section className={bannerClasses} {...props}>
      <Container>
        <Carousel
          className="ads-banner__carousel"
          controls={true}
          indicators={false}
          interval={autoPlay ? interval : null}
          wrap={true}
        >
          {groupedAds.map(renderSlide)}
        </Carousel>
      </Container>
    </section>
  );
};

export default AdsBanner;
