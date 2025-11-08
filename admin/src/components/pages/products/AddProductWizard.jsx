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
  faCheckCircle,
  faSpinner
} from '@fortawesome/free-solid-svg-icons'
import { useNavigate, useParams } from 'react-router-dom'
import StepIndicator from '../../common/StepIndicator'
import BasicInfoStep from './steps/BasicInfoStep'
import AttributesStep from './steps/AttributesStep'
import VariantsStep from './steps/VariantsStep'
import ImageStep from './steps/ImageStep'
import ReviewStep from './steps/ReviewStep'
import { productService } from '../../../services/productService'
import { useToast } from '../../../components'

const AddProductWizard = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { success, error: showError } = useToast()
  
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
  const [savingStep, setSavingStep] = useState(false)
  const [errors, setErrors] = useState({})
  const [initialLoading, setInitialLoading] = useState(mode === 'edit')
  const [createdProductId, setCreatedProductId] = useState(productId) // Store product ID after creation

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
      const response = await productService.getProductFullDetails(productId)
      
      if (response.success && response.data) {
        const product = response.data.product || response.data
        
        setFormData({
          // Basic Info
          basicInfo: {
            name: product.product_name || '',
            category: product.category_id || '',
            profitMargin: product.margin || '',
            description: product.full_description || product.short_description || '',
            sku: product.sku || '',
            gstRate: product.gst || ''
          },
          // Attributes - Will be loaded from API in AttributesStep
          attributes: {
            attributeValues: {}
          },
          // Variants - Will be loaded from API in VariantsStep
          variants: {
            bulkPricing: response.data.bulk_pricing || [],
            productVariants: response.data.variants || []
          },
          // Images - Will be loaded from API in ImageStep
          images: {
            uploadedImages: response.data.images || [],
            primaryImageIndex: 0
          }
        })
      } else {
        showError(response.message || 'Failed to load product')
        navigate('/products')
      }
    } catch (err) {
      console.error('Error loading product for edit:', err)
      showError('Failed to load product. Please try again.')
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
        if (!formData.basicInfo.name || !formData.basicInfo.name.trim()) {
          newErrors.name = 'Product name is required'
        }
        if (!formData.basicInfo.category || formData.basicInfo.category === '') {
          newErrors.category = 'Category is required'
        }
        if (!formData.basicInfo.sku || !formData.basicInfo.sku.trim()) {
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

  // Save product on Step 1 (Basic Info) completion
  const saveBasicInfo = async () => {
    try {
      setSavingStep(true)
      const productData = {
        name: formData.basicInfo.name,
        sku: formData.basicInfo.sku,
        category_id: parseInt(formData.basicInfo.category),
        description: formData.basicInfo.description,
        profitMargin: formData.basicInfo.profitMargin,
        gstRate: formData.basicInfo.gstRate
      }

      const response = await productService.createProduct(productData)
      
      if (response.success) {
        const newProductId = response.data.product_id || response.data.id
        setCreatedProductId(newProductId)
        success('Product basic information saved successfully!')
        return newProductId
      } else {
        showError(response.message || 'Failed to save product')
        return null
      }
    } catch (err) {
      console.error('Error saving product:', err)
      showError('Failed to save product. Please try again.')
      return null
    } finally {
      setSavingStep(false)
    }
  }

  // Save attributes on Step 2 (Attributes) completion
  const saveAttributes = async () => {
    try {
      setSavingStep(true)
      const productIdToUse = createdProductId || productId
      
      if (!productIdToUse) {
        showError('Product ID is missing. Please go back to Step 1.')
        return false
      }

      // Prepare attributes for API
      // Convert attributeValues object to array format: [{ attribute_id, value }]
      const attributesToSave = Object.entries(formData.attributes.attributeValues || {})
        .filter(([_, value]) => {
          // Only include attributes with values (skip empty strings, but include false for booleans)
          return value !== '' && value !== null && value !== undefined
        })
        .map(([attributeId, value]) => ({
          attribute_id: parseInt(attributeId),
          value: value
        }))

      // Only save if there are attributes to save
      if (attributesToSave.length > 0) {
        const response = await productService.assignProductAttributes(productIdToUse, attributesToSave)
        
        if (response.success) {
          success('Product attributes saved successfully!')
          return true
        } else {
          showError(response.message || 'Failed to save attributes')
          return false
        }
      } else {
        // No attributes to save, just proceed
        return true
      }
    } catch (err) {
      console.error('Error saving attributes:', err)
      showError('Failed to save attributes. Please try again.')
      return false
    } finally {
      setSavingStep(false)
    }
  }

  // Navigation functions
  const handleNext = async () => {
    if (validateStep(currentStep)) {
      // On Step 1 (Basic Info), save product first
      if (currentStep === 0 && mode === 'create') {
        const savedProductId = await saveBasicInfo()
        if (savedProductId) {
          setCurrentStep(currentStep + 1)
        }
      } 
      // On Step 2 (Attributes), save attributes first
      else if (currentStep === 1) {
        const saved = await saveAttributes()
        if (saved) {
          if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1)
          }
        }
      } 
      // For other steps, just move to next step
      else {
        if (currentStep < steps.length - 1) {
          setCurrentStep(currentStep + 1)
        }
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
        // Attributes are already saved in Step 2, so no need to save again here
        // Only save attributes if we're in edit mode and they haven't been saved yet
        const finalProductId = response.data?.product_id || response.data?.id || createdProductId || productId
        
        // In edit mode, if attributes exist and haven't been saved in Step 2, save them now
        if (mode === 'edit' && finalProductId && formData.attributes.attributeValues && Object.keys(formData.attributes.attributeValues).length > 0) {
          const attributesToSave = Object.entries(formData.attributes.attributeValues)
            .filter(([_, value]) => value !== '' && value !== null && value !== undefined)
            .map(([attributeId, value]) => ({
              attribute_id: parseInt(attributeId),
              value: value
            }))
          
          if (attributesToSave.length > 0) {
            await productService.assignProductAttributes(finalProductId, attributesToSave)
          }
        }
        
        success(mode === 'edit' ? 'Product updated successfully!' : 'Product created successfully!')
        // Navigate to products list
        navigate('/products')
      } else {
        showError(response.message || `Failed to ${mode === 'edit' ? 'update' : 'create'} product`)
      }
    } catch (err) {
      console.error(`Error ${mode === 'edit' ? 'updating' : 'creating'} product:`, err)
      showError(`Failed to ${mode === 'edit' ? 'update' : 'create'} product. Please try again.`)
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
            productId={createdProductId || (mode === 'edit' ? productId : null)}
          />
        )
      case 2:
        return (
          <VariantsStep
            data={formData.variants}
            onChange={updateVariants}
            errors={errors}
            productId={createdProductId || (mode === 'edit' ? productId : null)}
          />
        )
      case 3:
        return (
          <ImageStep
            data={formData.images}
            onChange={updateImages}
            errors={errors}
            productId={createdProductId || (mode === 'edit' ? productId : null)}
          />
        )
      case 4:
        return (
          <ReviewStep
            formData={formData}
            onCreateProduct={handleCreateProduct}
            loading={loading}
            productId={createdProductId || (mode === 'edit' ? productId : null)}
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
    return 'Submit Product'
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
                  disabled={savingStep}
                  className="d-flex align-items-center text-white"
                >
                  {savingStep ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} spin className="me-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      Save & Next
                      <FontAwesomeIcon icon={faArrowRight} className="ms-2" />
                    </>
                  )}
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
