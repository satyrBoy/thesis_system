<script setup>
import { Message, Lock } from '@element-plus/icons-vue'
import { login } from '@/api/user/login.js'
import { getUserInfo } from '@/api/user/getUserInfo'
import { useTokenStore } from '@/stores/token'
import { getInstructListByStu } from '@/api/chooseMentor/getInstructListByStu'
import { getPhaseState } from '@/api/phase/getPhaseState'
import { isInPhase } from '@/api/phase/isInPhase'
import { useRouter, useRoute } from 'vue-router'
//登录form数据
const form = reactive({
  username: '',
  password: ''
})

const router = useRouter()
const route = useRoute()

//登录按钮状态
const isLoading = ref(false)

const store = useTokenStore()
const onSubmit = async () => {
  //开始请求,置为true
  isLoading.value = true

  const data = await login(form.username, form.password).then((res) => {
    //登录失败
    if (res.data.code !== 200) {
      ElMessage.error('登录信息有误')
      //登录失败,置为false
      isLoading.value = false

      //打印数据
      console.log(res.data)

      throw new Error('登录信息有误')
    }
    //登录成功
    return res.data
  })
  //保存接口请求返回的token信息
  store.saveToken(data.data.token)
  //保存用户ID、name、password
  window.localStorage.setItem('id', data.data.id)
  window.localStorage.setItem('name', data.data.name)

  const info = await getUserInfo(window.localStorage.getItem('id')).then((res) => {
    if (res.data.code !== 200) {
      ElMessage.error('获取个人信息失败')
      isLoading.value = false

      throw new Error('获取个人信息失败')
    }
    return res.data
  })
  if (info.data.identity !== '学生' && info.data.identity !== '导师') {
    ElMessage.error('登录失败')
    isLoading.value = false
    throw new Error('非学生、导师不可登录')
  }

  const phaseInfo = await isInPhase(window.localStorage.getItem('id')).then((res) => {
    if (res.data.code !== 200) {
      ElMessage.error('获取流程信息失败')
      isLoading.value = false

      throw new Error('获取流程信息失败')
    }
    window.localStorage.setItem('phaseid', res.data.data.phaseid)
    return res.data
  })

  window.localStorage.setItem('identity', info.data.identity)
  window.localStorage.setItem('grade', info.data.grade)

  if (window.localStorage.getItem('phaseid') !== '') {
    await getPhaseState(window.localStorage.getItem('phaseid')).then((res) => {
      if (res.data.code !== 200) {
        ElMessage.error('获取流程状态失败')
        isLoading.value = false

        throw new Error('获取流程状态失败')
      }
      window.localStorage.setItem('process', res.data.data.process)
      return res.data
    })
  }

  const dataInstruct = await getInstructListByStu(window.localStorage.getItem('id')).then((res) => {
    if (res.data.code !== 200) {
      ElMessage.error('获取导师关系失败')
      throw new Error('获取导师关系失败')
    }
    return res.data
  })

  for (let item of dataInstruct.data.instructs) {
    if (item.permit === '1') {
      window.localStorage.setItem('instructId', item.id)
      window.localStorage.setItem('teacherId', item.teacherId)
      window.localStorage.setItem('teacherName', item.teacherName)
      window.localStorage.setItem('state', item.state)
      window.localStorage.setItem('title', item.title)
      break
    }
  }

  isLoading.value = false
  ElMessage.success('登录成功')
  let lastString = ''
  if (info.data.identity === '学生') {
    if (phaseInfo.data.phaseid === '' || window.localStorage.getItem('process') !== '2') {
      lastString = '/stu/notInPhase'
    } else {
      lastString = '/stu/chooseMentor'
    }
  }

  if (info.data.identity === '导师') {
    if (phaseInfo.data.phaseid === '' || window.localStorage.getItem('process') !== '2') {
      lastString = '/teach/notInPhase'
    } else {
      lastString = '/teach/stuList'
    }
  }
  let directAsString = route.query && route.query.direct ? String(route.query.direct) : lastString
  router.push(directAsString)
}
</script>

<template>
  <div class="backGround">
    <div class="loginBox">
      <div class="logo">
        <img src="@/assets/login-logo.svg" alt="logo图片" class="login-logo" />
      </div>
      <div class="login-part">
        <el-form :model="form" size="large">
          <div class="title">
            <p>论文系统</p>
          </div>

          <el-form-item>
            <el-input
              type="text"
              v-model="form.username"
              placeholder="账号"
              style="width: 18rem"
              :prefix-icon="Message"
            />
          </el-form-item>

          <el-form-item>
            <el-input
              type="password"
              v-model="form.password"
              placeholder="密码"
              show-password
              style="width: 18rem"
              :prefix-icon="Lock"
            />
          </el-form-item>

          <el-form-item class="login-button">
            <el-button
              type="primary"
              @click="onSubmit"
              :round="true"
              :isLoading="isLoading"
              style="width: 18rem"
              color="black"
            >
              <p>登录</p>
            </el-button>
          </el-form-item>

          <el-form-item>
            <el-button
              color="#707070"
              :round="true"
              style="width: 18rem"
              @click="router.push({ name: 'admin-login' })"
            >
              <p>管理员通道</p>
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.backGround {
  height: 100%;
  width: 100%;
  background: linear-gradient(to top right, #555555, #cccccc);

  display: flex;
  align-items: center;
  justify-content: center;
}

.loginBox {
  width: 65%;
  height: 88%;
  background-color: #fff;
  border-radius: 10px;

  display: flex;
  align-items: center;
}

.logo {
  height: 100%;
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.login-logo {
  width: 60%;
  height: 60%;
}

.login-part {
  width: 50%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .el-form {
    display: flex;
    align-items: center;
    flex-direction: column;
    width: 100%;

    margin-bottom: 2rem;
    margin-right: 4rem;
    .title {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;

      font-size: 1.5rem;

      margin-bottom: 2rem;
    }
  }
}

.el-button {
  font-weight: bold;
}

.login-button {
  margin-top: 1.2rem;
}
</style>
