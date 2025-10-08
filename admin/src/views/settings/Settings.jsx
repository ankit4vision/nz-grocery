import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button, Spinner, Form, FormControl, FormSelect, FormText, Alert } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPercentage, faBuilding, faEnvelope, faGlobe, faShieldAlt, faSave } from '@fortawesome/free-solid-svg-icons'
import { useToast } from '../../components'
import { settingsService } from '../../services/settingsService'

const Settings = () => {
  const [settingsData, setSettingsData] = useState({
    taxPricing: {
      defaultGstRate: 15,
      defaultProfitMargin: 25
    },
    businessInfo: {
      businessName: 'Farm2Fridge',
      gstNumber: '',
      businessAddress: '123 Queen Street, Auckland Central, Auckland 1010, New Zealand'
    },
    emailNotifications: {
      supportEmail: 'support@farm2fridge.co.nz',
      adminEmail: 'admin@farm2fridge.co.nz',
      enableOrderNotifications: false
    },
    currencyRegional: {
      currency: 'NZD',
      dateFormat: 'DD/MM/YYYY',
      timeZone: 'Pacific/Auckland'
    },
    security: {
      sessionTimeout: 30,
      passwordExpiry: 90,
      enableTwoFactor: false
    }
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})
  const { success, error } = useToast()

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true)
      try {
        const response = await settingsService.getSettings()
        if (response.success) {
          setSettingsData({ ...settingsData, ...response.data })
        }
      } catch (err) {
        console.log('Using default settings')
      }
      setLoading(false)
    }
    fetchSettings()
  }, [])

  const handleChange = (section, field, value) => {
    setSettingsData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
    
    // Clear error if exists
    if (errors[`${section}.${field}`]) {
      setErrors(prev => ({
        ...prev,
        [`${section}.${field}`]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    // Validate GST Rate
    if (settingsData.taxPricing.defaultGstRate < 0 || settingsData.taxPricing.defaultGstRate > 100) {
      newErrors['taxPricing.defaultGstRate'] = 'GST rate must be between 0 and 100'
    }
    
    // Validate Profit Margin
    if (settingsData.taxPricing.defaultProfitMargin < 0 || settingsData.taxPricing.defaultProfitMargin > 100) {
      newErrors['taxPricing.defaultProfitMargin'] = 'Profit margin must be between 0 and 100'
    }
    
    // Validate Email addresses
    const emailRegex = /\S+@\S+\.\S+/
    if (settingsData.emailNotifications.supportEmail && !emailRegex.test(settingsData.emailNotifications.supportEmail)) {
      newErrors['emailNotifications.supportEmail'] = 'Please enter a valid email address'
    }
    if (settingsData.emailNotifications.adminEmail && !emailRegex.test(settingsData.emailNotifications.adminEmail)) {
      newErrors['emailNotifications.adminEmail'] = 'Please enter a valid email address'
    }
    
    // Validate Session Timeout
    if (settingsData.security.sessionTimeout < 5 || settingsData.security.sessionTimeout > 480) {
      newErrors['security.sessionTimeout'] = 'Session timeout must be between 5 and 480 minutes'
    }
    
    // Validate Password Expiry
    if (settingsData.security.passwordExpiry < 30 || settingsData.security.passwordExpiry > 365) {
      newErrors['security.passwordExpiry'] = 'Password expiry must be between 30 and 365 days'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSaveAll = async () => {
    if (!validateForm()) {
      error('Please fix the validation errors before saving')
      return
    }
    
    setSaving(true)
    try {
      const response = await settingsService.updateAllSettings(settingsData)
      if (response.success) {
        success('All settings saved successfully!')
      } else {
        error(response.message || 'Failed to save settings')
      }
    } catch (err) {
      error('Failed to save settings. Please try again.')
    }
    setSaving(false)
  }

  const renderTaxPricingSettings = () => (
    <Card className="mb-4">
      <Card.Header className="bg-success text-white d-flex align-items-center">
        <FontAwesomeIcon icon={faPercentage} className="me-2" />
        <h5 className="mb-0">Tax & Pricing Settings</h5>
      </Card.Header>
      <Card.Body>
        {/* Summary Cards */}
        <Row className="mb-4">
          <Col md={6}>
            <Card className="border-0" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
              <Card.Body className="text-center">
                <h3 className="mb-1">{settingsData.taxPricing.defaultGstRate}%</h3>
                <p className="mb-0">Default GST Rate</p>
                <small>Default GST rate applied to all products unless specified individually.</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="border-0" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
              <Card.Body className="text-center">
                <h3 className="mb-1">{settingsData.taxPricing.defaultProfitMargin}%</h3>
                <p className="mb-0">Default Profit Margin</p>
                <small>Default profit margin applied to all products unless specified individually.</small>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Input Fields */}
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Default GST Rate (%)</Form.Label>
              <FormControl
                type="number"
                min="0"
                max="100"
                value={settingsData.taxPricing.defaultGstRate}
                onChange={(e) => handleChange('taxPricing', 'defaultGstRate', parseInt(e.target.value) || 0)}
                isInvalid={!!errors['taxPricing.defaultGstRate']}
              />
              <FormText>This will be used for products that don't have a specific GST rate set.</FormText>
              {errors['taxPricing.defaultGstRate'] && (
                <FormText className="text-danger">{errors['taxPricing.defaultGstRate']}</FormText>
              )}
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Default Profit Margin (%)</Form.Label>
              <FormControl
                type="number"
                min="0"
                max="100"
                value={settingsData.taxPricing.defaultProfitMargin}
                onChange={(e) => handleChange('taxPricing', 'defaultProfitMargin', parseInt(e.target.value) || 0)}
                isInvalid={!!errors['taxPricing.defaultProfitMargin']}
              />
              <FormText>This will be used for products that don't have a specific margin set.</FormText>
              {errors['taxPricing.defaultProfitMargin'] && (
                <FormText className="text-danger">{errors['taxPricing.defaultProfitMargin']}</FormText>
              )}
            </Form.Group>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  )

  const renderBusinessInfo = () => (
    <Card className="mb-4">
      <Card.Header className="bg-success text-white d-flex align-items-center">
        <FontAwesomeIcon icon={faBuilding} className="me-2" />
        <h5 className="mb-0">Business Information</h5>
      </Card.Header>
      <Card.Body>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Business Name</Form.Label>
              <FormControl
                value={settingsData.businessInfo.businessName}
                onChange={(e) => handleChange('businessInfo', 'businessName', e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>GST Number</Form.Label>
              <FormControl
                placeholder="Enter GST registration number"
                value={settingsData.businessInfo.gstNumber}
                onChange={(e) => handleChange('businessInfo', 'gstNumber', e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <Form.Group className="mb-3">
              <Form.Label>Business Address</Form.Label>
              <FormControl
                as="textarea"
                rows={3}
                value={settingsData.businessInfo.businessAddress}
                onChange={(e) => handleChange('businessInfo', 'businessAddress', e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  )

  const renderEmailNotifications = () => (
    <Card className="mb-4">
      <Card.Header className="bg-success text-white d-flex align-items-center">
        <FontAwesomeIcon icon={faEnvelope} className="me-2" />
        <h5 className="mb-0">Email & Notification Settings</h5>
      </Card.Header>
      <Card.Body>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Support Email</Form.Label>
              <FormControl
                type="email"
                value={settingsData.emailNotifications.supportEmail}
                onChange={(e) => handleChange('emailNotifications', 'supportEmail', e.target.value)}
                isInvalid={!!errors['emailNotifications.supportEmail']}
              />
              {errors['emailNotifications.supportEmail'] && (
                <FormText className="text-danger">{errors['emailNotifications.supportEmail']}</FormText>
              )}
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Admin Email</Form.Label>
              <FormControl
                type="email"
                value={settingsData.emailNotifications.adminEmail}
                onChange={(e) => handleChange('emailNotifications', 'adminEmail', e.target.value)}
                isInvalid={!!errors['emailNotifications.adminEmail']}
              />
              {errors['emailNotifications.adminEmail'] && (
                <FormText className="text-danger">{errors['emailNotifications.adminEmail']}</FormText>
              )}
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Enable email notifications for new orders"
                checked={settingsData.emailNotifications.enableOrderNotifications}
                onChange={(e) => handleChange('emailNotifications', 'enableOrderNotifications', e.target.checked)}
              />
            </Form.Group>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  )

  const renderCurrencyRegional = () => (
    <Card className="mb-4">
      <Card.Header className="bg-success text-white d-flex align-items-center">
        <FontAwesomeIcon icon={faGlobe} className="me-2" />
        <h5 className="mb-0">Currency & Regional Settings</h5>
      </Card.Header>
      <Card.Body>
        <Row>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Currency</Form.Label>
              <FormSelect
                value={settingsData.currencyRegional.currency}
                onChange={(e) => handleChange('currencyRegional', 'currency', e.target.value)}
              >
                <option value="NZD">New Zealand Dollar (NZD)</option>
                <option value="USD">US Dollar (USD)</option>
                <option value="EUR">Euro (EUR)</option>
                <option value="GBP">British Pound (GBP)</option>
                <option value="AUD">Australian Dollar (AUD)</option>
              </FormSelect>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Date Format</Form.Label>
              <FormSelect
                value={settingsData.currencyRegional.dateFormat}
                onChange={(e) => handleChange('currencyRegional', 'dateFormat', e.target.value)}
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                <option value="DD-MM-YYYY">DD-MM-YYYY</option>
              </FormSelect>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Time Zone</Form.Label>
              <FormSelect
                value={settingsData.currencyRegional.timeZone}
                onChange={(e) => handleChange('currencyRegional', 'timeZone', e.target.value)}
              >
                <option value="Pacific/Auckland">Pacific/Auckland (NZDT/NZST)</option>
                <option value="UTC">UTC</option>
                <option value="America/New_York">America/New_York (EST/EDT)</option>
                <option value="Europe/London">Europe/London (GMT/BST)</option>
                <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
              </FormSelect>
            </Form.Group>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  )

  const renderSecuritySettings = () => (
    <Card className="mb-4">
      <Card.Header className="bg-success text-white d-flex align-items-center">
        <FontAwesomeIcon icon={faShieldAlt} className="me-2" />
        <h5 className="mb-0">Security Settings</h5>
      </Card.Header>
      <Card.Body>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Session Timeout (minutes)</Form.Label>
              <FormControl
                type="number"
                min="5"
                max="480"
                value={settingsData.security.sessionTimeout}
                onChange={(e) => handleChange('security', 'sessionTimeout', parseInt(e.target.value) || 30)}
                isInvalid={!!errors['security.sessionTimeout']}
              />
              <FormText>Automatically log out inactive users after this period.</FormText>
              {errors['security.sessionTimeout'] && (
                <FormText className="text-danger">{errors['security.sessionTimeout']}</FormText>
              )}
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Password Expiry (days)</Form.Label>
              <FormControl
                type="number"
                min="30"
                max="365"
                value={settingsData.security.passwordExpiry}
                onChange={(e) => handleChange('security', 'passwordExpiry', parseInt(e.target.value) || 90)}
                isInvalid={!!errors['security.passwordExpiry']}
              />
              <FormText>Force password change after this period.</FormText>
              {errors['security.passwordExpiry'] && (
                <FormText className="text-danger">{errors['security.passwordExpiry']}</FormText>
              )}
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Enable Two-Factor Authentication for admin accounts"
                checked={settingsData.security.enableTwoFactor}
                onChange={(e) => handleChange('security', 'enableTwoFactor', e.target.checked)}
              />
            </Form.Group>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  )

  if (loading) {
    return (
      <Container fluid className="d-flex justify-content-center align-items-center min-vh-100">
        <Spinner variant="primary" />
      </Container>
    )
  }

  return (
    <Container fluid>
      <Row>
        <Col xs={12}>
          <Card>
            <Card.Header>
              <Card.Title className="mb-0">Global Settings</Card.Title>
            </Card.Header>
            <Card.Body>
              {renderTaxPricingSettings()}
              {renderBusinessInfo()}
              {renderEmailNotifications()}
              {renderCurrencyRegional()}
              {renderSecuritySettings()}
              
              {/* Save All Settings Button */}
              <div className="text-center mt-4">
                <Button 
                  variant="success" 
                  size="lg" 
                  onClick={handleSaveAll}
                  disabled={saving}
                  className="px-5"
                >
                  {saving ? (
                    <>
                      <Spinner size="sm" className="me-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faSave} className="me-2" />
                      Save All Settings
                    </>
                  )}
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default Settings