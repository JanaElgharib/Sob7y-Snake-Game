/**
 * Vuex Store Module for Snake Game
 * Manages all game state, mutations, actions, and getters
 */

import {
  generateFood,
  moveSnake,
  checkWallCollision,
  checkSelfCollision,
  checkFoodCollision,
  calculateFoodPoints,
  getLevelConfig,
  initializeSnake,
  DIRECTIONS,
  OPPOSITE_DIRECTIONS,
  getRandomFoodEmoji
} from '@/utils/gameLogic'

const state = {
    // Game Status: 'menu', 'playing', 'levelComplete', 'paused', 'gameOver'
    gameStatus: 'menu',

    // Current level (1, 2, 3, 4, 5)
    currentLevel: 1,

    // Scores
    score: 0,
    highScore: parseInt(localStorage.getItem('snakeHighScore')) || 0,

    // Snake data
    snake: [],
    direction: 'RIGHT',
    nextDirection: 'RIGHT',
    
    // Food data
    food: [],
    foodTimers: [], // Track food timers for surprise level
    
    // Grid configuration
    gridSize: 20,
    speed: 150,
    
    // Game loop interval ID
    gameInterval: null,
    
    // Level configuration
    levelConfig: null,

    // Timer for surprise level
    levelTimer: null,
    timeRemaining: null,
    levelTimerInterval: null,
}

const mutations = {
    /**
     * Initialize game with level configuration
     */
    INIT_GAME(state, level) {
        state.currentLevel = level
        state.levelConfig = getLevelConfig(level)
        state.gridSize = state.levelConfig.gridSize
        state.speed = state.levelConfig.speed
        state.score = 0
        
        // Initialize snake
        state.snake = initializeSnake(
            state.levelConfig.snakeLength,
            state.gridSize
        )
        
        // Initialize food
        state.food = []
        state.foodTimers = []
        
        // For timed food levels, food will be spawned separately
        if (!state.levelConfig.foodLifetime) {
            for (let i = 0; i < state.levelConfig.foodCount; i++) {
                // FIXED: Pass existing food array to prevent overlap
                const newFood = generateFood(state.gridSize, state.snake, state.food)
                if (newFood) {
                    state.food.push({
                        ...newFood,
                        emoji: getRandomFoodEmoji()
                    })
                }
            }
        }

        // Initialize timeRemaining
        if (state.levelConfig.hasTimeLimit) {
            state.timeRemaining = state.levelConfig.timeLimit
        } else {
            state.timeRemaining = null
        }
        
        // Reset direction
        state.direction = 'RIGHT'
        state.nextDirection = 'RIGHT'
    },

    /**
     * Update snake position and handle growth
     */
    UPDATE_SNAKE(state, shouldGrow) {
        state.snake = moveSnake(
            state.snake,
            DIRECTIONS[state.direction],
            shouldGrow
        )
    },
  
    /**
     * Change snake direction (with validation)
     */
    CHANGE_DIRECTION(state, newDirection) {
        // Prevent moving in opposite direction
        if (OPPOSITE_DIRECTIONS[state.direction] !== newDirection) {
            state.nextDirection = newDirection
        }
    },
  
    /**
     * Apply buffered direction change
     */
    APPLY_DIRECTION_CHANGE(state) {
        state.direction = state.nextDirection
    },
    
    /**
     * Handle food consumption
     */
    EAT_FOOD(state, foodIndex) {
        // Remove eaten food
        state.food.splice(foodIndex, 1)
        
        // Add points
        state.score += state.levelConfig.pointsPerFood
        
        // Don't spawn new food if using timed food (handled separately)
        if (!state.levelConfig.foodLifetime) {
            // FIXED: Pass existing food array to prevent overlap
            const newFood = generateFood(state.gridSize, state.snake, state.food)
            if (newFood) {
                state.food.push({ ...newFood, emoji: getRandomFoodEmoji() })
            } else {
                // Grid full — player wins!
                state.food = []
                state.gameStatus = 'levelComplete'
            }
        }
    },
    
    /**
     * Set game status
     */
    SET_GAME_STATUS(state, status) {
        state.gameStatus = status
    },
    
    /**
     * Update high score
     */
    UPDATE_HIGH_SCORE(state) {
        if (state.score > state.highScore) {
            state.highScore = state.score
            localStorage.setItem('snakeHighScore', state.highScore)
        }
    },
    
    /**
     * Advance to next level (called when user chooses to continue)
     */
    ADVANCE_LEVEL(state) {
        if (state.currentLevel < 5) {
            state.currentLevel++
        }
    },
    
    /**
     * Store game interval ID
     */
    SET_GAME_INTERVAL(state, intervalId) {
        state.gameInterval = intervalId
    },
    
    /**
     * Clear game interval
     */
    CLEAR_GAME_INTERVAL(state) {
        if (state.gameInterval) {
            clearInterval(state.gameInterval)
            state.gameInterval = null
        }
    },
    
    /**
     * Reset game to menu
     */
    RESET_TO_MENU(state) {
        state.gameStatus = 'menu'
        state.snake = []
        state.food = []
        state.score = 0
        state.timeRemaining = null
    },

    /**
     * Increase speed for infinite mode
     */
    INCREASE_SPEED(state) {
        if (state.levelConfig.isInfiniteMode && state.speed > state.levelConfig.minSpeed) {
            state.speed = Math.max(state.speed - 5, state.levelConfig.minSpeed)
        }
    },

    /**
     * Start level timer for surprise level
     */
    START_LEVEL_TIMER(state) {
        state.timeRemaining = state.levelConfig.timeLimit
    },

    /**
     * Decrease level timer
     */
    DECREASE_LEVEL_TIMER(state) {
        if (state.timeRemaining > 0) {
            state.timeRemaining--
        }
    },

    /**
     * Clear level timer 
     */
    CLEAR_LEVEL_TIMER(state) {
        if (state.levelTimerInterval) {
            clearInterval(state.levelTimerInterval)
            state.levelTimerInterval = null
        }
        state.timeRemaining = null
    },

    /**
     * Set level timer interval
     */
    SET_LEVEL_TIMER_INTERVAL(state, intervalId) {
        state.levelTimerInterval = intervalId
    },

    /**
     * Add food with timer (for surprise level)
     */
    ADD_TIMED_FOOD(state, foodData) {
        state.food.push(foodData)
    },

    /**
     * Remove specific food by index
     */
    REMOVE_FOOD_BY_INDEX(state, index) {
        if (index >= 0 && index < state.food.length) {
            state.food.splice(index, 1)
        }
    },

    /**
     * Clear all food timers
     */
    CLEAR_FOOD_TIMERS(state) {
        state.foodTimers.forEach(timer => clearTimeout(timer))
        state.foodTimers = []
    },

    /**
     * Add food timer to tracking
     */
    ADD_FOOD_TIMER(state, timerId) {
        state.foodTimers.push(timerId)
    }
}

