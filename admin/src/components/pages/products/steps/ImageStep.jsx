import React, { useState, useRef } from 'react'
import { Row, Col, Button, Card, Badge } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faCloudUpload, 
  faPlus, 
  faStar, 
  faArrowUp, 
  faArrowDown, 
  faTrash,
  faImage
} from '@fortawesome/free-solid-svg-icons'

const ImageStep = ({ data, onChange, errors }) => {
  const fileInputRef = useRef(null)
  const [dragOver, setDragOver] = useState(false)

  const handleFileSelect = (files) => {
    const newImages = []
    const maxImages = 4
    const maxSize = 5 * 1024 * 1024 // 5MB

    Array.from(files).forEach((file, index) => {
      if (data.uploadedImages.length + newImages.length >= maxImages) {
        return
      }

      if (file.size > maxSize) {
        alert(`File ${file.name} is too large. Maximum size is 5MB.`)
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const newImage = {
          id: Date.now() + index,
          file: file,
          url: e.target.result,
          name: file.name,
          size: file.size
        }
        newImages.push(newImage)

        if (newImages.length === Math.min(files.length, maxImages - data.uploadedImages.length)) {
          const updatedImages = [...data.uploadedImages, ...newImages]
          onChange({ 
            uploadedImages: updatedImages,
            primaryImageIndex: data.primaryImageIndex
          })
        }
      }
      reader.readAsDataURL(file)
    })
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
    handleFileSelect(files)
  }

  const removeImage = (imageId) => {
    const updatedImages = data.uploadedImages.filter(img => img.id !== imageId)
    let newPrimaryIndex = data.primaryImageIndex

    // Adjust primary index if needed
    if (data.primaryImageIndex >= updatedImages.length) {
      newPrimaryIndex = Math.max(0, updatedImages.length - 1)
    }

    onChange({ 
      uploadedImages: updatedImages,
      primaryImageIndex: newPrimaryIndex
    })
  }

  const setPrimaryImage = (index) => {
    onChange({ 
      uploadedImages: data.uploadedImages,
      primaryImageIndex: index
    })
  }

  const moveImage = (index, direction) => {
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

      onChange({ 
        uploadedImages: newImages,
        primaryImageIndex: newPrimaryIndex
      })
    }
  }

  const getPrimaryImage = () => {
    if (data.uploadedImages.length > 0 && data.primaryImageIndex < data.uploadedImages.length) {
      return data.uploadedImages[data.primaryImageIndex]
    }
    return null
  }

  return (
    <div>
      {/* Upload Area */}
      <div className="mb-5">
        <div 
          className={`upload-area border-2 border-dashed rounded-3 p-5 text-center ${
            dragOver ? 'border-primary bg-light' : 'border-secondary'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          style={{ minHeight: '200px', cursor: 'pointer' }}
          onClick={() => fileInputRef.current?.click()}
        >
          <FontAwesomeIcon 
            icon={faCloudUpload} 
            className="text-muted mb-3" 
            style={{ fontSize: '3rem' }}
          />
          <h5 className="mb-2">Upload Product Images</h5>
          <p className="text-muted mb-3">
            Drag and drop images here or click to browse
          </p>
          <p className="text-muted small mb-3">
            Maximum 4 images, 5MB each. Choose 1 image as primary.
          </p>
          <Button 
            variant="primary" 
            className="d-flex align-items-center mx-auto"
            onClick={(e) => {
              e.stopPropagation()
              fileInputRef.current?.click()
            }}
          >
            <FontAwesomeIcon icon={faPlus} className="me-2" />
            Choose Images
          </Button>
          
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileInputChange}
            style={{ display: 'none' }}
          />
        </div>
      </div>

      {/* Uploaded Images */}
      {data.uploadedImages.length > 0 && (
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0 fw-semibold">Uploaded Images</h5>
            <Badge bg="info">
              {data.uploadedImages.length}/4 images uploaded
            </Badge>
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
                      style={{ cursor: 'pointer' }}
                      onClick={() => setPrimaryImage(index)}
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
                          disabled={index === 0}
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
                          disabled={index === data.uploadedImages.length - 1}
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
                        >
                          <FontAwesomeIcon icon={faTrash} />
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
