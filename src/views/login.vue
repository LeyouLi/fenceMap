<template>
  <div class="login-container">
    <!-- 背景图层 -->
    <div class="login-bg">
      <img :src="bgImage" alt="login background" class="bg-image" />
    </div>

    <!-- 登录区域（带半透明蒙层） -->
    <div class="login-wrapper">
      <el-card class="login-card">
        <!-- 标题 -->
        <h2 class="login-title">棉花可视化追溯平台</h2>

        <!-- 登录表单 -->
        <el-form
          :model="loginForm"
          :rules="loginRules"
          ref="loginFormRef"
          label-position="top"
          @submit.prevent="handleLogin"
        >
          <!-- 账号输入框 -->
          <el-form-item prop="username">
            <el-input
              v-model="loginForm.username"
              placeholder="请输入账号"
              prefix-icon="User"
              clearable
              size="large"
            />
          </el-form-item>

          <!-- 密码输入框 -->
          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="请输入密码"
              prefix-icon="Lock"
              show-password
              clearable
              size="large"
            />
          </el-form-item>

          <!-- 登录按钮 -->
          <el-form-item>
            <el-button type="primary" native-type="submit" class="login-btn" :loading="loading">
              立即登录
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import commonApi from '@/request/api'
import { useRouter } from 'vue-router'

// 背景图路径（需根据实际路径调整）
const bgImage = new URL('@/assets/login_bg.jpg', import.meta.url).href

const router = useRouter()

// 登录表单数据
const loginForm = reactive({
  username: '',
  password: '',
})

// 表单验证规则
const loginRules = reactive({
  username: [
    { required: true, message: '请输入账号', trigger: 'blur' },
    { min: 3, max: 16, message: '长度在3到16个字符', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 1, max: 18, message: '长度在1到18个字符', trigger: 'blur' },
  ],
})

// 表单引用和加载状态
const loginFormRef = ref(null)
const loading = ref(false)

// 登录处理
const handleLogin = async () => {
  const valid = await loginFormRef.value.validate()
  if (!valid) return

  loading.value = true

  const res = await commonApi.login({
    userName: loginForm.username,
    password: loginForm.password,
  })
  loading.value = false
  if (res.code === 200) {
    ElMessage.success('登录成功')
    router.push('/')
  } else {
    console.error('登录失败:', res?.message)
    ElMessage.error(res?.message || '登录失败，请重试')
  }
}
</script>

<style scoped>
.login-container {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

/* 背景图样式 */
.login-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.bg-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 登录区域样式 */
.login-wrapper {
  position: absolute;
  top: 50%;
  /* left: 50%; */
  transform: translateY(-50%);
  z-index: 2;
  width: 100%;
  padding: 16px 0;
  background: rgba(5, 5, 5, 0.4);
}

.login-card {
  margin: 0 auto;
  background: rgba(168, 185, 178, 0.27);
  max-width: 670px;
  border: none;

  &:deep(.el-card__body) {
    padding: 0;
  }

  &:deep(.el-form--label-top) {
    padding: 0 175px;

    &:deep(.el-form-item--label-top) {
      margin-bottom: 32px;

      &:last-child {
        margin-bottom: 104px;
      }
    }
  }
}

.login-title {
  text-align: center;
  margin-bottom: 43px;
  font-weight: bold;
  font-size: 42px;
  color: #ffffff;
  margin-top: 66px;
  padding: 0 130px;
}

.login-btn {
  width: 100%;
  height: 42px;
  font-size: 16px;
  background: linear-gradient(0deg, #106742 0%, #32d690 100%);
  border: none;
}
</style>
