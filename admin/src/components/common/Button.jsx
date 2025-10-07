import React from 'react'
import { CButton } from '@coreui/react'
import PropTypes from 'prop-types'

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  className = '',
  onClick,
  type = 'button',
  ...props 
}) => {
  const getVariantClass = () => {
    const variants = {
      primary: 'btn-primary',
      secondary: 'btn-secondary',
      success: 'btn-success',
      info: 'btn-info',
      warning: 'btn-warning',
      danger: 'btn-danger',
      light: 'btn-light',
      dark: 'btn-dark',
      outline: 'btn-outline-primary'
    }
    return variants[variant] || variants.primary
  }

  const getSizeClass = () => {
    const sizes = {
      sm: 'btn-sm',
      md: '',
      lg: 'btn-lg'
    }
    return sizes[size] || ''
  }

  const buttonClasses = [
    'btn',
    getVariantClass(),
    getSizeClass(),
    fullWidth ? 'w-100' : '',
    className
  ].filter(Boolean).join(' ')

  const renderIcon = () => {
    if (!icon) return null
    
    if (typeof icon === 'string') {
      return <i className={`${icon} me-1`} />
    }
    
    return <span className="me-1">{icon}</span>
  }

  const renderContent = () => {
    if (loading) {
      return (
        <>
          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
          Loading...
        </>
      )
    }

    if (icon && iconPosition === 'left') {
      return (
        <>
          {renderIcon()}
          {children}
        </>
      )
    }

    if (icon && iconPosition === 'right') {
      return (
        <>
          {children}
          {renderIcon()}
        </>
      )
    }

    return children
  }

  return (
    <CButton
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={onClick}
      type={type}
      {...props}
    >
      {renderContent()}
    </CButton>
  )
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'success', 'info', 'warning', 'danger', 'light', 'dark', 'outline']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  iconPosition: PropTypes.oneOf(['left', 'right']),
  fullWidth: PropTypes.bool,
  className: PropTypes.string,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset'])
}

export default Button
