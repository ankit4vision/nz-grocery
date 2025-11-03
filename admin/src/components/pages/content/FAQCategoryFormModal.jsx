import React, { useState, useEffect } from 'react'
import { Modal, Form, Button, Row, Col } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTimes } from '@fortawesome/free-solid-svg-icons'

const FAQCategoryFormModal = ({ show, onHide, category, onSave }) => {
  const [formData, setFormData] = useState({
    category_name: '',
    sort_order: 0,
    is_active: true
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (category) {
      setFormData({
        category_name: category.category_name || '',
        sort_order: category.sort_order || 0,
        is_active: category.is_active !== undefined ? category.is_active : true
      })
    } else {
      setFormData({
        category_name: '',
        sort_order: 0,
        is_active: true
      })
    }
    setErrors({})
  }, [category, show])

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
    
    if (!formData.category_name.trim()) {
      newErrors.category_name = 'Category name is required'
    } else if (formData.category_name.trim().length > 100) {
      newErrors.category_name = 'Category name must be 100 characters or less'
    }
    
    if (formData.sort_order < 0) {
      newErrors.sort_order = 'Sort order must be 0 or greater'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (validateForm()) {
      // Prepare data according to API schema
      const submitData = {
        category_name: formData.category_name.trim(),
        sort_order: formData.sort_order || 0,
        is_active: formData.is_active
      }
      
      onSave(submitData)
    }
  }

  const handleClose = () => {
    setFormData({
      category_name: '',
      sort_order: 0,
      is_active: true
    })
    setErrors({})
    onHide()
  }

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {category ? 'Edit FAQ Category' : 'Add New FAQ Category'}
        </Modal.Title>
      </Modal.Header>
      
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Row>
            <Col xs={12}>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="category_name" className="fw-semibold">Category Name *</Form.Label>
                <Form.Control
                  id="category_name"
                  name="category_name"
                  type="text"
                  value={formData.category_name}
                  onChange={handleChange}
                  required
                  maxLength={100}
                  isInvalid={!!errors.category_name}
                  className="border-2"
                  placeholder="Enter category name"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.category_name}
                </Form.Control.Feedback>
                <Form.Text className="text-muted">
                  Name of the FAQ category (e.g., "General", "Shipping", "Returns")
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="sort_order" className="fw-semibold">Sort Order</Form.Label>
                <Form.Control
                  id="sort_order"
                  name="sort_order"
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                  min={0}
                  isInvalid={!!errors.sort_order}
                  className="border-2"
                  placeholder="0"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.sort_order}
                </Form.Control.Feedback>
                <Form.Text className="text-muted">
                  Lower numbers appear first
                </Form.Text>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="is_active" className="fw-semibold">Status</Form.Label>
                <Form.Select
                  id="is_active"
                  name="is_active"
                  value={formData.is_active ? 'true' : 'false'}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.value === 'true' }))}
                  className="border-2"
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </Form.Select>
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
            {category ? 'Update Category' : 'Create Category'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default FAQCategoryFormModal

