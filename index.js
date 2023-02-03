const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

class snakePart{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
}

let difficulty = 1000;
let speed = 7;
let difficultyText;

let tileCount = 20;
let tileSize = canvas.width / tileCount - 2;
let headX = 10;
let headY = 10;
const snakeParts =[];
let tailLength = 2;

let appleX = 5;
let appleY = 5;

let xVelocity = 0;
let yVelocity = 0;

let score = 0;
let level = 1;

let appleColour = "red"
let snakeBodyColour = "green"
let snakeHeadColour = "orange"

//let highscore = 0;


const gulpSound = new Audio("GulpFinished.wav");

//game loop
function drawGame(){
    setDifficulty();

    changeSnakePosition();
    let result = isGameOver();
    if(result){
        return;
    }

    clearScreen();
    checkAppleCollision();
    drawApple();
    drawSnake();
    drawScore();
    drawDifficulty();
    highScoreSet();

    if(score > 5){
        speed = 11;
        level = 2;
    }
    if (score > 15){
        speed = 15;
        level = 3;
    }
    if(score > 25){
        speed = 21;
        level = "Impossible!!!!!!!!!!!!!!!";
    }

    drawLevel();
    setTimeout(drawGame, difficulty/ speed);
}





function setDifficulty(){
    //Easy
    var button = document.getElementById("easy-button");
    button.addEventListener("click", function(){
    difficulty = 2500;
    });

    //Hardcore
    var button = document.getElementById("hardcore-button");
    button.addEventListener("click", function(){
    difficulty = 500;
    });

    //Back to normal
    var button = document.getElementById("normal-button");
    button.addEventListener("click", function(){
    difficulty = 1000;
    });
}

function isGameOver(){
    let gameOver = false;

    if(yVelocity === 0 && xVelocity === 0){ // <<< Stop automatic game over before starting
        return false;
    }
    //walls
    if(headX < 0){
        gameOver = true;
    }
    else if(headX === tileCount){
        gameOver = true;
    }
    else if(headY < 0){
        gameOver = true;
    }
    else if(headY === tileCount){
        gameOver = true;
    }

    for(let i =0; i < snakeParts.length; i++){
        let part = snakeParts[i];
        if(part.x === headX && part.y === headY){
            gameOver = true;
            break; //Break out of for loop!
        }
    }

    if(gameOver){
        ctx.fillStyle = "white";
        ctx.font = "40px Verdana";

        var gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        gradient.addColorStop("0", "magenta");
        gradient.addColorStop("0.5", "blue");
        gradient.addColorStop("1.0", "red");
        //fill with gradient
        ctx.fillStyle = gradient;
        
        //Doesn't work, but how to replace text in a string!
        /*let returnString = "Game Over!\nYour score was " + score;
        returnString = returnString.replace(/\n/g, "<br>")*/
        ctx.fillText("Game Over!", canvas.width / 5.5, canvas.height / 2);
        ctx.fillText("Your score was " + score, canvas.width / 16.5, canvas.height / 1.6);

       

    }

    return gameOver;

}

var highscore = localStorage.getItem("highscore");
function highScoreSet(){
    document.getElementById("highscore").innerHTML = localStorage.getItem("highscore");

    if (score > highscore){
        highscore = score;
        localStorage.setItem("highscore", highscore);
    }
}
// ^ ^ ^ Seemed to need the innerHTML part for it to work!

function drawScore(){
    ctx.fillStyle = "white";
    ctx.font = "10px Times New Roman";
    ctx.fillText("Score " + score, canvas.width-50, 10)
}

function drawLevel(){
    ctx.fillStyle = "white";
    ctx.font = "10px Times New Roman";
    ctx.fillText("Level " + level, canvas.width-380, 10)
}

function drawDifficulty(){
    ctx.fillStyle = "white";
    ctx.font = "Times New Roman";

    if (difficulty === 2500){
        difficultyText = "Easy";
    } else if (difficulty === 1000){
        difficultyText = "Normal";
    } else if (difficulty === 500){
        difficultyText = "Hardcore";
    }

    ctx.fillText(difficultyText + " difficulty", canvas.width-225, 10)
}

function clearScreen(){
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake(){
    ctx.fillStyle = snakeBodyColour;
    for(let i =0; i < snakeParts.length; i++){
        let part = snakeParts[i];
        ctx.fillRect(part.x * tileCount, part.y * tileCount, tileSize, tileSize)
    }

    snakeParts.push(new snakePart(headX, headY)); //Put item at end of list next to head
    if(snakeParts.length > tailLength){
        snakeParts.shift(); //Remove furthest item from snake parts
    }

    ctx.fillStyle = snakeHeadColour;
    ctx.fillRect(headX * tileCount, headY * tileCount, tileSize, tileSize);

    //Snake modifications
    //Anaconda
    var button = document.getElementById("anaconda-button");
    button.addEventListener("click", function(){
    snakeHeadColour = "purple";
    snakeBodyColour = "yellowgreen";
    });

    //Python
    var button = document.getElementById("python-button");
    button.addEventListener("click", function(){
    snakeHeadColour = "blue";
    snakeBodyColour = "yellow";
    });

    //Back to Cobra
    var button = document.getElementById("cobra-button");
    button.addEventListener("click", function(){
    snakeHeadColour = "orange";
    snakeBodyColour = "green";
    });
}

function changeSnakePosition(){
    headX = headX + xVelocity;
    headY = headY + yVelocity;
}


function drawApple(){
    ctx.fillStyle = appleColour;
    ctx.fillRect(appleX * tileCount, appleY * tileCount, tileSize, tileSize);

    //Green
    var button = document.getElementById("green-button");
    button.addEventListener("click", function(){
    appleColour = "green";
    });

    //Pink
    var button = document.getElementById("pink-button");
    button.addEventListener("click", function(){
        appleColour = "pink";
    });

    //Back to red
    var button = document.getElementById("red-button");
    button.addEventListener("click", function(){
    appleColour = "red";
    });
}




function checkAppleCollision(){
    if(appleX === headX && appleY === headY){
        appleX = Math.floor(Math.random() * tileCount);
        appleY = Math.floor(Math.random() * tileCount);
        tailLength++;
        score++;
        gulpSound.play();
    }
}

document.body.addEventListener('keydown', keyDown);

function keyDown(event){
    //up
    if(event.keyCode == 38){
        if(yVelocity == 1)
        return;
    yVelocity = -1;
    xVelocity = 0;
    }

    //down
    if(event.keyCode == 40){
        if(yVelocity == -1)
        return;
        yVelocity = 1;
        xVelocity = 0;
        }

    //right
    if(event.keyCode == 39){
        if(xVelocity == -1)
        return;
        yVelocity = 0;
        xVelocity = 1;
        }

    //left
    if(event.keyCode == 37){
        if(xVelocity == 1)
        return;
        yVelocity = 0;
        xVelocity = -1;
        }
}

function saveHighscore(score){
    localStorage.setItem("highscore", score);
}

function getHighscore(){
    return localStorage.getItem("highscore")
}


drawGame();