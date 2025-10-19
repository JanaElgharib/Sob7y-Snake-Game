/**
 * Main Vuex Store
 * Combines all modules and exports the store instance
 */
 import { createStore } from 'vuex'
 import game from './modules/game'

 export default createStore({
    modules: {
        game
    }
 })