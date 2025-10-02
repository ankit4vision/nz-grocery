import React from 'react';
import { Card, Form, Row, Col } from 'react-bootstrap';
import '../../styles/components/ui-components/delivery-info.css';

const DeliveryInfo = ({ deliveryInfo, onDeliveryInfoChange }) => {
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
              checked={deliveryInfo.deliveryType === 'home'}
              onChange={() => onDeliveryInfoChange('deliveryType', 'home')}
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
              <Form.Group className="mb-3">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  value={deliveryInfo.fullName}
                  onChange={(e) => onDeliveryInfoChange('fullName', e.target.value)}
                  className="form-input"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="tel"
                  value={deliveryInfo.phoneNumber}
                  onChange={(e) => onDeliveryInfoChange('phoneNumber', e.target.value)}
                  className="form-input"
                />
              </Form.Group>
            </Col>
          </Row>
          
          <Form.Group className="mb-3">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              value={deliveryInfo.emailAddress}
              onChange={(e) => onDeliveryInfoChange('emailAddress', e.target.value)}
              className="form-input"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Delivery Address</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={deliveryInfo.deliveryAddress}
              onChange={(e) => onDeliveryInfoChange('deliveryAddress', e.target.value)}
              className="form-input"
            />
          </Form.Group>
        </div>
      </Card.Body>
    </Card>
  );
};

export default DeliveryInfo;
