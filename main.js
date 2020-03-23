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

  oppositeDirection() {
    switch (this.direction) {
      case UP:
        return DOWN;
        break;
      case DOWN:
        return UP;
        break;
      case LEFT:
        return RIGHT;
        break;
      case RIGHT:
        return LEFT;
        break;
    }
  }

  move(nextDir) {
    let futureDir;

    if (nextDir == this.oppositeDirection()) {
      futureDir = this.direction;
    } else {
      futureDir = nextDir;
    }

    const previousArray = this.array;
    const prevHead = this.array[this.array.length - 1];

    switch (futureDir) {
      case UP:
        this.array[this.array.length - 1] = [prevHead[0], prevHead[1] - 1];
        break;
      case DOWN:
        this.array[this.array.length - 1] = [prevHead[0], prevHead[1] + 1];
        break;
      case LEFT:
        this.array[this.array.length - 1] = [prevHead[0] - 1, prevHead[1]];
        break;
      case RIGHT:
        this.array[this.array.length - 1] = [prevHead[0] + 1, prevHead[1]];
        break;
    }

    for (let i = (this.array.length - 2); i >= 0; i--) {
      this.array[i] = previousArray[i + 1];
    }

    this.direction = futureDir;
  }
}

snake = new Snake();

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


function draw() {
  if (spacePressed) {
    location.reload();
  } // All this should be changed

  ctx.clearRect(0, 0, canvas.width, canvas.height); // Refresh canvas

  if (upPressed) {
    snake.move(UP);
  } else if (downPressed) {
    snake.move(DOWN);
  } else if (leftPressed) {
    snake.move(LEFT);
  } else if (rightPressed) {
    snake.move(RIGHT);
  } else {
    snake.move(snake.direction);
  }

  for (let i = 0; i < snake.array.length; i++) {
    drawTile(snake.array[i][0], snake.array[i][1], SNAKE_COL);
  }
}

setInterval(draw, 300); // Second argument may be changed
