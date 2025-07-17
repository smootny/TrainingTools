// ✅ useNotesStore.ts — zaktualizowany Zustand store z obsługą ID jako string
import { create } from 'zustand';

export type Note = {
  id: string;
  title: string;
  body: string;
};

type NotesStore = {
  notes: Note[];
  addNote: (note: Omit<Note, 'id'>) => void;
  updateNote: (id: string, updated: Omit<Note, 'id'>) => void;
  deleteNote: (id: string) => void;
};

export const useNotesStore = create<NotesStore>((set) => ({
  notes: [],

  addNote: (note) => {
    const newNote: Note = {
      ...note,
      id: Date.now().toString(),
    };
    set((state) => ({ notes: [...state.notes, newNote] }));
  },

  updateNote: (id, data) => {
    set((state) => ({
      notes: state.notes.map((note) =>
        note.id === id ? { ...note, ...data } : note
      ),
    }));
  },

  deleteNote: (id) => {
    set((state) => ({
      notes: state.notes.filter((note) => note.id !== id),
    }));
  },
}));
