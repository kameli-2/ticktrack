import { useState } from "react";
import { changeTodoOrder, createTodo, deleteTodo, getTodos, updateTodo, clearDoneTodos } from "../lib/todos";
import type { Todo } from "../lib/todos";
import { getProjects } from "../lib/projects";
import { createLogEntry, endCurrentTask, formatEntryKey, updateLogEntry } from "../lib/logEntries";
import styles from './Todos.module.css'
import { useNavigate } from "react-router-dom";

export default function Todos() {
  const [todos, setTodos] = useState(getTodos());

  function createTodoHandler() {
    createTodo();
    setTodos(getTodos());
  }

  function clearTodosHandler() {
    if (window.confirm('Are you sure you want to delete all done todos?')) {
      clearDoneTodos();
      setTodos(getTodos());
    }
  }

  return <>
    <section>
      <button className={`btn ${styles.todoListCreateNewTodo}`} onClick={createTodoHandler}>+ Create new todo</button>&nbsp;
      <button className={`btn ${styles.todoListClearDoneTodos}`} onClick={clearTodosHandler}>&times; Clear done todos</button>
    </section>
    {todos.length > 0 ?
      ['todo', 'waiting', 'done'].map( // Group by status, show 'todo' first, 'waiting' second, 'done' third
        status => <>
        <h3>{status.charAt(0).toUpperCase()}{status.substring(1)}</h3>
        <ul className={styles.todoList}>
          {todos
            .filter(todo => todo.status === status)
            .sort((a, b) => a.order - b.order) // Sort todo's inside a status group by order number
            .map(todo => <TodoItem key={todo.id} todo={todo} setTodos={setTodos} />)
          }
        </ul>
        </>
      )
    : <p className="notification">No todos</p>}
  </>
}

function TodoItem(props: { todo: Todo, setTodos: (todos: Todo[]) => void }) {
  const { todo, setTodos } = props;
  const navigate = useNavigate();

  function todoUpdateHandler(id: number, data: Partial<Todo>) {
    updateTodo(id, data);
    setTodos(getTodos());
  }

  function deleteTodoHandler(id: number) {
    if (window.confirm('Are you sure you want to delete this todo item?')) {
      deleteTodo(id);
      setTodos(getTodos());
    }
  }

  function todoOrderChangeHandler(id: number, mode: 'top' | 'up' | 'down' | 'bottom') {
    changeTodoOrder(id, mode);
    setTodos(getTodos());
  }

  function exportToTimeTrackerHandler(id: number) {
    if (!todo.project) return;
    endCurrentTask();
    const logEntryId = createLogEntry(todo.project);
    updateLogEntry(logEntryId, { description: todo.description });
    navigate('/');
  }

  const projects = getProjects();

  const classes = [
    styles.todoListItem,
    styles[`todoListItem--${todo.status}`]
  ].join(' ');

  return <li key={todo.id} className={classes}>
    <input
      className={styles.todoListItemCheckbox}
      checked={todo.status === 'done'}
      type="checkbox"
      aria-label="Mark as done"
      onChange={(e) => todoUpdateHandler(todo.id, { status: e.currentTarget.checked ? 'done' : 'todo' })}
    />
    {todo.status !== 'done' ? <>
      <select className={styles.todoListItemProject} defaultValue={todo.project} onChange={(e) => todoUpdateHandler(todo.id, { project: e.currentTarget.value })}>
        <option key="no-project-selected" value="">- no project selected -</option>
        {projects.map(project =>
          <option key={project.name}>{project.name}</option>
        )}
      </select>
      <input
        type="text"
        className={styles.todoListItemDescription}
        id={`todo-description-${todo.id}`}
        defaultValue={todo.description}
        onChange={(e) => todoUpdateHandler(todo.id, { description: e.currentTarget.value })}
      />
    </> : <span className={styles.todoListItemDescription}>{formatEntryKey({ project: todo.project, description: todo.description })}</span>}
    {todo.status !== 'done' ? <div className={styles.todoListItemActionButtons}>
      {todo.project ? <button className={styles.exportToTimeTracker} aria-label="Start working on this todo" onClick={(e) => exportToTimeTrackerHandler(todo.id)}>&rarr;</button> : null}
      {todo.status === 'todo' ? <button className="btn" aria-label="Put item in waiting status" onClick={(e) => todoUpdateHandler(todo.id, { status: 'waiting' })}>&#x23F8;</button> : null}
      {todo.status === 'waiting' ? <button className="btn" aria-label="Put item in todo status" onClick={(e) => todoUpdateHandler(todo.id, { status: 'todo' })}>&#x23F5;</button> : null}
      <button className="btn" aria-label="Move todo item top" onClick={(e) => todoOrderChangeHandler(todo.id, 'top')}>&#8648;</button>
      <button className="btn" aria-label="Move todo item up" onClick={(e) => todoOrderChangeHandler(todo.id, 'up')}>&uarr;</button>
      <button className="btn" aria-label="Move todo item down" onClick={(e) => todoOrderChangeHandler(todo.id, 'down')}>&darr;</button>
      <button className="btn" aria-label="Move todo item bottom" onClick={(e) => todoOrderChangeHandler(todo.id, 'bottom')}>&#8650;</button>
    </div> : null}
    <button
      className={styles.todoListItemDelete}
      aria-label="Delete todo item"
      onClick={() => deleteTodoHandler(todo.id)}
    >&times;</button>
  </li>
}
