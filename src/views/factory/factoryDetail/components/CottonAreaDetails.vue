<template>
  <div class="cottonAreaDetails-container">
    <div class="area-cotton-title">{{ dataSource.areaName }}棉包数据</div>
    <div class="area-cotton-list">
      <ul class="table-header">
        <li ref="headerRow">
          <span v-for="(col, idx) in columns" :key="idx">
            {{ col.title }}
          </span>
        </li>
      </ul>
      <ul class="table-body">
        <li
          v-for="(item, index) in dataSource.list"
          :key="index"
          :class="{ 'highlight-row': highlightIndex === index }"
          @click="highlightIndex = index"
        >
          <span v-for="(col, idx) in columns" :key="idx">
            {{ item[col.key] }}
          </span>
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

const highlightIndex = ref(1)
const columns = [
  { key: 'id', title: '棉卷编码' },
  { key: 'plotName', title: '生成地块' },
  { key: 'time', title: '成卷时间' },
]
</script>

<style scoped>
.cottonAreaDetails-container {
  min-width: 500px;
  display: inline-block;
  padding: 28px;
  background: rgba(17, 17, 17, 0.5);
  border-radius: 10px;
  border: 4px solid rgba(255, 255, 255, 0.75);
  color: #ffffff;
  font-size: 16px;
  font-family: Source Han Sans SC;
}

.area-cotton-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
}

.area-cotton-list {
  display: grid;
  grid-template-rows: auto 1fr;
  width: 100%;
  font-size: 14px;
  font-weight: bold;
}

.table-header,
.table-body {
  margin: 0;
  padding: 0;
  list-style: none;
}

.table-header li,
.table-body li {
  display: flex;
  padding: 8px 0;
}

.table-header li {
  position: sticky;
  top: 0;
  z-index: 2;
  font-weight: bold;
}

.table-header li span,
.table-body li span {
  flex: 1;
  text-align: center;
  white-space: nowrap;

  white-space: normal;
  word-break: break-word;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  &:nth-child(2) {
    padding: 0 10px;
  }
}

.highlight-row {
  color: #f88e1c !important;
}

.table-header li,
.table-body li {
  display: grid;
  grid-template-columns: 20% 40% 40%;
  padding: 8px 0;
}

.table-body {
  max-height: 200px;
  overflow-y: auto;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
}

.highlight-row {
  color: #f88e1c !important;
}
</style>
