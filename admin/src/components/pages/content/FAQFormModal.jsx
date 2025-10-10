import React, { useState, useEffect } from 'react'
import { Modal, Form, Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTimes, faEye } from '@fortawesome/free-solid-svg-icons'

const FAQFormModal = ({ show, onHide, faq, onSave }) => {
  const [formData, setFormData] = useState({
    question: '',
    answer: ''
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (faq) {
      setFormData({
        question: faq.question || '',
        answer: faq.answer || ''
      })
    } else {
      setFormData({
        question: '',
        answer: ''
      })
    }
    setErrors({})
  }, [faq, show])

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
      onSave({
        ...formData,
        id: faq?.id || Date.now(),
        createdDate: faq?.createdDate || new Date().toISOString().split('T')[0],
        updatedDate: new Date().toISOString().split('T')[0]
      })
    }
  }

  const handleClose = () => {
    setFormData({
      question: '',
      answer: ''
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
