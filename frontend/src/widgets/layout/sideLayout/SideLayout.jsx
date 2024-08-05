import React, { useState } from 'react';
import { FaBars, FaHome, FaBookOpen, FaPlus, FaUser, FaBook, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../../features/auth/LogoutInstance';
import useThemeStore from '../../../shared/store/Themestore';
import useAuthStore from '../../../shared/store/AuthStore';
import './SideLayout.scss';

const SideLayout = ({ children }) => {
    const { themes, currentSeason } = useThemeStore();
    const { user } = useAuthStore()
    const currentTheme = themes[currentSeason];
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const handleMouseEnter = () => {
        setIsOpen(true);
    };

    const handleMouseLeave = () => {
        setIsOpen(false);
    };

    const handleNavigation = (path) => {
        navigate(path);
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="side-layout" style={{ backgroundColor: currentTheme.mainpageBackgroundColor, color: currentTheme.textColor }}>
            <div
                className={`sidebar ${isOpen ? 'open' : ''}`}
                style={{ backgroundColor: currentTheme.buttonBackgroundColor, color: currentTheme.buttonTextColor }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >

                <div className="menu-item" style={{ color: currentTheme.textColor }} onClick={() => handleNavigation('/')}>
                    <FaHome className="menu-icon" />
                    <span className="menu-text">{isOpen && "Main"}</span>
                </div>

                <div className="menu-item" onClick={() => handleNavigation('/create')}>
                    <FaPlus className="menu-icon" />
                    <span className="menu-text">{isOpen && "Create"}</span>
                </div>
                <div className="menu-item" onClick={() => handleNavigation('/create')}>
                    <FaBookOpen className="menu-icon" />
                    <span className="menu-text">{isOpen && "Library"}</span>
                </div>
                <div className="menu-item" onClick={() => handleNavigation('/Mybooklist')}>
                    <FaBook className="menu-icon" />
                    <span className="menu-text">{isOpen && "Docs"}</span>
                </div>
                <div className="menu-item menu-item-bottom" onClick={() => handleNavigation('/settings')}>
                    <FaCog className="menu-icon" />
                    <span className="menu-text">{isOpen && "Settings"}</span>
                </div>
                <div className="menu-item" onClick={handleLogout}>
                    <FaSignOutAlt className="menu-icon" />
                    <span className="menu-text">{isOpen && "Logout"}</span>
                </div>
                <div className="menu-item " onClick={() => handleNavigation('/profile')}>
                    <FaUser className="menu-icon" />
                    <span className="menu-text">{isOpen && user.nickname}</span>
                </div>
                <div className="menu-item " onClick={() => handleNavigation('/profile')}>
                    <FaUser className="menu-icon" />
                    <span className="menu-text">{isOpen && "user"}</span>
                </div>
            </div>
            <div className={`content ${isOpen ? 'shifted' : ''}`}>
                {children}
            </div>
        </div>
    );
};

export default SideLayout;
