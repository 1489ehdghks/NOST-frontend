import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(persist(
    (set) => ({
        token: null,
        refreshToken: null,
        isLoggedIn: false,
        userId: null,
        nickname: null,
        email: null,

        setAuthState: ({ token, refreshToken, user }) => set({
            token,
            refreshToken,
            isLoggedIn: true,
            userId: user.id,
            nickname: user.nickname,
            email: user.email,
            user
        }),

        logout: () => set({
            token: null,
            refreshToken: null,
            isLoggedIn: false,
            userId: null,
            nickname: null,
            email: null,
            user: null
        }),

        reset: () => set({
            token: null,
            refreshToken: null,
            isLoggedIn: false,
            userId: null,
            nickname: null,
            email: null,
            user: null
        })
    }),
    {
        name: 'auth_store',
        partialize: (state) => ({
            token: state.token,
            isLoggedIn: state.isLoggedIn,
            userId: state.userId,
            nickname: state.nickname,
            email: state.email
        }),
    }
));

export default useAuthStore;
