import React from 'react';
import { Modal } from 'react-bootstrap';
import '../../styles/components/modals/modal-dialog.css';

const ModalDialog = ({ 
  show,
  onHide,
  title,
  children,
  size = 'md',
  variant = 'default',
  className = '',
  closeButton = true,
  backdrop = true,
  keyboard = true,
  ...props 
}) => {
  const modalClasses = [
    'modal-dialog',
    `modal-dialog--${variant}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <Modal
      show={show}
      onHide={onHide}
      size={size}
      backdrop={backdrop}
      keyboard={keyboard}
      className={modalClasses}
      {...props}
    >
      <Modal.Header closeButton={closeButton} className="modal-dialog__header">
        {title && (
          <Modal.Title className="modal-dialog__title">
            {title}
          </Modal.Title>
        )}
      </Modal.Header>
      
      <Modal.Body className="modal-dialog__body">
        {children}
      </Modal.Body>
    </Modal>
  );
};

export default ModalDialog;
