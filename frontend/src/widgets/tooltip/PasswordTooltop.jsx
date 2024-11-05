
import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import './Tooltip.scss';

const PasswordTooltop = ({ passwordConditions, message, isVisible, isValid, onClose }) => {
    if (!isVisible) return null;

    // 비밀번호 조건 체크를 위한 툴팁인 경우
    if (passwordConditions) {
        return (
            <div className={`tooltip ${isVisible ? 'visible' : ''}`}>
                <div className="tooltip-content">
                    <div className="password-conditions">
                        <div className={`condition ${passwordConditions.length ? 'valid' : 'invalid'}`}>
                            <span className="condition-icon">
                                {passwordConditions.length ? <CheckCircle size={16} /> : <XCircle size={16} />}
                            </span>
                            <span>최소 8자 이상</span>
                        </div>
                        <div className={`condition ${passwordConditions.lowercase ? 'valid' : 'invalid'}`}>
                            <span className="condition-icon">
                                {passwordConditions.lowercase ? <CheckCircle size={16} /> : <XCircle size={16} />}
                            </span>
                            <span>소문자 포함</span>
                        </div>
                        <div className={`condition ${passwordConditions.uppercase ? 'valid' : 'invalid'}`}>
                            <span className="condition-icon">
                                {passwordConditions.uppercase ? <CheckCircle size={16} /> : <XCircle size={16} />}
                            </span>
                            <span>대문자 포함</span>
                        </div>
                        <div className={`condition ${passwordConditions.number ? 'valid' : 'invalid'}`}>
                            <span className="condition-icon">
                                {passwordConditions.number ? <CheckCircle size={16} /> : <XCircle size={16} />}
                            </span>
                            <span>숫자 포함</span>
                        </div>
                        <div className={`condition ${passwordConditions.special ? 'valid' : 'invalid'}`}>
                            <span className="condition-icon">
                                {passwordConditions.special ? <CheckCircle size={16} /> : <XCircle size={16} />}
                            </span>
                            <span>특수문자 포함</span>
                        </div>
                        <div className="condition-summary">
                            <span>* 위 조건 중 2가지 이상 만족 필요</span>
                        </div>
                    </div>
                </div>
                <button className="tooltip-close" onClick={onClose}>×</button>
            </div>
        );
    }

    // 기존 일반 툴팁
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
            <button className="tooltip-close" onClick={onClose}>×</button>
        </div>
    );
};

export default PasswordTooltop;