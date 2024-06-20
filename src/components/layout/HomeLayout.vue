<script setup lang="ts">
import HomeAside from '@/components/layout/HomeAside.vue'
import HomeHeader from '@/components/layout/HomeHeader.vue'
import { getInstructListByStu } from '@/api/chooseMentor/getInstructListByStu'
import { RouterView } from 'vue-router'

const getInstructList = async () => {
  const stuId = window.localStorage.getItem('id')
  const data = await getInstructListByStu(stuId).then((res) => {
    if (res.data.code !== 200) {
      ElMessage.error('获取导师关系失败')
      throw new Error('获取导师关系失败')
    }
    return res.data
  })
  for (let item of data.data.instructs) {
    if (item.permit === '1') {
      window.localStorage.setItem('instructId', item.id)
      window.localStorage.setItem('teacherId', item.teacherId)
      window.localStorage.setItem('teacherName', item.teacherName)
      window.localStorage.setItem('state', item.state)
      window.localStorage.setItem('title', item.title)
      break
    }
  }
}
getInstructList()
</script>

<template>
  <el-container>
    <HomeAside></HomeAside>
    <el-container class="header-and-main">
      <HomeHeader></HomeHeader>
      <el-main class="main">
        <RouterView></RouterView>
      </el-main>
    </el-container>
  </el-container>
</template>

<style lang="scss" scoped>
.header-and-main {
  flex-direction: column;
  height: 100vh;
}

.main {
  background-color: #fff;
  padding: 0;
  margin: 0;
}
</style>
