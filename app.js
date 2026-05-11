import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

// --- Configuration ---
const API_KEY = "YOUR_GEMINI_API_KEY_HERE"; // Replace with your actual key
const genAI = new GoogleGenerativeAI(API_KEY);

// --- Selectors ---
const releaseBtn = document.getElementById('release-btn');
const thoughtInput = document.getElementById('thought-input');
const aiResponseContainer = document.getElementById('ai-response-container');
const aiText = document.getElementById('ai-text');
const bgMusic = document.getElementById('bg-music');
const garden = document.getElementById('garden');
const moodChips = document.querySelectorAll('.chip');

let selectedMood = 'peaceful';

// --- 1. Enhanced Audio Integration ---
function updateMusic(mood) {
    // Check if element exists to prevent crash
    if (!bgMusic) return;

    // Fade out effect before changing
    bgMusic.style.transition = "volume 0.5s";
    bgMusic.volume = 0;

    setTimeout(() => {
        bgMusic.src = `assets/music/${mood}.mp3`;
        bgMusic.load();
        
        // Play and fade back in
        const playPromise = bgMusic.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                bgMusic.volume = 0.5; // Set to comfortable level
            }).catch(error => {
                console.warn("Autoplay prevented. Music will start on next click.");
            });
        }
    }, 500);
}

// Mood selection logic
moodChips.forEach(chip => {
    chip.addEventListener('click', () => {
        moodChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        selectedMood = chip.getAttribute('data-mood');
        updateMusic(selectedMood);
    });
});

// --- 2. Real AI Tool Integration ---
async function generateAIResponse(userInput, mood) {
    aiResponseContainer.classList.remove('hidden');
    aiText.innerText = "Listening to the earth's whisper...";

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        // System prompt to keep the AI in character
        const prompt = `You are a nature-based healing guide. 
        A user is feeling ${mood} and says: "${userInput}". 
        Provide a short, 2-sentence poetic reframe using nature metaphors. 
        Keep it calming, empathetic, and grounded.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        aiText.innerText = text;
    } catch (error) {
        console.error("AI Error:", error);
        aiText.innerText = "The wind is quiet right now. Take a deep breath and try again soon.";
    }
}

// --- 3. Interaction & Debugging Logic ---
releaseBtn.addEventListener('click', () => {
    const thought = thoughtInput.value.trim();
    
    if (!thought) {
        // Visual shake if empty
        thoughtInput.style.border = "1px solid red";
        setTimeout(() => thoughtInput.style.border = "none", 500);
        return;
    }

    plantSeed();
    generateAIResponse(thought, selectedMood);
    thoughtInput.value = "";
});

function plantSeed() {
    const seed = document.createElement('div');
    seed.className = 'flower-grow';
    // Debug: Ensure these positions stay within the garden container
    seed.style.left = `${Math.floor(Math.random() * 90)}%`;
    seed.style.top = `${Math.floor(Math.random() * 90)}%`;
    garden.appendChild(seed);
}

// Global click listener to unlock audio context (Browser requirement)
document.addEventListener('click', () => {
    if (bgMusic && bgMusic.paused) {
        bgMusic.play().catch(() => {});
    }
}, { once: true });
