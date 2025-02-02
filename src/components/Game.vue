<script setup lang="ts">
import Game from '@/game-logic/classes'
import GameView from './GameView';
import CodeManager from './CodeManager.vue';
import { defineComponent, ref } from 'vue';

const props = defineProps<{ game: Game }>()

defineComponent({
  components: {
    CodeManager,
  },
})

const gameView = new GameView([...props.game.field.field])

const run = (code: string) => {
  props.game.execute(code)
  gameView.updateMap(props.game.field.field, props.game.field.playerPosition)
  
}
</script>

<template>
  <CodeManager :run="run" />
</template>

<style scoped>
/* Add your styles here */
</style>
