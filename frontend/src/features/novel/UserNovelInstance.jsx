import useGlobalStore from '../../shared/store/GlobalStore';
import axiosInstance from '../../shared/utils/AxiosInstance';



//소설 가져오기 fetchBooks
export const getNovel = async () => {
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




//유저의 소설 가져오기 fetchUserBookList
export const getUserNovelInstance = async () => {
    try {
        const response = await axiosInstance.get('/api/books/userbooks/');
        return { success: true, data: response.data };
    } catch (error) {
        console.error('There was an error fetching the books!', error);
        return { success: false, error: error.message };
    }
};



//좋아요 누른 소설 가져오기 getUserLikedBooks
export const getUserLikedNovelInstance = async () => {
    try {
        const response = await axiosInstance.get('/api/books/userlikedbooks/');
        return { success: true, data: response.data };
    } catch (error) {
        console.error('Error fetching liked books:', error);
        return { success: false, errors: error.response?.data || 'Failed to fetch liked books' };
    }
};

