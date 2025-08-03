<template>
  <div class="monitorInformationPanel-container">
    <CottonPickerStatus />
    <div class="flex-start mtb30">
      <HarvestingProgress />
      <CollectionArea />
    </div>
    <div class="flex-space-between">
      <CottonPickerMonitor />
      <CottonPickerRealtimeData />
      <FactoryRealtimeDate />
    </div>
    <RegionalPlot />
  </div>
</template>
<script setup>
import CottonPickerStatus from './components/CottonPickerStatus.vue'
import HarvestingProgress from './components/HarvestingProgress.vue'
import CollectionArea from './components/CollectionArea.vue'
import CottonPickerMonitor from './components/CottonPickerMonitor.vue'
import CottonPickerRealtimeData from './components/CottonPickerRealtimeData.vue'
import FactoryRealtimeDate from './components/FactoryRealtimeDate.vue'
import RegionalPlot from './components/RegionalPlot.vue'
</script>
<style scoped>
.monitorInformationPanel-container {
  position: absolute;
  left: 0;
  top: 150px;
  width: 100%;
  height: calc(100% - 150px);
  z-index: 4;
  padding: 0 40px 80px 40px;
  color: #fff;

  display: flex;
  justify-content: flex-start;
  flex-direction: column;

  pointer-events: none;
}

.flex-start {
  display: flex;
  justify-content: flex-start;
}

.mtb30 {
  margin: 30px 0;
}

.flex-space-between {
  display: flex;
  justify-content: space-between;
  flex: 1;
}
</style>
