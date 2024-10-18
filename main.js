// Game constants and variables
let inputDir = { x: 0, y: 0 };
let score = 0;

const moveSound = new Audio('Contents/game-music-loop-6-144641.mp3');
const eatSound = new Audio('Contents/eating-sound-effect-36186.mp3');
const gameoverSound = new Audio('Contents/game-over-38511.mp3');
const gamestartSound = new Audio('Contents/game-start-6104.mp3');

let speed = 5;
let lastPaintTime = 0;
let snakeArr = [{ x: 13, y: 15 }];
let food = { x: 6, y: 7 };

// Game functions
function main(ctime) {
    window.requestAnimationFrame(main);
    if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
        return;
    }
    lastPaintTime = ctime;
    gameEngine();
}

function collide(snakeArr) {
    // If you bump into yourself
    for (let i = 1; i < snakeArr.length; i++) {
        if (snakeArr[i].x === snakeArr[0].x && snakeArr[i].y === snakeArr[0].y) {
            return true;
        }
    }

    // If you bump into the wall
    if (snakeArr[0].x >= 18 || snakeArr[0].x <= 0 || snakeArr[0].y >= 18 || snakeArr[0].y <= 0) {
        return true;
    }

    return false;
}

async function  gameEngine() {
    // Part 1 --> Game logic (update snake position, etc.)
    if (collide(snakeArr)) {
        await gameoverSound.play();
        
        inputDir = { x: 0, y: 0 }; // Reset direction
        alert("Game is over");
        snakeArr = [{ x: 13, y: 15 }];
        score = 0;
        scorebox.innerHTML = "Score: " + score; // Reset score
    }

    // Part 2 --> Display / render snake and food
    if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {
        eatSound.play();
        score++;
        if (score > highscore) {
            highscore = score;
            localStorage.setItem("highscore", JSON.stringify(highscore));
            highscoreBox.innerHTML = "High Score: " + highscore;
        }
        scorebox.innerHTML = "Score: " + score;
        snakeArr.unshift({ x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y });
        let a = 2,
            b = 16;
        food = {
            x: Math.round(a + (b - a) * Math.random()),
            y: Math.round(a + (b - a) * Math.random()),
        };
    }

    // Move the snake
    for (let i = snakeArr.length - 2; i >= 0; i--) {
        moveSound.play();
        snakeArr[i + 1] = { ...snakeArr[i] };
    }
    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    // Render the play area
    playarea.innerHTML = "";

    // Render the snake
    snakeArr.forEach((e, index) => {
        let snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;

        if (index === 0) {
            snakeElement.classList.add('head');
        } else {
            snakeElement.classList.add('snake');
        }

        playarea.appendChild(snakeElement);
    });

    // Render the food
    let foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    playarea.appendChild(foodElement);
}

// Main logic to start the game
let highscore = localStorage.getItem("highscore");

if (highscore === null) {
    highscore = 0;
    localStorage.setItem("highscore", JSON.stringify(highscore));
} else {
    highscore = JSON.parse(highscore);
}

// Update the high score display
let highscoreBox = document.getElementById("Highscore");
highscoreBox.innerHTML = `High Score: ${highscore}`;

window.requestAnimationFrame(main);

window.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "ArrowUp":
            console.log("Arrow up");
            inputDir.x = 0;
            inputDir.y = -1;
            break;
        case "ArrowDown":
            console.log("Arrow down");
            inputDir.x = 0;
            inputDir.y = 1;
            break;
        case "ArrowLeft":
            console.log("Arrow left");
            inputDir.x = -1;
            inputDir.y = 0;
            break;
        case "ArrowRight":
            console.log("Arrow right");
            inputDir.x = 1;
            inputDir.y = 0;
            break;
        default:
            break;
    }
});
