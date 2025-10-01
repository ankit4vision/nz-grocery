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
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ProductFilters;
