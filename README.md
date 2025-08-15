Seahawks Stats Guesser

A Wordle-style guessing game where you try to identify Seattle Seahawks players by guessing their stats! Built with Node.js, Express, and vanilla JavaScript.

Link to play:  https://guess-the-seahawk.onrender.com/

How to Play

1. Guess the player: Enter a Seahawks player's name (e.g., "Tyler Lockett" or "Lockett") // Not all current players will update when season starts.
2. Analyze the feedback:
   - 🟢 Green: Stat is exactly correct
   - 🟡 Orange: Stat is close (within range for numbers/years)
   - 🔴 Red: Stat is completely wrong
3. Keep guessing: Make up to 5 attempts to identify the correct player
4. Win: Get all 5 stats correct within 5 attempts
5. Lose: Run out of attempts and the game reveals the answer
6. Game Rules

- Position: QB, WR, RB, TE, LB, CB, DT, DE, G, T, etc.
- Side: Offense or Defense
- Number: Jersey number (1-99)
- Start Year: When they joined the Seahawks
- College: Where they played college football
- Close stats: Numbers within ±5, years within ±2 are marked orange
- 5 attempts maximum: No pressure, but limited tries!

Features

-Multi-stat guessing: Guess players by Position, Side (Offense/Defense), Jersey Number, Start Year, and College
-Smart feedback system: Green = exact match, Orange = close, Red = wrong
-5 attempts to win: Classic Wordle-style gameplay with limited attempts
-Autocomplete: Full player names with easy selection
-Persistent scoring: Tracks games, wins, losses, current streak, and best streak
-Responsive design: Works on desktop and mobile devices
-Modern UI: Dark Seattle-themed design with smooth animations
