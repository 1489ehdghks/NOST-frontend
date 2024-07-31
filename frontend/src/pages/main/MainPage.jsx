import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import useThemeStore from '../../shared/store/Themestore';
import useGlobalStore from '../../shared/store/GlobalStore';
import useAuthStore from '../../shared/store/AuthStore';
import { fetchBooks } from '../../features/novel/NovelListInstance';
import NovelCard from '../../widgets/card/NovelCard';
import SideLayout from '../../widgets/layout/sideLayout/SideLayout';
import './MainPage.scss';

const MainPage = () => {
    const { themes, currentSeason } = useThemeStore();
    const currentTheme = themes[currentSeason];
    const [sortOption, setSortOption] = useState('newest');
    const [novels, setNovels] = useState([]);
    const [myNovels, setMyNovels] = useState([]);
    const [showMoreMyNovels, setShowMoreMyNovels] = useState(false);
    const [showMoreNovelShowcase, setShowMoreNovelShowcase] = useState(false);
    const [currentPageMyNovels, setCurrentPageMyNovels] = useState(1);
    const [currentPageNovelShowcase, setCurrentPageNovelShowcase] = useState(1);
    const novelsPerPageMyNovels = showMoreMyNovels ? 20 : 5;
    const novelsPerPageNovelShowcase = showMoreNovelShowcase ? 20 : 5;
    const { isLoading } = useGlobalStore();
    const { userId: currentUserId } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNovels = async () => {
            const response = await fetchBooks();
            if (response.success) {
                let filteredNovels = response.data;
                sortNovels(filteredNovels, sortOption);
                setNovels(filteredNovels);
                setMyNovels(response.data.filter(novel => novel.user_id === currentUserId));
            } else {
                setNovels([]);
                setMyNovels([]);
            }
        };
        fetchNovels();
    }, [sortOption, currentUserId]);

    const handleSortChange = useCallback((e) => {
        const { value } = e.target;
        setSortOption(value);
    }, []);

    const sortNovels = useCallback((novels, criteria) => {
        switch (criteria) {
            case 'newest':
                novels.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                break;
            case 'popular':
                novels.sort((a, b) => b.is_liked.length - a.is_liked.length);
                break;
            case 'rating':
                novels.sort((a, b) => b.average_rating - a.average_rating);
                break;
            case 'userbooks':
                novels.sort((a, b) => a.user_id === currentUserId ? -1 : 1);
                break;
            default:
                break;
        }
    }, [currentUserId]);

    const handleNovelClick = useCallback((id) => {
        navigate(`/book/${id}`);
    }, [navigate]);

    const handleShowMoreMyNovels = useCallback(() => {
        setShowMoreMyNovels(prev => !prev);
    }, []);

    const handleShowMoreNovelShowcase = useCallback(() => {
        setShowMoreNovelShowcase(prev => !prev);
    }, []);

    const paginate = useCallback((novels, currentPage, novelsPerPage) => {
        const indexOfLastNovel = currentPage * novelsPerPage;
        const indexOfFirstNovel = indexOfLastNovel - novelsPerPage;
        return novels.slice(indexOfFirstNovel, indexOfLastNovel);
    }, []);

    const generatePagination = useCallback((novels, novelsPerPage) => {
        const totalPages = Math.ceil(novels.length / novelsPerPage);
        const pageNumbers = [];
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(i);
        }
        return pageNumbers;
    }, []);

    const handleClickMyNovels = useCallback((page) => {
        setCurrentPageMyNovels(page);
    }, []);

    const handleClickNovelShowcase = useCallback((page) => {
        setCurrentPageNovelShowcase(page);
    }, []);

    const paginatedMyNovels = useMemo(() => paginate(myNovels, currentPageMyNovels, novelsPerPageMyNovels), [myNovels, currentPageMyNovels, novelsPerPageMyNovels, paginate]);
    const paginatedNovelShowcase = useMemo(() => paginate(novels, currentPageNovelShowcase, novelsPerPageNovelShowcase), [novels, currentPageNovelShowcase, novelsPerPageNovelShowcase, paginate]);
    const myNovelsPagination = useMemo(() => generatePagination(myNovels, novelsPerPageMyNovels), [myNovels, novelsPerPageMyNovels, generatePagination]);
    const novelShowcasePagination = useMemo(() => generatePagination(novels, novelsPerPageNovelShowcase), [novels, novelsPerPageNovelShowcase, generatePagination]);

    return (
        <div className="mainPage" style={{ backgroundColor: currentTheme.mainpageBackgroundColor, color: currentTheme.textColor }}>
            <SideLayout>
                <div className='myNovelList'>
                    <div className="listHeader">
                        <h1 style={{ color: currentTheme.buttonTextColor }}>My Novel</h1>
                        <button className='mainPageButton' onClick={handleShowMoreMyNovels} style={{ backgroundColor: currentTheme.buttonBackgroundColor, color: currentTheme.buttonTextColor }}>
                            {showMoreMyNovels ? 'Show Less -' : 'Show More +'}
                        </button>
                    </div>
                    <div className="cardList">
                        {!isLoading && paginatedMyNovels.map((novel) => (
                            <NovelCard
                                key={novel.id}
                                id={novel.id}
                                image={novel.image}
                                header={novel.title}
                                likes={novel.is_liked.length}
                                rating={novel.average_rating}
                                onClick={() => handleNovelClick(novel.id)}
                            />
                        ))}
                    </div>
                    {showMoreMyNovels && (
                        <div className="pagination">
                            {myNovelsPagination.map((page) => (
                                <button
                                    key={page}
                                    onClick={() => handleClickMyNovels(page)}
                                    className={currentPageMyNovels === page ? 'active' : ''}>
                                    {page}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className='sortedList'>
                    <div className="listHeader" style={{ paddingTop: '100px' }}>
                        <h1 style={{ color: currentTheme.buttonTextColor }}>Novel Showcase</h1>
                        <div className="headerControls">
                            <select className='mainPageSelect' value={sortOption} onChange={handleSortChange} style={{ backgroundColor: currentTheme.buttonBackgroundColor, color: currentTheme.buttonTextColor }}>
                                <option value="newest">Newest</option>
                                <option value="popular">Most Popular</option>
                                <option value="rating">Highest Rated</option>
                                <option value="userbooks">My Novels</option>
                            </select>
                            <button className='mainPageButton' onClick={handleShowMoreNovelShowcase} style={{ backgroundColor: currentTheme.buttonBackgroundColor, color: currentTheme.buttonTextColor }}>
                                {showMoreNovelShowcase ? 'Show Less -' : 'Show More +'}
                            </button>
                        </div>
                    </div>
                    <div className="cardList">
                        {!isLoading && paginatedNovelShowcase.map((novel) => (
                            <NovelCard
                                key={novel.id}
                                id={novel.id}
                                image={novel.image}
                                header={novel.title}
                                likes={novel.is_liked.length}
                                rating={novel.average_rating}
                                onClick={() => handleNovelClick(novel.id)}
                            />
                        ))}
                    </div>
                    {showMoreNovelShowcase && (
                        <div className="pagination" style={{ paddingBottom: '100px' }}>
                            {novelShowcasePagination.map((page) => (
                                <button
                                    key={page}
                                    onClick={() => handleClickNovelShowcase(page)}
                                    className={currentPageNovelShowcase === page ? 'active' : ''}>
                                    {page}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </SideLayout>
        </div>
    );
};

export default MainPage;
