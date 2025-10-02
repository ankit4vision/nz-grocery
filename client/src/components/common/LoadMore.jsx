import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import '../../styles/components/buttons/load-more.css';

/**
 * LoadMore - Reusable load more button component
 * 
 * @param {function} onLoadMore - Callback function when load more is clicked
 * @param {boolean} hasMore - Whether there are more items to load
 * @param {string} text - Button text (default: "Load More Products")
 * @param {string} className - Additional CSS classes
 * @param {string} size - Button size (sm, md, lg)
 * 
 * @example
 * <LoadMore 
 *   onLoadMore={() => setVisibleItems(prev => prev + 6)}
 *   hasMore={visibleItems < totalItems}
 *   text="Load More Products"
 *   size="lg"
 * />
 */
const LoadMore = ({ 
  onLoadMore = () => {},
  hasMore = false,
  text = "Load More Products",
  className = '',
  size = 'lg'
}) => {
  if (!hasMore) {
    return null;
  }

  return (
    <section className={`load-more-section ${className}`}>
      <Container>
        <Row>
          <Col className="text-center">
            <button
              onClick={onLoadMore}
              className={`load-more-btn load-more-btn--${size}`}
            >
              {text}
            </button>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default LoadMore;
