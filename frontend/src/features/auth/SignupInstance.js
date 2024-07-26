import useGlobalStore from '../../shared/store/GlobalStore';
import axiosInstance from '../../shared/utils/AxiosInstance';



export const signup = async (email, password1, password2, nickname) => {
    const { setError } = useGlobalStore.getState();
    setError(null);
    try {
        const response = await axiosInstance.post('/api/accounts/', {
            email,
            password1,
            password2,
            nickname,
        });
        const data = response.data;
        return { success: true, data };
    } catch (error) {
        console.error("Sign up error:", error);
        setError(error.response?.data || 'Sign Up failed');
        if (error.response && error.response.data) {
            return { success: false, errors: error.response.data };
        }
        return { success: false, errors: { non_field_errors: ['An unexpected error occurred. Please try again.'] } };
    }
};