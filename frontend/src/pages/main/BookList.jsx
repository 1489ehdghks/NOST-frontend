import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useThemeStore from '../../shared/store/Themestore';
import useGlobalStore from '../../shared/store/GlobalStore';
import { fetchBooks } from '../../features/novel/NovelListInstance';
import NovelCard from '../../widgets/card/NovelCard';
import './BookList.scss';

const BookList = () => {
    const { themes, currentSeason } = useThemeStore();
    const currentTheme = themes[currentSeason];
    const [sortOption, setSortOption] = useState('newest');
    const [books, setBooks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const booksPerPage = 8;
    const [showToast, setShowToast] = useState(false);
    const { isLoading, setIsLoading, error, setError } = useGlobalStore();

    useEffect(() => {
        const fetchNovels = async () => {
            const response = await fetchBooks();
            if (response.success) {
                setBooks(response.data);
            } else {
                setBooks([]);
            }
            setShowToast(true);
            const timer = setTimeout(() => {
                setShowToast(false);
            }, 2000);

            return () => clearTimeout(timer);
        };

        fetchNovels();
    }, []);

    useEffect(() => {
        sortNovels(sortOption);
    }, [sortOption]);

    const handleSortChange = (e) => {
        const { value } = e.target;
        setSortOption(value);
    };

    const sortNovels = (criteria) => {
        const sortedNovels = [...books];
        switch (criteria) {
            case 'newest':
                sortedNovels.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                break;
            case 'popular':
                sortedNovels.sort((a, b) => b.is_liked.length - a.is_liked.length);
                break;
            case 'rating':
                sortedNovels.sort((a, b) => b.average_rating - a.average_rating);
                break;
            default:
                break;
        }
        setBooks(sortedNovels);
    };

    const indexOfLastBook = currentPage * booksPerPage;
    const indexOfFirstBook = indexOfLastBook - booksPerPage;
    const currentBooks = isLoading ? Array.from({ length: booksPerPage }, (_, index) => index + 1) : books.slice(indexOfFirstBook, indexOfLastBook);
    const totalPages = isLoading ? 1 : Math.ceil(books.length / booksPerPage);

    const handleClick = (page) => {
        setCurrentPage(page);
    };

    const generatePagination = () => {
        const pageNumbers = [];
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(i);
        }
        return pageNumbers;
    };

    const navigate = useNavigate();
    const handleBookClick = (id) => {
        navigate(`/book/${id}`);
    };

    return (
        <div className="book-list" style={{ backgroundColor: currentTheme.mainpageBackgroundColor, color: currentTheme.textColor }}>
            <div className="header">
                <select value={sortOption} onChange={handleSortChange} style={{ backgroundColor: currentTheme.buttonBackgroundColor, color: currentTheme.buttonTextColor }}>
                    <option value="newest">Newest</option>
                    <option value="popular">Most Popular</option>
                    <option value="rating">Highest Rated</option>
                </select>
            </div>
            <div className="card-list">
                {!isLoading && currentBooks.map((book, index) => (
                    <NovelCard
                        key={index}
                        id={book.id}
                        image={book.image}
                        header={book.title}
                        likes={book.is_liked.length}
                        rating={book.average_rating}
                        onClick={() => handleBookClick(book.id)}
                    />
                ))}
            </div>
            <div className="pagination">
                <button onClick={() => handleClick(1)} disabled={currentPage === 1}> &laquo; </button>
                <button onClick={() => handleClick(currentPage - 1)} disabled={currentPage === 1}> &lt; </button>
                {generatePagination().map((page) => (
                    <button
                        key={page}
                        onClick={() => handleClick(page)}
                        className={currentPage === page ? 'active' : ''}>
                        {page}
                    </button>
                ))}
                <button onClick={() => handleClick(currentPage + 1)} disabled={currentPage === totalPages}> &gt; </button>
                <button onClick={() => handleClick(totalPages)} disabled={currentPage === totalPages}> &raquo; </button>
            </div>
            {showToast && (
                <div className="scrolldown_toast" style={{ backgroundColor: currentTheme.sidebarBg, color: currentTheme.textColor }}>
                    <p>Please scroll down to create a novel</p>
                </div>
            )}
        </div>
    );
};

export default BookList;


//scroll indicator
{/* <div className="scroll-down-indicator">
<a href="#top">
    <span></span>
    <span></span>
    <span></span>
</a>
</div> */}