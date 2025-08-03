<template>
  <div class="cottonPickerMonitor-container">
    <div class="title">采棉机监控</div>
    <div class="table-wrapper" ref="parentContainer">
      <!-- 固定表头 -->
      <div class="header">
        <span class="label">设备编号</span>
        <span class="value">型号</span>
        <span class="value">今日采摘</span>
        <span class="value">总采摘</span>
        <span class="value">在线/离线</span>
      </div>
      <!-- 滚动数据列表 -->
      <div class="scroll-body" ref="scrollBody">
        <ul>
          <li v-for="(item, index) in dataSource" :key="index">
            <span class="label">{{ item.carNo || '--' }}</span>
            <span class="value">{{ item.carBrand || '--' }}</span>
            <span class="value">{{ item.today || '--' }}</span>
            <span class="value">{{ item.total || '--' }}</span>
            <span class="value">{{ item.state ? '在线' : '离线' }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useDataSourceStore } from '@/stores/dataSource'

const dataStore = useDataSourceStore()
const parentContainer = ref(null)
const scrollBody = ref(null)
const dataSource = ref()
const { cottonPickerMonitorData } = storeToRefs(dataStore)
const initScrollBody = () => {
  const parentHeight = parentContainer.value.offsetHeight
  const headerHeight = 40
  scrollBody.value.style.height = `${parentHeight - headerHeight}px`
  dataSource.value = cottonPickerMonitorData.value
}

watch(
  () => cottonPickerMonitorData.value,
  (newVal) => {
    if (newVal?.length) {
      dataSource.value = newVal
    }
  },
)

onMounted(() => {
  initScrollBody()
})
</script>

<style scoped>
.cottonPickerMonitor-container {
  background: rgba(5, 7, 34, 0.5);
  border-radius: 10px;
  border: 4px solid rgba(255, 255, 255, 0.75);
  display: inline-block;
  width: fit-content;
  padding: 14px 24px;
  flex: 1;
  pointer-events: auto;
}

.title {
  font-weight: bold;
  font-size: 20px;
  color: #ffffff;
}

.table-wrapper {
  width: 100%;
  height: calc(100% - 30px);
  display: flex;
  flex-direction: column;
}

.header {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  padding: 6px 0;
  z-index: 10;
  position: sticky;
  top: 0;
}

.header .label,
.header .value {
  text-align: center;
  font-weight: bold;
  color: white;
}

.scroll-body {
  overflow-y: auto;
  flex-grow: 1;
}

.scroll-body ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
}

.scroll-body li {
  display: contents;
}

.scroll-body .label,
.scroll-body .value {
  text-align: center;
  word-break: break-all;
  white-space: normal;
  /* padding: 4px 0; */
}

/* 滚动条样式 */
.scroll-body::-webkit-scrollbar {
  width: 6px;
  display: none;
}
.scroll-body::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}
</style>
