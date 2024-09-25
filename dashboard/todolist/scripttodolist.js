import {Task} from "../../js_class/task";
document.addEventListener('DOMContentLoaded', async () => {
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task');
    const taskList = document.getElementById('task-list');
    const filterOptions = document.getElementById('filter-options');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let currentFilter = 'all';

    // Fetch tasks from the server
    const serverTasks = await Task.fetchTaskData();

    if (serverTasks && serverTasks.length > 0) {
        // Add server tasks to the local task list
        serverTasks.forEach(serverTask => {
            tasks.push({
                text: serverTask.titre,
                completed: serverTask.statut === 'completed',
                id: serverTask.id
            });
        });
        saveTasks(); // Save to local storage
    }

    function renderTasks() {
        taskList.innerHTML = '';
        tasks.forEach((task, index) => {
            if (
                (currentFilter === 'all') ||
                (currentFilter === 'active' && !task.completed) ||
                (currentFilter === 'completed' && task.completed)
            ) {
                const li = document.createElement('li');
                li.innerHTML = `
                    <span class="drag-handle"> </span>
                    <span class="task-text ${task.completed ? 'completed' : ''}">${task.text}</span>
                    <div class="task-actions">
                        <button class="edit-btn" data-index="${index}">Modifier</button>
                        <button class="delete-btn" data-index="${index}"><i class="fa-regular fa-trash-can"></i></button>
                        <div class="checkbox-wrapper-12">
                            <div class="checkbox">
                                <input id="checkbox-12-${index}" type="checkbox" ${task.completed ? 'checked' : ''}/>
                                <label for="checkbox-12-${index}"></label>
                                <svg width="15" height="14" viewbox="0 0 15 14" fill="none">
                                    <path d="M2 8.36364L6.23077 12L13 2"></path>
                                </svg>
                            </div>
                            <div class="progress-bar" id="progress-${index}" style="display:none;">
                                <div class="progress"></div>
                            </div>
                            <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
                                <defs>
                                    <filter id="goo-12">
                                        <fegaussianblur in="SourceGraphic" stddeviation="4" result="blur"></fegaussianblur>
                                        <fecolormatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -7" result="goo-12"></fecolormatrix>
                                        <feblend in="SourceGraphic" in2="goo-12"></feblend>
                                    </filter>
                                </defs>
                            </svg>
                        </div>
                    </div>
                `;

                // Checkbox with progress animation
                const checkbox = li.querySelector(`#checkbox-12-${index}`);
                checkbox.addEventListener('change', (e) => toggleTask(index, e.target.checked));

                taskList.appendChild(li);
            }        
        });
        saveTasks();
    }

    function addTask() {
        const text = taskInput.value.trim();
        if (text) {
            tasks.push({ text, completed: false });
            taskInput.value = '';
            renderTasks();
        }
    }

    function deleteTask(index) {
        tasks.splice(index, 1);
        renderTasks();
    }

    function toggleTask(index, checked) {
        tasks[index].completed = checked;
        if (checked) {
            startProgress(index); // Start progress if task is checked
        }
        renderTasks();
    }

    function startProgress(index) {
        const progressBar = document.querySelector(`#progress-${index}`);
        const progressFill = progressBar.querySelector('.progress');
        progressBar.style.display = 'block'; // Make sure progress bar is visible
        let width = 0;

        const interval = setInterval(() => {
            if (width >= 100) {
                clearInterval(interval); // Stop once the progress is full
                deleteTask(index); // Delete task after progress completes
            } else {
                width++;
                progressFill.style.width = width + '%'; // Increase width
            }
        }, 300); // 300ms per step, 100 steps = 30 seconds
    }

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });

    taskList.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-btn')) {
            const index = e.target.dataset.index;
            deleteTask(index);
        } else if (e.target.classList.contains('edit-btn')) {
            const index = e.target.dataset.index;
            editTask(index);
        }
    });

    filterOptions.addEventListener('click', (e) => {
        if (e.target.classList.contains('filter-btn')) {
            currentFilter = e.target.dataset.filter;
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            renderTasks();
        }
    });

    new Sortable(taskList, {
        animation: 150,
        handle: '.drag-handle',
        onEnd: function() {
            const newOrder = Array.from(taskList.children).map(li => {
                const index = li.querySelector('.delete-btn').dataset.index;
                return tasks[index];
            });
            tasks = newOrder;
            saveTasks();
        }
    });

    renderTasks(); // Initial rendering of tasks
});
