<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const score = computed(() => store.state.game.score)
const highScore = computed(() => store.state.game.highScore)
const currentLevel = computed(() => store.state.game.currentLevel)
const snakeLength = computed(() => store.getters['game/snakeLength'])
const hasNextLevel = computed(() => store.getters['game/hasNextLevel'])
const isInfiniteMode = computed(() => store.getters['game/isInfiniteMode'])

// Keyboard navigation
const selectedOption = ref(0) // 0 = first button, 1 = menu button
const totalOptions = 2

const continueLevel = () => {
    store.dispatch('game/continueToNextLevel')
}

const playAgain = () => {
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
            if (hasNextLevel.value) {
                continueLevel()
            } else {
                playAgain()
            }
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
  <div class="level-complete" :class="{ 'infinite-complete': isInfiniteMode }">
    <div class="level-complete-container" :class="{ 'infinite-container': isInfiniteMode }">
      <!-- Epic celebration for infinite mode -->
      <div v-if="isInfiniteMode" class="epic-celebration">
        <div class="fireworks">🎆🎇✨🎆🎇✨🎆🎇</div>
        <h1 class="epic-title">🏆 LEGENDARY ACHIEVEMENT! 🏆</h1>
        <p class="epic-subtitle">YOU CONQUERED INFINITE MODE!</p>
        <div class="epic-message">
          <p class="rainbow-text">🐍 ULTIMATE SNAKE MASTER 🐍</p>
        </div>
        <div class="fireworks">✨🎇🎆✨🎇🎆✨🎇</div>
      </div>

      <!-- Normal celebration for other levels -->
      <div v-else class="celebration">
        <h1 class="title">🎉 Level {{ currentLevel }} Complete! 🎉</h1>
        <p class="subtitle">Congratulations!</p>
      </div>
      
      <div class="stats-container">
        <div class="stat-box">
          <div class="stat-icon">⭐</div>
          <div class="stat-content">
            <p class="stat-label">{{ isInfiniteMode ? 'Final Score' : 'Level Score' }}</p>
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
          <div class="stat-icon">📏</div>
          <div class="stat-content">
            <p class="stat-label">Snake Length</p>
            <p class="stat-value">{{ snakeLength }}</p>
          </div>
        </div>
      </div>
      
      <div v-if="!isInfiniteMode" class="message-box">
        <p v-if="hasNextLevel" class="next-level-message">
          Ready for Level {{ currentLevel + 1 }}?
          <br>
          Things will get faster and more challenging!
        </p>
        <p v-else class="final-level-message">
          You've completed all levels!
          <br>
          You're a Snake Master! 🏆
        </p>
      </div>

      <div v-if="isInfiniteMode" class="infinite-message-box">
        <h3 class="infinite-title">📊 The Impossible Achieved</h3>
        <div class="infinite-stats-grid">
          <div class="infinite-stat">
            <span class="stat-icon-large">🎯</span>
            <p class="stat-number">{{ 3970 }}</p>
            <p class="stat-description">Total Score</p>
          </div>
          <div class="infinite-stat">
            <span class="stat-icon-large">🟡</span>
            <p class="stat-number">{{ 397 }}</p>
            <p class="stat-description">Foods Eaten</p>
          </div>
          <div class="infinite-stat">
            <span class="stat-icon-large">📐</span>
            <p class="stat-number">400</p>
            <p class="stat-description">Grid Cells (20×20)</p>
          </div>
          <div class="infinite-stat">
            <span class="stat-icon-large">📏</span>
            <p class="stat-number">{{400}}</p>
            <p class="stat-description">Final Length</p>
          </div>
        </div>
        <p class="infinite-congrats">
          🌟 You filled every single cell in the grid! 🌟<br>
          You are among the elite few who have mastered the impossible!
        </p>
      </div>
      
      <div class="action-buttons">
        <button 
          v-if="hasNextLevel"
          @click="continueLevel" 
          class="action-btn continue-btn"
          :class="{ 'selected': selectedOption === 0 }"
        >
          ▶️ Continue to Level {{ currentLevel + 1 }}
        </button>
        
        <button 
          v-else
          @click="playAgain" 
          class="action-btn continue-btn"
          :class="{ 'selected': selectedOption === 0 }"
        >
          🔄 {{ isInfiniteMode ? 'Attempt the Impossible Again' : `Play Level ${currentLevel} Again` }}
        </button>
        
        <button 
          @click="returnToMenu" 
          class="action-btn menu-btn"
          :class="{ 'selected': selectedOption === 1 }"
        >
          🏠 Return to Menu
        </button>
      </div>
      
      <div class="controls-hint">
        <p>↑↓ Navigate • ENTER Select</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.level-complete {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #000000;
  padding: 20px;
}

/* Epic background for infinite mode victory - PAC-MAN themed */
.level-complete.infinite-complete {
  background: linear-gradient(135deg, 
    #000000 0%, 
    #1a1a1a 25%, 
    #2d2d2d 50%, 
    #1a1a1a 75%, 
    #000000 100%);
  background-size: 400% 400%;
  animation: pacmanGradientShift 3s ease infinite;
}

@keyframes pacmanGradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.level-complete-container {
  background: rgba(0, 0, 0, 0.9);
  border-radius: 20px;
  padding: 40px;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(255, 255, 0, 0.3);
  border: 2px solid #333;
  animation: slideIn 0.5s ease, pulse 2s infinite;
}

.infinite-container {
  box-shadow: 0 20px 80px rgba(255, 255, 0, 0.6);
  animation: slideIn 0.5s ease, epicPulse 2s infinite, pacmanRotate 20s linear infinite;
  border: 3px solid #ffff00;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-50px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 20px 60px rgba(255, 255, 0, 0.3);
  }
  50% {
    box-shadow: 0 20px 80px rgba(255, 255, 0, 0.5);
  }
}

@keyframes epicPulse {
  0%, 100% {
    box-shadow: 0 20px 80px rgba(255, 255, 0, 0.6);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 30px 100px rgba(255, 255, 0, 0.9);
    transform: scale(1.02);
  }
}

@keyframes pacmanRotate {
  from { filter: hue-rotate(0deg) brightness(1); }
  50% { filter: hue-rotate(180deg) brightness(1.2); }
  to { filter: hue-rotate(360deg) brightness(1); }
}

/* Epic celebration styles - PAC-MAN themed */
.epic-celebration {
  text-align: center;
  margin-bottom: 30px;
  padding: 30px;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%);
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(255, 255, 0, 0.3);
  border: 2px solid #ffff00;
}

