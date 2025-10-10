import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { Form, Row, Col, FormControl, FormSelect, FormText } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faEnvelope, faPhone, faMapMarkerAlt, faStickyNote } from '@fortawesome/free-solid-svg-icons'

const CustomerForm = forwardRef(({ 
  mode = 'create', 
  initialData = null, 
  onSubmit, 
  onCancel,
  loading = false 
}, ref) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'New Zealand'
    },
    status: 'active',
    notes: '',
    preferences: {
      newsletter: true,
      smsNotifications: false,
      preferredDeliveryTime: 'afternoon',
      dietaryRestrictions: []
    }
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Load initial data for edit mode
  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setFormData({
        firstName: initialData.firstName || '',
        lastName: initialData.lastName || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        address: {
          street: initialData.address?.street || '',
          city: initialData.address?.city || '',
          state: initialData.address?.state || '',
          postalCode: initialData.address?.postalCode || '',
          country: initialData.address?.country || 'New Zealand'
        },
        status: initialData.status || 'active',
        notes: initialData.notes || '',
        preferences: {
          newsletter: initialData.preferences?.newsletter ?? true,
          smsNotifications: initialData.preferences?.smsNotifications ?? false,
          preferredDeliveryTime: initialData.preferences?.preferredDeliveryTime || 'afternoon',
          dietaryRestrictions: initialData.preferences?.dietaryRestrictions || []
        }
      })
    }
  }, [mode, initialData])

  // Expose form methods to parent
  useImperativeHandle(ref, () => ({
    handleSubmit: () => {
      handleSubmit()
    },
    resetForm: () => {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: {
          street: '',
          city: '',
          state: '',
          postalCode: '',
          country: 'New Zealand'
        },
        status: 'active',
        notes: '',
        preferences: {
          newsletter: true,
          smsNotifications: false,
          preferredDeliveryTime: 'afternoon',
          dietaryRestrictions: []
        }
      })
      setErrors({})
    }
  }))

  // Handle input changes
  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  // Handle preference changes
  const handlePreferenceChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [field]: value
      }
    }))
  }

  // Handle dietary restrictions
  const handleDietaryRestrictionsChange = (restriction, checked) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        dietaryRestrictions: checked
          ? [...prev.preferences.dietaryRestrictions, restriction]
          : prev.preferences.dietaryRestrictions.filter(r => r !== restriction)
      }
    }))
  }

  // Validate form
  const validateForm = () => {
    const newErrors = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    }

    if (!formData.address.street.trim()) {
      newErrors['address.street'] = 'Street address is required'
    }

    if (!formData.address.city.trim()) {
      newErrors['address.city'] = 'City is required'
    }

    if (!formData.address.postalCode.trim()) {
      newErrors['address.postalCode'] = 'Postal code is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    if (e) e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(formData)
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const dietaryOptions = [
    'organic',
    'vegetarian',
    'vegan',
    'gluten-free',
    'dairy-free',
    'low-sugar',
    'local',
    'seasonal',
    'family-friendly',
    'kid-friendly'
  ]

  return (
    <Form onSubmit={handleSubmit}>
      {/* Personal Information Section */}
      <div className="mb-5">
        <div className="d-flex align-items-center mb-4 pb-3 border-bottom border-success border-2">
          <FontAwesomeIcon icon={faUser} className="me-3 text-success fs-4" />
          <h4 className="mb-0 text-success">Personal Information</h4>
        </div>
        
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="firstName" className="fw-semibold">First Name</Form.Label>
              <Form.Control
                id="firstName"
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                required
                isInvalid={!!errors.firstName}
                className="border-2"
              />
              <Form.Control.Feedback type="invalid">
                {errors.firstName}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="lastName" className="fw-semibold">Last Name</Form.Label>
              <Form.Control
                id="lastName"
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                required
                isInvalid={!!errors.lastName}
                className="border-2"
              />
              <Form.Control.Feedback type="invalid">
                {errors.lastName}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="email" className="fw-semibold">Email Address</Form.Label>
              <Form.Control
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
                isInvalid={!!errors.email}
                className="border-2"
              />
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="phone" className="fw-semibold">Phone Number</Form.Label>
              <Form.Control
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                required
                isInvalid={!!errors.phone}
                className="border-2"
                placeholder="+64 21 123 4567"
              />
              <Form.Control.Feedback type="invalid">
                {errors.phone}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
      </div>

      {/* Address Information Section */}
      <div className="mb-5">
        <div className="d-flex align-items-center mb-4 pb-3 border-bottom border-success border-2">
          <FontAwesomeIcon icon={faMapMarkerAlt} className="me-3 text-success fs-4" />
          <h4 className="mb-0 text-success">Address Information</h4>
        </div>
        
        <Row>
          <Col md={12}>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="street" className="fw-semibold">Street Address</Form.Label>
              <Form.Control
                id="street"
                type="text"
                value={formData.address.street}
                onChange={(e) => handleInputChange('address.street', e.target.value)}
                required
                isInvalid={!!errors['address.street']}
                className="border-2"
              />
              <Form.Control.Feedback type="invalid">
                {errors['address.street']}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="city" className="fw-semibold">City</Form.Label>
              <Form.Control
                id="city"
                type="text"
                value={formData.address.city}
                onChange={(e) => handleInputChange('address.city', e.target.value)}
                required
                isInvalid={!!errors['address.city']}
                className="border-2"
              />
              <Form.Control.Feedback type="invalid">
                {errors['address.city']}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="state" className="fw-semibold">State/Region</Form.Label>
              <Form.Control
                id="state"
                type="text"
                value={formData.address.state}
                onChange={(e) => handleInputChange('address.state', e.target.value)}
                className="border-2"
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="postalCode" className="fw-semibold">Postal Code</Form.Label>
              <Form.Control
                id="postalCode"
                type="text"
                value={formData.address.postalCode}
                onChange={(e) => handleInputChange('address.postalCode', e.target.value)}
                required
                isInvalid={!!errors['address.postalCode']}
                className="border-2"
              />
              <Form.Control.Feedback type="invalid">
                {errors['address.postalCode']}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="country" className="fw-semibold">Country</Form.Label>
              <Form.Control
                id="country"
                type="text"
                value={formData.address.country}
                onChange={(e) => handleInputChange('address.country', e.target.value)}
                className="border-2"
              />
            </Form.Group>
          </Col>
        </Row>
      </div>

      {/* Preferences Section */}
      <div className="mb-5">
        <div className="d-flex align-items-center mb-4 pb-3 border-bottom border-success border-2">
          <FontAwesomeIcon icon={faEnvelope} className="me-3 text-success fs-4" />
          <h4 className="mb-0 text-success">Preferences</h4>
        </div>
        
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Newsletter Subscription</Form.Label>
              <FormSelect
                value={formData.preferences.newsletter}
                onChange={(e) => handlePreferenceChange('newsletter', e.target.value === 'true')}
                className="border-2"
              >
                <option value={true}>Subscribed</option>
                <option value={false}>Not subscribed</option>
              </FormSelect>
            </Form.Group>
          </Col>
          
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">SMS Notifications</Form.Label>
              <FormSelect
                value={formData.preferences.smsNotifications}
                onChange={(e) => handlePreferenceChange('smsNotifications', e.target.value === 'true')}
                className="border-2"
              >
                <option value={false}>Disabled</option>
                <option value={true}>Enabled</option>
              </FormSelect>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Preferred Delivery Time</Form.Label>
              <FormSelect
                value={formData.preferences.preferredDeliveryTime}
                onChange={(e) => handlePreferenceChange('preferredDeliveryTime', e.target.value)}
                className="border-2"
              >
                <option value="morning">Morning (8AM - 12PM)</option>
                <option value="afternoon">Afternoon (12PM - 5PM)</option>
                <option value="evening">Evening (5PM - 8PM)</option>
              </FormSelect>
            </Form.Group>
          </Col>
          
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Account Status</Form.Label>
              <FormSelect
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="border-2"
              >
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="pending">Pending</option>
              </FormSelect>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={12}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Dietary Restrictions</Form.Label>
              <div className="d-flex flex-wrap gap-2">
                {dietaryOptions.map(option => (
                  <Form.Check
                    key={option}
                    type="checkbox"
                    id={`dietary-${option}`}
                    label={option.replace('-', ' ')}
                    checked={formData.preferences.dietaryRestrictions.includes(option)}
                    onChange={(e) => handleDietaryRestrictionsChange(option, e.target.checked)}
                    className="border-2"
                  />
                ))}
              </div>
              <FormText className="text-muted">
                Select any dietary restrictions or preferences for this customer.
              </FormText>
            </Form.Group>
          </Col>
        </Row>
      </div>

      {/* Notes Section */}
      <div className="mb-4">
        <div className="d-flex align-items-center mb-4 pb-3 border-bottom border-success border-2">
          <FontAwesomeIcon icon={faStickyNote} className="me-3 text-success fs-4" />
          <h4 className="mb-0 text-success">Additional Notes</h4>
        </div>
        
        <Row>
          <Col md={12}>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="notes" className="fw-semibold">Notes</Form.Label>
              <Form.Control
                id="notes"
                as="textarea"
                rows={3}
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                className="border-2"
                placeholder="Add any additional notes about this customer..."
              />
              <FormText className="text-muted">
                Add any relevant notes or information about this customer.
              </FormText>
            </Form.Group>
          </Col>
        </Row>
      </div>
    </Form>
  )
})

CustomerForm.displayName = 'CustomerForm'

export default CustomerForm
