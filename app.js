async function releaseThought() {
    const input = document.getElementById('thought-input');
    const aiText = document.getElementById('ai-text');
    const aiContainer = document.getElementById('ai-response-container');
    const thought = input.value.trim();

    if (!thought) return alert("Share your heart with the earth first.");

    // Phase 1: Visual Release
    aiContainer.className = "ai-box-visible";
    aiText.innerText = "The earth is listening to your words...";
    
    // Plant the emoji
    const flora = ['🌱', '🌿', '🌸', '🌻', '🍀'];
    myGarden.push(flora[Math.floor(Math.random() * flora.length)]);
    localStorage.setItem('natureGarden', JSON.stringify(myGarden));
    renderGarden();

    // Phase 2: AI Reframing (Simulated for now)
    setTimeout(() => {
        const reframes = [
            "This heavy thought is now fertilizer for your growth. You are becoming stronger.",
            "Like a river carries away debris, let this thought flow past you. You remain whole.",
            "The forest doesn't rush, yet it thrives. Give yourself the same grace today.",
            "You have spoken your truth. The silence that follows is your space to breathe."
        ];
        aiText.innerText = reframes[Math.floor(Math.random() * reframes.length)];
        input.value = ""; 
    }, 2000);
}
