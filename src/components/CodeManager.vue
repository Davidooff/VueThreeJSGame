<script setup lang="ts">
import { defineComponent, defineProps, ref } from 'vue';
import { Codemirror } from 'vue-codemirror';

defineComponent({
  components: {
    Codemirror,
  },
});
const props = defineProps<{ run: (code: string) => void }>()
let interval;
const intervalFun = () => {
  return setInterval(() => {
    props.run(codeRef.value)
  }, 1000)
}

const codeRef = ref<string>("")
const isRunning = ref(false)

const run = () => {
  isRunning.value = !isRunning.value
  if (isRunning.value) {
    interval = intervalFun()
  } else {
    interval && clearInterval(interval)
  }
}

const setContent = (content: string) => {
  codeRef.value = content
}
</script>

<template>
  <div class="code-manager">
    <Codemirror @change="setContent" />
    <button @click="run">
        <span v-if="isRunning">Stop</span>
        <span v-else>Run</span>
    </button>
  </div>
</template>

<style scoped>
  .code-manager {
    position: relative;
    width: 50vw;
    height: 100vh;
  }

  .code-manager button {
    position: absolute;
    top: 0;
    right: 0;
    width: 100px;
    height: 50px;
    background-color: #f00;
    color: #fff;
    font-size: 20px;
  }
</style>