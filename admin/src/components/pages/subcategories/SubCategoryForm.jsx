import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react'
import { CCol, CFormCheck } from '@coreui/react'
import { TextField, SelectField, FormRow } from '../../common/FormFields'

const SubCategoryForm = forwardRef(({
  mode = 'create',
  subCategoryData = null,
  categories = [],
  onSubmit,
  onCancel,
  loading = false 
}, ref) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categoryId: '',
    isActive: true
  })
  const [errors, setErrors] = useState({})

  // Load sub category data for edit mode
  useEffect(() => {
    if (mode === 'edit' && subCategoryData) {
      setFormData({
        name: subCategoryData.name || '',
        description: subCategoryData.description || '',
        categoryId: subCategoryData.categoryId || '',
        isActive: subCategoryData.isActive !== undefined ? subCategoryData.isActive : true
      })
    }
  }, [mode, subCategoryData])

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
      newErrors.name = 'Sub category name is required'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Sub category name must be at least 2 characters'
    }

    // Category validation
    if (!formData.categoryId) {
      newErrors.categoryId = 'Please select a parent category'
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
      categoryId: parseInt(formData.categoryId),
      isActive: formData.isActive
    }

    onSubmit(submitData)
  }

  // Expose handleSubmit to parent component via ref
  useImperativeHandle(ref, () => ({
    handleSubmit: handleSubmit
  }))

  // Prepare category options
  const categoryOptions = [
    { value: '', label: 'Select Category' },
    ...categories.map(category => ({
      value: category.id,
      label: category.name
    }))
  ]

  return (
    <div>
      <FormRow>
        <SelectField
          label="Parent Category"
          value={formData.categoryId}
          onChange={(e) => handleChange('categoryId', e.target.value)}
          options={categoryOptions}
          required
          col={12}
          invalid={!!errors.categoryId}
          feedback={errors.categoryId}
        />
      </FormRow>

      <FormRow>
        <TextField
          label="Sub Category Name"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="Enter sub category name"
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
          placeholder="Enter sub category description (optional)"
          type="textarea"
          rows={3}
          col={12}
          invalid={!!errors.description}
          feedback={errors.description}
        />
      </FormRow>

      <FormRow>
        <CCol md={12}>
          <div className="form-check mb-3">
            <CFormCheck
              id="isActive"
              label="Active"
              checked={formData.isActive}
              onChange={(e) => handleChange('isActive', e.target.checked)}
            />
          </div>
        </CCol>
      </FormRow>
    </div>
  )
})

SubCategoryForm.displayName = 'SubCategoryForm'

export default SubCategoryForm
