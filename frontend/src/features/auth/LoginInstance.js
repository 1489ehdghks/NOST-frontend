import useAuthStore from '../../shared/store/AuthStore';
import useGlobalStore from '../../shared/store/GlobalStore';
import axiosInstance from '../../shared/utils/AxiosInstance';

export const login = async (email, password) => {
    useGlobalStore.getState().setError(null);
    try {
        const response = await axiosInstance.post('/api/accounts/login/', { email, password });
        const data = response.data;

        useAuthStore.getState().setAuthState({
            token: data.access,
            refreshToken: data.refresh,
            user: data.user
        });
    } catch (err) {
        if (err.response && err.response.data) {
            const errorData = err.response.data;
            console.log("로그인 에러:", errorData);
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
        } else {

        }
    } finally {
        useGlobalStore.getState().setIsLoading(false);
    }
};
