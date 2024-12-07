document.addEventListener('DOMContentLoaded', loadTasks);
document.getElementById('addTask').addEventListener('click', addTask);

function loadTasks() {
    chrome.storage.local.get(['tasks'], function (result) {
        const tasks = result.tasks || [];
        const taskList = document.getElementById('taskList');
        taskList.innerHTML = '';
        tasks.forEach((task, index) => {
            const li = document.createElement('li');
            const taskText = document.createElement('span');
            taskText.textContent = task.description;

            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.className = 'edit-button';
            editButton.onclick = () => editTask(index);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.className = 'delete-button';
            deleteButton.onclick = () => deleteTask(index);

            li.appendChild(taskText);
            li.appendChild(editButton);
            li.appendChild(deleteButton);

            taskList.appendChild(li);
        });
    });
}

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskDescription = taskInput.value.trim();

    if (taskDescription) {
        chrome.storage.local.get(['tasks'], function (result) {
            const tasks = result.tasks || [];
            tasks.push({ description: taskDescription });
            chrome.storage.local.set({ tasks: tasks }, loadTasks);
            taskInput.value = '';
        });
    }
}

function editTask(index) {
    chrome.storage.local.get(['tasks'], function (result) {
        const tasks = result.tasks || [];
        const newTaskDescription = prompt('Edit your task:', tasks[index].description);

        if (newTaskDescription !== null && newTaskDescription.trim() !== '') {
            tasks[index].description = newTaskDescription;
            chrome.storage.local.set({ tasks: tasks }, loadTasks);
        }
    });
}

function deleteTask(index) {
    chrome.storage.local.get(['tasks'], function (result) {
        const tasks = result.tasks || [];
        tasks.splice(index, 1);
        chrome.storage.local.set({ tasks: tasks }, loadTasks);
    });
}
