import axiosInstance from "../../shared/utils/AxiosInstance";
import useGlobalStore from '../../shared/store/GlobalStore';

export const searchNovelByTag = async (tag) => {
    const { setError } = useGlobalStore.getState();

    setError(null);

    try {
        const response = await axiosInstance.get(`/api/books/search_by_tags/?tag=${tag}`);
        console.log("searchNovelByTag response:", response)
        return { success: true, data: response.data };
    } catch (error) {
        console.error('Error searching novels by tag:', error);
        setError(error.response?.data || 'Failed to search novels by tag');
        return { success: false, errors: error.response?.data || 'An unexpected error occurred.' };
    }
};

export const fetchPopularTags = async () => {
    const { setIsLoading, setError } = useGlobalStore.getState();
    setError(null);

    try {
        const response = await axiosInstance.get('/api/books/popular_tags/');
        console.log("fetchPopularTags response:", response)
        return { success: true, data: response.data };
    } catch (error) {
        console.error('Error fetching popular tags:', error);
        setError(error.response?.data || 'Failed to fetch popular tags');
        return { success: false, errors: error.response?.data || 'An unexpected error occurred.' };
    }
};

export const fetchPopularBooks = async () => {
    const { setError } = useGlobalStore.getState();
    setError(null);

    try {
        const response = await axiosInstance.get('/api/books/popular_books/');
        console.log("fetchPopularBooks response:", response)
        return { success: true, data: response.data };
    } catch (error) {
        console.error('Error fetching popular books:', error);
        setError(error.response?.data || 'Failed to fetch popular books');
        return { success: false, errors: error.response?.data || 'An unexpected error occurred.' };
    }
};

export const fetchRecentSearches = async () => {
    const { setError } = useGlobalStore.getState();
    setError(null);

    try {
        const response = await axiosInstance.get('/api/books/recent_searches/');
        console.log("fetchRecentSearches response:", response)
        return { success: true, data: response.data };
    } catch (error) {
        console.error('Error fetching recent searches:', error);
        setError(error.response?.data || 'Failed to fetch recent searches');
        return { success: false, errors: error.response?.data || 'An unexpected error occurred.' };
    }
};
