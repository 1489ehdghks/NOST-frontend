import React, { useState } from 'react';
import axiosInstance from '../../shared/utils/AxiosInstance';
import useThemeStore from '../../shared/store/Themestore';
import './ResendEmailModal.scss';
import { ToastContainer, toast } from 'react-toastify';

const ResendEmailModal = () => {
    const { themes, currentSeason } = useThemeStore();
    const currentTheme = themes[currentSeason];
    const [email, setEmail] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handleResendEmail = async () => {
        setIsLoading(true);
        setErrorMessage('');
        try {
            const response = await axiosInstance.post('/api/accounts/resend-email/', { email });
            console.log("이메일 재전송 성공:", response.data);
            toast.success('Verification email sent successfully!');
            setShowModal(false);
        } catch (error) {
            console.error("이메일 재전송 에러:", error);
            setErrorMessage('Failed to resend email. Please try again.');
            toast.error('Failed to resend email. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = () => {
        handleResendEmail();
    };

    return (
        <div>
            <ToastContainer />
            <button className='ResendEmailModalButton' onClick={() => setShowModal(true)}>이메일 재전송</button>
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setShowModal(false)}>
                            &times;
                        </span>
                        <h1>Resend Verification Email</h1>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={handleEmailChange}
                            disabled={isLoading}
                        />
                        {errorMessage && <p className="error-message">{errorMessage}</p>}
                        <p>이메일을 재전송하시겠습니까?</p>
                        <button
                            style={{ backgroundColor: currentTheme.buttonBackgroundColor, color: currentTheme.buttonTextColor }}
                            onClick={handleResend}
                            disabled={isLoading}
                        >
                            {isLoading ? '재전송 중...' : '재전송'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResendEmailModal;