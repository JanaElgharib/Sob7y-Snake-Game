
// Direction constants
export const DIRECTIONS = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 }
}

// Opposite directions (to prevent snake from going backwards)
export const OPPOSITE_DIRECTIONS = {
  UP: 'DOWN',
  DOWN: 'UP',
  LEFT: 'RIGHT',
  RIGHT: 'LEFT'
}

/**
 * Generate a random position for food that doesn't overlap with the snake
 * @param {number} gridSize - Size of the grid
 * @param {Array} snake - Current snake positions
 * @returns {Object} - Position object {x, y}
 */
export function generateFood(gridSize, snake, existingFood = []) {
  // Check if grid is full (snake length equals total grid cells)
  const totalCells = gridSize * gridSize
  if (snake.length >= totalCells) {
    return null // Grid is completely filled!
  }

  let position
  let isValidPosition = false
  let attempts = 0
  const maxAttempts = 1000 // Prevent infinite loop

  while (!isValidPosition && attempts < maxAttempts) {
    position = {
      x: Math.floor(Math.random() * gridSize),
      y: Math.floor(Math.random() * gridSize)
    }
    
    // Check if position overlaps with snake
    const overlapsSnake = snake.some(segment => 
      segment.x === position.x && segment.y === position.y
    )

    // Check if position overlaps with existing food
    const overlapsFood = existingFood.some(food => 
      food.x === position.x && food.y === position.y
    )

    isValidPosition = !overlapsSnake && !overlapsFood
    attempts++
  }
  
  return isValidPosition ? position : null
}

/**
 * Move the snake in the current direction
 * @param {Array} snake - Current snake segments
 * @param {Object} direction - Direction object {x, y}
 * @param {boolean} shouldGrow - Whether snake should grow (ate food)
 * @returns {Array} - New snake array
 */
export function moveSnake(snake, direction, shouldGrow = false) {
  const head = snake[0]
  const newHead = {
    x: head.x + direction.x,
    y: head.y + direction.y
  }
    
  // Create new snake with new head
  const newSnake = [newHead, ...snake]
    //Take the new head (newHead) — the new position of the snake's head.
    //Then take all the existing parts of the old snake (...snake -using spread operator).
    //Combine them into a new array.

  
  // If snake shouldn't grow, remove the tail
  if (!shouldGrow) {
    newSnake.pop()
  }
  
  return newSnake
}

/**
 * Check if snake collided with walls
 * @param {Object} head - Snake head position
 * @param {number} gridSize - Size of the grid
 * @returns {boolean} - True if collision detected
 */
export function checkWallCollision(head, gridSize) {
  return head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize
}

/**
 * Check if snake collided with itself
 * @param {Array} snake - Snake segments
 * @returns {boolean} - True if collision detected
 */
export function checkSelfCollision(snake) {
  const head = snake[0]
  // Check if head position matches any body segment
  return snake.slice(1).some(segment => 
    segment.x === head.x && segment.y === head.y
  )
}

/**
 * Check if snake head is at food position
 * @param {Object} head - Snake head position
 * @param {Array} foodArray - Array of food positions
 * @returns {number} - Index of eaten food, or -1 if no collision
 */
export function checkFoodCollision(head, foodArray) {
  return foodArray.findIndex(food => 
    food.x === head.x && food.y === head.y
  )
  //returns -1 if not found
}

/**
 * Calculate score based on level
 * @param {number} level - Current level
 * @returns {number} - Points for eating food
 */
export function calculateFoodPoints(level) {
  return level * 10 // Level 1 = 10, Level 2 = 20, Level 3 = 30
}

//will edit this so level 3 will end at 300 and will make another option level of infinte
/**
 * Get level configuration
 * @param {number} level - Level number (1, 2, or 3)
 * @returns {Object} - Level configuration
 */
export function getLevelConfig(level) {
  const configs = {
    1: {
      snakeLength: 3,
      foodCount: 1,
      speed: 150, // milliseconds per move
      pointsPerFood: 10,
      gridSize: 20,
      pointsToNextLevel: 100,
      hasTimeLimit: false,
      foodLifetime: null,
      isInfiniteMode: false
    },
    2: {
      snakeLength: 5,
      foodCount: 2,
      speed: 100,
      pointsPerFood: 20,
      gridSize: 25,
      pointsToNextLevel: 200,      
      hasTimeLimit: false,
      foodLifetime: null,
      isInfiniteMode: false
    },
    3: {
      snakeLength: 7,
      foodCount: 3,
      speed: 70,
      pointsPerFood: 30,
      gridSize: 30,
      pointsToNextLevel: 300,
      hasTimeLimit: false,
      foodLifetime: null,
      isInfiniteMode: false
    
    },
    4: {
      // Surprise level - timed food + level timer
      snakeLength: 7,
      foodCount: 3,
      speed: 60,  // Slightly faster than level 3
      pointsPerFood: 30,
      gridSize: 30,
      pointsToNextLevel: 300,
      hasTimeLimit: true,  // ← NEW: Level has time limit
      timeLimit: 120,  // ← NEW: 120 seconds (2 minutes) to win
      foodLifetime: 8000,  // ← NEW: Each food disappears after 8 seconds
      isInfiniteMode: false

    },
    5: {
      // Infinite mode - starts easy, gets harder
      snakeLength: 3,
      foodCount: 1,
      speed: 150,  // Starting speed
      pointsPerFood: 10,
      gridSize: 20,
      pointsToNextLevel: Infinity,  // No next level
      isInfiniteMode: true,  // ← NEW FLAG
      speedIncreaseInterval: 100,  // Speed increases every 100 points
      minSpeed: 30,  // Don't go faster than 30ms
      hasTimeLimit: false,
      foodLifetime: null
    }
  }
  
  return configs[level] || configs[1]
}

/**
 * Initialize snake at the center of the grid
 * @param {number} length - Initial snake length
 * @param {number} gridSize - Size of the grid
 * @returns {Array} - Initial snake positions
 */
export function initializeSnake(length, gridSize) {
  const center = Math.floor(gridSize / 2)
  const snake = []
  
  for (let i = 0; i < length; i++) {
    snake.push({
      x: center - i,
      y: center
    })
  }
  
  return snake
}  

/**
 * Get random emoji for food
 * @returns {string} - Food emoji
 */
export function getRandomFoodEmoji() {
  const foodEmojis = ['🍎', '🍌', '🍇', '🍓', '🍊', '🍉', '🍒', '🍑']
  return foodEmojis[Math.floor(Math.random() * foodEmojis.length)]
}