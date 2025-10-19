<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const score = computed(() => store.state.game.score)
const highScore = computed(() => store.state.game.highScore)
const currentLevel = computed(() => store.state.game.currentLevel)
const snakeLength = computed(() => store.getters['game/snakeLength'])

const isNewHighScore = computed(() => score.value === highScore.value && score.value > 0)

// Keyboard navigation
const selectedOption = ref(0) // 0 = restart, 1 = menu
const totalOptions = 2

const restartLevel = () => {
    store.dispatch('game/startGame', currentLevel.value)
}

const returnToMenu = () => {
    store.dispatch('game/returnToMenu')
}

const handleKeyPress = (event) => {
    const key = event.key.toLowerCase()
    
    if (key === 'arrowup' || key === 'w') {
        event.preventDefault()
        selectedOption.value = (selectedOption.value - 1 + totalOptions) % totalOptions
    } else if (key === 'arrowdown' || key === 's') {
        event.preventDefault()
        selectedOption.value = (selectedOption.value + 1) % totalOptions
    } else if (key === 'enter') {
        event.preventDefault()
        if (selectedOption.value === 0) {
            restartLevel()
        } else {
            returnToMenu()
        }
    }
}

onMounted(() => {
    window.addEventListener('keydown', handleKeyPress)
})

onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyPress)
})
</script>


<template>
  <div class="game-over">
    <div class="game-over-container">
      <div class="game-over-header">
        <h1 class="game-over-title">💀 Lost to Sob7y</h1>
        <p class="game-over-subtitle">Better luck next time!</p>
      </div>
      
      <div class="stats-container">
        <div class="stat-box">
          <div class="stat-icon">📊</div>
          <div class="stat-content">
            <p class="stat-label">Final Score</p>
            <p class="stat-value">{{ score }}</p>
          </div>
        </div>
        
        <div class="stat-box">
          <div class="stat-icon">👑</div>
          <div class="stat-content">
            <p class="stat-label">High Score</p>
            <p class="stat-value">{{ highScore }}</p>
          </div>
        </div>
        
        <div class="stat-box">
          <div class="stat-icon">🎯</div>
          <div class="stat-content">
            <p class="stat-label">Level Reached</p>
            <p class="stat-value">{{ currentLevel }}</p>
          </div>
        </div>
        
        <div class="stat-box">
          <div class="stat-icon">📏</div>
          <div class="stat-content">
            <p class="stat-label">Snake Length</p>
            <p class="stat-value">{{ snakeLength }}</p>
          </div>
        </div>
      </div>
      
      <div v-if="isNewHighScore" class="new-high-score">
        <p class="celebration">🎉 NEW HIGH SCORE! 🎉</p>
      </div>
      
      <div class="action-buttons">
        <button 
          @click="restartLevel" 
          class="action-btn restart-btn"
          :class="{ 'selected': selectedOption === 0 }"
        >
          🔄 Play Again (Level {{ currentLevel }})
        </button>
        <button 
          @click="returnToMenu" 
          class="action-btn menu-btn"
          :class="{ 'selected': selectedOption === 1 }"
        >
          🏠 Back to Menu
        </button>
      </div>
      
      <div class="controls-hint">
        <p>↑↓ Navigate • ENTER Select</p>
      </div>
      
      <div class="tips">
        <h3>💡 Tips for Next Time:</h3>
        <ul>
          <li>Plan your route ahead to avoid trapping yourself</li>
          <li>Try to keep the snake moving in patterns</li>
          <li>Don't panic when the snake gets long!</li>
          <li>Use the edges strategically</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.game-over {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.game-over-container {
  background: white;
  border-radius: 20px;
  padding: 40px;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideIn 0.5s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.game-over-header {
  text-align: center;
  margin-bottom: 30px;
}

.game-over-title {
  font-size: 3rem;
  margin: 0 0 10px 0;
  color: #333;
  animation: shake 0.5s ease;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  75% { transform: translateX(10px); }
}

.game-over-subtitle {
  font-size: 1.2rem;
  color: #666;
  margin: 0;
}

.stats-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-bottom: 30px;
}

.stat-box {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
  transition: transform 0.3s ease;
}

.stat-box:hover {
  transform: scale(1.05);
}

.stat-icon {
  font-size: 2.5rem;
}

.stat-content {
  flex: 1;
}

.stat-label {
  margin: 0 0 5px 0;
  font-size: 0.85rem;
  color: #666;
}

.stat-value {
  margin: 0;
  font-size: 1.8rem;
  font-weight: bold;
  color: #667eea;
}

.new-high-score {
  text-align: center;
  margin-bottom: 20px;
  animation: pulse 1s infinite;
}

.celebration {
  font-size: 1.5rem;
  font-weight: bold;
  color: #f59e0b;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.action-btn {
  padding: 15px 30px;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.action-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.restart-btn {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.restart-btn.selected {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
}

.restart-btn:not(.selected) {
  background: #f3f4f6;
  color: #333;
}

.menu-btn {
  background: #f3f4f6;
  color: #333;
}

.menu-btn.selected {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
}

.controls-hint {
  text-align: center;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 10px;
  margin-bottom: 20px;
}

.controls-hint p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

.tips {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 12px;
}

.tips h3 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 1.2rem;
}

.tips ul {
  margin: 0;
  padding-left: 20px;
}

.tips li {
  margin: 8px 0;
  color: #555;
  line-height: 1.5;
}

@media (max-width: 600px) {
  .game-over-container {
    padding: 20px;
  }
  
  .game-over-title {
    font-size: 2rem;
  }
  
  .stats-container {
    grid-template-columns: 1fr;
  }
}
</style>