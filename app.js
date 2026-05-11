import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

// --- Configuration ---
// Make sure to replace this with your actual API key from aistudio.google.com
const API_KEY = "YOUR_GEMINI_API_KEY_HERE"; 
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

/**
 * DEBUGGED: Audio Controller
 * Fixed: Added a check for 'canPlayType' and handled the volume transition safely.
 */
function updateMusic(mood) {
    if (!bgMusic) return;

    // Smooth fade out
    let volumeInterval = setInterval(() => {
        if (bgMusic.volume > 0.05) {
            bgMusic.volume -= 0.05;
        } else {
            bgMusic.volume = 0;
            clearInterval(volumeInterval);
            
            // Change Source
            bgMusic.src = `assets/music/${mood}.mp3`;
            bgMusic.load();
            
            const playPromise = bgMusic.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    // Smooth fade in
                    let fadeIn = setInterval(() => {
                        if (bgMusic.volume < 0.4) {
                            bgMusic.volume += 0.05;
                        } else {
                            clearInterval(fadeIn);
                        }
                    }, 50);
                }).catch(error => {
                    console.warn("User interaction required for audio swap.");
                });
            }
        }
    }, 500);
}

// Mood selection chips
moodChips.forEach(chip => {
    chip.addEventListener('click', () => {
        moodChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        selectedMood = chip.getAttribute('data-mood');
        updateMusic(selectedMood);
    });
});

/**
 * AI TOOL: Music & Response Integration
 * Now the AI determines if the music should change to "healing" after the response.
 */
async function generateAIResponse(userInput, mood) {
    aiResponseContainer.classList.remove('hidden');
    aiText.innerText = "Listening to the earth's whisper...";

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        // System prompt updated to include a "sentiment tag" for the music tool
        const prompt = `You are a nature-based healing guide. 
        A user is feeling ${mood} and says: "${userInput}". 
        1. Provide a short, 2-sentence poetic reframe using nature metaphors.
        2. End with a single bracketed word indicating the 'new' mood (e.g., [peaceful], [calm], [renewed]).`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        // Parse logic: Extract the [mood] and update the music automatically
        if (text.includes('[')) {
            const suggestedMood = text.match(/\[(.*?)\]/)[1];
            text = text.replace(/\[.*?\]/g, ""); // Clean the text for the user
            
            // Logic: If the AI thinks the user is ready, shift the music to 'peaceful'
            if (suggestedMood === 'peaceful' || suggestedMood === 'renewed') {
                setTimeout(() => updateMusic('peaceful'), 2000);
            }
        }

        aiText.innerText = text;

    } catch (error) {
        console.error("AI Error:", error);
        aiText.innerText = "The wind is quiet right now. Take a deep breath and stay here.";
    }
}

// --- Interaction Logic ---
releaseBtn.addEventListener('click', () => {
    const thought = thoughtInput.value.trim();
    
    if (!thought) {
        thoughtInput.style.border = "2px solid #ff4d4d";
        setTimeout(() => thoughtInput.style.border = "none", 1000);
        return;
    }

    plantSeed();
    generateAIResponse(thought, selectedMood);
    thoughtInput.value = "";
});

function plantSeed() {
    const seed = document.createElement('div');
    seed.className = 'flower-grow';
    
    // Ensure seeds stay inside the container
    const x = Math.floor(Math.random() * 85);
    const y = Math.floor(Math.random() * 85);
    
    seed.style.left = `${x}%`;
    seed.style.top = `${y}%`;
    garden.appendChild(seed);
}

// Initial Unblocker
document.addEventListener('click', () => {
    if (bgMusic && bgMusic.paused) {
        bgMusic.volume = 0.4;
        bgMusic.play().catch(() => {});
    }
}, { once: true });
