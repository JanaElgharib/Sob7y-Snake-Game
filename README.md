# 🐍 Sob7y Za Snake - Vue.js/VueX Implementation

A modern, fully-featured Snake game built with Vue 3, Vuex, and the Composition API with five exciting difficulty levels including time-based challenges and infinite mode.

## 📋 Project Overview

This project is a complete implementation of the classic Snake game with five unique difficulty levels, built as a graded practical assignment for ICS 511: Web Programming.

### Team Information
- **Team Name:** [Your Team Name]
- **Members:** [Member 1 Name (ID, Email)], [Member 2 Name (ID, Email)]
- **Project:** Single Player JavaScript Snake Game

## 🎮 Game Features

### Five Difficulty Levels

**Level 1 - Easy** 🟢
- Grid Size: 20x20
- Initial Snake Length: 3 segments
- Food Items: 1
- Speed: 150ms per move
- Points per Food: 10
- Points to Complete: 100
- Perfect for beginners to learn the basics

**Level 2 - Medium** 🟡
- Grid Size: 25x25
- Initial Snake Length: 5 segments
- Food Items: 2 (multi-target strategy)
- Speed: 100ms per move
- Points per Food: 20
- Points to Complete: 200
- Requires better spatial awareness

**Level 3 - Hard** 🔴
- Grid Size: 30x30
- Initial Snake Length: 7 segments
- Food Items: 3 (advanced multi-tasking)
- Speed: 70ms per move
- Points per Food: 30
- Points to Complete: 300
- Fast reflexes and planning required

**Level 4 - Surprise Challenge** ⚡
- Grid Size: 30x30
- Initial Snake Length: 7 segments
- Food Items: 3 (with time limit!)
- Speed: 60ms per move
- Points per Food: 30
- **NEW: 2-minute time limit** ⏰
- **NEW: Food disappears after 8 seconds** ⏳
- Points to Complete: 300
- Race against time - reach 300 points before the clock runs out!

**Level 5 - Infinite Mode** ♾️
- Grid Size: 20x20
- Initial Snake Length: 3 segments
- Food Items: 1
- Starting Speed: 150ms (gets progressively faster)
- Points per Food: 10
- **NEW: No score limit** - Play until game over
- **NEW: Progressive difficulty** - Speed increases every 100 points
- **NEW: Minimum speed** - Caps at 30ms per move
- **Victory Condition:** Fill the ENTIRE grid (400 cells = ~3,970 points from ~397 foods)
- Ultimate challenge for true Snake Masters!

### Game Mechanics

**Scoring:**
- Eating food increases score by (level × 10) points
- Score persists across sessions using localStorage
- High score tracking across all modes
- Special victory screen for Infinite Mode completion

**Win/Loss Conditions:**
- **Lose:** Snake hits wall or collides with itself
- **Win Level 1-4:** Reach target score for the level
- **Win Level 5:** Fill the entire grid (practically impossible!)
- **Lose Level 4:** Time runs out before reaching 300 points

**Controls:**
- **Arrow Keys:** Move snake in four directions
- **WASD Keys:** Alternative movement controls
- **Space Bar:** Pause/Resume game
- **↑/↓ or W/S:** Navigate menu options (Game Over/Level Complete screens)
- **Enter:** Select highlighted option
- Cannot reverse direction (prevents instant death)

**Visual Feedback:**
- Snake head with eye emoji (👁️)
- Random fruit emojis for food variety
- Pulsing food animation
- Timer display for Level 4 (turns red when under 30 seconds)
- Speed indicator for Infinite Mode
- Green highlight on selected menu options
- Epic rainbow background for Infinite Mode victory

## 🛠️ Technical Implementation

### Technologies Used
- **Vue 3** - Progressive JavaScript framework
- **Vuex 4** - Centralized state management
- **Vite** - Build tool and dev server
- **Composition API** - Modern Vue component logic
- **CSS3** - Advanced animations and styling
- **Web Audio API** - Dynamic sound effects

### Architecture

