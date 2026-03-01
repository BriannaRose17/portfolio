// @ts-nocheck

console.log("Script loaded successfully!");

function updateProgress() {
    const allTasks = document.querySelectorAll('.task-item');
    const completedTasks = document.querySelectorAll('.task-item.completed');
    const bar = document.getElementById('progressBar');

    if (allTasks.length === 0) {
        bar.style.width = "0%";
        bar.innerText = "0%";
        return;
    }

    const percent = Math.round((completedTasks.length / allTasks.length) * 100);
    bar.style.width = percent + "%";
    bar.innerText = percent + "%";
}

function addTask() {
    const input = document.getElementById('taskInput');
    const list = document.getElementById('taskList');
    const priority = document.getElementById('taskPriority').value;

    if (input.value.trim() === "") {
        alert("Please enter a task!");
        return;
    }

    // Create Item
    const li = document.createElement('li');
    li.className = `task-item priority-${priority}`;
    
    li.innerHTML = `
        <span onclick="toggleComplete(this)" style="cursor:pointer; flex-grow:1;">
            ${input.value}
        </span>
        <button onclick="this.parentElement.remove(); updateProgress();">Delete</button>
    `;

    list.appendChild(li);
    input.value = ""; // Clear input
    updateProgress();
}

function toggleComplete(element) {
    element.parentElement.classList.toggle('completed');
    updateProgress();
}

