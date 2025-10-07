import React from 'react'
import { CFormLabel, CFormInput, CFormSelect, CFormText, CRow, CCol } from '@coreui/react'
import PropTypes from 'prop-types'

// Text Input Field
export const TextField = ({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  required = false, 
  helpText, 
  col = 6,
  invalid = false,
  feedback,
  ...props 
}) => (
  <CCol md={col}>
    <CFormLabel htmlFor={props.id}>
      {label} {required && <span className="text-danger">*</span>}
    </CFormLabel>
    <CFormInput
      {...props}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      invalid={invalid}
    />
    {feedback && <div className="invalid-feedback d-block">{feedback}</div>}
    {helpText && <CFormText>{helpText}</CFormText>}
  </CCol>
)

// Select Field
export const SelectField = ({ 
  label, 
  value, 
  onChange, 
  options = [], 
  required = false, 
  helpText, 
  col = 6,
  invalid = false,
  feedback,
  ...props 
}) => (
  <CCol md={col}>
    <CFormLabel htmlFor={props.id}>
      {label} {required && <span className="text-danger">*</span>}
    </CFormLabel>
    <CFormSelect
      {...props}
      value={value}
      onChange={onChange}
      required={required}
      invalid={invalid}
    >
      {options.map((option, index) => (
        <option key={`option-${option.value}-${index}`} value={option.value}>
          {option.label}
        </option>
      ))}
    </CFormSelect>
    {feedback && <div className="invalid-feedback d-block">{feedback}</div>}
    {helpText && <CFormText>{helpText}</CFormText>}
  </CCol>
)

// Row Wrapper
export const FormRow = ({ children, className = "mt-3" }) => (
  <CRow className={className}>
    {children}
  </CRow>
)

TextField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  helpText: PropTypes.string,
  col: PropTypes.number,
  invalid: PropTypes.bool,
  feedback: PropTypes.string
}

SelectField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired
  })),
  required: PropTypes.bool,
  helpText: PropTypes.string,
  col: PropTypes.number,
  invalid: PropTypes.bool,
  feedback: PropTypes.string
}

FormRow.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
}
