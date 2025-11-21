import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col, Form, Modal, Badge, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faMapMarkerAlt, faCheck, faSpinner, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { CustomButton } from '../common';
import UsersService from '../../services/api/users';
import '../../styles/components/ui-components/address-management.css';

const AddressManagement = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState({
    address_type: 'home',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'New Zealand',
    is_default: false,
  });

  const [formErrors, setFormErrors] = useState({});

  // Load addresses on mount
  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await UsersService.getUserAddresses({ only_active: true });
      if (response.success) {
        setAddresses(Array.isArray(response.data) ? response.data : []);
      } else {
        setError(response.message || 'Failed to load addresses');
      }
    } catch (err) {
      setError('An error occurred while loading addresses');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (address = null) => {
    if (address) {
      setEditingAddress(address);
      setFormData({
        address_type: address.address_type || 'home',
        address_line1: address.address_line1 || '',
        address_line2: address.address_line2 || '',
        city: address.city || '',
        state: address.state || '',
        postal_code: address.postal_code || '',
        country: address.country || 'New Zealand',
        is_default: address.is_default || false,
      });
    } else {
      setEditingAddress(null);
      setFormData({
        address_type: 'home',
        address_line1: '',
        address_line2: '',
        city: '',
        state: '',
        postal_code: '',
        country: 'New Zealand',
        is_default: false,
      });
    }
    setFormErrors({});
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingAddress(null);
    setFormData({
      address_type: 'home',
      address_line1: '',
      address_line2: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'New Zealand',
      is_default: false,
    });
    setFormErrors({});
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error for this field
    if (formErrors[field]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.address_line1.trim()) {
      errors.address_line1 = 'Address line 1 is required';
    }
    if (!formData.city.trim()) {
      errors.city = 'City is required';
    }
    if (!formData.state.trim()) {
      errors.state = 'State is required';
    }
    if (!formData.postal_code.trim()) {
      errors.postal_code = 'Postal code is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    setFormErrors({});

    try {
      const addressPayload = {
        address_type: formData.address_type,
        address_line1: formData.address_line1.trim(),
        address_line2: formData.address_line2.trim() || null,
        city: formData.city.trim(),
        state: formData.state.trim(),
        postal_code: formData.postal_code.trim(),
        country: formData.country.trim() || 'New Zealand',
        is_default: formData.is_default,
      };

      let response;
      if (editingAddress) {
        response = await UsersService.updateAddress(editingAddress.address_id, addressPayload);
      } else {
        response = await UsersService.addAddress(addressPayload);
      }

      if (response.success) {
        setSuccessMessage(editingAddress ? 'Address updated successfully!' : 'Address added successfully!');
        handleCloseModal();
        await loadAddresses();
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setFormErrors({ submit: response.message || 'Failed to save address' });
      }
    } catch (err) {
      setFormErrors({ submit: 'An error occurred while saving address' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (addressId) => {
    if (!window.confirm('Are you sure you want to delete this address?')) {
      return;
    }

    try {
      const response = await UsersService.deleteAddress(addressId);
      if (response.success) {
        setSuccessMessage('Address deleted successfully!');
        await loadAddresses();
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError(response.message || 'Failed to delete address');
      }
    } catch (err) {
      setError('An error occurred while deleting address');
    }
  };

  const handleSetDefault = async (addressId) => {
    try {
      const response = await UsersService.setDefaultAddress(addressId);
      if (response.success) {
        setSuccessMessage('Default address updated successfully!');
        await loadAddresses();
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError(response.message || 'Failed to set default address');
      }
    } catch (err) {
      setError('An error occurred while setting default address');
    }
  };

  const getAddressTypeLabel = (type) => {
    const labels = {
      home: 'Home',
      work: 'Work',
      other: 'Other'
    };
    return labels[type] || type;
  };

  if (loading) {
    return (
      <div className="address-management">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
          <div className="text-center">
            <FontAwesomeIcon icon={faSpinner} className="fa-spin fa-2x text-primary mb-3" />
            <p>Loading addresses...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="address-management">
      <div className="address-header">
        <h2 className="address-title">Manage Addresses</h2>
        <p className="address-subtitle">Add, edit, or remove your delivery addresses</p>
      </div>

      {successMessage && (
        <Alert variant="success" className="mb-4" dismissible onClose={() => setSuccessMessage('')}>
          <FontAwesomeIcon icon={faCheck} className="me-2" />
          {successMessage}
        </Alert>
      )}

      {error && (
        <Alert variant="danger" className="mb-4" dismissible onClose={() => setError(null)}>
          <FontAwesomeIcon icon={faExclamationCircle} className="me-2" />
          {error}
        </Alert>
      )}

      <div className="address-actions mb-4">
        <CustomButton
          variant="success"
          onClick={() => handleOpenModal()}
        >
          <FontAwesomeIcon icon={faPlus} className="me-2" />
          Add New Address
        </CustomButton>
      </div>

      {addresses.length === 0 ? (
        <Card className="empty-address-card">
          <Card.Body className="text-center py-5">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="fa-3x text-muted mb-3" />
            <h5>No addresses found</h5>
            <p className="text-muted">Add your first address to get started</p>
            <CustomButton
              variant="success"
              onClick={() => handleOpenModal()}
            >
              <FontAwesomeIcon icon={faPlus} className="me-2" />
              Add Address
            </CustomButton>
          </Card.Body>
        </Card>
      ) : (
        <Row>
          {addresses.map((address) => (
            <Col md={6} lg={4} key={address.address_id} className="mb-4">
              <Card className={`address-card ${address.is_default ? 'default-address' : ''}`}>
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <Badge bg={address.is_default ? 'success' : 'secondary'} className="mb-2">
                        {getAddressTypeLabel(address.address_type)}
                      </Badge>
                      {address.is_default && (
                        <Badge bg="primary" className="ms-2">Default</Badge>
                      )}
                    </div>
                    <div className="address-actions-buttons">
                      <Button
                        variant="link"
                        size="sm"
                        className="text-primary p-0 me-2"
                        onClick={() => handleOpenModal(address)}
                        title="Edit address"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </Button>
                      <Button
                        variant="link"
                        size="sm"
                        className="text-danger p-0"
                        onClick={() => handleDelete(address.address_id)}
                        title="Delete address"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="address-details">
                    <p className="mb-1">
                      <strong>{address.address_line1}</strong>
                    </p>
                    {address.address_line2 && (
                      <p className="mb-1 text-muted">{address.address_line2}</p>
                    )}
                    <p className="mb-1 text-muted">
                      {address.city}, {address.state} {address.postal_code}
                    </p>
                    <p className="mb-0 text-muted">{address.country}</p>
                  </div>

                  {!address.is_default && (
                    <div className="mt-3">
                      <CustomButton
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleSetDefault(address.address_id)}
                      >
                        Set as Default
                      </CustomButton>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Add/Edit Address Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingAddress ? 'Edit Address' : 'Add New Address'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            {formErrors.submit && (
              <Alert variant="danger" className="mb-3">
                <FontAwesomeIcon icon={faExclamationCircle} className="me-2" />
                {formErrors.submit}
              </Alert>
            )}

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Address Type</Form.Label>
                  <Form.Select
                    value={formData.address_type}
                    onChange={(e) => handleInputChange('address_type', e.target.value)}
                  >
                    <option value="home">Home</option>
                    <option value="work">Work</option>
                    <option value="other">Other</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Set as default address"
                    checked={formData.is_default}
                    onChange={(e) => handleInputChange('is_default', e.target.checked)}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Address Line 1 <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                value={formData.address_line1}
                onChange={(e) => handleInputChange('address_line1', e.target.value)}
                placeholder="Street address"
                isInvalid={!!formErrors.address_line1}
                required
              />
              {formErrors.address_line1 && (
                <Form.Control.Feedback type="invalid">
                  {formErrors.address_line1}
                </Form.Control.Feedback>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Address Line 2</Form.Label>
              <Form.Control
                type="text"
                value={formData.address_line2}
                onChange={(e) => handleInputChange('address_line2', e.target.value)}
                placeholder="Apartment, suite, etc. (optional)"
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>City <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="City"
                    isInvalid={!!formErrors.city}
                    required
                  />
                  {formErrors.city && (
                    <Form.Control.Feedback type="invalid">
                      {formErrors.city}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>State/Province <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    placeholder="State/Province"
                    isInvalid={!!formErrors.state}
                    required
                  />
                  {formErrors.state && (
                    <Form.Control.Feedback type="invalid">
                      {formErrors.state}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Postal Code <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.postal_code}
                    onChange={(e) => handleInputChange('postal_code', e.target.value)}
                    placeholder="Postal code"
                    isInvalid={!!formErrors.postal_code}
                    required
                  />
                  {formErrors.postal_code && (
                    <Form.Control.Feedback type="invalid">
                      {formErrors.postal_code}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Country</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    placeholder="Country"
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal} disabled={submitting}>
              Cancel
            </Button>
            <Button variant="success" type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} className="fa-spin me-2" />
                  Saving...
                </>
              ) : (
                editingAddress ? 'Update Address' : 'Add Address'
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default AddressManagement;

