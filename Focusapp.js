/* --- 1. CORE TIMER VARIABLES --- */
let timeLeft;
let timerId = null;
let isRunning = false;

/* --- 2. LOCAL STORAGE UTILITIES --- */
function saveToLocal(key, data) { localStorage.setItem(key, JSON.stringify(data)); }
function getFromLocal(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
}

/* --- 3. TIMER LOGIC --- */
function startTimer() {
    console.log("Start button clicked"); // Check your Console (F12) for this!
    if (isRunning) return; 

    const userValue = document.getElementById('userMinutes').value;
    const startingMinutes = userValue ? parseInt(userValue) : 25;

    // Set time if fresh start or reset
    if (!timeLeft || timeLeft === startingMinutes * 60) {
        timeLeft = startingMinutes * 60;
        window.totalSeconds = timeLeft;
    }

    isRunning = true;
    timerId = setInterval(updateTimer, 1000);
}

function pauseTimer() {
    clearInterval(timerId);
    timerId = null;
    isRunning = false;
}

function resetTimer() {
    pauseTimer();
    const userValue = document.getElementById('userMinutes').value;
    timeLeft = (userValue ? parseInt(userValue) : 25) * 60;
    updateDisplay();
    document.getElementById('progressBar').style.width = '0%';
}

function updateTimer() {
    if (timeLeft <= 0) {
        clearInterval(timerId);
        isRunning = false;
        
        const userValue = document.getElementById('userMinutes').value;
        logSession(userValue ? parseInt(userValue) : 25);
        
        alert("Time for a mindful break!");
    } else {
        timeLeft--;
        updateDisplay();
        updateProgressBar();
    }
}

function updateDisplay() {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    const display = document.getElementById('timerDisplay');
    if (display) {
        display.innerText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }
}

function updateProgressBar() {
    const bar = document.getElementById('progressBar');
    if (bar && window.totalSeconds) {
        const progress = ((window.totalSeconds - timeLeft) / window.totalSeconds) * 100;
        bar.style.width = progress + '%';
    }
}

/* --- 4. MODAL / TAB LOGIC --- */
function openTab(evt, sectionId) {
    const overlay = document.getElementById('modalOverlay');
    if (overlay) overlay.style.display = 'flex';
    
    const sections = document.querySelectorAll('.tab-content');
    sections.forEach(s => s.style.display = 'none');
    
    const target = document.getElementById(sectionId);
    if (target) {
        target.style.display = 'flex';
        target.classList.add('active');
    }
}

function closeModal() {
    const overlay = document.getElementById('modalOverlay');
    if (overlay) overlay.style.display = 'none';
}

/* --- 5. SESSION LOGS --- */
let focusLogs = getFromLocal('focusLogs');

function logSession(minutes) {
    const newSession = {
        duration: minutes,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toLocaleDateString()
    };
    focusLogs.unshift(newSession);
    saveToLocal('focusLogs', focusLogs);
    renderLogs();
}

function renderLogs() {
    const list = document.getElementById('sessionList');
    if (!list) return;
    
    if (focusLogs.length === 0) {
        list.innerHTML = '<li class="task-item">No sessions today.</li>';
        return;
    }
    
    list.innerHTML = '';
    focusLogs.forEach(session => {
        const li = document.createElement('li');
        li.className = 'task-item';
        li.innerHTML = `<span><b>${session.duration}m</b> Session</span> <span style="font-size:12px; color:#888;">${session.time}</span>`;
        list.appendChild(li);
    });
}
function clearLogs() {
    if (confirm("Delete all session history? This cannot be undone.")) {
        // 1. Wipe the browser's memory
        localStorage.removeItem('focusLogs');
        
        // 2. Clear the live data in your script
        focusLogs = []; 
        
        // 3. Immediately update the UI
        renderLogs(); 
        
        // 4. Update the total minutes display to 0
        const totalDisplay = document.getElementById('totalCount');
        if (totalDisplay) {
            totalDisplay.innerText = "Total Focused: 0 mins";
        }
    }
}


/* --- 6. AFFIRMATIONS --- */
const affirmations = [
    "I am worthy of rest and peace.",
    "My focus is a muscle I am building every day.",
    "I choose to be kind to myself today.",
    "Small steps lead to big changes.",
    "One task at a time is enough."
];

function displayRandomAffirmation() {
    const text = affirmations[Math.floor(Math.random() * affirmations.length)];
    const element = document.getElementById('affirmationText');
    if (element) element.innerText = `"${text}"`;
}

/* --- 7. INITIALIZE --- */
window.onload = function() {
    displayRandomAffirmation();
    renderLogs();
};
let wellnessTasks = getFromLocal('wellnessTasks');

function addWellnessTask() {
    const input = document.getElementById('taskInput');
    if (!input.value.trim()) return;

    const newTask = { id: Date.now(), text: input.value, completed: false };
    wellnessTasks.push(newTask);
    saveToLocal('wellnessTasks', wellnessTasks);
    input.value = '';
    renderWellnessTasks();
}

function toggleWellnessTask(id) {
    wellnessTasks = wellnessTasks.map(t => t.id === id ? {...t, completed: !t.completed} : t);
    saveToLocal('wellnessTasks', wellnessTasks);
    renderWellnessTasks();
}

