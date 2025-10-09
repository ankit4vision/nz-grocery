import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { Row, Col, Form, FormControl, FormSelect, FormCheck, Image } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImage } from '@fortawesome/free-solid-svg-icons'
import ImageUpload from '../../common/ImageUpload'

const ProductForm = forwardRef(({ mode = 'create', productData = null, onSubmit, onCancel }, ref) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    weight: '',
    category: '',
    subCategory: '',
    price: '',
    oldPrice: '',
    stock: '',
    sku: '',
    barcode: '',
    brand: '',
    unit: 'kg',
    tags: '',
    status: 'active',
    isActive: true,
    image: ''
  })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  // Categories and subcategories (mock data - replace with API call)
  const categories = [
    { id: 1, name: 'Fresh Produce', subCategories: [
      { id: 1, name: 'Fruits' },
      { id: 2, name: 'Vegetables' },
      { id: 3, name: 'Herbs & Spices' }
    ]},
    { id: 2, name: 'Dairy & Eggs', subCategories: [
      { id: 4, name: 'Milk & Cream' },
      { id: 5, name: 'Cheese' },
      { id: 6, name: 'Yogurt & Desserts' }
    ]},
    { id: 3, name: 'Meat & Seafood', subCategories: [
      { id: 7, name: 'Beef & Lamb' },
      { id: 8, name: 'Poultry' },
      { id: 9, name: 'Seafood' }
    ]},
    { id: 4, name: 'Pantry Essentials', subCategories: [
      { id: 10, name: 'Grains & Cereals' },
      { id: 11, name: 'Canned Goods' }
    ]},
    { id: 5, name: 'Beverages', subCategories: [
      { id: 12, name: 'Soft Drinks' },
      { id: 13, name: 'Juices & Smoothies' },
      { id: 14, name: 'Water & Hydration' }
    ]},
    { id: 6, name: 'Frozen Foods', subCategories: [
      { id: 15, name: 'Frozen Vegetables' },
      { id: 16, name: 'Frozen Meals' },
      { id: 17, name: 'Ice Cream & Desserts' }
    ]},
    { id: 7, name: 'Health & Wellness', subCategories: [
      { id: 18, name: 'Vitamins & Supplements' },
      { id: 19, name: 'Health Foods' }
    ]}
  ]

  const units = ['kg', 'g', 'L', 'ml', 'pack', 'bunch', 'piece', 'dozen']

  // Initialize form data when productData changes
  useEffect(() => {
    if (productData && mode === 'edit') {
      setFormData({
        name: productData.name || '',
        description: productData.description || '',
        weight: productData.weight || '',
        category: productData.category || '',
        subCategory: productData.subCategory || '',
        price: productData.price || '',
        oldPrice: productData.oldPrice || '',
        stock: productData.stock || '',
        sku: productData.sku || '',
        barcode: productData.barcode || '',
        brand: productData.brand || '',
        unit: productData.unit || 'kg',
        tags: productData.tags ? productData.tags.join(', ') : '',
        status: productData.status || 'active',
        isActive: productData.isActive !== undefined ? productData.isActive : true,
        image: productData.image || ''
      })
    }
  }, [productData, mode])

  // Expose form methods to parent
  useImperativeHandle(ref, () => ({
    handleSubmit: () => {
      handleSubmit()
    }
  }))

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleImageUpload = (imageUrl) => {
    setFormData(prev => ({
      ...prev,
      image: imageUrl
    }))
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required'
    }

    if (!formData.category) {
      newErrors.category = 'Category is required'
    }

    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'Valid price is required'
    }

    if (!formData.stock || formData.stock < 0) {
      newErrors.stock = 'Valid stock quantity is required'
    }

    if (!formData.sku.trim()) {
      newErrors.sku = 'SKU is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    if (e) e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    
    try {
      // Prepare form data
      const submitData = {
        ...formData,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
        oldPrice: formData.oldPrice ? parseFloat(formData.oldPrice) : null,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock)
      }

      await onSubmit(submitData)
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setLoading(false)
    }
  }

  const getSubCategories = () => {
    const selectedCategory = categories.find(cat => cat.name === formData.category)
    return selectedCategory ? selectedCategory.subCategories : []
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        {/* Product Information */}
        <Col xs={12}>
          <div className="mb-4">
            <div className="d-flex align-items-center mb-4 pb-3 border-bottom border-success border-2">
              <FontAwesomeIcon icon={faImage} className="me-3 text-success fs-4" />
              <h5 className="mb-0 text-success">Product Information</h5>
            </div>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="name" className="fw-semibold">Product Name *</Form.Label>
                  <Form.Control
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    isInvalid={!!errors.name}
                    className="border-2"
                    placeholder="Enter product name"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.name}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="sku" className="fw-semibold">SKU *</Form.Label>
                  <Form.Control
                    id="sku"
                    name="sku"
                    type="text"
                    value={formData.sku}
                    onChange={handleChange}
                    required
                    isInvalid={!!errors.sku}
                    className="border-2"
                    placeholder="Enter SKU"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.sku}
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
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    className="border-2"
                    placeholder="Enter product description"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="weight" className="fw-semibold">Weight/Size</Form.Label>
                  <Form.Control
                    id="weight"
                    name="weight"
                    type="text"
                    value={formData.weight}
                    onChange={handleChange}
                    className="border-2"
                    placeholder="e.g., 1 kg, 500g"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="unit" className="fw-semibold">Unit</Form.Label>
                  <FormSelect
                    id="unit"
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                    className="border-2"
                  >
                    {units.map(unit => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </FormSelect>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="barcode" className="fw-semibold">Barcode</Form.Label>
                  <Form.Control
                    id="barcode"
                    name="barcode"
                    type="text"
                    value={formData.barcode}
                    onChange={handleChange}
                    className="border-2"
                    placeholder="Enter barcode"
                  />
                </Form.Group>
              </Col>
            </Row>
          </div>
        </Col>

        {/* Category and Pricing */}
        <Col xs={12}>
          <div className="mb-4">
            <div className="d-flex align-items-center mb-4 pb-3 border-bottom border-success border-2">
              <FontAwesomeIcon icon={faImage} className="me-3 text-success fs-4" />
              <h5 className="mb-0 text-success">Category & Pricing</h5>
            </div>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="category" className="fw-semibold">Category *</Form.Label>
                  <FormSelect
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    isInvalid={!!errors.category}
                    className="border-2"
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.name}>{category.name}</option>
                    ))}
                  </FormSelect>
                  <Form.Control.Feedback type="invalid">
                    {errors.category}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="subCategory" className="fw-semibold">Sub Category</Form.Label>
                  <FormSelect
                    id="subCategory"
                    name="subCategory"
                    value={formData.subCategory}
                    onChange={handleChange}
                    className="border-2"
                    disabled={!formData.category}
                  >
                    <option value="">Select Sub Category</option>
                    {getSubCategories().map(subCategory => (
                      <option key={subCategory.id} value={subCategory.name}>{subCategory.name}</option>
                    ))}
                  </FormSelect>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="price" className="fw-semibold">Price *</Form.Label>
                  <Form.Control
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    isInvalid={!!errors.price}
                    className="border-2"
                    placeholder="0.00"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.price}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="oldPrice" className="fw-semibold">Old Price</Form.Label>
                  <Form.Control
                    id="oldPrice"
                    name="oldPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.oldPrice}
                    onChange={handleChange}
                    className="border-2"
                    placeholder="0.00"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="stock" className="fw-semibold">Stock Quantity *</Form.Label>
                  <Form.Control
                    id="stock"
                    name="stock"
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={handleChange}
                    required
                    isInvalid={!!errors.stock}
                    className="border-2"
                    placeholder="0"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.stock}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
          </div>
        </Col>

        {/* Brand and Tags */}
        <Col xs={12}>
          <div className="mb-4">
            <div className="d-flex align-items-center mb-4 pb-3 border-bottom border-success border-2">
              <FontAwesomeIcon icon={faImage} className="me-3 text-success fs-4" />
              <h5 className="mb-0 text-success">Brand & Tags</h5>
            </div>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="brand" className="fw-semibold">Brand</Form.Label>
                  <Form.Control
                    id="brand"
                    name="brand"
                    type="text"
                    value={formData.brand}
                    onChange={handleChange}
                    className="border-2"
                    placeholder="Enter brand name"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="tags" className="fw-semibold">Tags</Form.Label>
                  <Form.Control
                    id="tags"
                    name="tags"
                    type="text"
                    value={formData.tags}
                    onChange={handleChange}
                    className="border-2"
                    placeholder="Enter tags separated by commas"
                  />
                  <Form.Text className="text-muted">Separate tags with commas (e.g., organic, fresh, healthy)</Form.Text>
                </Form.Group>
              </Col>
            </Row>
          </div>
        </Col>

        {/* Product Image */}
        <Col xs={12}>
          <div className="mb-4">
            <div className="d-flex align-items-center mb-4 pb-3 border-bottom border-success border-2">
              <FontAwesomeIcon icon={faImage} className="me-3 text-success fs-4" />
              <h5 className="mb-0 text-success">Product Image</h5>
            </div>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Product Image</Form.Label>
                  <ImageUpload
                    onImageUpload={handleImageUpload}
                    currentImage={formData.image}
                    className="border-2"
                  />
                  <Form.Text className="text-muted">Upload a single product image</Form.Text>
                </Form.Group>
              </Col>
            </Row>
          </div>
        </Col>

        {/* Status */}
        <Col xs={12}>
          <div className="mb-4">
            <div className="d-flex align-items-center mb-4 pb-3 border-bottom border-success border-2">
              <FontAwesomeIcon icon={faImage} className="me-3 text-success fs-4" />
              <h5 className="mb-0 text-success">Status & Settings</h5>
            </div>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="status" className="fw-semibold">Status</Form.Label>
                  <FormSelect
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="border-2"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="out_of_stock">Out of Stock</option>
                  </FormSelect>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <FormCheck
                    id="isActive"
                    name="isActive"
                    type="checkbox"
                    label="Product is Active"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="mt-4"
                  />
                </Form.Group>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </Form>
  )
})

ProductForm.displayName = 'ProductForm'

export default ProductForm
