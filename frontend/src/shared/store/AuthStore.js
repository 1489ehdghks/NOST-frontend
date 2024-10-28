import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import SecureLS from 'secure-ls';
import AxiosInstance from '../utils/AxiosInstance';

// 암호화된 로컬 스토리지 사용
const ls = new SecureLS({ encodingType: 'aes', isCompression: false });

const useAuthStore = create(persist(
    (set) => ({
        token: null,
        refreshToken: null,
        isLoggedIn: false,
        userId: null,
        nickname: null,
        email: null,

        setAuthState: ({ token, refreshToken, user }) => {
            // XSS 방지를 위한 이스케이프 처리
            const sanitizeString = (str) => {
                if (typeof str !== 'string') return str;
                return str.replace(/[<>'"]/g, '');
            };

            set({
                token,
                refreshToken,
                isLoggedIn: true,
                userId: user.id,
                nickname: sanitizeString(user.nickname),
                email: sanitizeString(user.email),
                user: {
                    ...user,
                    nickname: sanitizeString(user.nickname),
                    email: sanitizeString(user.email)
                }
            });
        },

        logout: () => {
            // 로그아웃 시 토큰 무효화 API 호출
            if (AxiosInstance) {
                AxiosInstance.post('/api/accounts/logout/').catch(() => { });
            }
            set({
                token: null,
                refreshToken: null,
                isLoggedIn: false,
                userId: null,
                nickname: null,
                email: null,
                user: null
            });
        },
    }),
    {
        name: 'auth_store',
        storage: createJSONStorage(() => ({
            getItem: (name) => {
                try {
                    return ls.get(name);
                } catch {
                    return null;
                }
            },
            setItem: (name, value) => ls.set(name, value),
            removeItem: (name) => ls.remove(name)
        })),
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