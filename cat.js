//board
let board;
let boardWidth = 750;
let boardHeight = 250;
let context;

//kočka
let catWidth = 88;
let catHeight = 94;
let catX = 50;
let catY = boardHeight - catHeight;
let catImg;

let cat = {
  x: catX,
  y: catY,
  width: catWidth,
  height: catHeight,
};

//klubíčko
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
let velocityX = -8; // rychlost klubíčka směrem doleva
let velocityY = 0;
let gravity = 0.4;

let gameOver = false;
let score = 0;

window.onload = function () {
  board = document.getElementById("board");
  board.height = boardHeight;
  board.width = boardWidth;

  context = board.getContext("2d");

  //   context.fillStyle = "green";
  //   context.fillRect(cat.x, cat.y, cat.width, cat.height);

  catImg = new Image();
  catImg.src = "img/cat.png";
  catImg.onload = function () {
    context.drawImage(catImg, cat.x, cat.y, cat.width, cat.height);
  };

  cactus1Img = new Image();
  cactus1Img.src = "img/cactus1.png";

  cactus2Img = new Image();
  cactus2Img.src = "img/cactus2.png";

  cactus3Img = new Image();
  cactus3Img.src = "img/cactus3.png";

  requestAnimationFrame(update);
  setInterval(placeCactus, 1000); //1000 ms
  document.addEventListener("keydown", moveCat);
};

function update() {
  requestAnimationFrame(update);
  if (gameOver) {
    return;
  }

  context.clearRect(0, 0, board.width, board.height);

  // kočka
  velocityY += gravity;
  cat.y = Math.min(cat.y + velocityY, catY); // gravitace pro cat.y
  context.drawImage(catImg, cat.x, cat.y, cat.width, cat.height);

  // klubíčka
  for (let i = 0; 1 < cactusArray.length; i++) {
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
      catImg.src = "./img/cat-dead.png";
      catImg.onload = function () {
        context.drawImage(catImg, cat.x, cat.y, cat.width, cat.height);
      };
    }
  }

  // skóre
  context.fillStyle = "black";
  context.font = "20px courier";
  score++;
  context.filltext(score, 5, 20);
}

// funkce skákání
function moveCat(e) {
  if (gameOver) {
    return;
  }

  if ((e.code == "Space" || e.code == "ArrowUp") && cat.y == catY) {
    // skok
    velocityY = -10;
  }
}

function placeCactus() {
  if (gameOver) {
    return;
  }
  //vkladání klubíčka
  let cactus = {
    img: null,
    x: cactusX,
    y: cactusY,
    width: null,
    height: cactusHeight,
  };

  let placeCactusChance = Math.random();
  if (placeCactusChance > 0.9) {
    // 10% šance pro cactus3
    cactus.img = cactus3Img;
    cactus.width = cactus3Width;
    cactusArray.push(cactus);
  } else if (placeCactusChance > 0.7) {
    // 10% šance pro cactus2
    cactus.img = cactus2Img;
    cactus.width = cactus2Width;
    cactusArray.push(cactus);
  }
  if (placeCactusChance > 0.5) {
    // 50% šance pro cactus1
    cactus.img = cactus1Img;
    cactus.width = cactus1Width;
    cactusArray.push(cactus);
  }

  if (cactusArray.length > 5) {
    cactusArray.shift(); // podmínka, aby nebylo víc než 5 kaktusů (kontrola paměti)
  }
}

function detectCollision(a, b) {
  return (
    a.x < b.x + b.width && // levý horní roh a nedosáhne na pravý horní roh b
    a.x + a.width > b.x && // levý horní roh a přejde přes pravý horní roh b
    a.y < b.y + b.height && // levý spodní roh a nedosáhne na pravý spodní roh b
    a.y + a.height > b.y // levý spodní roh a přesáhne pravý spodní roh b
  );
}
