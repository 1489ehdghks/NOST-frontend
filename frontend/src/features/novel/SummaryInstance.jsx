import axiosInstance from '../../shared/utils/AxiosInstance';
import useGlobalStore from '../../shared/store/GlobalStore';

export const deletePrologue = async (bookId) => {
    const { setIsLoading, setError } = useGlobalStore.getState();
    setIsLoading(true);
    setError(null);
    try {
        await axiosInstance.delete(`/api/books/${bookId}/del_prol/`);
        setIsLoading(false);
        return { success: true };
    } catch (error) {
        console.error("Error deleting prologue:", error);
        setError(error.response?.data || 'Failed to delete prologue');
        setIsLoading(false);
        return { success: false, errors: error.response?.data || 'An unexpected error occurred. Please try again.' };
    }
};

export const generatePrologue = async (bookId, prompt, language) => {
    const { setIsLoading, setError } = useGlobalStore.getState();
    setIsLoading(true);
    setError(null);
    try {
        const response = await axiosInstance.post(`/api/books/${bookId}/`, { summary: prompt, language });
        setIsLoading(false);
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Error generating prologue:", error);
        setError(error.response?.data || 'Failed to generate prologue');
        setIsLoading(false);
        return { success: false, errors: error.response?.data || 'An unexpected error occurred. Please try again.' };
    }
};

export const generateSummary = async (bookId, prompt, language) => {
    const { setIsLoading, setError } = useGlobalStore.getState();
    setIsLoading(true);
    setError(null);
    try {
        const response = await axiosInstance.post(`/api/books/${bookId}/`, { summary: prompt, language });
        setIsLoading(false);
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Error generating summary:", error);
        setError(error.response?.data || 'Failed to generate summary');
        setIsLoading(false);
        return { success: false, errors: error.response?.data || 'An unexpected error occurred. Please try again.' };
    }
};
