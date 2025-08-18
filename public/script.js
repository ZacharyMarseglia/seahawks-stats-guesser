// Game state
let currentPlayer = null;
let currentAttempt = 0;
let gameWon = false;
let gameOver = false;
let players = [];
let allGuesses = [];
const MAX_ATTEMPTS = 5;

// Fallback data in case server fails
const fallbackPlayers = [
    {
        "first": "Geno",
        "last": "Smith",
        "position": "QB",
        "side": "Offense",
        "number": 7,
        "startYear": 2022,
        "college": "West Virginia"
    },
    {
        "first": "DK",
        "last": "Metcalf",
        "position": "WR",
        "side": "Offense",
        "number": 14,
        "startYear": 2019,
        "college": "Ole Miss"
    },
    {
        "first": "Bobby",
        "last": "Wagner",
        "position": "LB",
        "side": "Defense",
        "number": 45,
        "startYear": 2012,
        "college": "Utah State"
    }
];

// DOM elements
const gameBoardElement = document.getElementById('gameBoard');
const playerInput = document.getElementById('playerInput');
const submitBtn = document.getElementById('submitBtn');
const newGameBtn = document.getElementById('newGameBtn');
const messageArea = document.getElementById('messageArea');
const playersDatalist = document.getElementById('players');

// Score elements
const gamesElement = document.getElementById('games');
const winsElement = document.getElementById('wins');
const lossesElement = document.getElementById('losses');
const streakElement = document.getElementById('streak');
const bestElement = document.getElementById('best');

// Stat categories
const statCategories = ['Position', 'Side', 'Number', 'Start Year', 'College'];

// Initialize game
async function initGame() {
    console.log('Initializing game...');
    try {
        // Try to load players from server
        console.log('Fetching players from server...');
        const playersResponse = await fetch('/players');
        console.log('Players response:', playersResponse);
        
        if (playersResponse.ok) {
            const playersData = await playersResponse.json();
            console.log('Players data from server:', playersData);
            players = playersData.players;
        } else {
            throw new Error(`Server error: ${playersResponse.status}`);
        }
        
        // Populate datalist with full names
        players.forEach(player => {
            const option = document.createElement('option');
            option.value = `${player.first} ${player.last}`;
            playersDatalist.appendChild(option);
        });
        
        // Try to get current player from server
        console.log('Fetching current word from server...');
        const wordResponse = await fetch('/word');
        console.log('Word response:', wordResponse);
        
        if (wordResponse.ok) {
            const wordData = await wordResponse.json();
            console.log('Word data from server:', wordData);
            currentPlayer = players.find(p => p.last.toUpperCase() === wordData.answer);
            console.log('Current player found:', currentPlayer);
        } else {
            throw new Error(`Server error: ${wordResponse.status}`);
        }
        
        if (!currentPlayer) {
            throw new Error('Could not find current player');
        }
        
        setupGameBoard();
        loadScoreboard();
        showMessage(`Guess the Seahawks player! You have ${MAX_ATTEMPTS} attempts to get it right.`, 'info');
        
    } catch (error) {
        console.error('Error loading from server, using fallback data:', error);
        
        // Use fallback data
        players = fallbackPlayers;
        currentPlayer = fallbackPlayers[1]; // DK Metcalf as default
        
        // Populate datalist with fallback data
        players.forEach(player => {
            const option = document.createElement('option');
            option.value = `${player.first} ${player.last}`;
            playersDatalist.appendChild(option);
        });
        
        setupGameBoard();
        loadScoreboard();
        showMessage(`Using offline mode. Guess the Seahawks player! You have ${MAX_ATTEMPTS} attempts to get it right.`, 'info');
    }
}

// Set up the game board
function setupGameBoard() {
    console.log('Setting up game board...');
    gameBoardElement.innerHTML = '';
    
    // Add stats header
    const headerRow = document.createElement('div');
    headerRow.className = 'stats-header';
    
    const playerHeader = document.createElement('div');
    playerHeader.className = 'stat-header';
    playerHeader.textContent = 'Player';
    headerRow.appendChild(playerHeader);
    
    statCategories.forEach(category => {
        const statHeader = document.createElement('div');
        statHeader.className = 'stat-header';
        statHeader.textContent = category;
        headerRow.appendChild(statHeader);
    });
    
    gameBoardElement.appendChild(headerRow);
    
    // Create 5 empty rows for attempts
    for (let i = 0; i < MAX_ATTEMPTS; i++) {
        const row = document.createElement('div');
        row.className = 'game-row';
        row.id = `row-${i}`;
        
        // Player name placeholder
        const playerNameTile = document.createElement('div');
        playerNameTile.className = 'player-name';
        playerNameTile.textContent = '';
        row.appendChild(playerNameTile);
        
        // Empty stat tiles
        for (let j = 0; j < 5; j++) {
            const statTile = document.createElement('div');
            statTile.className = 'stat-tile';
            statTile.id = `tile-${i}-${j}`;
            statTile.textContent = '';
            row.appendChild(statTile);
        }
        
        gameBoardElement.appendChild(row);
    }
    
    console.log('Game board setup complete. Rows created:', gameBoardElement.children.length - 1);
    
    // Reset game state
    currentAttempt = 0;
    gameWon = false;
    gameOver = false;
    allGuesses = [];
    
    // Enable input
    playerInput.disabled = false;
    submitBtn.disabled = false;
    playerInput.focus();
}

