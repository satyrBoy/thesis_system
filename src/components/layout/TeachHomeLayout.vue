<script setup lang="ts">
import TeachHeader from '@/components/layout/TeachHeader.vue'
import { RouterView } from 'vue-router'
</script>

<template>
  <el-container>
    <el-container class="header-and-main">
      <TeachHeader></TeachHeader>
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
