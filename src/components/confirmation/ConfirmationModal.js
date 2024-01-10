import React from 'react';
import './ConfirmationModal.scss';

const ConfirmationModal = ({ isOpen, message, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div className="confirmation-modal-overlay">
            <div className="confirmation-modal">
                <p>{message}</p>
                <button className="confirm-button" onClick={onConfirm}>Tak</button>
                <button className="confirmation-cancel-button" onClick={onCancel}>Anuluj</button>
            </div>
        </div>
    );
};

export default ConfirmationModal;
