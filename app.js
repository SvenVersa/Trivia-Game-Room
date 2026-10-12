const API_URL = "https://yvanfastapi.vercel.app/api";
const API_KEY = "omega_level_clearance";

let targetCatalog = [];
let currentTarget = null;
let score = 0;
let timeLeft = 10;
let timerInterval;

const bootScreen = document.getElementById("boot-screen");
const gameScreen = document.getElementById("game-screen");
const gameOverScreen = document.getElementById("game-over-screen");
const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");
const optionsGrid = document.getElementById("options-grid");
const restartBtn = document.getElementById("restart-btn");

async function fetchTargets() {
    try {
        const response = await fetch(`${API_URL}/heroes`, {
            headers: { "x-api-key": API_KEY }
        });
        if (!response.ok) throw new Error("Security clearance rejected.");
        targetCatalog = await response.json();
        bootScreen.classList.add("hidden");
        startRound();
    } catch (error) {
        bootScreen.innerHTML = `<h2 class="pow-text" style="font-size:3rem;">ERROR!</h2><p>${error.message}</p>`;
    }
}

function startRound() {
    gameScreen.classList.remove("hidden");
    optionsGrid.innerHTML = "";
    
    const shuffled = [...targetCatalog].sort(() => 0.5 - Math.random());
    currentTarget = shuffled[0];
    const decoys = shuffled.slice(1, 4);
    
    document.getElementById("clue-powers").innerText = currentTarget.primary_powers;
    document.getElementById("clue-weakness").innerText = currentTarget.tactical_vulnerability;
    document.getElementById("clue-base").innerText = currentTarget.base_of_operations;

    const options = [currentTarget, ...decoys].sort(() => 0.5 - Math.random());
    
    options.forEach(target => {
        const btn = document.createElement("button");
        btn.className = "action-btn";
        btn.innerText = target.alias;
        btn.onclick = () => handleGuess(target.id, btn);
        optionsGrid.appendChild(btn);
    });

    startTimer();
}

function startTimer() {
    clearInterval(timerInterval);
    timeLeft = 10;
    timerDisplay.innerText = timeLeft;
    
    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.innerText = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            triggerGameOver();
        }
    }, 1000);
}

function handleGuess(guessedId, btnElement) {
    clearInterval(timerInterval);
    Array.from(optionsGrid.children).forEach(btn => btn.disabled = true);

    if (guessedId === currentTarget.id) {
        btnElement.classList.add("correct");
        score += 100;
        scoreDisplay.innerText = score;
        setTimeout(startRound, 800);
    } else {
        btnElement.classList.add("wrong");
        setTimeout(triggerGameOver, 800);
    }
}

function triggerGameOver() {
    gameScreen.classList.add("hidden");
    gameOverScreen.classList.remove("hidden");
    document.getElementById("final-score").innerText = score;
}

restartBtn.onclick = () => {
    score = 0;
    scoreDisplay.innerText = score;
    gameOverScreen.classList.add("hidden");
    startRound();
};

document.addEventListener("DOMContentLoaded", fetchTargets);