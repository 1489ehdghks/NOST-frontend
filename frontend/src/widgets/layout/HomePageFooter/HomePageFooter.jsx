import React from 'react';
import { FaGithub, FaYoutube } from 'react-icons/fa';
import './HomePageFooter.scss';

const HomePageFooter = () => {
    return (
        <footer className="homePageFooter">
            <div className="footer-left">
                <p>&copy; {new Date().getFullYear()} Team NOST. All rights reserved.</p>
            </div>
            <div className="footer-right">
                <a href="https://github.com/1489ehdghks/NOST-frontend" target="_blank" rel="noopener noreferrer" style={{ color: 'black' }}>
                    <FaGithub size={24} />
                </a>
                <a href="https://www.youtube.com/watch?v=O-UrnsCOSCM" target="_blank" rel="noopener noreferrer" style={{ color: 'red' }}>
                    <FaYoutube size={24} />
                </a>
            </div>
        </footer>
    );
};

export default HomePageFooter;
