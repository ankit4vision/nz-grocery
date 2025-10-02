import React, { useState } from 'react';
import { Image, Modal } from 'react-bootstrap';
import { FaExpand, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { ImageWithFallback } from '../common';
import '../../styles/components/ui-components/product-image-gallery.css';

/**
 * ProductImageGallery - Component for displaying product images with gallery functionality
 * 
 * @param {Array} images - Array of image URLs
 * @param {string} productName - Name of the product for alt text
 * @param {number} healthStarRating - Health star rating to display
 * @param {function} onImageClick - Callback when image is clicked
 * @param {string} className - Additional CSS classes
 * 
 * @example
 * <ProductImageGallery 
 *   images={product.images}
 *   productName="Fresh Organic Banana"
 *   healthStarRating={5}
 *   onImageClick={(imageUrl) => console.log('Image clicked:', imageUrl)}
 * />
 */
const ProductImageGallery = ({ 
  images = [], 
  productName = '', 
  healthStarRating = 0,
  onImageClick,
  className = '' 
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const handlePrevious = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) => 
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const handleImageClick = () => {
    if (onImageClick) {
      onImageClick(images[currentImageIndex]);
    }
    setShowModal(true);
  };

  const handleThumbnailClick = (index) => {
    console.log('Thumbnail clicked:', index, 'Current index:', currentImageIndex);
    setCurrentImageIndex(index);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span 
        key={index} 
        className={`star ${index < rating ? 'filled' : 'empty'}`}
      >
        ⭐
      </span>
    ));
  };

  if (images.length === 0) {
    return (
      <div className={`product-image-gallery ${className}`}>
        <div className="main-image-container">
          <ImageWithFallback 
            src="/placeholder.svg" 
            alt={productName}
            className="main-image"
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`product-image-gallery ${className}`}>
      {/* Main Image Container */}
      <div className="main-image-container">
        <div className="image-wrapper" onClick={handleImageClick}>
          <ImageWithFallback 
            src={images[currentImageIndex]} 
            alt={productName}
            className="main-image"
            key={currentImageIndex}
          />
          
          {/* Image Counter */}
          {images.length > 1 && (
            <div className="image-counter">
              {currentImageIndex + 1} / {images.length}
            </div>
          )}

          {/* Health Star Rating Badge */}
          {healthStarRating > 0 && (
            <div className="health-rating-badge">
              <div className="rating-stars">
                {renderStars(healthStarRating)}
              </div>
              <span className="rating-number">{healthStarRating}</span>
              <span className="rating-text">Health Star Rating</span>
            </div>
          )}

          {/* Modal Icon */}
          <div className="modal-icon">
            <FaExpand />
            <span className="icon-tooltip">View Image</span>
          </div>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button 
                className="nav-arrow nav-arrow-left"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevious();
                }}
                aria-label="Previous image"
              >
                <FaChevronLeft />
              </button>
              <button 
                className="nav-arrow nav-arrow-right"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                aria-label="Next image"
              >
                <FaChevronRight />
              </button>
            </>
          )}

          {/* Image Loading Overlay */}
          <div className="image-loading-overlay">
            <div className="loading-spinner"></div>
          </div>
        </div>
      </div>

      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="thumbnail-gallery">
          <div className="thumbnail-scroll-container">
            {images.map((image, index) => (
              <div 
                key={index}
                className={`thumbnail-container ${index === currentImageIndex ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleThumbnailClick(index);
                }}
              >
                <ImageWithFallback 
                  src={image} 
                  alt={`${productName} ${index + 1}`}
                  className="thumbnail-image"
                />
                <div className="thumbnail-overlay">
                  <span className="thumbnail-number">{index + 1}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fullscreen Modal for Image View */}
      <Modal 
        show={showModal} 
        onHide={() => setShowModal(false)}
        fullscreen
        className="product-image-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {productName} - Image {currentImageIndex + 1} of {images.length}
          </Modal.Title>
        </Modal.Header>
        
        <Modal.Body className="modal-body-custom">
          <div className="modal-image-container">
            <ImageWithFallback 
              src={images[currentImageIndex]} 
              alt={productName}
              className="modal-image"
              key={currentImageIndex}
            />
            
            {images.length > 1 && (
              <>
                <button 
                  className="modal-nav modal-nav-left"
                  onClick={handlePrevious}
                  aria-label="Previous image"
                >
                  <FaChevronLeft />
                </button>
                <button 
                  className="modal-nav modal-nav-right"
                  onClick={handleNext}
                  aria-label="Next image"
                >
                  <FaChevronRight />
                </button>
              </>
            )}
          </div>
          
          {/* Thumbnails in Modal Body */}
          {images.length > 1 && (
            <div className="modal-thumbnails">
              {images.map((image, index) => (
                <div 
                  key={index}
                  className={`modal-thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleThumbnailClick(index);
                  }}
                >
                  <ImageWithFallback 
                    src={image} 
                    alt={`${productName} ${index + 1}`}
                    className="modal-thumbnail-image"
                  />
                </div>
              ))}
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ProductImageGallery;
