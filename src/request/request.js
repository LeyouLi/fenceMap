import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '../router/index.js' // 导入路由实例

// 创建axios实例
const service = axios.create({
  baseURL: '/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
  withCredentials: true,
  crossDomain: true,
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 可添加token等请求头信息
    // const token = localStorage.getItem('token')
    // if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

const handleAuthExpired = (res) => {
  if (res.code === 401) {
    ElMessage.error('登录已过期，请重新登录')
    // 清除可能存在的认证信息
    localStorage.removeItem('token')
    sessionStorage.removeItem('token')
    // 重定向到登录页
    router.push('/login')
    return
  }
}

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    const res = response.data
    handleAuthExpired(res)
    return res
  },
  (error) => {
    // 处理401鉴权过期状态码
    handleAuthExpired(error?.response || {})
    ElMessage.error(error.message || '网络异常')
    return Promise.reject(error)
  },
)

export default service