#### 1. State Management (Vuex)
Centralized store structure with comprehensive game state management

**State Structure:**
- Game status (menu/playing/paused/gameOver/levelComplete)
- Snake position array
- Food positions with emoji and timestamps (for timed food)
- Score and high score
- Current level and level configuration
- Grid settings and speed
- Timer state (for Level 4)
- Food timers array (for Level 4)

**Key Mutations:**
- `INIT_GAME` - Initialize game with level config
- `UPDATE_SNAKE` - Move snake and handle growth
- `CHANGE_DIRECTION` - Update snake direction with buffering
- `EAT_FOOD` - Handle food consumption and respawning
- `SET_GAME_STATUS` - Change game state
- `INCREASE_SPEED` - Progressive speed increase for Infinite Mode
- `START_LEVEL_TIMER` - Initialize countdown timer for Level 4
- `DECREASE_LEVEL_TIMER` - Countdown logic
- `CLEAR_LEVEL_TIMER` - Cleanup timer interval
- `ADD_TIMED_FOOD` - Spawn food with expiration timer
- `REMOVE_FOOD_BY_INDEX` - Remove specific food item
- `CLEAR_FOOD_TIMERS` - Cleanup all food timers

**Key Actions:**
- `startGame` - Initialize game, spawn timed food if needed, start timer
- `startGameLoop` - Main game loop with dynamic speed
- `gameStep` - Execute one frame of game logic
- `endGame` - Handle game over state with cleanup
- `completeLevel` - Level completion with epic sound for Infinite Mode
- `continueToNextLevel` - Advance to next level
- `togglePause` - Pause/Resume functionality
- `spawnTimedFood` - Create food with automatic expiration
- `startLevelTimer` - Begin countdown for Level 4
- `playSound` - Play audio feedback (eat, gameOver, levelUp, epicVictory)

**Key Getters:**
- `isGameActive` - Check if game is currently playing
- `isGamePaused` - Check if game is paused
- `isInfiniteMode` - Check if current level is Infinite Mode
- `hasTimeLimit` - Check if level has time constraint
- `hasNextLevel` - Check if there's a next level available
- `snakeLength` - Current snake length
- `levelProgress` - Progress percentage toward level goal

#### 2. Game Logic (Utils)
Pure functions for game calculations and configurations

**Core Functions:**
- `generateFood()` - Random food placement avoiding snake
- `moveSnake()` - Calculate new snake position with growth
- `checkWallCollision()` - Boundary detection
- `checkSelfCollision()` - Self-intersection detection
- `checkFoodCollision()` - Food eating detection
- `getLevelConfig()` - Comprehensive level configuration retrieval
- `initializeSnake()` - Create initial snake at grid center
- `getRandomFoodEmoji()` - Random fruit selection

**Level Configurations:**
Each level has detailed configuration including:
- Grid size, snake length, food count
- Speed and point values
- Special features (time limits, progressive speed, food lifetime)
- Win conditions and gameplay modifiers

#### 3. Components

**GameMenu.vue**
- Main menu and level selection
- Visual level cards with difficulty indicators
- High score display
- Instructions section
- Special styling for Level 4 & 5 (gradient backgrounds with white text)

**GameBoard.vue**
- Real-time game rendering
- Grid-based snake and food display
- Score panel with dynamic stats
- Timer display (Level 4 with warning animation)
- Speed indicator (Infinite Mode)
- Pause overlay with instructions
- Keyboard event handling
- Control hints

**GameOver.vue**
- Game over screen with detailed statistics
- Final score, high score, level reached, snake length
- New high score celebration
- Keyboard navigation (↑↓ + Enter)
- Selected option highlighted in green
- Play Again and Return to Menu options
- Strategy tips for improvement

**LevelComplete.vue**
- Level completion celebration
- Standard celebration for Levels 1-4
- **EPIC celebration for Infinite Mode:**
  - Rainbow animated background
  - Golden container with glow effect
  - Fireworks animations
  - "LEGENDARY ACHIEVEMENT" title
  - Rainbow gradient text
  - Detailed statistics grid (score, foods eaten, grid cells, length)
  - Special congratulatory message
