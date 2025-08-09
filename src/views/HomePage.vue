<template>
  <div class="main" v-loading="isLoading" element-loading-text="正在加载...">
    <Header />
    <CottonMap />
    <MonitorInformationPanel />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElLoading, ElMessage } from 'element-plus'
import commonApi from '@/request/api'
import { useDataSourceStore } from '@/stores/dataSource'

import Header from './common/header/Header.vue'
import CottonMap from './fence/cottonMap/CottonMap.vue'
import MonitorInformationPanel from './monitor/MonitorInformationPanel.vue'

const dataStore = useDataSourceStore()
const isLoading = ref(true)

const requestData = async () => {
  Promise.all([
    commonApi.getPickerState(),
    commonApi.getTotalHarvest(),
    commonApi.getAreaList(),
    commonApi.getPickerMonitor({
      pageNum: 1,
      pageSize: 999,
    }),
    commonApi.getPickerLiveData({
      pageNum: 1,
      pageSize: 999,
    }),
  ])
    .then((res) => {
      const [pickerStateRes, totalHarvestRes, areaListRes, pickerMonitorRes, pickerLiveDataRes] =
        res

      // 批量更新store数据
      dataStore.batchUpdate({
        cottonPickerStatus: pickerStateRes?.data,
        harvestingProgress: totalHarvestRes?.data,
        collectionArea: areaListRes?.data,
        cottonPickerMonitor: pickerMonitorRes?.pageInfo?.list,
        cottonPickerRealtime: pickerLiveDataRes?.pageInfo?.list,
        factoryRealtime: [
          { id: 1620, factoryName: '塔里木加工厂1', count: 47 },
          { id: 1621, factoryName: '铁门关加工厂2', count: 32 },
          { id: 1623, factoryName: '塔里木加工厂3', count: 18 },
          { id: 1624, factoryName: '铁门关加工厂4', count: 56 },
          { id: 1625, factoryName: '铁门关加工厂5', count: 24 },
          { id: 1626, factoryName: '塔里木加工厂6', count: 39 },
          { id: 1627, factoryName: '塔里木加工厂7', count: 12 },
        ],
      })
      isLoading.value = false
    })
    .catch((error) => {
      isLoading.value = false
      console.error('请求失败:', error)
      ElMessage.error('数据加载失败，请稍后重试')
    })
}

onMounted(() => {
  requestData()
})
</script>

<style scoped>
.main {
  width: 100vw;
  height: 100vh;
  min-width: 0;
}
</style>
