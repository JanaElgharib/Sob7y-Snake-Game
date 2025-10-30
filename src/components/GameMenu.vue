<script setup>
import { computed, ref, onMounted } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const highScore = computed(() => store.state.game.highScore)

// Quote of the day state
const quote = ref('')
const quoteAuthor = ref('')
const isLoadingQuote = ref(true)

const startGame = (level) => {
  store.dispatch('game/startGame', level)
}

// Fetch Quote of the Day
// const fetchQuoteOfTheDay = async () => {
//   try {
//     isLoadingQuote.value = true
    
//     // Using DummyJSON API (very reliable, no auth needed)
//     const response = await fetch('https://dummyjson.com/quotes/random')
    
//     if (!response.ok) {
//       throw new Error('Failed to fetch quote')
//     }
    
//     const data = await response.json()
    
//     if (data && data.quote && data.author) {
//       quote.value = data.quote
//       quoteAuthor.value = data.author
//     } else {
//       throw new Error('Invalid response format')
//     }
//   } catch (error) {
//     console.error('Error fetching quote:', error)
//     // This should NOT run if API works - shows API integration failed
//     quote.value = "API integration failed - please check connection"
//     quoteAuthor.value = "System Error"
//   } finally {
//     isLoadingQuote.value = false
//   }
// }
//
// onMounted(() => {
//   fetchQuoteOfTheDay()
// })
</script>

<template>
  <div class="game-menu">
    <div class="menu-container">
      <h1 class="game-title">
        <img src ="D:\Semester 5\Electives\Web Programming\Snake Game\snake-game\src\assets\rattlesnake.png" alt="Snake" class="snake-icon"/>
        PAC-MAN Snake 
        <img src="D:\Semester 5\Electives\Web Programming\Snake Game\snake-game\src\assets\halloween.png" alt="Pacman" class="pacman-icon"/>
      </h1>
      
      <div class="high-score">
        <p>High Score: <span class="score-value">{{ highScore }}</span></p>
      </div>

      <!-- Quote of the Day Section -->
      <!-- <div class="quote-section">
        <div class="quote-header">
          <img src="D:\Semester 5\Electives\Web Programming\Snake Game\snake-game\src\assets\halloween.png" alt="Pacman" class="quote-pacman-icon"/>
          <span class="quote-title">Motivation from Pac-Man:</span>
        </div>
        
        <div v-if="isLoadingQuote" class="quote-loading">
          <span class="loading-dots">Loading inspiration</span>
        </div>
        
        <div v-else class="quote-content">
          <p class="quote-text">"{{ quote }}"</p>
          <p class="quote-author">- {{ quoteAuthor }}</p>
        </div>
      </div> -->
      
      <div class="level-selection">
        <h2>Select Difficulty</h2>
        
        <div class="level-buttons">
          <button 
            class="level-btn level-1" 
            @click="startGame(1)"
          >
            <div class="level-icon">🟢</div>
            <div class="level-info">
              <h3>Level 1 - Easy</h3>
              <p>Grid: 20x20</p>
              <p>Speed: Slow</p>
              <p>Food: 1 item</p>
              <p>Points: 10 per food</p>
            </div>
          </button>
          
          <button 
            class="level-btn level-2" 
            @click="startGame(2)"
          >
            <div class="level-icon">🟡</div>
            <div class="level-info">
              <h3>Level 2 - Medium</h3>
              <p>Grid: 25x25</p>
              <p>Speed: Medium</p>
              <p>Food: 2 items</p>
              <p>Points: 20 per food</p>
            </div>
          </button>
          
          <button 
            class="level-btn level-3" 
            @click="startGame(3)"
          >
            <div class="level-icon">🔴</div>
            <div class="level-info">
              <h3>Level 3 - Hard</h3>
              <p>Grid: 30x30</p>
              <p>Speed: Fast</p>
              <p>Food: 3 items</p>
              <p>Points: 30 per food</p>
            </div>
          </button>

          <!-- Level 4 - NEW -->
          <button class="level-btn level-4" @click="startGame(4)">
            <div class="level-icon">⚡</div>
            <div class="level-info">
              <h3>Level 4 - Surprise Challenge</h3>
              <p>⏰ 2 minute time limit!</p>
              <p>⏳ Food disappears after 8 seconds</p>
              <p>Goal: 300 points before time runs out</p>
            </div>
          </button>
          
          <!-- Level 5 - NEW -->
          <button class="level-btn level-5" @click="startGame(5)">
            <div class="level-icon">♾️</div>
            <div class="level-info">
              <h3>Level 5 - Infinite</h3>
              <p>Progressively faster gameplay</p>
              <p>No score limit - test your limits!</p>
              <p>Speed increases every 100 points</p>
            </div>
          </button>
        </div>
      </div>
      
      <div class="instructions">
        <h3>How to Play</h3>
        <p>🎮 Use Arrow Keys or WASD to control the snake</p>
        <p>
            <img src ="D:\Semester 5\Electives\Web Programming\Snake Game\snake-game\src\assets\game.png" alt="pacFood" class="small-pacman-icon"/>
            Eat food to grow and score points</p>
        <p>⚠️ Don't hit the walls or yourself!</p>
        <p>⏸️ Press SPACE to pause</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.snake-icon {
  width: 50px;
  height: 50px;
  vertical-align: middle;
  margin-right: 8px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.snake-icon:hover {
  transform: translateY(-3px) scale(1.1);
  filter: drop-shadow(0 5px 15px rgba(0, 255, 0, 0.6));
}

.pacman-icon {
  width: 50px;
  height: 50px;
  vertical-align: middle;
  margin-right: 8px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.pacman-icon:hover {
  transform: translateY(-3px) scale(1.1);
  filter: drop-shadow(0 5px 15px rgba(255, 255, 0, 0.6));
}
.game-menu {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #000000;
  padding: 20px;
}

.menu-container {
  background: rgba(0, 0, 0, 0.9);
  border-radius: 20px;
  padding: 40px;
  max-width: 800px;
  box-shadow: 0 20px 60px rgba(255, 255, 0, 0.3);
  border: 2px solid #333;
}

.game-title {
  font-size: 3rem;
  text-align: center;
  margin: 0 0 20px 0;
  color: #ffff00;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  animation: titleGlow 2s infinite;
}

@keyframes titleGlow {
  0%, 100% { text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5), 0 0 10px rgba(255, 255, 0, 0.3); }
  50% { text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5), 0 0 20px rgba(255, 255, 0, 0.6); }
}

