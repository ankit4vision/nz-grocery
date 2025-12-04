import React, { useState, useEffect } from 'react'
import { Modal, Form, Button, Row, Col } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTimes } from '@fortawesome/free-solid-svg-icons'
import ImageUpload from '../../common/ImageUpload'

const BannerFormModal = ({ show, onHide, banner, onSave }) => {
  const [formData, setFormData] = useState({
    banner_title: '',
    banner_description: '',
    banner_type: 'homepage',
    position: '',
    is_active: true,
    image: null,
    link_url: '',
    start_date: '',
    end_date: '',
    sort_order: 0,
    target_category_id: null,
    target_product_id: null
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (banner) {
      setFormData({
        banner_title: banner.banner_title || '',
        banner_description: banner.banner_description || '',
        banner_type: banner.banner_type || 'homepage',
        position: banner.position || '',
        is_active: banner.is_active !== undefined ? banner.is_active : true,
        image: banner.image_url || null,
        link_url: banner.link_url || '',
        start_date: banner.start_date ? (banner.start_date.includes('T') ? banner.start_date.slice(0, 19).replace('Z', '') : banner.start_date) : '',
        end_date: banner.end_date ? (banner.end_date.includes('T') ? banner.end_date.slice(0, 19).replace('Z', '') : banner.end_date) : '',
        sort_order: banner.sort_order || 0,
        target_category_id: banner.target_category_id || null,
        target_product_id: banner.target_product_id || null
      })
    } else {
      setFormData({
        banner_title: '',
        banner_description: '',
        banner_type: 'homepage',
        position: '',
        is_active: true,
        image: null,
        link_url: '',
        start_date: '',
        end_date: '',
        sort_order: 0,
        target_category_id: null,
        target_product_id: null
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

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.banner_title.trim()) {
      newErrors.banner_title = 'Banner title is required'
    }
    
    if (!formData.banner_type) {
      newErrors.banner_type = 'Banner type is required'
    }
    
    // Image is required for new banners, optional for updates
    if (!banner && !formData.image) {
      newErrors.image = 'Banner image is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (validateForm()) {
      // Prepare data according to API schema
      const submitData = {
        banner_title: formData.banner_title,
        banner_type: formData.banner_type,
        image: formData.image, // Will be converted to image_file in service
        banner_description: formData.banner_description || null,
        link_url: formData.link_url || null,
        position: formData.position || null,
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
        is_active: formData.is_active,
        sort_order: formData.sort_order || 0,
        target_category_id: formData.target_category_id || null,
        target_product_id: formData.target_product_id || null
      }
      
      onSave(submitData)
    }
  }

  const handleClose = () => {
    setFormData({
      banner_title: '',
      banner_description: '',
      banner_type: 'homepage',
      position: '',
      is_active: true,
      image: null,
      link_url: '',
      start_date: '',
      end_date: '',
      sort_order: 0,
      target_category_id: null,
      target_product_id: null
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
                <Form.Label htmlFor="banner_title" className="fw-semibold">Banner Title *</Form.Label>
                <Form.Control
                  id="banner_title"
                  name="banner_title"
                  type="text"
                  value={formData.banner_title}
                  onChange={handleChange}
                  required
                  maxLength={255}
                  isInvalid={!!errors.banner_title}
                  className="border-2"
                  placeholder="Enter banner title"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.banner_title}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="banner_type" className="fw-semibold">Banner Type *</Form.Label>
                <Form.Select
                  id="banner_type"
                  name="banner_type"
                  value={formData.banner_type}
                  onChange={handleChange}
                  required
                  isInvalid={!!errors.banner_type}
                  className="border-2"
                >
                  <option value="homepage">Homepage</option>
                  <option value="category">Category</option>
                  <option value="product">Product</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.banner_type}
                </Form.Control.Feedback>
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

          <Row>
            <Col xs={12}>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="banner_description" className="fw-semibold">Description</Form.Label>
                <Form.Control
                  id="banner_description"
                  name="banner_description"
                  as="textarea"
                  rows={3}
                  value={formData.banner_description}
                  onChange={handleChange}
                  className="border-2"
                  placeholder="Enter banner description (optional)"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col xs={12}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Banner Image {!banner && '*'}</Form.Label>
                <ImageUpload
                  value={formData.image}
                  onChange={(base64String) => setFormData(prev => ({ ...prev, image: base64String }))}
                  label="Upload Banner Image"
                  required={!banner}
                  error={errors.image}
                  allowDelete={!banner} // Hide delete button in edit mode
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
                <Form.Label htmlFor="link_url" className="fw-semibold">Link URL</Form.Label>
                <Form.Control
                  id="link_url"
                  name="link_url"
                  type="url"
                  value={formData.link_url}
                  onChange={handleChange}
                  maxLength={500}
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
                <Form.Label htmlFor="position" className="fw-semibold">Position</Form.Label>
                <Form.Control
                  id="position"
                  name="position"
                  type="text"
                  value={formData.position}
                  onChange={handleChange}
                  maxLength={255}
                  className="border-2"
                  placeholder="e.g., hero, sidebar, footer"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
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
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="start_date" className="fw-semibold">Start Date</Form.Label>
                <Form.Control
                  id="start_date"
                  name="start_date"
                  type="datetime-local"
                  value={formData.start_date}
                  onChange={handleChange}
                  className="border-2"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="end_date" className="fw-semibold">End Date</Form.Label>
                <Form.Control
                  id="end_date"
                  name="end_date"
                  type="datetime-local"
                  value={formData.end_date}
                  onChange={handleChange}
                  className="border-2"
                />
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
