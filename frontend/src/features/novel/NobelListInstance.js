import axiosInstance from '../../shared/utils/AxiosInstance';
import useGlobalStore from '../../shared/store/GlobalStore';

export const fetchBooks = async () => {
    const { setIsLoading, setError } = useGlobalStore.getState();
    setIsLoading(true);
    setError(null);
    try {
        const response = await axiosInstance.get('/api/books/');
        const data = response.data;
        setIsLoading(false);
        return { success: true, data };
    } catch (error) {
        console.error("Error fetching books:", error);
        setError(error.response?.data || 'Failed to fetch books');
        setIsLoading(false);
        return { success: false, errors: error.response?.data || 'An unexpected error occurred. Please try again.' };
    }
};
