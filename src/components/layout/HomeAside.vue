<script setup lang="ts">
import { isCollapseInHome } from '@/components/layout/isCollapseInHome.js'
import { computed, ref } from 'vue'

import { useRouter } from 'vue-router'

const router = useRouter()
const process = window.localStorage.getItem('process')
const state = ref(window.localStorage.getItem('state'))
const title = ref(window.localStorage.getItem('title'))

const clickJump = (targetState) => {
  if (targetState === 1) {
    if (parseInt(state.value) >= 1 && title.value !== '') {
      router.push({ name: 'stuProposalDraft' })
    }
  } else if (targetState === 2) {
    if (parseInt(state.value) >= 2) {
      router.push({ name: 'stuProposalFormal' })
    }
  } else if (targetState === 3) {
    if (parseInt(state.value) >= 3) {
      router.push({ name: 'stuPaperDraft' })
    }
  } else if (targetState === 4) {
    if (parseInt(state.value) >= 4) {
      router.push({ name: 'stuPaperFormal' })
    }
  } else if (targetState === 5) {
    if (parseInt(state.value) >= 5) {
      router.push({ name: 'stuPaperFinal' })
    }
  }
}

const showIconZero = computed(() => {
  return parseInt(state.value) >= 1 && title.value !== ''
})

const showIconOne = computed(() => {
  return parseInt(state.value) > 1 && title.value !== ''
})

const showIconOneEqual = computed(() => {
  return parseInt(state.value) === 1 && title.value !== ''
})

const showIconTwo = computed(() => {
  return parseInt(state.value) > 2
})

const showIconTwoEqual = computed(() => {
  return parseInt(state.value) === 2
})

const showIconThree = computed(() => {
  return parseInt(state.value) > 3
})
const showIconThreeEqual = computed(() => {
  return parseInt(state.value) === 3
})

const showIconFour = computed(() => {
  return parseInt(state.value) > 4
})
const showIconFourEqual = computed(() => {
  return parseInt(state.value) === 4
})

const showIconFive = computed(() => {
  return parseInt(state.value) > 5
})

const showIconFiveEqual = computed(() => {
  return parseInt(state.value) === 5
})
</script>

<template>
  <el-aside>
    <el-menu class="el-menu-vertical-demo" :collapse="isCollapseInHome" unique-opened router>
      <a href="/" class="logo">
        <img src="@/assets/system-logo.svg" alt="" />
        <h1></h1>
      </a>

      <el-menu-item @click="router.push({ name: 'stuChooseMentor' })">
        <IEpCircleCheck class="icon" v-show="showIconZero && process === '2'" />
        <IEpView class="icon" v-show="!showIconZero && process === '2'" />
        <IEpRemove class="icon" v-show="process !== '2'" />
        <span>选择导师</span>
      </el-menu-item>

      <el-menu-item @click="clickJump(1)">
        <IEpCircleCheck class="icon" v-show="showIconOne && process === '2'" />
        <IEpView class="icon" v-show="showIconOneEqual && process === '2'" />
        <IEpRemove class="icon" v-show="(!showIconOne && !showIconOneEqual) || process !== '2'" />
        <span>开题报告初稿</span>
      </el-menu-item>

      <el-menu-item @click="clickJump(2)">
        <IEpCircleCheck class="icon" v-show="showIconTwo && process === '2'" />
        <IEpView class="icon" v-show="showIconTwoEqual && process === '2'" />
        <IEpRemove class="icon" v-show="(!showIconTwo && !showIconTwoEqual) || process !== '2'" />
        <span>开题报告正式稿</span>
      </el-menu-item>

      <el-menu-item @click="clickJump(3)">
        <IEpCircleCheck class="icon" v-show="showIconThree && process === '2'" />
        <IEpView class="icon" v-show="showIconThreeEqual && process === '2'" />
        <IEpRemove
          class="icon"
          v-show="(!showIconThree && !showIconThreeEqual) || process !== '2'"
        />
        <span>论文初稿</span>
      </el-menu-item>

      <el-menu-item @click="clickJump(4)">
        <IEpCircleCheck class="icon" v-show="showIconFour && process === '2'" />
        <IEpView class="icon" v-show="showIconFourEqual && process === '2'" />
        <IEpRemove class="icon" v-show="(!showIconFour && !showIconFourEqual) || process !== '2'" />
        <span>论文正式稿</span>
      </el-menu-item>

      <el-menu-item @click="clickJump(5)">
        <IEpCircleCheck class="icon" v-show="showIconFive && process === '2'" />
        <IEpView class="icon" v-show="showIconFiveEqual && process === '2'" />
        <IEpRemove class="icon" v-show="(!showIconFive && !showIconFiveEqual) || process !== '2'" />
        <span>论文终稿</span>
      </el-menu-item>
    </el-menu>
  </el-aside>
</template>

<style lang="scss">
.el-aside {
  background-color: #f1f6fa;
  height: 100vh;
  width: auto;
}

.logo {
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  color: black;
  height: 80px;
  img {
    width: 50px;
    height: 50px;
  }
}

// 设置菜单样式
.el-menu {
  background-color: #f1f6fa;
  border-right: none;
  width: 200px;
  &.el-menu--collapse {
    width: 60px;
    & h1 {
      display: none;
    }
  }
}

.icon {
  margin-right: 1rem;
}
</style>
