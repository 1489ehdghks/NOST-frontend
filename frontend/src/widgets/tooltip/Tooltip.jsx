import React from 'react';
import './Tooltip.scss';

const Tooltip = ({ message, isVisible, isValid, onClose }) => {
    if (!isVisible) return null;

    return (
        <div className="tooltip">
            <div className="tooltip-content">
                <span className="tooltip-icon">
                    {isValid ? '✔️' : '❌'}
                </span>
                <span className="tooltip-message">
                    {message}
                </span>
            </div>
            <button className="tooltip-close" onClick={onClose}>×</button>
        </div>
    );
};

export default Tooltip;