// Handle guess submission
async function submitGuess() {
    console.log('Submit guess called');
    if (gameOver || gameWon) return;
    
    const input = playerInput.value.trim();
    if (!input) {
        showMessage('Please enter a player name.', 'error');
        return;
    }
    
    console.log('Looking for player:', input);
    
    // Find the player
    const guessedPlayer = players.find(player => 
        `${player.first} ${player.last}`.toLowerCase() === input.toLowerCase() ||
        player.last.toLowerCase() === input.toLowerCase()
    );
    
    if (!guessedPlayer) {
        showMessage('Player not found. Please enter a valid Seahawks player name.', 'error');
        shakeRow(currentAttempt);
        return;
    }
    
    console.log('Found player:', guessedPlayer);
    
    // Process the guess
    processGuess(guessedPlayer);
    
    // Clear input
    playerInput.value = '';
    playerInput.focus();
}

// Process a guess and update the board
function processGuess(guessedPlayer) {
    console.log('Processing guess for:', guessedPlayer);
    console.log('Current player:', currentPlayer);
    console.log('Current attempt:', currentAttempt);
    
    // Validate that both players have all required properties
    if (!guessedPlayer || !currentPlayer) {
        console.error('Missing player data:', { guessedPlayer, currentPlayer });
        showMessage('Error: Player data is missing. Please refresh the page.', 'error');
        return;
    }
    
    const requiredProps = ['position', 'side', 'number', 'startYear', 'college'];
    const missingProps = requiredProps.filter(prop => !guessedPlayer[prop] || !currentPlayer[prop]);
    
    if (missingProps.length > 0) {
        console.error('Missing properties:', missingProps);
        console.error('Guessed player:', guessedPlayer);
        console.error('Current player:', currentPlayer);
        showMessage(`Error: Player data incomplete. Missing: ${missingProps.join(', ')}`, 'error');
        return;
    }
    
    // Get the existing row for this attempt
    const row = document.getElementById(`row-${currentAttempt}`);
    if (!row) {
        console.error('Row not found:', `row-${currentAttempt}`);
        return;
    }
    
    console.log('Found row:', row);
    
    // Update player name
    const playerNameTile = row.querySelector('.player-name');
    if (playerNameTile) {
        playerNameTile.textContent = `${guessedPlayer.first} ${guessedPlayer.last}`;
        console.log('Updated player name tile');
    } else {
        console.error('Player name tile not found');
    }
    
    // Get all stat tiles in this row
    const statTiles = row.querySelectorAll('.stat-tile');
    console.log('Found stat tiles:', statTiles.length);
    
    // Check each stat with safe property access
    const stats = [
        guessedPlayer.position || 'Unknown',
        guessedPlayer.side || 'Unknown',
        (guessedPlayer.number || 0).toString(),
        (guessedPlayer.startYear || 0).toString(),
        guessedPlayer.college || 'Unknown'
    ];
    
    const correctStats = [
        currentPlayer.position || 'Unknown',
        currentPlayer.side || 'Unknown',
        (currentPlayer.number || 0).toString(),
        (currentPlayer.startYear || 0).toString(),
        currentPlayer.college || 'Unknown'
    ];
    
    console.log('Guessed stats:', stats);
    console.log('Correct stats:', correctStats);
    
    let correctCount = 0;
    
    stats.forEach((stat, index) => {
        if (index < statTiles.length) {
            const statTile = statTiles[index];
            console.log(`Processing stat ${index}:`, stat, 'for tile:', statTile);
            
            // Always show the stat value in the tile
            statTile.textContent = stat;
            
            // Remove any existing color classes
            statTile.classList.remove('correct', 'present', 'absent');
            
            if (stat === correctStats[index]) {
                statTile.classList.add('correct');
                correctCount++;
                console.log(`Stat ${index} correct:`, stat);
            } else if (isCloseStat(stat, correctStats[index], index)) {
                statTile.classList.add('present');
                console.log(`Stat ${index} close:`, stat);
            } else {
                statTile.classList.add('absent');
                console.log(`Stat ${index} wrong:`, stat);
            }
        } else {
            console.error(`Stat tile index ${index} out of bounds`);
        }
    });
    
    console.log('Correct count:', correctCount);
    
    allGuesses.push(guessedPlayer);
    currentAttempt++;
    
    // Check if won (all stats correct)
    if (correctCount === 5) {
        gameWon = true;
        gameOver = true;
        updateScoreboard(true);
        showMessage(`🎉 Congratulations! You found ${currentPlayer.first} ${currentPlayer.last} in ${currentAttempt} attempts!`, 'success');
        disableInput();
        return;
    }
    
    // Check if game over (5 attempts used)
    if (currentAttempt >= MAX_ATTEMPTS) {
        gameOver = true;
        updateScoreboard(false);
        showMessage(`Game Over! The player was ${currentPlayer.first} ${currentPlayer.last} (${currentPlayer.position}). Better luck next time!`, 'error');
        disableInput();
        return;
    }
    
    // Show remaining attempts
    const remaining = MAX_ATTEMPTS - currentAttempt;
    showMessage(`${remaining} attempt${remaining !== 1 ? 's' : ''} remaining. ${5 - correctCount} stat${5 - correctCount !== 1 ? 's' : ''} still incorrect.`, 'info');
}

