// State Management
let myGarden = JSON.parse(localStorage.getItem('natureGarden')) || [];

// 1. Initial Render
window.onload = () => {
    renderGarden();
};

// 2. Change Prompt based on Mood
function updateMood(type, prompt) {
    document.getElementById('mood-prompt').innerText = prompt;
    // Add subtle visual feedback
    document.querySelector('.app-shell').style.borderColor = 
        type === 'angry' ? '#ffdfdf' : 
        type === 'lonely' ? '#dfefff' : '#f0f2f0';
}

// 3. Plant a Thought
function releaseThought() {
    const input = document.getElementById('thought-input');
    const thought = input.value.trim();

    if (thought === "") {
        alert("The earth is waiting for your words. Please type something.");
        return;
    }

    // Logic: Transform thought into a plant
    const flora = ['🌱', '🌿', '🌸', '🌻', '🍀', '🌳'];
    const randomPlant = flora[Math.floor(Math.random() * flora.length)];

    myGarden.push(randomPlant);
    
    // Save to LocalStorage
    localStorage.setItem('natureGarden', JSON.stringify(myGarden));

    // Update UI
    renderGarden();
    input.value = ""; // Clear the input (the 'release')
    
    // Haptic feedback (if mobile)
    if (navigator.vibrate) navigator.vibrate(50);
}

// 4. Render Garden (Show only last 5 plants for clean UI)
function renderGarden() {
    const gardenDiv = document.getElementById('garden');
    const visiblePlants = myGarden.slice(-5);
    
    gardenDiv.innerHTML = visiblePlants.map(plant => `
        <span style="animation: grow 0.8s ease-out">${plant}</span>
    `).join('');
}

// Dynamic CSS Animation for plants
const style = document.createElement('style');
style.innerHTML = `
    @keyframes grow {
        from { transform: scale(0) translateY(20px); opacity: 0; }
        to { transform: scale(1) translateY(0); opacity: 1; }
    }
`;
document.head.appendChild(style);
async function releaseThought() {
    const input = document.getElementById('thought-input');
    const aiText = document.getElementById('ai-text');
    const aiContainer = document.getElementById('ai-response-container');
    const thought = input.value.trim();

    if (!thought) return alert("Share your heart with the earth first.");

    // 1. Show Loading State
    aiContainer.className = "ai-box-visible";
    aiText.innerText = "The earth is listening to your words...";
    
    // 2. Plant the emoji immediately
    const flora = ['🌱', '🌿', '🌸', '🌻', '🍀'];
    myGarden.push(flora[Math.floor(Math.random() * flora.length)]);
    localStorage.setItem('natureGarden', JSON.stringify(myGarden));
    renderGarden();

    // 3. Simulated AI Reframing (We will swap this for the API next)
    // This "Reframes" the thought using nature metaphors
    setTimeout(() => {
        const reframes = [
            "Like a winter storm, this feeling is passing. You are clearing space for new growth.",
            "Even the strongest oaks bend in the wind. Your resilience is your roots.",
            "The forest does not rush, yet everything is accomplished. Be patient with your healing.",
            "You have planted this heavy thought. Now, let the soil transform it into peace."
        ];
        aiText.innerText = reframes[Math.floor(Math.random() * reframes.length)];
        input.value = ""; // Clear input
    }, 2000);
}
