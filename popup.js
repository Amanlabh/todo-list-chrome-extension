const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoDateTime = document.getElementById('todo-datetime');
const todoList = document.getElementById('todo-list');

// Load saved tasks from storage
chrome.storage.sync.get(['todos'], function (result) {
  const todos = result.todos || [];
  todos.forEach(({ task, datetime }) => addTodoToDOM(task, datetime));
});

// Add new task
todoForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const task = todoInput.value.trim();
  const datetime = todoDateTime.value.trim();
  if (!task || !datetime) return;

  chrome.storage.sync.get(['todos'], function (result) {
    const todos = result.todos || [];
    const newTask = { task, datetime };
    todos.push(newTask);
    chrome.storage.sync.set({ todos }, function () {
      addTodoToDOM(task, datetime);
      todoInput.value = '';
      todoDateTime.value = '';
    });
  });
});

// Add a task to the DOM
function addTodoToDOM(task, datetime) {
  const li = document.createElement('li');

  const taskDetails = document.createElement('div');
  taskDetails.className = 'task-details';

  const taskText = document.createElement('span');
  taskText.textContent = task;

  const taskTime = document.createElement('span');
  taskTime.className = 'task-time';
  taskTime.textContent = `Due: ${new Date(datetime).toLocaleString()}`;

  taskDetails.appendChild(taskText);
  taskDetails.appendChild(taskTime);

  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.addEventListener('click', function () {
    removeTask(task, datetime, li);
  });

  li.appendChild(taskDetails);
  li.appendChild(deleteButton);
  todoList.appendChild(li);
}

// Remove task
function removeTask(task, datetime, liElement) {
  chrome.storage.sync.get(['todos'], function (result) {
    let todos = result.todos || [];
    todos = todos.filter((t) => t.task !== task || t.datetime !== datetime);
    chrome.storage.sync.set({ todos }, function () {
      todoList.removeChild(liElement);
    });
  });
}
