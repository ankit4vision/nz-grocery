import React from 'react'
import { Row, Col, Form, FormControl, FormCheck } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons'

const AttributesStep = ({ data, onChange, errors }) => {
  const handleChange = (field, value) => {
    onChange({ [field]: value })
  }

  const handleDietaryInfoChange = (field, checked) => {
    onChange({
      dietaryInfo: {
        ...data.dietaryInfo,
        [field]: checked
      }
    })
  }

  const handleNutritionalInfoChange = (field, value) => {
    onChange({
      nutritionalInfo: {
        ...data.nutritionalInfo,
        [field]: value
      }
    })
  }

  return (
    <Form>
      {/* Dietary Information Section */}
      <div className="mb-5">
        <h5 className="mb-3 fw-semibold">Dietary Information</h5>
        <Row>
          <Col md={6}>
            <FormCheck
              id="organic"
              type="checkbox"
              label="Organic"
              checked={data.dietaryInfo.organic}
              onChange={(e) => handleDietaryInfoChange('organic', e.target.checked)}
              className="mb-2"
            />
            <FormCheck
              id="glutenFree"
              type="checkbox"
              label="Gluten-Free"
              checked={data.dietaryInfo.glutenFree}
              onChange={(e) => handleDietaryInfoChange('glutenFree', e.target.checked)}
              className="mb-2"
            />
          </Col>
          <Col md={6}>
            <FormCheck
              id="vegan"
              type="checkbox"
              label="Vegan"
              checked={data.dietaryInfo.vegan}
              onChange={(e) => handleDietaryInfoChange('vegan', e.target.checked)}
              className="mb-2"
            />
            <FormCheck
              id="dairyFree"
              type="checkbox"
              label="Dairy-Free"
              checked={data.dietaryInfo.dairyFree}
              onChange={(e) => handleDietaryInfoChange('dairyFree', e.target.checked)}
              className="mb-2"
            />
          </Col>
        </Row>
      </div>

      {/* Product Details Section */}
      <div className="mb-5">
        <h5 className="mb-3 fw-semibold">Product Details</h5>
        <Row>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="weight" className="fw-semibold">Weight (kg)</Form.Label>
              <FormControl
                id="weight"
                type="number"
                step="0.01"
                value={data.weight}
                onChange={(e) => handleChange('weight', e.target.value)}
                className="border-2"
                placeholder="0.00"
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="dimensions" className="fw-semibold">Dimensions (cm)</Form.Label>
              <FormControl
                id="dimensions"
                type="text"
                value={data.dimensions}
                onChange={(e) => handleChange('dimensions', e.target.value)}
                className="border-2"
                placeholder="L x W x H"
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="expiryDate" className="fw-semibold">Expiry Date</Form.Label>
              <div className="position-relative">
                <FormControl
                  id="expiryDate"
                  type="date"
                  value={data.expiryDate}
                  onChange={(e) => handleChange('expiryDate', e.target.value)}
                  className="border-2"
                />
                <FontAwesomeIcon 
                  icon={faCalendarAlt} 
                  className="position-absolute top-50 end-0 translate-middle-y me-3 text-muted"
                  style={{ pointerEvents: 'none' }}
                />
              </div>
            </Form.Group>
          </Col>
        </Row>
      </div>

      {/* Nutritional Information Section */}
      <div className="mb-4">
        <h5 className="mb-3 fw-semibold">Nutritional Information (per serving)</h5>
        <Row>
          <Col md={3}>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="calories" className="fw-semibold">Calories</Form.Label>
              <FormControl
                id="calories"
                type="number"
                value={data.nutritionalInfo.calories}
                onChange={(e) => handleNutritionalInfoChange('calories', e.target.value)}
                className="border-2"
                placeholder="0"
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="protein" className="fw-semibold">Protein (g)</Form.Label>
              <FormControl
                id="protein"
                type="number"
                step="0.1"
                value={data.nutritionalInfo.protein}
                onChange={(e) => handleNutritionalInfoChange('protein', e.target.value)}
                className="border-2"
                placeholder="0"
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="carbs" className="fw-semibold">Carbs (g)</Form.Label>
              <FormControl
                id="carbs"
                type="number"
                step="0.1"
                value={data.nutritionalInfo.carbs}
                onChange={(e) => handleNutritionalInfoChange('carbs', e.target.value)}
                className="border-2"
                placeholder="0"
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="fat" className="fw-semibold">Fat (g)</Form.Label>
              <FormControl
                id="fat"
                type="number"
                step="0.1"
                value={data.nutritionalInfo.fat}
                onChange={(e) => handleNutritionalInfoChange('fat', e.target.value)}
                className="border-2"
                placeholder="0"
              />
            </Form.Group>
          </Col>
        </Row>
      </div>
    </Form>
  )
}

export default AttributesStep