- Keyboard navigation support
- Continue to next level or return to menu

### Key Technical Concepts

#### Events
- **Keyboard Events:** Arrow keys, WASD, Space for controls
- **Mouse Events:** Button clicks for menu navigation
- **Custom Events:** Direction changes, game state transitions
- **Timer Events:** Countdown for Level 4, food expiration
- **Interval Management:** Game loop, level timer, food timers with proper cleanup

#### Hooks (Composition API)
- `ref` - Reactive references for component state
- `computed` - Derived state from Vuex store
- `onMounted` - Initialize keyboard listeners and event handlers
- `onUnmounted` - Cleanup event listeners, intervals, and timers
- `useStore` - Access Vuex store in components

#### State Handling (Vuex)
- Centralized game state management
- Predictable state mutations
- Action-based game logic with async support
- Getter-based computed properties
- LocalStorage integration for high score persistence
- Complex state for timed challenges and progressive difficulty
- Proper cleanup of intervals and timers to prevent memory leaks

#### APIs
- **Web Audio API:** Dynamic sound effects
  - Eat sound (800 Hz beep)
  - Game over sound (200 Hz descending tone)
  - Level up sound (1200 Hz ascending tone)
  - Epic victory sound (Multi-chord triumphant fanfare for Infinite Mode)
- **Emoji API:** Random fruit emojis (🍎🍌🍇🍓🍊🍉🍑🍒)
- **LocalStorage API:** Persistent high score storage
- **setTimeout/setInterval:** Timer and interval management

#### Reactive Feedback
- Real-time score updates
- Snake growth animation with smooth transitions
- Food pulsing animation (scale transform)
- Pause overlay with semi-transparent background
- Direction buffering (prevents double-tap bugs)
- Timer warning animation (red pulsing when < 30 seconds)
- Smooth CSS transitions and transforms
- Selected menu option highlighting
- Progressive difficulty visualization
- Epic victory animations (rainbow backgrounds, fireworks, glowing effects)

#### Advanced Features
- **Timed Food System (Level 4):**
  - Food spawns with timestamp
  - Auto-removes after 8 seconds
  - Automatically spawns replacement food
  - Managed via foodTimers array
- **Progressive Speed (Infinite Mode):**
  - Speed increases every 100 points
  - Game loop restarts with new speed
  - Capped at minimum 30ms per move
- **Grid Fill Detection:**
  - Automatic victory when no empty cells remain
  - Calculates when generateFood returns null
- **Keyboard Navigation:**
  - Arrow keys to navigate menu options
  - Enter to select
  - Visual feedback with green highlighting
  - Circular navigation (wraps around)

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v20.19.0 or higher)
- npm or yarn

### Installation Steps

1. Clone/Download the project
```bash
cd snake-game
```

2. Install dependencies
```bash
npm install
```

3. Run development server
```bash
npm run dev
```

4. Build for production
```bash
npm run build
```

5. Preview production build
```bash
npm run preview
```

## 🎯 How to Play

### Getting Started
1. **Start Game:** Select a difficulty level from the main menu
2. **Control Snake:** Use Arrow Keys or WASD to move
3. **Eat Food:** Guide the snake to collect fruit emojis
4. **Grow:** Each food item makes your snake longer
5. **Avoid:** Don't hit walls or your own tail
6. **Pause:** Press Space to pause/resume anytime
7. **Navigate Menus:** Use ↑↓ arrows and Enter on Game Over/Level Complete screens

### Level-Specific Tips

**Level 1-3 (Standard Levels):**
- Plan your route to avoid trapping yourself
- Use the edges strategically
- Keep the snake moving in patterns
- Win by reaching the target score

**Level 4 (Surprise Challenge):**
- Watch the timer! ⏰
- Food disappears after 8 seconds - don't wait too long!
- You need 300 points in 2 minutes
- Quick decision-making is crucial
- Timer turns red when under 30 seconds remaining

