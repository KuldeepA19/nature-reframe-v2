let myGarden = JSON.parse(localStorage.getItem('natureGarden')) || [];

window.onload = () => { renderGarden(); };

function updateMood(type, prompt) {
    document.getElementById('mood-prompt').innerText = prompt;
}

function renderGarden() {
    const gardenDiv = document.getElementById('garden');
    gardenDiv.innerHTML = myGarden.slice(-5).map(plant => `<span>${plant}</span>`).join('');
}

async function releaseThought() {
    const input = document.getElementById('thought-input');
    const aiText = document.getElementById('ai-text');
    const aiContainer = document.getElementById('ai-response-container');
    const thought = input.value.trim();

    if (!thought) {
        alert("Please share your heart first.");
        return;
    }

    // 1. Show the box and loading message
    aiContainer.className = "ai-box-visible";
    aiText.innerText = "The earth is listening...";

    // 2. Plant the emoji
    const flora = ['🌱', '🌿', '🌸', '🌻', '🍀'];
    myGarden.push(flora[Math.floor(Math.random() * flora.length)]);
    localStorage.setItem('natureGarden', JSON.stringify(myGarden));
    renderGarden();

    // 3. Simulated AI (We connect Gemini API in the next step)
    setTimeout(() => {
        const responses = [
            "This thought is now part of the earth. You are lighter now.",
            "Like rain on a leaf, let this stress slide away. You are resilient.",
            "Growth takes time. Be as patient with yourself as the forest is.",
            "You have planted your pain. Watch it turn into peace."
        ];
        aiText.innerText = responses[Math.floor(Math.random() * responses.length)];
        input.value = ""; 
    }, 1500);
}
