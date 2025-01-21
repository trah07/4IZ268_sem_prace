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
    alert("Zadejte prosím platné jméno.");
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
  console.log("Restartuju hru...");
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

async function saveBestScore(name, score) {
  try {
    const response = await fetch(`${SERVER_URL}/saveBestScore`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, score }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Nejlepší dosažené skóre:", data);
    if (data.bestScore) {
      bestScore = data.bestScore.score;
      document.getElementById(
        "best-score"
      ).textContent = `${data.bestScore.name}: ${data.bestScore.score}`;
    }

    document.getElementById("name-prompt-modal").style.display = "none";
  } catch (error) {
    console.error("Chyba při ukládání nejlepšího skóre:", error.message);
    alert("Nepodařilo se uložit nejlepší skóre. Zkuste to prosím znovu.");
  }
}

function resetBestScore() {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", `${SERVER_URL}/resetBestScore`, true);

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        console.log(
          "Úspěšný reset nejlepšího skóre:",
          JSON.parse(xhr.responseText)
        );
      } else {
        console.error("Chyba při resetování nejlepšího skóre:", xhr.statusText);
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
          console.log("Nejlepší získané skóre:", response);
          bestScore = response.score;
          bestScoreDiv.textContent = `${response.name}: ${response.score}`;
        }
      } else {
        console.error("Error retrieving best score:", xhr.statusText);
        alert("Nepodařilo se získat nejlepší skóre. Zkuste to prosím znovu.");
      }
    }
  };

  xhr.send();
}