**Level 5 (Infinite Mode):**
- Start slow, game speeds up every 100 points
- No time limit, but speed keeps increasing
- The only way to truly "win" is to fill the entire 20×20 grid (400 cells)
- This requires eating approximately 397 foods for ~3,970 points
- Speed caps at 30ms per move (extremely fast!)
- Most players aim for high scores rather than grid completion

### Menu Navigation
- **Game Over Screen:**
  - Press ↑↓ to select "Play Again" or "Back to Menu"
  - Press Enter to confirm selection
  - Selected option highlighted in green
- **Level Complete Screen:**
  - Press ↑↓ to select "Continue" or "Return to Menu"
  - Press Enter to confirm selection
  - Green highlighting shows current selection

## 📊 Game Strategy & Scoring

### Reference
- Classic Snake game mechanics
- Based on Nokia phone Snake and modern web implementations
- Enhanced with modern features and progressive difficulty
- Game inspiration from: https://gamegix.com/snake/game#

### Scoring Strategy
- **Levels 1-4:** Score-based progression with clear targets
- **Level 5:** Endless scoring with progressive challenge
- High score persists across all sessions via localStorage
- Points per food = Level × 10

### Difficulty Progression
- **Level 1:** Learn the basics, slow pace (150ms)
- **Level 2:** Medium challenge, multi-food strategy (100ms)
- **Level 3:** Expert mode, fast reflexes required (70ms)
- **Level 4:** Ultimate pressure test - time + disappearing food (60ms)
- **Level 5:** Infinite endurance challenge - speed ramps from 150ms to 30ms

### Theoretical Maximum Scores
- **Level 1:** Unlimited (but advances at 100)
- **Level 2:** Unlimited (but advances at 200)
- **Level 3:** Unlimited (completes at 300)
- **Level 4:** 300 (must reach within 2 minutes)
- **Level 5:** ~3,970 (if entire 400-cell grid is filled - nearly impossible!)

## 🏆 Achievements

### Victory Conditions
- **Standard Victory (Levels 1-4):** Reach target score
- **Epic Victory (Level 5):** Fill entire grid with snake
  - Special rainbow animated background
  - Golden celebration container
  - Fireworks and sparkle effects
  - Multi-chord triumphant fanfare
  - Detailed statistics display
  - "LEGENDARY ACHIEVEMENT" recognition

### Challenge Yourself
- Beat all 5 levels in one session
- Achieve a high score above 500
- Complete Level 4 with time to spare
- Survive in Infinite Mode at maximum speed (30ms)
- Fill the entire grid in Infinite Mode (ultimate challenge!)

## 🎨 Visual Design

### Color Scheme
- **Background:** Purple gradient (667eea → 764ba2)
- **Snake:** Green gradient with glowing head
- **Level 1:** Green theme (easy)
- **Level 2:** Yellow theme (medium)
- **Level 3:** Red theme (hard)
- **Level 4:** Orange-red gradient (time pressure)
- **Level 5:** Purple-indigo gradient (infinite)
- **Victory (Infinite):** Rainbow animated gradient

### Animations
- Snake movement with smooth transitions
- Food pulsing (scale 1.0 → 1.2)
- Container pulsing shadows
- Timer warning pulse (opacity animation)
- Menu option hover effects (translateY + shadow)
- Victory fireworks sparkle
- Rainbow text gradient shift
- Background gradient animation

## 🔧 Customization & Testing

### Developer Mode
To test Infinite Mode victory (since filling 400 cells is nearly impossible):

Add this to `GameBoard.vue` handleKeyPress function:
```javascript
} else if (key === 'v') {
    event.preventDefault()
    store.dispatch('game/completeLevel')
}
```

Press 'V' during gameplay to trigger victory screen!

### Adjusting Difficulty
Edit `gameLogic.js` to customize level configurations:
- Change grid sizes
- Adjust speeds
- Modify food counts
- Change point values
- Add/remove time limits

---

**Built with ❤️ using Vue.js**

*A modern take on the classic Snake game with progressive challenges and epic celebrations!* 🐍✨