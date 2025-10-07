import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react'
import { Col, FormCheck } from 'react-bootstrap'
import { TextField, FormRow } from '../../common/FormFields'

const CategoryForm = forwardRef(({
  mode = 'create',
  categoryData = null,
  onSubmit,
  onCancel,
  loading = false 
}, ref) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isActive: true
  })
  const [errors, setErrors] = useState({})

  // Load category data for edit mode
  useEffect(() => {
    if (mode === 'edit' && categoryData) {
      setFormData({
        name: categoryData.name || '',
        description: categoryData.description || '',
        isActive: categoryData.isActive !== undefined ? categoryData.isActive : true
      })
    }
  }, [mode, categoryData])

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Category name must be at least 2 characters'
    }

    // Description validation (optional but if provided, should be meaningful)
    if (formData.description && formData.description.trim().length < 5) {
      newErrors.description = 'Description must be at least 5 characters if provided'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validateForm()) {
      return
    }

    const submitData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      isActive: formData.isActive
    }

    onSubmit(submitData)
  }

  // Expose handleSubmit to parent component via ref
  useImperativeHandle(ref, () => ({
    handleSubmit: handleSubmit
  }))

  return (
    <div>
      <FormRow>
        <TextField
          label="Category Name"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="Enter category name"
          required
          col={12}
          invalid={!!errors.name}
          feedback={errors.name}
        />
      </FormRow>

      <FormRow>
        <TextField
          label="Description"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Enter category description (optional)"
          type="textarea"
          rows={3}
          col={12}
          invalid={!!errors.description}
          feedback={errors.description}
        />
      </FormRow>

      <FormRow>
        <Col md={12}>
          <div className="form-check mb-3">
            <FormCheck
              id="isActive"
              label="Active"
              checked={formData.isActive}
              onChange={(e) => handleChange('isActive', e.target.checked)}
            />
          </div>
        </Col>
      </FormRow>
    </div>
  )
})

CategoryForm.displayName = 'CategoryForm'

export default CategoryForm
