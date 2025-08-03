<template>
  <div class="collectionArea-container" @click="handleShowRegionalPlotSearch">
    <div class="title">采集区域</div>
    <div class="table-wrapper">
      <!-- 固定表头 -->
      <div class="header">
        <span class="label">区域</span>
        <span class="value">已采收卷数</span>
      </div>
      <!-- 滚动数据列表 -->
      <div class="scroll-body">
        <ul>
          <li v-for="(item, index) in collectionAreaData" :key="index">
            <span class="label">{{ item.name || '--' }}</span>
            <span class="value">{{ item.collectedNum }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useRegionalPlotSearchStore } from '@/stores/counter'
import { useDataSourceStore } from '@/stores/dataSource'

const userStore = useRegionalPlotSearchStore()
const dataStore = useDataSourceStore()
const { collectionAreaData } = storeToRefs(dataStore)
const handleShowRegionalPlotSearch = () => {
  userStore.setVisibleState(true)
}
</script>

<style scoped>
.collectionArea-container {
  background: rgba(5, 7, 34, 0.5);
  border-radius: 10px;
  border: 4px solid rgba(255, 255, 255, 0.75);
  display: inline-block;
  width: fit-content;
  padding: 14px 24px;
  max-height: 200px;
  pointer-events: auto;
  cursor: pointer;
}

.title {
  font-weight: bold;
  font-size: 20px;
  color: #ffffff;
}

.table-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.header {
  display: grid;
  grid-template-columns: 1fr 1fr;
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
  max-height: 100px;
  overflow-y: auto;
  flex-grow: 1;
}

.scroll-body ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
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
