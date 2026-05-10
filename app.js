let myGarden = JSON.parse(localStorage.getItem('natureGarden')) || [];

window.onload = () => { renderGarden(); };

function updateMood(type, prompt) {
    document.getElementById('mood-prompt').innerText = prompt;
}

function renderGarden() {
    const gardenDiv = document.getElementById('garden');
    gardenDiv.innerHTML = myGarden.slice(-5).map(plant => `<span>${plant}</span>`).join('');
}

function releaseThought() {
    const input = document.getElementById('thought-input');
    const aiText = document.getElementById('ai-text');
    const aiContainer = document.getElementById('ai-response-container');
    const thought = input.value.trim();

    if (!thought) return alert("The earth is waiting for your words...");

    // 1. Show AI Loading State
    aiContainer.className = "ai-box-visible";
    aiText.innerText = "The earth is listening...";

    // 2. Plant the Thought
    const flora = ['🌱', '🌿', '🌸', '🌻', '🍀', '🌳'];
    myGarden.push(flora[Math.floor(Math.random() * flora.length)]);
    localStorage.setItem('natureGarden', JSON.stringify(myGarden));
    renderGarden();

    // 3. Simulated AI Wisdom (We will link Gemini next)
    setTimeout(() => {
        const wisdom = [
            "This thought is now fertilizer for your growth. You are becoming stronger.",
            "Like a river carries away debris, let this thought flow past you.",
            "The forest doesn't rush, yet everything is accomplished. Be patient with yourself.",
            "You have planted your pain. Now, watch it turn into peace."
        ];
        aiText.innerText = wisdom[Math.floor(Math.random() * wisdom.length)];
        input.value = ""; 
    }, 2000);
}
