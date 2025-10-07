import React from 'react'
import { CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CButton, CForm, CFormLabel, CFormInput, CFormSelect, CFormText, CRow, CCol } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import PropTypes from 'prop-types'

const FormModal = ({
  visible,
  onClose,
  title,
  onSubmit,
  submitText = 'Save',
  cancelText = 'Cancel',
  loading = false,
  loadingText = 'Saving...',
  submitIcon,
  size = 'lg',
  children,
  onConfirm, // Extract but don't use
  confirmText, // Extract but don't use
  ...props
}) => {
  return (
    <CModal visible={visible} onClose={onClose} size={size}>
      <CModalHeader>
        <CModalTitle>{title}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm>
          {children}
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose} disabled={loading}>
          {cancelText}
        </CButton>
        <CButton 
          color="primary" 
          onClick={onSubmit}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              {loadingText}
            </>
          ) : (
            <>
              {submitIcon && <CIcon icon={submitIcon} className="me-1" />}
              {submitText}
            </>
          )}
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

FormModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  submitText: PropTypes.string,
  cancelText: PropTypes.string,
  loading: PropTypes.bool,
  loadingText: PropTypes.string,
  submitIcon: PropTypes.object,
  size: PropTypes.string,
  children: PropTypes.node,
  onConfirm: PropTypes.func, // For compatibility
  confirmText: PropTypes.string // For compatibility
}

export default FormModal
