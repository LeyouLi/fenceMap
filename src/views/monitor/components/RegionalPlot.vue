<template>
  <div
    v-show="isVisible"
    class="regionalPlot-container"
    @mouseenter="clearTimeoutOnMouseEnter"
    @mouseleave="startTimeoutOnMouseLeave"
  >
    <div class="title">地块选择</div>
    <div class="select-box">
      <el-select v-model="value" class="m-2" placeholder="Select" style="width: 300px">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-select
        v-model="value"
        class="m-2"
        placeholder="Select"
        style="width: 300px; margin: 14px 0"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
    <div class="button">跳&nbsp;&nbsp;&nbsp;&nbsp;转</div>
  </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRegionalPlotSearchStore } from '@/stores/counter'

const userStore = useRegionalPlotSearchStore()
const { isVisible } = storeToRefs(userStore)
const value = ref('')

const options = [
  {
    value: 'Option1',
    label: 'Option1',
  },
  {
    value: 'Option2',
    label: 'Option2',
  },
  {
    value: 'Option3',
    label: 'Option3',
  },
  {
    value: 'Option4',
    label: 'Option4',
  },
  {
    value: 'Option5',
    label: 'Option5',
  },
]

// 设置定时器，在指定时间后隐藏组件
const hideTimeout = ref(null)
const HIDE_TIME = 5000 // 指定时间，单位为毫秒，这里设置为5秒

// 清除定时器
const clearTimeoutOnMouseEnter = () => {
  if (hideTimeout.value) {
    clearTimeout(hideTimeout.value)
    hideTimeout.value = null
  }
}

// 启动定时器
const startTimeoutOnMouseLeave = () => {
  if (!hideTimeout.value) {
    hideTimeout.value = setTimeout(() => {
      isVisible.value = false
      userStore.setVisibleState(false)
      clearTimeout(hideTimeout.value)
      hideTimeout.value = null
    }, HIDE_TIME)
  }
}
watch(
  () => isVisible.value,
  (newVal) => {
    if (newVal) {
      startTimeoutOnMouseLeave()
    }
  },
)

onMounted(() => {
  if (isVisible.value) {
    startTimeoutOnMouseLeave()
  }
})

onUnmounted(() => {
  if (hideTimeout.value) {
    clearTimeout(hideTimeout.value)
  }
})
</script>
<style scoped>
.regionalPlot-container {
  background: rgba(5, 7, 34, 0.5);
  border-radius: 10px;
  border: 4px solid rgba(255, 255, 255, 0.75);
  width: fit-content;
  padding: 14px 24px;
  pointer-events: auto;
  position: absolute;
  right: 40px;
  top: 186px;

  display: flex;
  flex-direction: column;
  align-items: center;
}

.title {
  width: 100%;
  font-weight: bold;
  font-size: 18px;
  color: #ffffff;
  margin-bottom: 10px;
}

.select-box {
  display: flex;
  flex-direction: column;
}

.button {
  padding: 6px 60px;
  background: #ffffff;
  border-radius: 30px;
  border: 2px solid #483f38;
  font-weight: bold;
  font-size: 14px;
  color: #483f38;
  text-align: center;
  margin: 0 auto;
  cursor: pointer;

  &:hover {
    color: #9b4608;
    border: 2px solid #90450e;
  }
}
</style>
