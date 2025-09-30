import React from 'react';
import { Breadcrumb as BootstrapBreadcrumb } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../../styles/components/navigation/breadcrumb.css';

/**
 * Breadcrumb - Navigation breadcrumb component
 * 
 * @param {Array} items - Array of breadcrumb items with label and path
 * @param {string} className - Additional CSS classes
 * 
 * @example
 * <Breadcrumb 
 *   items={[
 *     { label: 'Home', path: '/' },
 *     { label: 'Products', path: '/products' },
 *     { label: 'Fruit', path: '/products/fruit' }
 *   ]}
 * />
 */
const Breadcrumb = ({ items = [], className = '' }) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className={`breadcrumb-container ${className}`}>
      <BootstrapBreadcrumb>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <BootstrapBreadcrumb.Item
              key={index}
              active={isLast}
              linkAs={isLast ? 'span' : Link}
              linkProps={isLast ? {} : { to: item.path }}
            >
              {item.label}
            </BootstrapBreadcrumb.Item>
          );
        })}
      </BootstrapBreadcrumb>
    </div>
  );
};

export default Breadcrumb;
