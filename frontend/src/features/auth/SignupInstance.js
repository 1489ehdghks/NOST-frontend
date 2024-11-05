import useGlobalStore from '../../shared/store/GlobalStore';
import axiosInstance from '../../shared/utils/AxiosInstance';

export const signup = async (email, password1, password2, nickname) => {
    try {
        const response = await axiosInstance.post('/api/accounts/registration/', {
            email,
            password1,
            password2,
            nickname,
        });
        return { success: true, data: response.data };
    } catch (error) {
        if (error.response?.data) {
            return {
                success: false,
                errors: error.response.data
            };
        }

        return {
            success: false,
            errors: { general: '회원가입 처리 중 오류가 발생했습니다.' }
        };
    }
};