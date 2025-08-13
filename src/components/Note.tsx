import { ChangeEvent, useState } from "react";
import { updateNote, getNote, deleteNote } from "../lib/notes";
import styles from './Notes.module.css'
import { MdEditor } from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';
import { useNavigate } from "react-router-dom";
import { getSettings } from "../lib/settings";
import { downloadFile } from "../lib/utils";

export default function NoteComponent(props: { id: number }) {
  const { id } = props;
  const note = getNote(id);
  const [content, setContent] = useState(note?.content);
  const [title, setTitle] = useState(note?.title);
  const navigate = useNavigate();

  if (!note) return <p>Note not found</p>

  const theme = getSettings('style__appearance');

  function updateTitle(e: ChangeEvent<HTMLInputElement>) {
    const newTitle = e.currentTarget.value;
    if (!newTitle) return;
    updateNote(id, { title: newTitle});
    setTitle(newTitle);
  }

  function updateContent(newValue: string) {
    updateNote(id, { content: newValue });
    setContent(newValue);
  }

  function handleDelete() {
    if (window.confirm('Are you sure you want to delete this note?')) {
      deleteNote(id);
      navigate('/notes');
    }
  }

  function handleSave() {
    downloadFile(`${title}.json`, content);
  }

  return <section className={styles.noteContainer}>
    <input
      className={styles.noteTitle}
      type="text"
      name="title"
      defaultValue={title}
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
      toolbarsExclude={['fullscreen', 'pageFullscreen']}
      onSave={handleSave}
    />
  </section>
}
