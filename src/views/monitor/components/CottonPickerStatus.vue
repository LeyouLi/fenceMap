<template>
  <div class="cottonPickerStatus-container">
    <div class="title">采棉机状态</div>
    <ul>
      <li>
        <span>
          <span class="quota">{{ cottonPickerStatusData?.working || 0 }}</span>
          <span>台</span>
        </span>
        <span>在线</span>
      </li>
      <li>
        <span>
          <span class="quota">{{ cottonPickerStatusData?.waiting || 0 }}</span>
          <span>台</span>
        </span>
        <span>离线</span>
      </li>
      <li>
        <span>
          <span class="quota">{{ cottonPickerStatusData?.total || 0 }}</span>
          <span>台</span>
        </span>
        <span>总数</span>
      </li>
    </ul>
  </div>
</template>
<script setup>
import { storeToRefs } from 'pinia'
import { useDataSourceStore } from '@/stores/dataSource'

const dataStore = useDataSourceStore()
const { cottonPickerStatusData } = storeToRefs(dataStore)
</script>
<style scoped>
.cottonPickerStatus-container {
  background: rgba(5, 7, 34, 0.5);
  border-radius: 10px;
  border: 4px solid rgba(255, 255, 255, 0.75);
  display: inline-block;
  width: fit-content;
  width: 450px;
  padding: 14px 24px;
  pointer-events: auto;
}

.title {
  font-weight: bold;
  font-size: 20px;
  color: #ffffff;
}

ul {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 15px;

  li {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    align-items: center;
    font-weight: bold;
    font-size: 18px;

    .quota {
      font-weight: normal;
      font-size: 40px;
      color: rgba(242, 209, 52, 1);
      font-family: 'MVBOLI', sans-serif;
    }
  }
}
</style>
