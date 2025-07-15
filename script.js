const gameBoard = document.getElementById("gameBoard");
const ctx = gameBoard.getContext("2d");
const scoreContext = document.getElementById("gameScore");
const startGameBtn = document.getElementById("startGame");
const boardWidth = gameBoard.width;
const boardHeight = gameBoard.height;
const boardBg = "white";
const snakeColor = "lime";
const snakeBorder = "green";
const foodColor = "purple";

const UNIT_STEP = 25;
const NO_STEP = 0;
const snakeInitial = [
  { x: UNIT_STEP * 2, y: NO_STEP },
  { x: UNIT_STEP, y: NO_STEP },
  { x: NO_STEP, y: NO_STEP }
];
const DIRECTIONS = {
  ArrowLeft: { x: -UNIT_STEP, y: NO_STEP },
  ArrowUp: { x: NO_STEP, y: -UNIT_STEP },
  ArrowRight: { x: UNIT_STEP, y: NO_STEP },
  ArrowDown: { x: NO_STEP, y: UNIT_STEP },
};

let isRunning = false;
let xVelocity = UNIT_STEP;
let yVelocity = 0;
let foodX, foodY;
let score = 0;
let snake = [...snakeInitial];
let speed = 100;

createFood();
drawFood();
drawSnake();

window.addEventListener("keydown", changeDirection);
startGameBtn.addEventListener("click", startGame);

const snakeHeadX = (i = 0) => snake[i].x
const snakeHeadY = (i = 0) => snake[i].y

function startGame() {
  if(isRunning) return;

  isRunning = true;
  resetGame();
  createFood();
  nextTick();
};

function nextTick() {
  if(isRunning) {
    setTimeout(() => {
      clearBoard();
      drawFood();
      moveSnake();
      drawSnake();
      checkGameOver();
      nextTick();
    }, speed);
  } else {
    displayGameOver();
  }

};

function clearBoard() {
  ctx.fillStyle = boardBg;
  ctx.fillRect(0, 0, boardWidth, boardHeight);
};

function randomFoodCoord(min, max) {
  return Math.floor((Math.random() * (max - min) + min) / UNIT_STEP) * UNIT_STEP;
}

function createFood() {
  do {
    foodX = randomFoodCoord(0, boardWidth - UNIT_STEP);
    foodY = randomFoodCoord(0, boardHeight - UNIT_STEP);
  } while (snake.some(s => s.x === foodX && s.y === foodY))
};

function drawFood() {
  ctx.fillStyle = foodColor;
  ctx.fillRect(foodX, foodY, UNIT_STEP, UNIT_STEP);
};

function moveSnake() {
  const head = {
    x: snakeHeadX() + xVelocity,
    y: snakeHeadY() + yVelocity
  };
  
  if (head.x < 0) {
    head.x = boardWidth - UNIT_STEP;
  } else if (snakeHeadX() >= boardWidth) {
    head.x = 0;
  } else if (snakeHeadY() < 0) {
    head.y = boardHeight -  UNIT_STEP;
  } else if (snakeHeadY() >= boardHeight) {
    head.y = 0;
  }
  
  snake.unshift(head);

  if (snakeHeadX() == foodX && snakeHeadY() == foodY) {
    score++;
    scoreContext.textContent = score;
    createFood();
  }
  else {
    snake.pop();
  }
};

function drawSnake() {
  ctx.fillStyle = snakeColor;
  ctx.strokeStyle = snakeBorder;

  snake.forEach(snakePart => {
    ctx.fillRect(snakePart.x, snakePart.y, UNIT_STEP, UNIT_STEP);
    ctx.strokeRect(snakePart.x, snakePart.y, UNIT_STEP, UNIT_STEP);
  })
};

function changeDirection(event) {
  event.preventDefault();

  const newDir = DIRECTIONS[event.key];
  if (!newDir) return;

  const isOpposite = xVelocity + newDir.x === 0 && yVelocity + newDir.y === 0;

  if (!isOpposite) {
    xVelocity = newDir.x;
    yVelocity = newDir.y;
  }
}

function checkGameOver() {
  if (snakeHeadX() < 0 || snakeHeadX() >= boardWidth || snakeHeadY() < 0 || snakeHeadY() >= boardHeight) {
    // isRunning = false;
    
  }

  for (let i = 1; i < snake.length; i++) {
    if (snakeHeadX(i) == snakeHeadX() && snakeHeadY(i) == snakeHeadY()) {
      isRunning = false;
    }
  }
};

function displayGameOver() {
  ctx.font = "60px Arial";
  ctx.fillStyle = boardBg;
  ctx.fillRect(0, 0, boardWidth, boardHeight);
  ctx.fillStyle = "red";
  ctx.textAlign = "center";
  ctx.fillText(strings.gameOver, boardWidth / 2, boardHeight / 2);
  
  isRunning = false;
  startGameBtn.textContent = strings.startAgain;
};

function resetGame() {
  score = 0;
  scoreContext.textContent = score;
  xVelocity = UNIT_STEP;
  yVelocity = NO_STEP;
  snake = [...snakeInitial];
};