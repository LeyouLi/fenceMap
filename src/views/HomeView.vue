<script setup>
import { onMounted, ref, onUnmounted } from 'vue'
import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { Cluster } from 'ol/source'
import XYZ from 'ol/source/XYZ'
import GeoJSON from 'ol/format/GeoJSON'
import { Style, Fill, Stroke, Circle, Text } from 'ol/style'
import { fromLonLat, transform } from 'ol/proj'
import { getCenter } from 'ol/extent'
import { Point } from 'ol/geom'
import Overlay from 'ol/Overlay'
import { useRouter } from 'vue-router'
import commonApi from '@/request/api'

const router = useRouter()
const mapContainer = ref(null)
const popup = ref(null)
let map = null
let highlightLayer = null

const getDeviceState = async () => {
  const res = await commonApi.getAreaList()
  if (res.code === 200) {
    console.log(res)
  }
}

const getGisMapData = async () => {
  const res = await commonApi.getGisMapData()
  if (res.code === 200) {
    console.log(res)
  }
}

onMounted(() => {
  getDeviceState()
  getGisMapData()
  // 1. 基础地图（使用高德地图）
  const baseLayer = new TileLayer({
    source: new XYZ({
      url: 'https://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
      maxZoom: 19,
    }),
  })

  // 2. 创建带聚合的矢量源
  const source = new VectorSource({
    url: `${import.meta.env.BASE_URL}map.geojson`,
    format: new GeoJSON({
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:3857',
    }),
  })

  // 几何中心点计算函数
  const getClusterPoint = (feature) => {
    const geometry = feature.getGeometry()
    if (geometry.getType() === 'Point') return geometry
    return new Point(getCenter(geometry.getExtent()))
  }

  const clusterSource = new Cluster({
    distance: 30,
    source: source,
    geometryFunction: getClusterPoint,
  })

  // 3. 动态样式函数
  const styleCache = {}
  const getStyle = (feature, resolution) => {
    const features = feature.get('features')
    const size = features.length
    const originalFeature = features[0]
    const geometry = originalFeature.getGeometry()
    const zoomLevel = map.getView().getZoom()

    // 放大到15级及以上显示原始多边形
    if (
      zoomLevel >= 15 &&
      (geometry.getType() === 'Polygon' || geometry.getType() === 'MultiPolygon')
    ) {
      return [
        new Style({
          fill: new Fill({ color: 'rgba(0, 128, 0, 0.5)' }),
          stroke: new Stroke({ color: '#fff', width: 1 }),
        }),
        new Style({
          geometry: geometry,
          fill: new Fill({ color: 'rgba(0, 128, 0, 0.5)' }),
          stroke: new Stroke({ color: '#fff', width: 1 }),
        }),
      ]
    }

    // 单个要素样式
    if (size === 1) {
      if (geometry.getType() === 'Polygon' || geometry.getType() === 'MultiPolygon') {
        return new Style({
          fill: new Fill({ color: 'rgba(0, 128, 0, 0.5)' }),
          stroke: new Stroke({ color: '#fff', width: 1 }),
        })
      }
      return new Style({
        image: new Circle({
          radius: 5,
          fill: new Fill({ color: 'rgba(0, 128, 0, 0.7)' }),
          stroke: new Stroke({ color: '#fff', width: 1 }),
        }),
      })
    }

    // 聚合样式
    if (!styleCache[size]) {
      styleCache[size] = new Style({
        image: new Circle({
          radius: Math.min(15, 10 + size / 50),
          fill: new Fill({ color: 'rgba(0, 128, 0, 0.7)' }),
          stroke: new Stroke({ color: '#fff', width: 2 }),
        }),
        text: new Text({
          text: size.toString(),
          fill: new Fill({ color: '#fff' }),
          font: 'bold 12px Arial',
        }),
      })
    }
    return styleCache[size]
  }

  // 4. 主矢量图层
  const clusterLayer = new VectorLayer({
    source: clusterSource,
    style: (feature) => getStyle(feature, map.getView().getResolution()),
  })

  // 5. 高亮图层（独立图层方案）
  highlightLayer = new VectorLayer({
    source: new VectorSource(),
    style: new Style({
      fill: new Fill({ color: 'rgba(255, 255, 0, 0.3)' }),
      stroke: new Stroke({ color: 'red', width: 3 }),
    }),
  })

  // 6. 地图实例
  map = new Map({
    target: mapContainer.value,
    layers: [baseLayer, clusterLayer, highlightLayer],
    view: new View({
      center: fromLonLat([86.33, 41.337428]),
      zoom: 12,
      maxZoom: 19,
    }),
  })

  // 7. 弹窗配置
  const overlay = new Overlay({
    element: popup.value,
    autoPan: true,
    autoPanAnimation: { duration: 250 },
  })
  map.addOverlay(overlay)

  // 8. 点击交互逻辑（优化版）
  map.on('click', (evt) => {
    if (map.getView().getZoom() < 15) return

    highlightLayer.getSource().clear()

    map.forEachFeatureAtPixel(
      evt.pixel,
      (feature) => {
        const originalFeature = feature.get('features')[0]
        const properties = originalFeature.getProperties()
        const geometry = originalFeature.getGeometry()

        // 添加到高亮图层
        highlightLayer.getSource().addFeature(originalFeature)

        // 生成详情页跳转URL
        const detailUrl = router.resolve({
          name: 'details',
          params: { id: properties.id || geometry.ol_uid },
        }).href

        console.log('--properties--', properties)

        // 弹窗内容（使用模板字符串避免XSS风险）
        const content = `
        <div class="popup-header">
          <h4>${escapeHtml(properties.Name || '未命名地块')}</h4>
        </div>
        <div class="popup-body">
          <p><strong>类型:</strong> ${escapeHtml(properties.type || '未知')}</p>
          <p><strong>面积:</strong> ${escapeHtml(properties.descriptio || 'N/A')}</p>
        </div>
        <div class="popup-footer">
          <a href="${detailUrl}" class="detail-btn">查看详情</a>
        </div>
      `
        popup.value.innerHTML = content
        overlay.setPosition(evt.coordinate)

        return true
      },
      {
        layerFilter: (layer) => layer === clusterLayer,
        hitTolerance: 5,
      },
    )
  })

  // XSS防护函数
  const escapeHtml = (unsafe) => {
    return (
      unsafe
        ?.toString()
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;') || ''
    )
  }

  // 性能优化
  let isAnimating = false
  map.on('postrender', () => (isAnimating = false))
  map.on('movestart', () => (isAnimating = true))

  // 响应式调整
  const handleResize = () => map.updateSize()
  window.addEventListener('resize', handleResize)
  onUnmounted(() => window.removeEventListener('resize', handleResize))
})
</script>

