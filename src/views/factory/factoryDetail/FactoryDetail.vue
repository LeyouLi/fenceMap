<template>
  <div class="factory-container">
    <!-- 背景图层 -->
    <div class="factory-bg">
      <img :src="bgImage" alt="factory background" class="bg-image" />
    </div>

    <div class="factory-box">
      <div class="detail-top">
        <FactoryOverview :dataSource="factoryOverviewData" />
      </div>
      <div class="detail-bottom">
        <CottonAreaChart :dataSource="cottonAreaChartData" />
        <CottonAreaDetails :dataSource="cottonAreaDetailsData" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import FactoryOverview from './components/FactoryOverview.vue'
import CottonAreaChart from './components/CottonAreaChart.vue'
import CottonAreaDetails from './components/CottonAreaDetails.vue'

const bgImage = new URL('@/assets/factory_bg.jpg', import.meta.url).href

const factoryOverviewData = ref({
  cottonNum: 50,
  cottonTotalNum: 2150,
  cottonNumForArea: [
    {
      area: '4号片区',
      count: 18,
    },
    {
      area: '6号片区',
      count: 13,
    },
    {
      area: '8号片区',
      count: 67,
    },
  ],
})

const cottonAreaChartData = ref({
  areas: ['4-1-2', '4-3-2', '4-2-5', '4-3-6', '4-3-2', '4-1-2', '4-2-5', '4-3-2'],
  counts: [4, 8, 6, 6, 8, 4, 6, 8],
})

const cottonAreaDetailsData = ref({
  areaName: '4号片区',
  list: [
    {
      id: 123123,
      plotName: '4-03-6-张三-塔里木乡',
      time: '2024-10-28 17:13:00',
    },
    {
      id: 123123,
      plotName: '4-03-6-张三-塔里木乡',
      time: '2024-10-28 17:13:00',
    },
    {
      id: 123123,
      plotName: '4-03-6-张三-塔里木乡',
      time: '2024-10-28 17:13:00',
    },
    {
      id: 123123,
      plotName: '4-03-6-张三-塔里木乡',
      time: '2024-10-28 17:13:00',
    },
    {
      id: 123123,
      plotName: '4-03-6-张三-塔里木乡',
      time: '2024-10-28 17:13:00',
    },
    {
      id: 123123,
      plotName: '4-03-6-张三-塔里木乡',
      time: '2024-10-28 17:13:00',
    },
    {
      id: 123123,
      plotName: '4-03-6-张三-塔里木乡',
      time: '2024-10-28 17:13:00',
    },
    {
      id: 123123,
      plotName: '4-03-6-张三-塔里木乡',
      time: '2024-10-28 17:13:00',
    },
    {
      id: 123123,
      plotName: '4-03-6-张三-塔里木乡',
      time: '2024-10-28 17:13:00',
    },
    {
      id: 123123,
      plotName: '4-03-6-张三-塔里木乡',
      time: '2024-10-28 17:13:00',
    },
  ],
})
</script>

<style scoped>
.factory-container {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.factory-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.bg-image {
  width: 100%;
  height: 100%;
  /* object-fit: cover; */
}

.factory-box {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 76px 55px;
  z-index: 2;

  display: flex;
  justify-content: space-between;
  flex-direction: column;

  .detail-bottom {
    display: flex;
    justify-content: flex-start;
  }
}
</style>
