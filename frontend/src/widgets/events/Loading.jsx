// Loading.jsx
import React from 'react';
import './Loading.scss';
import useThemeStore from '../../shared/store/Themestore';

const Loading = () => {
    const { themes, currentSeason } = useThemeStore();
    const currentTheme = themes[currentSeason];

    return (
        <div className="loading-container">
            <div className="loading-content">
                <div className="loading-spinner">
                    <div className="spinner-ring"></div>
                    <div className="spinner-ring"></div>
                    <div className="spinner-ring"></div>
                    <div className="spinner-ring"></div>
                </div>
                <div className="loading-text">
                    {['L', 'o', 'a', 'd', 'i', 'n', 'g'].map((letter, index) => (
                        <span key={index} className="loading-letter" style={{
                            color: currentTheme.themeTextColor,
                            textShadow: currentTheme.neonEffect.titleTextShadow
                        }}>
                            {letter}
                        </span>
                    ))}
                    <span className="loading-dots">
                        {[...Array(3)].map((_, i) => (
                            <span key={i} className="dot" style={{
                                backgroundColor: currentTheme.themeTextColor
                            }}></span>
                        ))}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Loading;