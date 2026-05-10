/* IMPORT GOOGLE AI SDK */
import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

/* CONFIGURATION */
const API_KEY = "AIzaSyDbbutdBcWJbIDLo9uTqgJHKHYNYt-12F0"; // Your Key Integrated
const genAI = new GoogleGenerativeAI(API_KEY);

const flora = ["🌱", "🌿", "🌸", "🌻", "🍀", "🌳"];

/* MUSIC MAPPING */
const moodMusic = {
  angry: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3", 
  stressed: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  lonely: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  anxious: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
};

/* APP STATE */
let selectedMood = "";
let myGarden = [];

/* DOM ELEMENTS */
const gardenDiv = document.getElementById("garden");
const moodPrompt = document.getElementById("mood-prompt");
const input = document.getElementById("thought-input");
const aiContainer = document.getElementById("ai-response-container");
const aiText = document.getElementById("ai-text");
const releaseBtn = document.getElementById("release-btn");
const calmBtn = document.getElementById("calm-btn");
const chips = document.querySelectorAll(".chip");
const audioPlayer = document.getElementById("bg-music");

/* INITIALIZE APP */
window.addEventListener("DOMContentLoaded", () => {
  loadGarden();
  renderGarden();
  initializeMoodButtons();
  initializeCalmButton();
  initializeTabs();
});

/* LOCAL STORAGE */
function loadGarden() {
  try {
    const savedGarden = localStorage.getItem("natureGarden");
    myGarden = savedGarden ? JSON.parse(savedGarden) : [];
  } catch (error) {
    myGarden = [];
  }
}

function saveGarden() {
  localStorage.setItem("natureGarden", JSON.stringify(myGarden));
}

/* MUSIC LOGIC */
function playMoodMusic(mood) {
  if (moodMusic[mood] && audioPlayer) {
    audioPlayer.src = moodMusic[mood];
    audioPlayer.volume = 0.4; 
    audioPlayer.play().catch(e => console.log("Waiting for user interaction to play audio..."));
  }
}

/* MOOD BUTTONS */
function initializeMoodButtons() {
  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      
      selectedMood = chip.dataset.mood;
      updateMoodPrompt(selectedMood);
      playMoodMusic(selectedMood); // Play music based on mood
    });
  });
}

function updateMoodPrompt(mood) {
  const prompts = {
    angry: "🔥 Let the heat out. What happened?",
    stressed: "🌊 Breathe slowly. What feels overwhelming?",
    lonely: "🍃 You are not alone. What is hurting?",
    anxious: "☁️ What thoughts keep circling your mind?"
  };
  moodPrompt.innerText = prompts[mood] || "What is weighing on your heart?";
}

/* GARDEN RENDERING */
function renderGarden() {
  if (!gardenDiv) return;
  gardenDiv.innerHTML = "";
  myGarden.slice(-8).forEach((plant) => {
    const span = document.createElement("span");
    span.innerText = plant;
    gardenDiv.appendChild(span);
  });
}

/* RELEASE THOUGHT (AI LOGIC) */
releaseBtn.addEventListener("click", releaseThought);

async function releaseThought() {
  const thought = input.value.trim();

  if (!thought) {
    showAIMessage("The earth is waiting for your words...");
    return;
  }

  /* UI Feedback */
  releaseBtn.disabled = true;
  releaseBtn.innerText = "Planting...";
  showAIMessage("🌱 The earth is listening...");

  /* Add plant to garden */
  const randomPlant = flora[Math.floor(Math.random() * flora.length)];
  myGarden.push(randomPlant);
  saveGarden();
  renderGarden();

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `The user is feeling ${selectedMood || 'thoughtful'} and shared: "${thought}". 
    Act as a gentle nature guide. Reframe their stress into a brief, poetic nature metaphor (1-2 sentences). 
    Focus on healing and peace.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    typeWriterEffect(text);
    input.value = "";

  } catch (error) {
    console.error("AI Error:", error);
    typeWriterEffect("The wind carries your words away safely. Breathe deep; you are heard.");
  } finally {
    releaseBtn.disabled = false;
    releaseBtn.innerText = "Plant & Release";
  }
}

/* UI EFFECTS */
function showAIMessage(message) {
  aiContainer.classList.remove("hidden");
  aiText.innerText = message;
}

function typeWriterEffect(text) {
  aiContainer.classList.remove("hidden");
  aiText.innerText = "";
  let index = 0;
  const interval = setInterval(() => {
    aiText.innerText += text[index];
    index++;
    if (index >= text.length) {
      clearInterval(interval);
    }
  }, 25);
}

/* CALM MODE */
function initializeCalmButton() {
  if (!calmBtn) return;
  calmBtn.addEventListener("click", () => {
    document.body.style.transition = "background 1.5s ease";
    document.body.style.background = "#dff6e4";
    showAIMessage("🌿 Inhale... Exhale... You are grounded. You are safe.");
    navigator.vibrate?.(100);
    setTimeout(() => { document.body.style.background = "#f0f2f0"; }, 5000);
  });
}

/* NAVIGATION & HELPERS */
function initializeTabs() {
  const tabs = document.querySelectorAll(".tab-item");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
    });
  });
}

input.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    releaseThought();
  }
});
