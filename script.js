const boardSize = { 'easy': 3, 'medium': 4, 'hard': 5 };
let currentSize = boardSize.medium;
let board = [];

let highScores = { 'easy': Infinity, 'medium': Infinity, 'hard': Infinity };

function initGame() {
    clearInterval(timer);
    currentSize = boardSize[document.getElementById("difficulty").value];
    board = createSolvedBoard(currentSize);
    shuffleBoard();
    renderBoard();
    resetTimer();
}

function createSolvedBoard(size) {
    let board = Array.from({length: size*size}, (_, i) => i + 1);
    board[size*size - 1] = 0;
    return board;
}

function shuffleBoard() {
    let shuffleMoves = { '3': 50, '4': 100, '5': 200 }[currentSize] || 100;
    for (let i = 0; i < shuffleMoves; i++) {
        let emptyIndex = board.indexOf(0);
        let possibleMoves = getPossibleMoves(emptyIndex);
        let randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        [board[emptyIndex], board[randomMove]] = [board[randomMove], board[emptyIndex]];
    }
}

function getPossibleMoves(emptyIndex) {
    let moves = [];
    let size = Math.sqrt(board.length);
    
    if (emptyIndex >= size) moves.push(emptyIndex - size);
  
    if (emptyIndex < size * (size - 1)) moves.push(emptyIndex + size);
    
    if (emptyIndex % size !== 0) moves.push(emptyIndex - 1);
    
    if (emptyIndex % size !== size - 1) moves.push(emptyIndex + 1);
    return moves;
}


function renderBoard() {
    const gameBoard = document.getElementById("game-board");
    gameBoard.innerHTML = ''; // Clear the board
    gameBoard.style.gridTemplateColumns = `repeat(${currentSize}, 1fr)`;
    board.forEach((tile, index) => {
        let tileElement = document.createElement("div");
        tileElement.className = "tile";
        if(tile !== 0) { // Don't display the empty space
            tileElement.innerText = tile;
            tileElement.addEventListener("click", () => moveTile(index));
        }
        gameBoard.appendChild(tileElement);
    });
}


function moveTile(index) {
    let emptyIndex = board.indexOf(0);
    let possibleMoves = getPossibleMoves(emptyIndex);
    if (possibleMoves.includes(index)) {
        [board[emptyIndex], board[index]] = [board[index], board[emptyIndex]]; // Swap tiles
        renderBoard();
        checkWin();
    }
}


function checkWin() {
    if (board.slice(0, -1).every((value, index) => value === index + 1)) {
        clearInterval(timer);
        showModal("victory-modal");
        updateHighScores();
    }
}
document.getElementById("start-game").addEventListener("click", initGame);
document.getElementById("difficulty").addEventListener("change", initGame);



// Adding Time to the game board


let timer;
let seconds = 0;

function updateTimerDisplay() {
    const timerElement = document.getElementById("timer");
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    timerElement.textContent = `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}
function resetTimer() {
    seconds = 0;
    updateTimerDisplay();
    timer = setInterval(() => {
        seconds++;
        updateTimerDisplay();
    }, 1000);
}


// Qui Game message 

function showModal() {
    const modal = document.getElementById("modal");
    const span = document.getElementsByClassName("close-button")[0];

    modal.style.display = "block";

    
    span.onclick = function() {
        modal.style.display = "none";
    }

   
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}


document.getElementById("quit-game").addEventListener("click", function() {
    clearInterval(timer); // Stop the timer
    showModal(() => {
        initGame(); // Restart the game after modal is closed
    });
});



function showModal(callback) {
    const modal = document.getElementById("modal");
    const span = document.getElementsByClassName("close-button")[0];

    modal.style.display = "block";

    function closeModal() {
        modal.style.display = "none";
        if (callback) callback(); 
    }

   
    span.onclick = closeModal;

    
    window.onclick = function(event) {
        if (event.target === modal) {
            closeModal();
        }
    }
}

// Updating the high score 

function updateHighScores() {
    const difficulty = document.getElementById("difficulty").value;
    if (seconds < highScores[difficulty]) {
        highScores[difficulty] = seconds;
        alert(`New high score for ${difficulty}: ${seconds} seconds!`);
    }
    displayHighScores();
}

function displayHighScores() {
    const highScoresElement = document.getElementById("high-scores");
    highScoresElement.innerHTML = '<h3>High Scores</h3>';
    Object.keys(highScores).forEach(difficulty => {
        highScoresElement.innerHTML += `<p>${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}: ${highScores[difficulty]} seconds</p>`;
    });
}

document.getElementById("high-score-btn").addEventListener("click", function() {
    displayHighScores(); // This function updates the high-scores div with the latest high scores
});

