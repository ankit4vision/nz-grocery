import React, { useState, useEffect } from 'react'
import { Modal, Form, Button, Row, Col } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTimes } from '@fortawesome/free-solid-svg-icons'

const BannerFormModal = ({ show, onHide, banner, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    position: 'hero',
    status: 'draft',
    image: null,
    linkUrl: '',
    startDate: '',
    endDate: ''
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (banner) {
      setFormData({
        title: banner.title || '',
        description: banner.description || '',
        position: banner.position || 'hero',
        status: banner.status || 'draft',
        image: banner.image || null,
        linkUrl: banner.linkUrl || '',
        startDate: banner.startDate || '',
        endDate: banner.endDate || ''
      })
    } else {
      setFormData({
        title: '',
        description: '',
        position: 'hero',
        status: 'draft',
        image: null,
        linkUrl: '',
        startDate: '',
        endDate: ''
      })
    }
    setErrors({})
  }, [banner, show])

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

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
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
    
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required'
    }
    
    if (!formData.endDate) {
      newErrors.endDate = 'End date is required'
    }
    
    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      newErrors.endDate = 'End date must be after start date'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (validateForm()) {
      onSave({
        ...formData,
        id: banner?.id || Date.now()
      })
    }
  }

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      position: 'hero',
      status: 'draft',
      image: null,
      linkUrl: '',
      startDate: '',
      endDate: ''
    })
    setErrors({})
    onHide()
  }

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {banner ? 'Edit Banner' : 'Add New Banner'}
        </Modal.Title>
      </Modal.Header>
      
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Row>
            <Col xs={12}>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="title" className="fw-semibold">Banner Title *</Form.Label>
                <Form.Control
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  isInvalid={!!errors.title}
                  className="border-2"
                  placeholder="Enter banner title"
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
                <Form.Label htmlFor="description" className="fw-semibold">Description *</Form.Label>
                <Form.Control
                  id="description"
                  name="description"
                  as="textarea"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  required
                  isInvalid={!!errors.description}
                  className="border-2"
                  placeholder="Enter banner description"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.description}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="position" className="fw-semibold">Position *</Form.Label>
                <Form.Select
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  className="border-2"
                >
                  <option value="hero">Hero Section</option>
                  <option value="sidebar">Sidebar</option>
                  <option value="footer">Footer</option>
                  <option value="popup">Popup</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="status" className="fw-semibold">Status *</Form.Label>
                <Form.Select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="border-2"
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col xs={12}>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="image" className="fw-semibold">Banner Image</Form.Label>
                <Form.Control
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="border-2"
                />
                <Form.Text className="text-muted">
                  Recommended size: 1200x400px for hero banners, 300x200px for sidebar banners
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col xs={12}>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="linkUrl" className="fw-semibold">Link URL</Form.Label>
                <Form.Control
                  id="linkUrl"
                  name="linkUrl"
                  type="url"
                  value={formData.linkUrl}
                  onChange={handleChange}
                  className="border-2"
                  placeholder="https://example.com"
                />
                <Form.Text className="text-muted">
                  Optional: URL to redirect when banner is clicked
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="startDate" className="fw-semibold">Start Date *</Form.Label>
                <Form.Control
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                  isInvalid={!!errors.startDate}
                  className="border-2"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.startDate}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="endDate" className="fw-semibold">End Date *</Form.Label>
                <Form.Control
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                  isInvalid={!!errors.endDate}
                  className="border-2"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.endDate}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            <FontAwesomeIcon icon={faTimes} className="me-2" />
            Cancel
          </Button>
          <Button variant="success" type="submit" className="text-white">
            <FontAwesomeIcon icon={faSave} className="me-2" />
            {banner ? 'Update Banner' : 'Create Banner'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default BannerFormModal
