import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

const API_KEY = "YOUR_GEMINI_API_KEY_HERE"; 
const genAI = new GoogleGenerativeAI(API_KEY);

const releaseBtn = document.getElementById('release-btn');
const thoughtInput = document.getElementById('thought-input');
const aiResponseContainer = document.getElementById('ai-response-container');
const aiText = document.getElementById('ai-text');
const bgMusic = document.getElementById('bg-music');
const garden = document.getElementById('garden');
const moodChips = document.querySelectorAll('.chip');

let selectedMood = 'peaceful';
let musicInterval; // Globally track interval to prevent overlap bugs

function updateMusic(mood) {
    if (!bgMusic) return;
    
    // DEBUG: Clear any existing transitions to prevent volume stuttering
    clearInterval(musicInterval);

    // Fade out
    musicInterval = setInterval(() => {
        if (bgMusic.volume > 0.05) {
            bgMusic.volume -= 0.05;
        } else {
            bgMusic.volume = 0;
            clearInterval(musicInterval);
            
            bgMusic.src = `assets/music/${mood}.mp3`;
            bgMusic.load();
            
            const playPromise = bgMusic.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    // Fade in
                    musicInterval = setInterval(() => {
                        if (bgMusic.volume < 0.4) {
                            bgMusic.volume += 0.05;
                        } else {
                            clearInterval(musicInterval);
                        }
                    }, 50);
                }).catch(err => console.warn("Interacted needed for audio swap."));
            }
        }
    }, 50); // Faster interval for smoother feel
}

moodChips.forEach(chip => {
    chip.addEventListener('click', () => {
        moodChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        selectedMood = chip.getAttribute('data-mood');
        updateMusic(selectedMood);
    });
});

async function generateAIResponse(userInput, mood) {
    // DEBUG: Ensure container is visible before AI finishes
    aiResponseContainer.classList.remove('hidden');
    aiResponseContainer.style.display = "block"; // Force override
    aiText.innerText = "The earth is listening...";

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        const prompt = `You are a nature-based healing guide. 
        The user feels ${mood} and says: "${userInput}". 
        1. Provide a 1-sentence poetic reframe using nature metaphors.
        2. End with [peaceful] if the thought was released.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        // DEBUG: Improved Regex to find the mood tag more reliably
        const moodMatch = text.match(/\[(.*?)\]/);
        if (moodMatch) {
            const suggested = moodMatch[1];
            text = text.replace(/\[.*?\]/g, "").trim();
            
            if (suggested === 'peaceful') {
                setTimeout(() => updateMusic('peaceful'), 1000);
            }
        }

        aiText.innerText = text;

    } catch (error) {
        console.error("AI Error:", error);
        aiText.innerText = "The garden remains still. Take a breath.";
    }
}

releaseBtn.addEventListener('click', () => {
    const thought = thoughtInput.value.trim();
    if (!thought) return;

    plantSeed();
    generateAIResponse(thought, selectedMood);
    thoughtInput.value = "";
});

function plantSeed() {
    const seed = document.createElement('div');
    seed.className = 'flower-grow';
    seed.style.left = `${Math.random() * 85}%`;
    seed.style.top = `${Math.random() * 85}%`;
    garden.appendChild(seed);
}

document.addEventListener('click', () => {
    if (bgMusic && bgMusic.paused) {
        bgMusic.volume = 0.4;
        bgMusic.play().catch(() => {});
    }
}, { once: true });
