// @ts-nocheck

window.onload = () => {
    loadTasks();
    sortAndRender();
    updateProgress();
};

function addTask() {
    const input = document.getElementById('taskInput');
    const prioritySelect = document.getElementById('taskPriority');
    const list = document.getElementById('taskList');

    if (input.value.trim() === "") return;

    const priorityMap = { 'high': 3, 'medium': 2, 'low': 1 };
    const li = document.createElement('li');
    li.className = `task-item priority-${prioritySelect.value}`;
    li.setAttribute('data-priority', priorityMap[prioritySelect.value]);

    li.innerHTML = `
        <span class="task-text">${input.value}</span>
        <div class="button-group">
            <button onclick="toggleComplete(this)">✔</button>
            <button onclick="deleteTask(this)">Delete</button>
        </div>
    `;

    list.appendChild(li);
    input.value = "";
    
    sortAndRender(); 
    saveTasks();
    updateProgress();
}

function sortAndRender() {
    const list = document.getElementById('taskList');
    const tasks = Array.from(list.children);

    // FLIP: First
    const firstPositions = tasks.map(t => ({ el: t, rect: t.getBoundingClientRect() }));

    // Sort Logic
    tasks.sort((a, b) => b.getAttribute('data-priority') - a.getAttribute('data-priority'));
    tasks.forEach(t => list.appendChild(t));

    // FLIP: Last/Invert/Play
    tasks.forEach(task => {
        const first = firstPositions.find(p => p.el === task).rect;
        const last = task.getBoundingClientRect();
        const deltaY = first.top - last.top;

        if (deltaY !== 0) {
            task.style.transition = 'none';
            task.style.transform = `translateY(${deltaY}px)`;
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    task.style.transition = 'transform 0.4s cubic-bezier(0.2, 0, 0.2, 1)';
                    task.style.transform = '';
                });
            });
        }
    });
}

function toggleComplete(btn) {
    btn.parentElement.parentElement.classList.toggle('completed');
    saveTasks();
    updateProgress();
}

function deleteTask(btn) {
    btn.parentElement.parentElement.remove();
    saveTasks();
    updateProgress();
}

function updateProgress() {
    const all = document.querySelectorAll('.task-item').length;
    const done = document.querySelectorAll('.task-item.completed').length;
    const bar = document.getElementById('progressBar');
    const percent = all === 0 ? 0 : Math.round((done / all) * 100);
    bar.style.width = percent + "%";
    bar.innerText = percent + "%";
}

function saveTasks() {
    const tasks = [];
    document.querySelectorAll('.task-item').forEach(li => {
        tasks.push({
            text: li.querySelector('.task-text').innerText,
            pVal: li.getAttribute('data-priority'),
            pClass: li.classList.contains('priority-high') ? 'high' : 
                    li.classList.contains('priority-medium') ? 'medium' : 'low',
            done: li.classList.contains('completed')
        });
    });
    localStorage.setItem('briannaDashboard', JSON.stringify(tasks));
}

function loadTasks() {
    const saved = JSON.parse(localStorage.getItem('briannaDashboard') || "[]");
    const list = document.getElementById('taskList');
    saved.forEach(t => {
        const li = document.createElement('li');
        li.className = `task-item priority-${t.pClass} ${t.done ? 'completed' : ''}`;
        li.setAttribute('data-priority', t.pVal);
        li.innerHTML = `<span class="task-text">${t.text}</span>
            <div class="button-group">
                <button onclick="toggleComplete(this)">✔</button>
                <button onclick="deleteTask(this)">Delete</button>
            </div>`;
        list.appendChild(li);
    });
}





