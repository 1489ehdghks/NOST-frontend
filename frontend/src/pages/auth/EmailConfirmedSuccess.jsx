import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import useThemeStore from '../../shared/store/Themestore';
import './EmailConfirmation.scss';

const EmailConfirmedSuccess = () => {
    const navigate = useNavigate();
    const { themes, currentSeason, font } = useThemeStore();
    const currentTheme = themes[currentSeason];

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/');
        }, 3000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="email-confirmation-container"
            style={{
                backgroundColor: currentTheme.homepageBackgroundColor,
                color: currentTheme.defaultTextColor
            }}>
            <div className="confirmation-card success">
                <div className="icon-container">
                    <CheckCircle size={48} className="success-icon" />
                </div>
                <h1 style={{ fontFamily: font.nomalFont }}>
                    이메일 인증 성공!
                </h1>
                <p style={{ fontFamily: font.nomalFont }}>
                    이메일 주소가 성공적으로 확인되었습니다.
                </p>
                <p className="redirect-text" style={{ fontFamily: font.nomalFont }}>
                    5초 후 자동으로 메인 페이지로 이동합니다...
                </p>
                <button
                    onClick={() => navigate('/')}
                    style={{
                        backgroundColor: currentTheme.buttonBackgroundColor,
                        color: currentTheme.buttonTextColor,
                        fontFamily: font.nomalFont
                    }}
                >
                    지금 이동하기
                </button>
            </div>
        </div>
    );
};

export default EmailConfirmedSuccess