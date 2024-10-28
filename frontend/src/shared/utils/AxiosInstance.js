import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import useAuthStore from '../store/AuthStore';
import config from './config';

const AxiosInstance = axios.create({
    baseURL: `${config.baseURL}`,
    headers: {
        'Content-Type': 'application/json',
    },
    // XSRF 공격 방지
    withCredentials: true,
});

// 토큰 만료 시간 체크 함수 추가
const isTokenExpired = (token) => {
    try {
        const decoded = jwtDecode(token);
        // 만료 5분 전에 갱신 처리
        return decoded.exp < (Date.now() / 1000 + 300);
    } catch {
        return true;
    }
};

AxiosInstance.interceptors.request.use(
    async (config) => {
        const { token, refreshToken, logout } = useAuthStore.getState();

        // 토큰이 있고 만료되었다면 갱신 시도
        if (token && isTokenExpired(token)) {
            try {
                const response = await axios.post(
                    `${config.baseURL}/api/accounts/token/refresh/`,
                    { refresh: refreshToken }
                );
                useAuthStore.getState().setAuthState({
                    token: response.data.access,
                    refreshToken: response.data.refresh,
                    user: jwtDecode(response.data.access)
                });
                config.headers['Authorization'] = `Bearer ${response.data.access}`;
            } catch {
                logout();
                return Promise.reject('Session expired');
            }
        } else if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        // CSRF 토큰 추가
        const csrfToken = document.cookie.match('(^|;)\\s*csrftoken\\s*=\\s*([^;]+)');
        if (csrfToken) {
            config.headers['X-CSRFToken'] = csrfToken[2];
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export default AxiosInstance;