.fireworks {
  font-size: 2rem;
  animation: sparkle 1s infinite;
  margin: 10px 0;
}

@keyframes sparkle {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.2); }
}

.epic-title {
  font-size: 3rem;
  margin: 20px 0;
  color: #ffff00;
  text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.8), 0 0 20px rgba(255, 255, 0, 0.5);
  animation: bounce 1s ease infinite;
}

.epic-subtitle {
  font-size: 1.8rem;
  color: #ffff00;
  font-weight: bold;
  margin: 10px 0;
  animation: pacmanPulse 1.5s ease infinite;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
}

.epic-message {
  margin: 20px 0;
}

.rainbow-text {
  font-size: 2rem;
  font-weight: bold;
  background: linear-gradient(90deg, 
    #ffff00, #ffd700, #ffff00, #ffd700, 
    #ffff00, #ffd700, #ffff00);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: pacmanRainbow 3s linear infinite;
  margin: 15px 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
}

@keyframes pacmanRainbow {
  to { background-position: 200% center; }
}

@keyframes pacmanPulse {
  0%, 100% { 
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8), 0 0 10px rgba(255, 255, 0, 0.3);
  }
  50% { 
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8), 0 0 20px rgba(255, 255, 0, 0.6);
  }
}

.achievement-text {
  font-size: 1.2rem;
  color: #ffff00;
  margin: 10px 0;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
}

