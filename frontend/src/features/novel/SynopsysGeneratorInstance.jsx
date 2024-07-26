import axiosInstance from '../../shared/utils/AxiosInstance';
import useGlobalStore from '../../shared/store/GlobalStore';

export const generateSynopsis = async (requestData) => {
    const { setIsLoading, setError } = useGlobalStore.getState();
    setIsLoading(true);
    setError(null);
    try {
        const response = await axiosInstance.post('/api/books/', requestData);
        const data = response.data;
        setIsLoading(false);
        return { success: true, data };
    } catch (error) {
        console.error("Error generating synopsis:", error);
        setError(error.response?.data || 'Failed to generate synopsis');
        setIsLoading(false);
        return { success: false, errors: error.response?.data || 'An unexpected error occurred. Please try again.' };
    }
};
