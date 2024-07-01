import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import useAuthStore from '../../shared/store/AuthStore';
import config from '../../shared/utils/Config';

// Axios 인스턴스 생성
const axiosInstance = axios.create({
    baseURL: 'config.baseURL',
    headers: {
        'Content-Type': 'application/json',
    },
});

// 요청 인터셉터: 모든 요청에 액세스 토큰을 추가
axiosInstance.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token;
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 응답 인터셉터: 액세스 토큰 만료 시 자동으로 리프레시 토큰을 사용해 갱신
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        const { refreshToken, setAuthState, logout } = useAuthStore.getState();

        if (error.response && error.response.status === 401 && !originalRequest._retry && refreshToken) {
            originalRequest._retry = true;

            try {
                const response = await axios.post('https://nost-stella.com/api/accounts/token/refresh/', { refresh: refreshToken });
                const newAccessToken = response.data.access;
                const newRefreshToken = response.data.refresh;
                const user = jwtDecode(newAccessToken);
                setAuthState({ token: newAccessToken, refreshToken: newRefreshToken, user });
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                logout();
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
