import React from 'react';
import { Spinner } from 'react-bootstrap';
import '../../styles/components/ui-elements/loader.css';

const Loader = ({ 
  size = 'md',
  variant = 'primary',
  text = '',
  overlay = false,
  className = '',
  ...props 
}) => {
  const loaderClasses = [
    'custom-loader',
    `custom-loader--${size}`,
    overlay ? 'custom-loader--overlay' : '',
    className
  ].filter(Boolean).join(' ');

  const spinnerSize = size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : undefined;

  const renderLoader = () => (
    <div className={loaderClasses} {...props}>
      <Spinner 
        animation="border" 
        variant={variant}
        size={spinnerSize}
        className="custom-loader__spinner"
      />
      {text && (
        <div className="custom-loader__text">
          {text}
        </div>
      )}
    </div>
  );

  if (overlay) {
    return (
      <div className="custom-loader-overlay">
        {renderLoader()}
      </div>
    );
  }

  return renderLoader();
};

export default Loader;
