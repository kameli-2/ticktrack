import { useState } from "react";
import { changeTodoOrder, createTodo, deleteTodo, getTodos, updateTodo } from "../lib/todos";
import type { Todo } from "../lib/todos";
import { getProjects } from "../lib/projects";
import { formatEntryKey } from "../lib/logEntries";

export default function Todos() {
  const [todos, setTodos] = useState(getTodos());

  function createTodoHandler() {
    createTodo();
    setTodos(getTodos());
  }

  const todosNotDone = todos.filter(todo => todo.status !== 'done').sort((a, b) => a.order - b.order);
  const todosDone = todos.filter(todo => todo.status === 'done').sort((a, b) => a.order - b.order);

  return <>
    <h2>Todos</h2>
    <button className="btn" onClick={createTodoHandler}>Create new</button>
    {todos.length > 0 ?
      <ul>
        {todosNotDone.map(todo => <TodoItem key={todo.id} todo={todo} setTodos={setTodos} />)}
        {todosDone.map(todo => <TodoItem todo={todo} setTodos={setTodos} />)}
      </ul>
    : <p>No todos</p>}
  </>
}

function TodoItem(props: { todo: Todo, setTodos: (todos: Todo[]) => void }) {
  const { todo, setTodos } = props;

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

  const projects = getProjects();

  return <li key={todo.id} className={`todo--${todo.status}`}>
    {todo.status === 'todo' ? <>
      <select defaultValue={todo.project} onChange={(e) => todoUpdateHandler(todo.id, { project: e.currentTarget.value })}>
        <option key="no-project-selected" value="">- no project selected -</option>
        {projects.map(project =>
          <option key={project.name}>{project.name}</option>
        )}
      </select>
      <input
        type="text"
        id={`todo-description-${todo.id}`}
        defaultValue={todo.description}
        onChange={(e) => todoUpdateHandler(todo.id, { description: e.currentTarget.value })}
      />
    </> : <span>{formatEntryKey({ project: todo.project, description: todo.description })}</span>}
    <input
      checked={todo.status === 'done'}
      type="checkbox"
      aria-label="Mark as done"
      onChange={(e) => todoUpdateHandler(todo.id, { status: e.currentTarget.checked ? 'done' : 'todo' })}
    />
    <button aria-label="Move todo item top" onClick={(e) => todoOrderChangeHandler(todo.id, 'top')}>&#8648;</button>
    <button aria-label="Move todo item up" onClick={(e) => todoOrderChangeHandler(todo.id, 'up')}>&uarr;</button>
    <button aria-label="Move todo item down" onClick={(e) => todoOrderChangeHandler(todo.id, 'down')}>&darr;</button>
    <button aria-label="Move todo item bottom" onClick={(e) => todoOrderChangeHandler(todo.id, 'bottom')}>&#8650;</button>
    <button
      aria-label="Delete todo item"
      onClick={() => deleteTodoHandler(todo.id)}
    >&times;</button>
  </li>
}
