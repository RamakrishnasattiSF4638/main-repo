// Simple Todo App
const STORAGE_KEY = 'simple_todo_items';

// State
let todos = [];
let currentFilter = 'all';

// DOM elements
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const emptyState = document.getElementById('empty-state');
const itemsLeft = document.getElementById('items-left');
const clearCompletedBtn = document.getElementById('clear-completed-btn');
const filterButtons = document.querySelectorAll('.filter-btn');

function loadTodos() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    todos = raw ? JSON.parse(raw) : [
      { id: '1', text: 'Welcome to your todo list!', completed: false },
      { id: '2', text: 'Check off this task when done', completed: true }
    ];
  } catch (err) {
    todos = [];
  }
}

function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function render() {
  const filtered = todos.filter((todo) => {
    if (currentFilter === 'active') return !todo.completed;
    if (currentFilter === 'completed') return todo.completed;
    return true;
  });

  todoList.innerHTML = '';

  if (filtered.length === 0) {
    emptyState.classList.remove('hidden');
  } else {
    emptyState.classList.add('hidden');
    filtered.forEach((todo) => {
      const li = document.createElement('li');
      li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
      li.dataset.id = todo.id;

      li.innerHTML = `
        <div class="todo-left">
          <input 
            type="checkbox" 
            class="todo-checkbox" 
            ${todo.completed ? 'checked' : ''} 
            aria-label="Mark task as ${todo.completed ? 'incomplete' : 'complete'}"
          />
          <span class="todo-text">${escapeHtml(todo.text)}</span>
        </div>
        <div class="todo-actions">
          <button type="button" class="delete-btn" aria-label="Delete task">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </button>
        </div>
      `;

      todoList.appendChild(li);
    });
  }

  // Update counts
  const activeCount = todos.filter((t) => !t.completed).length;
  itemsLeft.textContent = `${activeCount} ${activeCount === 1 ? 'task' : 'tasks'} left`;

  const hasCompleted = todos.some((t) => t.completed);
  clearCompletedBtn.style.visibility = hasCompleted ? 'visible' : 'hidden';
}

function addTodo(text) {
  const trimmed = text.trim();
  if (!trimmed) return;

  todos.push({
    id: Date.now().toString(),
    text: trimmed,
    completed: false
  });

  saveTodos();
  render();
}

function toggleTodo(id) {
  todos = todos.map((todo) =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  );
  saveTodos();
  render();
}

function deleteTodo(id) {
  todos = todos.filter((todo) => todo.id !== id);
  saveTodos();
  render();
}

function clearCompleted() {
  todos = todos.filter((todo) => !todo.completed);
  saveTodos();
  render();
}

// Event Listeners
todoForm.addEventListener('submit', (e) => {
  e.preventDefault();
  addTodo(todoInput.value);
  todoInput.value = '';
});

todoList.addEventListener('change', (e) => {
  if (e.target.classList.contains('todo-checkbox')) {
    const id = e.target.closest('.todo-item').dataset.id;
    toggleTodo(id);
  }
});

todoList.addEventListener('click', (e) => {
  const deleteBtn = e.target.closest('.delete-btn');
  if (deleteBtn) {
    const id = deleteBtn.closest('.todo-item').dataset.id;
    deleteTodo(id);
  }
});

filterButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    filterButtons.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    render();
  });
});

clearCompletedBtn.addEventListener('click', clearCompleted);

// Initialize
loadTodos();
render();