<template>
  <!-- 地图容器 -->
  <div ref="mapContainer" class="map-container"></div>

  <!-- 信息弹窗 -->
  <div ref="popup" class="ol-popup">
    <a
      href="#"
      class="ol-popup-closer"
      @click.prevent="map?.getOverlays()?.getArray()[0]?.setPosition(undefined)"
    ></a>
    <div class="ol-popup-content"></div>
  </div>
</template>

<style scoped>
.map-container {
  width: 100vw;
  height: 100vh;
  min-width: 0;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 0;
}

/* 弹窗样式 */
.ol-popup {
  position: absolute;
  background-color: white;
  padding: 15px;
  border-radius: 10px;
  border: 1px solid #ccc;
  bottom: 12px;
  left: -50px;
  min-width: 280px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}
.ol-popup:after,
.ol-popup:before {
  top: 100%;
  border: solid transparent;
  content: ' ';
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
}
.ol-popup:after {
  border-top-color: white;
  border-width: 10px;
  left: 48px;
  margin-left: -10px;
}
.ol-popup:before {
  border-top-color: #ccc;
  border-width: 11px;
  left: 48px;
  margin-left: -11px;
}
.ol-popup-closer {
  text-decoration: none;
  position: absolute;
  top: 2px;
  right: 8px;
  font-size: 18px;
  color: #999;
}
.popup-header {
  margin-bottom: 10px;
  border-bottom: 1px solid #eee;
  padding-bottom: 8px;
}
.popup-body {
  margin-bottom: 15px;
}
.popup-footer {
  text-align: right;
  margin-top: 10px;
}
.detail-btn {
  display: inline-block;
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  text-decoration: none;
  transition: background-color 0.3s;
}
.detail-btn:hover {
  background-color: #45a049;
}
</style>