function renderWellnessTasks() {
    const list = document.getElementById('wellnessList');
    const bar = document.getElementById('taskBar');
    list.innerHTML = '';
    
    let completedCount = 0;
    wellnessTasks.forEach(task => {
        if (task.completed) completedCount++;
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        
        li.innerHTML = `
            <span class="task-text">${task.text}</span>
            <div class="button-group">
                <button class="complete-btn" onclick="toggleWellnessTask(${task.id})">
                    ${task.completed ? '✓' : '○'}
                </button>
                <button class="delete-btn" onclick="deleteWellnessTask(${task.id})">🗑️</button>
            </div>
        `;
        list.appendChild(li);
    });

    const progress = wellnessTasks.length > 0 ? (completedCount / wellnessTasks.length) * 100 : 0;
    bar.style.width = progress + '%';
}

function deleteWellnessTask(id) {
    // Filter out the selected task by ID
    wellnessTasks = wellnessTasks.filter(t => t.id !== id);
    saveToLocal('wellnessTasks', wellnessTasks);
    renderWellnessTasks();
}
let habitData = getFromLocal('habitData');

function addNewHabit() {
    const input = document.getElementById('habitInput');
    if (!input.value.trim()) return;
    habitData.push({ id: Date.now(), text: input.value, done: false });
    saveToLocal('habitData', habitData);
    input.value = '';
    renderHabits();
}

function addWater() {
    let waterCount = parseInt(localStorage.getItem('waterCount')) || 0;
    if (waterCount < 8) {
        waterCount++;
        localStorage.setItem('waterCount', waterCount);
        updateWaterUI();
    }
}

function updateWaterUI() {
    const waterCount = parseInt(localStorage.getItem('waterCount')) || 0;
    document.getElementById('waterCount').innerText = `${waterCount} / 8 glasses`;
    const bar = document.getElementById('waterBar');
    bar.style.width = (waterCount / 8 * 100) + '%';
}

window.onload = function() {
    displayRandomAffirmation();
    renderLogs();
    renderWellnessTasks();
    renderHabits();
    updateWaterUI();
};
// Add these functions to your Focusapp.js

function addWater() {
    let waterCount = parseInt(localStorage.getItem('waterCount')) || 0;
    waterCount++;
    localStorage.setItem('waterCount', waterCount);
    updateWaterUI();
}

function removeWater() {
    let waterCount = parseInt(localStorage.getItem('waterCount')) || 0;
    if (waterCount > 0) {
        waterCount--;
        localStorage.setItem('waterCount', waterCount);
        updateWaterUI();
    }
}

function updateWaterUI() {
    let waterCount = parseInt(localStorage.getItem('waterCount')) || 0;
    
    // Bar fills up at 8, but stays at 100% if you go over
    const percentage = Math.min((waterCount / 8) * 100, 100);
    const bar = document.getElementById('waterBar');
    const display = document.getElementById('waterCount');
    
    if (bar) bar.style.width = percentage + "%";
    
    if (display) {
        if (waterCount >= 8) {
            display.innerHTML = `<strong>${waterCount}</strong> / 8 glasses <br> <span style="color: #5bc0a7; font-size: 0.8em;">Goal Reached! ✨</span>`;
            bar.style.background = "#5bc0a7"; // Brighter green-blue when finished
        } else {
            display.innerText = `${waterCount} / 8 glasses`;
            bar.style.background = "#8bb7d6"; // Standard blue
        }
    }
}
function resetWater() {
    if (confirm("Reset your daily hydration?")) {
        // 1. Clear the browser's "hard drive"
        localStorage.removeItem('waterCount');

        // 2. Clear the code's "active memory" (The missing step!)
        // This ensures the next time you click 'Add', it starts at 1, not 9.
        if (typeof waterGlasses !== 'undefined') {
            waterGlasses = 0;
        }

        // 3. Force the screen to show 0
        updateWaterUI();
    }
}
/* --- Habit Tracker Logic --- */

function renderHabits() {
    const list = document.getElementById('habitList');
    if (!list) return;
    
    list.innerHTML = '';
    
    habitData.forEach(h => {
        const li = document.createElement('li');
        li.className = `task-item ${h.done ? 'completed' : ''}`;
        
        li.innerHTML = `
            <span class="task-text">${h.text}</span>
            <div class="button-group">
                <input type="checkbox" ${h.done ? 'checked' : ''} onchange="toggleHabit(${h.id})">
                <button class="delete-btn" onclick="deleteHabit(${h.id})">🗑️</button>
            </div>
        `;
        list.appendChild(li);
    });
}

function toggleHabit(id) {
    // Find the habit and flip its status
    habitData = habitData.map(h => h.id === id ? {...h, done: !h.done} : h);
    saveToLocal('habitData', habitData);
    renderHabits();
}

function deleteHabit(id) {
    if (confirm("Delete this habit?")) {
        habitData = habitData.filter(h => h.id !== id);
        saveToLocal('habitData', habitData);
        renderHabits();
    }
}
/* --- Mood Tracker Logic --- */

function logMood(emoji) {
    console.log("Mood logged:", emoji); // Check your console (F12) for this!

    // 1. Create the entry
    const moodEntry = {
        emoji: emoji,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toLocaleDateString()
    };

    // 2. Save it to LocalStorage
    let moods = JSON.parse(localStorage.getItem('moodHistory')) || [];
    moods.unshift(moodEntry); // Add new mood to the top
    localStorage.setItem('moodHistory', JSON.stringify(moods));

    // 3. Update the UI text
    const display = document.getElementById('currentMood');
    if (display) {
        display.innerHTML = `Latest Mood: <span style="font-size: 24px;">${emoji}</span>`;
    }

    // 4. Optional: Highlight the selected button
    // (We can add CSS for this next)
}
