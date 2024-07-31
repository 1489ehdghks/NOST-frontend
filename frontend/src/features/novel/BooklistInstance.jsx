import axiosInstance from '../../shared/utils/AxiosInstance';

export const fetchUserBookList = async () => {
    try {
        const response = await axiosInstance.get('https://stella.com/api/books/userbooks/');
        return { success: true, data: response.data };
    } catch (error) {
        console.error('There was an error fetching the books!', error);
        return { success: false, error: error.message };
    }
};
