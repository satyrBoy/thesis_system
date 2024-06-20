<script setup lang="ts">
import { computed, onBeforeMount, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getProposalDraftList } from '@/api/proposalDraft/getProposalDraftList'
import { getProposalFormalList } from '@/api/proposalFormal/getProposalFormalList'
import { getPaperDraftList } from '@/api/paperDraft/getPaperDraftList'
import { getPaperFormalList } from '@/api/paperFormal/getPaperFormalList'
import { getPaperFinalList } from '@/api/paperFinal/getPaperFinalList'
import { getInstructListByStu } from '@/api/chooseMentor/getInstructListByStu'
import { getCommittedMentorList } from '@/api/chooseMentor/getCommittedMentorList'
import { getAllowedMentorList } from '@/api/chooseMentor/getAllowedMentorList'
import { downloadProposalDraft } from '@/api/proposalDraft/downloadProposalDraft'
import { downloadProposalFormal } from '@/api/proposalFormal/downloadProposalFormal'
import { downloadPaperDraft } from '@/api/paperDraft/downloadPaperDraft'
import { downloadPaperFormal } from '@/api/paperFormal/downloadPaperFormal'
import { downloadPaperFinal } from '@/api/paperFinal/downloadPaperFinal'

const route = useRoute()
const router = useRouter()
const activeIndex = ref('1')
const stuId = ref('')
const stuName = ref('')
const phaseId = ref('')
const state = ref('')
const title = ref('')
const instructId = ref('')
const teacherId = ref('')
const teacherName = ref('')
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
onBeforeMount(() => {
  stuId.value = String(route.params.id)
  phaseId.value = String(route.params.phaseid)
  getInfo()
  if (!hasInstruct.value) {
    getAllowedList({
      pageNum: 1,
      pageSize: listPageSize.value
    })

    getCommittedList({
      pageNum: 1,
      pageSize: listSecondPageSize.value
    })
  }
})

