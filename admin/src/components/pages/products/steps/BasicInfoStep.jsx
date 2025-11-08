import React, { useState, useEffect } from 'react'
import { Row, Col, Form, FormControl, FormSelect } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { categoryService } from '../../../../services/categoryService'

const BasicInfoStep = ({ data, onChange, errors }) => {
  const [categories, setCategories] = useState([])
  const [loadingCategories, setLoadingCategories] = useState(true)

  // Fetch categories from API
  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true)
      const response = await categoryService.getCategoryOptions(true) // only_active = true
      if (response.success) {
        // API returns array of { category_id, category_name } objects
        setCategories(response.data || [])
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
      setCategories([])
    } finally {
      setLoadingCategories(false)
    }
  }

  const handleChange = (field, value) => {
    onChange({ [field]: value })
  }

  return (
    <Form>
      <Row>
        {/* Left Column */}
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="name" className="fw-semibold">Product Name</Form.Label>
            <FormControl
              id="name"
              type="text"
              value={data.name}
              onChange={(e) => handleChange('name', e.target.value)}
              isInvalid={!!errors.name}
              className="border-2"
              placeholder="Enter product name"
            />
            <Form.Control.Feedback type="invalid">
              {errors.name}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label htmlFor="category" className="fw-semibold">Category</Form.Label>
            {loadingCategories ? (
              <div className="d-flex align-items-center text-muted">
                <FontAwesomeIcon icon={faSpinner} spin className="me-2" />
                <span>Loading categories...</span>
              </div>
            ) : (
              <FormSelect
                id="category"
                value={data.category || ''}
                onChange={(e) => handleChange('category', e.target.value)}
                isInvalid={!!errors.category}
                className="border-2"
              >
                <option value="">Select category</option>
                {categories.map(category => (
                  <option key={category.category_id} value={category.category_id}>
                    {category.category_name}
                  </option>
                ))}
              </FormSelect>
            )}
            <Form.Control.Feedback type="invalid">
              {errors.category}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label htmlFor="profitMargin" className="fw-semibold">Profit Margin (%)</Form.Label>
            <FormControl
              id="profitMargin"
              type="number"
              value={data.profitMargin}
              onChange={(e) => handleChange('profitMargin', e.target.value)}
              className="border-2"
              placeholder="e.g., 25"
            />
            <Form.Text className="text-muted">
              Leave empty to use global default margin
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label htmlFor="description" className="fw-semibold">Description</Form.Label>
            <FormControl
              id="description"
              as="textarea"
              rows={4}
              value={data.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="border-2"
              placeholder="Enter detailed product description"
            />
          </Form.Group>
        </Col>

        {/* Right Column */}
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="sku" className="fw-semibold">SKU Code</Form.Label>
            <FormControl
              id="sku"
              type="text"
              value={data.sku}
              onChange={(e) => handleChange('sku', e.target.value)}
              isInvalid={!!errors.sku}
              className="border-2"
              placeholder="Enter unique SKU"
            />
            <Form.Control.Feedback type="invalid">
              {errors.sku}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label htmlFor="gstRate" className="fw-semibold">GST Rate (%)</Form.Label>
            <FormControl
              id="gstRate"
              type="number"
              value={data.gstRate}
              onChange={(e) => handleChange('gstRate', e.target.value)}
              className="border-2"
              placeholder="e.g., 15"
            />
            <Form.Text className="text-muted">
              Leave empty to use global default GST rate
            </Form.Text>
          </Form.Group>
        </Col>
      </Row>
    </Form>
  )
}

export default BasicInfoStep
