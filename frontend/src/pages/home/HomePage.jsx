import React, { useState, useEffect } from 'react';
import useThemeStore from '../../shared/store/Themestore';
import LoginModal from '../../widgets/modal/LoginModal';
import ThemedButton from '../../widgets/button/ThemedButton';
import HomePageFooter from '../../widgets/layout/HomePageFooter/HomePageFooter';
import './HomePage.scss';

const HomePage = () => {
  const { font, themes, currentSeason } = useThemeStore();
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(themes[currentSeason].background);
  const [nextImage, setNextImage] = useState(null);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  useEffect(() => {
    const highResImage = themes[currentSeason].background;

    const highQualityImg = new Image();
    highQualityImg.src = highResImage;
    highQualityImg.onload = () => {
      setNextImage(highResImage);
    };
  }, [currentSeason, themes]);

  useEffect(() => {
    if (nextImage) {
      const timeout = setTimeout(() => {
        setCurrentImage(nextImage);
        setNextImage(null);
      }, 1000); // 애니메이션 지속 시간과 동일하게 설정

      return () => clearTimeout(timeout);
    }
  }, [nextImage]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
        setModalOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const currentTheme = themes[currentSeason];

  return (
    <div className="homePage">
      <div className="content" style={{ backgroundColor: currentTheme.homepageBackgroundColor, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)', padding: '40px 60px', borderRadius: '10px', backdropFilter: 'blur(1px)' }}>
        <h1 style={{ color: currentTheme.themeTextColor, textShadow: currentTheme.neonEffect.titleTextShadow, fontFamily: font.nomalFont, marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '2px' }}>Novel Stella</h1>
        <p className="subtitle" style={{ color: currentTheme.defaultTextColor, fontFamily: font.nomalFont, fontSize: '1.2rem', marginBottom: '20px', whiteSpace: 'pre-wrap' }}>
          {currentTheme.subtitle}
        </p>
        <ThemedButton onClick={handleOpenModal} style={{ padding: '10px 20px', borderRadius: '5px', border: 'none', textTransform: 'uppercase', marginBottom: '20px' }}>
          Join
        </ThemedButton>
        <h3 className="TeamText" style={{ color: currentTheme.teamColor, fontFamily: font.rockFont, position: 'absolute', bottom: '10px', right: '20px', letterSpacing: '2px' }}>- Team NOST</h3>
      </div>
      {isModalOpen && <LoginModal onClose={handleCloseModal} />}
      <div className="background">
        <img src={currentImage} alt="Current Season" className="image current" />
        {nextImage && <img src={nextImage} alt="Next Season" className="image next spread-in" />}
      </div>
      <HomePageFooter />
    </div>
  );
};

export default HomePage;
