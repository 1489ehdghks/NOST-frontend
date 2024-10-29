import useAuthStore from '../../shared/store/AuthStore';
import useGlobalStore from '../../shared/store/GlobalStore';
import axiosInstance from '../../shared/utils/AxiosInstance';
import { jwtDecode } from 'jwt-decode';

export const login = async (email, password) => {
    try {
        const response = await axiosInstance.post('/api/accounts/login/', {
            email,
            password: password.trim()
        });

        useAuthStore.getState().setAuthState({
            token: response.data.access,
            refreshToken: response.data.refresh,
            user: response.data.user
        });

        return { success: true };
    } catch (error) {
        console.error("Login error:", error.response?.data);

        // 서버로부터 받은 에러 데이터 확인
        const errorData = error.response?.data || {};

        return {
            success: false,
            errors: {
                // errors 객체가 있으면 그대로 사용, 없으면 detail 메시지 사용
                ...(errorData.errors || {
                    detail: errorData.detail || '로그인 중 오류가 발생했습니다.'
                })
            }
        };
    }
};
