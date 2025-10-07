import React from 'react'
import { CCard, CCardBody, CCardHeader, CCardTitle, CCardText } from '@coreui/react'
import PropTypes from 'prop-types'

const Card = ({ 
  children, 
  title, 
  subtitle,
  text,
  variant = 'default',
  className = '',
  headerActions,
  hoverable = false,
  ...props 
}) => {
  const getVariantClass = () => {
    const variants = {
      default: 'card',
      primary: 'card card-primary',
      success: 'card card-success',
      info: 'card card-info',
      warning: 'card card-warning',
      danger: 'card card-danger'
    }
    return variants[variant] || variants.default
  }

  const cardClasses = [
    getVariantClass(),
    hoverable ? 'card-hover' : '',
    className
  ].filter(Boolean).join(' ')

  const renderHeader = () => {
    if (!title && !subtitle && !headerActions) return null

    return (
      <CCardHeader className="d-flex justify-content-between align-items-center">
        <div>
          {title && <CCardTitle className="mb-0">{title}</CCardTitle>}
          {subtitle && <small className="text-muted">{subtitle}</small>}
        </div>
        {headerActions && (
          <div className="card-header-actions">
            {headerActions}
          </div>
        )}
      </CCardHeader>
    )
  }

  const renderBody = () => {
    return (
      <CCardBody>
        {text && <CCardText>{text}</CCardText>}
        {children}
      </CCardBody>
    )
  }

  return (
    <CCard className={cardClasses} {...props}>
      {renderHeader()}
      {renderBody()}
    </CCard>
  )
}

Card.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  text: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'primary', 'success', 'info', 'warning', 'danger']),
  className: PropTypes.string,
  headerActions: PropTypes.node,
  hoverable: PropTypes.bool
}

export default Card
