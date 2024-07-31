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
      }, 1000);
    }
  };

  return (
    <>
      {isLoading && <Loading />}
      <div className="App">
        <div className="theme-toggles">
          <ThemeMode currentSeason={currentSeason} setSeason={handleSeasonChange} />
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
