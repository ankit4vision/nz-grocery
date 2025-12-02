import React from 'react';
import { Card, Form, Row, Col, Alert, Badge, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Loader } from '../common';
import '../../styles/components/ui-components/delivery-info.css';

const DeliveryInfo = ({ 
  deliveryInfo, 
  onDeliveryInfoChange,
  addresses = [],
  selectedAddressId = null,
  onAddressSelect = null,
  loadingAddresses = false,
  addressesError = null,
  onReloadAddresses = null
}) => {
  const navigate = useNavigate();
  const days = [
    { id: 'monday', label: 'Monday' },
    { id: 'tuesday', label: 'Tuesday' },
    { id: 'wednesday', label: 'Wednesday' },
    { id: 'thursday', label: 'Thursday' },
    { id: 'friday', label: 'Friday' },
    { id: 'saturday', label: 'Saturday' },
    { id: 'sunday', label: 'Sunday' }
  ];

  const timeSlots = [
    '6:00 AM To 9:00 AM',
    '9:00 AM To 5:00 PM',
    '5:00 PM To 9:00 PM'
  ];

  const handleDayToggle = (dayId) => {
    const currentDays = deliveryInfo.selectedDays;
    const newDays = currentDays.includes(dayId)
      ? currentDays.filter(day => day !== dayId)
      : [...currentDays, dayId];
    
    onDeliveryInfoChange('selectedDays', newDays);
  };

  return (
    <Card className="delivery-info-card">
      <Card.Header>
        <h5 className="card-title">Delivery Information</h5>
      </Card.Header>
      <Card.Body>
        {/* Delivery Type */}
        <div className="form-section">
          <h6 className="section-title">Delivery Type</h6>
          <div className="radio-group">
            <Form.Check
              type="radio"
              id="home-delivery"
              name="deliveryType"
              label="Home Delivery"
              checked={deliveryInfo.deliveryType === 'delivery' || deliveryInfo.deliveryType === 'home'}
              onChange={() => onDeliveryInfoChange('deliveryType', 'delivery')}
              className="delivery-radio"
            />
            <Form.Check
              type="radio"
              id="store-pickup"
              name="deliveryType"
              label="Store Pickup"
              checked={deliveryInfo.deliveryType === 'pickup'}
              onChange={() => onDeliveryInfoChange('deliveryType', 'pickup')}
              className="delivery-radio"
            />
          </div>
        </div>

        {/* Address Selection - Only for delivery */}
        {(deliveryInfo.deliveryType === 'delivery' || deliveryInfo.deliveryType === 'home') && (
          <div className="form-section">
            <h6 className="section-title">Select Delivery Address</h6>
            {loadingAddresses ? (
              <div className="text-center py-3">
                <Loader />
                <p className="mt-2 small text-muted">Loading addresses...</p>
              </div>
            ) : addressesError ? (
              <Alert variant="warning" className="mb-3">
                <Alert.Heading className="h6">Unable to Load Addresses</Alert.Heading>
                <p className="small mb-2">{addressesError}</p>
                {onReloadAddresses && (
                  <button 
                    className="btn btn-sm btn-outline-primary"
                    onClick={onReloadAddresses}
                  >
                    Retry
                  </button>
                )}
              </Alert>
            ) : addresses.length === 0 ? (
              <Alert variant="warning" className="mb-3">
                <Alert.Heading className="h6">No Saved Addresses</Alert.Heading>
                <p className="small mb-3">You must add a delivery address to continue with checkout.</p>
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={() => navigate('/dashboard?tab=addresses')}
                >
                  Add Address
                </Button>
              </Alert>
            ) : (
              <div className="address-selection mb-3">
                {addresses.map((address) => {
                  const isSelected = selectedAddressId === address.address_id;
                  const addressText = [
                    address.street_address || address.address_line1,
                    address.city,
                    address.state,
                    address.postal_code
                  ].filter(Boolean).join(', ');
                  
                  return (
                    <div
                      key={address.address_id}
                      className={`address-option ${isSelected ? 'selected' : ''}`}
                      onClick={() => onAddressSelect && onAddressSelect(address.address_id)}
                      style={{
                        border: `2px solid ${isSelected ? '#28a745' : '#dee2e6'}`,
                        borderRadius: '8px',
                        padding: '12px',
                        marginBottom: '8px',
                        cursor: 'pointer',
                        backgroundColor: isSelected ? '#f8f9fa' : 'white',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                          <div className="d-flex align-items-center gap-2 mb-1">
                            <strong>{address.address_type || 'Address'}</strong>
                            {address.is_default && (
                              <Badge bg="success" className="small">Default</Badge>
                            )}
                          </div>
                          <p className="mb-0 small text-muted">{addressText}</p>
                        </div>
                        <Form.Check
                          type="radio"
                          name="selectedAddress"
                          checked={isSelected}
                          onChange={() => onAddressSelect && onAddressSelect(address.address_id)}
                          className="ms-2"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Day Selection */}
        <div className="form-section">
          <h6 className="section-title">Select Days</h6>
          <div className="days-grid">
            {days.map(day => (
              <div key={day.id} className="day-item">
                <Form.Check
                  type="checkbox"
                  id={`day-${day.id}`}
                  label={day.label}
                  checked={deliveryInfo.selectedDays.includes(day.id)}
                  onChange={() => handleDayToggle(day.id)}
                  className="day-checkbox"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Time Slot Selection */}
        {deliveryInfo.selectedDays.length > 0 && (
          <div className="form-section">
            <h6 className="section-title">Time Slots</h6>
            <div className="time-slots">
              {timeSlots.map((slot, index) => (
                <Form.Check
                  key={index}
                  type="radio"
                  id={`time-slot-${index}`}
                  name="timeSlot"
                  label={slot}
                  checked={deliveryInfo.timeSlot === slot}
                  onChange={() => onDeliveryInfoChange('timeSlot', slot)}
                  className="time-slot-radio"
                />
              ))}
            </div>
          </div>
        )}

        {/* Delivery Instructions */}
        <div className="form-section">
          <h6 className="section-title">Delivery Instructions</h6>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.."
            value={deliveryInfo.deliveryInstruction}
            onChange={(e) => onDeliveryInfoChange('deliveryInstruction', e.target.value)}
            className="delivery-instructions"
          />
        </div>

        {/* Contact Information */}
        <div className="form-section">
          <h6 className="section-title">Contact Information</h6>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="deliveryFullName">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  value={deliveryInfo.fullName}
                  onChange={(e) => onDeliveryInfoChange('fullName', e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="deliveryPhone">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="tel"
                  value={deliveryInfo.phoneNumber}
                  onChange={(e) => onDeliveryInfoChange('phoneNumber', e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
          
          <Form.Group className="mb-3" controlId="deliveryEmail">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              value={deliveryInfo.emailAddress}
              onChange={(e) => onDeliveryInfoChange('emailAddress', e.target.value)}
            />
          </Form.Group>
        </div>
      </Card.Body>
    </Card>
  );
};

export default DeliveryInfo;
