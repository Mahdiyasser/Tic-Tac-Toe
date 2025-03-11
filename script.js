let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;
let playerScore = 0, aiScore = 0, drawScore = 0;

// Play sound
function playSound(soundId) {
    document.getElementById(soundId).play();
}

function makeMove(cell, index) {
    if (board[index] === "" && gameActive && currentPlayer === "X") {
        board[index] = "X";
        cell.innerText = "X";
        cell.classList.add("x");
        playSound("click-sound");
        checkWinner();
        if (gameActive) {
            currentPlayer = "O";
            setTimeout(aiMove, 500);
        }
    }
}

function aiMove() {
    let difficulty = document.getElementById("difficulty").value;
    let bestMove;

    if (difficulty === "easy") {
        bestMove = getRandomMove();
    } else if (difficulty === "medium") {
        bestMove = Math.random() < 0.5 ? getRandomMove() : minimax(board, "O").index;
    } else {
        bestMove = Math.random() < 0.2 ? getRandomMove() : minimax(board, "O").index;
    }

    if (bestMove !== undefined) {
        board[bestMove] = "O";
        let cell = document.querySelectorAll(".cell")[bestMove];
        cell.innerText = "O";
        cell.classList.add("o");
        playSound("click-sound");
        checkWinner();
        currentPlayer = "X";
    }
}

function getRandomMove() {
    let availableMoves = board.map((val, index) => val === "" ? index : null).filter(val => val !== null);
    return availableMoves.length > 0 ? availableMoves[Math.floor(Math.random() * availableMoves.length)] : undefined;
}

function checkWinner() {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (const combination of winningCombinations) {
        const [a, b, c] = combination;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            gameActive = false;
            document.getElementById("status").innerText = `Player ${board[a]} Wins!`;
            playSound("win-sound");

            if (board[a] === "X") playerScore++;
            else aiScore++;

            updateScore();
            return;
        }
    }

    if (!board.includes("")) {
        gameActive = false;
        document.getElementById("status").innerText = "It's a Draw!";
        drawScore++;
        updateScore();
    }
}

function updateScore() {
    document.getElementById("player-score").innerText = playerScore;
    document.getElementById("ai-score").innerText = aiScore;
    document.getElementById("draw-score").innerText = drawScore;
}

function minimax(newBoard, player) {
    const emptySpots = newBoard.map((val, index) => val === "" ? index : null).filter(val => val !== null);

    if (checkWin(newBoard, "X")) return { score: -10 };
    if (checkWin(newBoard, "O")) return { score: 10 };
    if (emptySpots.length === 0) return { score: 0 };

    let moves = [];

    for (let i = 0; i < emptySpots.length; i++) {
        let move = {};
        move.index = emptySpots[i];
        newBoard[emptySpots[i]] = player;

        move.score = (player === "O") ? minimax(newBoard, "X").score : minimax(newBoard, "O").score;
        newBoard[emptySpots[i]] = "";
        moves.push(move);
    }

    return moves.reduce((bestMove, move) => (player === "O" ? move.score > bestMove.score : move.score < bestMove.score) ? move : bestMove);
}

function resetGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    gameActive = true;
    currentPlayer = "X";
    document.getElementById("status").innerText = "Player X's Turn";
    document.querySelectorAll(".cell").forEach(cell => cell.innerText = "");
}
