import React from 'react';
import '../../styles/components/ui-components/purchase-note.css';

/**
 * PurchaseNote - Component for displaying delivery instructions/notes
 * 
 * @param {string} note - Delivery instruction note
 * 
 * @example
 * <PurchaseNote 
 *   note="Please deliver to the front door. Ring doorbell twice."
 * />
 */
const PurchaseNote = ({ note = '' }) => {
  if (!note || note.trim() === '') {
    return (
      <div className="purchase-note">
        <h3 className="section-title">Purchase Note</h3>
        <div className="note-content">
          <p className="no-note">No special instructions provided.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="purchase-note">
      <h3 className="section-title">Purchase Note</h3>
      <div className="note-content">
        <div className="note-text">
          {note}
        </div>
      </div>
    </div>
  );
};

export default PurchaseNote;
