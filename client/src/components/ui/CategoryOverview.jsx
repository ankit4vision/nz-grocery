import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './CategoryOverview.css';

/**
 * CategoryOverview - Category selection section with circular icons
 * 
 * @param {Array} categories - Array of category objects with id, name, image, count
 * @param {string} selectedCategory - Currently selected category ID
 * @param {function} onCategorySelect - Callback function when category is selected
 * @param {string} className - Additional CSS classes
 * 
 * @example
 * <CategoryOverview 
 *   categories={categoryData}
 *   selectedCategory="fruit"
 *   onCategorySelect={(categoryId) => console.log(categoryId)}
 * />
 */
const CategoryOverview = ({ 
  categories = [], 
  selectedCategory = '', 
  onCategorySelect = () => {},
  className = '' 
}) => {
  const handleCategoryClick = (categoryId) => {
    onCategorySelect(categoryId);
  };

  return (
    <div className={`category-overview ${className}`}>
      <Container>
        <Row>
          <Col>
            <h2 className="category-overview-title">Vegetable & Fruit</h2>
            <div className="category-overview-scroll">
              <div className="category-overview-list">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className={`category-item ${selectedCategory === category.id ? 'active' : ''}`}
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
                    <div className="category-item-icon">
                      <span className="category-item-emoji">{category.image}</span>
                    </div>
                    <div className="category-item-content">
                      <h6 className="category-item-name">{category.name}</h6>
                      <span className="category-item-count">{category.count} items</span>
                    </div>
                  </div>
                ))}
                
                {/* Arrow indicator for more categories */}
                <div className="category-item category-item-arrow">
                  <div className="category-item-icon">
                    <span className="category-item-arrow-icon">→</span>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CategoryOverview;
