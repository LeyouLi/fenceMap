import { ref } from 'vue'
import { defineStore } from 'pinia'
import commonApi from '@/request/api'
import { ElMessage } from 'element-plus'

export const useUserStore = defineStore('user', () => {
  // 用户信息状态
  const userInfo = ref(null)
  const isLogin = ref(false)

  // 设置用户信息
  const setUserInfo = (info) => {
    userInfo.value = info
    isLogin.value = true
    // 同时存储到localStorage，防止刷新页面丢失
    localStorage.setItem('userInfo', JSON.stringify(info))
  }

  // 清除用户信息
  const clearUserInfo = () => {
    userInfo.value = null
    isLogin.value = false
    localStorage.removeItem('userInfo')
  }

  // 从localStorage加载用户信息
  const loadUserInfoFromStorage = () => {
    const storedUserInfo = localStorage.getItem('userInfo')
    if (storedUserInfo) {
      try {
        userInfo.value = JSON.parse(storedUserInfo)
        isLogin.value = true
      } catch (error) {
        console.error('解析用户信息失败:', error)
        clearUserInfo()
      }
    }
  }

  // 刷新用户信息
  const refreshUserInfo = async () => {
    try {
      const res = await commonApi.queryUserInfo()
      if (res.code === 200) {
        setUserInfo(res.data)
        return res.data
      } else {
        ElMessage.error('刷新用户信息失败')
        return null
      }
    } catch (error) {
      console.error('刷新用户信息异常:', error)
      ElMessage.error('网络异常，刷新用户信息失败')
      return null
    }
  }

  return {
    userInfo,
    isLogin,
    setUserInfo,
    clearUserInfo,
    loadUserInfoFromStorage,
    refreshUserInfo,
  }
})
