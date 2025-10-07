import React, { useState, useEffect } from 'react'
import { CContainer, CRow, CCol, CCard, CCardHeader, CCardBody, CCardTitle, CButton, CSpinner, CNav, CNavItem, CNavLink, CTabContent, CTabPane, CFormInput, CFormSelect, CFormTextarea, CFormText, CAlert } from '@coreui/react'
import { cilSettings, cilPencil, cilSave, cilX } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
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
            <CButton color="primary" variant="outline" size="sm" onClick={() => handleEditClick('general')} disabled={saving}>
              <CIcon icon={cilPencil} className="me-1" />
              Edit
            </CButton>
          )}
        </div>

        {isEditing ? (
          <div>
            <CRow className="mb-3">
              <CCol md={6}>
                <label className="form-label">Application Name</label>
                <CFormInput
                  value={data.appName || ''}
                  onChange={(e) => handleChange('appName', e.target.value)}
                  placeholder="Enter application name"
                  invalid={!!errors.appName}
                />
                {errors.appName && <CFormText className="text-danger">{errors.appName}</CFormText>}
              </CCol>
              <CCol md={6}>
                <label className="form-label">Business Name</label>
                <CFormInput
                  value={data.businessName || ''}
                  onChange={(e) => handleChange('businessName', e.target.value)}
                  placeholder="Enter business name"
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={12}>
                <label className="form-label">Business Address</label>
                <CFormTextarea
                  value={data.businessAddress || ''}
                  onChange={(e) => handleChange('businessAddress', e.target.value)}
                  placeholder="Enter business address"
                  rows={3}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={6}>
                <label className="form-label">Contact Info</label>
                <CFormInput
                  value={data.contactInfo || ''}
                  onChange={(e) => handleChange('contactInfo', e.target.value)}
                  placeholder="Enter contact info"
                />
              </CCol>
              <CCol md={6}>
                <label className="form-label">Email</label>
                <CFormInput
                  type="email"
                  value={data.email || ''}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="Enter email"
                  invalid={!!errors.email}
                />
                {errors.email && <CFormText className="text-danger">{errors.email}</CFormText>}
              </CCol>
            </CRow>
            <div className="d-flex gap-2 justify-content-end">
              <CButton color="secondary" variant="outline" size="sm" onClick={handleCancelEdit} disabled={saving}>
                <CIcon icon={cilX} className="me-1" />
                Cancel
              </CButton>
              <CButton color="primary" size="sm" onClick={() => handleSave('general')} disabled={saving}>
                {saving ? (<><CSpinner size="sm" className="me-1" />Saving...</>) : (<><CIcon icon={cilSave} className="me-1" />Save Changes</>)}
              </CButton>
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
            <CButton color="primary" variant="outline" size="sm" onClick={() => handleEditClick('email')} disabled={saving}>
              <CIcon icon={cilPencil} className="me-1" />
              Edit
            </CButton>
          )}
        </div>

        {isEditing ? (
          <div>
            <CRow className="mb-3">
              <CCol md={6}>
                <label className="form-label">SMTP Host</label>
                <CFormInput
                  value={data.smtpHost || ''}
                  onChange={(e) => handleChange('smtpHost', e.target.value)}
                  placeholder="smtp.gmail.com"
                  invalid={!!errors.smtpHost}
                />
                {errors.smtpHost && <CFormText className="text-danger">{errors.smtpHost}</CFormText>}
              </CCol>
              <CCol md={6}>
                <label className="form-label">SMTP Port</label>
                <CFormInput
                  value={data.smtpPort || ''}
                  onChange={(e) => handleChange('smtpPort', e.target.value)}
                  placeholder="587"
                  invalid={!!errors.smtpPort}
                />
                {errors.smtpPort && <CFormText className="text-danger">{errors.smtpPort}</CFormText>}
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={6}>
                <label className="form-label">Username</label>
                <CFormInput
                  value={data.username || ''}
                  onChange={(e) => handleChange('username', e.target.value)}
                  placeholder="your-email@gmail.com"
                  invalid={!!errors.username}
                />
                {errors.username && <CFormText className="text-danger">{errors.username}</CFormText>}
              </CCol>
              <CCol md={6}>
                <label className="form-label">Password</label>
                <CFormInput
                  type="password"
                  value={data.password || ''}
                  onChange={(e) => handleChange('password', e.target.value)}
                  placeholder="Enter password"
                  invalid={!!errors.password}
                />
                {errors.password && <CFormText className="text-danger">{errors.password}</CFormText>}
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={6}>
                <label className="form-label">From Email</label>
                <CFormInput
                  type="email"
                  value={data.fromEmail || ''}
                  onChange={(e) => handleChange('fromEmail', e.target.value)}
                  placeholder="noreply@yourcompany.com"
                  invalid={!!errors.fromEmail}
                />
                {errors.fromEmail && <CFormText className="text-danger">{errors.fromEmail}</CFormText>}
              </CCol>
              <CCol md={6}>
                <label className="form-label">From Name</label>
                <CFormInput
                  value={data.fromName || ''}
                  onChange={(e) => handleChange('fromName', e.target.value)}
                  placeholder="Your Company Name"
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={6}>
                <label className="form-label">Encryption</label>
                <CFormSelect
                  value={data.encryption || 'tls'}
                  onChange={(e) => handleChange('encryption', e.target.value)}
                >
                  <option value="tls">TLS</option>
                  <option value="ssl">SSL</option>
                  <option value="none">None</option>
                </CFormSelect>
              </CCol>
            </CRow>
            <div className="d-flex gap-2 justify-content-end">
              <CButton color="secondary" variant="outline" size="sm" onClick={handleCancelEdit} disabled={saving}>
                <CIcon icon={cilX} className="me-1" />
                Cancel
              </CButton>
              <CButton color="primary" size="sm" onClick={() => handleSave('email')} disabled={saving}>
                {saving ? (<><CSpinner size="sm" className="me-1" />Saving...</>) : (<><CIcon icon={cilSave} className="me-1" />Save Changes</>)}
              </CButton>
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
          <CRow className="align-items-end">
            <CCol md={8}>
              <label className="form-label">Test Email Address</label>
              <CFormInput
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="Enter email address to test"
                disabled={testingEmail}
              />
            </CCol>
            <CCol md={4}>
              <CButton 
                color="info" 
                onClick={handleTestEmail} 
                disabled={testingEmail || !testEmail.trim()}
                className="w-100"
              >
                {testingEmail ? (
                  <>
                    <CSpinner size="sm" className="me-1" />
                    Sending...
                  </>
                ) : (
                  'Send Test Email'
                )}
              </CButton>
            </CCol>
          </CRow>
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
            <CButton color="primary" variant="outline" size="sm" onClick={() => handleEditClick('awsS3')} disabled={saving}>
              <CIcon icon={cilPencil} className="me-1" />
              Edit
            </CButton>
          )}
        </div>

        {isEditing ? (
          <div>
            <CRow className="mb-3">
              <CCol md={6}>
                <label className="form-label">Access Key ID</label>
                <CFormInput
                  value={data.accessKeyId || ''}
                  onChange={(e) => handleChange('accessKeyId', e.target.value)}
                  placeholder="AKIAIOSFODNN7EXAMPLE"
                  invalid={!!errors.accessKeyId}
                />
                {errors.accessKeyId && <CFormText className="text-danger">{errors.accessKeyId}</CFormText>}
              </CCol>
              <CCol md={6}>
                <label className="form-label">Secret Access Key</label>
                <CFormInput
                  type="password"
                  value={data.secretAccessKey || ''}
                  onChange={(e) => handleChange('secretAccessKey', e.target.value)}
                  placeholder="Enter secret access key"
                  invalid={!!errors.secretAccessKey}
                />
                {errors.secretAccessKey && <CFormText className="text-danger">{errors.secretAccessKey}</CFormText>}
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={6}>
                <label className="form-label">Bucket Name</label>
                <CFormInput
                  value={data.bucketName || ''}
                  onChange={(e) => handleChange('bucketName', e.target.value)}
                  placeholder="my-bucket-name"
                  invalid={!!errors.bucketName}
                />
                {errors.bucketName && <CFormText className="text-danger">{errors.bucketName}</CFormText>}
              </CCol>
              <CCol md={6}>
                <label className="form-label">Region</label>
                <CFormInput
                  value={data.region || ''}
                  onChange={(e) => handleChange('region', e.target.value)}
                  placeholder="us-east-1"
                  invalid={!!errors.region}
                />
                {errors.region && <CFormText className="text-danger">{errors.region}</CFormText>}
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={12}>
                <label className="form-label">Custom Endpoint (Optional)</label>
                <CFormInput
                  value={data.customEndpoint || ''}
                  onChange={(e) => handleChange('customEndpoint', e.target.value)}
                  placeholder="https://s3.amazonaws.com"
                />
              </CCol>
            </CRow>
            <div className="d-flex gap-2 justify-content-end">
              <CButton color="secondary" variant="outline" size="sm" onClick={handleCancelEdit} disabled={saving}>
                <CIcon icon={cilX} className="me-1" />
                Cancel
              </CButton>
              <CButton color="primary" size="sm" onClick={() => handleSave('awsS3')} disabled={saving}>
                {saving ? (<><CSpinner size="sm" className="me-1" />Saving...</>) : (<><CIcon icon={cilSave} className="me-1" />Save Changes</>)}
              </CButton>
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
            <CButton 
              color="info" 
              onClick={handleTestS3} 
              disabled={testingS3}
              style={{ minWidth: '150px' }}
            >
              {testingS3 ? (
                <>
                  <CSpinner size="sm" className="me-1" />
                  Testing...
                </>
              ) : (
                'Test S3 Connection'
              )}
            </CButton>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <CContainer fluid className="d-flex justify-content-center align-items-center min-vh-100">
        <CSpinner color="primary" />
      </CContainer>
    )
  }

  return (
    <CContainer fluid>
      <CCard>
        <CCardHeader>
          <CCardTitle className="mb-0">Settings</CCardTitle>
        </CCardHeader>
        <CCardBody>
          <CNav variant="tabs" className="mb-4">
            <CNavItem>
              <CNavLink
                active={activeTab === 'general'}
                onClick={() => setActiveTab('general')}
                style={{ cursor: 'pointer' }}
              >
                General Settings
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                active={activeTab === 'email'}
                onClick={() => setActiveTab('email')}
                style={{ cursor: 'pointer' }}
              >
                Email Settings
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                active={activeTab === 'awsS3'}
                onClick={() => setActiveTab('awsS3')}
                style={{ cursor: 'pointer' }}
              >
                AWS S3 Settings
              </CNavLink>
            </CNavItem>
          </CNav>

          <CTabContent>
            <CTabPane visible={activeTab === 'general'}>
              {renderGeneralSettings()}
            </CTabPane>
            <CTabPane visible={activeTab === 'email'}>
              {renderEmailSettings()}
            </CTabPane>
            <CTabPane visible={activeTab === 'awsS3'}>
              {renderAWSS3Settings()}
            </CTabPane>
          </CTabContent>
        </CCardBody>
      </CCard>
    </CContainer>
  )
}

export default Settings