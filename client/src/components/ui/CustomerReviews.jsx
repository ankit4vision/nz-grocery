import React, { useState, useEffect } from 'react';
import { Container, Button, Dropdown, Badge, Modal, Form, Spinner, Alert } from 'react-bootstrap';
import { FaStar, FaTimes } from 'react-icons/fa';
import ReviewsService from '../../services/api/reviews';
import { useUserContext } from '../../context';
import '../../styles/components/ui-components/customer-reviews.css';

/**
 * CustomerReviews - Component for displaying customer reviews
 * 
 * @param {number} productId - Product ID (required)
 * @param {number} variantId - Product variant ID (optional)
 * @param {function} onReviewSubmitted - Callback when review is successfully submitted
 * @param {string} className - Additional CSS classes
 * 
 * @example
 * <CustomerReviews 
 *   productId={37}
 *   variantId={123}
 *   onReviewSubmitted={() => console.log('Review submitted')}
 * />
 */
const CustomerReviews = ({ 
  productId,
  variantId,
  onReviewSubmitted,
  className = '' 
}) => {
  const { user } = useUserContext();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [sortBy, setSortBy] = useState('Newest');
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 0,
    title: '',
    comment: ''
  });

  // Load reviews on mount and when filters change
  useEffect(() => {
    if (productId) {
      loadReviews();
    }
  }, [productId, variantId, sortBy]);

  const loadReviews = async () => {
    if (!productId) return;
    
    setLoading(true);
    setError(null);
    try {
      const params = {
        product_id: productId,
        is_approved: true, // Only show approved reviews
        sort_by: sortBy
      };
      
      if (variantId) {
        params.product_variant_id = variantId;
      }
      
      const response = await ReviewsService.getReviews(params);
      
      if (response.success && response.data) {
        const transformedReviews = transformReviews(response.data);
        setReviews(transformedReviews);
      } else {
        setError(response.message || 'Failed to load reviews');
        setReviews([]);
      }
    } catch (err) {
      setError('Failed to load reviews');
      setReviews([]);
      console.error('Error loading reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  // Transform API response to component format
  const transformReviews = (apiReviews) => {
    if (!Array.isArray(apiReviews)) return [];
    
    return apiReviews.map((review) => ({
      id: review.review_id,
      userName: review.user_full_name || 'Anonymous',
      rating: review.rating,
      title: review.review_title || '',
      comment: review.review_text || '',
      date: review.created_at ? formatDate(review.created_at) : '',
      isVerified: review.is_verified_purchase || false,
      helpfulCount: review.is_helpful_count || 0
    }));
  };

  // Format date from API response
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-NZ', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch (e) {
      return dateString;
    }
  };

  // Calculate overall rating and total reviews
  const calculateOverallRating = () => {
    if (reviews.length === 0) return { overallRating: 0, totalReviews: 0 };
    
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;
    
    return {
      overallRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
      totalReviews: reviews.length
    };
  };

  const handleSortChange = (sortType) => {
    setSortBy(sortType);
  };

  const handleShowAllReviews = () => {
    setShowAllReviews(!showAllReviews);
  };

  const handleWriteReview = () => {
    if (!user) {
      alert('Please login to write a review');
      return;
    }
    setShowReviewModal(true);
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

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!user) {
      alert('Please login to submit a review');
      return;
    }
    
    if (!productId) {
      alert('Product ID is required');
      return;
    }
    
    setSubmitting(true);
    try {
      const reviewData = {
        product_id: productId,
        user_id: user.user_id || user.id,
        rating: reviewForm.rating,
        review_title: reviewForm.title,
        review_text: reviewForm.comment,
        is_verified_purchase: false // Can be enhanced later to check if user purchased
      };
      
      if (variantId) {
        reviewData.product_variant_id = variantId;
      }
      
      const response = await ReviewsService.createReview(reviewData);
      
      if (response.success) {
        alert('Thank you for your review! It will be published after moderation.');
        handleCloseModal();
        // Reload reviews to show the new one (if approved)
        await loadReviews();
        if (onReviewSubmitted) {
          onReviewSubmitted(response.data);
        }
      } else {
        alert(response.message || 'Failed to submit review. Please try again.');
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      alert('Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <FaStar 
        key={index} 
        className={`star ${index < rating ? 'filled' : 'empty'}`}
      />
    ));
  };

  const { overallRating, totalReviews } = calculateOverallRating();
  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3);

  // Loading state
  if (loading) {
    return (
      <div className={`customer-reviews ${className}`}>
        <Container>
          <div className="text-center py-5">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading reviews...</span>
            </Spinner>
          </div>
        </Container>
      </div>
    );
  }

  // Error state
  if (error && reviews.length === 0) {
    return (
      <div className={`customer-reviews ${className}`}>
        <Container>
          <Alert variant="warning">
            <Alert.Heading>Unable to Load Reviews</Alert.Heading>
            <p>{error}</p>
            <Button onClick={loadReviews} variant="primary" size="sm">
              Try Again
            </Button>
          </Alert>
        </Container>
      </div>
    );
  }

  // No reviews state - but still render the modal
  if (reviews.length === 0) {
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

        {/* Write Review Modal - Always render so it can be shown */}
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
                      style={{ cursor: 'pointer' }}
                    />
                  ))}
                  <span className="rating-text">
                    {reviewForm.rating > 0 ? `${reviewForm.rating} star${reviewForm.rating > 1 ? 's' : ''}` : 'Select rating'}
                  </span>
                </div>
              </div>

              {/* Review Title */}
              <Form.Group className="mb-3" controlId="reviewTitle">
                <Form.Label>Review Title *</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Summarize your review in a few words"
                  value={reviewForm.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  required
                  maxLength={255}
                />
              </Form.Group>

              {/* Review Comment */}
              <Form.Group className="mb-3" controlId="reviewComment">
                <Form.Label>Your Review *</Form.Label>
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
                  disabled={submitting}
                >
                  Cancel
                </Button> 
                <Button 
                  variant="warning" 
                  type="submit"
                  disabled={reviewForm.rating === 0 || !reviewForm.title || !reviewForm.comment || submitting}
                >
                  {submitting ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Review'
                  )}
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    );
  }

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
              Sort by: {sortBy}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => handleSortChange('Newest')}>
                Newest
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleSortChange('Oldest')}>
                Oldest
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleSortChange('Highest rating')}>
                Highest Rating
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleSortChange('Lowest rating')}>
                Lowest Rating
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>

        {/* Reviews List */}
        <div className="reviews-list">
          {displayedReviews.map((review) => (
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
            <Form.Group className="mb-3" controlId="reviewTitle">
              <Form.Label>Review Title *</Form.Label>
              <Form.Control
                type="text"
                placeholder="Summarize your review in a few words"
                value={reviewForm.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
              />
            </Form.Group>

            {/* Review Comment */}
            <Form.Group className="mb-3" controlId="reviewComment">
              <Form.Label>Your Review *</Form.Label>
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
                disabled={reviewForm.rating === 0 || !reviewForm.title || !reviewForm.comment || submitting}
              >
                {submitting ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Submitting...
                  </>
                ) : (
                  'Submit Review'
                )}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default CustomerReviews;
