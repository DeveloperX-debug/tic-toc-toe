document.addEventListener('DOMContentLoaded', () => {
    console.log("Script loaded successfully");

    const board = document.getElementById('board');
    const cells = document.querySelectorAll('.cell');
    const message = document.getElementById('message');
    const resetButton = document.getElementById('reset');
    const twoPlayerBtn = document.getElementById('two-player');
    const aiPlayerBtn = document.getElementById('ai-player');

    let currentPlayer = 'X';
    let gameActive = true;
    let gameState = ['', '', '', '', '', '', '', '', ''];
    let playingAgainstAI = false;

    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    function handleCellClick(event) {
        const clickedCell = event.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

        if (gameState[clickedCellIndex] !== '' || !gameActive) {
            return;
        }

        gameState[clickedCellIndex] = currentPlayer;
        clickedCell.textContent = currentPlayer;
        
        // Add color based on player
        if (currentPlayer === 'X') {
            clickedCell.style.color = '#e74c3c';
        } else {
            clickedCell.style.color = '#3498db';
        }

        if (checkResult()) {
            return;
        }

        // If we're playing against AI and it's O's turn
        if (playingAgainstAI && currentPlayer === 'O') {
            setTimeout(makeAIMove, 500);
        }
    }

    function checkResult() {
        let roundWon = false;
        let winningLine = null;

        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            if (gameState[a] === '' || gameState[b] === '' || gameState[c] === '') {
                continue;
            }
            if (gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
                roundWon = true;
                winningLine = [a, b, c];
                break;
            }
        }

        if (roundWon) {
            message.textContent = `Player ${currentPlayer} wins!`;
            gameActive = false;
            
            // Highlight winning cells
            winningLine.forEach(index => {
                cells[index].style.backgroundColor = currentPlayer === 'X' ? '#fad7d4' : '#d4e6f1';
            });
            
            return true;
        }

        if (!gameState.includes('')) {
            message.textContent = 'It\'s a draw!';
            gameActive = false;
            return true;
        }

        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        
        return false;
    }

    function makeAIMove() {
        if (!gameActive) return;

        // First try to win if possible
        const winMove = findBestMove('O');
        if (winMove !== -1) {
            const aiMoveIndex = winMove;
            gameState[aiMoveIndex] = 'O';
            cells[aiMoveIndex].textContent = 'O';
            cells[aiMoveIndex].style.color = '#3498db';
            checkResult();
            return;
        }

        // Then try to block player's winning move
        const blockMove = findBestMove('X');
        if (blockMove !== -1) {
            const aiMoveIndex = blockMove;
            gameState[aiMoveIndex] = 'O';
            cells[aiMoveIndex].textContent = 'O';
            cells[aiMoveIndex].style.color = '#3498db';
            checkResult();
            return;
        }

        // Take center if available
        if (gameState[4] === '') {
            gameState[4] = 'O';
            cells[4].textContent = 'O';
            cells[4].style.color = '#3498db';
            checkResult();
            return;
        }

        // Take any corner
        const corners = [0, 2, 6, 8];
        const availableCorners = corners.filter(index => gameState[index] === '');
        if (availableCorners.length > 0) {
            const randomCorner = availableCorners[Math.floor(Math.random() * availableCorners.length)];
            gameState[randomCorner] = 'O';
            cells[randomCorner].textContent = 'O';
            cells[randomCorner].style.color = '#3498db';
            checkResult();
            return;
        }

        // Take any side
        const sides = [1, 3, 5, 7];
        const availableSides = sides.filter(index => gameState[index] === '');
        if (availableSides.length > 0) {
            const randomSide = availableSides[Math.floor(Math.random() * availableSides.length)];
            gameState[randomSide] = 'O';
            cells[randomSide].textContent = 'O';
            cells[randomSide].style.color = '#3498db';
            checkResult();
            return;
        }
    }

    function findBestMove(player) {
        // Check if player can win in the next move
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            // Check if two cells are filled with player and one is empty
            if (gameState[a] === player && gameState[b] === player && gameState[c] === '') {
                return c;
            }
            if (gameState[a] === player && gameState[c] === player && gameState[b] === '') {
                return b;
            }
            if (gameState[b] === player && gameState[c] === player && gameState[a] === '') {
                return a;
            }
        }
        return -1;
    }

    function resetGame() {
        gameActive = true;
        currentPlayer = 'X';
        gameState = ['', '', '', '', '', '', '', '', ''];
        message.textContent = '';
        cells.forEach(cell => {
            cell.textContent = '';
            cell.style.backgroundColor = '';
            cell.style.color = '';
        });
        
        // If playing against AI and AI goes first (O), make the first move
        if (playingAgainstAI && currentPlayer === 'O') {
            setTimeout(makeAIMove, 500);
        }
    }

    function switchGameMode(mode) {
        if (mode === 'ai') {
            playingAgainstAI = true;
            twoPlayerBtn.classList.remove('active');
            aiPlayerBtn.classList.add('active');
        } else {
            playingAgainstAI = false;
            aiPlayerBtn.classList.remove('active');
            twoPlayerBtn.classList.add('active');
        }
        resetGame();
    }

    // Event listeners
    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    resetButton.addEventListener('click', resetGame);
    twoPlayerBtn.addEventListener('click', () => switchGameMode('two'));
    aiPlayerBtn.addEventListener('click', () => switchGameMode('ai'));
});
