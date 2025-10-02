import React from 'react';
import { Card } from 'react-bootstrap';
import '../../styles/components/ui-components/info-card.css';

const InfoCard = ({ 
  title,
  description,
  icon,
  variant = 'default',
  size = 'md',
  className = '',
  onClick,
  ...props 
}) => {
  const cardClasses = [
    'info-card',
    `info-card--${variant}`,
    `info-card--${size}`,
    onClick ? 'info-card--clickable' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <Card 
      className={cardClasses}
      onClick={onClick}
      {...props}
    >
      <Card.Body className="info-card__body">
        {icon && (
          <div className="info-card__icon">
            {icon}
          </div>
        )}
        
        <div className="info-card__content">
          {title && (
            <Card.Title className="info-card__title">
              {title}
            </Card.Title>
          )}
          
          {description && (
            <Card.Text className="info-card__description">
              {description}
            </Card.Text>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default InfoCard;
