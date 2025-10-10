import React, { useState, useEffect } from 'react'
import { Modal, Form, Button, Row, Col } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTimes, faPaperPlane, faEye } from '@fortawesome/free-solid-svg-icons'

const NotificationFormModal = ({ show, onHide, notification, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'promotional',
    targetAudience: 'all',
    message: '',
    scheduledDate: '',
    scheduledTime: ''
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (notification) {
      setFormData({
        title: notification.title || '',
        description: notification.description || '',
        type: notification.type || 'promotional',
        targetAudience: notification.targetAudience || 'all',
        message: notification.message || '',
        scheduledDate: notification.scheduledDate || '',
        scheduledTime: notification.scheduledTime || ''
      })
    } else {
      setFormData({
        title: '',
        description: '',
        type: 'promotional',
        targetAudience: 'all',
        message: '',
        scheduledDate: '',
        scheduledTime: ''
      })
    }
    setErrors({})
  }, [notification, show])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    }
    
    if (!formData.scheduledDate) {
      newErrors.scheduledDate = 'Scheduled date is required'
    }
    
    if (!formData.scheduledTime) {
      newErrors.scheduledTime = 'Scheduled time is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (validateForm()) {
      onSave({
        ...formData,
        id: notification?.id || Date.now(),
        status: 'pending',
        sentDate: new Date().toISOString().split('T')[0]
      })
    }
  }

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      type: 'promotional',
      targetAudience: 'all',
      message: '',
      scheduledDate: '',
      scheduledTime: ''
    })
    setErrors({})
    onHide()
  }

  const getTargetAudienceOptions = () => {
    const options = [
      { value: 'all', label: 'All Users' },
      { value: 'customers', label: 'All Customers' },
      { value: 'subscribers', label: 'Subscribers' },
      { value: 'specific', label: 'Specific Customers' },
      { value: 'pending', label: 'Pending Orders' },
      { value: 'vip', label: 'VIP Customers' }
    ]
    return options
  }

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {notification ? 'Edit Notification' : 'Send New Notification'}
        </Modal.Title>
      </Modal.Header>
      
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Row>
            <Col xs={12}>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="title" className="fw-semibold">Notification Title *</Form.Label>
                <Form.Control
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  isInvalid={!!errors.title}
                  className="border-2"
                  placeholder="Enter notification title"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.title}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col xs={12}>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="description" className="fw-semibold">Description</Form.Label>
                <Form.Control
                  id="description"
                  name="description"
                  as="textarea"
                  rows={2}
                  value={formData.description}
                  onChange={handleChange}
                  className="border-2"
                  placeholder="Brief description of the notification"
                />
                <Form.Text className="text-muted">
                  Internal description for tracking purposes
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="type" className="fw-semibold">Notification Type *</Form.Label>
                <Form.Select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="border-2"
                >
                  <option value="promotional">Promotional</option>
                  <option value="system">System</option>
                  <option value="transactional">Transactional</option>
                  <option value="marketing">Marketing</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="targetAudience" className="fw-semibold">Target Audience *</Form.Label>
                <Form.Select
                  id="targetAudience"
                  name="targetAudience"
                  value={formData.targetAudience}
                  onChange={handleChange}
                  className="border-2"
                >
                  {getTargetAudienceOptions().map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col xs={12}>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="message" className="fw-semibold">Message Content *</Form.Label>
                <Form.Control
                  id="message"
                  name="message"
                  as="textarea"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  isInvalid={!!errors.message}
                  className="border-2"
                  placeholder="Enter the notification message that will be sent to users"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.message}
                </Form.Control.Feedback>
                <Form.Text className="text-muted">
                  This is the actual message that users will receive
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="scheduledDate" className="fw-semibold">Scheduled Date *</Form.Label>
                <Form.Control
                  id="scheduledDate"
                  name="scheduledDate"
                  type="date"
                  value={formData.scheduledDate}
                  onChange={handleChange}
                  required
                  isInvalid={!!errors.scheduledDate}
                  className="border-2"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.scheduledDate}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="scheduledTime" className="fw-semibold">Scheduled Time *</Form.Label>
                <Form.Control
                  id="scheduledTime"
                  name="scheduledTime"
                  type="time"
                  value={formData.scheduledTime}
                  onChange={handleChange}
                  required
                  isInvalid={!!errors.scheduledTime}
                  className="border-2"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.scheduledTime}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          {/* Preview Section */}
          <div className="bg-light rounded-3 p-3 border border-success border-2">
            <h6 className="text-success mb-3">
              <FontAwesomeIcon icon={faEye} className="me-2" />
              Preview
            </h6>
            <div className="mb-2">
              <strong>Title:</strong> {formData.title || 'Your notification title...'}
            </div>
            <div className="mb-2">
              <strong>Message:</strong> {formData.message || 'Your notification message...'}
            </div>
            <div className="mb-2">
              <strong>Type:</strong> {formData.type}
            </div>
            <div>
              <strong>Target:</strong> {getTargetAudienceOptions().find(opt => opt.value === formData.targetAudience)?.label}
            </div>
          </div>
        </Modal.Body>
        
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            <FontAwesomeIcon icon={faTimes} className="me-2" />
            Cancel
          </Button>
          <Button variant="success" type="submit" className="text-white">
            <FontAwesomeIcon icon={faPaperPlane} className="me-2" />
            {notification ? 'Update Notification' : 'Schedule Notification'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default NotificationFormModal
