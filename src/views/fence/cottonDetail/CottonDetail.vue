<template>
  <div class="detail-container">
    <!-- 地图容器 -->
    <div ref="mapContainer" class="map-container"></div>

    <!-- 地块信息面板 -->
    <div v-if="currentFeature" class="info-panel">
      <h2>{{ currentFeature.properties?.Name || '地块详情' }}</h2>
      <div class="info-grid">
        <div class="info-item">
          <span class="label">面积：</span>
          <span class="value">{{ formatArea(currentFeature.properties?.descriptio) }}</span>
        </div>
        <div class="info-item">
          <span class="label">地块ID：</span>
          <span class="value">{{ route.params.id }}</span>
        </div>
        <div v-if="coordinates" class="info-item">
          <span class="label">中心坐标：</span>
          <span class="value">{{ coordinates }}</span>
        </div>
      </div>
      <button @click="router.back()" class="back-btn">返回地图</button>
    </div>

    <!-- 收割机控制面板 -->
    <div v-if="currentFeature" class="harvester-control">
      <h3>收割机控制系统</h3>
      <div class="config-item">
        <label>路径颜色:</label>
        <input type="color" v-model="pathConfig.lineColor" />
      </div>
      <div class="config-item">
        <label>线宽(px):</label>
        <input type="range" v-model="pathConfig.lineWidth" min="1" max="10" />
      </div>
      <!-- <div class="config-item">
        <label>行间距(m):</label>
        <input type="number" v-model="pathConfig.spacing" min="5" max="50" />
      </div> -->
      <div class="config-item">
        <label>移动速度:</label>
        <input type="range" v-model="pathConfig.speed" min="0.1" max="2" step="0.1" />
      </div>
      <div class="button-group">
        <button @click="startHarvesting" :disabled="isHarvesting">开始</button>
        <button @click="stopHarvesting" :disabled="!isHarvesting">停止</button>
        <!-- <button @click="resetHarvesting">重置路径</button> -->
      </div>
      <div v-if="progress > 0" class="progress-bar">
        <div class="progress-fill" :style="{ width: `${progress}%` }"></div>
        <span>{{ progress.toFixed(1) }}%</span>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-overlay">
      <div class="loader"></div>
      <p>加载地块数据中...</p>
    </div>

    <!-- 错误提示 -->
    <div v-if="error" class="error-message">
      {{ error }}
      <button @click="retryLoad" class="retry-btn">重试</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import GeoJSON from 'ol/format/GeoJSON'
import { Style, Fill, Stroke, Circle, Icon } from 'ol/style'
import { fromLonLat, transform } from 'ol/proj'
import XYZ from 'ol/source/XYZ'
import { getCenter } from 'ol/extent'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import LineString from 'ol/geom/LineString'

const route = useRoute()
const router = useRouter()
const mapContainer = ref(null)
const map = ref(null)
const currentFeature = ref(null)
const loading = ref(true)
const error = ref(null)
const coordinates = ref(null)

// 收割机系统相关状态
const harvester = ref(null)
const harvestPath = ref(null)
const isHarvesting = ref(false)
const animationId = ref(null)
const progress = ref(0)
const pathConfig = ref({
  lineColor: '#FF5722',
  lineWidth: 4,
  speed: 0.5,
})

// 新增变量存储图层引用
const vectorLayerRef = ref(null)
const pathLayerRef = ref(null)
const harvesterLayerRef = ref(null)

// 计算两点之间的角度（用于旋转收割机图标）
const calculateAngle = (point1, point2) => {
  const dx = point2[0] - point1[0]
  const dy = point2[1] - point1[1]
  return Math.atan2(dy, dx)
}

// 线性插值函数（用于平滑移动）
const lerp = (start, end, t) => {
  return start * (1 - t) + end * t
}

