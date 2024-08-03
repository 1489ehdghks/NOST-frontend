import { create } from 'zustand';
import spring from '../asset/image/spring.avif'
import summer from '../asset/image/summer.jpg'
import autumn from '../asset/image/autumn.avif'
import winter from '../asset/image/winter.avif'

const useThemeStore = create(set => ({
    currentSeason: 'spring',
    canChangeTheme: true,
    setSeason: (season) => set({ currentSeason: season }),
    setCanChangeTheme: (canChangeTheme) => set({ canChangeTheme }),
    font: {
        shapeFont: "'Nanum Myeongjo', serif", //중요한 부분.섹시한 폰트
        nomalFont: "Averia Gruesa Libre, system-ui", //봄
        nomalFont2: "Indie Flower, cursive", //normalFont보다 장난기 있는 폰트
        popFont: "Permanent Marker, cursive", //팝송에서 자주 본 폰트
        rockFont: "Rock Salt, cursive",  //여름, -team NOST
        rockFont2: "Zeyada, cursive", //rockFont보다 필기체 느낌이 강함. 내용으로 하면 어울릴듯
        scaryFont: "Creepster, system-ui", //장난스러운 공포 부분
        thickFont: "Poetsen One, sans-serif", //재밋는 부분. 약간 두꺼움
        titanFont: "Titan One, sans-serif", //포스터 느낌 매우 두꺼움
    },


    ///봄,#f0cfd5

    themes: {
        spring: {
            background: spring,
            defaultTextColor: '#DB7093',
            themeTextColor: '#ffffff',
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
            defaultTextColor: '#e0c7ff',
            themeTextColor: '#ffffff',
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
            defaultTextColor: '#8B4513',
            themeTextColor: '#ffffff',
            homepageBackgroundColor: '#FFE4B5',
            titleColor: '#FF4500',
            subtitle: 'Embrace the vibrant autumn leaves with "Novel Stella. Embrace the vibrant autumn.',
            sidebarBg: '#f4c169f1',
            buttonBackgroundColor: '#fdbe80',
            buttonTextColor: '#D2691E',
            teamColor: '#8B4513',
            drinkColor: '#FF4500',
            neonEffect: {
                color: '#D2691E',
                titleTextShadow: '0 0 5px #FFD1DC, 0 0 10px #D2691E, 0 0 20px #D2691E, 0 0 30px #D2691E, 0 0 40px #D2691E, 0 0 55px #D2691E, 0 0 75px #D2691E',
            }
        },
        winter: {
            background: winter,
            defaultTextColor: '#ffffff',
            themeTextColor: '#ffffff',
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
    }
}));

export default useThemeStore;
