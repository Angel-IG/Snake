// Possible numbers of rows and columns:
// 1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 20,
// 24, 25, 30, 40, 50, 60, 75, 100, 120,
// 150, 200, 300 or 600.

let canvas = document.getElementById('myCanvas');
let ctx = canvas.getContext('2d');

const N = 20; // Tiles for each row. It may be changed
const T = canvas.width / N; // Tile length

let spacePressed = false;
let upPressed = false;
let downPressed = false;
let rightPressed = false;
let leftPressed = false;

// Directions
const UP = 0;
const DOWN = 1;
const LEFT = 2;
const RIGHT = 3;

// Colors
const SNAKE_COL = "#3c9e31";
const APPLE_COL = "#eb2f2f";

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
  if (e.keyCode == 32) {
    spacePressed = true;
  } else if (e.keyCode == 38) {
    upPressed = true;
  } else if (e.keyCode == 40) {
    downPressed = true;
  } else if (e.keyCode == 39) {
    rightPressed = true;
  } else if (e.keyCode == 37) {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.keyCode == 32) {
    spacePressed = false;
  } else if (e.keyCode == 38) {
    upPressed = false;
  } else if (e.keyCode == 40) {
    downPressed = false;
  } else if (e.keyCode == 39) {
    rightPressed = false;
  } else if (e.keyCode == 37) {
    leftPressed = false;
  }
}

function drawTile(x, y, color) {
  ctx.beginPath();
  ctx.rect(T * x, T * y, T, T);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
}

class Snake {
  constructor() {
    const yMiddle = Math.floor(N / 2);

    this.direction = RIGHT;
    this.array = [
      [1, yMiddle],
      [2, yMiddle],
      [3, yMiddle],
      [4, yMiddle]
    ];
  }
}

snake = new Snake();

function draw() {
  if (spacePressed) {
    location.reload();
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height); // Refresh canvas

  for (let i = 0; i < snake.array.length; i++) {
    drawTile(snake.array[i][0], snake.array[i][1], SNAKE_COL);
  }
}

setInterval(draw, 10); // Second argument may be changed