// 1. 加载GeoJSON数据（保持不变）
const loadFeatureData = async () => {
  try {
    loading.value = true
    error.value = null

    const response = await fetch(`${import.meta.env.BASE_URL}map.geojson`)
    if (!response.ok) throw new Error('地图数据加载失败')
    const geoJsonData = await response.json()

    const targetFeature = geoJsonData.features.find(
      (feature) =>
        feature.properties?.geometry?.ol_uid === route.params.id ||
        feature.properties?.id == route.params.id,
    )

    if (!targetFeature) throw new Error('未找到匹配的地块数据')
    currentFeature.value = targetFeature
    initMap(targetFeature)
  } catch (err) {
    console.error('加载地块数据失败:', err)
    error.value = `加载失败: ${err.message}`
  } finally {
    loading.value = false
  }
}

// 2. 初始化地图（修复样式初始化问题）
const initMap = (feature) => {
  try {
    // 创建地图实例
    map.value = new Map({
      target: mapContainer.value,
      layers: [
        new TileLayer({
          source: new XYZ({
            url: 'https://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
            maxZoom: 19,
            crossOrigin: 'anonymous',
          }),
        }),
      ],
      view: new View({
        center: fromLonLat([116.397428, 39.90923]),
        zoom: 10,
        minZoom: 8,
        maxZoom: 19,
      }),
    })

    // 创建矢量图层
    const vectorSource = new VectorSource({
      features: new GeoJSON().readFeatures(
        { type: 'FeatureCollection', features: [feature] },
        { featureProjection: 'EPSG:3857' },
      ),
    })

    // 计算中心坐标
    const center = getCenter(vectorSource.getExtent())
    const [lon, lat] = transform(center, 'EPSG:3857', 'EPSG:4326')
    coordinates.value = `经度: ${lon.toFixed(6)}, 纬度: ${lat.toFixed(6)}`

    // 主地块图层
    vectorLayerRef.value = new VectorLayer({
      source: vectorSource,
      style: new Style({
        fill: new Fill({ color: 'rgba(0, 128, 0, 0.5)' }),
        stroke: new Stroke({ color: '#fff', width: 2 }),
      }),
      declutter: true,
    })

    // 收割路径图层
    const pathSource = new VectorSource()
    pathLayerRef.value = new VectorLayer({
      source: pathSource,
      style: new Style({
        stroke: new Stroke({
          color: pathConfig.value.lineColor,
          width: pathConfig.value.lineWidth,
        }),
      }),
    })

    // 收割机标记（确保样式初始化）
    const harvesterSource = new VectorSource()
    const harvesterIcon = new Icon({
      src: 'http://118.31.18.243/w/cottonCar.svg',
      // src: 'https://cdn-icons-png.flaticon.com/512/2972/2972185.png',
      scale: 0.4,
      anchor: [0.5, 0.5],
      rotateWithView: true,
      rotation: 0,
    })

    harvesterLayerRef.value = new VectorLayer({
      source: harvesterSource,
      style: new Style({
        image: harvesterIcon,
      }),
    })
    map.value.addLayer(vectorLayerRef.value)
    map.value.addLayer(pathLayerRef.value)
    map.value.addLayer(harvesterLayerRef.value)

    // 存储引用（确保Feature有样式）
    harvester.value = new Feature({
      geometry: new Point(center),
      name: '联合收割机',
    })
    harvester.value.setStyle(
      new Style({
        image: harvesterIcon,
      }),
    )
    harvesterSource.addFeature(harvester.value)

    harvestPath.value = new Feature({
      geometry: new LineString([]),
      name: '已收割路径',
    })
    pathSource.addFeature(harvestPath.value)

    // 初始缩放
    const view = map.value.getView()
    view.fit(vectorSource.getExtent(), {
      padding: [50, 50, 50, 50],
      duration: 500,
      callback: () => {
        const finalZoom = Math.max(view.getZoom() - 2, 8)
        view.setZoom(finalZoom)
      },
    })
  } catch (err) {
    console.error('地图初始化失败:', err)
    error.value = `地图渲染失败: ${err.message}`
  }
}

