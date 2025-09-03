import { getTodo } from "./todos";

const LOCALSTORAGE_ITEM_KEY = 'notes';

export type Note = {
  todo?: number,
  title: string,
  content?: string,
  created: Date,
  id: number,
  status: 'default' | 'archived' | 'pinned',
}

export function createNoteFromTodo(todo: number) {
  const note = {
    title: getTodo(todo)?.description,
    todo,
    created: new Date(),
  } as Note;
  note.id = getNoteId(note);

  return createNote(note);
}

export function createNote(note?: Note) {
  const notes = getNotes();

  if (!note) {
    note = {
      created: new Date(),
      title: new Date().toLocaleString(),
    } as Note;
    note.id = getNoteId(note);
  }

  if (!note.status) note.status = 'default';

  notes.push(note);
  window.localStorage.setItem(LOCALSTORAGE_ITEM_KEY, JSON.stringify(notes));
  return note.id;
}

export function getNoteId(note: Note) {
  return +new Date(note.created)
}

export function getNotes(): Note[] {
  return JSON.parse(window.localStorage.getItem(LOCALSTORAGE_ITEM_KEY) || '[]')
}

export function deleteNote(id: number) {
  const notes = getNotes().filter(note => note.id !== id);
  window.localStorage.setItem(LOCALSTORAGE_ITEM_KEY, JSON.stringify(notes));
}

export function updateNote(id: number, newData: Partial<Note>) {
  const notes = getNotes();
  const note = notes.find(note => note.id === id);
  if (!note) return;
  Object.assign(note, newData);
  window.localStorage.setItem(LOCALSTORAGE_ITEM_KEY, JSON.stringify(notes));
}

export function getNote(id: number): Note | undefined {
  const notes = getNotes();
  return notes.find(note => note.id === id);
}

export function importNotes(notes: Note[], overwrite = false) {
  if (overwrite) window.localStorage.removeItem(LOCALSTORAGE_ITEM_KEY);
  
  const existingNotes = getNotes();
  notes.forEach(note => {
    if (existingNotes.every(existingNote => existingNote.id !== note.id)) {
      createNote(note);
    }
  });
}
