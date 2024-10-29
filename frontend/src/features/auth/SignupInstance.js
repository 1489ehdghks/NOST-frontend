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
        console.error("Signup error details:", error.response?.data);

        if (error.response?.data) {
            // 서버에서 받은 에러를 객체 형태로 반환
            return {
                success: false,
                errors: error.response.data  // 그대로 반환
            };
        }

        return {
            success: false,
            errors: { general: '회원가입 처리 중 오류가 발생했습니다.' }
        };
    }
};