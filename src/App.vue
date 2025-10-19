<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import GameMenu from './components/GameMenu.vue'
import GameBoard from './components/GameBoard.vue'
import LevelComplete from './components/LevelComplete.vue'
import GameOver from './components/GameOver.vue'

const store = useStore()

// Computed properties for game status
const isInMenu = computed(() => store.getters['game/isInMenu'])
const isGameActive = computed(() => store.getters['game/isGameActive'])
const isGamePaused = computed(() => store.getters['game/isGamePaused'])
const isLevelComplete = computed(() => store.getters['game/isLevelComplete'])
const isGameOver = computed(() => store.getters['game/isGameOver'])

</script>

<template>
  <div id="app">
    <!-- Show appropriate component based on game status -->
    <GameMenu v-if="isInMenu" />
    <GameBoard v-else-if="isGameActive || isGamePaused" />
    <LevelComplete v-else-if="isLevelComplete" />
    <GameOver v-else-if="isGameOver" />
  </div>
</template>

<style>
/* Global styles remain the same */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: 0;
  padding: 0;
}

#app {
  background: #000000;
  width: 100%;
  min-height: 100vh;
}

button {
  font-family: inherit;
}
</style>