// Check if a stat is "close" (for number and year)
function isCloseStat(guessed, correct, statIndex) {
    if (statIndex === 2) { // Number
        const guessedNum = parseInt(guessed);
        const correctNum = parseInt(correct);
        return Math.abs(guessedNum - correctNum) <= 5;
    } else if (statIndex === 3) { // Start Year
        const guessedYear = parseInt(guessed);
        const correctYear = parseInt(correct);
        return Math.abs(guessedYear - correctYear) <= 2;
    }
    return false;
}

// Shake animation for invalid input
function shakeRow(rowIndex) {
    const row = document.getElementById(`row-${rowIndex}`);
    if (row) {
        row.querySelectorAll('.stat-tile').forEach(tile => {
            tile.classList.add('shake');
            setTimeout(() => tile.classList.remove('shake'), 500);
        });
    }
}

// Start a new game
async function startNewGame() {
    try {
        if (players === fallbackPlayers) {
            // Use fallback data
            currentPlayer = fallbackPlayers[Math.floor(Math.random() * fallbackPlayers.length)];
            setupGameBoard();
            showMessage(`New player selected! You have ${MAX_ATTEMPTS} attempts to get it right.`, 'info');
        } else {
            // Try server
            const response = await fetch('/newgame');
            const data = await response.json();
            currentPlayer = players.find(p => p.last.toUpperCase() === data.answer);
            
            setupGameBoard();
            showMessage(`New player selected! You have ${MAX_ATTEMPTS} attempts to get it right.`, 'info');
        }
    } catch (error) {
        console.error('Error starting new game:', error);
        showMessage('Error starting new game. Please try again.', 'error');
    }
}

// Disable input after game ends
function disableInput() {
    playerInput.disabled = true;
    submitBtn.disabled = true;
}

// Show message in the message area
function showMessage(text, type = 'info') {
    messageArea.innerHTML = `<div class="message ${type}">${text}</div>`;
}

// Load scoreboard from localStorage
function loadScoreboard() {
    const scores = JSON.parse(localStorage.getItem('sw_score_v1')) || {
        games: 0,
        wins: 0,
        losses: 0,
        streak: 0,
        best: 0
    };
    
    updateScoreboardDisplay(scores);
}

// Update scoreboard
function updateScoreboard(won) {
    const scores = JSON.parse(localStorage.getItem('sw_score_v1')) || {
        games: 0,
        wins: 0,
        losses: 0,
        streak: 0,
        best: 0
    };
    
    scores.games++;
    
    if (won) {
        scores.wins++;
        scores.streak++;
        scores.best = Math.max(scores.best, scores.streak);
    } else {
        scores.losses++;
        scores.streak = 0;
    }
    
    localStorage.setItem('sw_score_v1', JSON.stringify(scores));
    updateScoreboardDisplay(scores);
}

// Update scoreboard display
function updateScoreboardDisplay(scores) {
    gamesElement.textContent = scores.games;
    winsElement.textContent = scores.wins;
    lossesElement.textContent = scores.losses;
    streakElement.textContent = scores.streak;
    bestElement.textContent = scores.best;
}

// Event listeners
submitBtn.addEventListener('click', submitGuess);
newGameBtn.addEventListener('click', startNewGame);

playerInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        submitGuess();
    }
});

// Initialize the game when page loads
document.addEventListener('DOMContentLoaded', initGame);
