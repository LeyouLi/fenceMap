import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useDataSourceStore = defineStore('dataSource', () => {
  // 状态定义
  const cottonPickerStatusData = ref({})
  const harvestingProgressData = ref({})
  const collectionAreaData = ref({})
  const cottonPickerMonitorData = ref([])
  const cottonPickerRealtimeData = ref([])
  const factoryRealtimeData = ref({})
  const collectionAreaSelectedData = ref({})
  // 统一的数据更新方法
  const updateData = (dataRef, data) => {
    dataRef.value = data
  }

  // 批量更新方法
  const batchUpdate = (payload) => {
    if (payload.cottonPickerStatus) updateData(cottonPickerStatusData, payload.cottonPickerStatus)
    if (payload.harvestingProgress) updateData(harvestingProgressData, payload.harvestingProgress)
    if (payload.collectionArea) updateData(collectionAreaData, payload.collectionArea)
    if (payload.cottonPickerMonitor)
      updateData(cottonPickerMonitorData, payload.cottonPickerMonitor)
    if (payload.cottonPickerRealtime)
      updateData(cottonPickerRealtimeData, payload.cottonPickerRealtime)
    if (payload.factoryRealtime) updateData(factoryRealtimeData, payload.factoryRealtime)
    if (payload.collectionAreaSelected)
      updateData(collectionAreaSelectedData, payload.collectionAreaSelected)
  }

  // 数据重置方法
  const resetData = () => {
    cottonPickerStatusData.value = {}
    harvestingProgressData.value = {}
    collectionAreaData.value = {}
    cottonPickerMonitorData.value = []
    cottonPickerRealtimeData.value = []
    factoryRealtimeData.value = {}
  }

  const resetCollectionAreaSelectedData = () => {
    collectionAreaSelectedData.value = {}
  }

  return {
    // 状态
    cottonPickerStatusData,
    harvestingProgressData,
    collectionAreaData,
    cottonPickerMonitorData,
    cottonPickerRealtimeData,
    factoryRealtimeData,
    collectionAreaSelectedData,

    // 方法
    batchUpdate,
    resetData,
    resetCollectionAreaSelectedData,
  }
})
