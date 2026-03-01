function queryAI() {
    const promptInput = document.getElementById('aiPrompt');
    const btn = document.getElementById('askBtn');

    // 1. Safety Check: If the box is empty, don't do anything
    if (!promptInput || !promptInput.value.trim()) return;

    // 2. The "Brain" Responses (No internet/API needed!)
    const responses = [
        "The stars say: Absolutely! ✨",
        "My internal sensors say: Not likely. 🤖",
        "Ask me again after I've had some digital coffee. ☕",
        "That's a fascinating thought! 🧠",
        "Error 404: Answer not found in this dimension. 🌌"
    ];

    // 3. Pick a random answer
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];

    // 4. Show the answer in the chat
    addMessageToChat(randomResponse);

    // 5. Clear the input and reset button text
    promptInput.value = "";
    btn.innerText = "Consult Brain ✨";
}

function addMessageToChat(text) {
    const responseArea = document.getElementById('aiResponseArea');
    if (!responseArea) return;

    const aiMessage = document.createElement('div');
    aiMessage.className = 'bot-msg';
    aiMessage.innerText = text;
    responseArea.appendChild(aiMessage);
    
    // Auto-scroll to the bottom of the chat window
    responseArea.scrollTop = responseArea.scrollHeight;
}