const downloadProposalDraftFile = async (filepath) => {
  const data = await downloadProposalDraft(filepath).then((res) => {
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

const getInstructInfo = async () => {
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

const getInfo = async () => {
  const dataInstruct = await getInstructListByStu(stuId.value).then((res) => {
    if (res.data.code !== 200) {
      ElMessage.error('获取关系失败')
      throw new Error('获取关系失败')
    }
    return res.data
  })

  for (let item of dataInstruct.data.instructs) {
    if (item.permit === '1') {
      instructId.value = item.id
      stuName.value = item.stuName
      state.value = item.state
      title.value = item.title
      teacherId.value = item.teacherId
      teacherName.value = item.teacherName
      break
    }
  }

  if (hasInstruct.value) {
    getInstructInfo()
  }
}
const hasInstruct = computed(() => {
  return instructId.value !== ''
})

//切换事件
const handleClick = () => {
  getAllowedList({
    pageNum: 1,
    pageSize: listPageSize.value
  })

  getCommittedList({
    pageNum: 1,
    pageSize: listSecondPageSize.value
  })
}

//可申请导师数据
const records = ref([])
const listCurrentPage = ref(1)
const listPageSize = ref(10)
const total = ref(0)
const getAllowedList = async (queryCondition) => {
  const data = await getAllowedMentorList({
    phaseid: phaseId.value,
    stuid: stuId.value,
    pageNum: queryCondition.pageNum,
    pageSize: queryCondition.pageSize
  }).then((res) => {
    if (res.data.code !== 200) {
      ElMessage.error('获取可申请导师列表失败')
      throw new Error('获取可申请导师列表失败')
    }
    return res.data
  })

  records.value = data.data.users
  total.value = data.data.count
  listCurrentPage.value = queryCondition.pageNum
  listPageSize.value = queryCondition.pageSize
}

//已申请导师数据
const secondRecords = ref([])
const listSecondCurrentPage = ref(1)
const listSecondPageSize = ref(10)
const secondTotal = ref(0)
const getCommittedList = async (queryCondition) => {
  const data = await getCommittedMentorList({
    stuid: stuId.value,
    pageNum: queryCondition.pageNum,
    pageSize: queryCondition.pageSize
  }).then((res) => {
    if (res.data.code !== 200) {
      ElMessage.error('获取已申请导师列表失败')
      throw new Error('获取已申请导师列表失败')
    }
    return res.data
  })

  secondRecords.value = data.data.users.filter((item) => item.permit !== '1')
  secondTotal.value = data.data.count
  listSecondCurrentPage.value = queryCondition.pageNum
  listSecondPageSize.value = queryCondition.pageSize
}

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
</script>

<template>
  <div>
    <el-page-header @back="router.go(-1)">
      <template #content>
        <div class="flex items-center">
          <span class="text-large font-600 mr-3"> 查看学生 </span>
        </div>
      </template>
    </el-page-header>
    <el-tabs
      v-model="activeIndex"
      class="tabs"
      type="card"
      @tab-click="handleClick"
      v-show="!hasInstruct"
    >
      <el-tab-pane label="可申请导师" name="1"></el-tab-pane>
      <el-tab-pane label="已申请导师" name="2"></el-tab-pane>
    </el-tabs>
    <el-card class="box-card" v-show="!hasInstruct && activeIndex === '1'">
      <el-table :data="records" border style="width: 100%" empty-text="暂无可申请导师">
        <el-table-column prop="id" label="导师编号" align="center" />
        <el-table-column prop="username" label="导师姓名" align="center" />
        <el-table-column prop="grade" label="年级" align="center" />
      </el-table>

      <el-pagination
        :page-sizes="[5, 10]"
        :background="true"
        layout="total, sizes, prev, pager, next, jumper"
        v-model:current-page="listCurrentPage"
        v-model:page-size="listPageSize"
        :total="total || 0"
        @size-change="(pageSize) => getAllowedList({ pageSize: pageSize, pageNum: 1 })"
        @current-change="
          (currentPage) => getAllowedList({ pageSize: listPageSize, pageNum: currentPage })
        "
      />
    </el-card>

    <el-card class="box-card" v-show="!hasInstruct && activeIndex === '2'">
      <el-table :data="secondRecords" border style="width: 100%" empty-text="暂无已申请导师">
        <el-table-column prop="id" label="导师编号" align="center" />
        <el-table-column prop="username" label="导师姓名" align="center" />
        <el-table-column prop="grade" label="年级" align="center" />
      </el-table>

      <el-pagination
        :page-sizes="[5, 10]"
        :background="true"
        layout="total, sizes, prev, pager, next, jumper"
        v-model:current-page="listSecondCurrentPage"
        v-model:page-size="listSecondPageSize"
        :total="secondTotal || 0"
        @size-change="(pageSize) => getCommittedList({ pageSize: pageSize, pageNum: 1 })"
        @current-change="
          (currentPage) => getCommittedList({ pageSize: listSecondPageSize, pageNum: currentPage })
        "
      />
    </el-card>

    <el-card class="box-card" v-show="hasInstruct">
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
          <p>导师编号:</p>
          <div>
            {{ teacherId }}
          </div>
        </div>
        <div class="title">
          <p>导师姓名:</p>
          <div>
            {{ teacherName }}
          </div>
        </div>
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
        <div class="proposalDraft">
          <p>导师意见:</p>
          <div>
            <div>{{ proposalDraft.comment === '' ? '导师尚未填写' : proposalDraft.comment }}</div>
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
        <div class="proposalDraft">
          <p>导师意见:</p>
          <div>
            <div>{{ proposalFormal.comment === '' ? '导师尚未填写' : proposalFormal.comment }}</div>
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
        <div class="proposalDraft">
          <p>导师意见:</p>
          <div>
            <div>{{ paperDraft.comment === '' ? '导师尚未填写' : paperDraft.comment }}</div>
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
        <div class="proposalDraft">
          <p>导师意见:</p>
          <div>
            <div>{{ paperFormal.comment === '' ? '导师尚未填写' : paperFormal.comment }}</div>
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
        <div class="proposalDraft">
          <p>导师意见:</p>
          <div>
            <div>{{ paperFinal.comment === '' ? '导师尚未填写' : paperFinal.comment }}</div>
          </div>
        </div>
        <div class="proposalDraft">
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
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.el-page-header {
  margin-bottom: 1rem;
}

.el-pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2rem;
}

.box-card {
  margin-top: 1rem;
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
