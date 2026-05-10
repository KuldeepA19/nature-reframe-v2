// Persistent Garden State
let myGarden = JSON.parse(localStorage.getItem('natureGarden')) || [];

window.onload = () => {
    renderGarden();
};

function updateMood(type, prompt) {
    document.getElementById('mood-prompt').innerText = prompt;
    // Mobile vibration for tactile feel
    if (navigator.vibrate) navigator.vibrate(10);
}

function renderGarden() {
    const gardenDiv = document.getElementById('garden');
    const displayPlants = myGarden.slice(-5);
    gardenDiv.innerHTML = displayPlants.map(plant => `
        <span style="animation: grow 1s cubic-bezier(0.17, 0.67, 0.83, 0.67)">${plant}</span>
    `).join('');
}

function releaseThought() {
    const input = document.getElementById('thought-input');
    const aiText = document.getElementById('ai-text');
    const aiContainer = document.getElementById('ai-response-container');
    const thought = input.value.trim();

    if (!thought) {
        alert("The earth is waiting for your words...");
        return;
    }

    // 1. UI Transition to "Listening"
    aiContainer.className = "ai-box-visible";
    aiText.innerText = "The earth is listening to your heart...";

    // 2. Logic: Create Life from the Thought
    const flora = ['🌱', '🌿', '🌸', '🌻', '🍀', '🌳'];
    const newLife = flora[Math.floor(Math.random() * flora.length)];
    myGarden.push(newLife);
    localStorage.setItem('natureGarden', JSON.stringify(myGarden));
    
    // 3. Update Visuals
    renderGarden();
    input.value = ""; // Clear input

    // 4. Simulated AI Reframe (Replace with Gemini API later)
    setTimeout(() => {
        const wisdom = [
            "This weight is no longer yours to carry. It is now part of the soil.",
            "Growth requires storms as much as sunshine. You are flourishing.",
            "Like a leaf in the wind, let this thought go. You remain the tree.",
            "The forest finds peace in every season. This too is a season of growth."
        ];
        aiText.innerText = wisdom[Math.floor(Math.random() * wisdom.length)];
    }, 2000);
}

// Inline Animation Logic
const styleSheet = document.createElement('style');
styleSheet.innerHTML = `
    @keyframes grow {
        0% { transform: scale(0) rotate(-20deg); opacity: 0; }
        60% { transform: scale(1.2) rotate(10deg); }
        100% { transform: scale(1) rotate(0); opacity: 1; }
    }
`;
document.head.appendChild(styleSheet);
