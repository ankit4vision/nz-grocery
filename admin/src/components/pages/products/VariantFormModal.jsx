import React, { useState, useRef, useEffect } from 'react'
import { Modal, Form, Button, Row, Col, Card, Badge } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faCloudUpload, 
  faTrash, 
  faImage,
  faSpinner,
  faStar,
  faPlus
} from '@fortawesome/free-solid-svg-icons'
import { productService } from '../../../services/productService'
import { useToast } from '../../../components'

const VariantFormModal = ({ show, onClose, onSave, variant = null, productId }) => {
  const { success, error: showError } = useToast()
  const fileInputRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [deletingImage, setDeletingImage] = useState({})
  const [dragOver, setDragOver] = useState(false)

  const [formData, setFormData] = useState({
    variant_name: '',
    variant_value: '',
    base_price: '',
    sale_price: '',
    stock_quantity: '',
    low_stock_quantity: '5',
    sku: '',
    is_active: true
  })

  const [images, setImages] = useState([]) // Array of { image_id?, url, is_primary, sort_order } or { file, preview } for new images
  const [originalImages, setOriginalImages] = useState([]) // Track original images to detect deletions
  const [imagesToDelete, setImagesToDelete] = useState([]) // Track image URLs to delete

  // Load variant data when editing
  useEffect(() => {
    if (variant) {
      setFormData({
        variant_name: variant.variant_name || variant.name || '',
        variant_value: variant.variant_value || variant.name || '',
        base_price: variant.base_price || variant.basePrice || '',
        sale_price: variant.sale_price || variant.salePrice || '',
        stock_quantity: variant.stock_quantity || variant.stock || '',
        low_stock_quantity: variant.low_stock_quantity || '5',
        sku: variant.sku || '',
        is_active: variant.is_active !== undefined ? variant.is_active : (variant.status === 'active')
      })
      
      // Load existing images
      if (variant.images && Array.isArray(variant.images)) {
        const loadedImages = variant.images.map((url, index) => ({
          url,
          is_primary: index === 0, // First image is primary by default
          sort_order: index,
          isNew: false
        }))
        setImages(loadedImages)
        setOriginalImages([...variant.images]) // Store original URLs for comparison
      } else {
        setImages([])
        setOriginalImages([])
      }
      setImagesToDelete([]) // Reset deletions when loading new variant
    } else {
      // Reset for new variant
      setFormData({
        variant_name: '',
        variant_value: '',
        base_price: '',
        sale_price: '',
        stock_quantity: '',
        low_stock_quantity: '5',
        sku: '',
        is_active: true
      })
      setImages([])
      setOriginalImages([])
      setImagesToDelete([])
    }
  }, [variant, show])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleFileSelect = async (files) => {
    const maxImages = 4
    const maxSize = 5 * 1024 * 1024 // 5MB
    const filesToAdd = []

    Array.from(files).forEach((file) => {
      if (images.length + filesToAdd.length >= maxImages) {
        showError(`Maximum ${maxImages} images allowed.`)
        return
      }

      if (file.size > maxSize) {
        showError(`File ${file.name} is too large. Maximum size is 5MB.`)
        return
      }

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        filesToAdd.push({
          file,
          preview: e.target.result,
          is_primary: images.length === 0 && filesToAdd.length === 0, // First image is primary
          sort_order: images.length + filesToAdd.length,
          isNew: true
        })
        
        if (filesToAdd.length === Array.from(files).length) {
          setImages(prev => [...prev, ...filesToAdd])
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      handleFileSelect(files)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setDragOver(false)
  }

  const removeImage = async (index) => {
    const image = images[index]
    
    // If it's a new image (not saved), just remove from state
    if (image.isNew) {
      const newImages = images.filter((_, i) => i !== index)
      // Adjust sort orders and primary flag
      newImages.forEach((img, idx) => {
        img.sort_order = idx
        if (idx === 0 && !img.is_primary) {
          img.is_primary = true
        }
      })
      setImages(newImages)
      return
    }

    // If it's an existing image, confirm deletion
    if (!window.confirm('Are you sure you want to delete this image?')) {
      return
    }

    try {
      setDeletingImage(prev => ({ ...prev, [index]: true }))
      
      // Track this image URL for deletion
      // We'll need to get image_id when saving, but for now track the URL
      const imageUrl = image.url
      setImagesToDelete(prev => [...prev, imageUrl])
      
      // Remove from current images list
      const newImages = images.filter((_, i) => i !== index)
      newImages.forEach((img, idx) => {
        img.sort_order = idx
        if (idx === 0 && !img.is_primary) {
          img.is_primary = true
        }
      })
      setImages(newImages)
      
      // Image will be deleted when saving the variant
      // Note: We need image_id to delete, which we'll try to extract from the URL
      // If extraction fails, the image may not be deleted (API limitation)
    } catch (err) {
      console.error('Error removing image:', err)
      showError('Failed to remove image')
    } finally {
      setDeletingImage(prev => ({ ...prev, [index]: false }))
    }
  }

  const setPrimaryImage = (index) => {
    const newImages = images.map((img, idx) => ({
      ...img,
      is_primary: idx === index
    }))
    setImages(newImages)
  }

  const handleSubmit = async () => {
    // Validation
    if (!formData.variant_name || !formData.variant_name.trim()) {
      showError('Variant name is required')
      return
    }
    if (!formData.base_price || parseFloat(formData.base_price) <= 0) {
      showError('Base price must be greater than 0')
      return
    }

    try {
      setLoading(true)

      // Prepare variant data
      const variantData = {
        variant_name: formData.variant_name.trim(),
        variant_value: formData.variant_value.trim() || formData.variant_name.trim(),
        base_price: parseFloat(formData.base_price),
        sale_price: formData.sale_price ? parseFloat(formData.sale_price) : null,
        stock_quantity: parseInt(formData.stock_quantity) || 0,
        low_stock_quantity: parseInt(formData.low_stock_quantity) || 5,
        sku: formData.sku.trim() || null,
        is_active: formData.is_active
      }

      // Separate new images (files) from existing images
      const newImageFiles = images.filter(img => img.isNew).map(img => img.file)
      const existingImages = images.filter(img => !img.isNew)

      if (variant && variant.variant_id) {
        // Update existing variant
        // First, delete images that were marked for deletion
        // Note: We need image_id to delete, but API only returns URLs
        // We'll need to fetch variant details or extract from URL
        // For now, we'll try to delete by attempting to extract image_id from URL
        // If that's not possible, we'll need to reload variant after save to get proper structure
        
        // Delete images that were removed
        // Note: The variants-with-images API only returns URLs, not image_ids
        // To delete, we need image_id. We'll try to extract it from URL or handle it differently
        if (imagesToDelete.length > 0) {
          setUploading(true)
          try {
            // Try to extract image_id from URL if it follows a pattern
            // Common S3 URL patterns might include image_id in the path
            // For now, we'll attempt deletion by trying common patterns
            const deletePromises = imagesToDelete.map(async (imageUrl) => {
              try {
                // Try to extract image_id from URL (e.g., if URL contains /images/{id}/ or similar)
                // This is a workaround - ideally the API should return image_ids
                const urlParts = imageUrl.split('/')
                const possibleId = urlParts[urlParts.length - 1]?.split('.')[0] // Get filename without extension
                
                // If we can't extract a valid ID, skip deletion for this image
                // The user will need to delete it manually or we need API support
                if (possibleId && !isNaN(possibleId)) {
                  const deleteResponse = await productService.deleteVariantImage(parseInt(possibleId))
                  if (!deleteResponse.success) {
                    console.warn(`Failed to delete image with possible ID ${possibleId}:`, deleteResponse.message)
                  }
                  return deleteResponse.success
                } else {
                  console.warn('Could not extract image_id from URL:', imageUrl)
                  return false
                }
              } catch (err) {
                console.error('Error deleting image:', err)
                return false
              }
            })
            
            const results = await Promise.all(deletePromises)
            const successCount = results.filter(r => r).length
            
            if (successCount < imagesToDelete.length) {
              showError(`Some images could not be deleted. You may need to refresh and delete them manually.`)
            } else if (successCount > 0) {
              success(`${successCount} image(s) deleted successfully!`)
            }
          } catch (err) {
            console.error('Error during image deletion:', err)
            showError('Some images could not be deleted. Please try again or delete them manually.')
          } finally {
            setUploading(false)
          }
        }

        // Update variant data
        const updateResponse = await productService.updateProductVariantWithImages(variant.variant_id, variantData)
        
        if (!updateResponse.success) {
          showError(updateResponse.message || 'Failed to update variant')
          return
        }

        // Then upload new images if any
        if (newImageFiles.length > 0) {
          const primaryFlags = images
            .filter(img => img.isNew)
            .map(img => img.is_primary)
          const sortOrders = images
            .filter(img => img.isNew)
            .map((img, idx) => existingImages.length + idx)

          setUploading(true)
          const uploadResponse = await productService.uploadVariantImages(
            variant.variant_id,
            newImageFiles,
            primaryFlags,
            sortOrders
          )

          if (!uploadResponse.success) {
            showError(uploadResponse.message || 'Failed to upload images')
            setUploading(false)
            return
          }
          setUploading(false)
        }
        
        // Reset deletion tracking after successful save
        setImagesToDelete([])

        success('Variant updated successfully!')
      } else {
        // Create new variant
        const primaryFlags = images.map(img => img.is_primary)
        const sortOrders = images.map((img, idx) => idx)

        const createResponse = await productService.createProductVariantWithImages(
          productId,
          variantData,
          newImageFiles,
          primaryFlags,
          sortOrders
        )

        if (!createResponse.success) {
          showError(createResponse.message || 'Failed to create variant')
          return
        }

        success('Variant created successfully!')
      }

      // Call onSave callback to refresh the list
      if (onSave) {
        await onSave()
      }
      
      // Close modal
      onClose()
    } catch (err) {
      console.error('Error saving variant:', err)
      showError('Failed to save variant. Please try again.')
    } finally {
      setLoading(false)
      setUploading(false)
    }
  }

  return (
    <Modal show={show} onHide={onClose} size="lg" backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>{variant ? 'Edit Variant' : 'Add Variant'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Variant Name <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="text"
                  value={formData.variant_name}
                  onChange={(e) => handleInputChange('variant_name', e.target.value)}
                  placeholder="e.g., Small, Medium, Large"
                  disabled={loading || uploading}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Variant Value</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.variant_value}
                  onChange={(e) => handleInputChange('variant_value', e.target.value)}
                  placeholder="Same as variant name if not specified"
                  disabled={loading || uploading}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>SKU</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.sku}
                  onChange={(e) => handleInputChange('sku', e.target.value)}
                  placeholder="Unique SKU"
                  disabled={loading || uploading}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select
                  value={formData.is_active ? 'active' : 'inactive'}
                  onChange={(e) => handleInputChange('is_active', e.target.value === 'active')}
                  disabled={loading || uploading}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Base Price <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.base_price}
                  onChange={(e) => handleInputChange('base_price', e.target.value)}
                  placeholder="0.00"
                  disabled={loading || uploading}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Sale Price</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.sale_price}
                  onChange={(e) => handleInputChange('sale_price', e.target.value)}
                  placeholder="0.00"
                  disabled={loading || uploading}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Stock Quantity</Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  value={formData.stock_quantity}
                  onChange={(e) => handleInputChange('stock_quantity', e.target.value)}
                  placeholder="0"
                  disabled={loading || uploading}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Low Stock Threshold</Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  value={formData.low_stock_quantity}
                  onChange={(e) => handleInputChange('low_stock_quantity', e.target.value)}
                  placeholder="5"
                  disabled={loading || uploading}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Images Section */}
          <div className="mb-3">
            <Form.Label>Variant Images</Form.Label>
            
            {/* Upload Area */}
            <div
              className={`upload-area border-2 border-dashed rounded-3 p-3 text-center mb-3 ${
                dragOver ? 'border-success bg-light' : 'border-secondary'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              style={{ 
                minHeight: '120px', 
                cursor: uploading || loading ? 'not-allowed' : 'pointer',
                opacity: uploading || loading ? 0.6 : 1
              }}
              onClick={() => !uploading && !loading && fileInputRef.current?.click()}
            >
              {uploading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin className="text-success mb-2" style={{ fontSize: '2rem' }} />
                  <p className="text-muted mb-0">Uploading images...</p>
                </>
              ) : (
                <>
                  <FontAwesomeIcon 
                    icon={faCloudUpload} 
                    className="text-muted mb-2" 
                    style={{ fontSize: '2rem' }}
                  />
                  <p className="text-muted mb-2">
                    Click to upload or drag and drop images here
                  </p>
                  <small className="text-muted">
                    Maximum 4 images, 5MB each
                  </small>
                </>
              )}
              
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    handleFileSelect(e.target.files)
                  }
                }}
                style={{ display: 'none' }}
                disabled={uploading || loading}
              />
            </div>

            {/* Image Preview Grid */}
            {images.length > 0 && (
              <Row>
                {images.map((image, index) => (
                  <Col md={3} key={index} className="mb-3">
                    <Card className="position-relative">
                      <Card.Img 
                        variant="top" 
                        src={image.preview || image.url} 
                        style={{ height: '100px', objectFit: 'cover' }}
                      />
                      
                      {/* Primary Badge */}
                      {image.is_primary && (
                        <Badge 
                          bg="primary" 
                          className="position-absolute top-0 end-0 m-1"
                        >
                          Primary
                        </Badge>
                      )}

                      {/* Star Icon for Primary */}
                      <div 
                        className="position-absolute bottom-0 start-0 m-1"
                        style={{ cursor: 'pointer' }}
                        onClick={() => setPrimaryImage(index)}
                      >
                        <FontAwesomeIcon 
                          icon={faStar} 
                          className={image.is_primary ? 'text-warning' : 'text-muted'}
                        />
                      </div>

                      {/* Delete Button */}
                      <Button
                        variant="danger"
                        size="sm"
                        className="position-absolute bottom-0 end-0 m-1"
                        onClick={(e) => {
                          e.stopPropagation()
                          removeImage(index)
                        }}
                        disabled={deletingImage[index] || uploading || loading}
                      >
                        {deletingImage[index] ? (
                          <FontAwesomeIcon icon={faSpinner} spin />
                        ) : (
                          <FontAwesomeIcon icon={faTrash} />
                        )}
                      </Button>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose} disabled={loading || uploading}>
          Cancel
        </Button>
        <Button 
          variant="success" 
          onClick={handleSubmit} 
          disabled={loading || uploading}
        >
          {loading || uploading ? (
            <>
              <FontAwesomeIcon icon={faSpinner} spin className="me-2" />
              {uploading ? 'Uploading...' : 'Saving...'}
            </>
          ) : (
            'Save Variant'
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default VariantFormModal