// 3. 收割动画控制（修复null引用问题）
const startHarvesting = () => {
  if (isHarvesting.value || !currentFeature.value || !harvester.value) return

  try {
    const vectorSource = vectorLayerRef.value.getSource()
    const feature = vectorSource.getFeatures()[0]
    const geometry = feature.getGeometry()

    // 获取边界坐标（支持MultiPolygon）
    let boundary =
      geometry.getType() === 'MultiPolygon'
        ? geometry.getCoordinates()[0][0]
        : geometry.getCoordinates()[0]

    // 检查闭合性
    if (!isRingClosed(boundary)) {
      error.value = '多边形未闭合'
      return
    }

    // 重置状态
    harvestPath.value.getGeometry().setCoordinates([])
    progress.value = 0
    isHarvesting.value = true

    // 动画参数
    let currentIndex = 0
    let lapCount = 0
    const totalPoints = boundary.length
    let lastUpdateTime = Date.now()
    let lastPosition = boundary[0]
    let interpolationFactor = 0

    const animate = (timestamp) => {
      if (!isHarvesting.value) return

      // 使用requestAnimationFrame的时间戳计算增量时间
      const now = Date.now()
      const deltaTime = now - lastUpdateTime
      lastUpdateTime = now

      // 计算插值因子（基于速度和增量时间）
      interpolationFactor += (deltaTime / 1000) * pathConfig.value.speed

      // 检查是否完成一圈
      if (currentIndex >= totalPoints - 1) {
        currentIndex = 0
        lapCount++
        interpolationFactor = 0

        // 每完成一圈清除旧路径
        if (lapCount > 0) {
          harvestPath.value.getGeometry().setCoordinates([])
        }
      }

      // 获取当前点和下一个点
      const currentPoint = boundary[currentIndex]
      const nextPoint = boundary[(currentIndex + 1) % totalPoints]

      // 计算插值位置
      const interpolatedX = lerp(currentPoint[0], nextPoint[0], interpolationFactor)
      const interpolatedY = lerp(currentPoint[1], nextPoint[1], interpolationFactor)
      const interpolatedPosition = [interpolatedX, interpolatedY]

      // 更新收割机位置
      harvester.value.getGeometry().setCoordinates(interpolatedPosition)

      // 安全设置收割机方向
      const currentStyle = harvester.value.getStyle()
      if (currentStyle && currentStyle.getImage()) {
        const angle = calculateAngle(lastPosition, interpolatedPosition)
        currentStyle.getImage().setRotation(angle)
      }
      lastPosition = interpolatedPosition

      // 更新路径
      const lineCoords = harvestPath.value.getGeometry().getCoordinates()
      lineCoords.push(interpolatedPosition)
      harvestPath.value.getGeometry().setCoordinates(lineCoords)

      // 更新进度
      progress.value = ((currentIndex + interpolationFactor) / totalPoints) * 100

      // 检查是否需要移动到下一个点
      if (interpolationFactor >= 1) {
        currentIndex++
        interpolationFactor = 0
      }

      animationId.value = requestAnimationFrame(animate)
    }

    animate()
  } catch (err) {
    console.error('收割启动失败:', err)
    error.value = `操作失败: ${err.message}`
    isHarvesting.value = false
  }
}

// 几何验证工具函数
function isRingClosed(coords) {
  const first = coords[0]
  const last = coords[coords.length - 1]
  return first[0] === last[0] && first[1] === last[1]
}

// 其他方法保持不变
const stopHarvesting = () => {
  isHarvesting.value = false
  if (animationId.value) {
    cancelAnimationFrame(animationId.value)
    animationId.value = null
  }
}

const resetHarvesting = () => {
  stopHarvesting()
  if (harvestPath.value) {
    harvestPath.value.getGeometry().setCoordinates([])
  }
  progress.value = 0
}

// 5. 响应式配置更新
watch(
  () => pathConfig.value.lineColor,
  (color) => {
    if (pathLayerRef.value) {
      pathLayerRef.value.setStyle(
        new Style({
          stroke: new Stroke({
            color: color,
            width: pathConfig.value.lineWidth,
          }),
        }),
      )
    }
  },
)

