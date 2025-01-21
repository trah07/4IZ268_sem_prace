// board
let board;
let boardWidth = 750;
let boardHeight = 250;
let context;

// kočka
let catWidth = 88;
let catHeight = 72;
let catX = 50;
let catY = boardHeight - catHeight;
let catImg;
let catRun1Img;
let catRun2Img;
let catDeadImg;
let catFrame = 0;
let isDucking = false;

let cat = {
  x: catX,
  y: catY,
  width: catWidth,
  height: catHeight,
};

// klubíčka
let threadsArray = [];

let threads1Width = 34;
let threads2Width = 69;
let threads3Width = 102;

let threadsHeight = 70;
let threadsX = 700;
let threadsY = boardHeight - threadsHeight;

let threads1Img;
let threads2Img;
let threads3Img;

//fyzika
let velocityX = -8; //rychlost překážek
let velocityY = 0;
let gravity = 0.4;

let gameOver = false;
let score = 0;

// koberec a květiny
let carpetImg;
let carpetX = 0;
let flowerImg;
let flowers = [];

// obtížnost
let difficultyFactor = 1;
let threadsInterval = 1000;
let threadsIntervalId;
let difficultyIncreaseIntervalId;

let bestScore = 0;

window.onload = function () {
  // Resetování nejlepšího skóre
  resetBestScore();

  // Zablokování tlačítka restart při startu
  const restartButton = document.getElementById("restart-button");
  restartButton.disabled = true;

  // inicializace herního plánu a prostředků
  board = document.getElementById("board");
  board.height = boardHeight;
  board.width = boardWidth;

  context = board.getContext("2d");

  catImg = new Image();
  catImg.src = "./img/cat.png";

  catRun1Img = new Image();
  catRun1Img.src = "./img/cat-run1.png";

  catRun2Img = new Image();
  catRun2Img.src = "./img/cat-run2.png";

  catDeadImg = new Image();
  catDeadImg.src = "./img/cat-dead.png";

  threads1Img = new Image();
  threads1Img.src = "./img/thread1.png";

  threads2Img = new Image();
  threads2Img.src = "./img/thread2.png";

  threads3Img = new Image();
  threads3Img.src = "./img/thread3.png";

  carpetImg = new Image();
  carpetImg.src = "./img/carpet.png";

  flowerImg = new Image();
  flowerImg.src = "./img/flowers.png";

  document.getElementById("game-over-container").style.display = "none";

  initializeFlowers();

  requestAnimationFrame(update);
  startThreadsPlacement();
  setInterval(placeFlower, 4000);

  difficultyIncreaseIntervalId = setInterval(() => {
    difficultyFactor += 0.1;
    velocityX = Math.max(velocityX - 0.5, -30);
    updateThreadsInterval();
  }, 10000);

  document.addEventListener("keydown", moveCat);
  document.addEventListener("keyup", function (e) {
    if (e.code === "ArrowDown") {
      isDucking = false;
    }
  });

  // načtení nejlepšího skóre po jeho resetování
  retrieveBestScore();
};

window.onbeforeunload = function () {
  return "Obnovením stránky se vymaže skóre. Chcete pokračovat?";
};

function startThreadsPlacement() {
  threadsIntervalId = setInterval(placeThreads, threadsInterval);
}

function updateThreadsInterval() {
  clearInterval(threadsIntervalId); // vymazání stávajícího intervalu

  // nastavení intervalu klubíček
  threadsInterval = Math.max(1000 / (difficultyFactor * 0.8), 500); // minimální interval je 500ms
  threadsIntervalId = setInterval(placeThreads, threadsInterval); // restart s novým intervalem
}

