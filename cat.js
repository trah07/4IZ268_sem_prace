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

let cat = {
  x: catX,
  y: catY,
  width: catWidth,
  height: catHeight,
};

//cactus
let cactusArray = [];

let cactus1Width = 34;
let cactus2Width = 69;
let cactus3Width = 102;

let cactusHeight = 70;
let cactusX = 700;
let cactusY = boardHeight - cactusHeight;

let cactus1Img;
let cactus2Img;
let cactus3Img;

//fyzika
let velocityX = -8; //rychlost překážek
let velocityY = 0;
let gravity = 0.4;

let gameOver = false;
let score = 0;

// track and clouds
let trackImg;
let trackX = 0;
let cloudImg;
let clouds = [];

window.onload = function () {
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

  cactus1Img = new Image();
  cactus1Img.src = "./img/thread1.png";

  cactus2Img = new Image();
  cactus2Img.src = "./img/thread2.png";

  cactus3Img = new Image();
  cactus3Img.src = "./img/thread3.png";

  trackImg = new Image();
  trackImg.src = "./img/carpet.png";

  cloudImg = new Image();
  cloudImg.src = "./img/flowers.png";

  document.getElementById("game-over-container").style.display = "none";

  initializeClouds();

  requestAnimationFrame(update);
  setInterval(placeCactus, 1000); //1000 ms
  setInterval(placeCloud, 4000);
  document.addEventListener("keydown", moveCat);
  document.addEventListener("keydown", function (e) {
    if (e.code == "Enter" && gameOver) {
      restartGame();
    }
  });
};

function update() {
  requestAnimationFrame(update);

  if (gameOver) {
    document.getElementById("game-over-container").style.display = "block";
    context.drawImage(catDeadImg, cat.x, cat.y, cat.width, cat.height); // Ensure only the dead cat image is drawn
    displayFinalScore();
    return;
  }
  context.clearRect(0, 0, board.width, board.height);

  // clouds (background)
  for (let i = 0; i < clouds.length; i++) {
    let cloud = clouds[i];
    cloud.x += velocityX / 4; // clouds move slowly for background effect
    context.drawImage(cloudImg, cloud.x, cloud.y, cloud.width, cloud.height);
  }

  // Remove clouds that have moved off-screen
  clouds = clouds.filter((cloud) => cloud.x + cloud.width > 0);

  // track
  trackX -= 4;
  if (trackX <= -boardWidth) {
    trackX = 0;
  }
  context.drawImage(trackImg, trackX, boardHeight - 30, boardWidth, 30);
  context.drawImage(
    trackImg,
    trackX + boardWidth,
    boardHeight - 30,
    boardWidth,
    30
  );

  //kočka
  velocityY += gravity;
  cat.y = Math.min(cat.y + velocityY, catY); // Gravity for the cat

  if (gameOver) {
    context.drawImage(catDeadImg, cat.x, cat.y, cat.width, cat.height);
  } else if (cat.y < catY) {
    // Jumping
    context.drawImage(catImg, cat.x, cat.y, cat.width, cat.height);
  } else {
    // Running animation
    if (catFrame % 20 < 10) {
      context.drawImage(catRun1Img, cat.x, cat.y, cat.width, cat.height);
    } else {
      context.drawImage(catRun2Img, cat.x, cat.y, cat.width, cat.height);
    }
    catFrame++;
  }

  //cactus
  for (let i = 0; i < cactusArray.length; i++) {
    let cactus = cactusArray[i];
    cactus.x += velocityX;
    context.drawImage(
      cactus.img,
      cactus.x,
      cactus.y,
      cactus.width,
      cactus.height
    );

    if (detectCollision(cat, cactus)) {
      gameOver = true;
    }
  }

  // score
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

  if ((e.code == "Space" || e.code == "ArrowUp") && cat.y == catY) {
    //jump
    velocityY = -10;
  } else if (e.code == "ArrowDown" && cat.y == catY) {
    //duck
  }
}

function placeCactus() {
  if (gameOver) {
    return;
  }

  //place cactus
  let cactus = {
    img: null,
    x: cactusX,
    y: cactusY,
    width: null,
    height: cactusHeight,
  };

  let placeCactusChance = Math.random();

  if (placeCactusChance > 0.9) {
    //10% you get cactus3
    cactus.img = cactus3Img;
    cactus.width = cactus3Width;
    cactusArray.push(cactus);
  } else if (placeCactusChance > 0.7) {
    //30% you get cactus2
    cactus.img = cactus2Img;
    cactus.width = cactus2Width;
    cactusArray.push(cactus);
  } else if (placeCactusChance > 0.5) {
    //50% you get cactus1
    cactus.img = cactus1Img;
    cactus.width = cactus1Width;
    cactusArray.push(cactus);
  }

  if (cactusArray.length > 5) {
    cactusArray.shift(); // zabránění zvětšní pole
  }
}

function placeCloud() {
  if (gameOver) {
    return;
  }

  let cloud = {
    x: boardWidth,
    y: Math.random() * (boardHeight / 3), // Random height in upper third of the canvas
    width: 80,
    height: 50,
  };
  clouds.push(cloud);
}

function initializeClouds() {
  clouds = [];
  for (let i = 0; i < 3; i++) {
    placeInitialCloud(i * 250 + 100);
  }
}

function placeInitialCloud(offset) {
  let cloud = {
    x: offset,
    y: Math.random() * (boardHeight / 3),
    width: 80,
    height: 50,
  };
  clouds.push(cloud);
}

function detectCollision(a, b) {
  return (
    a.x < b.x + b.width && //levý horní roh a nedosahuje pravého horního rohu b
    a.x + a.width > b.x && //pravý horní roh a přechází do levého horního rohu b
    a.y < b.y + b.height && //levý horní roh a nedosahuje levého dolního rohu b
    a.y + a.height > b.y
  ); //levý dolní roh a prochází levým horním rohem b
}

function displayFinalScore() {
  const scoreContainer = document.getElementById("score-container");
  const finalScore = document.getElementById("final-score");
  finalScore.textContent = `Finalní skóre: ${score}`;
  scoreContainer.style.display = "block";
}

function restartGame() {
  gameOver = false;
  score = 0;
  velocityY = 0;
  cat.y = catY;
  cactusArray = [];
  initializeClouds();
  document.getElementById("game-over-container").style.display = "none";
  document.getElementById("score-container").style.display = "none";
  catImg.src = "./img/cat.png";
}
