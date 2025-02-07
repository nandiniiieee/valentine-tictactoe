const board = document.querySelectorAll(".cell");
const message = document.getElementById("message");
const restartBtn = document.getElementById("restart");

let currentPlayer = "❤️"; // Player starts as "❤️", AI is "😘"
let gameState = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;

const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

function showPopup(text, buttonText) {
    const popup = document.createElement("div");
    popup.classList.add("popup");
    popup.innerHTML = `
        <div class="popup-content">
            <p>${text}</p>
            <button id="popup-btn">${buttonText}</button>
        </div>
    `;
    document.body.appendChild(popup);
    document.getElementById("popup-btn").addEventListener("click", () => {
        popup.remove();
        restartGame();
    });
}

function checkWin() {
    for (let pattern of winPatterns) {
        let [a, b, c] = pattern;
        if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
            gameActive = false;
            if (gameState[a] === "❤️") {
                showPopup("You win a free date on 14th Feb with me! 💕 Click 'Claim'", "Claim");
            } else {
                showPopup("It's okay, I'll take you out on a Valentine's date! ❤️", "Okay");
            }
            return true;
        }
    }
    if (!gameState.includes("")) {
        gameActive = false;
        showPopup("There will be a rematch on 14th Feb!🤭", "Okay");
        return true;
    }
    return false;
}

function handleClick(event) {
    const index = event.target.dataset.index;
    if (gameState[index] === "" && gameActive) {
        gameState[index] = "❤️";
        event.target.textContent = "❤️";
        if (!checkWin() && gameActive) {
            setTimeout(computerMove, 500);
        }
    }
}

function getBestMove() {
    // 1. AI Winning Move
    for (let pattern of winPatterns) {
        let [a, b, c] = pattern;
        if (gameState[a] === "😘" && gameState[b] === "😘" && gameState[c] === "") return c;
        if (gameState[a] === "😘" && gameState[c] === "😘" && gameState[b] === "") return b;
        if (gameState[b] === "😘" && gameState[c] === "😘" && gameState[a] === "") return a;
    }

    // 2. Block Player's Winning Move
    for (let pattern of winPatterns) {
        let [a, b, c] = pattern;
        if (gameState[a] === "❤️" && gameState[b] === "❤️" && gameState[c] === "") return c;
        if (gameState[a] === "❤️" && gameState[c] === "❤️" && gameState[b] === "") return b;
        if (gameState[b] === "❤️" && gameState[c] === "❤️" && gameState[a] === "") return a;
    }

    // 3. Play Center if Available
    if (gameState[4] === "") return 4;

    // 4. Play Random Available Spot
    let emptyCells = gameState.map((val, index) => (val === "" ? index : null)).filter(val => val !== null);
    return emptyCells.length > 0 ? emptyCells[Math.floor(Math.random() * emptyCells.length)] : null;
}

function computerMove() {
    let bestMove = getBestMove();
    if (bestMove !== null) {
        gameState[bestMove] = "😘";
        board[bestMove].textContent = "😘";
        checkWin();
    }
}

function restartGame() {
    gameState.fill("");
    board.forEach(cell => cell.textContent = "");
    message.textContent = "";
    currentPlayer = "❤️";
    gameActive = true;
}

// Adding event listeners
board.forEach(cell => cell.addEventListener("click", handleClick));
restartBtn.addEventListener("click", restartGame);
