import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button, Spinner, Nav, Form, FormControl, FormSelect, FormText, Alert } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCog, faPencil, faSave, faX } from '@fortawesome/free-solid-svg-icons'
import { useToast } from '../../components'
import { settingsService } from '../../services/settingsService'

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general')
  const [settingsData, setSettingsData] = useState({
    general: {},
    email: {},
    awsS3: {},
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingSection, setEditingSection] = useState(null)
  const [formData, setFormData] = useState({})
  const [errors, setErrors] = useState({})
  const [testEmail, setTestEmail] = useState('')
  const [testingEmail, setTestingEmail] = useState(false)
  const [testingS3, setTestingS3] = useState(false)
  const { success, error } = useToast()

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true)
      const response = await settingsService.getSettings()
      if (response.success) {
        setSettingsData(response.data)
      } else {
        error(response.message)
      }
      setLoading(false)
    }
    fetchSettings()
  }, [error])

  const handleEditClick = (section) => {
    setEditingSection(section)
    setFormData({ ...settingsData[section] })
    setErrors({})
  }

  const handleCancelEdit = () => {
    setEditingSection(null)
    setFormData({})
    setErrors({})
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = (section) => {
    const newErrors = {}
    
    if (section === 'general') {
      if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address'
      }
    }
    
    if (section === 'email') {
      if (formData.fromEmail && !/\S+@\S+\.\S+/.test(formData.fromEmail)) {
        newErrors.fromEmail = 'Please enter a valid email address'
      }
    }
    
    if (section === 'awsS3') {
      // No required validations for AWS S3 fields
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async (section) => {
    if (!validateForm(section)) return
    
    setSaving(true)
    let response
    
    // Call the appropriate method based on section
    switch (section) {
      case 'general':
        response = await settingsService.updateGeneralSettings(formData)
        break
      case 'email':
        response = await settingsService.updateEmailSettings(formData)
        break
      case 'awsS3':
        response = await settingsService.updateAWSSettings(formData)
        break
      default:
        response = { success: false, message: 'Invalid section' }
    }
    
    if (response.success) {
      setSettingsData(prev => ({ ...prev, [section]: response.data }))
      setEditingSection(null)
      setFormData({})
      setErrors({})
      success(response.message)
    } else {
      error(response.message)
    }
    setSaving(false)
  }

  const handleTestEmail = async () => {
    if (!testEmail.trim()) {
      error('Please enter an email address to test')
      return
    }

    if (!/\S+@\S+\.\S+/.test(testEmail)) {
      error('Please enter a valid email address')
      return
    }

    setTestingEmail(true)
    const response = await settingsService.testEmailConfiguration()
    
    if (response.success) {
      success(`Test email sent successfully to ${testEmail}`)
    } else {
      error(response.message || 'Failed to send test email')
    }
    setTestingEmail(false)
  }

  const handleTestS3 = async () => {
    setTestingS3(true)
    const response = await settingsService.testAWSConfiguration()
    
    if (response.success) {
      success('AWS S3 connection test successful!')
    } else {
      error(response.message || 'Failed to test AWS S3 connection')
    }
    setTestingS3(false)
  }

  const renderGeneralSettings = () => {
    const data = editingSection === 'general' ? formData : (settingsData.general || {})
    const isEditing = editingSection === 'general'

    return (
      <div>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="mb-0">General Settings</h5>
          {!isEditing && (
            <Button variant="primary" size="sm" onClick={() => handleEditClick('general')} disabled={saving}>
              <FontAwesomeIcon icon={faPencil} className="me-1" />
              Edit
            </Button>
          )}
        </div>

        {isEditing ? (
          <div>
            <Row className="mb-3">
              <Col md={6}>
                <label className="form-label">Application Name</label>
                <FormControl
                  value={data.appName || ''}
                  onChange={(e) => handleChange('appName', e.target.value)}
                  placeholder="Enter application name"
                  isInvalid={!!errors.appName}
                />
                {errors.appName && <FormText className="text-danger">{errors.appName}</FormText>}
              </Col>
              <Col md={6}>
                <label className="form-label">Business Name</label>
                <FormControl
                  value={data.businessName || ''}
                  onChange={(e) => handleChange('businessName', e.target.value)}
                  placeholder="Enter business name"
                />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={12}>
                <label className="form-label">Business Address</label>
                <FormControl
                  as="textarea"
                  value={data.businessAddress || ''}
                  onChange={(e) => handleChange('businessAddress', e.target.value)}
                  placeholder="Enter business address"
                  rows={3}
                />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={6}>
                <label className="form-label">Contact Info</label>
                <FormControl
                  value={data.contactInfo || ''}
                  onChange={(e) => handleChange('contactInfo', e.target.value)}
                  placeholder="Enter contact info"
                />
              </Col>
              <Col md={6}>
                <label className="form-label">Email</label>
                <FormControl
                  type="email"
                  value={data.email || ''}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="Enter email"
                  isInvalid={!!errors.email}
                />
                {errors.email && <FormText className="text-danger">{errors.email}</FormText>}
              </Col>
            </Row>
            <div className="d-flex gap-2 justify-content-end">
              <Button variant="secondary" size="sm" onClick={handleCancelEdit} disabled={saving}>
                <FontAwesomeIcon icon={faX} className="me-1" />
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={() => handleSave('general')} disabled={saving}>
                {saving ? (<><Spinner size="sm" className="me-1" />Saving...</>) : (<><FontAwesomeIcon icon={faSave} className="me-1" />Save Changes</>)}
              </Button>
            </div>
          </div>
        ) : (
          <div className="row">
            <div className="col-md-6 mb-3"><strong>Application Name:</strong><p className="text-muted mb-0">{data.appName || 'Not provided'}</p></div>
            <div className="col-md-6 mb-3"><strong>Business Name:</strong><p className="text-muted mb-0">{data.businessName || 'Not provided'}</p></div>
            <div className="col-12 mb-3"><strong>Business Address:</strong><p className="text-muted mb-0">{data.businessAddress || 'Not provided'}</p></div>
            <div className="col-md-6 mb-3"><strong>Contact Info:</strong><p className="text-muted mb-0">{data.contactInfo || 'Not provided'}</p></div>
            <div className="col-md-6 mb-3"><strong>Email:</strong><p className="text-muted mb-0">{data.email || 'Not provided'}</p></div>
          </div>
        )}
      </div>
    )
  }

  const renderEmailSettings = () => {
    const data = editingSection === 'email' ? formData : (settingsData.email || {})
    const isEditing = editingSection === 'email'

    return (
      <div>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="mb-0">Email Settings</h5>
          {!isEditing && (
            <Button variant="primary" size="sm" onClick={() => handleEditClick('email')} disabled={saving}>
              <FontAwesomeIcon icon={faPencil} className="me-1" />
              Edit
            </Button>
          )}
        </div>

        {isEditing ? (
          <div>
            <Row className="mb-3">
              <Col md={6}>
                <label className="form-label">SMTP Host</label>
                <FormControl
                  value={data.smtpHost || ''}
                  onChange={(e) => handleChange('smtpHost', e.target.value)}
                  placeholder="smtp.gmail.com"
                  isInvalid={!!errors.smtpHost}
                />
                {errors.smtpHost && <FormText className="text-danger">{errors.smtpHost}</FormText>}
              </Col>
              <Col md={6}>
                <label className="form-label">SMTP Port</label>
                <FormControl
                  value={data.smtpPort || ''}
                  onChange={(e) => handleChange('smtpPort', e.target.value)}
                  placeholder="587"
                  isInvalid={!!errors.smtpPort}
                />
                {errors.smtpPort && <FormText className="text-danger">{errors.smtpPort}</FormText>}
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={6}>
                <label className="form-label">Username</label>
                <FormControl
                  value={data.username || ''}
                  onChange={(e) => handleChange('username', e.target.value)}
                  placeholder="your-email@gmail.com"
                  isInvalid={!!errors.username}
                />
                {errors.username && <FormText className="text-danger">{errors.username}</FormText>}
              </Col>
              <Col md={6}>
                <label className="form-label">Password</label>
                <FormControl
                  type="password"
                  value={data.password || ''}
                  onChange={(e) => handleChange('password', e.target.value)}
                  placeholder="Enter password"
                  isInvalid={!!errors.password}
                />
                {errors.password && <FormText className="text-danger">{errors.password}</FormText>}
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={6}>
                <label className="form-label">From Email</label>
                <FormControl
                  type="email"
                  value={data.fromEmail || ''}
                  onChange={(e) => handleChange('fromEmail', e.target.value)}
                  placeholder="noreply@yourcompany.com"
                  isInvalid={!!errors.fromEmail}
                />
                {errors.fromEmail && <FormText className="text-danger">{errors.fromEmail}</FormText>}
              </Col>
              <Col md={6}>
                <label className="form-label">From Name</label>
                <FormControl
                  value={data.fromName || ''}
                  onChange={(e) => handleChange('fromName', e.target.value)}
                  placeholder="Your Company Name"
                />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={6}>
                <label className="form-label">Encryption</label>
                <FormSelect
                  value={data.encryption || 'tls'}
                  onChange={(e) => handleChange('encryption', e.target.value)}
                >
                  <option value="tls">TLS</option>
                  <option value="ssl">SSL</option>
                  <option value="none">None</option>
                </FormSelect>
              </Col>
            </Row>
            <div className="d-flex gap-2 justify-content-end">
              <Button variant="secondary" size="sm" onClick={handleCancelEdit} disabled={saving}>
                <FontAwesomeIcon icon={faX} className="me-1" />
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={() => handleSave('email')} disabled={saving}>
                {saving ? (<><Spinner size="sm" className="me-1" />Saving...</>) : (<><FontAwesomeIcon icon={faSave} className="me-1" />Save Changes</>)}
              </Button>
            </div>
          </div>
        ) : (
          <div className="row">
            <div className="col-md-6 mb-3"><strong>SMTP Host:</strong><p className="text-muted mb-0">{data.smtpHost || 'Not provided'}</p></div>
            <div className="col-md-6 mb-3"><strong>SMTP Port:</strong><p className="text-muted mb-0">{data.smtpPort || 'Not provided'}</p></div>
            <div className="col-md-6 mb-3"><strong>Username:</strong><p className="text-muted mb-0">{data.username || 'Not provided'}</p></div>
            <div className="col-md-6 mb-3"><strong>Password:</strong><p className="text-muted mb-0">{data.password ? '••••••••' : 'Not provided'}</p></div>
            <div className="col-md-6 mb-3"><strong>From Email:</strong><p className="text-muted mb-0">{data.fromEmail || 'Not provided'}</p></div>
            <div className="col-md-6 mb-3"><strong>From Name:</strong><p className="text-muted mb-0">{data.fromName || 'Not provided'}</p></div>
            <div className="col-md-6 mb-3"><strong>Encryption:</strong><p className="text-muted mb-0">{data.encryption ? data.encryption.toUpperCase() : 'Not provided'}</p></div>
          </div>
        )}

        {/* Test Email Configuration Section */}
        <hr className="my-4" />
        <div className="mb-4">
          <h6 className="fw-bold mb-2">Test Email Configuration</h6>
          <p className="text-muted mb-3">Test your email settings by sending a test email.</p>
          <Row className="align-items-end">
            <Col md={8}>
              <label className="form-label">Test Email Address</label>
              <FormControl
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="Enter email address to test"
                disabled={testingEmail}
              />
            </Col>
            <Col md={4}>
              <Button 
                variant="info" 
                onClick={handleTestEmail} 
                disabled={testingEmail || !testEmail.trim()}
                className="w-100"
              >
                {testingEmail ? (
                  <>
                    <Spinner size="sm" className="me-1" />
                    Sending...
                  </>
                ) : (
                  'Send Test Email'
                )}
              </Button>
            </Col>
          </Row>
        </div>
      </div>
    )
  }

  const renderAWSS3Settings = () => {
    const data = editingSection === 'awsS3' ? formData : (settingsData.awsS3 || {})
    const isEditing = editingSection === 'awsS3'

    return (
      <div>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="mb-0">AWS S3 Settings</h5>
          {!isEditing && (
            <Button variant="primary" size="sm" onClick={() => handleEditClick('awsS3')} disabled={saving}>
              <FontAwesomeIcon icon={faPencil} className="me-1" />
              Edit
            </Button>
          )}
        </div>

        {isEditing ? (
          <div>
            <Row className="mb-3">
              <Col md={6}>
                <label className="form-label">Access Key ID</label>
                <FormControl
                  value={data.accessKeyId || ''}
                  onChange={(e) => handleChange('accessKeyId', e.target.value)}
                  placeholder="AKIAIOSFODNN7EXAMPLE"
                  isInvalid={!!errors.accessKeyId}
                />
                {errors.accessKeyId && <FormText className="text-danger">{errors.accessKeyId}</FormText>}
              </Col>
              <Col md={6}>
                <label className="form-label">Secret Access Key</label>
                <FormControl
                  type="password"
                  value={data.secretAccessKey || ''}
                  onChange={(e) => handleChange('secretAccessKey', e.target.value)}
                  placeholder="Enter secret access key"
                  isInvalid={!!errors.secretAccessKey}
                />
                {errors.secretAccessKey && <FormText className="text-danger">{errors.secretAccessKey}</FormText>}
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={6}>
                <label className="form-label">Bucket Name</label>
                <FormControl
                  value={data.bucketName || ''}
                  onChange={(e) => handleChange('bucketName', e.target.value)}
                  placeholder="my-bucket-name"
                  isInvalid={!!errors.bucketName}
                />
                {errors.bucketName && <FormText className="text-danger">{errors.bucketName}</FormText>}
              </Col>
              <Col md={6}>
                <label className="form-label">Region</label>
                <FormControl
                  value={data.region || ''}
                  onChange={(e) => handleChange('region', e.target.value)}
                  placeholder="us-east-1"
                  isInvalid={!!errors.region}
                />
                {errors.region && <FormText className="text-danger">{errors.region}</FormText>}
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={12}>
                <label className="form-label">Custom Endpoint (Optional)</label>
                <FormControl
                  value={data.customEndpoint || ''}
                  onChange={(e) => handleChange('customEndpoint', e.target.value)}
                  placeholder="https://s3.amazonaws.com"
                />
              </Col>
            </Row>
            <div className="d-flex gap-2 justify-content-end">
              <Button variant="secondary" size="sm" onClick={handleCancelEdit} disabled={saving}>
                <FontAwesomeIcon icon={faX} className="me-1" />
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={() => handleSave('awsS3')} disabled={saving}>
                {saving ? (<><Spinner size="sm" className="me-1" />Saving...</>) : (<><FontAwesomeIcon icon={faSave} className="me-1" />Save Changes</>)}
              </Button>
            </div>
          </div>
        ) : (
          <div className="row">
            <div className="col-md-6 mb-3"><strong>Access Key ID:</strong><p className="text-muted mb-0">{data.accessKeyId || 'Not provided'}</p></div>
            <div className="col-md-6 mb-3"><strong>Secret Access Key:</strong><p className="text-muted mb-0">{data.secretAccessKey ? '••••••••' : 'Not provided'}</p></div>
            <div className="col-md-6 mb-3"><strong>Bucket Name:</strong><p className="text-muted mb-0">{data.bucketName || 'Not provided'}</p></div>
            <div className="col-md-6 mb-3"><strong>Region:</strong><p className="text-muted mb-0">{data.region || 'Not provided'}</p></div>
            <div className="col-12 mb-3"><strong>Custom Endpoint:</strong><p className="text-muted mb-0">{data.customEndpoint || 'Not provided'}</p></div>
          </div>
        )}

        {/* Test S3 Connection Section */}
        <hr className="my-4" />
        <div className="mb-4">
          <h6 className="fw-bold mb-2">Test S3 Connection</h6>
          <p className="text-muted mb-3">Test your AWS S3 configuration by verifying the connection.</p>
          <div className="d-flex justify-content-start">
            <Button 
              variant="info" 
              onClick={handleTestS3} 
              disabled={testingS3}
              style={{ minWidth: '150px' }}
            >
              {testingS3 ? (
                <>
                  <Spinner size="sm" className="me-1" />
                  Testing...
                </>
              ) : (
                'Test S3 Connection'
              )}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <Container fluid className="d-flex justify-content-center align-items-center min-vh-100">
        <Spinner variant="primary" />
      </Container>
    )
  }

  return (
    <Container fluid>
      <Card>
        <Card.Header>
          <Card.Title className="mb-0">Settings</Card.Title>
        </Card.Header>
        <Card.Body>
          <Nav variant="tabs" className="mb-4">
            <Nav.Item>
              <Nav.Link
                active={activeTab === 'general'}
                onClick={() => setActiveTab('general')}
                style={{ cursor: 'pointer' }}
              >
                General Settings
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                active={activeTab === 'email'}
                onClick={() => setActiveTab('email')}
                style={{ cursor: 'pointer' }}
              >
                Email Settings
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                active={activeTab === 'awsS3'}
                onClick={() => setActiveTab('awsS3')}
                style={{ cursor: 'pointer' }}
              >
                AWS S3 Settings
              </Nav.Link>
            </Nav.Item>
          </Nav>

          {activeTab === 'general' && renderGeneralSettings()}
          {activeTab === 'email' && renderEmailSettings()}
          {activeTab === 'awsS3' && renderAWSS3Settings()}
        </Card.Body>
      </Card>
    </Container>
  )
}

export default Settings