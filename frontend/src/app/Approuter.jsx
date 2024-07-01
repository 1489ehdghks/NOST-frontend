import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import HomePage from '../pages/home/HomePage';
import MainPage from '../pages/main/MainPage';
import useAuthStore from '../shared/store/AuthStore';
import Profile from '../pages/profile/Profile';
import Mybooklist from '../pages/mybooks/Mybooklist';
import BookDetail from '../widgets/book/BookDetail';
import SideLayout from '../widgets/layout/sideLayout/SideLayout';
import SettingsPage from '../pages/settings/SettingsPage'
import NotFound from '../pages/NotFound';

const AppRouter = () => {
    const { isLoggedIn } = useAuthStore();
    const navigate = useNavigate();
    const { token, logout } = useAuthStore(state => ({ token: state.token, logout: state.logout }));

    useEffect(() => {
        if (token) {
            const handleLogout = () => {
                logout();
                navigate('/');
            };

            const decodedToken = jwtDecode(token);
            const expirationTime = decodedToken.exp * 1000;
            const timeoutId = setTimeout(handleLogout, expirationTime - Date.now());

            return () => clearTimeout(timeoutId);
        }
    }, [token, logout, navigate]);



    return (
        <Routes>
            <Route path="/" element={isLoggedIn ? <MainPage /> : <HomePage />} />
            <Route path="/main" element={<MainPage />} />
            <Route path="/profile" element={<SideLayout><Profile /></SideLayout>} />
            <Route path="/Mybooklist" element={<SideLayout><Mybooklist /></SideLayout>} />
            <Route path="/book/:id" element={<SideLayout><BookDetail /></SideLayout>} />
            <Route path="/settings" element={<SideLayout><SettingsPage /></SideLayout>} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default AppRouter;