.high-score {
  text-align: center;
  margin-bottom: 20px;
  font-size: 1.2rem;
  color: #ccc;
}

.score-value {
  font-weight: bold;
  color: #ffff00;
  font-size: 1.5rem;
}

/* Quote Section Styles */
.quote-section {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border: 2px solid #ffff00;
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 30px;
  box-shadow: 0 5px 20px rgba(255, 255, 0, 0.2);
}

.quote-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.quote-pacman-icon {
  width: 35px;
  height: 35px;
  animation: pacmanBounce 2s infinite;
}

@keyframes pacmanBounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.quote-title {
  font-size: 1.1rem;
  font-weight: bold;
  color: #ffff00;
  text-shadow: 0 0 10px rgba(255, 255, 0, 0.5);
}

.quote-loading {
  text-align: center;
  padding: 20px;
}

.loading-dots {
  color: #ccc;
  font-size: 1rem;
  animation: dots 1.5s infinite;
}

@keyframes dots {
  0%, 20% { content: 'Loading inspiration'; }
  40% { content: 'Loading inspiration.'; }
  60% { content: 'Loading inspiration..'; }
  80%, 100% { content: 'Loading inspiration...'; }
}

.quote-content {
  padding: 15px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  border-left: 4px solid #ffff00;
}

.quote-text {
  font-size: 1.1rem;
  font-style: italic;
  color: #ffffff;
  margin: 0 0 10px 0;
  line-height: 1.6;
}

.quote-author {
  font-size: 0.95rem;
  color: #ffff00;
  text-align: right;
  margin: 0;
  font-weight: bold;
}

.quote-content.error .quote-text {
  color: #ff6b6b;
}

.level-selection h2 {
  text-align: center;
  color: #ffff00;
  margin-bottom: 20px;
}

.level-buttons {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 30px;
}

.level-btn {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  border: 3px solid transparent;
  border-radius: 15px;
  background: #1a1a1a;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  color: #ccc;
}

.level-btn:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(255, 255, 0, 0.3);
}

.level-1:hover {
  border-color: #4ade80;
  background: #0f1f0f;
}

.level-2:hover {
  border-color: #facc15;
  background: #1f1f0f;
}

.level-3:hover {
  border-color: #f87171;
  background: #1f0f0f;
}

.level-4 {
  background: linear-gradient(135deg, #ff6b00 0%, #ff0000 100%);
}

.level-5 {
  background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
}

/* White text for gradient background levels */
.level-4,
.level-5 {
  color: white;
}

.level-4 .level-info p,
.level-5 .level-info p {
  color: white;
}

.level-5 .level-info h3 {
    color: #00ffea;
}

.level-4:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0 15px 40px rgba(255, 107, 0, 0.4);
}

.level-5:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0 15px 40px rgba(139, 92, 246, 0.4);
}

.level-icon {
  font-size: 3rem;
}

.level-info h3 {
  margin: 0 0 10px 0;
  color: #ffff00;
}

.level-info p {
  margin: 5px 0;
  font-size: 0.9rem;
  color: #ccc;
}


.instructions {
  background: #1a1a1a;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  border: 1px solid #333;
}

.instructions h3 {
  margin: 0 0 15px 0;
  color: #ffff00;
  font-size: 1.2rem;
}

.instructions p {
  margin: 8px 0;
  color: #ccc;
  font-size: 0.95rem;
}
.small-pacman-icon {
  width: 25px;
  height: 25px;
  vertical-align: middle;
  margin-right: 8px;
  transition: all 0.3s ease;
  cursor: pointer;
}

@media (max-width: 600px) {
  .game-title {
    font-size: 2rem;
  }
  
  .menu-container {
    padding: 20px;
  }
  
  .level-btn {
    flex-direction: column;
    text-align: center;
  }

  .quote-section {
    padding: 15px;
  }

  .quote-text {
    font-size: 1rem;
  }
}
</style>