import React, { useState } from 'react';
import { Container, Button, Dropdown, Badge, Modal, Form } from 'react-bootstrap';
import { FaStar, FaTimes } from 'react-icons/fa';
import '../../styles/components/ui-components/customer-reviews.css';

/**
 * CustomerReviews - Component for displaying customer reviews
 * 
 * @param {Object} reviewsData - Reviews data object containing overall rating and reviews array
 * @param {function} onWriteReview - Callback when write review is clicked
 * @param {function} onShowAllReviews - Callback when show all reviews is clicked
 * @param {string} className - Additional CSS classes
 * 
 * @example
 * <CustomerReviews 
 *   reviewsData={customerReviewsData}
 *   onWriteReview={() => console.log('Write review clicked')}
 *   onShowAllReviews={() => console.log('Show all reviews clicked')}
 * />
 */
const CustomerReviews = ({ 
  reviewsData, 
  onWriteReview,
  onShowAllReviews,
  className = '' 
}) => {
  const [sortBy, setSortBy] = useState('newest');
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 0,
    title: '',
    comment: ''
  });

  const handleSortChange = (sortType) => {
    setSortBy(sortType);
  };

  const handleShowAllReviews = () => {
    setShowAllReviews(!showAllReviews);
    if (onShowAllReviews) {
      onShowAllReviews(!showAllReviews);
    }
  };

  const handleWriteReview = () => {
    setShowReviewModal(true);
    if (onWriteReview) {
      onWriteReview();
    }
  };

  const handleCloseModal = () => {
    setShowReviewModal(false);
    setReviewForm({
      rating: 0,
      title: '',
      comment: ''
    });
  };

  const handleStarClick = (rating) => {
    setReviewForm(prev => ({ ...prev, rating }));
  };

  const handleInputChange = (field, value) => {
    setReviewForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    console.log('Review submitted:', reviewForm);
    // In a real app, this would submit the review to the backend
    alert('Thank you for your review! It will be published after moderation.');
    handleCloseModal();
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <FaStar 
        key={index} 
        className={`star ${index < rating ? 'filled' : 'empty'}`}
      />
    ));
  };

  const sortReviews = (reviews, sortType) => {
    const sortedReviews = [...reviews];
    switch (sortType) {
      case 'newest':
        return sortedReviews.sort((a, b) => new Date(b.date) - new Date(a.date));
      case 'oldest':
        return sortedReviews.sort((a, b) => new Date(a.date) - new Date(b.date));
      case 'highest':
        return sortedReviews.sort((a, b) => b.rating - a.rating);
      case 'lowest':
        return sortedReviews.sort((a, b) => a.rating - b.rating);
      default:
        return sortedReviews;
    }
  };

  if (!reviewsData || !reviewsData.reviews) {
    return (
      <div className={`customer-reviews ${className}`}>
        <Container>
          <div className="no-reviews">
            <p>No reviews available yet.</p>
            <Button variant="warning" onClick={handleWriteReview}>
              Write a Review
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  const { overallRating, totalReviews, reviews } = reviewsData;
  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3);
  const sortedReviews = sortReviews(displayedReviews, sortBy);

  return (
    <div className={`customer-reviews ${className}`}>
      <Container>
        {/* Reviews Header */}
        <div className="reviews-header">
          <h2 className="reviews-title">Customer Reviews</h2>
          <div className="reviews-summary">
            <div className="overall-rating">
              <span className="rating-value">{overallRating}</span>
              <div className="stars">
                {renderStars(Math.floor(overallRating))}
              </div>
              <span className="total-reviews">({totalReviews} reviews)</span>
            </div>
          </div>
        </div>

        {/* Sort Controls */}
        <div className="reviews-controls">
          <Dropdown>
            <Dropdown.Toggle variant="outline-secondary" size="sm">
              Sort by: {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => handleSortChange('newest')}>
                Newest
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleSortChange('oldest')}>
                Oldest
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleSortChange('highest')}>
                Highest Rating
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleSortChange('lowest')}>
                Lowest Rating
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>

        {/* Reviews List */}
        <div className="reviews-list">
          {sortedReviews.map((review) => (
            <div key={review.id} className="review-item">
              <div className="review-header">
                <div className="reviewer-info">
                  <h4 className="reviewer-name">{review.userName}</h4>
                  <div className="review-rating">
                    <div className="stars">
                      {renderStars(review.rating)}
                    </div>
                    {review.isVerified && (
                      <Badge bg="success" className="verified-badge">
                        Verified Purchase
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="review-date">{review.date}</div>
              </div>

              <div className="review-content">
                <h5 className="review-title">{review.title}</h5>
                <p className="review-comment">{review.comment}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Reviews Actions */}
        <div className="reviews-actions">
          {reviews.length > 3 && (
            <Button 
              variant="link" 
              className="show-all-reviews-btn"
              onClick={handleShowAllReviews}
            >
              {showAllReviews ? 'Show Less Reviews' : `Show All ${totalReviews} Reviews`}
            </Button>
          )}
          
          <Button 
            variant="warning" 
            size="lg"
            className="write-review-btn"
            onClick={handleWriteReview}
          >
            Write a Review
          </Button>
        </div>
      </Container>

      {/* Write Review Modal */}
      <Modal 
        show={showReviewModal} 
        onHide={handleCloseModal}
        size="lg"
        centered
        className="write-review-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Write a Review</Modal.Title>
        </Modal.Header>
        
        <Modal.Body>
          <Form onSubmit={handleSubmitReview}>
            {/* Rating Section */}
            <div className="review-rating-section">
              <Form.Label className="form-label">Rate this product *</Form.Label>
              <div className="rating-stars-input">
                {Array.from({ length: 5 }, (_, index) => (
                  <FaStar
                    key={index}
                    className={`star-input ${index < reviewForm.rating ? 'filled' : 'empty'}`}
                    onClick={() => handleStarClick(index + 1)}
                  />
                ))}
                <span className="rating-text">
                  {reviewForm.rating > 0 ? `${reviewForm.rating} star${reviewForm.rating > 1 ? 's' : ''}` : 'Select rating'}
                </span>
              </div>
            </div>

            {/* Review Title */}
            <Form.Group className="mb-3">
              <Form.Label className="form-label">Review Title *</Form.Label>
              <Form.Control
                type="text"
                placeholder="Summarize your review in a few words"
                value={reviewForm.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
              />
            </Form.Group>

            {/* Review Comment */}
            <Form.Group className="mb-3">
              <Form.Label className="form-label">Your Review *</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Tell others about your experience with this product..."
                value={reviewForm.comment}
                onChange={(e) => handleInputChange('comment', e.target.value)}
                required
              />
            </Form.Group>


            {/* Submit Buttons */}
            <div className="review-form-actions">
              <Button 
                variant="secondary" 
                onClick={handleCloseModal}
                className="me-2"
              >
                Cancel
              </Button> 
              <Button 
                variant="warning" 
                type="submit"
                disabled={reviewForm.rating === 0 || !reviewForm.title || !reviewForm.comment}
              >
                Submit Review
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default CustomerReviews;
