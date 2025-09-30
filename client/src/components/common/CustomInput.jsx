import React, { forwardRef } from 'react';
import { Form } from 'react-bootstrap';
import '../../styles/components/forms/custom-input.css';

const CustomInput = forwardRef(({ 
  label,
  error,
  helperText,
  required = false,
  disabled = false,
  className = '',
  variant = 'default',
  size = 'md',
  icon = null,
  iconPosition = 'left',
  fullWidth = false,
  ...props 
}, ref) => {
  const inputClasses = [
    'custom-input',
    `custom-input--${variant}`,
    `custom-input--${size}`,
    fullWidth ? 'custom-input--full-width' : '',
    error ? 'custom-input--error' : '',
    disabled ? 'custom-input--disabled' : '',
    className
  ].filter(Boolean).join(' ');

  const renderIcon = () => {
    if (!icon) return null;
    return <span className="custom-input__icon">{icon}</span>;
  };

  const renderInput = () => {
    if (icon) {
      return (
        <div className="custom-input__wrapper">
          {iconPosition === 'left' && renderIcon()}
          <Form.Control
            ref={ref}
            className={inputClasses}
            disabled={disabled}
            {...props}
          />
          {iconPosition === 'right' && renderIcon()}
        </div>
      );
    }

    return (
      <Form.Control
        ref={ref}
        className={inputClasses}
        disabled={disabled}
        {...props}
      />
    );
  };

  return (
    <Form.Group className="custom-input-group">
      {label && (
        <Form.Label className="custom-input__label">
          {label}
          {required && <span className="custom-input__required">*</span>}
        </Form.Label>
      )}
      
      {renderInput()}
      
      {helperText && !error && (
        <Form.Text className="custom-input__helper">
          {helperText}
        </Form.Text>
      )}
      
      {error && (
        <Form.Text className="custom-input__error">
          {error}
        </Form.Text>
      )}
    </Form.Group>
  );
});

CustomInput.displayName = 'CustomInput';

export default CustomInput;
