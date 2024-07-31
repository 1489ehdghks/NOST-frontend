import React from 'react';
import useThemeStore from '../../shared/store/Themestore';
import './styles/ThemedButton.scss';

const ThemedButton = ({ children, onClick, className }) => {
    const { themes, currentSeason, isDarkMode } = useThemeStore();

    const currentTheme = themes[currentSeason];
    return (
        <button
            className={`themed-button`}
            onClick={onClick}
            style={{ color: currentTheme.neonEffect.color }}
        >
            {children}
        </button>
    );
};

export default ThemedButton;
