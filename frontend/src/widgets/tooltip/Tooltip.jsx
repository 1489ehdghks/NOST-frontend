import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import './Tooltip.scss';

const Tooltip = ({ message, isVisible, isValid, onClose }) => {
    return (
        <div className={`tooltip ${isVisible ? 'visible' : ''} ${isValid ? 'valid' : 'invalid'}`}>
            <div className="tooltip-content">
                <span className="tooltip-icon">
                    {isValid ? (
                        <CheckCircle size={16} className="check-icon" />
                    ) : (
                        <XCircle size={16} className="x-icon" />
                    )}
                </span>
                <span className="tooltip-message">
                    {message}
                </span>
            </div>
            <button className="tooltip-close" onClick={onClose} aria-label="Close tooltip">
                ×
            </button>
        </div>
    );
};

export default Tooltip;