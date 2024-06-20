<script setup lang="ts">
import { downloadProposalFormal } from '@/api/proposalFormal/downloadProposalFormal'
const downloadProposalFormalFile = async (filepath) => {
  const data = await downloadProposalFormal(filepath).then((res) => {
    return res.data
  })
  const blob = new Blob([data], { type: 'application/pdf' })
  const download_url = window.URL.createObjectURL(blob)
  const eleLink = document.createElement('a')
  eleLink.href = download_url
  eleLink.download = filepath
  document.body.appendChild(eleLink)
  eleLink.click() //模拟下载文件
}
</script>

<template>
  <div>
    <el-button
      type="success"
      @click="
        downloadProposalFormalFile('5f500d31-657e-48cc-b421-bdf350a964d1_2024-05-17_17-13-14.pdf')
      "
      >下载</el-button
    >
  </div>
</template>

<style lang="scss" scoped></style>
