import React, { useState, useEffect } from 'react'
import { Row, Col, Form, FormControl, FormSelect, Button, Table, Badge, Card, Image } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faTrash, faEdit, faSpinner, faImage as faImageIcon } from '@fortawesome/free-solid-svg-icons'
import { productService } from '../../../../services/productService'
import { useToast } from '../../../../components'
import VariantFormModal from '../VariantFormModal'

const VariantsStep = ({ data, onChange, errors, productId }) => {
  const { success, error: showError } = useToast()
  
  const [variants, setVariants] = useState([])
  const [bulkPricing, setBulkPricing] = useState([])
  const [loading, setLoading] = useState(true)
  const [savingBulkPricing, setSavingBulkPricing] = useState({})
  const [deletingBulkPricing, setDeletingBulkPricing] = useState({})
  const [deletingVariant, setDeletingVariant] = useState({})
  
  // Modal state
  const [showVariantModal, setShowVariantModal] = useState(false)
  const [editingVariant, setEditingVariant] = useState(null)

  // Load variants and bulk pricing from API
  useEffect(() => {
    if (productId) {
      loadVariants()
      loadBulkPricing()
    } else {
      setLoading(false)
    }
  }, [productId])

  const loadVariants = async () => {
    try {
      setLoading(true)
      const response = await productService.getProductVariantsWithImages(productId)
      if (response.success && response.data) {
        // Map API response to component format
        const mappedVariants = response.data.map(v => ({
          variant_id: v.variant_id,
          id: v.variant_id,
          variant_name: v.variant_name,
          variant_value: v.variant_value,
          name: v.variant_name || v.variant_value || '',
          sku: v.sku || '',
          base_price: v.base_price,
          basePrice: v.base_price,
          sale_price: v.sale_price,
          salePrice: v.sale_price || '',
          stock_quantity: v.stock_quantity,
          stock: v.stock_quantity || '',
          low_stock_quantity: v.low_stock_quantity,
          is_active: v.is_active,
          status: v.is_active ? 'active' : 'inactive',
          // Ensure images array includes image_id and image_url/metadata
          images: (v.images || []).map(img => {
            // Handle both formats: object with image_id/image_url or string URL
            if (typeof img === 'string') {
              return {
                image_id: null, // Will be handled in VariantFormModal
                image_url: img,
                url: img
              }
            }
            // Object format with image_id and image_url
            return {
              image_id: img.image_id,
              image_url: img.image_url || img.url,
              url: img.image_url || img.url,
              is_primary: img.is_primary,
              sort_order: img.sort_order
            }
          }),
          isNew: false
        }))
        setVariants(mappedVariants)
        onChange({ productVariants: mappedVariants })
      }
    } catch (error) {
      console.error('Error loading variants:', error)
      showError('Failed to load variants')
    } finally {
      setLoading(false)
    }
  }

  const loadBulkPricing = async () => {
    try {
      const response = await productService.getProductBulkPricing(productId)
      if (response.success && response.data) {
        // Map API response to component format
        const mappedBulkPricing = response.data.map(bp => ({
          bulk_pricing_id: bp.bulk_pricing_id,
          id: bp.bulk_pricing_id,
          minQuantity: bp.minimum_quantity || 1,
          maxQuantity: bp.maximum_quantity || null,
          priceType: bp.discount_type === 'fixed' || bp.discount_type === 'fixed_amount' ? 'fixed_amount' : 'discount',
          price: bp.discount_value || 0,
          isNew: false
        }))
        setBulkPricing(mappedBulkPricing)
        onChange({ bulkPricing: mappedBulkPricing })
      }
    } catch (error) {
      console.error('Error loading bulk pricing:', error)
    }
  }

  // ========== Variant Handlers ==========
  
  const handleAddVariant = () => {
    setEditingVariant(null)
    setShowVariantModal(true)
  }

  const handleEditVariant = (variant) => {
    setEditingVariant(variant)
    setShowVariantModal(true)
  }

  const handleVariantSaved = async () => {
    // Reload variants after save
    await loadVariants()
  }

  const handleDeleteVariant = async (variant) => {
    if (!window.confirm('Are you sure you want to delete this variant? This will also delete all its images.')) {
      return
    }

    try {
      setDeletingVariant(prev => ({ ...prev, [variant.variant_id]: true }))
      const response = await productService.deleteProductVariantWithImages(variant.variant_id)
      
      if (response.success) {
        success('Variant deleted successfully!')
        await loadVariants()
      } else {
        showError(response.message || 'Failed to delete variant')
      }
    } catch (err) {
      console.error('Error deleting variant:', err)
      showError('Failed to delete variant. Please try again.')
    } finally {
      setDeletingVariant(prev => ({ ...prev, [variant.variant_id]: false }))
    }
  }

  // ========== Bulk Pricing Handlers ==========
  
  const handleBulkPricingChange = (index, field, value) => {
    const newBulkPricing = [...bulkPricing]
    newBulkPricing[index] = { ...newBulkPricing[index], [field]: value }
    setBulkPricing(newBulkPricing)
    onChange({ bulkPricing: newBulkPricing })
  }

  const addBulkPrice = () => {
    const newBulkPrice = {
      id: `new-${Date.now()}`,
      minQuantity: 1,
      maxQuantity: null,
      priceType: 'fixed_amount',
      price: 0,
      isNew: true
    }
    const newBulkPricing = [...bulkPricing, newBulkPrice]
    setBulkPricing(newBulkPricing)
    onChange({ bulkPricing: newBulkPricing })
  }

  const saveBulkPricing = async (index) => {
    const bulkPrice = bulkPricing[index]
    
    // Validation
    if (!bulkPrice.minQuantity || parseInt(bulkPrice.minQuantity) < 1) {
      showError('Minimum quantity must be at least 1')
      return
    }
    if (bulkPrice.maxQuantity && parseInt(bulkPrice.maxQuantity) < parseInt(bulkPrice.minQuantity)) {
      showError('Maximum quantity must be greater than or equal to minimum quantity')
      return
    }
    if (!bulkPrice.price || parseFloat(bulkPrice.price) < 0) {
      showError('Price/discount value must be 0 or greater')
      return
    }

    try {
      setSavingBulkPricing(prev => ({ ...prev, [index]: true }))
      
      let response
      if (bulkPrice.isNew) {
        response = await productService.createBulkPricing(productId, bulkPrice)
        if (response.success) {
          const updatedBulkPricing = {
            ...bulkPrice,
            bulk_pricing_id: response.data.bulk_pricing_id,
            id: response.data.bulk_pricing_id,
            isNew: false
          }
          const newBulkPricing = [...bulkPricing]
          newBulkPricing[index] = updatedBulkPricing
          setBulkPricing(newBulkPricing)
          onChange({ bulkPricing: newBulkPricing })
          success('Bulk pricing created successfully!')
        } else {
          showError(response.message || 'Failed to create bulk pricing')
        }
      } else {
        response = await productService.updateBulkPricing(bulkPrice.bulk_pricing_id, bulkPrice)
        if (response.success) {
          success('Bulk pricing updated successfully!')
        } else {
          showError(response.message || 'Failed to update bulk pricing')
        }
      }
    } catch (err) {
      console.error('Error saving bulk pricing:', err)
      showError('Failed to save bulk pricing. Please try again.')
    } finally {
      setSavingBulkPricing(prev => ({ ...prev, [index]: false }))
    }
  }

  const deleteBulkPricing = async (index) => {
    const bulkPrice = bulkPricing[index]
    
    if (bulkPrice.isNew) {
      const newBulkPricing = bulkPricing.filter((_, i) => i !== index)
      setBulkPricing(newBulkPricing)
      onChange({ bulkPricing: newBulkPricing })
      return
    }

    if (!window.confirm('Are you sure you want to delete this bulk pricing rule?')) {
      return
    }

    try {
      setDeletingBulkPricing(prev => ({ ...prev, [index]: true }))
      const response = await productService.deleteBulkPricing(bulkPrice.bulk_pricing_id)
      
      if (response.success) {
        const newBulkPricing = bulkPricing.filter((_, i) => i !== index)
        setBulkPricing(newBulkPricing)
        onChange({ bulkPricing: newBulkPricing })
        success('Bulk pricing deleted successfully!')
      } else {
        showError(response.message || 'Failed to delete bulk pricing')
      }
    } catch (err) {
      console.error('Error deleting bulk pricing:', err)
      showError('Failed to delete bulk pricing. Please try again.')
    } finally {
      setDeletingBulkPricing(prev => ({ ...prev, [index]: false }))
    }
  }

  if (loading) {
    return (
      <div className="text-center py-5">
        <FontAwesomeIcon icon={faSpinner} spin className="text-success fs-1 mb-3" />
        <p className="text-muted">Loading variants and bulk pricing...</p>
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
      {/* Variant Form Modal */}
      <VariantFormModal
        show={showVariantModal}
        onClose={() => {
          setShowVariantModal(false)
          setEditingVariant(null)
        }}
        onSave={handleVariantSaved}
        variant={editingVariant}
        productId={productId}
      />

      {/* Product Variants Section */}
      <div className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h5 className="mb-1 fw-semibold text-success">Product Variants</h5>
            <p className="text-muted mb-0">Define different product variations with images</p>
          </div>
          <Button variant="success" onClick={handleAddVariant} className="d-flex align-items-center">
            <FontAwesomeIcon icon={faPlus} className="me-2" />
            Add Variant
          </Button>
        </div>

        {variants.length > 0 ? (
          <Row>
            {variants.map((variant) => (
              <Col md={6} lg={4} key={variant.variant_id} className="mb-3">
                <Card>
                  {/* Variant Image */}
                  {(() => {
                    // Find primary image or use first image
                    let imageUrl = null
                    if (variant.images && variant.images.length > 0) {
                      const primaryImage = variant.images.find(img => img.is_primary) || variant.images[0]
                      // Handle both object format and string format (backward compatibility)
                      if (typeof primaryImage === 'string') {
                        imageUrl = primaryImage
                      } else if (primaryImage) {
                        imageUrl = primaryImage.image_url || primaryImage.url
                      }
                    }
                    
                    return imageUrl ? (
                      <Card.Img 
                        variant="top" 
                        src={imageUrl} 
                        style={{ height: '150px', objectFit: 'cover' }}
                        onError={(e) => {
                          // Fallback to placeholder if image fails to load
                          e.target.style.display = 'none'
                          const placeholder = e.target.parentElement.querySelector('.image-placeholder')
                          if (placeholder) placeholder.style.display = 'flex'
                        }}
                      />
                    ) : (
                      <div 
                        className="image-placeholder bg-light d-flex align-items-center justify-content-center"
                        style={{ height: '150px' }}
                      >
                        <FontAwesomeIcon icon={faImageIcon} className="text-muted" style={{ fontSize: '3rem' }} />
                      </div>
                    )
                  })()}
                  
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <h6 className="mb-1">{variant.variant_name || variant.name}</h6>
                        <small className="text-muted">SKU: {variant.sku || 'N/A'}</small>
                      </div>
                      <Badge bg={variant.is_active ? 'success' : 'secondary'}>
                        {variant.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    
                    <div className="mb-2">
                      <div className="d-flex justify-content-between">
                        <small className="text-muted">Base Price:</small>
                        <strong>${variant.base_price || variant.basePrice}</strong>
                      </div>
                      {variant.sale_price && (
                        <div className="d-flex justify-content-between">
                          <small className="text-muted">Sale Price:</small>
                          <strong className="text-success">${variant.sale_price || variant.salePrice}</strong>
                        </div>
                      )}
                      <div className="d-flex justify-content-between">
                        <small className="text-muted">Stock:</small>
                        <strong>{variant.stock_quantity || variant.stock || 0}</strong>
                      </div>
                      {variant.images && variant.images.length > 0 && (
                        <div className="d-flex justify-content-between">
                          <small className="text-muted">Images:</small>
                          <strong>{variant.images.length}</strong>
                        </div>
                      )}
                    </div>

                    <div className="d-flex gap-2 mt-3">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleEditVariant(variant)}
                        className="flex-fill"
                      >
                        <FontAwesomeIcon icon={faEdit} className="me-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDeleteVariant(variant)}
                        disabled={deletingVariant[variant.variant_id]}
                      >
                        {deletingVariant[variant.variant_id] ? (
                          <FontAwesomeIcon icon={faSpinner} spin />
                        ) : (
                          <FontAwesomeIcon icon={faTrash} />
                        )}
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <div className="text-center py-4 border rounded bg-light">
            <p className="text-muted mb-0">No variants added yet. Click "Add Variant" to create one.</p>
          </div>
        )}

        {errors.variants && (
          <div className="text-danger mt-2">
            {errors.variants}
          </div>
        )}
      </div>

      {/* Bulk Pricing & Discounts Section */}
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h5 className="mb-1 fw-semibold text-success">Bulk Pricing & Discounts</h5>
            <p className="text-muted mb-0">Set quantity-based pricing for bulk orders</p>
          </div>
          <Button variant="success" onClick={addBulkPrice} className="d-flex align-items-center">
            <FontAwesomeIcon icon={faPlus} className="me-2" />
            Add Bulk Price
          </Button>
        </div>

        {bulkPricing.length > 0 ? (
          <Table responsive className="border">
            <thead className="table-light">
              <tr>
                <th>Min Quantity</th>
                <th>Max Quantity</th>
                <th>Price Type</th>
                <th>Price/Discount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bulkPricing.map((bulkPrice, index) => (
                <tr key={bulkPrice.id} className={bulkPrice.isNew ? 'table-warning' : ''}>
                  <td>
                    <FormControl
                      type="number"
                      min="1"
                      value={bulkPrice.minQuantity}
                      onChange={(e) => handleBulkPricingChange(index, 'minQuantity', e.target.value)}
                      className="border-0 bg-transparent"
                      disabled={savingBulkPricing[index] || deletingBulkPricing[index]}
                    />
                  </td>
                  <td>
                    <FormControl
                      type="number"
                      min="1"
                      value={bulkPrice.maxQuantity || ''}
                      onChange={(e) => handleBulkPricingChange(index, 'maxQuantity', e.target.value || null)}
                      className="border-0 bg-transparent"
                      placeholder="No limit"
                      disabled={savingBulkPricing[index] || deletingBulkPricing[index]}
                    />
                  </td>
                  <td>
                    <FormSelect
                      value={bulkPrice.priceType}
                      onChange={(e) => handleBulkPricingChange(index, 'priceType', e.target.value)}
                      className="border-0 bg-transparent"
                      disabled={savingBulkPricing[index] || deletingBulkPricing[index]}
                    >
                      <option value="fixed_amount">Fixed Price</option>
                      <option value="discount">Percentage Discount</option>
                    </FormSelect>
                  </td>
                  <td>
                    <FormControl
                      type="number"
                      step="0.01"
                      min="0"
                      value={bulkPrice.price}
                      onChange={(e) => handleBulkPricingChange(index, 'price', e.target.value)}
                      className="border-0 bg-transparent"
                      placeholder="0.00"
                      disabled={savingBulkPricing[index] || deletingBulkPricing[index]}
                    />
                  </td>
                  <td>
                    <div className="d-flex gap-1">
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => saveBulkPricing(index)}
                        disabled={savingBulkPricing[index] || deletingBulkPricing[index]}
                        className="d-flex align-items-center"
                      >
                        {savingBulkPricing[index] ? (
                          <FontAwesomeIcon icon={faSpinner} spin />
                        ) : (
                          <>
                            <FontAwesomeIcon icon={faEdit} className="me-1" />
                            Save
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => deleteBulkPricing(index)}
                        disabled={savingBulkPricing[index] || deletingBulkPricing[index]}
                      >
                        {deletingBulkPricing[index] ? (
                          <FontAwesomeIcon icon={faSpinner} spin />
                        ) : (
                          <FontAwesomeIcon icon={faTrash} />
                        )}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <div className="text-center py-4 border rounded bg-light">
            <p className="text-muted mb-0">No bulk pricing rules added yet</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default VariantsStep
