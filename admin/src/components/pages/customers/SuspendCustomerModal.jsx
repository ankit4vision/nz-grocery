import React, { useState } from 'react'
import { Modal, Row, Col, Form, FormCheck, Alert, Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faExclamationTriangle, 
  faBan, 
  faShoppingCart,
  faUser,
  faHeadset,
  faBullhorn
} from '@fortawesome/free-solid-svg-icons'

const SuspendCustomerModal = ({ 
  visible, 
  onClose, 
  customer, 
  onSuspend,
  loading = false 
}) => {
  const [formData, setFormData] = useState({})

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Reset form when modal opens/closes
  React.useEffect(() => {
    if (visible) {
      setFormData({})
      setErrors({})
    }
  }, [visible])

  // Generate initials for avatar
  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase()
  }

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  // Validate form
  const validateForm = () => {
    // No validation needed since all fields are removed
    return true
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    try {
      // API only needs user_id, but we can keep form data for internal tracking
      await onSuspend(customer.userId || customer.id)
    } catch (error) {
      console.error('Error suspending customer:', error)
    } finally {
      setIsSubmitting(false)
    }
  }


  if (!customer) return null

  return (
    <Modal show={visible} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton className="bg-warning text-dark">
        <Modal.Title>
          <FontAwesomeIcon icon={faBan} className="me-2" />
          Suspend Customer Account
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="p-0">
        {/* Warning Banner */}
        <Alert variant="warning" className="m-0 rounded-0">
          <div className="d-flex align-items-center">
            <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
            <strong>Warning:</strong> Suspending a customer account will prevent them from placing new orders and accessing their account.
          </div>
        </Alert>

        <div className="p-4">
          {/* Customer Information */}
          <div className="text-center mb-4">
            <div 
              className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
              style={{ 
                width: '60px', 
                height: '60px', 
                backgroundColor: '#8b5cf6',
                color: 'white',
                fontSize: '20px',
                fontWeight: 'bold'
              }}
            >
              {getInitials(customer.firstName, customer.lastName)}
            </div>
            <h5 className="mb-1">{customer.firstName} {customer.lastName}</h5>
            <p className="text-muted mb-0">
              Customer ID: {customer.customerId} | Email: {customer.email}
            </p>
          </div>

          <Form onSubmit={handleSubmit}>
            {/* Account Impact Section */}
            <div className="mb-4">
              <div className="bg-info bg-opacity-10 p-3 rounded border">
                <h6 className="fw-semibold mb-3 text-info">Suspension will affect:</h6>
                <ul className="mb-0">
                  <li className="mb-2">
                    <FontAwesomeIcon icon={faShoppingCart} className="me-2 text-info" />
                    Customer's ability to place new orders
                  </li>
                  <li className="mb-2">
                    <FontAwesomeIcon icon={faUser} className="me-2 text-info" />
                    Access to account dashboard and order history
                  </li>
                  <li className="mb-2">
                    <FontAwesomeIcon icon={faHeadset} className="me-2 text-info" />
                    Customer support interactions
                  </li>
                  <li className="mb-0">
                    <FontAwesomeIcon icon={faBullhorn} className="me-2 text-info" />
                    Marketing communications (if selected)
                  </li>
                </ul>
              </div>
            </div>

            {/* Confirmation Checkbox */}
            <Row className="mb-4">
              <Col md={12}>
                <Form.Check
                  type="checkbox"
                  id="confirmSuspension"
                  label="I confirm that I have reviewed all details and want to suspend this customer account"
                  required
                  className="fw-semibold"
                />
              </Col>
            </Row>
          </Form>
        </div>
      </Modal.Body>
      
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button 
          variant="danger" 
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          <FontAwesomeIcon icon={faBan} className="me-2" />
          {isSubmitting ? 'Suspending...' : 'Suspend Customer'}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default SuspendCustomerModal
