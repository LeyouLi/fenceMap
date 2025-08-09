<template>
  <header class="app-header">
    <div class="header-container">
      <!-- 标题部分（居中） -->
      <div class="header-title">
        <h1>棉花可视化追溯平台</h1>
      </div>

      <!-- 右侧用户信息 -->
      <div class="user-info" v-if="!!nickName">
        <el-dropdown trigger="hover" placement="bottom-end">
          <div class="user-avatar-wrapper">
            <span class="user-name">{{ nickName }}</span>
            <el-avatar :size="24" :src="userAvatarImage" class="user-avatar" />
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="openPasswordDialog">
                <el-icon><Edit /></el-icon>
                <span>修改密码</span>
              </el-dropdown-item>
              <el-dropdown-item divided @click="handleLogout">
                <el-icon><SwitchButton /></el-icon>
                <span>退出登录</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <!-- 修改密码弹窗 -->
    <el-dialog
      title="修改密码"
      v-model="passwordDialogVisible"
      width="30%"
      lock-scroll
      :close-on-click-modal="false"
    >
      <el-form
        :model="passwordForm"
        :rules="passwordRules"
        ref="passwordFormRef"
        label-width="120px"
      >
        <el-form-item label="账号">
          <el-input v-model="userName" disabled />
        </el-form-item>
        <el-form-item label="原始密码" prop="oldPassword">
          <el-input
            v-model="passwordForm.oldPassword"
            type="password"
            show-password
            placeholder="请输入原始密码"
          />
        </el-form-item>

        <el-form-item label="新密码" prop="newPassword">
          <el-input
            v-model="passwordForm.newPassword"
            type="password"
            show-password
            placeholder="请输入新密码"
          />
        </el-form-item>

        <el-form-item label="确认新密码" prop="confirmPassword">
          <el-input
            v-model="passwordForm.confirmPassword"
            type="password"
            show-password
            placeholder="请再次输入新密码"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="passwordDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handlePasswordSubmit" :loading="passwordLoading">
            确认修改
          </el-button>
        </span>
      </template>
    </el-dialog>
  </header>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import {
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem,
  ElAvatar,
  ElMessage,
  ElMessageBox,
} from 'element-plus'
import { Edit, SwitchButton } from '@element-plus/icons-vue'
import commonApi from '@/request/api'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const userAvatarImage = new URL('@/assets/images/userProfilePicture.png', import.meta.url).href

const router = useRouter()

// 用户信息
const userStore = useUserStore()
const userName = ref('')
const nickName = ref('')

// 修改密码弹窗状态
const passwordDialogVisible = ref(false)
const passwordLoading = ref(false)
const passwordFormRef = ref(null)

// 密码表单数据
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

// 退出登录
const handleLogout = async () => {
  try {
    await ElMessageBox.confirm('是否确认退出登录？', '温馨提示', {
      type: 'warning',
      confirmButtonText: '退出',
      cancelButtonText: '取消',
    }).then(async () => {
      const res = await commonApi.logout()
      if (res?.code === 200) {
        // 清除用户信息
        userStore.clearUserInfo()
        ElMessage.success('退出登录成功')
        router.push('/login')
      } else {
        ElMessage.error(res?.message || '请求失败，请重试')
      }
    })
  } catch {
    //
  }
}

// 检查新旧密码是否相同
const validateNewPassword = (rule, value, callback) => {
  if (value === passwordForm.oldPassword) {
    callback(new Error('新密码不能与旧密码相同'))
  } else {
    callback()
  }
}

// 密码验证规则
const validateConfirmPassword = (rule, value, callback) => {
  if (value !== passwordForm.newPassword) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const passwordRules = reactive({
  oldPassword: [{ required: true, message: '请输入原始密码', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { validator: validateNewPassword, trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' },
  ],
})

// 打开密码修改弹窗
const openPasswordDialog = () => {
  passwordDialogVisible.value = true
  // 重置表单
  if (passwordFormRef.value) {
    passwordFormRef.value.resetFields()
  }
}

// 提交密码修改
const handlePasswordSubmit = async () => {
  const valid = await passwordFormRef.value.validate()
  if (!valid) return

  passwordLoading.value = true

  // 调用模拟接口
  const res = await commonApi.changePassword({
    newPassword: passwordForm.newPassword,
    oldPassword: passwordForm.oldPassword,
  })

  passwordLoading.value = false
  if (res.code === 200) {
    passwordDialogVisible.value = false
    ElMessage.success('密码修改成功，请重新登录')
    const logoutRes = await commonApi.logout()
    if (logoutRes?.code === 200) {
      router.push('/login')
    } else {
      ElMessage.error(logoutRes?.message || '请求失败，请重试')
    }
  } else {
    ElMessage.error(res?.message || '密码修改失败，请重试')
  }
}

// 更新用户信息显示
const updateUserInfoDisplay = () => {
  nickName.value = userStore.userInfo?.nickName
  userName.value = userStore.userInfo?.username
}
const initUserInfo = () => {
  if (userStore.isLogin && userStore.userInfo) {
    updateUserInfoDisplay()
  } else {
    userStore.loadUserInfoFromStorage()
    if (userStore.isLogin && userStore.userInfo) {
      updateUserInfoDisplay()
    }
  }
}

onMounted(() => {
  initUserInfo()
})
</script>

<style scoped>
.app-header {
  position: relative;
  width: 100%;
  height: 120px;
  z-index: 1000;
  background: linear-gradient(180deg, #18728c 0%, rgba(70, 101, 135, 0.02) 100%);
  pointer-events: none;
}

:deep(.el-overlay) {
  pointer-events: auto;
}

.header-container {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 100%;
  margin: 0 auto;
  padding: 0 20px;
}

.header-title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.header-title h1 {
  font-weight: bold;
  font-size: 40px;
  color: #ffffff;
  text-shadow: 0px 8px 8px rgba(0, 0, 0, 0.57);
}

.user-info {
  display: flex;
  align-items: center;
  height: 100%;
  pointer-events: auto;
}

.user-avatar-wrapper {
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s;
}

.user-avatar-wrapper:hover {
  opacity: 0.8;
}

.user-name {
  color: #fff;
  font-weight: bold;
  margin-right: 10px;
  font-size: 14px;
}

.user-avatar {
  background-color: #fff;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}

:deep(.el-dropdown__popper) {
  border: none !important;
  box-shadow: none !important;
}

:deep(.el-dropdown .el-tooltip__trigger:focus-visible) {
  outline: none !important;
}

:deep(.el-dropdown-menu) {
  border: none !important;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1) !important;
}

:deep(.el-dropdown-menu__item:hover) {
  background-color: transparent !important;
}
</style>
