# 🏈 Seahawks Stats Guesser

A Wordle-style guessing game where you try to identify Seattle Seahawks players by guessing their stats! Built with Node.js, Express, and vanilla JavaScript.

## 🎮 How to Play

1. **Guess the player**: Enter a Seahawks player's name (e.g., "Tyler Lockett" or "Lockett")
2. **Analyze the feedback**:
   - 🟢 **Green**: Stat is exactly correct
   - 🟡 **Orange**: Stat is close (within range for numbers/years)
   - 🔴 **Red**: Stat is completely wrong
3. **Keep guessing**: Make up to 5 attempts to identify the correct player
4. **Win**: Get all 5 stats correct within 5 attempts
5. **Lose**: Run out of attempts and the game reveals the answer

## 🎯 Game Rules

- **Position**: QB, WR, RB, TE, LB, CB, DT, DE, G, T, etc.
- **Side**: Offense or Defense
- **Number**: Jersey number (1-99)
- **Start Year**: When they joined the Seahawks
- **College**: Where they played college football
- **Close stats**: Numbers within ±5, years within ±2 are marked orange
- **5 attempts maximum**: No pressure, but limited tries!

## ✨ Features

- **Multi-stat guessing**: Guess players by Position, Side (Offense/Defense), Jersey Number, Start Year, and College
- **Smart feedback system**: Green = exact match, Orange = close, Red = wrong
- **5 attempts to win**: Classic Wordle-style gameplay with limited attempts
- **Autocomplete**: Full player names with easy selection
- **Persistent scoring**: Tracks games, wins, losses, current streak, and best streak
- **Responsive design**: Works on desktop and mobile devices
- **Modern UI**: Dark Seattle-themed design with smooth animations

## 🚀 Quick Start

### Prerequisites
- Node.js (LTS version recommended)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/seahawks-stats-guesser.git
   cd seahawks-stats-guesser
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Alternative: Run without npm
If you have Node.js installed, you can run directly:
```bash
node server.js
```

## 📁 Project Structure

```
seahawks-stats-guesser/
├── public/                 # Frontend files
│   ├── index.html         # Main game page
│   ├── style.css          # Game styles
│   ├── script.js          # Game logic
│   ├── debug.html         # Debug/testing tool
│   └── test.html          # Simple test version
├── server.js              # Express server
├── players.json           # Player database
├── package.json           # Dependencies
├── .gitignore            # Git ignore rules
└── README.md             # This file
```

## 🎯 Player Database

The game includes 20+ current and recent Seahawks players with complete stats:
- **Geno Smith** (QB, #7, 2022, West Virginia)
- **DK Metcalf** (WR, #14, 2019, Ole Miss)
- **Tyler Lockett** (WR, #16, 2015, Kansas State)
- **Bobby Wagner** (LB, #45, 2012, Utah State)
- And many more!

## 🌐 API Endpoints

- `GET /` - Main game page
- `GET /players` - Returns all players for autocomplete
- `GET /word` - Returns current game's answer
- `GET /newgame` - Starts a new game with random player

## 🎨 Customization

### Add New Players
Edit `players.json` to add more players:
```json
{
  "first": "Player",
  "last": "Name",
  "position": "POS",
  "side": "Offense/Defense",
  "number": 99,
  "startYear": 2024,
  "college": "University Name"
}
```

### Change Game Settings
- Modify `MAX_ATTEMPTS` in `script.js` to change attempt limit
- Adjust color schemes in `style.css`
- Update stat categories in `script.js`

## 🚀 Deployment

### Deploy to Render (Free)
1. Push your code to GitHub
2. Sign up at [render.com](https://render.com)
3. Connect your repository
4. Deploy as a "Web Service"
5. Get a public URL

### Deploy to Railway (Free)
1. Sign up at [railway.app](https://railway.app)
2. Connect your GitHub repository
3. Deploy automatically

### Deploy to Heroku
1. Install Heroku CLI
2. Create Heroku app
3. Deploy with Git

## 🐛 Troubleshooting

### Common Issues
- **Port 3000 already in use**: Change the port in `server.js`
- **Module not found**: Run `npm install` to install dependencies
- **PowerShell execution policy**: Run `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass`

### Debug Mode
Use `http://localhost:3000/debug.html` to test server connections and data integrity.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Inspired by Wordle
- Seattle Seahawks for the amazing players
- Built with modern web technologies

## 📞 Support

If you encounter any issues or have questions:
1. Check the debug tool at `/debug.html`
2. Review the browser console for errors
3. Open an issue on GitHub

---

**Go Hawks! 🏈💙💚**
