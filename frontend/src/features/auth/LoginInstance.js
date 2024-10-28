import useAuthStore from '../../shared/store/AuthStore';
import useGlobalStore from '../../shared/store/GlobalStore';
import axiosInstance from '../../shared/utils/AxiosInstance';
import { jwtDecode } from 'jwt-decode'; // jwt-decode import 추가

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15분

let loginAttempts = 0;
let lockoutUntil = null;

// 에러 처리 함수 추가
const handleLoginError = (err) => {
    if (err.response && err.response.data) {
        const errorData = err.response.data;
        let errorMessage = 'Login failed';

        if (errorData.non_field_errors) {
            errorMessage = errorData.non_field_errors.join(' ');
            alert(errorMessage);
        } else if (errorData.email) {
            errorMessage = 'The email address is not registered';
            alert(errorMessage);
        } else if (errorData.password) {
            errorMessage = 'Incorrect password';
            alert(errorMessage);
        }
        useGlobalStore.getState().setError(errorMessage);
    }
};

export const login = async (email, password) => {
    useGlobalStore.getState().setError(null);

    if (lockoutUntil && Date.now() < lockoutUntil) {
        const remainingTime = Math.ceil((lockoutUntil - Date.now()) / 1000 / 60);
        throw new Error(`Too many login attempts. Please try again in ${remainingTime} minutes.`);
    }

    try {
        const response = await axiosInstance.post('/api/accounts/login/', {
            email,
            password: password.trim()
        });

        loginAttempts = 0;
        const { access, refresh, user } = response.data;

        try {
            const decodedToken = jwtDecode(access);
            if (!decodedToken.exp || decodedToken.exp < Date.now() / 1000) {
                throw new Error('Invalid token');
            }
        } catch {
            throw new Error('Invalid token received');
        }

        useAuthStore.getState().setAuthState({ token: access, refreshToken: refresh, user });

    } catch (err) {
        loginAttempts++;

        if (loginAttempts >= MAX_LOGIN_ATTEMPTS) {
            lockoutUntil = Date.now() + LOCKOUT_TIME;
            throw new Error(`Too many login attempts. Please try again in 15 minutes.`);
        }

        handleLoginError(err);
    }
};