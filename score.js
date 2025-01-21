function displayFinalScore() {
  const scoreContainer = document.getElementById("score-container");
  const finalScore = document.getElementById("final-score");
  finalScore.textContent = `Finální skóre: ${score}`;
  scoreContainer.style.display = "block";

  if (score > bestScore) {
    displayNamePromptModal();
  }
}

function displayNamePromptModal() {
  const namePromptModal = document.getElementById("name-prompt-modal");
  const restartButton = document.getElementById("restart-button");

  // Zobrazí modální okno
  namePromptModal.style.display = "block";

  // Deaktivuje tlačítko restart
  restartButton.disabled = true;
}

function submitPlayerName() {
  const playerNameInput = document.getElementById("player-name-input");
  const playerName = playerNameInput.value.trim();

  // Validace vstupu
  if (playerName.length < 2 || /[^a-zA-Z0-9 ]/.test(playerName)) {
    alert("Zadejte prosím platné jméno (min. 2 znaky, bez speciálních znaků).");
    return; // Ukončí funkci, pokud je jméno neplatné
  }

  if (playerName !== "") {
    saveBestScore(playerName, score); // Uloží nejlepší skóre do localStorage
    playerNameInput.value = ""; // Vymaže vstupní pole

    // Skryje modální okno
    const namePromptModal = document.getElementById("name-prompt-modal");
    namePromptModal.style.display = "none";

    // Aktivuje tlačítko restart
    const restartButton = document.getElementById("restart-button");
    restartButton.disabled = false;
  } else {
    alert("Zadejte prosím platné jméno.");
  }
}

// Posluchač pro klávesu Enter
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
  difficultyFactor = 1; // reset obtížnosti
  velocityX = -8; // reset rychlosti
  threadsInterval = 1000; // reset intervalu klubíček

  // vymazat a znovu spustit interval umísťování klubíček
  clearInterval(threadsIntervalId);
  startThreadsPlacement();

  // vymazat a znovu spustit interval zvyšování obtížnosti
  clearInterval(difficultyIncreaseIntervalId);
  difficultyIncreaseIntervalId = setInterval(() => {
    difficultyFactor += 0.1;
    velocityX = Math.max(velocityX - 0.5, -30);
    updateThreadsInterval(); // Dynamically update thread interval
  }, 10000);

  document.getElementById("game-over-container").style.display = "none";
  document.getElementById("score-container").style.display = "none";
  catImg.src = "./img/cat.png";
}

function saveBestScore(name, score) {
  try {
    const bestScoreData = {
      name,
      score,
    };
    localStorage.setItem("bestScore", JSON.stringify(bestScoreData));
    bestScore = score;
    document.getElementById("best-score").textContent = `${name}: ${score}`;
    console.log("Nejlepší dosažené skóre uloženo:", bestScoreData);
  } catch (error) {
    console.error("Chyba při ukládání nejlepšího skóre:", error.message);
    alert("Nepodařilo se uložit nejlepší skóre. Zkuste to prosím znovu.");
  }
}

function resetBestScore() {
  try {
    localStorage.removeItem("bestScore");
    bestScore = 0;
    document.getElementById("best-score").textContent = "";
    console.log("Nejlepší skóre bylo resetováno.");
  } catch (error) {
    console.error("Chyba při resetování nejlepšího skóre:", error.message);
  }
}

function retrieveBestScore() {
  try {
    const bestScoreData = JSON.parse(localStorage.getItem("bestScore"));
    const bestScoreDiv = document.getElementById("best-score");

    if (
      bestScoreData &&
      bestScoreData.name &&
      bestScoreData.score !== undefined
    ) {
      bestScore = bestScoreData.score;
      bestScoreDiv.textContent = `${bestScoreData.name}: ${bestScoreData.score}`;
      console.log("Načteno nejlepší skóre:", bestScoreData);
    } else {
      bestScoreDiv.textContent = "Zatím žádné nejlepší skóre";
      bestScore = 0;
    }
  } catch (error) {
    console.error("Chyba při načítání nejlepšího skóre:", error.message);
    alert("Nepodařilo se načíst nejlepší skóre. Zkuste to prosím znovu.");
  }
}
