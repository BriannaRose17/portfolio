function queryAI() {
    const promptInput = document.getElementById('aiPrompt');
    const btn = document.getElementById('askBtn');

   
    if (!promptInput || !promptInput.value.trim()) return;

   
    const responses = [
        "The stars say: Absolutely! ✨",
        "My internal sensors say: Not likely. 🤖",
        "Ask me again after I've had some digital coffee. ☕",
        "That's a fascinating thought! 🧠",
        "Error 404: Answer not found in this dimension. 🌌"
    ];

  
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];


    addMessageToChat(randomResponse);

    
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
    
    
    responseArea.scrollTop = responseArea.scrollHeight;
}

