import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useBookStore from '../../shared/store/BookStore';
import useThemeStore from '../../shared/store/Themestore';
import axiosInstance from '../../shared/utils/AxiosInstance';
import './Mybooklist.scss';

const Card = ({ id, image, header, likes, rating, onClick }) => {
  const title = useBookStore((state) => state.title);
  const formatTitle = (title) => title.split(' ').join('_');
  const defaultImage = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQT6uhVlGoDqJhKLfS9W_HQOoWJCf-_lsBZzw&s'; // 기본 이미지 URL을 설정합니다.
  const imageUrl = title ? `https://mynostbucket.s3.ap-northeast-2.amazonaws.com/books/${formatTitle(title)}.png` : defaultImage;

  return (
    <div className="card" style={{ backgroundImage: `url(${imageUrl})` }} onClick={() => onClick(id)}>
      <div className="card-header"><h1>{header}</h1></div>
      <div className="card-content">
        <p> ❤️ {likes}</p>
        <p>
          {'⭐'.repeat(Math.min(Math.floor(rating), 5))}
          {rating % 1 !== 0 ? (rating % 1 >= 0.5 ? '⭐' : '☆') : ''}
          {'☆'.repeat(Math.max(5 - Math.ceil(rating), 0))} {rating} / 5
        </p>
      </div>
    </div>
  );
};

const Mybooklist = () => {
  const { themes, currentSeason } = useThemeStore();
  const currentTheme = themes[currentSeason];

  const [mybooks, setMyBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 8;

  useEffect(() => {
    const fetchUserBooks = async () => {
      try {
        const response = await axiosInstance.get('https://nost-stella.com/api/books/userbooks/');
        setMyBooks(response.data);
        console.log('data:', response.data);
      } catch (error) {
        console.error('There was an error fetching the books!', error);
      }
    };

    fetchUserBooks();
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
          <Card
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
