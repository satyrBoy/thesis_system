<script setup lang="ts">
import { reactive, ref } from 'vue'
import { updateUserInfo } from '@/api/user/updateUserInfo'
import { useTokenStore } from '@/stores/token'
import { useRouter } from 'vue-router'
import { isCollapseInHome } from '@/components/layout/isCollapseInHome.js'

const name = ref(window.localStorage.getItem('name'))
const id = window.localStorage.getItem('id')
const grade = window.localStorage.getItem('grade')
const router = useRouter()

const form = reactive({
  newPassword: ''
})
const dialogFormVisible = ref(false)
const onSubmit = async () => {
  if (form.newPassword.length < 3 || form.newPassword.length > 20) {
    ElMessage.error('密码长度在3位到20位之间')
    throw Error
  }

  await updateUserInfo(id, form.newPassword, grade).then((res) => {
    if (res.data.code !== 200) {
      ElMessage.error('修改失败')
      throw new Error('修改失败')
    }
    return res.data
  })

  ElMessage.success('修改成功')
  dialogFormVisible.value = false
}

//退出处理事件
const handleLogout = async () => {
  await ElMessageBox.confirm('是否确认退出?', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).catch(() => {
    ElMessage.error('操作已取消')
    return new Promise(() => {})
  })

  useTokenStore().saveToken('')
  ElMessage.success('用户已登出')
  // 清空用户信息
  window.localStorage.clear()
  router.push('/login')
}
</script>

<template>
  <el-header>
    <el-icon @click="isCollapseInHome = !isCollapseInHome">
      <IEpFold v-if="!isCollapseInHome" />
      <IEpExpand v-else />
    </el-icon>
    <el-dropdown>
      <el-avatar
        :size="36"
        :src="'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'"
      />
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item>{{ name }}</el-dropdown-item>
          <el-dropdown-item divided @click="dialogFormVisible = true">修改密码</el-dropdown-item>
          <el-dropdown-item divided @click="handleLogout">退出</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </el-header>

  <el-dialog v-model="dialogFormVisible" title="修改密码" center>
    <el-form :model="form">
      <el-form-item label="修改密码">
        <el-input
          v-model="form.newPassword"
          type="password"
          autocomplete="off"
          size="default"
          show-password
          placeholder="密码长度为3-20位"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="onSubmit" color="black"> 提交 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
/* 头部内容水平排列, 垂直居中 */
.el-header {
  display: flex;
  align-items: center;
  background-color: #f1f6fa;

  .el-icon {
    margin-right: 1rem;
  }

  .el-dropdown {
    margin-left: auto;
  }
}
</style>
