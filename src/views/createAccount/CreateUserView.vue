<script setup lang="ts">
import { useRouter } from 'vue-router'
import { createUser } from '@/api/user/createUser'
import { onBeforeMount, reactive, ref } from 'vue'
const router = useRouter()

onBeforeMount(() => {
  getPastFiveYears()
})

const form = reactive({
  username: '',
  password: '',
  identity: '',
  grade: ''
})
const formIdentity = ref([])
const formGrade = ref([])
const identityOptions = [
  {
    value: '学生',
    label: '学生'
  },
  {
    value: '导师',
    label: '导师'
  },
  {
    value: '教务',
    label: '教务'
  },
  {
    value: '领导',
    label: '领导'
  }
]
const gradeOptions = ref([])
const getPastFiveYears = () => {
  const currentYear = new Date().getFullYear()
  const years = []
  for (let i = 0; i < 5; i++) {
    years.push(currentYear - i)
  }

  for (let item of years) {
    gradeOptions.value.push({
      value: String(item).slice(-2) + '级',
      label: String(item).slice(-2) + '级'
    })
  }
}
const createAccount = async () => {
  form.identity = formIdentity.value[0]
  form.grade = formGrade.value[0]

  if (form.username.length < 2 || form.username.length > 20) {
    ElMessage.error('用户名长度在2位到20位之间')
    throw Error
  }

  const specialCharRegex = /[!@#$%个&*( ),.?":{}|<>]/

  if (specialCharRegex.test(form.username)) {
    ElMessage.error('用户名不能含特殊字符')
    throw Error
  }

  if (form.password.length < 3 || form.password.length > 20) {
    ElMessage.error('密码长度在3位到20位之间')
    throw Error
  }

  await createUser(form).then((res) => {
    if (res.data.code !== 200) {
      ElMessage.error('创建失败')
      throw new Error('创建失败')
    }
    return res.data
  })
  ElMessage.success('创建成功')
  router.push({ name: 'phaseList' })
}
</script>

<template>
  <div class="main">
    <el-page-header @back="router.push({ name: 'phaseList' })">
      <template #content>
        <div>
          <span> 创建用户 </span>
        </div>
      </template>
    </el-page-header>
    <el-card class="box-card">
      <el-form :model="form">
        <el-form-item label="姓名">
          <el-input
            v-model="form.username"
            autocomplete="off"
            size="default"
            placeholder="2-20位,不含特殊字符"
            style="width: 22rem"
          />
        </el-form-item>

        <el-form-item label="密码">
          <el-input
            v-model="form.password"
            placeholder="密码长度为3-20位"
            style="width: 22rem"
            type="password"
            show-password
            autocomplete="off"
            size="default"
          />
        </el-form-item>

        <el-form-item label="角色">
          <el-cascader
            v-model="formIdentity"
            :options="identityOptions"
            style="width: 22rem"
            placeholder="选择角色"
          />
        </el-form-item>

        <el-form-item label="年级">
          <el-cascader
            v-model="formGrade"
            :options="gradeOptions"
            style="width: 22rem"
            placeholder="选择年级"
          />
        </el-form-item>
      </el-form>
      <div class="bottom-btn">
        <el-button type="primary" color="black" @click="createAccount">确认创建</el-button>
      </div>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.el-page-header {
  margin-bottom: 2rem;
}

.box-card {
  .el-form {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
}

.bottom-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
