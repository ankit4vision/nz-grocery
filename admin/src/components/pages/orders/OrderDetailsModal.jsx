import React, { useState, useEffect } from 'react'
import { Modal, Row, Col, Card, Badge, Button, Form, Alert } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
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
      <Modal.Header closeButton className="bg-light">
        <div className="d-flex justify-content-between align-items-center w-100">
          <div>
            <Modal.Title className="mb-1">Order Details</Modal.Title>
            {order && (
              <div className="d-flex align-items-center gap-2 mt-1">
                <span className="text-muted small">{order.orderNumber}</span>
                {order.orderType && (
                  <Badge bg="info" className="small">{order.orderType}</Badge>
                )}
              </div>
            )}
          </div>
          {order && (
            <div className="d-flex gap-2">
              <Badge bg={getStatusColor(order.status)} className="px-3 py-2">
                {order.status.charAt(0).toUpperCase() + order.status.slice(1).replace(/_/g, ' ')}
              </Badge>
              <Badge bg={getPaymentStatusColor(order.paymentStatus)} className="px-3 py-2">
                {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
              </Badge>
            </div>
          )}
        </div>
      </Modal.Header>
      
      <Modal.Body className="p-4">
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
        <>
          {/* Order Summary - Top Section */}
          <Card className="mb-4 border-0 shadow-sm">
            <Card.Body>
              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <small className="text-muted d-block mb-1">Order Date</small>
                    <strong>{formatDate(new Date(order.orderDate), 'MMM dd, yyyy h:mm a')}</strong>
                  </div>
                  {order.updatedAt && (
                    <div className="mb-3">
                      <small className="text-muted d-block mb-1">Last Updated</small>
                      <strong>{formatDate(new Date(order.updatedAt), 'MMM dd, yyyy h:mm a')}</strong>
                    </div>
                  )}
                </Col>
                <Col md={6}>
                  <div className="text-end">
                    <div className="mb-2">
                      <small className="text-muted d-block mb-1">Total Amount</small>
                      <h4 className="mb-0 text-success">{formatCurrency(order.total || 0)}</h4>
                    </div>
                    <div className="text-success small">
                      Commission: {formatCurrency(order.commission || 0)}
                    </div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Row className="g-4">
            {/* Left Column - Order Items */}
            <Col lg={7}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Header className="bg-white border-bottom">
                  <h5 className="mb-0">Order Items ({order.totalItemsCount || order.items?.length || 0})</h5>
                </Card.Header>
                <Card.Body>
                  {order.items && order.items.length > 0 ? (
                    <>
                      {order.items.map((item) => (
                        <div key={item.id || item.orderItemId} className="d-flex align-items-start mb-4 pb-4 border-bottom">
                          {item.productImage ? (
                            <img 
                              src={item.productImage} 
                              alt={item.productName}
                              className="rounded me-3"
                              style={{ width: '70px', height: '70px', objectFit: 'cover' }}
                            />
                          ) : (
                            <div 
                              className="d-flex align-items-center justify-content-center border rounded me-3"
                              style={{ 
                                width: '70px', 
                                height: '70px', 
                                backgroundColor: '#f8f9fa'
                              }}
                            >
                              <FontAwesomeIcon icon={faImage} className="text-muted" size="lg" />
                            </div>
                          )}
                          <div className="flex-grow-1">
                            <h6 className="mb-1 fw-semibold">
                              {item.productName}
                              {item.variantName && (
                                <span className="text-muted ms-2 fw-normal" style={{ fontSize: '0.875rem' }}>
                                  - {item.variantName}
                                </span>
                              )}
                            </h6>
                            <div className="d-flex justify-content-between align-items-end mt-2">
                              <div>
                                <span className="text-muted small">Quantity: </span>
                                <strong>{item.quantity}</strong>
                                <span className="text-muted small ms-3">Unit Price: </span>
                                <span>{formatCurrency(item.unitPrice)}</span>
                              </div>
                              <div className="text-end">
                                <div className="fw-bold fs-6">{formatCurrency(item.totalPrice)}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      <div className="mt-3 pt-3 border-top">
                        <Row>
                          <Col xs={6}>
                            <div className="text-muted small">Total Items</div>
                            <div className="fw-semibold">{order.totalItemsCount || order.items.length}</div>
                          </Col>
                          <Col xs={6} className="text-end">
                            <div className="text-muted small">Subtotal</div>
                            <div className="fw-semibold">{formatCurrency(order.subtotal || 0)}</div>
                          </Col>
                        </Row>
                      </div>
                    </>
                  ) : (
                    <div className="text-center text-muted py-5">No items found</div>
                  )}
                </Card.Body>
              </Card>
            </Col>

            {/* Right Column - Customer Info, Summary & Status Update */}
            <Col lg={5}>
              {/* Customer Information */}
              <Card className="mb-4 border-0 shadow-sm">
                <Card.Header className="bg-white border-bottom">
                  <h5 className="mb-0">Customer Information</h5>
                </Card.Header>
                <Card.Body>
                  <div className="d-flex align-items-center mb-3 pb-3 border-bottom">
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
                      <h6 className="mb-0 fw-semibold">{order.customer.firstName} {order.customer.lastName}</h6>
                      <p className="text-muted mb-0 small">{order.customer.email}</p>
                    </div>
                  </div>
                  
                  <div className="mb-2">
                    <small className="text-muted d-block mb-1">Phone</small>
                    <div>{order.customer.phone || 'N/A'}</div>
                  </div>
                  
                  {order.deliveryAddressId && (
                    <div className="mb-2">
                      <small className="text-muted d-block mb-1">Delivery Address ID</small>
                      <div>{order.deliveryAddressId}</div>
                    </div>
                  )}
                  
                  {order.pickupAddressId && (
                    <div className="mb-2">
                      <small className="text-muted d-block mb-1">Pickup Address ID</small>
                      <div>{order.pickupAddressId}</div>
                    </div>
                  )}
                  
                  {order.deliveryInstructions && (
                    <div className="mb-2">
                      <small className="text-muted d-block mb-1">Delivery Instructions</small>
                      <div className="text-muted">{order.deliveryInstructions}</div>
                    </div>
                  )}
                  
                  {order.estimatedDeliveryTime && (
                    <div className="mb-2">
                      <small className="text-muted d-block mb-1">Estimated Delivery</small>
                      <div>{formatDate(new Date(order.estimatedDeliveryTime), 'MMM dd, yyyy h:mm a')}</div>
                    </div>
                  )}
                  
                  {order.actualDeliveryTime && (
                    <div className="mb-2">
                      <small className="text-muted d-block mb-1">Actual Delivery</small>
                      <div>{formatDate(new Date(order.actualDeliveryTime), 'MMM dd, yyyy h:mm a')}</div>
                    </div>
                  )}
                  
                  {order.cancellationReason && (
                    <div className="mb-2 mt-3 pt-3 border-top">
                      <small className="text-danger d-block mb-1 fw-semibold">Cancellation Reason</small>
                      <div className="text-danger">{order.cancellationReason}</div>
                    </div>
                  )}
                </Card.Body>
              </Card>

              {/* Order Summary */}
              <Card className="mb-4 border-0 shadow-sm">
                <Card.Header className="bg-white border-bottom">
                  <h5 className="mb-0">Order Summary</h5>
                </Card.Header>
                <Card.Body>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Subtotal</span>
                    <span>{formatCurrency(order.subtotal || 0)}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-success">Discount</span>
                      <span className="text-success">-{formatCurrency(order.discount || 0)}</span>
                    </div>
                  )}
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Shipping</span>
                    <span>{formatCurrency(order.shipping || 0)}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Tax</span>
                    <span>{formatCurrency(order.tax || 0)}</span>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between mb-3">
                    <strong>Total</strong>
                    <strong className="fs-5">{formatCurrency(order.total || 0)}</strong>
                  </div>
                  <div className="d-flex justify-content-between pt-2 border-top">
                    <span className="text-success small">Commission (10%)</span>
                    <span className="text-success fw-semibold">{formatCurrency(order.commission || 0)}</span>
                  </div>
                </Card.Body>
              </Card>

              {/* Status Update */}
              <Card className="border-0 shadow-sm">
                <Card.Header className="bg-white border-bottom">
                  <h5 className="mb-0">Update Status</h5>
                </Card.Header>
                <Card.Body>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Order Status</Form.Label>
                    <Form.Select 
                      value={selectedStatus} 
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      disabled={updating}
                      className="border-2"
                    >
                      {orderService.getOrderStatusOptions().map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Notes (Optional)</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add notes about this status change..."
                      disabled={updating}
                      className="border-2"
                    />
                  </Form.Group>

                  <div className="d-grid">
                    <Button 
                      variant="success"
                      onClick={handleStatusUpdate}
                      disabled={updating || selectedStatus === order.status}
                      size="lg"
                    >
                      {updating ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Updating...
                        </>
                      ) : (
                        'Update Status'
                      )}
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
        )}
      </Modal.Body>
      
      <Modal.Footer className="bg-light">
        {order && (
          <div className="d-flex justify-content-between w-100 align-items-center">
            <div className="text-muted small">
              Order ID: {order.orderId} | Created: {formatDate(new Date(order.orderDate), 'MMM dd, yyyy')}
            </div>
            <Button variant="secondary" onClick={onHide} size="sm">
              Close
            </Button>
          </div>
        )}
      </Modal.Footer>
    </Modal>
  )
}

export default OrderDetailsModal
