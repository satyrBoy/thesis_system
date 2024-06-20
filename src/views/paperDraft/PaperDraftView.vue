<script setup lang="ts">
import { getInstructListByStu } from '@/api/chooseMentor/getInstructListByStu'
import { getPaperDraftList } from '@/api/paperDraft/getPaperDraftList'
import { downloadPaperDraft } from '@/api/paperDraft/downloadPaperDraft'
import { reactive, ref } from 'vue'
const stuid = window.localStorage.getItem('id')
const instructId = window.localStorage.getItem('instructId')
const state = ref('')
const papaerDraft = reactive({
  content: '',
  comment: ''
})
const prefix = 'http://101.132.245.82:8048/mediaFile/'
const myHeaders = {
  Authorization: window.localStorage.getItem('tokenInfo')
}

onBeforeMount(() => {
  getInfo()
})

const getInfo = async () => {
  const dataInstruct = await getInstructListByStu(stuid).then((res) => {
    if (res.data.code !== 200) {
      ElMessage.error('获取关系失败')
      throw new Error('获取关系失败')
    }
    return res.data
  })

  for (let item of dataInstruct.data.instructs) {
    if (item.permit === '1') {
      state.value = item.state
      window.localStorage.setItem('state', item.state)
      window.localStorage.setItem('title', item.title)
      break
    }
  }

  const paperDraftData = await getPaperDraftList(instructId).then((res) => {
    if (res.data.code !== 200) {
      ElMessage.error('获取论文初稿失败')
      throw new Error('获取论文初稿失败')
    }

    return res.data
  })
  const paperDraftList = ref([])
  paperDraftList.value = paperDraftData.data.paperDrafts
  for (let item of paperDraftList.value) {
    papaerDraft.content = item.content
    papaerDraft.comment = item.comment
  }
}

const beforePdfUpload = (rawFile) => {
  const isPdf = rawFile.type === 'application/pdf'
  const isLt20M = rawFile.size / 1024 / 1024 < 20
  if (!isPdf) {
    ElMessage.error('请上传PDF格式文件!')
  }
  if (!isLt20M) {
    ElMessage.error('PDF文件不得超过20M')
  }
  return isPdf && isLt20M
}

const handlePdfSuccess = (response) => {
  papaerDraft.content = response.data.filename
}

const downloadPaperDraftFile = async () => {
  const data = await downloadPaperDraft(papaerDraft.content).then((res) => {
    return res.data
  })
  const blob = new Blob([data], { type: 'application/pdf' })
  const download_url = window.URL.createObjectURL(blob)
  const eleLink = document.createElement('a')
  eleLink.href = download_url
  eleLink.download = papaerDraft.content
  document.body.appendChild(eleLink)
  eleLink.click()
}
</script>

<template>
  <div class="main">
    <div class="pdf">
      <embed
        :src="prefix + papaerDraft.content"
        type="application/pdf"
        v-show="papaerDraft.content !== ''"
      />
      <div class="blank" v-show="papaerDraft.content === ''">
        <img src="@/assets/none.svg" alt="" />
        <p>尚未上传论文初稿</p>
      </div>
    </div>
    <div class="commit">
      <div class="title"><p>详细信息</p></div>
      <div class="paperDraft">
        <p>论文初稿:</p>
        <el-upload
          action="/paper/paperdraft/upload"
          :data="{ instructId: instructId }"
          :on-success="handlePdfSuccess"
          :headers="myHeaders"
          :before-upload="beforePdfUpload"
          v-show="papaerDraft.content === ''"
        >
          <el-button type="primary" color="#323639">上传pdf</el-button>
        </el-upload>
        <el-button
          type="primary"
          color="#444444"
          v-show="papaerDraft.content !== ''"
          @click="downloadPaperDraftFile"
          >下载</el-button
        >
      </div>
      <div class="comment">
        <p>导师意见:</p>
        <el-scrollbar height="450px">
          <div class="content">
            {{ papaerDraft.comment !== '' ? papaerDraft.comment : '暂无导师意见' }}
          </div>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.main {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
}
.pdf {
  width: 70%;
  height: 100%;
  embed {
    width: 99%;
    height: 98%;
  }
  embed::-webkit-scrollbar {
    display: none;
  }

  .blank {
    width: 99%;
    height: 98%;
    background-color: #525659;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 3rem;
      height: 3rem;
      margin-right: 1rem;
    }

    p {
      font-weight: bold;
      color: #fff;
    }
  }
}

.commit {
  width: 30%;
  height: 100%;
  background-color: #eeeeee;

  .title {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #444444;
    p {
      color: #fff;
      font-weight: bold;
    }
    border: 2px solid #fff;
    border-left: 0px;
    border-right: 0px;
  }

  p {
    font-weight: bold;
    color: #303133;
  }

  .paperDraft {
    display: flex;
    align-items: center;
    margin-left: 1rem;
    margin-top: 2rem;
    .el-button {
      margin-left: 2rem;
    }

    .el-upload .el-button {
      margin-top: 10px;
    }
  }

  .comment {
    margin-left: 1rem;
    margin-top: 2rem;

    .content {
      padding: 0.2rem;
      height: 450px;
      widows: 100px;
      overflow: scroll;
    }

    .content::-webkit-scrollbar {
      display: none;
    }
  }
}
</style>
