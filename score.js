//server
const SERVER_URL = "http://localhost:3000"; // lokálně http://localhost:3000

function displayFinalScore() {
  const scoreContainer = document.getElementById("score-container");
  const finalScore = document.getElementById("final-score");
  finalScore.textContent = `Finalní skóre: ${score}`;
  scoreContainer.style.display = "block";

  if (score > bestScore) {
    const namePromptModal = document.getElementById("name-prompt-modal");
    namePromptModal.style.display = "block"; // modál
  }
}

function submitPlayerName() {
  const playerNameInput = document.getElementById("player-name-input");
  const playerName = playerNameInput.value.trim();

  if (playerName !== "") {
    saveBestScore(playerName, score); // uložení nejlepšího skóre pomocí AJAXu
    playerNameInput.value = ""; // vymazání vstupního pole po odeslání
    document.getElementById("name-prompt-modal").style.display = "none"; // schování modálu
  } else {
    alert("Please enter a valid name.");
  }
}

// tlačítko Enter
document
  .getElementById("player-name-input")
  .addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      submitPlayerName();
    }
  });

function restartGame() {
  console.log("Restarting game...");
  console.log("difficultyFactor:", difficultyFactor, "velocityX:", velocityX);

  gameOver = false;
  score = 0;
  velocityY = 0;
  cat.y = catY;
  threadsArray = [];
  initializeFlowers();
  difficultyFactor = 1; // resetuje obtížnost
  velocityX = -8; // reset rychlosti
  threadsInterval = 1000; // reset interval klubíček
  // vymazat a restartovat interval umísťování klubíček
  clearInterval(threadsIntervalId);
  startThreadsPlacement();

  // vymazat a znovu spustit interval zvyšování obtížnosti
  clearInterval(difficultyIncreaseIntervalId);
  difficultyIncreaseIntervalId = setInterval(() => {
    difficultyFactor += 0.1;
    velocityX = Math.max(velocityX - 0.5, -30);
    updateThreadsInterval(); // dynamicky aktualizovat interval klubíček
  }, 10000);

  document.getElementById("game-over-container").style.display = "none";
  document.getElementById("score-container").style.display = "none";
  catImg.src = "./img/cat.png";
}

function saveBestScore(name, score) {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", `${SERVER_URL}/saveBestScore`, true);
  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        console.log("Best score saved:", response);
        if (response.bestScore) {
          bestScore = response.bestScore.score;
          document.getElementById(
            "best-score"
          ).textContent = `${response.bestScore.name}: ${response.bestScore.score}`;
        }
        document.getElementById("name-prompt-modal").style.display = "none";
      } else {
        console.error("Error saving best score:", xhr.statusText);
        alert("Failed to save the best score. Please try again.");
      }
    }
  };

  const data = JSON.stringify({ name, score });
  xhr.send(data);
}

function resetBestScore() {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", `${SERVER_URL}/resetBestScore`, true);

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        console.log(
          "Best score reset successfully:",
          JSON.parse(xhr.responseText)
        );
      } else {
        console.error("Error resetting best score:", xhr.statusText);
      }
    }
  };

  xhr.send();
}

function resetBestScore() {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", `${SERVER_URL}/resetBestScore`, true);

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        console.log(
          "Best score reset successfully:",
          JSON.parse(xhr.responseText)
        );
      } else {
        console.error("Error resetting best score:", xhr.statusText);
      }
    }
  };

  xhr.send();
}

function retrieveBestScore() {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", `${SERVER_URL}/getBestScore`, true);

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        const bestScoreDiv = document.getElementById("best-score");

        if (response.message) {
          bestScoreDiv.textContent = response.message; // "Zatím žádné nejlepší skóre"
        } else if (response.name && response.score !== undefined) {
          console.log("Best score retrieved:", response);
          bestScore = response.score;
          bestScoreDiv.textContent = `${response.name}: ${response.score}`;
        }
      } else {
        console.error("Error retrieving best score:", xhr.statusText);
        alert("Failed to retrieve the best score. Please try again.");
      }
    }
  };

  xhr.send();
}