watch(
  () => pathConfig.value.lineWidth,
  (width) => {
    if (pathLayerRef.value) {
      pathLayerRef.value.setStyle(
        new Style({
          stroke: new Stroke({
            color: pathConfig.value.lineColor,
            width: width,
          }),
        }),
      )
    }
  },
)

// 6. 辅助函数
const formatArea = (area) => {
  if (!area) return 'N/A'
  return `${parseFloat(area).toLocaleString()}`
}

const retryLoad = () => {
  error.value = null
  loadFeatureData()
}

const handleResize = () => {
  if (map.value) map.value.updateSize()
}

// 7. 生命周期
onMounted(() => {
  if (!mapContainer.value) {
    error.value = '地图容器未正确初始化'
    return
  }
  loadFeatureData()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  stopHarvesting()
  if (map.value) {
    map.value.setTarget(undefined)
    map.value = null
  }
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
html,
body {
  margin: 0;
  padding: 0;
  overflow: hidden; /* 禁用全局滚动条 */
}

.detail-container {
  position: fixed; /* 改为fixed定位确保全屏 */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden; /* 禁用容器内滚动 */
}

.map-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

/* 控制面板优化 */
.info-panel {
  position: absolute;
  top: 20px;
  left: 20px;
  background: rgba(255, 255, 255, 0.95);
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.2);
  z-index: 1;
  max-width: 320px;
  backdrop-filter: blur(5px);
  transform: translateZ(0); /* 硬件加速 */
}

.harvester-control {
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.95);
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.2);
  z-index: 1;
  max-width: 300px;
  transform: translateZ(0);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .info-panel,
  .harvester-control {
    max-width: 90%;
    left: 50%;
    transform: translateX(-50%);
  }

  .harvester-control {
    bottom: 10px;
    right: auto;
    left: 50%;
    transform: translateX(-50%);
  }
}

.info-panel {
  position: absolute;
  top: 20px;
  left: 20px;
  background: rgba(255, 255, 255, 0.95);
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.2);
  z-index: 1;
  max-width: 320px;
  backdrop-filter: blur(5px);
}

.harvester-control {
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.95);
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.2);
  z-index: 1;
  max-width: 300px;
}

.config-item {
  margin: 10px 0;
  display: flex;
  align-items: center;
}

.config-item label {
  width: 80px;
  font-weight: bold;
  color: #555;
}

.config-item input {
  flex: 1;
}

.button-group {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.button-group button {
  flex: 1;
  padding: 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.button-group button:first-child {
  background-color: #4caf50;
  color: white;
}

.button-group button:nth-child(2) {
  background-color: #f44336;
  color: white;
}

.button-group button:last-child {
  background-color: #2196f3;
  color: white;
}

.button-group button:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

.progress-bar {
  margin-top: 15px;
  height: 20px;
  background: #eee;
  border-radius: 10px;
  position: relative;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4caf50, #8bc34a);
  transition: width 0.3s;
}

.progress-bar span {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  color: #333;
  font-size: 12px;
  font-weight: bold;
}

.info-panel {
  position: absolute;
  top: 20px;
  left: 20px;
  background: rgba(255, 255, 255, 0.95);
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.2);
  z-index: 1;
  max-width: 320px;
  backdrop-filter: blur(5px);
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  margin-top: 15px;
}

.info-item {
  display: flex;
  align-items: center;
}

.label {
  font-weight: bold;
  min-width: 80px;
  color: #555;
}

.value {
  flex: 1;
  color: #333;
  word-break: break-all;
}

.back-btn {
  margin-top: 15px;
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
  width: 100%;
}

.back-btn:hover {
  background-color: #45a049;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 2;
}

.loader {
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid #4caf50;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

.error-message {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 0, 0, 0.85);
  color: white;
  padding: 20px 25px;
  border-radius: 8px;
  z-index: 3;
  max-width: 80%;
  text-align: center;
}

.retry-btn {
  margin-top: 10px;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid white;
  padding: 5px 15px;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.retry-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
