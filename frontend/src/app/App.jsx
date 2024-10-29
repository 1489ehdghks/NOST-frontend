import React, { useEffect } from 'react';
import './styles/App.scss';
import AppRouter from './Approuter';
import { BrowserRouter } from 'react-router-dom';
import useThemeStore from '../shared/store/Themestore';
import ThemeMode from '../widgets/button/ThemeMode';
import Blossom from '../widgets/events/Blossom';
import Rain from '../widgets/events/Rain';
import FallenLeaves from '../widgets/events/FallenLeaves';
import Snow from '../widgets/events/FallenSnow';
import useGlobalStore from '../shared/store/GlobalStore';
import Loading from '../widgets/events/Loading';
import { ToastContainer } from 'react-toastify';

function App() {
  const { currentSeason, setSeason, setCanChangeTheme, canChangeTheme } = useThemeStore();
  const { isLoading } = useGlobalStore();

  const getSeasonEffect = () => {
    switch (currentSeason) {
      case 'spring':
        return <Blossom />;
      case 'summer':
        return <Rain />;
      case 'autumn':
        return <FallenLeaves />;
      case 'winter':
        return <Snow />;
      default:
        return null;
    }
  };

  const handleSeasonChange = (season) => {
    if (canChangeTheme) {
      setSeason(season);
      setCanChangeTheme(false);
      setTimeout(() => {
        setCanChangeTheme(true);
      }, 3000);
    }
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {isLoading && <Loading />}
      <div className={`App ${currentSeason}`}>
        <div className="theme-toggles">
          <ThemeMode currentSeason={currentSeason} setSeason={handleSeasonChange} disabled={!canChangeTheme} />
        </div>
        <div className="background">
          <BrowserRouter>
            <AppRouter />
          </BrowserRouter>
          <div className="season-effect">
            {getSeasonEffect()}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
