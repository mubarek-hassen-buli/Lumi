import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIStore {
  sidebarOpen: boolean;
  activeModal: string | null;
  theme: 'light' | 'dark' | 'system';
  editorFontSize: number;
  autoSave: boolean;
  
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  openModal: (modal: string) => void;
  closeModal: () => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setEditorFontSize: (size: number) => void;
  setAutoSave: (enabled: boolean) => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      activeModal: null,
      theme: 'dark',
      editorFontSize: 14,
      autoSave: true,
      
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      openModal: (modal) => set({ activeModal: modal }),
      closeModal: () => set({ activeModal: null }),
      setTheme: (theme) => set({ theme }),
      setEditorFontSize: (size) => set({ editorFontSize: size }),
      setAutoSave: (enabled) => set({ autoSave: enabled }),
    }),
    {
      name: 'ui-preferences',
    }
  )
);
