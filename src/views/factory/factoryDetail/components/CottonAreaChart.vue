<template>
  <div class="cottonAreaChart-container">
    <div ref="chart" class="cottonAreaChart-box"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  dataSource: {
    type: Object,
    required: true,
    validator: (value) => {
      return 'areas' in value && 'counts' in value
    },
  },
})

const chart = ref(null)
let myChart = null

// 初始化图表函数（提升到作用域顶部）
function initChart() {
  if (!chart.value) return

  // 销毁旧实例防止重复初始化
  if (myChart) {
    myChart.dispose()
  }

  myChart = echarts.init(chart.value)

  // 安全数据访问
  const safeData = {
    areas: props.dataSource?.areas || [],
    counts: props.dataSource?.counts || [],
  }

  const option = {
    title: {
      text: '4号片区',
      left: 'center',
      bottom: 0,
      textStyle: {
        color: '#141414',
        fontSize: 16,
        fontWeight: 'bold',
      },
    },
    tooltip: {
      trigger: 'axis',
      formatter: '{b}<br/>棉包数量: {c}',
      axisPointer: {
        type: 'shadow',
      },
    },
    grid: {
      left: '3%',
      right: '10%',
      bottom: '15%',
      top: '20%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: safeData.areas,
      axisLabel: {
        interval: 0,
        rotate: 30,
        fontSize: 12,
        margin: 15,
        color: '#141414',
      },
      axisLine: {
        lineStyle: {
          color: '#141414',
        },
      },
      axisTick: {
        alignWithLabel: true,
      },
      name: '地区',
      nameLocation: 'end',
      nameTextStyle: {
        padding: [0, 0, 0, 0],
        color: '#141414',
      },
    },
    yAxis: {
      type: 'value',
      name: '棉包数量',
      nameLocation: 'end',
      nameGap: 20,
      min: 0,
      max: Math.max(...safeData.counts, 10),
      interval: 2,
      axisLabel: {
        color: '#141414',
        fontSize: 12,
        formatter: '{value}',
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: '#141414',
        },
      },
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: '#E0E0E0',
        },
      },
    },
    series: [
      {
        name: '棉包数量',
        type: 'bar',
        barWidth: '40%',
        data: safeData.counts,
        itemStyle: {
          color: '#FB8F0E',
          borderRadius: [4, 4, 0, 0],
        },
        label: {
          show: true,
          position: 'top',
          formatter: '{c}',
          fontSize: 12,
          color: '#333',
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
    // 空数据提示
    graphic:
      safeData.areas.length === 0
        ? [
            {
              type: 'text',
              left: 'center',
              top: 'middle',
              style: {
                text: '暂无数据',
                fill: '#999',
                fontSize: 16,
              },
            },
          ]
        : undefined,
  }

  myChart.setOption(option)
}

// 响应式监听数据变化
watch(
  () => props.dataSource,
  () => {
    initChart()
  },
  { deep: true },
)

// 生命周期管理
onMounted(() => {
  initChart()
  window.addEventListener('resize', resizeHandler)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeHandler)
  if (myChart) {
    myChart.dispose()
  }
})

// 窗口缩放处理
function resizeHandler() {
  myChart?.resize()
}
</script>

<style scoped>
.cottonAreaChart-container {
  width: 100%;
  max-width: 600px;
  height: 340px;
  padding: 15px;
  margin-right: 120px;
  background: linear-gradient(180deg, rgba(173, 173, 173, 0.8), rgba(238, 238, 238, 0.8));
  border-radius: 10px;
  border: 4px solid rgba(255, 255, 255, 0.75);
  position: relative;
}

.cottonAreaChart-box {
  width: 100%;
  height: 100%;
}
</style>
