import React from 'react';
import { Alert } from 'react-bootstrap';
import '../../styles/components/ui-elements/alert-message.css';

const AlertMessage = ({ 
  variant = 'info',
  title = '',
  message = '',
  dismissible = false,
  show = true,
  onClose,
  className = '',
  icon = null,
  ...props 
}) => {
  if (!show) return null;

  const alertClasses = [
    'custom-alert',
    `custom-alert--${variant}`,
    className
  ].filter(Boolean).join(' ');

  const renderIcon = () => {
    if (icon) return icon;
    
    const defaultIcons = {
      success: '✅',
      danger: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };
    
    return defaultIcons[variant] || defaultIcons.info;
  };

  return (
    <Alert 
      variant={variant}
      dismissible={dismissible}
      onClose={onClose}
      className={alertClasses}
      {...props}
    >
      <div className="custom-alert__content">
        <div className="custom-alert__icon">
          {renderIcon()}
        </div>
        <div className="custom-alert__body">
          {title && (
            <Alert.Heading className="custom-alert__title">
              {title}
            </Alert.Heading>
          )}
          {message && (
            <div className="custom-alert__message">
              {message}
            </div>
          )}
        </div>
      </div>
    </Alert>
  );
};

export default AlertMessage;
