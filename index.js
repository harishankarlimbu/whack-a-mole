document.addEventListener("DOMContentLoaded", () => {
  let score = 0;
  let gameRunning = false;
  let moleInterval, gameTimeout, countdownInterval;

  // Load sounds helper
  function createSound(path) {
    const sound = new Audio(path);
    sound.preload = "auto";
    return sound;
  }

  let startSound = createSound('sounds/start.mp3');
  let tickSound = createSound('sounds/tick.mp3');
  let hitSound = createSound('sounds/hit.mp3');
  let missSound = createSound('sounds/miss.mp3');
  let gameOverSound = createSound('sounds/gameover.mp3');

  const scoreDisplay = document.getElementById("score");
  const timeDisplay = document.getElementById("time");
  const holes = document.querySelectorAll(".hole");
  const startButton = document.getElementById("start-button");

  const gameOverBox = document.getElementById("game-over-box");
  const finalScoreText = document.getElementById("final-score-text");
  const closePopupBtn = document.getElementById("close-popup-btn");

  startButton.addEventListener("click", () => {
    if (gameRunning) return;

    resetSounds();
    gameRunning = true;
    score = 0;
    let timeLeft = 15;

    gameOverBox.classList.add("hidden");
    scoreDisplay.innerText = `Your Score: ${score}`;
    timeDisplay.innerText = `Time Remaining: ${timeLeft}`;

    startSound.play();

    // After start sound finishes
    startSound.onended = () => {
      startMoleSpawning();

      countdownInterval = setInterval(() => {
        timeLeft--;
        timeDisplay.innerText = `Time Remaining: ${timeLeft}`;

        tickSound.currentTime = 0;
        tickSound.play();

        if (timeLeft <= 0) clearInterval(countdownInterval);
      }, 1000);

      // Game ends after 15 seconds
      gameTimeout = setTimeout(() => {
        clearInterval(moleInterval);
        clearInterval(countdownInterval);
        holes.forEach(h => h.classList.remove("mole"));
        gameRunning = false;

        // Show Game Over popup first
        finalScoreText.innerText = `Your final score: ${score}`;
        gameOverBox.classList.remove("hidden");

        // Stop tick and play Game Over sound
        tickSound.pause();
        tickSound.currentTime = 0;
        gameOverSound.play();
      }, 15000);
    };
  });

  // Handle hits and misses
  document.getElementById("whack-a-mole").addEventListener("click", e => {
    if (!gameRunning) return;

    if (e.target.classList.contains("mole")) {
      e.target.classList.remove("mole");
      e.target.classList.add("hit");
      hitSound.currentTime = 0;
      hitSound.play();
      score++;
      scoreDisplay.innerText = `Your Score: ${score}`;
      setTimeout(() => e.target.classList.remove("hit"), 300);
    } else if (e.target.classList.contains("hole")) {
      missSound.currentTime = 0;
      missSound.play();
    }
  });

  // Spawns random moles for a short time
  function startMoleSpawning() {
    moleInterval = setInterval(() => {
      const moleCount = Math.floor(Math.random() * 4) + 1;

      for (let i = 0; i < moleCount; i++) {
        const randomHole = holes[Math.floor(Math.random() * holes.length)];

        // If not already shown
        if (!randomHole.classList.contains("mole")) {
          randomHole.classList.add("mole");

          // Auto remove after 600ms
          setTimeout(() => {
            randomHole.classList.remove("mole");
          }, 2000);
        }
      }
    }, 2000);
  }

  // Reset sounds for fresh play
  function resetSounds() {
    startSound = createSound('sounds/start.mp3');
    tickSound = createSound('sounds/tick.mp3');
    hitSound = createSound('sounds/hit.mp3');
    missSound = createSound('sounds/miss.mp3');
    gameOverSound = createSound('sounds/gameover.mp3');
  }

  // Close Game Over popup
  closePopupBtn.addEventListener("click", () => {
    gameOverBox.classList.add("hidden");
    score = 0;
    gameRunning = false;
    scoreDisplay.innerText = `Your Score: 0`;
    timeDisplay.innerText = `Time Remaining: 0`;
    holes.forEach(h => {
      h.classList.remove("mole");
      h.classList.remove("hit");
    });
    clearInterval(moleInterval);
    clearInterval(countdownInterval);
    clearTimeout(gameTimeout);
  });
});
