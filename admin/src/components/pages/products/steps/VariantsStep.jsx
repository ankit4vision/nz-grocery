import React from 'react'
import { Row, Col, Form, FormControl, FormSelect, Button, Table, Badge } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faTrash, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons'

const VariantsStep = ({ data, onChange, errors }) => {
  const handleBulkPricingChange = (index, field, value) => {
    const newBulkPricing = [...data.bulkPricing]
    newBulkPricing[index] = { ...newBulkPricing[index], [field]: value }
    onChange({ bulkPricing: newBulkPricing })
  }

  const addBulkPrice = () => {
    const newBulkPrice = {
      id: Date.now(),
      minQuantity: 1,
      maxQuantity: 10,
      priceType: 'fixed',
      price: 0,
      finalPrice: 'Auto-calculated'
    }
    onChange({ bulkPricing: [...data.bulkPricing, newBulkPrice] })
  }

  const removeBulkPrice = (index) => {
    const newBulkPricing = data.bulkPricing.filter((_, i) => i !== index)
    onChange({ bulkPricing: newBulkPricing })
  }

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...data.productVariants]
    newVariants[index] = { ...newVariants[index], [field]: value }
    onChange({ productVariants: newVariants })
  }

  const addVariant = () => {
    const newVariant = {
      id: Date.now(),
      name: '',
      sku: '',
      basePrice: '',
      salePrice: '',
      stock: '',
      status: 'active'
    }
    onChange({ productVariants: [...data.productVariants, newVariant] })
  }

  const removeVariant = (index) => {
    if (data.productVariants.length > 1) {
      const newVariants = data.productVariants.filter((_, i) => i !== index)
      onChange({ productVariants: newVariants })
    }
  }

  const moveVariant = (index, direction) => {
    const newVariants = [...data.productVariants]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    
    if (targetIndex >= 0 && targetIndex < newVariants.length) {
      [newVariants[index], newVariants[targetIndex]] = [newVariants[targetIndex], newVariants[index]]
      onChange({ productVariants: newVariants })
    }
  }

  return (
    <div>
      {/* Bulk Pricing & Discounts Section */}
      <div className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h5 className="mb-1 fw-semibold">Bulk Pricing & Discounts</h5>
            <p className="text-muted mb-0">Set quantity-based pricing for bulk orders</p>
          </div>
          <Button variant="primary" onClick={addBulkPrice} className="d-flex align-items-center">
            <FontAwesomeIcon icon={faPlus} className="me-2" />
            Add Bulk Price
          </Button>
        </div>

        {data.bulkPricing.length > 0 ? (
          <Table responsive className="border">
            <thead className="table-light">
              <tr>
                <th>Min Quantity</th>
                <th>Max Quantity</th>
                <th>Price Type</th>
                <th>Price/Discount</th>
                <th>Final Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.bulkPricing.map((bulkPrice, index) => (
                <tr key={bulkPrice.id}>
                  <td>
                    <FormControl
                      type="number"
                      min="1"
                      value={bulkPrice.minQuantity}
                      onChange={(e) => handleBulkPricingChange(index, 'minQuantity', e.target.value)}
                      className="border-0 bg-transparent"
                    />
                  </td>
                  <td>
                    <FormControl
                      type="number"
                      min="1"
                      value={bulkPrice.maxQuantity}
                      onChange={(e) => handleBulkPricingChange(index, 'maxQuantity', e.target.value)}
                      className="border-0 bg-transparent"
                    />
                  </td>
                  <td>
                    <FormSelect
                      value={bulkPrice.priceType}
                      onChange={(e) => handleBulkPricingChange(index, 'priceType', e.target.value)}
                      className="border-0 bg-transparent"
                    >
                      <option value="fixed">Fixed Price</option>
                      <option value="discount">Percentage Discount</option>
                    </FormSelect>
                  </td>
                  <td>
                    <FormControl
                      type="number"
                      step="0.01"
                      value={bulkPrice.price}
                      onChange={(e) => handleBulkPricingChange(index, 'price', e.target.value)}
                      className="border-0 bg-transparent"
                      placeholder="0.00"
                    />
                  </td>
                  <td>
                    <span className="text-muted">Auto-calculated</span>
                  </td>
                  <td>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => removeBulkPrice(index)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </Button>
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
            <h5 className="mb-1 fw-semibold">Product Variants</h5>
            <p className="text-muted mb-0">Define different product variations (size, color, etc.)</p>
          </div>
          <Button variant="primary" onClick={addVariant} className="d-flex align-items-center">
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
                {data.productVariants.map((variant, index) => (
                  <tr key={variant.id}>
                    <td>
                      <FormControl
                        type="text"
                        value={variant.name}
                        onChange={(e) => handleVariantChange(index, 'name', e.target.value)}
                        className="border-0 bg-transparent"
                        placeholder="e.g., Small, Medium, Large"
                      />
                    </td>
                    <td>
                      <FormControl
                        type="text"
                        value={variant.sku}
                        onChange={(e) => handleVariantChange(index, 'sku', e.target.value)}
                        className="border-0 bg-transparent"
                        placeholder="Unique SKU"
                      />
                    </td>
                    <td>
                      <FormControl
                        type="number"
                        step="0.01"
                        value={variant.basePrice}
                        onChange={(e) => handleVariantChange(index, 'basePrice', e.target.value)}
                        className="border-0 bg-transparent"
                        placeholder="0.00"
                      />
                    </td>
                    <td>
                      <FormControl
                        type="number"
                        step="0.01"
                        value={variant.salePrice}
                        onChange={(e) => handleVariantChange(index, 'salePrice', e.target.value)}
                        className="border-0 bg-transparent"
                        placeholder="0.00"
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
                      />
                    </td>
                    <td>
                      <FormSelect
                        value={variant.status}
                        onChange={(e) => handleVariantChange(index, 'status', e.target.value)}
                        className="border-0 bg-transparent"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </FormSelect>
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => moveVariant(index, 'up')}
                          disabled={index === 0}
                        >
                          <FontAwesomeIcon icon={faArrowUp} />
                        </Button>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => moveVariant(index, 'down')}
                          disabled={index === data.productVariants.length - 1}
                        >
                          <FontAwesomeIcon icon={faArrowDown} />
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => removeVariant(index)}
                          disabled={data.productVariants.length === 1}
                        >
                          <FontAwesomeIcon icon={faTrash} />
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
