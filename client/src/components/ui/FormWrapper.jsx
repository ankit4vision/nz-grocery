import React from 'react';
import { Card, Form } from 'react-bootstrap';
import '../../styles/components/ui-components/form-wrapper.css';

const FormWrapper = ({ 
  title,
  description,
  children,
  variant = 'default',
  className = '',
  onSubmit,
  ...props 
}) => {
  const wrapperClasses = [
    'form-wrapper',
    `form-wrapper--${variant}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <Card className={wrapperClasses} {...props}>
      {(title || description) && (
        <Card.Header className="form-wrapper__header">
          {title && (
            <Card.Title className="form-wrapper__title">
              {title}
            </Card.Title>
          )}
          {description && (
            <Card.Text className="form-wrapper__description">
              {description}
            </Card.Text>
          )}
        </Card.Header>
      )}
      
      <Card.Body className="form-wrapper__body">
        <Form onSubmit={onSubmit}>
          {children}
        </Form>
      </Card.Body>
    </Card>
  );
};

export default FormWrapper;
