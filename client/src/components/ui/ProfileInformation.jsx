import React, { useState } from 'react';
import { Row, Col, Form, Button, Card, Image } from 'react-bootstrap';
import { CustomButton } from '../common';
import '../../styles/components/ui-components/profile-information.css';

const ProfileInformation = () => {
  const [formData, setFormData] = useState({
    fullName: 'Demo User',
    email: 'demo@egrocerymart.com',
    contactNumber: '+1 (555) 123-4567',
    dateOfBirth: '01/01/1990',
    bio: 'Demo user for eGroceryMart',
    billingAddress: {
      street: '123 Main Street',
      apartment: 'Apt 4B',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States'
    },
    shippingAddress: {
      street: '456 Oak Avenue',
      apartment: 'Unit 7',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
      country: 'United States'
    }
  });

  const [profileImage, setProfileImage] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddressChange = (type, field, value) => {
    setFormData(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value
      }
    }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
    }
  };

  const handleAutoFillAddress = () => {
    setFormData(prev => ({
      ...prev,
      shippingAddress: { ...prev.billingAddress }
    }));
  };

  const handleSaveChanges = () => {
    console.log('Saving profile changes:', formData);
    // Here you would typically make an API call to save the data
  };

  return (
    <div className="profile-information">
      <div className="profile-header">
        <h2 className="profile-title">Profile Information</h2>
        <p className="profile-subtitle">Update your profile information and settings</p>
      </div>

      <Row className="mt-4">
        <Col lg={12}>
          <Card className="profile-info-card">
            <Card.Body>
              <h5 className="form-section-title">Profile Information</h5>
              
              <Row>
                <Col lg={4} md={6}>
                  <div className="profile-image-section">
                    <div className="profile-image-container">
                      {profileImage ? (
                        <Image src={profileImage} roundedCircle className="profile-image" />
                      ) : (
                        <div className="profile-image-placeholder">
                          <i className="fas fa-user"></i>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-3">
                      <input
                        type="file"
                        id="profile-image-upload"
                        accept="image/jpeg,image/png,image/gif"
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                      />
                      <CustomButton
                        variant="outline-primary"
                        onClick={() => document.getElementById('profile-image-upload').click()}
                        className="upload-btn"
                      >
                        Upload Photo
                      </CustomButton>
                      <p className="upload-info">JPG, PNG or GIF. Max size 2MB</p>
                    </div>
                  </div>
                </Col>

                <Col lg={8} md={6}>
                  <div className="personal-info-section">
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3" controlId="fullName">
                          <Form.Label>Full Name</Form.Label>
                          <Form.Control
                            type="text"
                            value={formData.fullName}
                            onChange={(e) => handleInputChange('fullName', e.target.value)}
                            placeholder="Enter your full name"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3" controlId="emailAddress">
                          <Form.Label>Email Address</Form.Label>
                          <Form.Control
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            placeholder="Enter your email"
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3" controlId="contactNumber">
                          <Form.Label>Contact Number</Form.Label>
                          <Form.Control
                            type="tel"
                            value={formData.contactNumber}
                            onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                            placeholder="Enter your phone number"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3" controlId="dateOfBirth">
                          <Form.Label>Date of Birth</Form.Label>
                          <Form.Control
                            type="date"
                            value={formData.dateOfBirth}
                            onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mb-3" controlId="bio">
                      <Form.Label>Bio</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={formData.bio}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                        placeholder="Tell us about yourself"
                      />
                    </Form.Group>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col lg={12}>
          <Card className="addresses-card">
            <Card.Body>
              <h5 className="form-section-title">Addresses</h5>
              
              <Row>
                <Col lg={6}>
                  <div className="address-section">
                    <h6 className="address-section-title">Billing Address</h6>
                    
                    <Form.Group className="mb-3" controlId="billingStreet">
                      <Form.Label>Street Address</Form.Label>
                      <Form.Control
                        type="text"
                        value={formData.billingAddress.street}
                        onChange={(e) => handleAddressChange('billingAddress', 'street', e.target.value)}
                        placeholder="Enter street address"
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-3" controlId="billingApartment">
                      <Form.Label>Apartment/Suite</Form.Label>
                      <Form.Control
                        type="text"
                        value={formData.billingAddress.apartment}
                        onChange={(e) => handleAddressChange('billingAddress', 'apartment', e.target.value)}
                        placeholder="Enter apartment/suite"
                      />
                    </Form.Group>
                    
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3" controlId="billingCity">
                          <Form.Label>City</Form.Label>
                          <Form.Control
                            type="text"
                            value={formData.billingAddress.city}
                            onChange={(e) => handleAddressChange('billingAddress', 'city', e.target.value)}
                            placeholder="Enter city"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3" controlId="billingState">
                          <Form.Label>State/Province</Form.Label>
                          <Form.Control
                            type="text"
                            value={formData.billingAddress.state}
                            onChange={(e) => handleAddressChange('billingAddress', 'state', e.target.value)}
                            placeholder="Enter state"
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3" controlId="billingZip">
                          <Form.Label>ZIP/Postal Code</Form.Label>
                          <Form.Control
                            type="text"
                            value={formData.billingAddress.zipCode}
                            onChange={(e) => handleAddressChange('billingAddress', 'zipCode', e.target.value)}
                            placeholder="Enter ZIP code"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3" controlId="billingCountry">
                          <Form.Label>Country</Form.Label>
                          <Form.Control
                            type="text"
                            value={formData.billingAddress.country}
                            onChange={(e) => handleAddressChange('billingAddress', 'country', e.target.value)}
                            placeholder="Enter country"
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </div>
                </Col>

                <Col lg={6}>
                  <div className="address-section">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h6 className="address-section-title mb-0">Shipping Address</h6>
                      <CustomButton
                        variant="outline-success"
                        size="sm"
                        onClick={handleAutoFillAddress}
                      >
                        Copy from Billing
                      </CustomButton>
                    </div>
                    
                    <Form.Group className="mb-3" controlId="shippingStreet">
                      <Form.Label>Street Address</Form.Label>
                      <Form.Control
                        type="text"
                        value={formData.shippingAddress.street}
                        onChange={(e) => handleAddressChange('shippingAddress', 'street', e.target.value)}
                        placeholder="Enter street address"
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-3" controlId="shippingApartment">
                      <Form.Label>Apartment/Suite</Form.Label>
                      <Form.Control
                        type="text"
                        value={formData.shippingAddress.apartment}
                        onChange={(e) => handleAddressChange('shippingAddress', 'apartment', e.target.value)}
                        placeholder="Enter apartment/suite"
                      />
                    </Form.Group>
                    
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3" controlId="shippingCity">
                          <Form.Label>City</Form.Label>
                          <Form.Control
                            type="text"
                            value={formData.shippingAddress.city}
                            onChange={(e) => handleAddressChange('shippingAddress', 'city', e.target.value)}
                            placeholder="Enter city"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3" controlId="shippingState">
                          <Form.Label>State/Province</Form.Label>
                          <Form.Control
                            type="text"
                            value={formData.shippingAddress.state}
                            onChange={(e) => handleAddressChange('shippingAddress', 'state', e.target.value)}
                            placeholder="Enter state"
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3" controlId="shippingZip">
                          <Form.Label>ZIP/Postal Code</Form.Label>
                          <Form.Control
                            type="text"
                            value={formData.shippingAddress.zipCode}
                            onChange={(e) => handleAddressChange('shippingAddress', 'zipCode', e.target.value)}
                            placeholder="Enter ZIP code"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3" controlId="shippingCountry">
                          <Form.Label>Country</Form.Label>
                          <Form.Control
                            type="text"
                            value={formData.shippingAddress.country}
                            onChange={(e) => handleAddressChange('shippingAddress', 'country', e.target.value)}
                            placeholder="Enter country"
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <div className="profile-actions">
        <CustomButton
          variant="success"
          size="lg"
          onClick={handleSaveChanges}
          className="save-changes-btn"
        >
          Save All Changes
        </CustomButton>
      </div>
    </div>
  );
};

export default ProfileInformation;
