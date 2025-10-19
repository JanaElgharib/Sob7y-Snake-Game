<script setup>
//import snakeImg from '@/assets/sob7y.png'
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const highScore = computed(() => store.state.game.highScore)

const startGame = (level) => {
  store.dispatch('game/startGame', level)
}
</script>

<template>
  <div class="game-menu">
    <div class="menu-container">
      <h1 class="game-title">
        <img src="D:\Semester 5\Electives\Web Programming\Snake Game\snake-game\src\assets\sob7y.png" alt="Sob7y" class="snake-icon"/>
        Sob7y Za Snake
      </h1>
      
      <div class="high-score">
        <p>High Score: <span class="score-value">{{ highScore }}</span></p>
      </div>
      
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
        <p>🍎 Eat food to grow and score points</p>
        <p>⚠️ Don't hit the walls or yourself!</p>
        <p>⏸️ Press SPACE to pause</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.snake-icon {
  width: 40px;
  height: 40px;
  vertical-align: middle;
  margin-right: 8px;
}
.game-menu {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.menu-container {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 40px;
  max-width: 800px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.game-title {
  font-size: 3rem;
  text-align: center;
  margin: 0 0 20px 0;
  color: #333;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.high-score {
  text-align: center;
  margin-bottom: 30px;
  font-size: 1.2rem;
  color: #555;
}

.score-value {
  font-weight: bold;
  color: #667eea;
  font-size: 1.5rem;
}

.level-selection h2 {
  text-align: center;
  color: #333;
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
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
}

.level-btn:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.level-1:hover {
  border-color: #4ade80;
  background: #f0fdf4;
}

.level-2:hover {
  border-color: #facc15;
  background: #fefce8;
}

.level-3:hover {
  border-color: #f87171;
  background: #fef2f2;
}

.level-4 {
  background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%);
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

.level-4:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0 15px 40px rgba(245, 158, 11, 0.4);
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
}

.level-info p {
  margin: 5px 0;
  font-size: 0.9rem;
}

/* Default colors for levels 1-3 */
.level-1 .level-info h3,
.level-2 .level-info h3,
.level-3 .level-info h3,
.level-4 .level-info h3,
.level-5 .level-info h3
{
  color: #333;
}

.level-1 .level-info p,
.level-2 .level-info p,
.level-3 .level-info p {
  color: #666;
}

.instructions {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
}

.instructions h3 {
  margin: 0 0 15px 0;
  color: #333;
}

.instructions p {
  margin: 8px 0;
  color: #555;
  font-size: 0.95rem;
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
}
</style>