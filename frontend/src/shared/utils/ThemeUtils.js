export const preloadImage = (url) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = url;
        img.onload = () => resolve();
        img.onerror = reject;
    });
};

export const getThemeImage = (themes, season) => {
    return themes[season].background;
};

export const getLowResImage = (themes, season) => {
    return themes[season].lowBackground;
};

export const getCurrentTheme = (themes, season) => {
    return themes[season];
};

export const validateSeason = (season) => {
    return ['spring', 'summer', 'autumn', 'winter'].includes(season);
};