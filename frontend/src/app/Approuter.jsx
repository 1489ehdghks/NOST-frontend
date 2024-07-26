import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom'; // Added Navigate import
import { jwtDecode } from 'jwt-decode';
import HomePage from '../pages/home/HomePage';
import MainPage from '../pages/main/MainPage';
import useAuthStore from '../shared/store/AuthStore';
import Profile from '../pages/profile/Profile';
import Mybooklist from '../pages/mybooks/Mybooklist';
import BookDetail from '../widgets/book/BookDetail';
import SideLayout from '../widgets/layout/sideLayout/SideLayout';
import SettingsPage from '../pages/settings/SettingsPage';
import NotFound from '../pages/NotFound';

const AppRouter = () => {
    const { isLoggedIn, token, logout } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            const handleLogout = () => {
                logout();
                navigate('/');
            };

            try {
                const decodedToken = jwtDecode(token);
                const expirationTime = decodedToken.exp * 1000;
                const timeoutId = setTimeout(handleLogout, expirationTime - Date.now());

                return () => clearTimeout(timeoutId);
            } catch (error) {
                handleLogout();
            }
        }
    }, [token, logout, navigate]);


    return (
        <Routes>
            <Route path="/" element={isLoggedIn ? <MainPage /> : <HomePage />} />
            <Route path="/main" element={isLoggedIn ? <MainPage /> : <Navigate to="/" />} />
            <Route path="/profile" element={isLoggedIn ? <SideLayout><Profile /></SideLayout> : <Navigate to="/" />} />
            <Route path="/mybooklist" element={isLoggedIn ? <SideLayout><Mybooklist /></SideLayout> : <Navigate to="/" />} />
            <Route path="/book/:id" element={isLoggedIn ? <SideLayout><BookDetail /></SideLayout> : <Navigate to="/" />} />
            <Route path="/settings" element={isLoggedIn ? <SideLayout><SettingsPage /></SideLayout> : <Navigate to="/" />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default AppRouter;
