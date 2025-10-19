# 🐍 Snake Game - Vue.js/VueX Implementation

A modern, fully-featured Snake game built with Vue 3, Vuex, and the Composition API.

## 📋 Project Overview

This project is a complete implementation of the classic Snake game with three difficulty levels, built as a graded practical assignment for ICS 511: Web Programming.

### Team Information
- **Team Name:** [Your Team Name]
- **Members:** [Member 1 Name (ID, Email)], [Member 2 Name (ID, Email)]
- **Project:** Single Player JavaScript Snake Game

## 🎮 Game Features

### Three Difficulty Levels

**Level 1 - Easy**
- Grid Size: 20x20
- Initial Snake Length: 3 segments
- Food Items: 1
- Speed: 150ms per move
- Points per Food: 10
- Points to Complete: 100

**Level 2 - Medium**
- Grid Size: 25x25
- Initial Snake Length: 5 segments
- Food Items: 2
- Speed: 100ms per move
- Points per Food: 20
- Points to Complete: 200

**Level 3 - Hard**
- Grid Size: 30x30
- Initial Snake Length: 7 segments
- Food Items: 3
- Speed: 70ms per move
- Points per Food: 30
- No level limit (play until game over)

### Game Mechanics

**Scoring:**
- Eating food increases score by (level × 10) points
- Score persists across sessions using localStorage
- High score tracking

**Win/Loss Conditions:**
- **Lose:** Snake hits wall or collides with itself
- **Win:** Reach target score for Level 1 or 2 (automatically advances)

**Controls:**
- Arrow Keys: Move snake in four directions
- WASD Keys: Alternative movement controls
- Space Bar: Pause/Resume game
- Cannot reverse direction (prevents instant death)

## 🛠️ Technical Implementation

### Technologies Used
- **Vue 3** - Progressive JavaScript framework
- **Vuex 4** - State management
- **Vite** - Build tool and dev server
- **Composition API** - Modern Vue component logic
- **CSS3** - Animations and styling

### Architecture

#### 1. State Management (Vuex)
Store structure with game state, mutations, actions, and getters

**State Structure:**
- Game status (menu/playing/paused/gameOver)
- Snake position array
- Food positions with emoji
- Score and high score
- Level configuration
- Grid settings

**Key Mutations:**
- INIT_GAME - Initialize game with level config
- UPDATE_SNAKE - Move snake and handle growth
- CHANGE_DIRECTION - Update snake direction
- EAT_FOOD - Handle food consumption
- SET_GAME_STATUS - Change game state

**Key Actions:**
- startGame - Initialize and start game loop
- gameStep - Execute one frame of game logic
- endGame - Handle game over state
- completeLevel - Advance to next level
- playSound - Play audio feedback

#### 2. Game Logic (Utils)
Pure functions for game calculations

**Core Functions:**
- generateFood() - Random food placement
- moveSnake() - Calculate new snake position
- checkWallCollision() - Boundary detection
- checkSelfCollision() - Self-intersection detection
- checkFoodCollision() - Food eating detection
- getLevelConfig() - Level configuration retrieval

#### 3. Components
- GameMenu.vue - Main menu and level selection
- GameBoard.vue - Game rendering and controls
- GameOver.vue - Game over screen with stats

### Key Technical Concepts

#### Events
- Keyboard Events: Arrow keys, WASD, Space for controls
- Mouse Events: Button clicks for menu navigation
- Custom Events: Direction changes, game state transitions

#### Hooks (Composition API)
- ref - Reactive references
- computed - Derived state from Vuex
- onMounted - Initialize keyboard listeners
- onUnmounted - Cleanup event listeners and intervals
- useStore - Access Vuex store

#### State Handling (VueX)
- Centralized game state management
- Predictable state mutations
- Action-based game logic
- Getter-based computed properties
- LocalStorage integration for high score persistence

#### APIs
- Web Audio API: Sound effects for eating, game over, level up
- Emoji API: Random fruit emojis for food variety
- LocalStorage API: High score persistence

#### Reactive Feedback
- Real-time score updates
- Snake growth animation
- Food pulsing animation
- Pause overlay
- Direction buffering (prevents double-tap bugs)
- Smooth CSS transitions

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

1. Start Game: Select a difficulty level from the main menu
2. Control Snake: Use Arrow Keys or WASD to move
3. Eat Food: Guide the snake to collect fruit emojis
4. Grow: Each food item makes your snake longer
5. Avoid: Don't hit walls or your own tail
6. Pause: Press Space to pause/resume
7. Win: Reach the target score to advance to the next level

## 📊 Game Strategy

### Reference
- Classic Snake game mechanics
- Based on Nokia phone Snake and modern web implementations
- Game inspiration from: https://gamegix.com/snake/game#

### Scoring Strategy
- Progressive difficulty with score thresholds
- Level-based point multipliers
- High score tracking across sessions

### Difficulty Progression
- Level 1: Learn the basics, slow pace
- Level 2: Medium challenge, multi-food strategy
- Level 3: Expert mode, fast reflexes required

Built with Vue.js
