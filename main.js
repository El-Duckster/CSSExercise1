import './style.scss'

// Task array
let todos = JSON.parse(localStorage.getItem('todos')) || [];

// DOM Elements
const container = document.querySelector('.main-container');
const topArea = document.querySelector('.top-area');
const todoInput = document.querySelector('#todo-input');
const todoList = document.querySelector('#todo-list');
const errorMessage = document.querySelector('#error-message');
const completedCounter = document.querySelector('#completed-counter');
const todoForm = document.querySelector('#todo-form');

// Save tasks to localStorage
const saveTodosToLocalStorage = () => {
  localStorage.setItem('todos', JSON.stringify(todos));
};
// Add Task
const addTask = () => {
  const taskText = todoInput.value.trim();

  // Check if input is empty
  if (!taskText) {
    errorMessage.textContent = 'Input must not be empty';
    errorMessage.style.visibility = 'visible';
    errorMessage.style.animation = 'none';
    void errorMessage.offsetWidth; 
    errorMessage.style.animation = 'blink 0.8s ease-in-out 3';
    return;
  } else {
    errorMessage.textContent = '';
    errorMessage.style.visibility = 'hidden';
    
  }

  // Create task object
  const newTask = {
    id: Date.now(),
    text: taskText,
    completed: false,
  };

  // Add task to the array
  todos = [...todos, newTask]; 
  todoInput.value = ''; 
  saveTodosToLocalStorage();
  renderTodos();

  const newListItem = document.querySelector(`li[data-id="${newTask.id}"]`);
  newListItem.classList.add('adding');
  setTimeout(() => {
    newListItem.classList.remove('adding');
  }, 500); 
};

// Render the todo list
const renderTodos = () => {
  // Clear the todoList first
  todoList.innerHTML = '';

    todos.forEach(({ id, text, completed }) => {

      // Create <li> element
      const listItem = document.createElement('li');
      listItem.dataset.id = id;

      if (completed) {
        listItem.classList.add('completed');
      }

      // Create <span> for task text
      const taskText = document.createElement('span');
      taskText.textContent = text;

      // Create <button> for delete action
      const deleteButton = document.createElement('button');
      deleteButton.classList.add('delete-btn');
      deleteButton.setAttribute('aria-label', 'Delete task');
      deleteButton.textContent = '🗑️';

      // Append text and button to list item
      listItem.appendChild(taskText);
      listItem.appendChild(deleteButton);

      // Append the list item to the todoList
      todoList.appendChild(listItem);
    }
  );
  // }
  
  updateTaskCounters();
};


// Toggle task completion
const toggleTaskCompletion = (taskId) => {
  todos = todos.map(task =>
    task.id === taskId ? { ...task, completed: !task.completed } : task
  );
  saveTodosToLocalStorage();
  // renderTodos();
  const listItem = document.querySelector(`li[data-id="${taskId}"]`);

  if (listItem) {
    listItem.classList.toggle('completed');

    // Add the delayed color change if task is completed
    if (listItem.classList.contains('completed')) {
      setTimeout(() => {
        listItem.classList.add('delayed-color-change');
      }, 500); 
    } else {
      listItem.classList.remove('delayed-color-change');
    }
  }

  // Update the counters after toggling task completion
  updateTaskCounters();
};


// Delete task
const deleteTask = (taskId) => {

  const listItem = document.querySelector(`li[data-id="${taskId}"]`);
  listItem.classList.add('removing');

setTimeout(() => {
  todos = todos.filter(task => task.id !== taskId);
  saveTodosToLocalStorage();
  renderTodos();
}, 400); 
};
// Update completed tasks counter
const updateTaskCounters = () => {
  const completed = todos.filter(task => task.completed).length;
  completedCounter.textContent = `${completed} completed`;
};

// Event Listeners

//initial upploading 
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

document.addEventListener('DOMContentLoaded', async () => {
  
  // Animate each section with a delay in between
  await delay(100);
  container.classList.add('active');
  topArea.classList.add('active');
  
  await delay(100); 
  document.querySelector('h1').classList.add('active');
  
  await delay(100); 
  document.querySelector('.counter-container').classList.add('active');
  
  await delay(100); 
  document.querySelector('.input-area').classList.add('active');
  
  await delay(100);
  document.querySelector('ul').classList.add('active');
});

// Event for addig a new task
todoForm.addEventListener('submit', (e) => {
  e.preventDefault(); // Prevent form from refreshing the page
  addTask(); 
});

// Event Delegation for task actions (toggle or delete)
todoList.addEventListener('click', (e) => {
  const listItem = e.target.closest('li'); 
  if (!listItem) return;

  const taskId = Number(listItem?.dataset?.id);

  if (e.target.classList.contains('delete-btn')) {
    deleteTask(taskId);
  } else {
    toggleTaskCompletion(taskId);
  }
});


renderTodos();