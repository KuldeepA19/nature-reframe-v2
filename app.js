const flora = ["🌱", "🌿", "🌸", "🌻", "🍀", "🌳"];

const wisdomMessages = [
  "This thought is now fertilizer for your growth.",
  "Like a river carries away debris, let this thought flow past you.",
  "The forest doesn't rush. Be patient with yourself.",
  "You planted your pain. Now let peace grow.",
  "Even storms help forests become stronger.",
  "You are healing one breath at a time."
];

/* APP STATE */
let selectedMood = "";
let myGarden = [];

/* SAFE LOCAL STORAGE LOAD */
try {
  const savedGarden = localStorage.getItem("natureGarden");

  myGarden = savedGarden
    ? JSON.parse(savedGarden)
    : [];
} catch (error) {
  myGarden = [];
}

/* DOM ELEMENTS */
const gardenDiv = document.getElementById("garden");
const moodPrompt = document.getElementById("mood-prompt");
const input = document.getElementById("thought-input");

const aiContainer = document.getElementById(
  "ai-response-container"
);

const aiText = document.getElementById("ai-text");

const releaseBtn = document.getElementById(
  "release-btn"
);

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
      chips.forEach((c) =>
        c.classList.remove("active")
      );

      chip.classList.add("active");

      selectedMood = chip.dataset.mood;

      updateMoodPrompt(selectedMood);
    });
  });
}

/* UPDATE PROMPTS */
function updateMoodPrompt(mood) {
  const prompts = {
    angry:
      "🔥 Let the heat out. What happened?",

    stressed:
      "🌊 Breathe slowly. What feels overwhelming?",

    lonely:
      "🍃 You are not alone. What is hurting?",

    anxious:
      "☁️ What thoughts keep circling your mind?"
  };

  moodPrompt.innerText =
    prompts[mood] ||
    "What is weighing on your heart?";
}

/* RENDER GARDEN */
function renderGarden() {
  gardenDiv.innerHTML = "";

  myGarden
    .slice(-8)
    .forEach((plant) => {
      const span = document.createElement("span");

      span.innerText = plant;

      gardenDiv.appendChild(span);
    });
}

/* RELEASE THOUGHT */
releaseBtn.addEventListener(
  "click",
  releaseThought
);

function releaseThought() {
  const thought = input.value.trim();

  if (!thought) {
    showAIMessage(
      "The earth is waiting for your words..."
    );

    return;
  }

  /* Disable button during response */
  releaseBtn.disabled = true;

  releaseBtn.innerText = "Planting...";

  /* Show loading */
  showAIMessage(
    "🌱 The earth is listening..."
  );

  /* Add plant */
  const randomPlant =
    flora[
      Math.floor(Math.random() * flora.length)
    ];

  myGarden.push(randomPlant);

  saveGarden();

  renderGarden();

  /* Simulated AI Delay */
  setTimeout(() => {
    const wisdom =
      wisdomMessages[
        Math.floor(
          Math.random() *
            wisdomMessages.length
        )
      ];

    typeWriterEffect(wisdom);

    input.value = "";

    releaseBtn.disabled = false;

    releaseBtn.innerText =
      "Plant & Release";
  }, 1800);
}

/* SAVE GARDEN */
function saveGarden() {
  localStorage.setItem(
    "natureGarden",
    JSON.stringify(myGarden)
  );
}

/* AI MESSAGE */
function showAIMessage(message) {
  aiContainer.classList.remove("hidden");

  aiText.innerText = message;
}

/* TYPEWRITER EFFECT */
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

/* CALM BUTTON */
function initializeCalmButton() {
  calmBtn.addEventListener(
    "click",
    activateCalmMode
  );
}

function activateCalmMode() {
  document.body.style.transition =
    "background 1s ease";

  document.body.style.background =
    "#dff6e4";

  showAIMessage(
    "🌿 Inhale slowly for 4 seconds. Hold gently. Exhale softly. You are safe in this moment."
  );

  navigator.vibrate?.(100);

  setTimeout(() => {
    document.body.style.background =
      "#f0f2f0";
  }, 4000);
}

/* ENTER KEY SUPPORT */
input.addEventListener(
  "keydown",
  (event) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();

      releaseThought();
    }
  }
);

/* TAB NAVIGATION */
const tabs =
  document.querySelectorAll(".tab-item");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) =>
      t.classList.remove("active")
    );

    tab.classList.add("active");
  });
});
