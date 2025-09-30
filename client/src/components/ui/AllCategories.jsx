import React, { useRef } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import './AllCategories.css';

/**
 * AllCategories - Display all available product categories in a compact horizontal slider
 * 
 * @param {Array} categories - Array of category objects with id, name, image, count
 * @param {string} selectedCategory - Currently selected category ID
 * @param {function} onCategorySelect - Callback function when category is selected
 * @param {string} className - Additional CSS classes
 * 
 * @example
 * <AllCategories 
 *   categories={categoryData}
 *   selectedCategory="fruit"
 *   onCategorySelect={(categoryId) => console.log(categoryId)}
 * />
 */
const AllCategories = ({ 
  categories = [], 
  selectedCategory = '', 
  onCategorySelect = () => {},
  className = '' 
}) => {
  const scrollContainerRef = useRef(null);

  const handleCategoryClick = (categoryId) => {
    onCategorySelect(categoryId);
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -200,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 200,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className={`all-categories ${className}`}>
      <Container>
        <Row>
          <Col>
            <div className="all-categories-slider">
              {/* Left Arrow */}
              <Button
                variant="outline-secondary"
                className="all-categories-arrow all-categories-arrow--left"
                onClick={scrollLeft}
                aria-label="Scroll left"
              >
                <FontAwesomeIcon icon={faChevronLeft} />
              </Button>

              {/* Categories Container */}
              <div 
                className="all-categories-container"
                ref={scrollContainerRef}
              >
                <div className="all-categories-list">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className={`category-card ${selectedCategory === category.id ? 'active' : ''}`}
                      onClick={() => handleCategoryClick(category.id)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleCategoryClick(category.id);
                        }
                      }}
                    >
                      <div className="category-card-icon">
                        <span className="category-card-emoji">{category.icon}</span>
                      </div>
                      <div className="category-card-content">
                        <h6 className="category-card-name">{category.name}</h6>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Arrow */}
              <Button
                variant="outline-secondary"
                className="all-categories-arrow all-categories-arrow--right"
                onClick={scrollRight}
                aria-label="Scroll right"
              >
                <FontAwesomeIcon icon={faChevronRight} />
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AllCategories;
