<script setup lang="ts">
import { ElTable } from 'element-plus'
import { getCommittedMentorList } from '@/api/chooseMentor/getCommittedMentorList'
import { getAllowedMentorList } from '@/api/chooseMentor/getAllowedMentorList'
import { getInstructListByStu } from '@/api/chooseMentor/getInstructListByStu'
import { updateTitle } from '@/api/title/updateTitle'
import { chooseMentor } from '@/api/chooseMentor/chooseMentor'
import { computed, onBeforeMount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const stuid = window.localStorage.getItem('id')
const phaseid = window.localStorage.getItem('phaseid')
const instructId = ref(window.localStorage.getItem('instructId'))
const state = ref('')
const title = ref('')
const formTitle = ref('')
const router = useRouter()

onBeforeMount(() => {
  if (window.localStorage.getItem('process') !== '2') {
    router.push({ name: 'notInPhase' })
  }
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
      instructId.value = item.id
      state.value = item.state
      title.value = item.title
      window.localStorage.setItem('instructId', item.id)
      window.localStorage.setItem('state', item.state)
      window.localStorage.setItem('title', item.title)
      break
    }
  }
}
const hasInstruct = computed(() => {
  if (instructId.value !== null) {
    return true
  }
  return false
})
const nowState = computed(() => {
  if (state.value == null) {
    return null
  }

  if (state.value === '1') {
    if (title.value === '') {
      return '开题'
    } else {
      return '开题报告初稿'
    }
  } else if (state.value === '2') {
    return '开题报告正式稿'
  } else if (state.value === '3') {
    return '论文初稿'
  } else if (state.value === '4') {
    return '论文正式稿'
  } else if (state.value === '5') {
    return '论文终稿'
  } else if (state.value === '6') {
    return '合格通过'
  } else if (state.value === '7') {
    return '不合格'
  } else {
    return ''
  }
})

onMounted(() => {
  getAllowedList({
    pageNum: 1,
    pageSize: listPageSize.value
  })

  getCommittedList({
    pageNum: 1,
    pageSize: listSecondPageSize.value
  })
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
    phaseid: phaseid,
    stuid: stuid,
    pageNum: queryCondition.pageNum,
    pageSize: queryCondition.pageSize
  }).then((res) => {
    if (res.data.code !== 200) {
      ElMessage.error('获取可申请导师列表失败')
      console.log(res.data)
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
    stuid: stuid,
    pageNum: queryCondition.pageNum,
    pageSize: queryCondition.pageSize
  }).then((res) => {
    if (res.data.code !== 200) {
      ElMessage.error('获取已申请导师列表失败')
      console.log(res.data)
      throw new Error('获取已申请导师列表失败')
    }
    return res.data
  })

  secondRecords.value = data.data.users.filter((item) => item.permit !== '1')
  secondTotal.value = data.data.count
  listSecondCurrentPage.value = queryCondition.pageNum
  listSecondPageSize.value = queryCondition.pageSize
}

const activeIndex = ref('1')

const teacherName = computed(() => {
  return window.localStorage.getItem('teacherName')
})
const teacherId = computed(() => {
  return window.localStorage.getItem('teacherId')
})

const commitTitle = async () => {
  if (formTitle.value.length > 40) {
    ElMessage.error('论文开题不超过40字')
    throw Error
  }

  if (formTitle.value.length === 0) {
    ElMessage.error('论文开题不能为空')
    throw Error
  }

  await updateTitle(instructId.value, formTitle.value).then((res) => {
    if (res.data.code !== 200) {
      ElMessage.error('提交开题失败')
      throw new Error('提交开题失败')
    }
    return res.data
  })
  title.value = formTitle.value
  window.localStorage.setItem('title', title.value)
  ElMessage.success('提交开题成功')
}

