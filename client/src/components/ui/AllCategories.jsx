import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './AllCategories.css';

/**
 * AllCategories - Display all available product categories
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
  const handleCategoryClick = (categoryId) => {
    onCategorySelect(categoryId);
  };

  return (
    <div className={`all-categories ${className}`}>
      <Container>
        <Row>
          <Col>
            <h2 className="all-categories-title">Browse All Categories</h2>
            <div className="all-categories-grid">
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
                    <span className="category-card-emoji">{category.image}</span>
                  </div>
                  <div className="category-card-content">
                    <h6 className="category-card-name">{category.name}</h6>
                    <span className="category-card-count">{category.count} items</span>
                  </div>
                </div>
              ))}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AllCategories;
