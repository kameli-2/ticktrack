import { useState } from "react";
import { createNote, getNotes } from "../lib/notes";
import type { Note } from "../lib/notes";
import styles from './Notes.module.css'
import { Link } from "react-router-dom";

export default function Notes() {
  const [notes, setNotes] = useState(getNotes());

  function createNoteHandler() {
    createNote();
    setNotes(getNotes());
  }

  return <>
    <section>
      <button className={`btn ${styles.createNoteButton}`} onClick={createNoteHandler}>+ Create new note</button>&nbsp;
    </section>
    {notes.length > 0 ? <>
      <ul className={styles.noteList}>
        {notes
          .sort((a, b) => +a.created - +b.created) // Sort notes from newest to oldest
          .map(note => <NoteListItem key={note.id} note={note} />)
        }
      </ul>
    </> : <p className="notification">No notes</p>}
  </>
}

function NoteListItem(props: { note: Note }) {
  const { note } = props;

  function getContentPreview(content?: string) {
    if (!content) return '';
    const PREVIEW_LENGTH = 50;
    if (content.length > PREVIEW_LENGTH) content = content.substring(0, PREVIEW_LENGTH) + '...';
    return content.split('\n')[0]
  }

  return <li key={note.id} className={styles.noteListItem}>
    <Link to={`/notes/${note.id}`}>
      <h2>{note.title}</h2>
      <p>{getContentPreview(note.content)}</p>
    </Link>
  </li>
}
