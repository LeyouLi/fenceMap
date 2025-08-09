import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd())

  return {
    base: './',
    plugins: [vue(), vueJsx()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      proxy: {
        '/api': {
          target: env.VITE_APP_API_URL || 'http://121.37.81.250',
          changeOrigin: true,
          rewrite: (path) => {
            return path.replace(/^\/api/, '')
          },
          // 添加以下配置
          configure: (proxy, options) => {
            proxy.on('proxyReq', (proxyReq, req, res) => {
              // 可以在这里添加自定义请求头
              proxyReq.setHeader('X-Proxy', 'Vite')
            })
          },
          // 处理WebSocket（如果需要）
          ws: true,
          // 允许自签名证书（开发环境）
          secure: false,
        },
      },
    },
  }
})
