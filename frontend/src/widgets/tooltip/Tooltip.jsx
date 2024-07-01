import React from 'react';
import './Tooltip.scss';

const Tooltip = ({ message, isVisible, onClose }) => {
    return (
        isVisible && (
            <div className="tooltip-container">
                <div className="tooltip-arrow"></div>
                <div className="tooltip-content">
                    <div className="tooltip-header">
                        <span>{message}</span>
                        <button onClick={onClose} className="tooltip-close">&times;</button>
                    </div>
                </div>
            </div>
        )
    );
};

export default Tooltip;