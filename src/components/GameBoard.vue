<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const gridRef = ref(null)

// Computed properties from store
const snake = computed(() => store.state.game.snake)
const food = computed(() => store.state.game.food)
const score = computed(() => store.state.game.score)
const highScore = computed(() => store.state.game.highScore)
const currentLevel = computed(() => store.state.game.currentLevel)
const gridSize = computed(() => store.state.game.gridSize)
const isGamePaused = computed(() => store.getters['game/isGamePaused'])
const snakeLength = computed(() => store.getters['game/snakeLength'])

// New Computed properties from store
const hasTimeLimit = computed(() => store.getters['game/hasTimeLimit'])
const timeRemaining = computed(() => store.state.game.timeRemaining)
const isInfiniteMode = computed(() => store.getters['game/isInfiniteMode'])
const speed = computed(() => store.state.game.speed)

const formatTime = (seconds) => {
  if (seconds == null || isNaN(seconds)) return '00:00'  // ✅ Prevent NaNNaN

  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)

  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

// Grid styling
const gridStyle = computed(() => {
    const size = gridSize.value
    const cellSize = Math.min(600 / size, 30) // Max 600px, max cell 30px
    return {
    gridTemplateColumns: `repeat(${size}, ${cellSize}px)`,
    gridTemplateRows: `repeat(${size}, ${cellSize}px)`,
    width: `${size * cellSize}px`,
    height: `${size * cellSize}px`
    }
})

// Get snake head emoji based on level
const getSnakeHeadEmoji = (level) => {
  const headEmojis = {
    1: '🟢', // Green circle
    2: '🟡', // Yellow circle  
    3: '🔴', // Red circle
    4: '⚡', // Orange flash
    5: '♾️'  // Infinity symbol
  }
  return headEmojis[level] || '🟡'
}

// Get snake body emoji based on level
const getSnakeBodyEmoji = (level) => {
  const bodyEmojis = {
    1: '🟩', // Green square
    2: '🟨', // Yellow square
    3: '🟥', // Red square
    4: '🟧', // Orange square
    5: '🟦'  // Blue square
  }
  return bodyEmojis[level] || '🟨'
}

// Get position style for snake segment
const getSegmentStyle = (segment) => {
    return {
    gridColumn: segment.x + 1,
    gridRow: segment.y + 1
    }
}

// Get position style for food
const getFoodStyle = (foodItem) => {
    return {
    gridColumn: foodItem.x + 1,
    gridRow: foodItem.y + 1
    }
}

// Handle keyboard input
const handleKeyPress = (event) => {
    const key = event.key.toLowerCase()
    
    // Direction controls
    if (key === 'arrowup' || key === 'w') {
    event.preventDefault()
    store.dispatch('game/changeDirection', 'UP')
    } else if (key === 'arrowdown' || key === 's') {
    event.preventDefault()
    store.dispatch('game/changeDirection', 'DOWN')
    } else if (key === 'arrowleft' || key === 'a') {
    event.preventDefault()
    store.dispatch('game/changeDirection', 'LEFT')
    } else if (key === 'arrowright' || key === 'd') {
    event.preventDefault()
    store.dispatch('game/changeDirection', 'RIGHT')
    } else if (key === ' ') {
    event.preventDefault()
    togglePause()
    } else if (key === 'v') {  // ← NEW: Press 'V' for Victory!
        event.preventDefault()
        store.dispatch('game/completeLevel')
    }
}

// Toggle pause
const togglePause = () => {
    store.dispatch('game/togglePause')
}

// Return to menu
const returnToMenu = () => {
    if (confirm('Are you sure you want to return to menu? Your progress will be lost.')) {
    store.dispatch('game/returnToMenu')
    }
}

// Lifecycle hooks
onMounted(() => {
    window.addEventListener('keydown', handleKeyPress)
})

onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyPress)
    store.commit('game/CLEAR_GAME_INTERVAL')
})
</script>

<template>
  <div class="game-board-container">
    <div class="game-header">
      <div class="score-panel">
        <div class="stat">
          <span class="label">Score:</span>
          <span class="value">{{ score }}</span>
        </div>
        <div class="stat">
          <span class="label">High Score:</span>
          <span class="value">{{ highScore }}</span>
        </div>
        <div class="stat">
          <span class="label">Level:</span>
          <span class="value">{{ currentLevel }}</span>
        </div>
        <div class="stat">
          <span class="label">Length:</span>
          <span class="value">{{ snakeLength }}</span>
        </div>

        <!-- NEW: Timer for surprise level -->
        <div v-if="hasTimeLimit && timeRemaining !== null" class="stat timer-stat">
          <span class="label">Time:</span>
          <span class="value" :class="{ 'time-warning': timeRemaining < 30 }">
            {{ formatTime(timeRemaining) }}
          </span>
        </div>
        
        <!-- NEW: Speed indicator for infinite mode -->
        <div v-if="isInfiniteMode" class="stat">
          <span class="label">Speed:</span>
          <span class="value">{{ speed }}ms</span>
        </div>
      </div>
      
      <div class="controls">
        <button @click="togglePause" class="control-btn">
          {{ isGamePaused ? '▶️ Resume' : '⏸️ Pause' }}
        </button>
        <button @click="returnToMenu" class="control-btn menu-btn">
          🏠 Menu
        </button>
      </div>
    </div>
    
    <div class="game-area">
      <div 
        class="grid" 
        :style="gridStyle"
        ref="gridRef"
      >
        <!-- Snake segments (styled as Pac-Man) -->
        <div
          v-for="(segment, index) in snake"
          :key="`snake-${index}`"
          class="snake-segment"
          :class="{ 'snake-head': index === 0 }"
          :style="getSegmentStyle(segment)"
        >
          <span v-if="index === 0" class="snake-head-character" :class="`level-${currentLevel}`">
            {{ getSnakeHeadEmoji(currentLevel) }}
          </span>
          <span v-else class="snake-body" :class="`level-${currentLevel}`">
            {{ getSnakeBodyEmoji(currentLevel) }}
          </span>
        </div>
        
        <!-- Food items (styled as pellets) -->
        <div
          v-for="(foodItem, index) in food"
          :key="`food-${index}`"
          class="food"
          :style="getFoodStyle(foodItem)"
        >
          {{ foodItem.emoji }}
        </div>
        
        <!-- Pause overlay -->
        <div v-if="isGamePaused" class="pause-overlay">
          <div class="pause-content">
            <h2>⏸️ PAUSED</h2>
            <p>Looks like you need a break from the maze!</p>
            <p>Press SPACE or click Resume to continue</p>
          </div>
        </div>
      </div>
    </div>
    
    <div class="game-info">
      <p class="hint">Use Arrow Keys or WASD to move • SPACE to pause</p>
    </div>
  </div>