const choose = async (teacherId) => {
  await chooseMentor({
    stuId: stuid,
    teacherId: teacherId,
    permit: '0'
  }).then((res) => {
    if (res.data.code !== 200) {
      ElMessage.error('申请失败')
      throw new Error('申请失败')
    }
    return res.data
  })
  ElMessage.success('申请成功')

  getAllowedList({
    pageNum: listCurrentPage.value,
    pageSize: listPageSize.value
  })

  getCommittedList({
    pageNum: listSecondCurrentPage.value,
    pageSize: listSecondPageSize.value
  })
}
</script>

<template>
  <div class="main">
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
      <var-table>
        <thead>
          <tr>
            <th class="first">导师编号</th>
            <th>导师姓名</th>
            <th>年级</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="l in records" :key="l.id">
            <td>{{ l.id }}</td>
            <td>{{ l.username }}</td>
            <td>{{ l.grade }}</td>
            <td><var-button type="primary" @click="choose(l.id)">申请</var-button></td>
          </tr>
        </tbody>
      </var-table>
      <var-paper class="footer" v-show="records.length == 0">
        <var-cell border> 无可申请导师 </var-cell>
      </var-paper>

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
      <var-table>
        <thead>
          <tr>
            <th class="first">导师编号</th>
            <th>导师姓名</th>
            <th>年级</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="l in secondRecords" :key="l.id">
            <td>{{ l.id }}</td>
            <td>{{ l.username }}</td>
            <td>{{ l.grade }}</td>
          </tr>
        </tbody>
      </var-table>
      <var-paper class="footer" v-show="secondRecords.length == 0">
        <var-cell border> 暂无已申请导师 </var-cell>
      </var-paper>

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

    <el-descriptions
      title="基础信息"
      :column="1"
      border
      size="large"
      v-show="hasInstruct"
      class="info"
    >
      <el-descriptions-item align="center">
        <template #label>
          <div class="label">
            <img src="@/assets/ID_Icon.svg" alt="" class="icon_img" />
            导师编号
          </div>
        </template>
        {{ teacherId }}
      </el-descriptions-item>
      <el-descriptions-item align="center">
        <template #label>
          <div class="label">
            <img src="@/assets/TeachName_Icon.svg" alt="" class="icon_img" />
            导师姓名
          </div>
        </template>
        {{ teacherName }}
      </el-descriptions-item>
      <el-descriptions-item align="center">
        <template #label>
          <div class="label">
            <img src="@/assets/state.svg" alt="" class="icon_img" />
            所处阶段
          </div>
        </template>
        {{ nowState }}
      </el-descriptions-item>
    </el-descriptions>

    <div class="updateTitle" v-show="hasInstruct">
      <p>论文开题</p>
      <div class="commitTitle" v-show="title === ''">
        <el-form-item label="开题:">
          <el-input
            v-model="formTitle"
            placeholder="请输入论文开题,不多于40字"
            style="width: 30rem"
          />
          <el-button type="primary" @click="commitTitle">提交</el-button>
        </el-form-item>
      </div>
      <el-descriptions :column="1" border size="large" v-show="title !== ''" class="info">
        <el-descriptions-item align="center">
          <template #label>
            <div class="label">开题</div>
          </template>
          {{ title }}
        </el-descriptions-item>
      </el-descriptions>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.var-table {
  .first {
    width: 10rem;
  }
  th {
    text-align: center;
  }
  td {
    text-align: center;
  }
}
.footer {
  width: 100%;
  font-weight: bold;
  .var-cell {
    text-align: center;
    color: #c0c4cc;
  }
}
.main {
  padding: 1rem;
}
.el-pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
}

.info {
  margin-top: 3rem;
  margin-left: 20px;
  margin-right: 20px;
}

.label {
  display: flex;
  align-items: center;
  justify-content: center;
  .icon_img {
    width: 2rem;
    height: 2rem;
    margin-right: 1rem;
  }
}

.updateTitle {
  margin-top: 6rem;
  margin-left: 20px;
  margin-right: 20px;
  p {
    font-size: 1rem;
    font-weight: bold;
    color: #303133;
  }

  .commitTitle {
    margin-left: 0.5rem;
    .el-button {
      margin-left: 2rem;
    }
  }

  .showTitle {
    margin-left: 0.5rem;
  }
}
</style>