const actions = {
    /**
     * Start a new game
     */
    startGame({ commit, dispatch, state }, level) {
        // Clear everything first
        commit('CLEAR_GAME_INTERVAL')
        commit('CLEAR_LEVEL_TIMER')
        commit('CLEAR_FOOD_TIMERS')
        
        commit('INIT_GAME', level)
        commit('SET_GAME_STATUS', 'playing')

        // Start level timer if needed (surprise level)
        if (state.levelConfig.hasTimeLimit) {
            dispatch('startLevelTimer')
        }

        // Spawn initial timed food if needed
        if (state.levelConfig.foodLifetime) {
            for (let i = 0; i < state.levelConfig.foodCount; i++) {
                dispatch('spawnTimedFood')
            }
        }

        dispatch('startGameLoop')
    },

    /**
     * Start level timer (for surprise level)
     */
    startLevelTimer({ state, commit, dispatch }) {
        commit('START_LEVEL_TIMER')

        const intervalId = setInterval(() => {
            // Only decrease timer if game is actively playing (not paused)
            if (state.gameStatus === 'playing') {
            commit('DECREASE_LEVEL_TIMER')

            if (state.timeRemaining <= 0) {
                    dispatch('endGame')
                }
            }
        }, 1000) // Every Second

        commit('SET_LEVEL_TIMER_INTERVAL', intervalId)
    },
    
    /**
     * Spawn timed food (for surprise level)
     */
    spawnTimedFood({ state, commit, dispatch }) {
        // FIXED: Pass existing food array to prevent overlap
        const foodData = {
            ...generateFood(state.gridSize, state.snake, state.food),
            emoji: getRandomFoodEmoji(),
            timestamp: Date.now()
        }

        commit('ADD_TIMED_FOOD', foodData)

        // Set timeout to remove this food
        const timer = setTimeout(() => {
            const index = state.food.findIndex(f => f.timestamp === foodData.timestamp)
            if (index !== -1) { // Not eaten - food expired
                commit('REMOVE_FOOD_BY_INDEX', index)
                // Spawn new food to replace it (only if game is still playing)
                if (state.gameStatus === 'playing') {
                    dispatch('spawnTimedFood')
                }
            }
        }, state.levelConfig.foodLifetime)

        commit('ADD_FOOD_TIMER', timer)
    },

    /**
     * Main game loop
     */
    startGameLoop({ state, commit, dispatch }) {
        // Clear any existing interval
        commit('CLEAR_GAME_INTERVAL')
        
        const intervalId = setInterval(() => {
            if (state.gameStatus === 'playing') {
                dispatch('gameStep')
            }
        }, state.speed)
        
        commit('SET_GAME_INTERVAL', intervalId)
    },
    
    /**
     * Single game step (one snake move)
     * FIXED: Check food BEFORE moving, then move once with grow flag
     * This makes snake grow from tail, preventing edge death bug
     */
    gameStep({ state, commit, dispatch }) {
        // Apply buffered direction change
        commit('APPLY_DIRECTION_CHANGE')
        
        const head = state.snake[0]
        
        // STEP 1: Check if current head position is on food (BEFORE moving)
        const foodIndex = checkFoodCollision(head, state.food)
        const willGrow = foodIndex !== -1
        
        // STEP 2: Move snake ONCE (if willGrow=true, tail stays = growth from tail)
        commit('UPDATE_SNAKE', willGrow)
        
        const newHead = state.snake[0]
        
        // STEP 3: Check collisions with NEW head position
        if (checkWallCollision(newHead, state.gridSize)) {
            dispatch('endGame')
            return
        }
        
        if (checkSelfCollision(state.snake)) {
            dispatch('endGame')
            return
        }
        
        // STEP 4: If food was eaten, handle scoring and spawn new food
        if (willGrow) {
            commit('EAT_FOOD', foodIndex)
            
            // Play eat sound
            dispatch('playSound', 'eat')
            
            // Spawn new timed food if needed
            if (state.levelConfig.foodLifetime) {
                dispatch('spawnTimedFood')
            }

            // For infinite mode, increase speed periodically
            if (state.levelConfig.isInfiniteMode) {
                if (state.score % state.levelConfig.speedIncreaseInterval === 0) {
                    commit('INCREASE_SPEED')
                    commit('CLEAR_GAME_INTERVAL')
                    dispatch('startGameLoop')  // Restart with new speed
                }
            }

            // Check if level complete (not for infinite mode)
            if (!state.levelConfig.isInfiniteMode && state.score >= state.levelConfig.pointsToNextLevel) {
                dispatch('completeLevel')
            }
        }
    },
    
    /**
     * Handle direction change from user input
     */
    changeDirection({ commit }, direction) {
        commit('CHANGE_DIRECTION', direction)
    },
    
    /**
     * End the game
     */
    endGame({ state, commit, dispatch }) {
        // Only process if not already in game over state
        if (state.gameStatus === 'gameOver') {
            return
        }
        
        commit('SET_GAME_STATUS', 'gameOver')
        commit('UPDATE_HIGH_SCORE')
        commit('CLEAR_GAME_INTERVAL')
        commit('CLEAR_LEVEL_TIMER')
        commit('CLEAR_FOOD_TIMERS')
        dispatch('playSound', 'gameOver')
    },
    
    /**
     * Complete current level
     */
    completeLevel({ state, commit, dispatch }) {
        commit('CLEAR_GAME_INTERVAL')
        commit('CLEAR_LEVEL_TIMER')
        commit('CLEAR_FOOD_TIMERS')
        commit('SET_GAME_STATUS', 'levelComplete')
        
        // Epic sound for infinite mode, normal sound for others
        if (state.levelConfig.isInfiniteMode) {
            dispatch('playSound', 'epicVictory')
        } else {
            dispatch('playSound', 'levelUp')
        }
        
        commit('UPDATE_HIGH_SCORE')
    },

    /**
     * Continue to next level
     */
    continueToNextLevel({ state, commit, dispatch }) {
        commit('ADVANCE_LEVEL')
        dispatch('startGame', state.currentLevel)
    },
    
    /**
     * Pause/Resume game
     */
    togglePause({ state, commit }) {
        if (state.gameStatus === 'playing') {
            commit('SET_GAME_STATUS', 'paused')
        } else if (state.gameStatus === 'paused') {
            commit('SET_GAME_STATUS', 'playing')
        }
    },
    
    /**
     * Return to menu
     */
    returnToMenu({ commit }) {
        commit('CLEAR_GAME_INTERVAL')
        commit('CLEAR_LEVEL_TIMER')
        commit('CLEAR_FOOD_TIMERS')
        commit('RESET_TO_MENU')
    },
    
    /**
     * Play sound effect
     * @param {string} soundType - Type of sound: 'eat', 'gameOver', 'levelUp', 'epicVictory'
     */
    playSound({ }, soundType) {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)()
            
            // Different sounds for different events
            switch (soundType) {
                case 'eat':
                    {
                        const oscillator = audioContext.createOscillator()
                        const gainNode = audioContext.createGain()
                        
                        oscillator.connect(gainNode)
                        gainNode.connect(audioContext.destination)
                        
                        oscillator.frequency.value = 800
                        gainNode.gain.value = 0.1
                        oscillator.start()
                        oscillator.stop(audioContext.currentTime + 0.1)
                    }
                    break
                    
                case 'gameOver':
                    {
                        const oscillator = audioContext.createOscillator()
                        const gainNode = audioContext.createGain()
                        
                        oscillator.connect(gainNode)
                        gainNode.connect(audioContext.destination)
                        
                        oscillator.frequency.value = 300
                        gainNode.gain.value = 0.2
                        oscillator.start()
                        oscillator.stop(audioContext.currentTime + 0.3)
                    }
                    break
                    
                case 'levelUp':
                    {
                        const oscillator = audioContext.createOscillator()
                        const gainNode = audioContext.createGain()
                        
                        oscillator.connect(gainNode)
                        gainNode.connect(audioContext.destination)
                        
                        oscillator.frequency.value = 1200
                        gainNode.gain.value = 0.15
                        oscillator.start()
                        oscillator.stop(audioContext.currentTime + 0.2)
                    }
                    break
                    
                case 'epicVictory':
                    {
                        // Epic victory fanfare - multiple notes
                        const notes = [523, 659, 784, 1047] // C, E, G, C (triumphant chord)
                        notes.forEach((freq, index) => {
                            const osc = audioContext.createOscillator()
                            const gain = audioContext.createGain()
                            
                            osc.connect(gain)
                            gain.connect(audioContext.destination)
                            
                            osc.frequency.value = freq
                            gain.gain.setValueAtTime(0.15, audioContext.currentTime)
                            gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8)
                            
                            osc.start(audioContext.currentTime + index * 0.1)
                            osc.stop(audioContext.currentTime + 0.8)
                        })
                        
                        // Add a second chord for more power
                        setTimeout(() => {
                            const secondChord = [659, 784, 988, 1319] // E, G, B, E
                            secondChord.forEach((freq, index) => {
                                const osc2 = audioContext.createOscillator()
                                const gain2 = audioContext.createGain()
                                
                                osc2.connect(gain2)
                                gain2.connect(audioContext.destination)
                                
                                osc2.frequency.value = freq
                                gain2.gain.setValueAtTime(0.2, audioContext.currentTime)
                                gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1.2)
                                
                                osc2.start(audioContext.currentTime + index * 0.08)
                                osc2.stop(audioContext.currentTime + 1.2)
                            })
                        }, 400)
                    }
                    break
            }
        } catch (error) {
            console.error('Audio playback error:', error)
        }
    }
}

const getters = {
    // Check if game is active
    isGameActive: state => state.gameStatus === 'playing',
    
    // Check if game is paused
    isGamePaused: state => state.gameStatus === 'paused',
    
    // Check if game is over
    isGameOver: state => state.gameStatus === 'gameOver',
    
    // Check if in menu
    isInMenu: state => state.gameStatus === 'menu',
    
    // Check if level is complete
    isLevelComplete: state => state.gameStatus === 'levelComplete',

    // Check if current level is infinite mode
    isInfiniteMode: state => state.levelConfig?.isInfiniteMode || false,

    // Check if level has timer
    hasTimeLimit: state => state.levelConfig?.hasTimeLimit || false,
  
    // Check if there's a next level
    hasNextLevel: state => state.currentLevel < 5,
    
    // Get snake head
    snakeHead: state => state.snake[0] || null,
    
    // Get snake length
    snakeLength: state => state.snake.length,
    
    // Progress to next level (percentage)
    levelProgress: state => {
        if (!state.levelConfig) return 0
        return Math.min(
            (state.score / state.levelConfig.pointsToNextLevel) * 100,
            100
        )
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}