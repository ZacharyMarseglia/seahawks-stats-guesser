const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Load players data
let players = [];
try {
    const playersData = fs.readFileSync(path.join(__dirname, 'players.json'), 'utf8');
    players = JSON.parse(playersData);
    console.log(`✅ Loaded ${players.length} players from players.json`);
    console.log('Sample player data:', players[0]);
    console.log('Player properties:', Object.keys(players[0]));
} catch (error) {
    console.error('Error loading players.json:', error);
    process.exit(1);
}

// Current game player (randomly chosen at boot)
let currentPlayer = null;

// Initialize with a random player
function pickRandomPlayer() {
    currentPlayer = players[Math.floor(Math.random() * players.length)];
    console.log(`New game started with player: ${currentPlayer.first} ${currentPlayer.last} (${currentPlayer.position})`);
}

// Pick initial player
pickRandomPlayer();

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// GET /word - returns current game player's last name (for compatibility)
app.get('/word', (req, res) => {
    res.json({ answer: currentPlayer.last.toUpperCase() });
});

// GET /newgame - picks new random player
app.get('/newgame', (req, res) => {
    pickRandomPlayer();
    res.json({ answer: currentPlayer.last.toUpperCase() });
});

// GET /players - returns players for autocomplete
app.get('/players', (req, res) => {
    console.log(`📤 Sending ${players.length} players to client`);
    console.log('First player data being sent:', players[0]);
    res.json({ players: players });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Seahawks Stats Guesser server running at http://localhost:${PORT}`);
    console.log(`Current player: ${currentPlayer.first} ${currentPlayer.last} (${currentPlayer.position})`);
});
