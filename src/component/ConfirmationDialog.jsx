import React from 'react';
import '../css/ConfirmationDialog.css'; 

const ConfirmationDialog = ({ onConfirm, onCancel }) => {

  return (
    <div className="confirmation-dialog-overlay">
      <div className="confirmation-dialog">
        <h3>Are you sure you want to remove this product?</h3>
        <div className="confirmation-dialog-actions">
          <button className="btn-remove" onClick={onConfirm}>
            Remove
          </button>
          <button className="btn-cancel" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
