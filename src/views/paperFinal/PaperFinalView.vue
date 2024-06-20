<script setup lang="ts">
import { getInstructListByStu } from '@/api/chooseMentor/getInstructListByStu'
import { getPaperFinalList } from '@/api/paperFinal/getPaperFinalList'
import { downloadPaperFinal } from '@/api/paperFinal/downloadPaperFinal'
import { commitCheckResult } from '@/api/paperFinal/commitCheckResult'
import { onBeforeMount, reactive, ref } from 'vue'
const stuid = window.localStorage.getItem('id')
const instructId = window.localStorage.getItem('instructId')
const state = ref('')
const checkResultForm = ref(0)
const paperFinal = reactive({
  content: '',
  comment: '',
  checkResult: ''
})
const paperFinalId = ref('')
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

  const paperFinalData = await getPaperFinalList(instructId).then((res) => {
    if (res.data.code !== 200) {
      ElMessage.error('获取论文终稿失败')
      throw new Error('获取论文终稿失败')
    }

    return res.data
  })
  const paperFinalList = ref([])
  paperFinalList.value = paperFinalData.data.paperFinals
  for (let item of paperFinalList.value) {
    paperFinalId.value = item.id
    paperFinal.content = item.content
    paperFinal.comment = item.comment
    paperFinal.checkResult = item.checkResult
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
  paperFinal.content = response.data.filename
}

const downloadPaperFinalFile = async () => {
  const data = await downloadPaperFinal(paperFinal.content).then((res) => {
    return res.data
  })
  const blob = new Blob([data], { type: 'application/pdf' })
  const download_url = window.URL.createObjectURL(blob)
  const eleLink = document.createElement('a')
  eleLink.href = download_url
  eleLink.download = paperFinal.content
  document.body.appendChild(eleLink)
  eleLink.click()
}

const commitCheckRate = async () => {
  const rateStr = String(checkResultForm.value) + '%'
  await commitCheckResult(paperFinalId.value, rateStr).then((res) => {
    // if (res.data.code !== 200) {
    //   ElMessage.error('提交查重率失败')
    //   throw new Error('提交查重率失败')
    // }
    return res.data
  })
  paperFinal.checkResult = rateStr
}
</script>

<template>
  <div class="main">
    <div class="pdf">
      <embed
        :src="prefix + paperFinal.content"
        type="application/pdf"
        v-show="paperFinal.content !== ''"
      />
      <div class="blank" v-show="paperFinal.content === ''">
        <img src="@/assets/none.svg" alt="" />
        <p>尚未上传论文终稿</p>
      </div>
    </div>
    <div class="commit">
      <div class="title"><p>详细信息</p></div>
      <div class="paperFinal">
        <p>论文终稿:</p>
        <el-upload
          action="/paper/paperfinal/upload"
          :data="{ instructId: instructId }"
          :on-success="handlePdfSuccess"
          :headers="myHeaders"
          :before-upload="beforePdfUpload"
          v-show="paperFinal.content === ''"
        >
          <el-button type="primary" color="#323639">上传pdf</el-button>
        </el-upload>
        <el-button
          type="primary"
          color="#444444"
          v-show="paperFinal.content !== ''"
          @click="downloadPaperFinalFile"
          >下载</el-button
        >
      </div>
      <div class="rate" v-show="paperFinal.content !== ''">
        <p>查重率:</p>
        <div class="commitRate" v-show="paperFinal.checkResult === '' && paperFinal.content !== ''">
          <el-input-number v-model="checkResultForm" :min="0" :max="100" />
          <el-button type="primary" color="#444444" @click="commitCheckRate">提交</el-button>
        </div>
        <div
          class="rateContent"
          v-show="paperFinal.checkResult !== '' && paperFinal.content !== ''"
        >
          {{ paperFinal.checkResult }}
        </div>
      </div>
      <div class="result">
        <p>论文结果:</p>
        <div v-show="state !== '6' && state !== '7'">尚未确定</div>
        <div v-show="state === '6'">
          <el-tag type="success" effect="dark"> 合格 </el-tag>
        </div>
        <div v-show="state === '7'">
          <el-tag type="danger" effect="dark"> 不合格 </el-tag>
        </div>
      </div>
      <div class="comment">
        <p>导师意见:</p>
        <el-scrollbar height="330px">
          <div class="content">
            {{ paperFinal.comment !== '' ? paperFinal.comment : '暂无导师意见' }}
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

  .paperFinal {
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

  .rate {
    display: flex;
    align-items: center;
    margin-left: 1rem;
    margin-top: 2rem;
    .el-input-number {
      margin-left: 1rem;
      margin-right: 1rem;
    }

    .rateContent {
      margin-left: 2rem;
    }
  }

  .result {
    display: flex;
    align-items: center;
    margin-left: 1rem;
    margin-top: 2rem;
    p {
      margin-right: 2rem;
    }
  }

  .comment {
    margin-left: 1rem;
    margin-top: 2rem;

    .content {
      padding: 0.2rem;
      height: 330px;
      widows: 100px;
      overflow: scroll;
    }

    .content::-webkit-scrollbar {
      display: none;
    }
  }
}
</style>
