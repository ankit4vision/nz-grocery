import React, { useState } from 'react';
import { Container, Row, Col, Button, Dropdown, Form } from 'react-bootstrap';
import { CustomButton, CustomSelect } from '../common';
import './ProductFilters.css';

/**
 * ProductFilters - Filtering and sorting bar for products
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
              <div className="product-filters-item">
                <CustomSelect
                  options={filterOptions.sortBy || []}
                  value={currentFilters.sortBy || 'relevance'}
                  onChange={handleSortChange}
                  placeholder="Sort by Relevance"
                  className="product-filters-select"
                />
              </div>

              {/* Filter Buttons */}
              <div className="product-filters-item">
                <Button
                  variant={currentFilters.bestUnitPrice ? "primary" : "outline-secondary"}
                  size="sm"
                  onClick={() => handleFilterChange('bestUnitPrice', !currentFilters.bestUnitPrice)}
                  className="product-filters-button"
                >
                  Best Unit Price
                </Button>
              </div>

              <div className="product-filters-item">
                <Button
                  variant={currentFilters.inStock ? "primary" : "outline-secondary"}
                  size="sm"
                  onClick={() => handleFilterChange('inStock', !currentFilters.inStock)}
                  className="product-filters-button"
                >
                  In stock
                </Button>
              </div>

              <div className="product-filters-item">
                <Button
                  variant={currentFilters.specials ? "primary" : "outline-secondary"}
                  size="sm"
                  onClick={() => handleFilterChange('specials', !currentFilters.specials)}
                  className="product-filters-button"
                >
                  Specials
                </Button>
              </div>

              {/* Dropdown Filters */}
              <div className="product-filters-item">
                <CustomSelect
                  options={filterOptions.soldBy || []}
                  value={currentFilters.soldBy || 'all'}
                  onChange={(value) => handleFilterChange('soldBy', value)}
                  placeholder="Sold By"
                  className="product-filters-select"
                />
              </div>

              <div className="product-filters-item">
                <CustomSelect
                  options={filterOptions.brand || []}
                  value={currentFilters.brand || 'all'}
                  onChange={(value) => handleFilterChange('brand', value)}
                  placeholder="Brand"
                  className="product-filters-select"
                />
              </div>

              <div className="product-filters-item">
                <CustomSelect
                  options={filterOptions.allergens || []}
                  value={currentFilters.allergens || 'none'}
                  onChange={(value) => handleFilterChange('allergens', value)}
                  placeholder="Allergens"
                  className="product-filters-select"
                />
              </div>

              <div className="product-filters-item">
                <CustomSelect
                  options={filterOptions.dietary || []}
                  value={currentFilters.dietary || 'all'}
                  onChange={(value) => handleFilterChange('dietary', value)}
                  placeholder="Dietary and Lifestyle"
                  className="product-filters-select"
                />
              </div>

              <div className="product-filters-item">
                <CustomSelect
                  options={filterOptions.healthRating || []}
                  value={currentFilters.healthRating || 'all'}
                  onChange={(value) => handleFilterChange('healthRating', value)}
                  placeholder="Health Star Rating"
                  className="product-filters-select"
                />
              </div>

              {/* All Filters Button */}
              <div className="product-filters-item">
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => setShowAllFilters(!showAllFilters)}
                  className="product-filters-button product-filters-all"
                >
                  <i className="fas fa-filter me-1"></i>
                  All filters
                  {activeFiltersCount > 0 && (
                    <span className="product-filters-count">{activeFiltersCount}</span>
                  )}
                </Button>
              </div>

              {/* Clear Filters Button */}
              {activeFiltersCount > 0 && (
                <div className="product-filters-item">
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={clearAllFilters}
                    className="product-filters-button"
                  >
                    Clear All
                  </Button>
                </div>
              )}
            </div>

            {/* Expanded Filters Panel */}
            {showAllFilters && (
              <div className="product-filters-expanded">
                <Row>
                  <Col md={3}>
                    <h6>Dietary Preferences</h6>
                    {filterOptions.dietary?.map(option => (
                      <Form.Check
                        key={option.value}
                        type="checkbox"
                        id={`dietary-${option.value}`}
                        label={option.label}
                        checked={(currentFilters.dietary || []).includes(option.value)}
                        onChange={() => handleFilterToggle('dietary', option.value)}
                        className="product-filters-checkbox"
                      />
                    ))}
                  </Col>
                  <Col md={3}>
                    <h6>Allergens</h6>
                    {filterOptions.allergens?.map(option => (
                      <Form.Check
                        key={option.value}
                        type="checkbox"
                        id={`allergens-${option.value}`}
                        label={option.label}
                        checked={(currentFilters.allergens || []).includes(option.value)}
                        onChange={() => handleFilterToggle('allergens', option.value)}
                        className="product-filters-checkbox"
                      />
                    ))}
                  </Col>
                  <Col md={3}>
                    <h6>Health Rating</h6>
                    {filterOptions.healthRating?.map(option => (
                      <Form.Check
                        key={option.value}
                        type="checkbox"
                        id={`health-${option.value}`}
                        label={option.label}
                        checked={(currentFilters.healthRating || []).includes(option.value)}
                        onChange={() => handleFilterToggle('healthRating', option.value)}
                        className="product-filters-checkbox"
                      />
                    ))}
                  </Col>
                  <Col md={3}>
                    <h6>Brand</h6>
                    {filterOptions.brand?.map(option => (
                      <Form.Check
                        key={option.value}
                        type="checkbox"
                        id={`brand-${option.value}`}
                        label={option.label}
                        checked={(currentFilters.brand || []).includes(option.value)}
                        onChange={() => handleFilterToggle('brand', option.value)}
                        className="product-filters-checkbox"
                      />
                    ))}
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
