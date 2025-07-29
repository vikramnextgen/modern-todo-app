// Todo App JavaScript

// DOM Elements
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const itemsLeftCounter = document.getElementById('items-left');
const clearCompletedBtn = document.getElementById('clear-completed');
const filterButtons = document.querySelectorAll('.filter-btn');

// Todo array to store all tasks
let todos = JSON.parse(localStorage.getItem('todos')) || [];
let currentFilter = 'all';

// Initial render
renderTodos();
updateItemsLeft();

// Event Listeners
todoForm.addEventListener('submit', addTodo);
todoList.addEventListener('click', handleTodoClick);
clearCompletedBtn.addEventListener('click', clearCompleted);
filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderTodos();
    });
});

// Functions
function addTodo(e) {
    e.preventDefault();
    
    const todoText = todoInput.value.trim();
    if (todoText === '') return;
    
    // Create new todo object
    const newTodo = {
        id: Date.now(),
        text: todoText,
        completed: false
    };
    
    // Add to todos array
    todos.push(newTodo);
    saveTodos();
    
    // Clear input field
    todoInput.value = '';
    
    // Render todos and update counter
    renderTodos();
    updateItemsLeft();
}

function renderTodos() {
    // Clear the list
    todoList.innerHTML = '';
    
    // Filter todos based on current filter
    let filteredTodos = todos;
    if (currentFilter === 'active') {
        filteredTodos = todos.filter(todo => !todo.completed);
    } else if (currentFilter === 'completed') {
        filteredTodos = todos.filter(todo => todo.completed);
    }
    
    // Create todo items
    filteredTodos.forEach(todo => {
        const todoItem = document.createElement('li');
        todoItem.classList.add('todo-item');
        if (todo.completed) {
            todoItem.classList.add('completed');
        }
        
        todoItem.innerHTML = `
            <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''} data-id="${todo.id}">
            <span class="todo-text">${todo.text}</span>
            <button class="delete-btn" data-id="${todo.id}">
                <i class="fas fa-trash"></i>
            </button>
        `;
        
        todoList.appendChild(todoItem);
    });
}

function handleTodoClick(e) {
    const target = e.target;
    
    // Handle checkbox click
    if (target.classList.contains('todo-checkbox')) {
        const id = parseInt(target.dataset.id);
        toggleTodoCompleted(id);
    }
    
    // Handle delete button click
    if (target.classList.contains('delete-btn') || target.closest('.delete-btn')) {
        const deleteBtn = target.classList.contains('delete-btn') ? target : target.closest('.delete-btn');
        const id = parseInt(deleteBtn.dataset.id);
        deleteTodo(id);
    }
}

function toggleTodoCompleted(id) {
    // Find and toggle the todo's completed status
    todos = todos.map(todo => {
        if (todo.id === id) {
            return { ...todo, completed: !todo.completed };
        }
        return todo;
    });
    
    saveTodos();
    renderTodos();
    updateItemsLeft();
}

function deleteTodo(id) {
    // Remove todo from array
    todos = todos.filter(todo => todo.id !== id);
    
    saveTodos();
    renderTodos();
    updateItemsLeft();
}

function clearCompleted() {
    // Remove all completed todos
    todos = todos.filter(todo => !todo.completed);
    
    saveTodos();
    renderTodos();
    updateItemsLeft();
}

function updateItemsLeft() {
    // Count active todos
    const activeTodos = todos.filter(todo => !todo.completed).length;
    itemsLeftCounter.textContent = activeTodos;
}

function saveTodos() {
    // Save todos to localStorage
    localStorage.setItem('todos', JSON.stringify(todos));
}