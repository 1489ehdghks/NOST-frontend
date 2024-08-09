import { create } from 'zustand';

const useGlobalStore = create((set) => ({
    isLoading: false,
    setIsLoading: (loading) => set({ isLoading: loading }),
    error: null,
    setError: (error) => set({ error: error }),

    //createPage의 세션관리 상태변수
    currentSection: 0,
    totalSections: 4,
    isSectionComplete: [false, false, false, false],
    completeSection: (sectionIndex) => set((state) => {
        const newIsSectionComplete = [...state.isSectionComplete];
        newIsSectionComplete[sectionIndex] = true;
        return { isSectionComplete: newIsSectionComplete };
    }),
    resetSection: (sectionIndex) => set((state) => {
        const newIsSectionComplete = [...state.isSectionComplete];
        newIsSectionComplete[sectionIndex] = false;
        return { isSectionComplete: newIsSectionComplete };
    }),
    setCurrentSection: (section) => set({ currentSection: section }),
}));

export default useGlobalStore;