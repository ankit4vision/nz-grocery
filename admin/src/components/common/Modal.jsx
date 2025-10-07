import React from 'react'
import { CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter } from '@coreui/react'
import PropTypes from 'prop-types'
import Button from './Button'

const Modal = ({ 
  visible, 
  onClose, 
  title, 
  children, 
  size = 'md',
  closable = true,
  maskClosable = true,
  footer,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  loading = false,
  className = '',
  type = 'default', // 'default', 'danger', 'warning', 'success', 'info'
  showFooter = true,
  ...props 
}) => {
  const handleClose = () => {
    if (onClose) {
      onClose()
    }
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    } else {
      handleClose()
    }
  }

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm()
    }
  }

  const getSizeClass = () => {
    const sizes = {
      sm: 'modal-sm',
      md: '',
      lg: 'modal-lg',
      xl: 'modal-xl'
    }
    return sizes[size] || ''
  }

  const getTypeStyles = () => {
    const typeStyles = {
      default: {
        headerClass: '',
        titleClass: '',
        confirmButtonVariant: 'primary',
        confirmButtonColor: 'primary'
      },
      danger: {
        headerClass: 'bg-danger text-white',
        titleClass: 'text-white',
        confirmButtonVariant: 'danger',
        confirmButtonColor: 'danger'
      },
      warning: {
        headerClass: 'bg-warning text-dark',
        titleClass: 'text-dark',
        confirmButtonVariant: 'warning',
        confirmButtonColor: 'warning'
      },
      success: {
        headerClass: 'bg-success text-white',
        titleClass: 'text-white',
        confirmButtonVariant: 'success',
        confirmButtonColor: 'success'
      },
      info: {
        headerClass: 'bg-info text-white',
        titleClass: 'text-white',
        confirmButtonVariant: 'info',
        confirmButtonColor: 'info'
      }
    }
    return typeStyles[type] || typeStyles.default
  }

  const renderFooter = () => {
    if (footer === null || !showFooter) return null

    if (footer) {
      return <CModalFooter>{footer}</CModalFooter>
    }

    if (onConfirm || onCancel) {
      return (
        <CModalFooter>
          <Button 
            variant="secondary" 
            onClick={handleCancel}
            disabled={loading}
          >
            {cancelText}
          </Button>
          {onConfirm && (
            <Button 
              variant={typeStyles.confirmButtonVariant}
              color={typeStyles.confirmButtonColor}
              onClick={handleConfirm}
              loading={loading}
            >
              {confirmText}
            </Button>
          )}
        </CModalFooter>
      )
    }

    return null
  }

  const typeStyles = getTypeStyles()

  return (
    <CModal
      visible={visible}
      onClose={handleClose}
      size={size}
      backdrop={maskClosable ? true : 'static'}
      className={className}
      {...props}
    >
      {title && (
        <CModalHeader closeButton={closable} className={typeStyles.headerClass}>
          <CModalTitle className={typeStyles.titleClass}>{title}</CModalTitle>
        </CModalHeader>
      )}
      
      <CModalBody>
        {children}
      </CModalBody>
      
      {renderFooter()}
    </CModal>
  )
}

Modal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  children: PropTypes.node,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  closable: PropTypes.bool,
  maskClosable: PropTypes.bool,
  footer: PropTypes.node,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func,
  loading: PropTypes.bool,
  className: PropTypes.string,
  type: PropTypes.oneOf(['default', 'danger', 'warning', 'success', 'info']),
  showFooter: PropTypes.bool
}

export default Modal
