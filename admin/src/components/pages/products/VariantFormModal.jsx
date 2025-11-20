import React, { useState, useRef, useEffect } from 'react'
import { Modal, Form, Button, Row, Col, Card, Badge } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faCloudUpload, 
  faTrash, 
  faImage,
  faSpinner,
  faStar,
  faPlus,
  faArrowUp,
  faArrowDown
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

  const [images, setImages] = useState([]) // Array of { image_id?, image_url/url, is_primary, sort_order } or { file, preview } for new images
  const [originalImages, setOriginalImages] = useState([]) // Track original images with metadata to detect changes
  const [imagesToDelete, setImagesToDelete] = useState([]) // Track image_ids to delete

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
        // Handle both formats: array of URLs (legacy) or array of objects with image_id and image_url
        const loadedImages = variant.images.map((img, index) => {
          // If img is a string (URL), convert to object format
          if (typeof img === 'string') {
            return {
              image_id: null, // Will need to fetch or extract from URL
              image_url: img,
              url: img,
              is_primary: index === 0,
              sort_order: index,
              isNew: false
            }
          }
          // If img is an object with image_id and image_url
          return {
            image_id: img.image_id,
            image_url: img.image_url || img.url,
            url: img.image_url || img.url,
            is_primary: img.is_primary !== undefined ? img.is_primary : (index === 0),
            sort_order: img.sort_order !== undefined ? img.sort_order : index,
            isNew: false
          }
        })
        setImages(loadedImages)
        // Store original images with metadata for comparison
        setOriginalImages(loadedImages.map(img => ({
          image_id: img.image_id,
          image_url: img.image_url || img.url,
          is_primary: img.is_primary,
          sort_order: img.sort_order
        })))
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
    const fileArray = Array.from(files)
    const currentImageCount = images.length

    // Check total count first
    if (currentImageCount + fileArray.length > maxImages) {
      showError(`Maximum ${maxImages} images allowed. You can add ${maxImages - currentImageCount} more.`)
      return
    }

    // Validate file sizes
    const invalidFiles = fileArray.filter(file => file.size > maxSize)
    if (invalidFiles.length > 0) {
      showError(`Some files are too large. Maximum size is 5MB.`)
      return
    }

    // Process all files with Promise.all
    const filePromises = fileArray.map((file, index) => {
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          resolve({
            file,
            preview: e.target.result,
            is_primary: currentImageCount === 0 && index === 0, // First image is primary if no existing images
            sort_order: currentImageCount + index,
            isNew: true
          })
        }
        reader.onerror = () => {
          showError(`Failed to read file: ${file.name}`)
          resolve(null)
        }
        reader.readAsDataURL(file)
      })
    })

    try {
      const filesToAdd = await Promise.all(filePromises)
      const validFiles = filesToAdd.filter(f => f !== null)
      
      if (validFiles.length > 0) {
        setImages(prev => {
          const updated = [...prev, ...validFiles]
          // Ensure only first image is primary
          return updated.map((img, idx) => ({
            ...img,
            is_primary: idx === 0,
            sort_order: idx
          }))
        })
      }
    } catch (error) {
      console.error('Error processing files:', error)
      showError('Failed to process some images. Please try again.')
    }
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
      
      // Track image_id for deletion (if available)
      if (image.image_id) {
        setImagesToDelete(prev => [...prev, image.image_id])
      } else {
        // Fallback: if image_id is not available, we'll try to delete by URL pattern
        // This should not happen if API returns proper structure, but handle gracefully
        console.warn('Image ID not available for deletion, will attempt during save')
        setImagesToDelete(prev => [...prev, image.url || image.image_url])
      }
      
      // Remove from current images list
      const newImages = images.filter((_, i) => i !== index)
      newImages.forEach((img, idx) => {
        img.sort_order = idx
        if (idx === 0 && !img.is_primary) {
          img.is_primary = true
        }
      })
      setImages(newImages)
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
      is_primary: idx === index,
      sort_order: idx === index ? 0 : (idx < index ? idx + 1 : idx) // Reorder: primary becomes 0, others shift
    }))
    // Reorder: move primary to first position
    const primaryImage = newImages[index]
    const otherImages = newImages.filter((_, idx) => idx !== index)
    const reordered = [primaryImage, ...otherImages].map((img, idx) => ({
      ...img,
      sort_order: idx,
      is_primary: idx === 0
    }))
    setImages(reordered)
  }

  const moveImage = (index, direction) => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === images.length - 1)) {
      return // Can't move further
    }

    const newImages = [...images]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    const temp = newImages[index]
    newImages[index] = newImages[newIndex]
    newImages[newIndex] = temp

    // Update sort orders and primary flag
    const updated = newImages.map((img, idx) => ({
      ...img,
      sort_order: idx,
      is_primary: idx === 0
    }))
    setImages(updated)
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
        setUploading(true)
        
        // First, delete images that were marked for deletion (using image_id)
        if (imagesToDelete.length > 0) {
          try {
            const deletePromises = imagesToDelete.map(async (imageIdOrUrl) => {
              try {
                // If it's a number (image_id), use it directly
                // If it's a string (URL fallback), try to extract ID or skip
                if (typeof imageIdOrUrl === 'number' || (typeof imageIdOrUrl === 'string' && !isNaN(imageIdOrUrl))) {
                  const imageId = typeof imageIdOrUrl === 'number' ? imageIdOrUrl : parseInt(imageIdOrUrl)
                  const deleteResponse = await productService.deleteVariantImage(imageId)
                  if (!deleteResponse.success) {
                    console.warn(`Failed to delete image with ID ${imageId}:`, deleteResponse.message)
                  }
                  return deleteResponse.success
                } else {
                  // URL fallback - try to extract ID from URL (last resort)
                  console.warn('Image ID not available, attempting URL-based deletion:', imageIdOrUrl)
                  // Skip deletion if we can't get a valid ID
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
          }
        }

        // Update variant data
        const updateResponse = await productService.updateProductVariantWithImages(variant.variant_id, variantData)
        
        if (!updateResponse.success) {
          showError(updateResponse.message || 'Failed to update variant')
          setUploading(false)
          return
        }

        // Check if metadata (is_primary, sort_order) has changed for existing images
        const metadataChanged = existingImages.some((img, idx) => {
          const original = originalImages.find(orig => orig.image_id === img.image_id)
          if (!original) return false
          return (
            original.is_primary !== img.is_primary ||
            original.sort_order !== img.sort_order
          )
        })

        // Update image metadata if changed
        if (metadataChanged && existingImages.length > 0) {
          try {
            const imagesMeta = existingImages
              .filter(img => img.image_id) // Only include images with image_id
              .map(img => ({
                image_id: img.image_id,
                is_primary: img.is_primary,
                sort_order: img.sort_order
              }))

            if (imagesMeta.length > 0) {
              const metaResponse = await productService.updateVariantImageMeta(
                variant.variant_id,
                imagesMeta
              )

              if (!metaResponse.success) {
                console.warn('Failed to update image metadata:', metaResponse.message)
                // Don't fail the whole operation, just warn
              }
            }
          } catch (err) {
            console.error('Error updating image metadata:', err)
            // Don't fail the whole operation, just log the error
          }
        }

        // Then upload new images if any
        if (newImageFiles.length > 0) {
          const primaryFlags = images
            .filter(img => img.isNew)
            .map(img => img.is_primary)
          const sortOrders = images
            .filter(img => img.isNew)
            .map((img, idx) => existingImages.length + idx)

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
        }
        
        setUploading(false)
        
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
                    // Reset input to allow selecting same file again
                    e.target.value = ''
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
                        src={image.preview || image.url || image.image_url} 
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
                        title="Set as primary image"
                      >
                        <FontAwesomeIcon 
                          icon={faStar} 
                          className={image.is_primary ? 'text-warning' : 'text-muted'}
                          size="sm"
                        />
                      </div>

                      {/* Sort/Reorder Buttons */}
                      <div className="position-absolute top-0 start-0 m-1 d-flex flex-column gap-1">
                        <Button
                          variant="light"
                          size="sm"
                          className="p-1"
                          style={{ 
                            width: '24px', 
                            height: '24px', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            opacity: index === 0 ? 0.5 : 1
                          }}
                          onClick={(e) => {
                            e.stopPropagation()
                            moveImage(index, 'up')
                          }}
                          disabled={index === 0 || uploading || loading}
                          title="Move up"
                        >
                          <FontAwesomeIcon icon={faArrowUp} size="xs" />
                        </Button>
                        <Button
                          variant="light"
                          size="sm"
                          className="p-1"
                          style={{ 
                            width: '24px', 
                            height: '24px', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            opacity: index === images.length - 1 ? 0.5 : 1
                          }}
                          onClick={(e) => {
                            e.stopPropagation()
                            moveImage(index, 'down')
                          }}
                          disabled={index === images.length - 1 || uploading || loading}
                          title="Move down"
                        >
                          <FontAwesomeIcon icon={faArrowDown} size="xs" />
                        </Button>
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
                        title="Delete image"
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

