<script setup>
import { onMounted, ref, onUnmounted } from 'vue'
import Header from './common/header/Header.vue'
import CottonMap from './fence/cottonMap/CottonMap.vue'
</script>

<template>
  <div class="main">
    <Header />
    <CottonMap />
  </div>
</template>

<style scoped>
.main {
  width: 100vw;
  height: 100vh;
  min-width: 0;
}
</style>
