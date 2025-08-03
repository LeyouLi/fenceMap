<template>
  <div class="harvestingProgress-container">
    <div class="title">采收进度</div>
    <ul>
      <li>
        <span>总卷数</span>
        <span class="quota">{{ harvestingProgressData?.totalBale || '--' }}</span>
      </li>
      <li>
        <span>已采收亩数</span>
        <span>{{ harvestingProgressData?.harvested || '--' }}</span>
      </li>
      <li>
        <span>待采收亩数</span>
        <span>{{ harvestingProgressData?.waitHarvest || '--' }}</span>
      </li>
    </ul>
  </div>
</template>
<script setup>
import { storeToRefs } from 'pinia'
import { useDataSourceStore } from '@/stores/dataSource'

const dataStore = useDataSourceStore()
const { harvestingProgressData } = storeToRefs(dataStore)
</script>
<style scoped>
.harvestingProgress-container {
  background: rgba(5, 7, 34, 0.5);
  border-radius: 10px;
  border: 4px solid rgba(255, 255, 255, 0.75);
  display: inline-block;
  width: fit-content;
  padding: 14px 24px;
  margin-right: 30px;
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  pointer-events: auto;
}

.title {
  font-weight: bold;
  font-size: 20px;
  color: #ffffff;
}

ul {
  padding: 0 5px;
  flex: 1;
  display: inline-grid;
  justify-content: flex-start;
  flex-direction: column;
  li {
    font-weight: bold;
    font-size: 16px;

    span:first-child {
      margin-right: 30px;
    }

    .quota {
      font-weight: normal;
      font-size: 40px;
      color: rgba(242, 209, 52, 1);
      font-family: 'MVBOLI', sans-serif;
    }
  }
}
</style>
