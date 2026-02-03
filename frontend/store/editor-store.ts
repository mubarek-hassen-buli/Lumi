import { create } from 'zustand';

interface EditorStore {
  content: string;
  isSaving: boolean;
  lastSaved: Date | null;
  hasUnsavedChanges: boolean;
  past: string[];
  future: string[];
  setContent: (content: string) => void;
  setSaving: (isSaving: boolean) => void;
  markSaved: () => void;
  undo: () => void;
  redo: () => void;
  reset: () => void;
}

export const useEditorStore = create<EditorStore>((set) => ({
  content: '',
  isSaving: false,
  lastSaved: null,
  hasUnsavedChanges: false,
  past: [],
  future: [],
  
  setContent: (content) => set((state) => {
    // Only push to past if content actually changed
    if (content === state.content) return state;
    
    // Limit history to 50 states
    const newPast = [...state.past, state.content].slice(-50);
    return { 
      content, 
      hasUnsavedChanges: true,
      past: newPast,
      future: [] // Clear future on new edit
    };
  }),
  
  setSaving: (isSaving) => set({ isSaving }),
  
  markSaved: () => set({ 
    lastSaved: new Date(), 
    isSaving: false,
    hasUnsavedChanges: false 
  }),

  undo: () => set((state) => {
    if (state.past.length === 0) return state;
    
    const previous = state.past[state.past.length - 1];
    const newPast = state.past.slice(0, state.past.length - 1);
    
    return {
      content: previous,
      past: newPast,
      future: [state.content, ...state.future],
      hasUnsavedChanges: true
    };
  }),

  redo: () => set((state) => {
    if (state.future.length === 0) return state;
    
    const next = state.future[0];
    const newFuture = state.future.slice(1);
    
    return {
      content: next,
      past: [...state.past, state.content],
      future: newFuture,
      hasUnsavedChanges: true
    };
  }),
  
  reset: () => set({ 
    content: '', 
    isSaving: false, 
    lastSaved: null,
    hasUnsavedChanges: false,
    past: [],
    future: []
  }),
}));
