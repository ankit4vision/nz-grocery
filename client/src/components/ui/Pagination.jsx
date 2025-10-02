import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import '../../styles/components/ui-components/pagination.css';

/**
 * Pagination - Pagination component for product navigation
 * 
 * @param {number} currentPage - Current active page
 * @param {number} totalPages - Total number of pages
 * @param {function} onPageChange - Callback when page changes
 * @param {string} className - Additional CSS classes
 * 
 * @example
 * <Pagination 
 *   currentPage={1}
 *   totalPages={4}
 *   onPageChange={(page) => setCurrentPage(page)}
 * />
 */
const Pagination = ({ 
  currentPage = 1, 
  totalPages = 1, 
  onPageChange = () => {},
  className = '' 
}) => {
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 4;
    
    // Calculate start and end page numbers
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Add first page if not visible
    if (startPage > 1) {
      pages.push(
        <Button
          key={1}
          variant={currentPage === 1 ? "primary" : "outline-secondary"}
          size="sm"
          onClick={() => handlePageChange(1)}
          className="pagination-btn"
        >
          1
        </Button>
      );
      
      if (startPage > 2) {
        pages.push(
          <span key="ellipsis1" className="pagination-ellipsis">
            ...
          </span>
        );
      }
    }

    // Add visible page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          variant={currentPage === i ? "primary" : "outline-secondary"}
          size="sm"
          onClick={() => handlePageChange(i)}
          className="pagination-btn"
        >
          {i}
        </Button>
      );
    }

    // Add last page if not visible
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="ellipsis2" className="pagination-ellipsis">
            ...
          </span>
        );
      }
      
      pages.push(
        <Button
          key={totalPages}
          variant={currentPage === totalPages ? "primary" : "outline-secondary"}
          size="sm"
          onClick={() => handlePageChange(totalPages)}
          className="pagination-btn"
        >
          {totalPages}
        </Button>
      );
    }

    return pages;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className={`pagination-container ${className}`}>
      <Container>
        <Row>
          <Col className="text-center">
            <div className="pagination-content">
              <div className="pagination-info">
                <span className="pagination-text">
                  Page {currentPage} of {totalPages}
                </span>
              </div>
              
              <div className="pagination-controls">
                {/* Previous Button */}
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="pagination-btn pagination-nav"
                >
                  <i className="fas fa-chevron-left"></i>
                </Button>

                {/* Page Numbers */}
                <div className="pagination-numbers">
                  {renderPageNumbers()}
                </div>

                {/* Next Button */}
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="pagination-btn pagination-nav"
                >
                  <i className="fas fa-chevron-right"></i>
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Pagination;
