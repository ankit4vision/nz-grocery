import React from 'react'
import { Modal, Row, Col, Badge, Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faUser, 
  faEnvelope, 
  faPhone, 
  faMapMarkerAlt, 
  faShoppingCart, 
  faDollarSign,
  faCalendarAlt,
  faBan,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons'

const CustomerDetailsModal = ({ 
  visible, 
  onClose, 
  customer, 
  onSuspend, 
  onActivate 
}) => {
  if (!customer) return null

  // Generate initials for avatar
  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase()
  }

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-NZ', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NZ', {
      style: 'currency',
      currency: 'NZD'
    }).format(amount)
  }

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success'
      case 'suspended': return 'danger'
      case 'pending': return 'warning'
      default: return 'secondary'
    }
  }

  // Get status text
  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Active'
      case 'suspended': return 'Suspended'
      case 'pending': return 'Pending'
      default: return status
    }
  }

  return (
    <Modal show={visible} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Customer Details</Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="p-4">
        {/* Customer Profile Section */}
        <div className="text-center mb-4">
          <div 
            className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
            style={{ 
              width: '80px', 
              height: '80px', 
              backgroundColor: '#8b5cf6',
              color: 'white',
              fontSize: '24px',
              fontWeight: 'bold'
            }}
          >
            {getInitials(customer.firstName, customer.lastName)}
          </div>
          <h4 className="mb-1">{customer.firstName} {customer.lastName}</h4>
          <p className="text-muted mb-0">Customer ID: {customer.customerId}</p>
        </div>

        {/* Customer Information */}
        <Row className="g-4">
          <Col md={6}>
            <div className="d-flex align-items-center mb-3">
              <FontAwesomeIcon icon={faEnvelope} className="me-3 text-success" />
              <div>
                <div className="fw-semibold">Email</div>
                <div className="text-muted">{customer.email}</div>
              </div>
            </div>
          </Col>
          
          <Col md={6}>
            <div className="d-flex align-items-center mb-3">
              <FontAwesomeIcon icon={faPhone} className="me-3 text-success" />
              <div>
                <div className="fw-semibold">Phone</div>
                <div className="text-muted">{customer.phone}</div>
              </div>
            </div>
          </Col>
          
          <Col md={6}>
            <div className="d-flex align-items-center mb-3">
              <FontAwesomeIcon icon={faUser} className="me-3 text-success" />
              <div>
                <div className="fw-semibold">Verification Status</div>
                <div className="d-flex gap-2 mt-1">
                  {customer.emailVerified ? (
                    <Badge bg="success">Email Verified</Badge>
                  ) : (
                    <Badge bg="secondary">Email Not Verified</Badge>
                  )}
                  {customer.phoneVerified ? (
                    <Badge bg="success">Phone Verified</Badge>
                  ) : (
                    <Badge bg="secondary">Phone Not Verified</Badge>
                  )}
                </div>
              </div>
            </div>
          </Col>
          
          {customer.dateOfBirth && (
            <Col md={6}>
              <div className="d-flex align-items-center mb-3">
                <FontAwesomeIcon icon={faCalendarAlt} className="me-3 text-success" />
                <div>
                  <div className="fw-semibold">Date of Birth</div>
                  <div className="text-muted">{formatDate(customer.dateOfBirth)}</div>
                </div>
              </div>
            </Col>
          )}
          
          {customer.gender && (
            <Col md={6}>
              <div className="d-flex align-items-center mb-3">
                <FontAwesomeIcon icon={faUser} className="me-3 text-success" />
                <div>
                  <div className="fw-semibold">Gender</div>
                  <div className="text-muted">{customer.gender}</div>
                </div>
              </div>
            </Col>
          )}
          
          {customer.lastLogin && (
            <Col md={6}>
              <div className="d-flex align-items-center mb-3">
                <FontAwesomeIcon icon={faCalendarAlt} className="me-3 text-success" />
                <div>
                  <div className="fw-semibold">Last Login</div>
                  <div className="text-muted">{formatDate(customer.lastLogin)}</div>
                </div>
              </div>
            </Col>
          )}
          
          <Col md={6}>
            <div className="d-flex align-items-center mb-3">
              <FontAwesomeIcon icon={faCalendarAlt} className="me-3 text-success" />
              <div>
                <div className="fw-semibold">Joined</div>
                <div className="text-muted">{formatDate(customer.joinedDate)}</div>
              </div>
            </div>
          </Col>
        </Row>

        {/* Status Badge */}
        <div className="text-center mb-4">
          <Badge bg={getStatusColor(customer.status)} className="px-3 py-2 fs-6">
            {getStatusText(customer.status)}
          </Badge>
        </div>

        {/* Address Information */}
        {customer.addresses && customer.addresses.length > 0 && (
          <div className="mb-4">
            <h6 className="fw-semibold mb-3">Address Information</h6>
            {customer.addresses.map((address, index) => (
              <div key={address.id || index} className="bg-light p-3 rounded mb-2">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <Badge bg={address.isDefault ? 'primary' : 'secondary'} className="me-2">
                      {address.isDefault ? 'Default' : address.addressType || 'Other'}
                    </Badge>
                    {!address.isActive && (
                      <Badge bg="danger">Inactive</Badge>
                    )}
                  </div>
                </div>
                <div className="text-muted">
                  {address.addressLine1}<br />
                  {address.addressLine2 && <>{address.addressLine2}<br /></>}
                  {address.city}, {address.state} {address.postalCode}<br />
                  {address.country}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Account Information */}
        <div className="mb-4">
          <h6 className="fw-semibold mb-3">Account Information</h6>
          <div className="bg-light p-3 rounded">
            <Row className="g-2">
              <Col md={6}>
                <small className="text-muted">Account Status:</small>
                <div className="fw-semibold">
                  <Badge bg={customer.isActive ? 'success' : 'danger'}>
                    {customer.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </Col>
              <Col md={6}>
                <small className="text-muted">Verified:</small>
                <div className="fw-semibold">
                  <Badge bg={customer.isVerified ? 'success' : 'warning'}>
                    {customer.isVerified ? 'Verified' : 'Not Verified'}
                  </Badge>
                </div>
              </Col>
              {customer.totalAddresses !== undefined && (
                <Col md={6}>
                  <small className="text-muted">Total Addresses:</small>
                  <div className="fw-semibold">{customer.totalAddresses || 0}</div>
                </Col>
              )}
            </Row>
          </div>
        </div>
      </Modal.Body>
      
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        {customer.status === 'active' ? (
          <Button variant="danger" onClick={() => onSuspend(customer)}>
            <FontAwesomeIcon icon={faBan} className="me-2" />
            Suspend Account
          </Button>
        ) : customer.status === 'suspended' ? (
          <Button variant="success" onClick={() => onActivate(customer)}>
            <FontAwesomeIcon icon={faCheckCircle} className="me-2" />
            Activate Account
          </Button>
        ) : null}
      </Modal.Footer>
    </Modal>
  )
}

export default CustomerDetailsModal
