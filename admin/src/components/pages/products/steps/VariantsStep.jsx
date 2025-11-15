import React, { useState, useEffect } from 'react'
import { Row, Col, Form, FormControl, FormSelect, Button, Table, Badge } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faTrash, faSave, faSpinner, faCheck } from '@fortawesome/free-solid-svg-icons'
import { productService } from '../../../../services/productService'
import { useToast } from '../../../../components'

const VariantsStep = ({ data, onChange, errors, productId }) => {
  const { success, error: showError } = useToast()
  
  const [variants, setVariants] = useState([])
  const [bulkPricing, setBulkPricing] = useState([])
  const [loading, setLoading] = useState(true)
  const [savingVariant, setSavingVariant] = useState({}) // Track which variant is being saved
  const [savingBulkPricing, setSavingBulkPricing] = useState({}) // Track which bulk pricing is being saved
  const [deletingVariant, setDeletingVariant] = useState({})
  const [deletingBulkPricing, setDeletingBulkPricing] = useState({})

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
      const response = await productService.getProductVariants(productId)
      if (response.success && response.data) {
        // Map API response to component format
        const mappedVariants = response.data.map(v => ({
          variant_id: v.variant_id,
          id: v.variant_id, // For compatibility
          name: v.variant_name || v.variant_value || '',
          sku: v.sku || '',
          basePrice: v.base_price || '',
          salePrice: v.sale_price || '',
          stock: v.stock_quantity || '',
          status: v.is_active ? 'active' : 'inactive',
          isNew: false // Existing variant from API
        }))
        setVariants(mappedVariants)
        onChange({ productVariants: mappedVariants })
      }
    } catch (error) {
      console.error('Error loading variants:', error)
    }
  }

  const loadBulkPricing = async () => {
    try {
      const response = await productService.getProductBulkPricing(productId)
      if (response.success && response.data) {
        // Map API response to component format
        const mappedBulkPricing = response.data.map(bp => ({
          bulk_pricing_id: bp.bulk_pricing_id,
          id: bp.bulk_pricing_id, // For compatibility
          minQuantity: bp.minimum_quantity || 1,
          maxQuantity: bp.maximum_quantity || null,
          priceType: bp.discount_type === 'fixed' || bp.discount_type === 'fixed_amount' ? 'fixed_amount' : 'discount',
          price: bp.discount_value || 0,
          isNew: false // Existing bulk pricing from API
        }))
        setBulkPricing(mappedBulkPricing)
        onChange({ bulkPricing: mappedBulkPricing })
      }
    } catch (error) {
      console.error('Error loading bulk pricing:', error)
    } finally {
      setLoading(false)
    }
  }

  // ========== Variant Handlers ==========
  
  const handleVariantChange = (index, field, value) => {
    const newVariants = [...variants]
    newVariants[index] = { ...newVariants[index], [field]: value }
    setVariants(newVariants)
    onChange({ productVariants: newVariants })
  }

  const addVariant = () => {
    const newVariant = {
      id: `new-${Date.now()}`, // Temporary ID for new variants
      name: '',
      sku: '',
      basePrice: '',
      salePrice: '',
      stock: '',
      status: 'active',
      isNew: true // Mark as new
    }
    const newVariants = [...variants, newVariant]
    setVariants(newVariants)
    onChange({ productVariants: newVariants })
  }

  const saveVariant = async (index) => {
    const variant = variants[index]
    
    // Validation
    if (!variant.name || !variant.name.trim()) {
      showError('Variant name is required')
      return
    }
    if (!variant.basePrice || parseFloat(variant.basePrice) <= 0) {
      showError('Base price must be greater than 0')
      return
    }

    try {
      setSavingVariant(prev => ({ ...prev, [index]: true }))
      
      let response
      if (variant.isNew) {
        // Create new variant
        response = await productService.createProductVariant(productId, variant)
        if (response.success) {
          // Update variant with API response
          const updatedVariant = {
            ...variant,
            variant_id: response.data.variant_id,
            id: response.data.variant_id,
            isNew: false
          }
          const newVariants = [...variants]
          newVariants[index] = updatedVariant
          setVariants(newVariants)
          onChange({ productVariants: newVariants })
          success('Variant created successfully!')
        } else {
          showError(response.message || 'Failed to create variant')
        }
      } else {
        // Update existing variant
        response = await productService.updateProductVariant(variant.variant_id, variant)
        if (response.success) {
          success('Variant updated successfully!')
        } else {
          showError(response.message || 'Failed to update variant')
        }
      }
    } catch (err) {
      console.error('Error saving variant:', err)
      showError('Failed to save variant. Please try again.')
    } finally {
      setSavingVariant(prev => ({ ...prev, [index]: false }))
    }
  }

  const deleteVariant = async (index) => {
    const variant = variants[index]
    
    // If it's a new variant (not saved yet), just remove from list
    if (variant.isNew) {
      const newVariants = variants.filter((_, i) => i !== index)
      setVariants(newVariants)
      onChange({ productVariants: newVariants })
      return
    }

    if (!window.confirm('Are you sure you want to delete this variant?')) {
      return
    }

    try {
      setDeletingVariant(prev => ({ ...prev, [index]: true }))
      const response = await productService.deleteProductVariant(variant.variant_id)
      
      if (response.success) {
        const newVariants = variants.filter((_, i) => i !== index)
        setVariants(newVariants)
        onChange({ productVariants: newVariants })
        success('Variant deleted successfully!')
      } else {
        showError(response.message || 'Failed to delete variant')
      }
    } catch (err) {
      console.error('Error deleting variant:', err)
      showError('Failed to delete variant. Please try again.')
    } finally {
      setDeletingVariant(prev => ({ ...prev, [index]: false }))
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
      id: `new-${Date.now()}`, // Temporary ID for new bulk pricing
      minQuantity: 1,
      maxQuantity: null,
      priceType: 'fixed_amount',
      price: 0,
      isNew: true // Mark as new
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
        // Create new bulk pricing
        response = await productService.createBulkPricing(productId, bulkPrice)
        if (response.success) {
          // Update bulk pricing with API response
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
        // Update existing bulk pricing
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
    
    // If it's new (not saved yet), just remove from list
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
      {/* Bulk Pricing & Discounts Section */}
      <div className="mb-5">
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
                            <FontAwesomeIcon icon={faSave} className="me-1" />
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

      {/* Product Variants Section */}
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h5 className="mb-1 fw-semibold text-success">Product Variants</h5>
            <p className="text-muted mb-0">Define different product variations (size, color, etc.)</p>
          </div>
          <Button variant="success" onClick={addVariant} className="d-flex align-items-center">
            <FontAwesomeIcon icon={faPlus} className="me-2" />
            Add Variant
          </Button>
        </div>

        <div className="border rounded">
          <div className="table-responsive">
            <Table className="mb-0">
              <thead className="table-light">
                <tr>
                  <th>Variant Name</th>
                  <th>SKU</th>
                  <th>Base Price</th>
                  <th>Sale Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {variants.map((variant, index) => (
                  <tr key={variant.id} className={variant.isNew ? 'table-warning' : ''}>
                    <td>
                      <FormControl
                        type="text"
                        value={variant.name}
                        onChange={(e) => handleVariantChange(index, 'name', e.target.value)}
                        className="border-0 bg-transparent"
                        placeholder="e.g., Small, Medium, Large"
                        disabled={savingVariant[index] || deletingVariant[index]}
                      />
                    </td>
                    <td>
                      <FormControl
                        type="text"
                        value={variant.sku}
                        onChange={(e) => handleVariantChange(index, 'sku', e.target.value)}
                        className="border-0 bg-transparent"
                        placeholder="Unique SKU"
                        disabled={savingVariant[index] || deletingVariant[index]}
                      />
                    </td>
                    <td>
                      <FormControl
                        type="number"
                        step="0.01"
                        min="0"
                        value={variant.basePrice}
                        onChange={(e) => handleVariantChange(index, 'basePrice', e.target.value)}
                        className="border-0 bg-transparent"
                        placeholder="0.00"
                        disabled={savingVariant[index] || deletingVariant[index]}
                      />
                    </td>
                    <td>
                      <FormControl
                        type="number"
                        step="0.01"
                        min="0"
                        value={variant.salePrice}
                        onChange={(e) => handleVariantChange(index, 'salePrice', e.target.value)}
                        className="border-0 bg-transparent"
                        placeholder="0.00"
                        disabled={savingVariant[index] || deletingVariant[index]}
                      />
                    </td>
                    <td>
                      <FormControl
                        type="number"
                        min="0"
                        value={variant.stock}
                        onChange={(e) => handleVariantChange(index, 'stock', e.target.value)}
                        className="border-0 bg-transparent"
                        placeholder="0"
                        disabled={savingVariant[index] || deletingVariant[index]}
                      />
                    </td>
                    <td>
                      <FormSelect
                        value={variant.status}
                        onChange={(e) => handleVariantChange(index, 'status', e.target.value)}
                        className="border-0 bg-transparent"
                        disabled={savingVariant[index] || deletingVariant[index]}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </FormSelect>
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => saveVariant(index)}
                          disabled={savingVariant[index] || deletingVariant[index]}
                          className="d-flex align-items-center"
                        >
                          {savingVariant[index] ? (
                            <FontAwesomeIcon icon={faSpinner} spin />
                          ) : (
                            <>
                              <FontAwesomeIcon icon={faSave} className="me-1" />
                              Save
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => deleteVariant(index)}
                          disabled={savingVariant[index] || deletingVariant[index] || (variants.length === 1 && !variant.isNew)}
                        >
                          {deletingVariant[index] ? (
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
          </div>
        </div>

        {errors.variants && (
          <div className="text-danger mt-2">
            {errors.variants}
          </div>
        )}
      </div>
    </div>
  )
}

export default VariantsStep
