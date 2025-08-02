<template>
  <div class="factoryOverview-container">
    <div class="title">塔里木加工厂</div>
    <div class="cotton-today">
      <span>今日接受棉包数量</span>
      <span>{{ dataSource.cottonNum }}</span>
    </div>
    <div class="cotton-total">
      <span>总计接受棉包数量数</span>
      <span>{{ dataSource.cottonTotalNum }}</span>
    </div>
    <div class="area-cotton-title">各大区接受棉包数量</div>
    <div class="area-cotton-list">
      <ul class="table-header">
        <li>
          <span>大区名称</span>
          <span>接受棉卷数</span>
        </li>
      </ul>
      <ul class="table-body">
        <li
          v-for="(item, index) in dataSource.cottonNumForArea"
          :key="index"
          :class="{ 'highlight-row': highlightIndex === index }"
          @click="highlightIndex = index"
        >
          <span>{{ item.area }}</span>
          <span>{{ item.count }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  dataSource: Object,
})

const highlightIndex = ref(1) // 高亮行索引
</script>

<style scoped>
.factoryOverview-container {
  display: inline-block;
  padding: 28px;
  background: rgba(17, 17, 17, 0.5);
  border-radius: 10px;
  border: 4px solid rgba(255, 255, 255, 0.75);
  color: #ffffff;
  font-size: 16px;
  font-family: Source Han Sans SC;
}

.title {
  font-size: 20px;
  font-weight: bold;
}

.cotton-today,
.cotton-total {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-left: 20px;
  span {
    display: inline-block;
    line-height: 1;
    font-weight: bold;
  }
  span:last-child {
    font-weight: 400;
    font-size: 48px;
    color: #f88e1c;
    margin-left: 44px;
  }
}

.cotton-total {
  margin-top: 14px;
}

.area-cotton-title {
  font-size: 18px;
  line-height: 1;
  font-weight: bold;
  margin-top: 30px;
}

.area-cotton-list {
  display: flex;
  flex-direction: column;
  margin-top: 15px;
  width: 100%;
}

.table-header,
.table-body {
  margin: 0;
  padding: 0;
  list-style: none;
}

.table-body {
  max-height: 100px;
  overflow-y: auto;
}

.table-header li,
.table-body li {
  display: flex;
  padding: 4px 0;
  cursor: pointer;
  font-weight: bold;
  font-size: 14px;
  color: #ffffff;
}

.table-header li span,
.table-body li span {
  flex: 1;
  text-align: center;
  font-weight: bold;
}

.table-header li {
  position: sticky;
  top: 0;
  z-index: 1;
}

.highlight-row {
  color: #f88e1c !important;
}

.table-body::-webkit-scrollbar {
  width: 6px;
}

.table-body::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.table-body::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}
</style>
