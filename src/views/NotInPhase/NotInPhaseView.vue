<script setup lang="ts">
const identity = window.localStorage.getItem('identity')
</script>

<template>
  <div class="mainBox">
    <div class="infoBox">
      <img src="@/assets/NoPhase.svg" alt="" />
      <p>您暂无参与论文流程</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.mainBox {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.infoBox {
  img {
    width: 5rem;
    height: 5rem;
  }
  p {
    font-size: 2rem;
  }
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
