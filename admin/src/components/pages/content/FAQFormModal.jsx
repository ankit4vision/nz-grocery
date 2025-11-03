import React, { useState, useEffect } from 'react'
import { Modal, Form, Button, Row, Col } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTimes, faEye } from '@fortawesome/free-solid-svg-icons'
import { faqCategoryService } from '../../../services/contentService'

const FAQFormModal = ({ show, onHide, faq, onSave }) => {
  const [formData, setFormData] = useState({
    category_id: '',
    question: '',
    answer: '',
    sort_order: 0,
    is_active: true
  })
  const [categories, setCategories] = useState([])
  const [loadingCategories, setLoadingCategories] = useState(false)
  const [errors, setErrors] = useState({})

  // Load FAQ categories when modal opens
  useEffect(() => {
    if (show) {
      loadCategories()
    }
  }, [show])

  useEffect(() => {
    if (faq) {
      setFormData({
        category_id: faq.category_id || '',
        question: faq.question || '',
        answer: faq.answer || '',
        sort_order: faq.sort_order || 0,
        is_active: faq.is_active !== undefined ? faq.is_active : true
      })
    } else {
      setFormData({
        category_id: '',
        question: '',
        answer: '',
        sort_order: 0,
        is_active: true
      })
    }
    setErrors({})
  }, [faq, show])

  const loadCategories = async () => {
    setLoadingCategories(true)
    try {
      const response = await faqCategoryService.getCategories({ is_active: true })
      if (response.success) {
        setCategories(Array.isArray(response.data) ? response.data : [])
      }
    } catch (error) {
      console.error('Error loading FAQ categories:', error)
    } finally {
      setLoadingCategories(false)
    }
  }

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
    
    if (!formData.category_id) {
      newErrors.category_id = 'Category is required'
    }
    
    if (!formData.question.trim()) {
      newErrors.question = 'Question is required'
    }
    
    if (!formData.answer.trim()) {
      newErrors.answer = 'Answer is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (validateForm()) {
      // Prepare data according to API schema
      const submitData = {
        category_id: parseInt(formData.category_id),
        question: formData.question.trim(),
        answer: formData.answer.trim(),
        sort_order: formData.sort_order || 0,
        is_active: formData.is_active
      }
      
      onSave(submitData)
    }
  }

  const handleClose = () => {
    setFormData({
      category_id: '',
      question: '',
      answer: '',
      sort_order: 0,
      is_active: true
    })
    setErrors({})
    onHide()
  }

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {faq ? 'Edit FAQ' : 'Add New FAQ'}
        </Modal.Title>
      </Modal.Header>
      
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-4">
                <Form.Label htmlFor="category_id" className="fw-semibold">Category *</Form.Label>
                <Form.Select
                  id="category_id"
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  required
                  disabled={loadingCategories}
                  isInvalid={!!errors.category_id}
                  className="border-2"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.category_id} value={category.category_id}>
                      {category.category_name}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.category_id}
                </Form.Control.Feedback>
                <Form.Text className="text-muted">
                  Select the FAQ category for this entry
                </Form.Text>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-4">
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

          <Form.Group className="mb-4">
            <Form.Label htmlFor="question" className="fw-semibold">Question *</Form.Label>
            <Form.Control
              id="question"
              name="question"
              type="text"
              value={formData.question}
              onChange={handleChange}
              required
              isInvalid={!!errors.question}
              className="border-2"
              placeholder="Enter the frequently asked question"
            />
            <Form.Control.Feedback type="invalid">
              {errors.question}
            </Form.Control.Feedback>
            <Form.Text className="text-muted">
              Be specific and clear about what the customer is asking
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label htmlFor="answer" className="fw-semibold">Answer *</Form.Label>
            <Form.Control
              id="answer"
              name="answer"
              as="textarea"
              rows={6}
              value={formData.answer}
              onChange={handleChange}
              required
              isInvalid={!!errors.answer}
              className="border-2"
              placeholder="Provide a detailed and helpful answer"
            />
            <Form.Control.Feedback type="invalid">
              {errors.answer}
            </Form.Control.Feedback>
            <Form.Text className="text-muted">
              Provide a comprehensive answer that addresses the customer's question
            </Form.Text>
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-4">
                <Form.Label htmlFor="sort_order" className="fw-semibold">Sort Order</Form.Label>
                <Form.Control
                  id="sort_order"
                  name="sort_order"
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                  className="border-2"
                  placeholder="0"
                />
                <Form.Text className="text-muted">
                  Lower numbers appear first
                </Form.Text>
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
              <strong>Q:</strong> {formData.question || 'Your question will appear here...'}
            </div>
            <div>
              <strong>A:</strong> {formData.answer || 'Your answer will appear here...'}
            </div>
          </div>
        </Modal.Body>
        
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            <FontAwesomeIcon icon={faTimes} className="me-2" />
            Cancel
          </Button>
          <Button variant="success" type="submit" className="text-white">
            <FontAwesomeIcon icon={faSave} className="me-2" />
            {faq ? 'Update FAQ' : 'Create FAQ'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default FAQFormModal
