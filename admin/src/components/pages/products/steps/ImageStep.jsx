import React, { useState, useEffect, useRef } from 'react'
import { Row, Col, Button, Card, Badge } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faCloudUpload, 
  faPlus, 
  faStar, 
  faArrowUp, 
  faArrowDown, 
  faTrash,
  faImage,
  faSpinner
} from '@fortawesome/free-solid-svg-icons'
import { productService } from '../../../../services/productService'
import { useToast } from '../../../../components'

const ImageStep = ({ data, onChange, errors, productId }) => {
  const { success, error: showError } = useToast()
  const fileInputRef = useRef(null)
  const [dragOver, setDragOver] = useState(false)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [savingMeta, setSavingMeta] = useState(false)
  const [deletingImage, setDeletingImage] = useState({})

  // Load images from API on mount
  useEffect(() => {
    if (productId) {
      loadImages()
    }
  }, [productId])

  const loadImages = async () => {
    try {
      setLoading(true)
      const response = await productService.getProductImages(productId)
      if (response.success && response.data) {
        // Map API response to component format
        const mappedImages = response.data.map((img, index) => ({
          image_id: img.image_id,
          id: img.image_id, // For compatibility
          url: img.image_url,
          name: img.image_alt_text || `Image ${index + 1}`,
          is_primary: img.is_primary,
          sort_order: img.sort_order || index,
          isNew: false // Existing image from API
        }))

        // Sort by sort_order
        mappedImages.sort((a, b) => a.sort_order - b.sort_order)

        // Find primary image index
        const primaryIndex = mappedImages.findIndex(img => img.is_primary) || 0

        setLoading(false)
        onChange({ 
          uploadedImages: mappedImages,
          primaryImageIndex: primaryIndex >= 0 ? primaryIndex : 0
        })
      }
    } catch (error) {
      console.error('Error loading images:', error)
      setLoading(false)
    }
  }

  const handleFileSelect = async (files) => {
    if (!productId) {
      showError('Please complete Step 1 (Basic Info) first to create the product.')
      return
    }

    const maxImages = 4
    const maxSize = 5 * 1024 * 1024 // 5MB
    const currentImages = data.uploadedImages || []
    const filesToUpload = []

    Array.from(files).forEach((file, index) => {
      if (currentImages.length + filesToUpload.length >= maxImages) {
        showError(`Maximum ${maxImages} images allowed.`)
        return
      }

      if (file.size > maxSize) {
        showError(`File ${file.name} is too large. Maximum size is 5MB.`)
        return
      }

      filesToUpload.push(file)
    })

    if (filesToUpload.length === 0) {
      return
    }

    try {
      setUploading(true)
      
      // Prepare primary flags and sort orders
      const currentCount = currentImages.length
      const primaryFlags = filesToUpload.map((_, index) => index === 0 && currentCount === 0)
      const sortOrders = filesToUpload.map((_, index) => currentCount + index)

      const response = await productService.uploadProductImages(
        productId,
        filesToUpload,
        primaryFlags,
        sortOrders
      )

      if (response.success) {
        success(`${filesToUpload.length} image(s) uploaded successfully!`)
        // Reload images from API to get the new image IDs and URLs
        await loadImages()
      } else {
        showError(response.message || 'Failed to upload images')
      }
    } catch (err) {
      console.error('Error uploading images:', err)
      showError('Failed to upload images. Please try again.')
    } finally {
      setUploading(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const files = e.dataTransfer.files
    handleFileSelect(files)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleFileInputChange = (e) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files)
    }
  }

  const removeImage = async (imageId) => {
    if (!productId) {
      // If no productId, just remove from local state (new unsaved image)
      const updatedImages = data.uploadedImages.filter(img => img.id !== imageId)
      let newPrimaryIndex = data.primaryImageIndex

      if (data.primaryImageIndex >= updatedImages.length) {
        newPrimaryIndex = Math.max(0, updatedImages.length - 1)
      }

      onChange({ 
        uploadedImages: updatedImages,
        primaryImageIndex: newPrimaryIndex
      })
      return
    }

    const image = data.uploadedImages.find(img => img.id === imageId)
    if (!image || image.isNew) {
      // New image not saved yet, just remove from local state
      const updatedImages = data.uploadedImages.filter(img => img.id !== imageId)
      let newPrimaryIndex = data.primaryImageIndex

      if (data.primaryImageIndex >= updatedImages.length) {
        newPrimaryIndex = Math.max(0, updatedImages.length - 1)
      }

      onChange({ 
        uploadedImages: updatedImages,
        primaryImageIndex: newPrimaryIndex
      })
      return
    }

    if (!window.confirm('Are you sure you want to delete this image?')) {
      return
    }

    try {
      setDeletingImage(prev => ({ ...prev, [imageId]: true }))
      const response = await productService.deleteProductImages(productId, [image.image_id])
      
      if (response.success) {
        success('Image deleted successfully!')
        // Reload images from API
        await loadImages()
      } else {
        showError(response.message || 'Failed to delete image')
      }
    } catch (err) {
      console.error('Error deleting image:', err)
      showError('Failed to delete image. Please try again.')
    } finally {
      setDeletingImage(prev => ({ ...prev, [imageId]: false }))
    }
  }

  const setPrimaryImage = async (index) => {
    if (!productId) {
      // If no productId, just update local state
      onChange({ 
        uploadedImages: data.uploadedImages,
        primaryImageIndex: index
      })
      return
    }

    try {
      setSavingMeta(true)
      
      // Prepare metadata for all images
      const imagesMeta = data.uploadedImages.map((img, idx) => ({
        image_id: img.image_id || img.id,
        is_primary: idx === index,
        sort_order: img.sort_order !== undefined ? img.sort_order : idx
      }))

      const response = await productService.updateProductImagesMeta(productId, imagesMeta)
      
      if (response.success) {
        onChange({ 
          uploadedImages: data.uploadedImages,
          primaryImageIndex: index
        })
        success('Primary image updated successfully!')
      } else {
        showError(response.message || 'Failed to update primary image')
      }
    } catch (err) {
      console.error('Error updating primary image:', err)
      showError('Failed to update primary image. Please try again.')
    } finally {
      setSavingMeta(false)
    }
  }

  const moveImage = async (index, direction) => {
    const newImages = [...data.uploadedImages]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    
    if (targetIndex >= 0 && targetIndex < newImages.length) {
      [newImages[index], newImages[targetIndex]] = [newImages[targetIndex], newImages[index]]
      
      // Adjust primary index if needed
      let newPrimaryIndex = data.primaryImageIndex
      if (data.primaryImageIndex === index) {
        newPrimaryIndex = targetIndex
      } else if (data.primaryImageIndex === targetIndex) {
        newPrimaryIndex = index
      }

      // Update sort orders
      newImages.forEach((img, idx) => {
        img.sort_order = idx
      })

      onChange({ 
        uploadedImages: newImages,
        primaryImageIndex: newPrimaryIndex
      })

      // Save metadata to API if productId exists
      if (productId) {
        try {
          setSavingMeta(true)
          const imagesMeta = newImages.map((img, idx) => ({
            image_id: img.image_id || img.id,
            is_primary: idx === newPrimaryIndex,
            sort_order: idx
          }))

          const response = await productService.updateProductImagesMeta(productId, imagesMeta)
          
          if (response.success) {
            success('Image order updated successfully!')
          } else {
            showError(response.message || 'Failed to update image order')
          }
        } catch (err) {
          console.error('Error updating image order:', err)
          showError('Failed to update image order. Please try again.')
        } finally {
          setSavingMeta(false)
        }
      }
    }
  }


  const getPrimaryImage = () => {
    if (data.uploadedImages && data.uploadedImages.length > 0 && data.primaryImageIndex < data.uploadedImages.length) {
      return data.uploadedImages[data.primaryImageIndex]
    }
    return null
  }

  if (loading) {
    return (
      <div className="text-center py-5">
        <FontAwesomeIcon icon={faSpinner} spin className="text-success fs-1 mb-3" />
        <p className="text-muted">Loading images...</p>
      </div>
    )
  }

  if (!productId) {
    return (
      <div className="text-center py-5">
        <p className="text-muted">Please complete Step 1 (Basic Info) first to create the product.</p>
      </div>
    )
  }

  return (
    <div>
      {/* Upload Area */}
      <div className="mb-5">
        <div 
          className={`upload-area border-2 border-dashed rounded-3 p-5 text-center ${
            dragOver ? 'border-success bg-light' : 'border-secondary'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          style={{ minHeight: '200px', cursor: uploading ? 'not-allowed' : 'pointer', opacity: uploading ? 0.6 : 1 }}
          onClick={() => !uploading && fileInputRef.current?.click()}
        >
          {uploading ? (
            <>
              <FontAwesomeIcon icon={faSpinner} spin className="text-success mb-3" style={{ fontSize: '3rem' }} />
              <h5 className="mb-2">Uploading Images...</h5>
              <p className="text-muted">Please wait while images are being uploaded</p>
            </>
          ) : (
            <>
              <FontAwesomeIcon 
                icon={faCloudUpload} 
                className="text-muted mb-3" 
                style={{ fontSize: '3rem' }}
              />
              <h5 className="mb-2 text-success">Upload Product Images</h5>
              <p className="text-muted mb-3">
                Drag and drop images here or click to browse
              </p>
              <p className="text-muted small mb-3">
                Maximum 4 images, 5MB each. Choose 1 image as primary.
              </p>
              <Button 
                variant="success" 
                className="d-flex align-items-center mx-auto"
                onClick={(e) => {
                  e.stopPropagation()
                  fileInputRef.current?.click()
                }}
              >
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                Choose Images
              </Button>
            </>
          )}
          
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileInputChange}
            style={{ display: 'none' }}
            disabled={uploading}
          />
        </div>
      </div>

      {/* Uploaded Images */}
      {data.uploadedImages && data.uploadedImages.length > 0 && (
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h5 className="mb-0 fw-semibold text-success">Uploaded Images</h5>
              <Badge bg="info" className="ms-2">
                {data.uploadedImages.length}/4 images uploaded
              </Badge>
            </div>
            {savingMeta && (
              <div className="text-muted small">
                <FontAwesomeIcon icon={faSpinner} spin className="me-2" />
                Saving...
              </div>
            )}
          </div>

          <Row>
            {data.uploadedImages.map((image, index) => (
              <Col md={3} key={image.id} className="mb-3">
                <Card className="position-relative">
                  <div className="position-relative">
                    <Card.Img 
                      variant="top" 
                      src={image.url} 
                      style={{ height: '150px', objectFit: 'cover' }}
                    />
                    
                    {/* Primary Badge */}
                    {index === data.primaryImageIndex && (
                      <Badge 
                        bg="primary" 
                        className="position-absolute top-0 end-0 m-2"
                      >
                        Primary
                      </Badge>
                    )}

                    {/* Star Icon */}
                    <div 
                      className="position-absolute bottom-0 start-0 m-2"
                      style={{ cursor: savingMeta ? 'not-allowed' : 'pointer' }}
                      onClick={() => !savingMeta && setPrimaryImage(index)}
                    >
                      <FontAwesomeIcon 
                        icon={faStar} 
                        className={`${index === data.primaryImageIndex ? 'text-warning' : 'text-muted'}`}
                      />
                    </div>

                    {/* Control Buttons */}
                    <div className="position-absolute bottom-0 end-0 m-2">
                      <div className="d-flex gap-1">
                        <Button
                          variant="dark"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            moveImage(index, 'up')
                          }}
                          disabled={index === 0 || savingMeta}
                        >
                          <FontAwesomeIcon icon={faArrowUp} />
                        </Button>
                        <Button
                          variant="dark"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            moveImage(index, 'down')
                          }}
                          disabled={index === data.uploadedImages.length - 1 || savingMeta}
                        >
                          <FontAwesomeIcon icon={faArrowDown} />
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            removeImage(image.id)
                          }}
                          disabled={deletingImage[image.id] || savingMeta}
                        >
                          {deletingImage[image.id] ? (
                            <FontAwesomeIcon icon={faSpinner} spin />
                          ) : (
                            <FontAwesomeIcon icon={faTrash} />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <Card.Body className="p-2">
                    <small className="text-muted d-block text-truncate">
                      {image.name}
                    </small>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Primary Image Info */}
          {getPrimaryImage() && (
            <div className="alert alert-info mt-3">
              <FontAwesomeIcon icon={faImage} className="me-2" />
              <strong>Primary Image:</strong> {getPrimaryImage().name} - This will be the main product image displayed to customers.
            </div>
          )}
        </div>
      )}

      {errors.images && (
        <div className="text-danger mt-2">
          {errors.images}
        </div>
      )}
    </div>
  )
}

export default ImageStep
