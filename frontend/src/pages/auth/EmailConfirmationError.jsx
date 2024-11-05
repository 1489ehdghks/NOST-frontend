import React from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircle, RefreshCw } from 'lucide-react';
import useThemeStore from '../../shared/store/Themestore';
import './EmailConfirmation.scss';

const EmailConfirmationError = () => {
    const navigate = useNavigate();
    const { themes, currentSeason, font } = useThemeStore();
    const currentTheme = themes[currentSeason];

    return (
        <div className="email-confirmation-container"
            style={{
                backgroundColor: currentTheme.homepageBackgroundColor,
                color: currentTheme.defaultTextColor
            }}>
            <div className="confirmation-card error">
                <div className="icon-container">
                    <XCircle size={48} className="error-icon" />
                </div>
                <h1 style={{ fontFamily: font.nomalFont }}>
                    이메일 인증 실패
                </h1>
                <p style={{ fontFamily: font.nomalFont }}>
                    이메일 확인 중 문제가 발생했습니다.
                </p>
                <p className="error-detail" style={{ fontFamily: font.nomalFont }}>
                    링크가 만료되었거나 잘못되었을 수 있습니다.
                </p>
                <div className="button-group">
                    <button
                        className="retry-button"
                        onClick={() => window.location.reload()}
                        style={{
                            backgroundColor: currentTheme.buttonBackgroundColor,
                            color: currentTheme.buttonTextColor,
                            fontFamily: font.nomalFont
                        }}
                    >
                        <RefreshCw size={16} />
                        다시 시도
                    </button>
                    <button
                        className="home-button"
                        onClick={() => navigate('/')}
                        style={{
                            backgroundColor: currentTheme.buttonBackgroundColor,
                            color: currentTheme.buttonTextColor,
                            fontFamily: font.nomalFont
                        }}
                    >
                        메인으로 이동
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EmailConfirmationError;