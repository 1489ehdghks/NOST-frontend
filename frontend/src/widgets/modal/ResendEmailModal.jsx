import React, { useState } from 'react';
import { Send, X, CheckCircle, AlertCircle, Mail } from 'lucide-react';
import './ResendEmailModal.scss';
import { toast } from 'react-toastify';
import axiosInstance from '../../shared/utils/AxiosInstance';
import useThemeStore from '../../shared/store/Themestore';

const ResendEmailModal = ({ onClose, email = '' }) => {
    const { themes, currentSeason } = useThemeStore();
    const currentTheme = themes[currentSeason];
    const [emailInput, setEmailInput] = useState(email);
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState('idle');

    const handleEmailChange = (event) => {
        setEmailInput(event.target.value);
        setStatus('idle');
    };

    const handleResendEmail = async () => {
        if (!emailInput) {
            toast.error('Please enter your email address');
            return;
        }

        setIsLoading(true);
        setStatus('loading');

        try {
            await axiosInstance.post('/api/accounts/resend-email/', {
                email: emailInput
            });

            setStatus('success');
            toast.success('Verification email sent successfully!');
            setTimeout(() => onClose(), 2000);
        } catch (error) {
            setStatus('error');
            toast.error(error.response?.data?.message || 'Failed to resend email');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="resend-email-modal-overlay" onClick={onClose}>
            <div
                className="resend-email-modal"
                onClick={e => e.stopPropagation()}
            >
                <div
                    className="modal-header"
                    style={{
                        background: `linear-gradient(to right, ${currentTheme.buttonBackgroundColor}, ${currentTheme.sidebarBg})`
                    }}
                >
                    <Mail className="header-icon" size={28} />
                    <button className="close-button" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <div className="modal-content">
                    <h2 style={{ color: currentTheme.defaultTextColor }}>
                        Resend Verification Email
                    </h2>
                    <p className="subtitle" style={{ color: currentTheme.defaultTextColor + '99' }}>
                        Enter your email address to receive a new link
                    </p>

                    <div className="input-group">
                        <input
                            type="email"
                            placeholder="Enter your email address"
                            value={emailInput}
                            onChange={handleEmailChange}
                            disabled={isLoading || status === 'success'}
                            style={{
                                borderColor: currentTheme.defaultTextColor + '20',
                                color: currentTheme.defaultTextColor
                            }}
                        />

                        <button
                            className={`send-button ${status}`}
                            onClick={handleResendEmail}
                            disabled={isLoading || status === 'success'}
                            style={{
                                backgroundColor: status === 'idle' ? currentTheme.buttonBackgroundColor : undefined,
                                color: status === 'idle' ? currentTheme.buttonTextColor : undefined
                            }}
                        >
                            {status === 'idle' && (
                                <>
                                    <Send size={18} /> Send
                                </>
                            )}
                            {status === 'loading' && (
                                <div className="loading-spinner" />
                            )}
                            {status === 'success' && (
                                <>
                                    <CheckCircle size={18} /> Sent
                                </>
                            )}
                            {status === 'error' && (
                                <>
                                    <AlertCircle size={18} /> Retry
                                </>
                            )}
                        </button>
                    </div>

                    {status === 'success' && (
                        <div className="success-message">
                            <CheckCircle className="success-icon" size={20} />
                            <p>Email sent! Please check your inbox.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResendEmailModal;