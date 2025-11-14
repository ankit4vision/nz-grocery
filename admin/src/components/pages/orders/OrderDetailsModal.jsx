import React, { useState, useEffect } from 'react'
import { Modal, Row, Col, Card, Badge, Button, Form, Alert } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faTimes, 
  faTruck, 
  faPrint,
  faEnvelope,
  faImage,
  faUser
} from '@fortawesome/free-solid-svg-icons'
import orderService from '../../../services/orderService'
import { formatCurrency, formatDate } from '../../../utils'
import { useToast } from '../../../components'

const OrderDetailsModal = ({ show, onHide, orderId, onOrderUpdate }) => {
  const { success, error: showError } = useToast()
  
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    if (show && orderId) {
      fetchOrderDetails()
    } else {
      // Reset state when modal closes
      setOrder(null)
      setError('')
      setSuccessMsg('')
      setSelectedStatus('')
      setNotes('')
    }
  }, [show, orderId])

  const fetchOrderDetails = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await orderService.getOrderDetails(orderId)
      if (response.success) {
        setOrder(response.data)
        setSelectedStatus(response.data.status)
      } else {
        setError(response.message || 'Failed to load order details')
        showError(response.message || 'Failed to load order details')
      }
    } catch (err) {
      const errorMsg = 'Failed to load order details'
      setError(errorMsg)
      showError(errorMsg)
      console.error('Error fetching order details:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async () => {
    if (!selectedStatus || selectedStatus === order.status) return

    setUpdating(true)
    setError('')
    setSuccessMsg('')

    try {
      const response = await orderService.updateOrderStatus(orderId, selectedStatus, notes)
      if (response.success) {
        setSuccessMsg('Order status updated successfully')
        success('Order status updated successfully')
        setOrder(prev => ({ ...prev, status: selectedStatus }))
        onOrderUpdate && onOrderUpdate()
        
        // Clear notes after successful update
        setNotes('')
      } else {
        setError(response.message || 'Failed to update order status')
        showError(response.message || 'Failed to update order status')
      }
    } catch (err) {
      const errorMsg = 'Failed to update order status'
      setError(errorMsg)
      showError(errorMsg)
      console.error('Error updating order status:', err)
    } finally {
      setUpdating(false)
    }
  }

  const getStatusColor = (status) => {
    const statusMap = {
      pending: 'warning',
      confirmed: 'info',
      processing: 'primary',
      ready_for_pickup: 'info',
      out_for_delivery: 'info',
      delivered: 'success',
      cancelled: 'danger',
      refunded: 'secondary'
    }
    return statusMap[status] || 'secondary'
  }

  const getPaymentStatusColor = (status) => {
    const statusMap = {
      pending: 'warning',
      paid: 'success',
      failed: 'danger',
      refunded: 'secondary',
      partial: 'info'
    }
    return statusMap[status] || 'secondary'
  }

  if (!show) return null

  return (
    <Modal show={show} onHide={onHide} size="xl" centered>
      <Modal.Header closeButton>
        <Modal.Title>Order Details {order ? `- ${order.orderNumber}` : ''}</Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}
        {!loading && error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
        {!loading && successMsg && <Alert variant="success" dismissible onClose={() => setSuccessMsg('')}>{successMsg}</Alert>}
        {!loading && order && (
        
        <Row>
          {/* Left Column - Order Items & Timeline */}
          <Col lg={8}>
            {/* Order Items */}
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">Order Items</h5>
              </Card.Header>
              <Card.Body>
                {order.items && order.items.length > 0 ? (
                  order.items.map((item) => (
                    <div key={item.id || item.orderItemId} className="d-flex align-items-center mb-3 pb-3 border-bottom">
                      {item.productImage ? (
                        <img 
                          src={item.productImage} 
                          alt={item.productName}
                          className="rounded me-3"
                          style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                        />
                      ) : (
                        <div 
                          className="d-flex align-items-center justify-content-center border rounded me-3"
                          style={{ 
                            width: '60px', 
                            height: '60px', 
                            backgroundColor: '#f8f9fa'
                          }}
                        >
                          <FontAwesomeIcon icon={faImage} className="text-muted" />
                        </div>
                      )}
                      <div className="flex-grow-1">
                        <h6 className="mb-1">
                          {item.productName}
                          {item.variantName && (
                            <span className="text-muted ms-2" style={{ fontSize: '0.875rem' }}>
                              ({item.variantName})
                            </span>
                          )}
                        </h6>
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="text-muted">Qty: {item.quantity}</span>
                          <div className="text-end">
                            <div className="text-muted small">{formatCurrency(item.unitPrice)} each</div>
                            <div className="fw-bold">{formatCurrency(item.totalPrice)}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-muted py-3">No items found</div>
                )}
                {order.totalItemsCount > 0 && (
                  <div className="mt-3 pt-3 border-top">
                    <div className="d-flex justify-content-between">
                      <strong>Total Items:</strong>
                      <strong>{order.totalItemsCount}</strong>
                    </div>
                  </div>
                )}
              </Card.Body>
            </Card>

          </Col>

          {/* Right Column - Customer Info, Summary & Actions */}
          <Col lg={4}>
            {/* Customer Information */}
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">Customer Information</h5>
              </Card.Header>
              <Card.Body>
                <div className="d-flex align-items-center mb-3">
                  {order.customer.avatar ? (
                    <img 
                      src={order.customer.avatar} 
                      alt={order.customer.firstName}
                      className="rounded-circle me-3"
                      style={{ width: '50px', height: '50px' }}
                    />
                  ) : (
                    <div 
                      className="d-flex align-items-center justify-content-center border rounded-circle me-3"
                      style={{ 
                        width: '50px', 
                        height: '50px', 
                        backgroundColor: '#f8f9fa'
                      }}
                    >
                      <FontAwesomeIcon icon={faUser} className="text-muted" />
                    </div>
                  )}
                  <div>
                    <h6 className="mb-0">{order.customer.firstName} {order.customer.lastName}</h6>
                    <p className="text-muted mb-0">{order.customer.email}</p>
                  </div>
                </div>
                <div className="mb-2">
                  <strong>Phone:</strong> {order.customer.phone || 'N/A'}
                </div>
                {order.deliveryAddressId && (
                  <div className="mb-2">
                    <strong>Delivery Address ID:</strong> {order.deliveryAddressId}
                  </div>
                )}
                {order.pickupAddressId && (
                  <div className="mb-2">
                    <strong>Pickup Address ID:</strong> {order.pickupAddressId}
                  </div>
                )}
                {order.deliveryInstructions && (
                  <div className="mb-2">
                    <strong>Delivery Instructions:</strong>
                    <div className="text-muted">{order.deliveryInstructions}</div>
                  </div>
                )}
                {order.estimatedDeliveryTime && (
                  <div className="mb-2">
                    <strong>Estimated Delivery:</strong>
                    <div className="text-muted">
                      {formatDate(new Date(order.estimatedDeliveryTime), 'MMM dd, yyyy h:mm a')}
                    </div>
                  </div>
                )}
                {order.actualDeliveryTime && (
                  <div className="mb-2">
                    <strong>Actual Delivery:</strong>
                    <div className="text-muted">
                      {formatDate(new Date(order.actualDeliveryTime), 'MMM dd, yyyy h:mm a')}
                    </div>
                  </div>
                )}
                {order.cancellationReason && (
                  <div className="mb-2">
                    <strong>Cancellation Reason:</strong>
                    <div className="text-danger">{order.cancellationReason}</div>
                  </div>
                )}
              </Card.Body>
            </Card>

            {/* Order Summary */}
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">Order Summary</h5>
              </Card.Header>
              <Card.Body>
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(order.subtotal || 0)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-success">Discount:</span>
                    <span className="text-success">-{formatCurrency(order.discount || 0)}</span>
                  </div>
                )}
                <div className="d-flex justify-content-between mb-2">
                  <span>Shipping:</span>
                  <span>{formatCurrency(order.shipping || 0)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Tax:</span>
                  <span>{formatCurrency(order.tax || 0)}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between mb-2">
                  <strong>Total:</strong>
                  <strong>{formatCurrency(order.total || 0)}</strong>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-success">Your Commission (10%):</span>
                  <span className="text-success fw-bold">{formatCurrency(order.commission || 0)}</span>
                </div>
                {order.orderType && (
                  <div className="mt-3 pt-3 border-top">
                    <div className="d-flex justify-content-between">
                      <span className="text-muted">Order Type:</span>
                      <Badge bg="info">{order.orderType}</Badge>
                    </div>
                  </div>
                )}
              </Card.Body>
            </Card>

            {/* Status Update */}
            <Card>
              <Card.Header>
                <h5 className="mb-0">Update Status</h5>
              </Card.Header>
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Order Status</Form.Label>
                  <Form.Select 
                    value={selectedStatus} 
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    disabled={updating}
                  >
                    {orderService.getOrderStatusOptions().map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Notes (Optional)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add notes about this status change..."
                    disabled={updating}
                  />
                </Form.Group>

                <div className="d-grid">
                  <Button 
                    variant="success"
                    onClick={handleStatusUpdate}
                    disabled={updating || selectedStatus === order.status}
                  >
                    {updating ? 'Updating...' : 'Update Status'}
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        )}
      </Modal.Body>
      
      <Modal.Footer>
        {order && (
          <div className="d-flex justify-content-between w-100">
            <div>
              <Badge bg={getStatusColor(order.status)} className="me-2">
                {order.status.charAt(0).toUpperCase() + order.status.slice(1).replace(/_/g, ' ')}
              </Badge>
              <Badge bg={getPaymentStatusColor(order.paymentStatus)}>
                {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
              </Badge>
            </div>
          <div>
            <Button variant="outline-secondary" className="me-2">
              <FontAwesomeIcon icon={faPrint} className="me-2" />
              Print
            </Button>
            <Button variant="outline-primary" className="me-2">
              <FontAwesomeIcon icon={faEnvelope} className="me-2" />
              Email
            </Button>
            <Button variant="secondary" onClick={onHide}>
              Close
            </Button>
          </div>
          </div>
        )}
      </Modal.Footer>
    </Modal>
  )
}

export default OrderDetailsModal
