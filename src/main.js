import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

// 引入 Element Plus 和样式
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import App from './App.vue'
import router from './router'

import 'vue3-openlayers/styles.css'
import OpenLayersMap from 'vue3-openlayers'

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 注册 Element Plus
app.use(ElementPlus)
app.use(createPinia())
app.use(router)
app.use(OpenLayersMap)
app.mount('#app')
