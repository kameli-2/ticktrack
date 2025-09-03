import { useState } from "react";
import { createNote, deleteNote, getNotes, updateNote } from "../lib/notes";
import type { Note } from "../lib/notes";
import styles from './Notes.module.css'
import { Link } from "react-router-dom";

export default function Notes() {
  const [notes, setNotes] = useState(getNotes());

  function createNoteHandler() {
    createNote();
    setNotes(getNotes());
  }

  const notesByStatus = {
    pinned: notes.filter(note => note.status === 'pinned'),
    default: notes.filter(note => note.status === 'default' || !note.status),
    archived: notes.filter(note => note.status === 'archived'),
  };

  return <>
    <section>
      <button className={`btn ${styles.createNoteButton}`} onClick={createNoteHandler}>+ Create new note</button>&nbsp;
    </section>

    {notesByStatus['pinned'].length > 0 ? <>
      <h2>Pinned notes</h2>
      <ul className={styles.noteList}>
        {notesByStatus['pinned']
          .sort((a, b) => +a.created - +b.created) // Sort notes from newest to oldest
          .map(note => <NoteListItem key={note.id} note={note} setNotes={setNotes} />)
        }
      </ul>
    </> : null}

    {notesByStatus['pinned'].length > 0 && notes.length > notesByStatus['pinned'].length ? <hr /> : null}

    {notesByStatus['default'].length > 0 ? <>
      <ul className={styles.noteList}>
        {notesByStatus['default']
          .sort((a, b) => +a.created - +b.created) // Sort notes from newest to oldest
          .map(note => <NoteListItem key={note.id} note={note} setNotes={setNotes} />)
        }
      </ul>
    </> : null}

    {notesByStatus['default'].length > 0 && notesByStatus['archived'].length > 0 ? <hr /> : null}

    {notesByStatus['archived'].length > 0 ? <details>
      <summary><h2>Archived notes</h2></summary>
      <ul className={styles.noteList}>
        {notesByStatus['archived']
          .sort((a, b) => +a.created - +b.created) // Sort notes from newest to oldest
          .map(note => <NoteListItem key={note.id} note={note} setNotes={setNotes} />)
        }
      </ul>
    </details> : null}

    {notes.length === 0 ? <p className="notification">No notes</p> : null}
  </>
}

function NoteListItem(props: { note: Note, setNotes: Function }) {
  const { note, setNotes } = props;

  function getContentPreview(content?: string) {
    if (!content) return '';
    const PREVIEW_LENGTH = 50;
    if (content.length > PREVIEW_LENGTH) content = content.substring(0, PREVIEW_LENGTH) + '...';
    return content.split('\n')[0]
  }

  function handlePin() {
    updateNote(note.id, { status: 'pinned' });
    setNotes(getNotes());
  }

  function handleArchive() {
    updateNote(note.id, { status: 'archived' });
    setNotes(getNotes());
  }

  function setStatusToDefault() {
    updateNote(note.id, { status: 'default' });
    setNotes(getNotes());
  }

  function handleDelete() {
    if (window.confirm(`Are you sure you want to delete the note ${note.title}?`)) {
      deleteNote(note.id);
      setNotes(getNotes());
    }
  }

  return <li key={note.id} className={styles.noteListItem}>
    <Link to={`/notes/${note.id}`}>
      <h2>{note.title}</h2>
      <p>{getContentPreview(note.content)}</p>
    </Link>
    <details className={styles.noteListItemActions}>
      <summary>&middot;&middot;&middot;</summary>
      <nav className={styles.noteListItemActionsMenu}>
        {note.status === 'pinned' ? <button onClick={setStatusToDefault}>📌&nbsp;Unpin</button> : <button onClick={handlePin}>📌&nbsp;Pin</button>}
        {note.status === 'archived' ? <button onClick={setStatusToDefault}>📂&nbsp;Unarchive</button> : <button onClick={handleArchive}>📂&nbsp;Archive</button>}
        <button onClick={handleDelete} className={styles.noteListItemActionDelete}>&times;&nbsp;Delete</button>
      </nav>
    </details>
  </li>
}
