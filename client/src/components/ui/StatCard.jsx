import React from 'react';
import { Card } from 'react-bootstrap';
import './StatCard.css';

const StatCard = ({ 
  title,
  value,
  change,
  changeType = 'neutral',
  icon,
  variant = 'default',
  className = '',
  ...props 
}) => {
  const cardClasses = [
    'stat-card',
    `stat-card--${variant}`,
    className
  ].filter(Boolean).join(' ');

  const changeClasses = [
    'stat-card__change',
    `stat-card__change--${changeType}`
  ].filter(Boolean).join(' ');

  const formatValue = (val) => {
    if (typeof val === 'number') {
      if (val >= 1000000) {
        return (val / 1000000).toFixed(1) + 'M';
      } else if (val >= 1000) {
        return (val / 1000).toFixed(1) + 'K';
      }
      return val.toLocaleString();
    }
    return val;
  };

  return (
    <Card className={cardClasses} {...props}>
      <Card.Body className="stat-card__body">
        <div className="stat-card__header">
          <div className="stat-card__icon">
            {icon}
          </div>
          {change && (
            <div className={changeClasses}>
              {changeType === 'positive' && '+'}
              {change}%
            </div>
          )}
        </div>
        
        <div className="stat-card__content">
          <div className="stat-card__value">
            {formatValue(value)}
          </div>
          <div className="stat-card__title">
            {title}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default StatCard;
