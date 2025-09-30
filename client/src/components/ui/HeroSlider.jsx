import React, { useRef, useState } from 'react';
import { Carousel, Container, Row, Col, Badge } from 'react-bootstrap';
import { CustomButton } from '../common';
import '../../styles/components/ui-elements/hero-slider.css';

const HeroSlider = ({ 
  slides = [],
  showBadge = true,
  showControls = true,
  showIndicators = true,
  autoPlay = true,
  interval = 5000,
  className = '',
  ...props 
}) => {
  const carouselRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);

  if (!slides || slides.length === 0) {
    return null;
  }

  const sliderClasses = [
    'hero-slider',
    className
  ].filter(Boolean).join(' ');

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setCurrentX(e.clientX);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setCurrentX(e.clientX);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    
    const diffX = startX - currentX;
    const threshold = 50; // Minimum drag distance to trigger slide change
    
    if (Math.abs(diffX) > threshold) {
      if (diffX > 0) {
        // Swipe left - next slide
        carouselRef.current?.next();
      } else {
        // Swipe right - previous slide
        carouselRef.current?.prev();
      }
    }
    
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const renderSlideContent = (slide) => (
    <div className="hero-slider__slide-content">
      {/* Image-only slide - no content */}
    </div>
  );

  const renderSlides = () => {
    return slides.map((slide, index) => (
      <Carousel.Item key={slide.id || index}>
        <div 
          className="hero-slider__slide"
          style={{ 
            backgroundImage: `url(${slide.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {renderSlideContent(slide)}
        </div>
        <Carousel.Caption className="d-none">
          {/* Hide default captions since we're using custom layout */}
        </Carousel.Caption>
      </Carousel.Item>
    ));
  };

  return (
    <Carousel
      ref={carouselRef}
      className={sliderClasses}
      controls={showControls}
      indicators={showIndicators}
      interval={autoPlay ? interval : null}
      touch={true}
      wrap={true}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      {...props}
    >
      {renderSlides()}
    </Carousel>
  );
};

export default HeroSlider;
