<template>
  <div
    v-show="isVisible"
    class="regionalPlot-container"
    @mouseenter="clearTimeoutOnMouseEnter"
    @mouseleave="startTimeoutOnMouseLeave"
  >
    <div class="title">地块选择</div>
    <div class="select-box">
      <el-select
        v-model="collectionAreaVal"
        class="m-2"
        placeholder="请选择采集区域"
        style="width: 300px"
      >
        <el-option
          v-for="item in collectionAreaList"
          :key="item.objId"
          :label="item.name"
          :value="item.objId"
        />
      </el-select>
      <el-select
        v-model="collectionAreaPlotVal"
        :disabled="!collectionAreaVal || !collectionAreaPlotList.length"
        placeholder="请选择地块"
        style="width: 300px; margin: 14px 0"
      >
        <el-option
          v-for="item in collectionAreaPlotList"
          :key="item.objId"
          :label="item.name"
          :value="item.objId"
        />
      </el-select>
    </div>
    <el-button
      color="#9b4608"
      round
      plain
      :disabled="!collectionAreaPlotVal"
      style="padding: 0 50px"
      >跳&nbsp;&nbsp;&nbsp;&nbsp;转</el-button
    >
  </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import commonApi from '@/request/api'
import { storeToRefs } from 'pinia'
import { useRegionalPlotSearchStore } from '@/stores/counter'
import { useDataSourceStore } from '@/stores/dataSource'

const userStore = useRegionalPlotSearchStore()
const dataStore = useDataSourceStore()
const { isVisible } = storeToRefs(userStore)
const { collectionAreaData } = storeToRefs(dataStore)
const collectionAreaVal = ref('')
const collectionAreaPlotVal = ref('')
const collectionAreaList = ref([])
const collectionAreaPlotList = ref([])

const hideTimeout = ref(null)
const HIDE_TIME = 5000

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
      collectionAreaVal.value = ''
      collectionAreaPlotVal.value = ''
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

watch(
  () => collectionAreaData.value,
  (newVal) => {
    if (newVal) {
      collectionAreaList.value = newVal
    }
  },
  {
    immediate: true,
    flush: 'post',
  },
)

const requestAreaPlotList = async (areaId) => {
  const { code, data } = await commonApi.getFenceList({ areaId })
  if (code === 200) {
    collectionAreaPlotList.value = data
  }
}

watch(
  () => collectionAreaVal.value,
  (newVal) => {
    if (newVal) {
      collectionAreaPlotVal.value = ''
      collectionAreaPlotList.value = []
      requestAreaPlotList(newVal)
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
</style>
