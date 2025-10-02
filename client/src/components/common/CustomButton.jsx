import React from 'react';
import { Button } from 'react-bootstrap';
import '../../styles/components/buttons/custom-button.css';

const CustomButton = ({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  className = '', 
  disabled = false,
  loading = false,
  icon = null,
  iconPosition = 'left',
  fullWidth = false,
  onClick,
  type = 'button',
  ...props 
}) => {
  const buttonClasses = [
    'custom-button',
    `custom-button--${variant}`,
    `custom-button--${size}`,
    fullWidth ? 'custom-button--full-width' : '',
    loading ? 'custom-button--loading' : '',
    className
  ].filter(Boolean).join(' ');

  const renderIcon = () => {
    if (!icon) return null;
    return <span className="custom-button__icon">{icon}</span>;
  };

  const renderContent = () => {
    if (loading) {
      return (
        <>
          <span className="custom-button__spinner" />
          <span className="custom-button__text">Loading...</span>
        </>
      );
    }

    if (icon && iconPosition === 'left') {
      return (
        <>
          {renderIcon()}
          <span className="custom-button__text">{children}</span>
        </>
      );
    }

    if (icon && iconPosition === 'right') {
      return (
        <>
          <span className="custom-button__text">{children}</span>
          {renderIcon()}
        </>
      );
    }

    return <span className="custom-button__text">{children}</span>;
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={onClick}
      type={type}
      {...props}
    >
      {renderContent()}
    </Button>
  );
};

export default CustomButton;
