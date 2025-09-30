import React, { useState } from 'react';
import { Container, Row, Col, Button, Dropdown, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faSort, faTimes } from '@fortawesome/free-solid-svg-icons';
import { CustomButton, CustomSelect } from '../common';
import '../../styles/components/ui-components/product-filters.css';

/**
 * ProductFilters - Compact filtering and sorting bar for products
 * 
 * @param {Object} filterOptions - Available filter options
 * @param {Object} currentFilters - Currently applied filters
 * @param {function} onFilterChange - Callback when filters change
 * @param {function} onSortChange - Callback when sort changes
 * @param {string} className - Additional CSS classes
 * 
 * @example
 * <ProductFilters 
 *   filterOptions={filterOptionsData}
 *   currentFilters={filters}
 *   onFilterChange={(filters) => setFilters(filters)}
 *   onSortChange={(sort) => setSort(sort)}
 * />
 */
const ProductFilters = ({ 
  filterOptions = {}, 
  currentFilters = {},
  onFilterChange = () => {},
  onSortChange = () => {},
  className = '' 
}) => {
  const [showAllFilters, setShowAllFilters] = useState(false);

  const handleSortChange = (sortValue) => {
    onSortChange(sortValue);
  };

  const handleFilterChange = (filterType, value) => {
    const newFilters = {
      ...currentFilters,
      [filterType]: value
    };
    onFilterChange(newFilters);
  };

  const handleFilterToggle = (filterType, value) => {
    const currentValues = currentFilters[filterType] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    
    handleFilterChange(filterType, newValues);
  };

  const clearAllFilters = () => {
    onFilterChange({});
  };

  const getActiveFiltersCount = () => {
    return Object.values(currentFilters).reduce((count, value) => {
      if (Array.isArray(value)) {
        return count + value.length;
      }
      return count + (value ? 1 : 0);
    }, 0);
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <div className={`product-filters ${className}`}>
      <Container>
        <Row>
          <Col>
            <div className="product-filters-bar">
              {/* Sort Dropdown */}
              <CustomSelect
                options={filterOptions.sortBy || []}
                value={currentFilters.sortBy || 'relevance'}
                onChange={handleSortChange}
                placeholder="Sort"
                className="product-filters-select"
              />

              {/* Quick Filter Buttons */}
              <Button
                variant={currentFilters.bestUnitPrice ? "primary" : "outline-secondary"}
                size="sm"
                onClick={() => handleFilterChange('bestUnitPrice', !currentFilters.bestUnitPrice)}
                className="product-filters-button"
              >
                Best Price
              </Button>

              <Button
                variant={currentFilters.inStock ? "primary" : "outline-secondary"}
                size="sm"
                onClick={() => handleFilterChange('inStock', !currentFilters.inStock)}
                className="product-filters-button"
              >
                In Stock
              </Button>

              <Button
                variant={currentFilters.specials ? "primary" : "outline-secondary"}
                size="sm"
                onClick={() => handleFilterChange('specials', !currentFilters.specials)}
                className="product-filters-button"
              >
                Specials
              </Button>

              {/* All Filters Button */}
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => setShowAllFilters(!showAllFilters)}
                className="product-filters-button product-filters-all"
              >
                <FontAwesomeIcon icon={faFilter} className="me-1" />
                More
                {activeFiltersCount > 0 && (
                  <span className="product-filters-count">{activeFiltersCount}</span>
                )}
              </Button>

              {/* Clear Filters Button */}
              {activeFiltersCount > 0 && (
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={clearAllFilters}
                  className="product-filters-button"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </Button>
              )}
            </div>

            {/* Expanded Filters Panel */}
            {showAllFilters && (
              <div className="product-filters-expanded">
                <Row>
                  <Col md={4}>
                    <h6>Sold By</h6>
                    <CustomSelect
                      options={filterOptions.soldBy || []}
                      value={currentFilters.soldBy || 'all'}
                      onChange={(value) => handleFilterChange('soldBy', value)}
                      placeholder="All Sellers"
                      className="product-filters-select"
                    />
                  </Col>
                  <Col md={4}>
                    <h6>Allergens</h6>
                    <CustomSelect
                      options={filterOptions.allergens || []}
                      value={currentFilters.allergens || 'none'}
                      onChange={(value) => handleFilterChange('allergens', value)}
                      placeholder="No Allergens"
                      className="product-filters-select"
                    />
                  </Col>
                  <Col md={4}>
                    <h6>Health Rating</h6>
                    <CustomSelect
                      options={filterOptions.healthRating || []}
                      value={currentFilters.healthRating || 'all'}
                      onChange={(value) => handleFilterChange('healthRating', value)}
                      placeholder="All Ratings"
                      className="product-filters-select"
                    />
                  </Col>
                </Row>
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ProductFilters;
