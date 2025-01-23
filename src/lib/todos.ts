export type Todo = {
  project?: string,
  description?: string,
  created: Date,
  id: number,
  order: number,
  deadline?: Date,
  status: 'done' | 'todo' | 'waiting'
}

export function createTodo() {
  const todos = getTodos();
  const todo = {
    created: new Date(),
    order: getNextOrder(),
    status: 'todo',
  } as Todo;
  todo.id = getTodoId(todo);
  todos.push(todo);
  rebuildTodoOrdering(todos);
  window.localStorage.setItem('todos', JSON.stringify(todos));
  return todo.id;
}

export function getTodos(): Todo[] {
  return JSON.parse(window.localStorage.getItem('todos') || '[]')
}

function getNextOrder() {
  const todos = getTodos();
  if (todos.length === 0) return 0;
  return todos.sort((a, b) => b.order - a.order)[0].order + 1;
}

/**
 * Rebuilds the order numbers of the todos. For example if we have two todos,
 * one with order 10 and another with order 20, this will set the order
 * numbers to 0 and 1.
 * This should be done always after order numbers are changed.
 * @param todos Todos to order
 * @returns Rebuilt todo list
 */
function rebuildTodoOrdering(todos: Todo[]) {
  todos.sort((a, b) => a.order - b.order);
  todos.forEach((todo, index) => todo.order = index);
  return todos;
}

export function getTodoId(todo: Todo) {
  return +new Date(todo.created)
}

export function deleteTodo(id: number) {
  const todos = getTodos().filter(todo => todo.id !== id);
  window.localStorage.setItem('todos', JSON.stringify(todos));
}

export function clearDoneTodos() {
  const todos = getTodos().filter(todo => todo.status !== 'done');
  window.localStorage.setItem('todos', JSON.stringify(todos));
}

export function updateTodo(id: number, newData: Partial<Todo>) {
  const todos = getTodos();
  const todo = todos.find(todo => todo.id === id);
  if (!todo) return;
  Object.assign(todo, newData);
  if (Object.keys(newData).includes('order')) rebuildTodoOrdering(todos);
  window.localStorage.setItem('todos', JSON.stringify(todos));
}

export function getTodo(id: number): Todo | undefined {
  const todos = getTodos();
  return todos.find(todo => todo.id === id);
}

export function changeTodoOrder(id: number, mode: 'top' | 'up' | 'down' | 'bottom') {
  const todo = getTodo(id);
  if (!todo) return;

  const currentOrder = todo.order || 0;
  let order = 0;

  switch (mode) {
    case "top":
      order = -1;
      break;
    case "bottom":
      order = Number.MAX_SAFE_INTEGER;
      break;
    case "up":
      // Get all todos above the target todo
      const previousTodos = getTodos().filter(prevTodo => prevTodo.status === todo.status && prevTodo.order < currentOrder);
      if (!previousTodos) return; // Already on top

      // Get order number of the todo closest to the target todo
      const previousTodoOrderNumber = previousTodos.reduce((smallestOrder, previousTodo) => Math.max(smallestOrder, previousTodo.order), -1);

      // Put target todo slightly above the previous todo
      order = previousTodoOrderNumber - 0.5;
      break;
    case "down":
      // Get all todos below the target todo
      const nextTodos = getTodos().filter(nextTodo => nextTodo.status === todo.status && nextTodo.order > currentOrder);
      if (!nextTodos) return; // Already on bottom

      // Get order number of the todo closest to the target todo
      const nextTodoOrderNumber = nextTodos.reduce((greatestOrder, nextTodo) => Math.min(greatestOrder, nextTodo.order), Number.MAX_SAFE_INTEGER);

      // Put target todo slightly below the next todo
      order = nextTodoOrderNumber + 0.5;
      break;
  }

  updateTodo(id, { order });
}