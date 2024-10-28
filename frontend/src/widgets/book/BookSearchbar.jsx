import React, { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';
import { fetchPopularTags, fetchPopularBooks, fetchRecentSearches } from '../../features/novel/SearchInstance';
import './BookSearchbar.scss';

const SearchBar = ({ onSearch }) => {
    const [query, setQuery] = useState('');
    const [popularTags, setPopularTags] = useState([]);
    const [popularBooks, setPopularBooks] = useState([]);
    const [recentSearches, setRecentSearches] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const tagsResponse = await fetchPopularTags();
            const booksResponse = await fetchPopularBooks();
            const searchesResponse = await fetchRecentSearches();

            setPopularTags(tagsResponse.success ? tagsResponse.data : []);
            setPopularBooks(booksResponse.success ? booksResponse.data : []);
            setRecentSearches(searchesResponse.success ? searchesResponse.data : []);
        };
        fetchData();
    }, []);

    const debouncedSearch = useCallback(
        debounce((value) => {
            if (value) {
                onSearch(value);
            }
        }, 300),
        []
    );

    const handleSearch = (e) => {
        const value = e.target.value;
        setQuery(value);
        debouncedSearch(value);
    };

    const handleDropdownEnter = () => {
        setShowDropdown(true);
    };

    const handleDropdownLeave = () => {
        setShowDropdown(false);
    };
    return (
        <div className="search-bar">
            <input
                type="text"
                value={query}
                onChange={handleSearch}
                onFocus={() => setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                placeholder="Search for books, authors, tags..."
            />
            {showDropdown && (
                <div className="dropdown" onMouseEnter={handleDropdownEnter} onMouseLeave={handleDropdownLeave}>
                    <div className="section">
                        <h3>Popular Tags</h3>
                        {popularTags.map(tag => (
                            <button key={tag.id} onClick={() => onSearch(tag.name)}>{tag.name}</button>
                        ))}
                    </div>
                    <div className="section">
                        <h3>Popular Books This Week</h3>
                        {popularBooks.map(book => (
                            <button key={book.id} onClick={() => onSearch(book.title)}>{book.title}</button>
                        ))}
                    </div>
                    <div className="section">
                        <h3>Recently Searched</h3>
                        {recentSearches.map(book => (
                            <button key={book.id} onClick={() => onSearch(book.title)}>{book.title}</button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchBar;
