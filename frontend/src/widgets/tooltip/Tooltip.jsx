import React from 'react';
import { CheckCircle, XCircle, AlertCircle, Check } from 'lucide-react';
import './Tooltip.scss';

const ValidationItem = ({ label, isValid, notice }) => (
    <div className={`validation-item ${isValid ? 'valid' : ''}`}>
        <span className="validation-icon">
            {notice ? (
                <AlertCircle size={16} className="alert-icon" />
            ) : isValid ? (
                <CheckCircle size={16} className="check-icon bounce" />
            ) : (
                <XCircle size={16} className="x-icon" />
            )}
        </span>
        <span className="validation-label">
            {notice ? label.slice(1) : label}
        </span>
    </div>
);

const Tooltip = ({ title, requiredCount, conditions, isVisible, onClose }) => {
    if (!isVisible) return null;

    const validCount = conditions.filter(c => !c.notice && c.isValid).length;
    const isValid = validCount >= requiredCount;

    return (
        <div className={`tooltip ${isVisible ? 'visible' : ''}`}>
            <div className="tooltip-content">
                <div className={`tooltip-header ${isValid ? 'valid' : ''}`}>
                    <span>{title}</span>
                    <span className="status-icon">
                        {isValid ? (
                            <Check size={18} className="success-check bounce" />
                        ) : (
                            <XCircle size={18} />
                        )}
                    </span>
                </div>
                <div className="tooltip-condition">
                    <span>
                        {requiredCount}가지 이상
                        {
                            <Check size={16} className="condition-check bounce" />
                        }
                    </span>
                </div>
                <div className="tooltip-details">
                    {conditions.map((condition, index) => (
                        <ValidationItem
                            key={index}
                            label={condition.label}
                            isValid={condition.isValid}
                            notice={condition.notice}
                        />
                    ))}
                </div>
            </div>
            <button className="tooltip-close" onClick={onClose}>×</button>
        </div>
    );
};

export default Tooltip;