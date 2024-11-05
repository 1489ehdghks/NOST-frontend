import useAuthStore from '../../shared/store/AuthStore';
import axiosInstance from '../../shared/utils/AxiosInstance';


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
        const errorData = error.response?.data || {};

        return {
            success: false,
            errors: {
                ...(errorData.errors || {
                    detail: errorData.detail || '로그인 중 오류가 발생했습니다.'
                })
            }
        };
    }
};
