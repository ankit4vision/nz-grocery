import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './SelectedCategoryName.css';

/**
 * SelectedCategoryName - Display the currently selected category name
 * 
 * @param {string} categoryName - Name of the selected category
 * @param {number} productCount - Number of products in the selected category
 * @param {string} className - Additional CSS classes
 * 
 * @example
 * <SelectedCategoryName 
 *   categoryName="Fruit & Vegetables"
 *   productCount={45}
 * />
 */
const SelectedCategoryName = ({ 
  categoryName = '', 
  productCount = 0,
  className = '' 
}) => {
  if (!categoryName) {
    return null;
  }

  return (
    <div className={`selected-category-name ${className}`}>
      <Container>
        <Row>
          <Col>
            <div className="selected-category-content">
              <h1 className="selected-category-title">{categoryName}</h1>
              <p className="selected-category-subtitle">
                {productCount} {productCount === 1 ? 'product' : 'products'} available
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default SelectedCategoryName;
