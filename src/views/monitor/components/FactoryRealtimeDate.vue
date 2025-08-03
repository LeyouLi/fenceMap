<template>
  <div class="factoryRealtimeDate-container">
    <div class="title">加工厂实时数据</div>
    <div class="table-wrapper" ref="parentContainer">
      <!-- 固定表头 -->
      <div class="header">
        <span class="label">加工厂名称</span>
        <span class="value">接受棉卷数</span>
      </div>
      <!-- 滚动数据列表 -->
      <div class="scroll-body" ref="scrollBody">
        <ul>
          <li
            v-for="(item, index) in data"
            :key="index"
            @click="handleJumpToFactoryDetail(item.id)"
          >
            <span class="label">{{ item.factoryName }}</span>
            <span class="value">{{ item.count }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const parentContainer = ref(null)
const scrollBody = ref(null)
const data = ref()

const dataSource = [
  { id: 1622, factoryName: '塔里木加工厂', count: 47 },
  { id: 1622, factoryName: '铁门关加工厂', count: 32 },
  { id: 1622, factoryName: '塔里木加工厂', count: 18 },
  { id: 1622, factoryName: '铁门关加工厂', count: 56 },
  { id: 1622, factoryName: '铁门关加工厂', count: 24 },
  { id: 1622, factoryName: '塔里木加工厂', count: 39 },
  { id: 1622, factoryName: '塔里木加工厂', count: 12 },
]

const handleJumpToFactoryDetail = (id) => {
  router.push({
    name: 'factoryDetails',
    params: { id },
  })
}

const initScrollBody = () => {
  const parentHeight = parentContainer.value.offsetHeight
  const headerHeight = 40
  scrollBody.value.style.height = `${parentHeight - headerHeight}px`
  data.value = dataSource
}

onMounted(() => {
  initScrollBody()
})
</script>

<style scoped>
.factoryRealtimeDate-container {
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
  cursor: pointer;

  &:hover {
    color: rgba(248, 142, 28, 1);
  }
}

.scroll-body .label,
.scroll-body .value {
  text-align: center;
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
