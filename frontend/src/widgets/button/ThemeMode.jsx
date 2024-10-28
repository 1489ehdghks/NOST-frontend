import React from 'react';
import { FaLeaf, FaCloudRain, FaRegSnowflake, FaSun } from 'react-icons/fa';
import './styles/ThemeMode.scss';

const SEASON_CONFIG = {
    spring: {
        icon: FaSun,
        label: 'Spring Theme',
        ariaLabel: 'Switch to Spring theme'
    },
    summer: {
        icon: FaCloudRain,
        label: 'Summer Theme',
        ariaLabel: 'Switch to Summer theme'
    },
    autumn: {
        icon: FaLeaf,
        label: 'Autumn Theme',
        ariaLabel: 'Switch to Autumn theme'
    },
    winter: {
        icon: FaRegSnowflake,
        label: 'Winter Theme',
        ariaLabel: 'Switch to Winter theme'
    }
};

const ThemeModeToggle = ({ currentSeason, setSeason, disabled }) => {
    const handleSeasonChange = (season) => {
        if (disabled || season === currentSeason) return;
        setSeason(season);
    };

    const renderSeasonButton = (season) => {
        const { icon: Icon, label, ariaLabel } = SEASON_CONFIG[season];
        const isActive = currentSeason === season;

        return (
            <button
                key={season}
                className={`season-icon ${isActive ? 'active' : ''} ${disabled ? 'disabled' : ''}`}
                onClick={() => handleSeasonChange(season)}
                disabled={disabled}
                aria-label={ariaLabel}
                title={label}
            >
                <Icon />
                <span className="sr-only">{label}</span>
            </button>
        );
    };

    return (
        <div
            className="theme-mode-toggle"
            role="group"
            aria-label="Theme selection"
        >
            {Object.keys(SEASON_CONFIG).map(renderSeasonButton)}
        </div>
    );
};

export default React.memo(ThemeModeToggle);