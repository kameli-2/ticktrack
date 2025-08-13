import { ChangeEvent, useState } from "react";
import { updateNote, getNote, deleteNote } from "../lib/notes";
import styles from './Notes.module.css'
import { MdEditor } from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';
import { useNavigate } from "react-router-dom";
import { getSettings } from "../lib/settings";

export default function NoteComponent(props: { id: number }) {
  const { id } = props;
  const note = getNote(id);
  const [content, setContent] = useState(note?.content);
  const navigate = useNavigate();

  if (!note) return <p>Note not found</p>

  const theme = getSettings('style__appearance');

  function updateTitle(e: ChangeEvent<HTMLInputElement>) {
    const newTitle = e.currentTarget.value;
    if (!newTitle) return;
    updateNote(id, { title: newTitle})
  }

  function updateContent(newValue: string) {
    updateNote(id, { content: newValue })
    setContent(newValue)
  }

  function handleDelete() {
    if (window.confirm('Are you sure you want to delete this note?')) {
      deleteNote(id);
      navigate('/notes');
    }
  }

  return <section className={styles.noteContainer}>
    <input
      className={styles.noteTitle}
      type="text"
      name="title"
      defaultValue={note.title}
      onChange={updateTitle}
    />
    <button className={styles.deleteNote} onClick={handleDelete}>&times; Delete note</button>
    <br />
    <MdEditor
      onChange={updateContent}
      value={content}
      language="en-US"
      theme={theme}
      style={{
        height: "calc(100vh - 22rem)",
        minHeight: "25rem",
      }}
      toolbarsExclude={['save', 'fullscreen', 'pageFullscreen']}
    />
  </section>
}
