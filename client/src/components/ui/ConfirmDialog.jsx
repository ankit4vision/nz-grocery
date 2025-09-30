import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import '../../styles/components/ui-components/confirm-dialog.css';

const ConfirmDialog = ({ 
  show,
  onHide,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'primary',
  size = 'md',
  className = '',
  ...props 
}) => {
  const dialogClasses = [
    'confirm-dialog',
    className
  ].filter(Boolean).join(' ');

  const handleConfirm = () => {
    onConfirm();
    onHide();
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size={size}
      className={dialogClasses}
      {...props}
    >
      <Modal.Header closeButton className="confirm-dialog__header">
        <Modal.Title className="confirm-dialog__title">
          {title}
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="confirm-dialog__body">
        <p className="confirm-dialog__message">
          {message}
        </p>
      </Modal.Body>
      
      <Modal.Footer className="confirm-dialog__footer">
        <Button 
          variant="outline-secondary" 
          onClick={onHide}
          className="confirm-dialog__button"
        >
          {cancelText}
        </Button>
        <Button 
          variant={variant}
          onClick={handleConfirm}
          className="confirm-dialog__button confirm-dialog__button--primary"
        >
          {confirmText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmDialog;
