// Possible numbers of rows and columns:
// 1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 20,
// 24, 25, 30, 40, 50, 60, 75, 100, 120,
// 150, 200, 300 or 600.

let canvas = document.getElementById('myCanvas');
let ctx = canvas.getContext('2d');

const N = 20; // Tiles for each row. It may be changed
const T = canvas.width / N; // Tile length

let gameIsOver = false;
let score = 0;

let upPressed = false;
let downPressed = false;
let rightPressed = false;
let leftPressed = false;
let spacePressed = false;
let enterPressed = false;

// Directions
const UP = 0;
const DOWN = 1;
const LEFT = 2;
const RIGHT = 3;

// Colors
const SNAKE_COL = "#3c9e31";
const STROKE_COL = "#204d10";
const APPLE_COL = "#eb2f2f";

const TILES = function() {
  let result = [];
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      result.push([i, j]);
    }
  }
  return result;
}(); // 'TILES' is actually a variable: it's an array with all coordinates

function arraysAreEqual(arr1, arr2) {
  // This function solves the apple and the collisions bugs
  if (!arr1 || !arr2) {
    return false;
  } else if (arr1.length == arr2.length) {
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] != arr2[i]) {
        return false;
      }
    }
    return true;
  } else {
    return false;
  }
}

function validCoord(coord) {
  // This function is used for checking if the snake
  // has touched the border, so that it has to die.
  if (coord[0] < 0 || coord[0] >= N || coord[1] < 0 || coord[1] >= N) {
    return false;
  } else {
    return true;
  }
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
    this.prevTail = [0, yMiddle];
    // The previous property is the tile which will be
    // part of the snake if it eats an apple on the
    // current frame.
    this.apple = {
      changePos: true,
      position: undefined,
    }
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

    const previousArray = JSON.parse(JSON.stringify(this.array));

    // The bug was in the previous line: I was copying a reference to
    // 'this.array', so that when I changed or did some stuff with
    // 'previousArray', I was changing 'this.array'. So this is fixed
    // with Deep Copy.

    const prevHead = this.array[this.array.length - 1];

    // Moving head
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

    if (!validCoord(this.array[this.array.length - 1])) {
      gameOver();
      return undefined;
    }

    // Moving the rest of the body
    for (let i = (this.array.length - 2); i >= 0; i--) {
      this.array[i] = previousArray[i + 1];
    }

    this.direction = futureDir;
    this.prevTail = previousArray[0];

    // Checking if the apple has been eaten
    if (arraysAreEqual(this.apple.position, this.array[this.array.length - 1])) {
      score++;
      this.array.unshift(this.prevTail); // Grow by one tile
      this.apple.changePos = true;
    }

    // Now we have to search if the coordinates of the
    // head are duplicated in 'this.array'. If so, then
    // a collision has occured and the snake is dead.

    for (let i = 0; i < (this.array.length - 1); i++) {
      if (arraysAreEqual(this.array[i], this.array[this.array.length - 1])) {
        gameOver();
        return undefined;
      }
    }
  }

  updateApple() {
    if (this.apple.changePos) {
      // Set difference:
      const appleArray = TILES.filter(x => {
        for (let tile of this.array) {
          if (arraysAreEqual(tile, x)) {
            return false;
          }
        }
        return true;
      });

      this.apple.position = appleArray[Math.floor(Math.random() * appleArray.length)];
    }

    this.apple.changePos = false;
    // 'Snake.apple.changePos' will be changed to 'true'
    // when the snake eats the apple.
  }
}

snake = new Snake();

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
  if (e.keyCode == 32) {
    spacePressed = true;
  } else if (e.keyCode == 13) {
    enterPressed = true;
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
  } else if (e.keyCode == 13) {
    enterPressed = false;
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

function strokeTile(x, y, color) {
  ctx.beginPath();
  ctx.rect(T * x, T * y, T, T);
  ctx.strokeStyle = color;
  ctx.stroke();
  ctx.closePath();
}

function draw() {
  if (!gameIsOver) {
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
      strokeTile(snake.array[i][0], snake.array[i][1], STROKE_COL);
    }

    snake.updateApple();
    drawTile(snake.apple.position[0], snake.apple.position[1], APPLE_COL);
  }
}

function gameOver() {
  gameIsOver = true;

  // Drawing texts
  ctx.fillStyle = APPLE_COL;
  ctx.font = "bold 50px Arial";
  ctx.fillText("GAME OVER", canvas.width / 6 + 60, canvas.height / 6 + 120);

  ctx.fillStyle = "#fff";
  ctx.font = "bold 40px Arial";
  ctx.fillText("Score: " + score.toString(), canvas.width / 6 + 120, canvas.height / 6 + 180)

  ctx.font = "bold 30px Arial";
  ctx.fillText("Press SPACE to play again or ENTER", canvas.width / 6 - 55, canvas.height / 6 + 240);
  ctx.fillText("to select another difficulty level.", canvas.width / 6 - 25, canvas.height / 6 + 300);

  setInterval(checkKeysAfterGame, 0);
}

function checkKeysAfterGame() {
  if (spacePressed) {
    window.location.reload();
  } else if (enterPressed) {
    window.location.href = "index.html";
  }
}
