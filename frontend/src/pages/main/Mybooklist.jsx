import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NovelCard from '../../widgets/card/NovelCard';
import useThemeStore from '../../shared/store/Themestore';
import { fetchUserBookList } from '../../features/novel/BooklistInstance';
import './Mybooklist.scss';



const Mybooklist = () => {
  const { themes, currentSeason } = useThemeStore();
  const currentTheme = themes[currentSeason];

  const [mybooks, setMyBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 8;

  useEffect(() => {
    const fetchBooks = async () => {
      const response = await fetchUserBookList();
      if (response.success) {
        setMyBooks(response.data);
      } else {
        console.error(response.error);
      }
    };

    fetchBooks();
  }, []);

  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = mybooks.slice(indexOfFirstCard, indexOfLastCard);

  const totalPages = Math.ceil(mybooks.length / cardsPerPage);

  const handleClick = (number) => {
    setCurrentPage(number);
  };

  const generatePagination = () => {
    const pages = [];
    const maxPagesToShow = 5;
    const halfPagesToShow = Math.floor(maxPagesToShow / 2);

    let startPage = Math.max(currentPage - halfPagesToShow, 1);
    let endPage = Math.min(startPage + maxPagesToShow - 1, totalPages);

    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(endPage - maxPagesToShow + 1, 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const navigate = useNavigate();
  const handleCardClick = (id) => {
    navigate(`/book/${id}`);
  };

  return (
    <div className="container" style={{ color: currentTheme.textColor }}>
      <h1 className="title">My Book List</h1>
      <div className="cardlist">
        {currentCards.map((card) => (
          <NovelCard
            key={card.id}
            id={card.id}
            image={card.image}
            header={card.title}
            likes={card.is_liked.length || 0}
            rating={card.average_rating || 0}
            onClick={handleCardClick}
          />
        ))}
      </div>
      <div className="pagination">
        <button onClick={() => handleClick(1)} disabled={currentPage === 1}> &laquo; </button>
        <button onClick={() => handleClick(currentPage - 1)} disabled={currentPage === 1}> &lt; </button>
        {generatePagination().map((page, index) => (
          <button
            key={index}
            onClick={() => handleClick(page)}
            className={currentPage === page ? 'active' : ''}>
            {page}
          </button>
        ))}
        <button onClick={() => handleClick(currentPage + 1)} disabled={currentPage === totalPages}> &gt; </button>
        <button onClick={() => handleClick(totalPages)} disabled={currentPage === totalPages}> &raquo; </button>
      </div>
    </div>
  );
};

export default Mybooklist;
