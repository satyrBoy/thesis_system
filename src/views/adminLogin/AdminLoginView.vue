<script setup lang="ts">
import { reactive, ref } from 'vue'
import { Message, Lock } from '@element-plus/icons-vue'
import { login } from '@/api/user/login.js'
import { getUserInfo } from '@/api/user/getUserInfo'
import { useTokenStore } from '@/stores/token'
import { useRouter, useRoute } from 'vue-router'

//登录按钮状态
const isLoading = ref(false)

//登录form数据
const form = reactive({
  username: '',
  password: ''
})

const router = useRouter()
const route = useRoute()

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
    //获取个人信息失败
    if (res.data.code !== 200) {
      ElMessage.error('获取个人信息失败')
      //获取失败失败,置为false
      isLoading.value = false

      //打印数据
      console.log(res.data)

      throw new Error('获取个人信息失败')
    }
    //登录成功
    return res.data
  })
  if (info.data.identity === '学生' || info.data.identity === '导师') {
    //登录失败
    ElMessage.error('登录失败')
    //结束请求,置为false
    isLoading.value = false
    throw new Error('学生、导师不可登录后台')
  }

  //保存用户identity、grade
  window.localStorage.setItem('identity', info.data.identity)
  window.localStorage.setItem('grade', info.data.grade)

  //结束请求,置为false
  isLoading.value = false

  //登录成功
  ElMessage.success('登录成功')
  let directAsString = route.query && route.query.direct ? String(route.query.direct) : '/admin'
  router.push(directAsString)
}
</script>

<template>
  <div class="backGround">
    <img
      src="@/assets/adminLoginReturn.svg"
      alt="返回用户登录按钮"
      class="adminReturn"
      @click="router.push({ name: 'login' })"
    />
    <div class="loginBox">
      <div class="login-part">
        <el-form :model="form" size="large">
          <img src="@/assets/adminLogo.svg" alt="管理员logo" class="adminLogo" />
          <div class="title">
            <p>管理员登录</p>
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
        </el-form>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.backGround {
  height: 100%;
  width: 100%;
  background: linear-gradient(to bottom right, #ffffff, #777777);

  display: flex;
  align-items: center;
  justify-content: center;
}

.adminReturn {
  position: fixed;
  top: 2rem;
  left: 2rem;

  width: 5rem;
  height: 5rem;
}

.adminReturn:hover {
  transform: scale(1.3);
}

.loginBox {
  width: 40%;
  height: 88%;
  background-color: #fff;
  border-radius: 10px;

  display: flex;
  align-items: center;
}

.login-part {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .el-form {
    display: flex;
    align-items: center;
    flex-direction: column;
    width: 100%;

    .adminLogo {
      width: 20%;
      height: 20%;
    }

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

.login-button {
  .el-button {
    font-weight: bold;
  }
  margin-top: 1.2rem;
}
</style>
