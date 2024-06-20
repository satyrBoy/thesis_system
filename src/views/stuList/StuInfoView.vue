<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { getAllStuList } from '@/api/chooseMentor/getAllStuList'
import { getProposalDraftList } from '@/api/proposalDraft/getProposalDraftList'
import { getProposalFormalList } from '@/api/proposalFormal/getProposalFormalList'
import { getPaperDraftList } from '@/api/paperDraft/getPaperDraftList'
import { getPaperFormalList } from '@/api/paperFormal/getPaperFormalList'
import { getPaperFinalList } from '@/api/paperFinal/getPaperFinalList'
import { downloadProposalDraft } from '@/api/proposalDraft/downloadProposalDraft'
import { downloadProposalFormal } from '@/api/proposalFormal/downloadProposalFormal'
import { downloadPaperDraft } from '@/api/paperDraft/downloadPaperDraft'
import { downloadPaperFormal } from '@/api/paperFormal/downloadPaperFormal'
import { downloadPaperFinal } from '@/api/paperFinal/downloadPaperFinal'
import { proposalDraftComment } from '@/api/proposalDraft/proposalDraftComment'
import { proposalFormalComment } from '@/api/proposalFormal/proposalFormalComment'
import { paperDraftComment } from '@/api/paperDraft/paperDraftComment'
import { paperFormalComment } from '@/api/paperFormal/paperFormalComment'
import { paperFinalComment } from '@/api/paperFinal/paperFinalComment'
import { updateState } from '@/api/state/updateState'
import { onBeforeMount, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const stuId = ref('')
const stuName = ref('')
const teacherId = ref('')
const instructId = ref('')
const state = ref('')
const title = ref('')

const proposalDraft = reactive({
  id: '',
  content: '',
  comment: ''
})
const proposalFormal = reactive({
  id: '',
  content: '',
  comment: ''
})
const paperDraft = reactive({
  id: '',
  content: '',
  comment: ''
})
const paperFormal = reactive({
  id: '',
  content: '',
  comment: ''
})
const paperFinal = reactive({
  id: '',
  content: '',
  comment: '',
  checkResult: ''
})

const getInstructInfo = async () => {
  const data = await getAllStuList(teacherId.value).then((res) => {
    if (res.data.code !== 200) {
      ElMessage.error('获取学生关系失败')
      console.log(res.data)
      throw new Error('获取学生关系失败')
    }

    return res.data
  })
  const instructList = ref([])
  instructList.value = data.data.instructs
  for (let item of instructList.value) {
    if (item.stuId === stuId.value && item.teacherId === teacherId.value) {
      instructId.value = item.id
      stuName.value = item.stuName
      state.value = item.state
      title.value = item.title
      break
    }
  }

  //开题初稿
  const proposalDraftData = await getProposalDraftList(instructId.value).then((res) => {
    if (res.data.code !== 200) {
      ElMessage.error('获取开题报告初稿失败')
      console.log(res.data)
      throw new Error('获取开题报告初稿失败')
    }

    return res.data
  })
  const proposalDraftList = ref([])
  proposalDraftList.value = proposalDraftData.data.proposalDrafts
  for (let item of proposalDraftList.value) {
    proposalDraft.id = item.id
    proposalDraft.content = item.content
    proposalDraft.comment = item.comment
  }

  //开题正式稿
  const proposalFormalData = await getProposalFormalList(instructId.value).then((res) => {
    if (res.data.code !== 200) {
      ElMessage.error('获取开题报告正式稿失败')
      console.log(res.data)
      throw new Error('获取开题报告正式稿失败')
    }

    return res.data
  })
  const proposalFormalList = ref([])
  proposalFormalList.value = proposalFormalData.data.proposalFormals
  for (let item of proposalFormalList.value) {
    proposalFormal.id = item.id
    proposalFormal.content = item.content
    proposalFormal.comment = item.comment
  }

  //论文初稿
  const paperDraftData = await getPaperDraftList(instructId.value).then((res) => {
    if (res.data.code !== 200) {
      ElMessage.error('获取论文初稿失败')
      console.log(res.data)
      throw new Error('获取论文初稿失败')
    }

    return res.data
  })
  const paperDraftList = ref([])
  paperDraftList.value = paperDraftData.data.paperDrafts
  for (let item of paperDraftList.value) {
    paperDraft.id = item.id
    paperDraft.content = item.content
    paperDraft.comment = item.comment
  }

  //论文正式稿
  const paperFormalData = await getPaperFormalList(instructId.value).then((res) => {
    if (res.data.code !== 200) {
      ElMessage.error('获取论文正式稿失败')
      console.log(res.data)
      throw new Error('获取论文正式稿失败')
    }

    return res.data
  })
  const paperFormalList = ref([])
  paperFormalList.value = paperFormalData.data.paperFormals
  for (let item of paperFormalList.value) {
    paperFormal.id = item.id
    paperFormal.content = item.content
    paperFormal.comment = item.comment
  }

  //论文终稿
  const paperFinalData = await getPaperFinalList(instructId.value).then((res) => {
    if (res.data.code !== 200) {
      ElMessage.error('获取论文终稿失败')
      console.log(res.data)
      throw new Error('获取论文终稿失败')
    }

    return res.data
  })
  const paperFinalList = ref([])
  paperFinalList.value = paperFinalData.data.paperFinals
  for (let item of paperFinalList.value) {
    paperFinal.id = item.id
    paperFinal.content = item.content
    paperFinal.comment = item.comment
    paperFinal.checkResult = item.checkResult
  }
}

onBeforeMount(() => {
  stuId.value = String(route.params.stuId)
  teacherId.value = window.localStorage.getItem('id')
  getInstructInfo()
})

const currentStep = ref(0)
const clickStep = (step) => {
  if (step === 0) {
    currentStep.value = 0
  } else if (step === 1) {
    if (parseInt(state.value) >= 1 && title.value !== '') {
      currentStep.value = 1
    }
  } else if (step === 2) {
    if (parseInt(state.value) >= 2) {
      currentStep.value = 2
    }
  } else if (step === 3) {
    if (parseInt(state.value) >= 3) {
      currentStep.value = 3
    }
  } else if (step === 4) {
    if (parseInt(state.value) >= 4) {
      currentStep.value = 4
    }
  } else {
    if (parseInt(state.value) >= 5) {
      currentStep.value = 5
    }
  }
}

const downloadProposalDraftFile = async (filepath) => {
  const data = await downloadProposalDraft(filepath).then((res) => {
    // if (res.data.code !== 200) {
    //   ElMessage.error('下载失败')
    //   throw new Error('下载失败')
    // }
    return res.data
  })
  const blob = new Blob([data], { type: 'application/pdf' })
  const download_url = window.URL.createObjectURL(blob)
  const eleLink = document.createElement('a')
  eleLink.href = download_url
  eleLink.download = filepath
  document.body.appendChild(eleLink)
  eleLink.click()
}

const downloadProposalFormalFile = async (filepath) => {
  const data = await downloadProposalFormal(filepath).then((res) => {
    // if (res.data.code !== 200) {
    //   ElMessage.error('下载失败')
    //   throw new Error('下载失败')
    // }
    return res.data
  })
  const blob = new Blob([data], { type: 'application/pdf' })
  const download_url = window.URL.createObjectURL(blob)
  const eleLink = document.createElement('a')
  eleLink.href = download_url
  eleLink.download = filepath
  document.body.appendChild(eleLink)
  eleLink.click()
}

const downloadPaperDraftFile = async (filepath) => {
  const data = await downloadPaperDraft(filepath).then((res) => {
    // if (res.data.code !== 200) {
    //   ElMessage.error('下载失败')
    //   throw new Error('下载失败')
    // }
    return res.data
  })
  const blob = new Blob([data], { type: 'application/pdf' })
  const download_url = window.URL.createObjectURL(blob)
  const eleLink = document.createElement('a')
  eleLink.href = download_url
  eleLink.download = filepath
  document.body.appendChild(eleLink)
  eleLink.click()
}

const downloadPaperFormalFile = async (filepath) => {
  const data = await downloadPaperFormal(filepath).then((res) => {
    // if (res.data.code !== 200) {
    //   ElMessage.error('下载失败')
    //   throw new Error('下载失败')
    // }
    return res.data
  })
  const blob = new Blob([data], { type: 'application/pdf' })
  const download_url = window.URL.createObjectURL(blob)
  const eleLink = document.createElement('a')
  eleLink.href = download_url
  eleLink.download = filepath
  document.body.appendChild(eleLink)
  eleLink.click()
}

const downloadPaperFinalFile = async (filepath) => {
  const data = await downloadPaperFinal(filepath).then((res) => {
    // if (res.data.code !== 200) {
    //   ElMessage.error('下载失败')
    //   throw new Error('下载失败')
    // }
    return res.data
  })
  const blob = new Blob([data], { type: 'application/pdf' })
  const download_url = window.URL.createObjectURL(blob)
  const eleLink = document.createElement('a')
  eleLink.href = download_url
  eleLink.download = filepath
  document.body.appendChild(eleLink)
  eleLink.click()
}

const proposalDraftCmt = ref('')
const commentProposalDraft = async () => {
  if (proposalDraftCmt.value === '') {
    ElMessage.error('导师意见不可为空')
    return
  }

  if (proposalDraftCmt.value.length >= 200) {
    ElMessage.error('导师意见不可超过200字')
    return
  }
  await proposalDraftComment(proposalDraft.id, proposalDraftCmt.value).then((res) => {
    if (res.data.code !== 200) {
      ElMessage.error('提交导师意见失败')
      console.log(res.data)
      throw new Error('提交导师意见失败')
    }

    return res.data
  })
  proposalDraft.comment = proposalDraftCmt.value
  ElMessage.success('提交导师意见成功')
}

const proposalFormalCmt = ref('')
const commentProposalFormal = async () => {
  if (proposalFormalCmt.value === '') {
    ElMessage.error('导师意见不可为空')
    return
  }

  if (proposalFormalCmt.value.length >= 200) {
    ElMessage.error('导师意见不可超过200字')
    return
  }
  await proposalFormalComment(proposalFormal.id, proposalFormalCmt.value).then((res) => {
    if (res.data.code !== 200) {
      ElMessage.error('提交导师意见失败')
      console.log(res.data)
      throw new Error('提交导师意见失败')
    }

    return res.data
  })
  proposalFormal.comment = proposalFormalCmt.value
  ElMessage.success('提交导师意见成功')
}

const paperDraftCmt = ref('')
const commentPaperDraft = async () => {
  if (paperDraftCmt.value === '') {
    ElMessage.error('导师意见不可为空')
    return
  }

  if (paperDraftCmt.value.length >= 200) {
    ElMessage.error('导师意见不可超过200字')
    return
  }
  await paperDraftComment(paperDraft.id, paperDraftCmt.value).then((res) => {
    if (res.data.code !== 200) {
      ElMessage.error('提交导师意见失败')
      console.log(res.data)
      throw new Error('提交导师意见失败')
    }

    return res.data
  })
  paperDraft.comment = paperDraftCmt.value
  ElMessage.success('提交导师意见成功')
}

const paperFormalCmt = ref('')
const commentPaperFormal = async () => {
  if (paperFormalCmt.value === '') {
    ElMessage.error('导师意见不可为空')
    return
  }

  if (paperFormalCmt.value.length >= 200) {
    ElMessage.error('导师意见不可超过200字')
    return
  }
  await paperFormalComment(paperFormal.id, paperFormalCmt.value).then((res) => {
    if (res.data.code !== 200) {
      ElMessage.error('提交导师意见失败')
      console.log(res.data)
      throw new Error('提交导师意见失败')
    }

    return res.data
  })
  paperFormal.comment = paperFormalCmt.value
  ElMessage.success('提交导师意见成功')
}

const paperFinalCmt = ref('')
const commentPaperFinal = async () => {
  if (paperFinalCmt.value === '') {
    ElMessage.error('导师意见不可为空')
    return
  }

  if (paperFinalCmt.value.length >= 200) {
    ElMessage.error('导师意见不可超过200字')
    return
  }
  await paperFinalComment(paperFinal.id, paperFinalCmt.value).then((res) => {
    if (res.data.code !== 200) {
      ElMessage.error('提交导师意见失败')
      console.log(res.data)
      throw new Error('提交导师意见失败')
    }

    return res.data
  })
  paperFinal.comment = paperFinalCmt.value
  ElMessage.success('提交导师意见成功')
}

const updateInstructState = async (targetState) => {
  await updateState(instructId.value, targetState).then((res) => {
    if (res.data.code !== 200) {
      ElMessage.error('通过本阶段请求失败')
      console.log(res.data)
      throw new Error('通过本阶段请求失败')
    }

    return res.data
  })
  state.value = targetState
  ElMessage.success('成功通过本阶段')
}

const commitState = () => {
  const stateInt = parseInt(state.value)
  const targetStateInt = stateInt + 1
  updateInstructState(String(targetStateInt))
}

const pass = () => {
  updateInstructState('6')
}

const fail = () => {
  updateInstructState('7')
}

const hasCurrentStateComment = () => {
  if (state.value === '1') {
    return proposalDraft.comment !== ''
  } else if (state.value === '2') {
    return proposalFormal.comment !== ''
  } else if (state.value === '3') {
    return paperDraft.comment !== ''
  } else if (state.value === '4') {
    return paperFormal.comment !== ''
  }
}
</script>

<template>
  <div>
    <el-page-header @back="router.push({ name: 'stuList' })">
      <template #content>
        <div>
          <span> 查看 {{ stuName }} 论文 </span>
        </div>
      </template>
    </el-page-header>
    <el-card class="box-card">
      <template #header>
        <el-steps :space="300" :active="currentStep" align-center>
          <el-step title="开题" @click="clickStep(0)" />
          <el-step title="开题报告初稿" @click="clickStep(1)" />
          <el-step title="开题报告正式稿" @click="clickStep(2)" />
          <el-step title="论文初稿" @click="clickStep(3)" />
          <el-step title="论文正式稿" @click="clickStep(4)" />
          <el-step title="论文终稿" @click="clickStep(5)" />
        </el-steps>
      </template>
      <div v-show="currentStep === 0">
        <div class="title">
          <p>论文开题:</p>
          <div>
            {{ title === '' ? '该学生尚未开题' : title }}
          </div>
        </div>
      </div>

      <div v-show="currentStep === 1">
        <div class="proposalDraft">
          <p>开题报告初稿:</p>
          <div>
            <div v-show="proposalDraft.content !== ''">
              <el-button
                type="success"
                @click="downloadProposalDraftFile(proposalDraft.content)"
                color="#444444"
                >下载</el-button
              >
            </div>
            <div v-show="proposalDraft.content === ''">尚未提交开题报告初稿</div>
          </div>
        </div>
        <div class="proposalDraft" v-show="proposalDraft.content !== ''">
          <p>导师意见:</p>
          <div>
            <div v-show="proposalDraft.comment === ''" class="commitRow">
              <el-input
                :autosize="{ minRows: 1, maxRows: 4 }"
                type="textarea"
                placeholder="请输入导师意见"
                v-model="proposalDraftCmt"
              />
              <el-button type="success" @click="commentProposalDraft" color="#444444"
                >提交</el-button
              >
            </div>
            <div v-show="proposalDraft.comment !== ''">{{ proposalDraft.comment }}</div>
          </div>
        </div>
      </div>

      <div v-show="currentStep === 2">
        <div class="proposalDraft">
          <p>开题报告正式稿:</p>
          <div>
            <div v-show="proposalFormal.content !== ''">
              <el-button
                type="success"
                @click="downloadProposalFormalFile(proposalFormal.content)"
                color="#444444"
                >下载</el-button
              >
            </div>
            <div v-show="proposalFormal.content === ''">尚未提交开题报告正式稿</div>
          </div>
        </div>
        <div class="proposalDraft" v-show="proposalFormal.content !== ''">
          <p>导师意见:</p>
          <div>
            <div v-show="proposalFormal.comment === ''" class="commitRow">
              <el-input
                :autosize="{ minRows: 1, maxRows: 4 }"
                type="textarea"
                placeholder="请输入导师意见"
                v-model="proposalFormalCmt"
              />
              <el-button type="success" color="#444444" @click="commentProposalFormal"
                >提交</el-button
              >
            </div>
            <div v-show="proposalFormal.comment !== ''">{{ proposalFormal.comment }}</div>
          </div>
        </div>
      </div>

      <div v-show="currentStep === 3">
        <div class="proposalDraft">
          <p>论文初稿:</p>
          <div>
            <div v-show="paperDraft.content !== ''">
              <el-button
                type="success"
                @click="downloadPaperDraftFile(paperDraft.content)"
                color="#444444"
                >下载</el-button
              >
            </div>
            <div v-show="paperDraft.content === ''">尚未提交论文初稿</div>
          </div>
        </div>
        <div class="proposalDraft" v-show="paperDraft.content !== ''">
          <p>导师意见:</p>
          <div>
            <div v-show="paperDraft.comment === ''" class="commitRow">
              <el-input
                :autosize="{ minRows: 1, maxRows: 4 }"
                type="textarea"
                placeholder="请输入导师意见"
                v-model="paperDraftCmt"
              />
              <el-button type="success" @click="commentPaperDraft" color="#444444">提交</el-button>
            </div>
            <div v-show="paperDraft.comment !== ''">{{ paperDraft.comment }}</div>
          </div>
        </div>
      </div>

      <div v-show="currentStep === 4">
        <div class="proposalDraft">
          <p>论文正式稿:</p>
          <div>
            <div v-show="paperFormal.content !== ''">
              <el-button
                type="success"
                @click="downloadPaperFormalFile(paperFormal.content)"
                color="#444444"
                >下载</el-button
              >
            </div>
            <div v-show="paperFormal.content === ''">尚未提交论文正式稿</div>
          </div>
        </div>
        <div class="proposalDraft" v-show="paperFormal.content !== ''">
          <p>导师意见:</p>
          <div>
            <div v-show="paperFormal.comment === ''" class="commitRow">
              <el-input
                :autosize="{ minRows: 1, maxRows: 4 }"
                type="textarea"
                placeholder="请输入导师意见"
                v-model="paperFormalCmt"
              />
              <el-button type="success" @click="commentPaperFormal" color="#444444">提交</el-button>
            </div>
            <div v-show="paperFormal.comment !== ''">{{ paperFormal.comment }}</div>
          </div>
        </div>
      </div>

      <div v-show="currentStep === 5">
        <div class="proposalDraft">
          <p>论文终稿:</p>
          <div>
            <div v-show="paperFinal.content !== ''">
              <el-button
                type="success"
                @click="downloadPaperFinalFile(paperFinal.content)"
                color="#444444"
                >下载</el-button
              >
            </div>
            <div v-show="paperFinal.content === ''">尚未提交论文终稿</div>
          </div>
        </div>
        <div class="proposalDraft">
          <p>查重率:</p>
          <div class="rate">
            <div v-show="paperFinal.checkResult !== ''">
              {{ paperFinal.checkResult }}
            </div>
            <div v-show="paperFinal.checkResult === ''">尚未提交查重结果</div>
          </div>
        </div>
        <div
          class="proposalDraft"
          v-show="paperFinal.content !== '' && paperFinal.checkResult !== ''"
        >
          <p>导师意见:</p>
          <div>
            <div v-show="paperFinal.comment === ''" class="commitRow">
              <el-input
                :autosize="{ minRows: 1, maxRows: 4 }"
                type="textarea"
                placeholder="请输入导师意见"
                v-model="paperFinalCmt"
              />
              <el-button type="success" @click="commentPaperFinal" color="#444444">提交</el-button>
            </div>
            <div v-show="paperFinal.comment !== ''">{{ paperFinal.comment }}</div>
          </div>
        </div>
        <div
          class="proposalDraft"
          v-show="
            paperFinal.content !== '' && paperFinal.checkResult !== '' && paperFinal.comment !== ''
          "
        >
          <p>论文结果:</p>
          <div>
            <div v-show="state !== '6' && state !== '7'">待导师确定</div>
            <div v-show="state === '6'">
              <el-tag type="success" effect="dark"> 合格 </el-tag>
            </div>
            <div v-show="state === '7'">
              <el-tag type="danger" effect="dark"> 不合格 </el-tag>
            </div>
          </div>
        </div>
      </div>
      <div class="bottom-btn">
        <el-button
          v-show="
            currentStep !== 0 &&
            currentStep !== 5 &&
            parseInt(state) === currentStep &&
            hasCurrentStateComment()
          "
          color="#303133"
          @click="commitState"
          >通过本阶段</el-button
        >
        <el-button
          v-show="
            currentStep === 5 &&
            state === '5' &&
            paperFinal.content !== '' &&
            paperFinal.checkResult !== '' &&
            paperFinal.comment !== ''
          "
          type="primary"
          @click="pass"
          >合格</el-button
        >
        <el-button
          v-show="
            currentStep === 5 &&
            state === '5' &&
            paperFinal.content !== '' &&
            paperFinal.checkResult !== '' &&
            paperFinal.comment !== ''
          "
          type="danger"
          @click="fail"
          >不合格</el-button
        >
      </div>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.box-card {
  margin-top: 1rem;
}

.el-page-header {
  margin-top: 1rem;
  margin-left: 1rem;
  margin-bottom: 2rem;
}

.bottom-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 0.5rem;
}

.title {
  margin-left: 6rem;
  display: flex;
  align-items: center;
  p {
    font-size: 1.3rem;
    font-weight: bold;
    color: #303133;
    margin-right: 2rem;
  }

  .rate {
    margin-left: 4rem;
  }
}

.proposalDraft {
  margin-left: 6rem;
  display: flex;
  align-items: center;
  p {
    font-size: 1.3rem;
    font-weight: bold;
    color: #303133;
    margin-right: 2rem;
  }

  .rate {
    margin-left: 2rem;
  }
}

.commitRow {
  display: flex;
  align-items: center;
  .el-button {
    margin-left: 2rem;
  }
}
</style>
