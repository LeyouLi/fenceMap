import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }

  return { count, doubleCount, increment }
})

export const useMapStore = defineStore('map', {
  state: () => ({
    mapOptions: {
      center: [116.3972, 39.9075], // 初始中心点（北京经纬度）
      zoom: 10, // 初始缩放级别
      style: 'mapbox://styles/mapbox/light-v10', // 地图样式
      attributionControl: false, // 是否显示 attribution 控件
    },
  }),
})

export const useRegionalPlotSearchStore = defineStore('regionalPlotSearch', () => {
  const isVisible = ref(false)
  const setVisibleState = (flag) => {
    isVisible.value = flag
  }

  return { isVisible, setVisibleState }
})
