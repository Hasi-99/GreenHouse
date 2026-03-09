import { create } from 'zustand';

export const useAppStore = create((set) => ({
  user: null,
  role: 'guest', // 'guest' or 'admin'
  theme: 'theme-classic',
  isDarkMode: false,
  
  setUser: (user, role) => set({ user, role }),
  setTheme: (theme) => set({ theme }),
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
}));