.infinite-message-box {
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%);
  color: #ffff00;
  padding: 30px;
  border-radius: 15px;
  margin-bottom: 30px;
  box-shadow: 0 10px 30px rgba(255, 255, 0, 0.3);
  border: 2px solid #ffff00;
}

.infinite-title {
  text-align: center;
  font-size: 1.5rem;
  margin: 0 0 25px 0;
  color: #ffff00;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
}

.infinite-stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 25px;
}

.infinite-stat {
  background: rgba(0, 0, 0, 0.6);
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 0, 0.3);
  transition: transform 0.3s ease;
}

.infinite-stat:hover {
  transform: scale(1.05);
  background: rgba(0, 0, 0, 0.8);
  border-color: rgba(255, 255, 0, 0.6);
}

.stat-icon-large {
  font-size: 2.5rem;
  display: block;
  margin-bottom: 10px;
}

.stat-number {
  font-size: 2.2rem;
  font-weight: bold;
  margin: 10px 0 5px 0;
  color: #ffff00;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
}

.stat-description {
  font-size: 0.9rem;
  margin: 0;
  color: rgba(255, 255, 0, 0.9);
  font-weight: 500;
}

.infinite-congrats {
  font-size: 1.15rem;
  font-weight: bold;
  margin: 0;
  line-height: 1.8;
  text-align: center;
  color: #ffff00;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
}

.celebration {
  text-align: center;
  margin-bottom: 30px;
}

.title {
  font-size: 2.5rem;
  margin: 0 0 10px 0;
  color: #ffff00;
  animation: bounce 1s ease;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

.subtitle {
  font-size: 1.5rem;
  color: #ffff00;
  margin: 0;
  font-weight: bold;
}

.stats-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin-bottom: 30px;
}

.stat-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: #1a1a1a;
  border-radius: 12px;
  transition: transform 0.3s ease;
  border: 1px solid #333;
}

.stat-box:hover {
  transform: scale(1.05);
}

.stat-icon {
  font-size: 2.5rem;
  margin-bottom: 10px;
}

.stat-content {
  text-align: center;
}

.stat-label {
  margin: 0 0 5px 0;
  font-size: 0.85rem;
  color: #ccc;
}

.stat-value {
  margin: 0;
  font-size: 1.8rem;
  font-weight: bold;
  color: #ffff00;
}

.message-box {
  background: #1a1a1a;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 30px;
  border-left: 4px solid #ffff00;
  border: 1px solid #333;
}

.next-level-message,
.final-level-message {
  margin: 0;
  font-size: 1.1rem;
  color: #ccc;
  text-align: center;
  line-height: 1.6;
}

.final-level-message {
  color: #ffff00;
  font-weight: bold;
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
  box-shadow: 0 4px 6px rgba(255, 255, 255, 0.1);
  border: 1px solid #333;
}

.action-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(255, 255, 0, 0.3);
}

.continue-btn {
  background: #1a1a1a;
  color: #ccc;
}

.continue-btn.selected {
  background: #333;
  color: #ffff00;
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(255, 255, 0, 0.4);
}

.menu-btn {
  background: #1a1a1a;
  color: #ccc;
}

.menu-btn.selected {
  background: #333;
  color: #ffff00;
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(255, 255, 0, 0.4);
}

.controls-hint {
  text-align: center;
  padding: 15px;
  background: #1a1a1a;
  border-radius: 10px;
  border: 1px solid #333;
}

.controls-hint p {
  margin: 0;
  color: #ccc;
  font-size: 0.9rem;
}

@media (max-width: 600px) {
  .level-complete-container {
    padding: 20px;
  }
  
  .title, .epic-title {
    font-size: 2rem;
  }
  
  .stats-container {
    grid-template-columns: 1fr;
  }

  .infinite-stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>