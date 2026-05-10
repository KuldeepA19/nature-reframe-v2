/* 
  Nature Reframe v2 - Core Logic
  Professional Build
*/

import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

// CONFIGURATION
const API_KEY = "AIzaSyDbbutdBcWJbIDLo9uTqgJHKHYNYt-12F0"; 
const genAI = new GoogleGenerativeAI(API_KEY);

const flora = ["🌱", "🌿", "🌸", "🌻", "🍀", "🌳"];

const moodMusic = {
  angry: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3", 
  stressed: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  lonely: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  anxious: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
};

// APP STATE
let selectedMood = "";
let myGarden = [];

// DOM ELEMENTS
const elements = {
  gardenDiv: document.getElementById("garden"),
  moodPrompt: document.getElementById("mood-prompt"),
  input: document.getElementById("thought-input"),
  aiContainer: document.getElementById("ai-response-container"),
  aiText: document.getElementById("ai-text"),
  releaseBtn: document.getElementById("release-btn"),
  calmBtn: document.getElementById("calm-btn"),
  chips: document.querySelectorAll(".chip"),
  audioPlayer: document.getElementById("bg-music"),
  tabs: document.querySelectorAll(".tab-item")
};

// INITIALIZE
window.addEventListener("DOMContentLoaded", () => {
  console.log("Nature Reframe Initialized...");
  loadGarden();
  renderGarden();
  initMoodButtons();
  initCalmButton();
  initTabs();
});

// FUNCTIONS
function loadGarden() {
  try {
    const saved = localStorage.getItem("natureGarden");
    myGarden = saved ? JSON.parse(saved) : [];
  } catch (e) { myGarden = []; }
}

function saveGarden() {
  localStorage.setItem("natureGarden", JSON.stringify(myGarden));
}

function playMoodMusic(mood) {
  const player = elements.audioPlayer;
  if (moodMusic[mood] && player) {
    player.src = moodMusic[mood];
    player.volume = 0.3; // Professional low-level ambience
    player.play().catch(() => console.log("Music waiting for user gesture..."));
  }
}

function initMoodButtons() {
  elements.chips.forEach(chip => {
    chip.addEventListener("click", () => {
      elements.chips.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      selectedMood = chip.dataset.mood;
      
      // Update UI & Music
      if(elements.moodPrompt) {
        const prompts = {
          angry: "🔥 Let the heat out. What happened?",
          stressed: "🌊 Breathe slowly. What feels overwhelming?",
          lonely: "🍃 You are not alone. What is hurting?",
          anxious: "☁️ What thoughts keep circling your mind?"
        };
        elements.moodPrompt.innerText = prompts[selectedMood] || "What is on your heart?";
      }
      playMoodMusic(selectedMood);
    });
  });
}

async function releaseThought() {
  const thought = elements.input?.value.trim();
  if (!thought) return showAIMessage("The earth is waiting for your words...");

  // UI Feedback
  if (elements.releaseBtn) {
    elements.releaseBtn.disabled = true;
    elements.releaseBtn.innerText = "Planting...";
  }
  showAIMessage("🌱 The earth is listening...");

  // Garden Logic
  myGarden.push(flora[Math.floor(Math.random() * flora.length)]);
  saveGarden();
  renderGarden();

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `User is feeling ${selectedMood}. Reframe: "${thought}" into a short, poetic nature metaphor for healing.`;
    
    const result = await model.generateContent(prompt);
    typeWriterEffect(result.response.text());
    if(elements.input) elements.input.value = "";
  } catch (err) {
    typeWriterEffect("The wind carries your words away. Breathe deep.");
  } finally {
    if (elements.releaseBtn) {
      elements.releaseBtn.disabled = false;
      elements.releaseBtn.innerText = "Plant & Release";
    }
  }
}

function renderGarden() {
  if (!elements.gardenDiv) return;
  elements.gardenDiv.innerHTML = "";
  myGarden.slice(-12).forEach(p => {
    const span = document.createElement("span");
    span.innerText = p;
    span.className = "fade-in-plant";
    elements.gardenDiv.appendChild(span);
  });
}

function showAIMessage(msg) {
  elements.aiContainer?.classList.remove("hidden");
  if(elements.aiText) elements.aiText.innerText = msg;
}

function typeWriterEffect(text) {
  if(!elements.aiText) return;
  elements.aiContainer?.classList.remove("hidden");
  elements.aiText.innerText = "";
  let i = 0;
  const interval = setInterval(() => {
    elements.aiText.innerText += text[i];
    i++;
    if (i >= text.length) clearInterval(interval);
  }, 30);
}

function initCalmButton() {
  elements.calmBtn?.addEventListener("click", () => {
    document.body.style.backgroundColor = "#dff6e4";
    showAIMessage("🌿 Inhale... Exhale... You are safe.");
    setTimeout(() => document.body.style.backgroundColor = "#f0f2f0", 5000);
  });
}

function initTabs() {
  elements.tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      elements.tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
    });
  });
}

elements.releaseBtn?.addEventListener("click", releaseThought);