function update() {
  requestAnimationFrame(update);

  if (gameOver) {
    document.getElementById("game-over-container").style.display = "block";
    context.drawImage(catDeadImg, cat.x, cat.y, cat.width, cat.height); // Ensure only the dead cat image is drawn
    displayFinalScore();
    return;
  }
  context.clearRect(0, 0, board.width, board.height);

  // květiny v pozadí
  for (let i = 0; i < flowers.length; i++) {
    let flower = flowers[i];
    flower.x += velocityX / 4; // pomalejší pohyb květin
    context.drawImage(
      flowerImg,
      flower.x,
      flower.y,
      flower.width,
      flower.height
    );
  }

  // odstranění květin mimo obrazovku
  flowers = flowers.filter((flower) => flower.x + flower.width > 0);

  // carpet
  carpetX -= 4;
  if (carpetX <= -boardWidth) {
    carpetX = 0;
  }
  context.drawImage(carpetImg, carpetX, boardHeight - 30, boardWidth, 30);
  context.drawImage(
    carpetImg,
    carpetX + boardWidth,
    boardHeight - 30,
    boardWidth,
    30
  );

  //kočka
  if (!isDucking) {
    velocityY += gravity; // gravitace
  }
  cat.y = Math.min(cat.y + velocityY, catY);

  if (gameOver) {
    context.drawImage(catDeadImg, cat.x, cat.y, cat.width, cat.height);
  } else if (cat.y < catY) {
    // skákání a padání
    context.drawImage(catImg, cat.x, cat.y, cat.width, cat.height);
  } else {
    // animace běhu
    if (catFrame % 20 < 10) {
      context.drawImage(catRun1Img, cat.x, cat.y, cat.width, cat.height);
    } else {
      context.drawImage(catRun2Img, cat.x, cat.y, cat.width, cat.height);
    }
    catFrame++;
  }

  // klubíčka
  for (let i = 0; i < threadsArray.length; i++) {
    let threads = threadsArray[i];
    threads.x += velocityX;
    context.drawImage(
      threads.img,
      threads.x,
      threads.y,
      threads.width,
      threads.height
    );

    if (detectCollision(cat, threads)) {
      gameOver = true;
    }
  }

  // skóre
  if (!gameOver) {
    context.fillStyle = "black";
    context.font = "20px courier";
    score++;
    context.fillText(score, 5, 20);
  }
}

function moveCat(e) {
  if (gameOver) {
    return;
  }

  if ((e.code === "Space" || e.code === "ArrowUp") && cat.y === catY) {
    // skok
    velocityY = -12;
  } else if (e.code === "ArrowDown" && cat.y < catY) {
    // padání
    isDucking = true;
    velocityY += 12; // rychlost směrem dolů
  }
}

function placeThreads() {
  if (gameOver) {
    return;
  }

  // pokládání klubíček
  let threads = {
    img: null,
    x: threadsX,
    y: threadsY,
    width: null,
    height: threadsHeight,
  };

  let placeThreadsChance = Math.random();

  if (placeThreadsChance > 0.9) {
    //10% threads3
    threads.img = threads3Img;
    threads.width = threads3Width;
    threadsArray.push(threads);
  } else if (placeThreadsChance > 0.7) {
    //30% threads2
    threads.img = threads2Img;
    threads.width = threads2Width;
    threadsArray.push(threads);
  } else if (placeThreadsChance > 0.5) {
    //50% threads1
    threads.img = threads1Img;
    threads.width = threads1Width;
    threadsArray.push(threads);
  }

  if (threadsArray.length > 5) {
    threadsArray.shift(); // zabránění zvětšní pole
  }
}

function placeFlower() {
  if (gameOver) {
    return;
  }

  let flower = {
    x: boardWidth,
    y: Math.random() * (boardHeight / 3),
    width: 80,
    height: 50,
  };
  flowers.push(flower);
}

function initializeFlowers() {
  flowers = [];
  for (let i = 0; i < 3; i++) {
    placeInitialFlower(i * 250 + 100);
  }
}

function placeInitialFlower(offset) {
  let flower = {
    x: offset,
    y: Math.random() * (boardHeight / 3),
    width: 80,
    height: 50,
  };
  flowers.push(flower);
}

function detectCollision(a, b) {
  return (
    a.x < b.x + b.width && //levý horní roh a nedosahuje pravého horního rohu b
    a.x + a.width > b.x && //pravý horní roh a přechází do levého horního rohu b
    a.y < b.y + b.height && //levý horní roh a nedosahuje levého dolního rohu b
    a.y + a.height > b.y
  ); //levý dolní roh a prochází levým horním rohem b
}
