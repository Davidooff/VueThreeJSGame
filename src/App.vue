<script setup lang="ts">
import { ref, type Ref } from 'vue'
import GameComponent from './components/Game.vue'
import Game from './game-logic/classes'
import { clearSave } from './game-logic/game-data/data/clear-save'

let isStarted = ref(false)
let game: Game | null = null

function startGame(isNewGame: boolean) {
  const save = localStorage.getItem('save')
  if (save && !isNewGame) {
    try {
      game = new Game(JSON.parse(save))
    } catch (e) {
      console.error('Unnable to load save, creating a new one ERROR: \n', e)
      game = new Game(clearSave)
    }
  } else {
    game = new Game(clearSave)
  }

  if (game) {
    isStarted.value = true
  }
}
</script>

<template>
  <main>
    <div v-if="isStarted">
      <GameComponent :game="(game as Game)" />
    </div>
    <div v-else>
      <button @click="startGame(false)">Continue</button>
      <button @click="startGame(true)">New Game</button>
    </div>
  </main>
</template>

<style></style>
