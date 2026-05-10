
/* IMPORT GOOGLE AI SDK */
import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

/* CONFIGURATION - PUT YOUR API KEY HERE */AIzaSyDbbutdBcWJbIDLo9uTqgJHKHYNYt-12F0
const API_KEY = "YOUR_ACTUAL_GOOGLE_AI_STUDIO_KEY"; 
const genAI = new GoogleGenerativeAI(API_KEY);

const flora = ["🌱", "🌿", "🌸", "🌻", "🍀", "🌳"];

/* APP STATE */
let selectedMood = "";
let myGarden = [];

/* SAFE LOCAL STORAGE LOAD */
try {
  const savedGarden = localStorage.getItem("natureGarden");
  myGarden = savedGarden ? JSON.parse(savedGarden) : [];
} catch (error) {
  myGarden = [];
}

/* DOM ELEMENTS */
const gardenDiv = document.getElementById("garden");
const moodPrompt = document.getElementById("mood-prompt");
const input = document.getElementById("thought-input");
const aiContainer = document.getElementById("ai-response-container");
const aiText = document.getElementById("ai-text");
const releaseBtn = document.getElementById("release-btn");
const calmBtn = document.getElementById("calm-btn");
const chips = document.querySelectorAll(".chip");

/* INITIALIZE APP */
window.addEventListener("DOMContentLoaded", () => {
  renderGarden();
  initializeMoodButtons();
  initializeCalmButton();
});

/* MOOD BUTTONS */
function initializeMoodButtons() {
  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      selectedMood = chip.dataset.mood;
      updateMoodPrompt(selectedMood);
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

function renderGarden() {
  gardenDiv.innerHTML = "";
  myGarden.slice(-8).forEach((plant) => {
    const span = document.createElement("span");
    span.innerText = plant;
    gardenDiv.appendChild(span);
  });
}

/* RELEASE THOUGHT (UPDATED WITH REAL AI) */
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
    /* CALL REAL GEMINI AI */
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `The user is feeling ${selectedMood || 'thoughtful'} and shared this: "${thought}". 
    Act as a gentle nature guide. Reframe their stressor using a nature metaphor. 
    Be brief (1-2 sentences), comforting, and poetic.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    /* Display the result with the typewriter effect */
    typeWriterEffect(text);
    
    input.value = "";

  } catch (error) {
    console.error("AI Error:", error);
    typeWriterEffect("The wind carries your words away safely. Breathe deep; the earth hears you even in silence.");
  } finally {
    releaseBtn.disabled = false;
    releaseBtn.innerText = "Plant & Release";
  }
}

function saveGarden() {
  localStorage.setItem("natureGarden", JSON.stringify(myGarden));
}

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

/* CALM BUTTON & NAVIGATION */
function initializeCalmButton() {
  calmBtn.addEventListener("click", activateCalmMode);
}

function activateCalmMode() {
  document.body.style.transition = "background 1s ease";
  document.body.style.background = "#dff6e4";
  showAIMessage("🌿 Inhale slowly for 4 seconds. Hold gently. Exhale softly. You are safe in this moment.");
  navigator.vibrate?.(100);
  setTimeout(() => { document.body.style.background = "#f0f2f0"; }, 4000);
}

input.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    releaseThought();
  }
});

const tabs = document.querySelectorAll(".tab-item");
tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
  });
});
