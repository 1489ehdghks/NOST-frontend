import { create } from 'zustand';
import spring from '../asset/image/spring.png'
import springLow from '../asset/image/spring_low.jpg'
import springCard from '../../shared/asset/cardImage/spring.png'
import summer from '../asset/image/summer.png'
import summerLow from '../asset/image/summer_low.jpg'
import summerCard from '../../shared/asset/cardImage/fallenRain.png'
import autumn from '../asset/image/autumn.png'
import autumnLow from '../asset/image/autumn_low.jpg'
import autumnCard from '../../shared/asset/cardImage/fall.png'
import winter from '../asset/image/winter.png'
import winterLow from '../asset/image/winter_low.jpg'
import winterCard from '../../shared/asset/cardImage/winter.png'
import { preloadImage, validateSeason } from '../utils/ThemeUtils';

const useThemeStore = create((setState, getState) => ({
    currentSeason: 'spring',
    canChangeTheme: true,
    isLoading: false,
    loadedImages: new Set(),

    // 폰트 설정
    font: {
        shapeFont: "'Nanum Myeongjo', serif",
        nomalFont: "Averia Gruesa Libre, system-ui",
        nomalFont2: "Indie Flower, cursive",
        popFont: "Permanent Marker, cursive",
        rockFont: "Rock Salt, cursive",
        rockFont2: "Zeyada, cursive",
        scaryFont: "Creepster, system-ui",
        thickFont: "Poetsen One, sans-serif",
        titanFont: "Titan One, sans-serif",
    },

    // 테마 설정
    themes: {
        spring: {
            background: spring,
            lowBackground: springLow,
            cardbackground: springCard,
            defaultTextColor: '#DB7093',
            themeTextColor: '#ffffff',
            blackColor: '#000000',
            homepageBackgroundColor: '#ffffff',
            titleColor: '#FF69B4',
            subtitle: 'Experience the rebirth of nature with Novel Stella. Experience the rebirth of nature.',
            sidebarBg: '#FFD1DC',
            buttonBackgroundColor: '#FFEBEE',
            buttonTextColor: '#DB7093',
            teamColor: '#000',
            drinkColor: '#FF69B4',
            neonEffect: {
                color: '#DB7093',
                titleTextShadow: '0 0 5px #FFD1DC, 0 0 10px #FFD1DC, 0 0 20px #FFB6C1, 0 0 30px #FFB6C1, 0 0 40px #ff0080, 0 0 55px #FFEBEE, 0 0 75px #DB7093',
            }
        },
        summer: {
            background: summer,
            lowBackground: summerLow,
            cardbackground: summerCard,
            defaultTextColor: '#e0c7ff',
            themeTextColor: '#ffffff',
            blackColor: '#000000',
            homepageBackgroundColor: '#001f3f',
            titleColor: '#00FFFF',
            subtitle: 'Find calmness in the summer rain with Novel Stella. Find calmness in the summer rain.',
            sidebarBg: '#B0C4DE',
            buttonBackgroundColor: '#b7e1ff',
            buttonTextColor: '#07283f',
            teamColor: '#fff',
            drinkColor: '#001f3f',
            neonEffect: {
                color: '#701198',
                titleTextShadow: '0 0 5px #fff, 0 0 10px #fff, 0 0 20px #9400D3, 0 0 30px #9400D3, 0 0 40px #9400D3, 0 0 55px #9400D3, 0 0 75px #9400D3',
            }
        },
        autumn: {
            background: autumn,
            lowBackground: autumnLow,
            cardbackground: autumnCard,
            defaultTextColor: '#8B4513',
            themeTextColor: '#ffffff',
            blackColor: '#000000',
            homepageBackgroundColor: '#FFE4B5',
            titleColor: '#FF4500',
            subtitle: 'Embrace the vibrant autumn leaves with Novel Stella. Embrace the vibrant autumn.',
            sidebarBg: '#f4c169f1',
            buttonBackgroundColor: '#fbceb1',
            buttonTextColor: '#CD853F',
            teamColor: '#8B4513',
            drinkColor: '#FF4500',
            neonEffect: {
                color: '#D2691E',
                titleTextShadow: '0 0 5px #FFD1DC, 0 0 10px #D2691E, 0 0 20px #D2691E, 0 0 30px #D2691E, 0 0 40px #D2691E, 0 0 55px #D2691E, 0 0 75px #D2691E',
            }
        },
        winter: {
            background: winter,
            lowBackground: winterLow,
            cardbackground: winterCard,
            defaultTextColor: '#DCDCDC',
            themeTextColor: '#ffffff',
            blackColor: '#000000',
            homepageBackgroundColor: '#000000',
            titleColor: '#87CEEB',
            subtitle: 'Feel the warmth of winter with Novel Stella. Feel the warmth of winter.',
            sidebarBg: '#A9A9A9',
            buttonBackgroundColor: '#696969',
            buttonTextColor: '#DCDCDC',
            teamColor: '#FFFFFF',
            drinkColor: '#87CEEB',
            neonEffect: {
                color: '#5F9EA0',
                titleTextShadow: '0 0 5px #00CED1, 0 0 10px #00CED1, 0 0 15px #00CED1',
            }
        }
    },

    // 액션
    setSeason: async (season) => {
        const store = getState();

        if (!validateSeason(season)) {
            console.error('Invalid season:', season);
            return;
        }

        if (!store.canChangeTheme || store.currentSeason === season) return;

        setState({ isLoading: true, canChangeTheme: false });

        try {
            setState({ currentSeason: season });

            if (!store.loadedImages.has(season)) {
                await preloadImage(store.themes[season].background);
                store.loadedImages.add(season);
            }

            setTimeout(() => {
                setState({
                    isLoading: false,
                    canChangeTheme: true
                });
            }, 1000);

        } catch (error) {
            console.error('Failed to load theme images:', error);
            setState({
                isLoading: false,
                canChangeTheme: true
            });
        }
    },

    setCanChangeTheme: (canChange) => setState({ canChangeTheme: canChange }),

    // 초기화
    initializeTheme: async () => {
        const store = getState();
        try {
            await preloadImage(store.themes[store.currentSeason].background);
            store.loadedImages.add(store.currentSeason);
        } catch (error) {
            console.error('Failed to load initial theme:', error);
        }
    }
}));

// 초기 테마 이미지 프리로드
useThemeStore.getState().initializeTheme();

export default useThemeStore;