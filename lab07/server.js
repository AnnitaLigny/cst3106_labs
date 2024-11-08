const express = require('express');
const path = require('path');

const app = express();
const port = 8080;

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Main route for the game, serves the game's HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// A route for rolling dice, simulates rolling 5 dice
app.get('/roll-dices', (req, res) => {
  const rollDice = () => Math.floor(Math.random() * 6) + 1;
  const diceResults = Array.from({ length: 5 }, rollDice);
  res.json(diceResults); // Sends the array of dice rolls back to the client
});

// Handle 404 errors
app.use((req, res, next) => {
  res.status(404).send("Sorry, can't find that!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