</template>

<style scoped>
.game-board-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background: #000000;
  padding: 20px;
}

.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 800px;
  margin-bottom: 20px;
  gap: 20px;
  flex-wrap: wrap;
}

.score-panel {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.stat {
  background: #1a1a1a;
  padding: 10px 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(255, 255, 255, 0.1);
  border: 1px solid #333;
}

.stat .label {
  color: #ccc;
  font-size: 0.9rem;
  margin-right: 8px;
}

.stat .value {
  color: #ffff00;
  font-weight: bold;
  font-size: 1.2rem;
}

.controls {
  display: flex;
  gap: 10px;
}

.control-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 10px;
  background: #1a1a1a;
  color: #ffff00;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(255, 255, 255, 0.1);
  border: 1px solid #333;
}

.control-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(255, 255, 0, 0.3);
  background: #333;
}

.menu-btn {
  background: #ff0000;
  color: white;
}

.game-area {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background: #000000;
  border-radius: 15px;
  box-shadow: 0 20px 60px rgba(255, 255, 0, 0.2);
  border: 2px solid #333;
}

.grid {
  display: grid;
  background: #000000;
  outline: 3px solid #0000ff;
  border-radius: 5px;
  position: relative;
  overflow: hidden;
}

.snake-segment {
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.05s ease;
  border-radius: 3px;
}

.snake-head {
  background: transparent;
  border-radius: 5px;
  position: relative;
}

.snake-head-character {
  font-size: 1.5em;
  animation: snakeHeadPulse 0.3s infinite;
  z-index: 10;
}

@keyframes snakeHeadPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.snake-body {
  font-size: 1.2em;
  opacity: 0.8;
}

/* Level-specific snake styling */
.level-1 .snake-head-character {
  color: #4ade80; /* Green */
}

.level-1 .snake-body {
  color: #4ade80; /* Green */
}

.level-2 .snake-head-character {
  color: #facc15; /* Yellow */
}

.level-2 .snake-body {
  color: #facc15; /* Yellow */
}

.level-3 .snake-head-character {
  color: #ef4444; /* Red */
}

.level-3 .snake-body {
  color: #ef4444; /* Red */
}

.level-4 .snake-head-character {
  color: #f97316; /* Orange */
  animation: flashPulse 0.5s infinite;
}

@keyframes flashPulse {
  0%, 100% { 
    transform: scale(1);
    filter: brightness(1);
  }
  50% { 
    transform: scale(1.2);
    filter: brightness(1.5);
  }
}

.level-4 .snake-body {
  color: #f97316; /* Orange */
}

.level-5 .snake-head-character {
  color: #3b82f6; /* Blue */
  animation: infinitePulse 1s infinite;
}

@keyframes infinitePulse {
  0%, 100% { 
    transform: scale(1) rotate(0deg);
    filter: hue-rotate(0deg);
  }
  50% { 
    transform: scale(1.1) rotate(180deg);
    filter: hue-rotate(180deg);
  }
}

.level-5 .snake-body {
  color: #3b82f6; /* Blue */
}

.food {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.2em;
  animation: foodPulse 0.8s infinite;
}

@keyframes foodPulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

.pause-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.pause-content {
  text-align: center;
  color: white;
}

.pause-content h2 {
  font-size: 3rem;
  margin: 0 0 20px 0;
}

.pause-content p {
  font-size: 1.2rem;
  margin: 0;
}

.game-info {
  margin-top: 20px;
  text-align: center;
}

.hint {
  color: #ffff00;
  font-size: 0.95rem;
  background: rgba(0, 0, 0, 0.8);
  padding: 10px 20px;
  border-radius: 10px;
  border: 1px solid #333;
}

@media (max-width: 600px) {
  .game-header {
    flex-direction: column;
  }
  
  .score-panel {
    justify-content: center;
  }
}

.timer-stat .value {
  color: #ffff00;
  transition: color 0.3s ease;
}

.time-warning {
  color: #ff0000 !important;
  animation: timerPulse 1s infinite;
}

@keyframes timerPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
</style>
