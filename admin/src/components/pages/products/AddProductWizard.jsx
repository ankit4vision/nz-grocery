import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Button, Card } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faArrowLeft, 
  faArrowRight, 
  faInfoCircle,
  faTag,
  faLayerGroup,
  faImage,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons'
import { useNavigate, useParams } from 'react-router-dom'
import StepIndicator from '../../common/StepIndicator'
import BasicInfoStep from './steps/BasicInfoStep'
import AttributesStep from './steps/AttributesStep'
import VariantsStep from './steps/VariantsStep'
import ImageStep from './steps/ImageStep'
import ReviewStep from './steps/ReviewStep'
import { productService } from '../../../services/productService'
import productsData from '../../../mock/products.json'

const AddProductWizard = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  
  // Determine mode based on URL params
  const mode = id ? 'edit' : 'create'
  const productId = id ? parseInt(id) : null
  
  // Step configuration
  const steps = [
    { number: '1', title: 'Basic Info' },
    { number: '2', title: 'Attributes' },
    { number: '3', title: 'Variants' },
    { number: '4', title: 'Image' },
    { number: '5', title: 'Review' }
  ]

  // Current step state
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [initialLoading, setInitialLoading] = useState(mode === 'edit')

  // Form data state - organized by steps
  const [formData, setFormData] = useState({
    // Basic Info
    basicInfo: {
      name: '',
      category: '',
      profitMargin: '',
      description: '',
      sku: '',
      gstRate: ''
    },
    // Attributes
    attributes: {
      attributeValues: {} // Object with attribute_id as key and value as value
    },
    // Variants
    variants: {
      bulkPricing: [],
      productVariants: [
        {
          id: 1,
          name: '',
          sku: '',
          basePrice: '',
          salePrice: '',
          stock: '',
          status: 'active'
        }
      ]
    },
    // Images
    images: {
      uploadedImages: [],
      primaryImageIndex: 0
    }
  })

  // Load existing product data for edit mode
  useEffect(() => {
    if (mode === 'edit' && productId) {
      loadProductForEdit()
    }
  }, [mode, productId])

  const loadProductForEdit = async () => {
    try {
      setInitialLoading(true)
      // For now, use mock data - replace with API call
      const existingProduct = productsData.find(p => p.id === productId)
      
      if (existingProduct) {
        setFormData({
          // Basic Info
          basicInfo: {
            name: existingProduct.name || '',
            category: existingProduct.category || '',
            profitMargin: '', // Not in current data structure
            description: existingProduct.description || '',
            sku: existingProduct.sku || '',
            gstRate: '' // Not in current data structure
          },
          // Attributes - Load from API if product exists
          attributes: {
            attributeValues: {} // Will be loaded from API in AttributesStep
          },
          // Variants
          variants: existingProduct.variants || {
            bulkPricing: [],
            productVariants: [
              {
                id: 1,
                name: '',
                sku: '',
                basePrice: existingProduct.price || '',
                salePrice: existingProduct.oldPrice || '',
                stock: existingProduct.stock || '',
                status: 'active'
              }
            ]
          },
          // Images
          images: existingProduct.images || {
            uploadedImages: [],
            primaryImageIndex: 0
          }
        })
      } else {
        console.error('Product not found for editing')
        navigate('/products')
      }
    } catch (error) {
      console.error('Error loading product for edit:', error)
      navigate('/products')
    } finally {
      setInitialLoading(false)
    }
  }

  // Step validation functions
  const validateStep = (stepIndex) => {
    const newErrors = {}
    
    switch (stepIndex) {
      case 0: // Basic Info
        if (!formData.basicInfo.name.trim()) {
          newErrors.name = 'Product name is required'
        }
        if (!formData.basicInfo.category) {
          newErrors.category = 'Category is required'
        }
        if (!formData.basicInfo.sku.trim()) {
          newErrors.sku = 'SKU is required'
        }
        break
      case 1: // Attributes - Validate required attributes
        // Note: Required validation will be handled by the AttributesStep component
        // based on is_required flag from API
        break
      case 2: // Variants
        const hasValidVariant = formData.variants.productVariants.some(variant => 
          variant.name.trim() && variant.sku.trim()
        )
        if (!hasValidVariant) {
          newErrors.variants = 'At least one valid variant is required'
        }
        break
      case 3: // Images - At least one image required
        if (formData.images.uploadedImages.length === 0) {
          newErrors.images = 'At least one product image is required'
        }
        break
      case 4: // Review - No validation needed
        break
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Navigation functions
  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1)
      }
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleStepClick = (stepIndex) => {
    // Allow navigation to completed steps or next step
    if (stepIndex <= currentStep || stepIndex === currentStep + 1) {
      if (stepIndex < currentStep) {
        setCurrentStep(stepIndex)
      } else if (stepIndex === currentStep + 1 && validateStep(currentStep)) {
        setCurrentStep(stepIndex)
      }
    }
  }

  // Form data update functions
  const updateBasicInfo = (data) => {
    setFormData(prev => ({
      ...prev,
      basicInfo: { ...prev.basicInfo, ...data }
    }))
  }

  const updateAttributes = (data) => {
    setFormData(prev => ({
      ...prev,
      attributes: { ...prev.attributes, ...data }
    }))
  }

  const updateVariants = (data) => {
    setFormData(prev => ({
      ...prev,
      variants: { ...prev.variants, ...data }
    }))
  }

  const updateImages = (data) => {
    setFormData(prev => ({
      ...prev,
      images: { ...prev.images, ...data }
    }))
  }


  // Create/Update product function
  const handleCreateProduct = async () => {
    setLoading(true)
    try {
      // Prepare final product data
      const productData = {
        name: formData.basicInfo.name,
        description: formData.basicInfo.description,
        category: formData.basicInfo.category,
        sku: formData.basicInfo.sku,
        price: formData.variants.productVariants[0]?.basePrice || 0,
        stock: formData.variants.productVariants[0]?.stock || 0,
        image: formData.images.uploadedImages[formData.images.primaryImageIndex]?.url || '',
        status: 'active',
        isActive: true,
        // Additional fields from other steps
        attributes: formData.attributes,
        variants: formData.variants,
        images: formData.images
      }
      
      // Create or update product
      let response
      if (mode === 'edit') {
        response = await productService.updateProduct(productId, productData)
      } else {
        response = await productService.createProduct(productData)
      }
      
      if (response.success) {
        // After product is created/updated, assign attributes if any
        const createdProductId = response.data?.id || productId
        if (createdProductId && formData.attributes.attributeValues && Object.keys(formData.attributes.attributeValues).length > 0) {
          // Prepare attributes for API (format: [{ attribute_id, value }])
          const attributesToAssign = Object.entries(formData.attributes.attributeValues).map(([attributeId, value]) => ({
            attribute_id: parseInt(attributeId),
            value: value
          }))
          
          await productService.assignProductAttributes(createdProductId, { attributes: attributesToAssign })
        }
        
        // Navigate to products list or show success message
        navigate('/products')
      }
    } catch (error) {
      console.error(`Error ${mode === 'edit' ? 'updating' : 'creating'} product:`, error)
    } finally {
      setLoading(false)
    }
  }

  // Render current step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <BasicInfoStep
            data={formData.basicInfo}
            onChange={updateBasicInfo}
            errors={errors}
          />
        )
      case 1:
        return (
          <AttributesStep
            data={formData.attributes}
            onChange={updateAttributes}
            errors={errors}
            productId={mode === 'edit' ? productId : null}
          />
        )
      case 2:
        return (
          <VariantsStep
            data={formData.variants}
            onChange={updateVariants}
            errors={errors}
          />
        )
      case 3:
        return (
          <ImageStep
            data={formData.images}
            onChange={updateImages}
            errors={errors}
          />
        )
      case 4:
        return (
          <ReviewStep
            formData={formData}
            onCreateProduct={handleCreateProduct}
            loading={loading}
          />
        )
      default:
        return null
    }
  }

  // Get step icon
  const getStepIcon = () => {
    const icons = [faInfoCircle, faTag, faLayerGroup, faImage, faCheckCircle]
    return icons[currentStep]
  }

  // Get step title
  const getStepTitle = () => {
    const titles = [
      'Basic Information',
      'Product Attributes', 
      'Product Variants',
      'Product Images',
      mode === 'edit' ? 'Review Product Changes' : 'Review Product Information'
    ]
    return titles[currentStep]
  }

  // Get page title
  const getPageTitle = () => {
    return mode === 'edit' ? 'Edit Product' : 'Add New Product'
  }

  // Get page description
  const getPageDescription = () => {
    return mode === 'edit' ? 'Update product information' : 'Create a new product for your store'
  }

  // Get submit button text
  const getSubmitButtonText = () => {
    return mode === 'edit' ? 'Update Product' : 'Create Product'
  }

  // Show loading state while loading product data for edit
  if (initialLoading) {
    return (
      <Container fluid className="py-4">
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading product data...</p>
        </div>
      </Container>
    )
  }

  return (
    <Container fluid className="py-4">
      <Row>
        <Col xs={12}>
          {/* Header */}
          <div className="d-flex align-items-center justify-content-between mb-4">
            <div>
              <h2 className="mb-1 text-dark">{getPageTitle()}</h2>
              <p className="text-muted mb-0">{getPageDescription()}</p>
            </div>
            <Button 
              variant="outline-secondary" 
              onClick={() => navigate('/products')}
              className="d-flex align-items-center"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
              Back to Products
            </Button>
          </div>

          {/* Step Indicator */}
          <StepIndicator
            steps={steps}
            currentStep={currentStep}
            onStepClick={handleStepClick}
          />

          {/* Main Content */}
          <Card className="shadow-sm">
            <Card.Body className="p-4">
              {/* Step Header */}
              <div className="d-flex align-items-center mb-4 pb-3 border-bottom border-success border-2">
                <FontAwesomeIcon icon={getStepIcon()} className="me-3 text-success fs-4" />
                <h4 className="mb-0 text-success">{getStepTitle()}</h4>
              </div>

              {/* Step Content */}
              {renderStepContent()}
            </Card.Body>
          </Card>

          {/* Navigation Buttons */}
          <div className="d-flex justify-content-between align-items-center mt-4">
            <div>
              {currentStep > 0 && (
                <Button 
                  variant="outline-secondary" 
                  onClick={handlePrevious}
                  className="d-flex align-items-center"
                >
                  <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                  Previous
                </Button>
              )}
            </div>
            
            <div className="d-flex gap-2">
              {currentStep < steps.length - 1 ? (
                <Button 
                  variant="success" 
                  onClick={handleNext}
                  className="d-flex align-items-center text-white"
                >
                  Save & Next
                  <FontAwesomeIcon icon={faArrowRight} className="ms-2" />
                </Button>
              ) : (
                <Button 
                  variant="success" 
                  onClick={handleCreateProduct}
                  disabled={loading}
                  className="d-flex align-items-center text-white"
                >
                  <FontAwesomeIcon icon={faCheckCircle} className="me-2" />
                  {getSubmitButtonText()}
                </Button>
              )}
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  )
}

export default AddProductWizard
