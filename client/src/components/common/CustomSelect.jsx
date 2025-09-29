import React, { forwardRef } from 'react';
import { Form } from 'react-bootstrap';
import './CustomSelect.css';

const CustomSelect = forwardRef(({ 
  label,
  error,
  helperText,
  required = false,
  disabled = false,
  className = '',
  variant = 'default',
  size = 'md',
  options = [],
  placeholder = 'Select an option',
  fullWidth = false,
  ...props 
}, ref) => {
  const selectClasses = [
    'custom-select',
    `custom-select--${variant}`,
    `custom-select--${size}`,
    fullWidth ? 'custom-select--full-width' : '',
    error ? 'custom-select--error' : '',
    disabled ? 'custom-select--disabled' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <Form.Group className="custom-select-group">
      {label && (
        <Form.Label className="custom-select__label">
          {label}
          {required && <span className="custom-select__required">*</span>}
        </Form.Label>
      )}
      
      <Form.Select
        ref={ref}
        className={selectClasses}
        disabled={disabled}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </Form.Select>
      
      {helperText && !error && (
        <Form.Text className="custom-select__helper">
          {helperText}
        </Form.Text>
      )}
      
      {error && (
        <Form.Text className="custom-select__error">
          {error}
        </Form.Text>
      )}
    </Form.Group>
  );
});

CustomSelect.displayName = 'CustomSelect';

export default CustomSelect;
