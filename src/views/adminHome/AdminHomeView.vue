<script setup lang="ts">
import { ref } from 'vue'
import { getPhaseList } from '@/api/phase/getPhaseList'
import { updatePhaseProcess } from '@/api/phase/updatePhaseProcess'
import { endPhase } from '@/api/phase/endPhase'
import { useRouter } from 'vue-router'

onMounted(() => {
  getPhaseListPage({
    pageSize: listPageSize.value,
    pageNum: listCurrentPage.value
  })
})

const router = useRouter()
const record = ref([])

const listCurrentPage = ref(1)
const listPageSize = ref(10)
const total = ref(0)
const identity = window.localStorage.getItem('identity')
const getPhaseListPage = async (queryCondition) => {
  const data = await getPhaseList(queryCondition).then((res) => {
    console.log(res)
    //获取失败
    if (res.data.code !== 200) {
      ElMessage.error('获取流程列表失败')

      //打印数据
      console.log(res.data)

      throw new Error('获取流程列表失败')
    }
    //获取成功

    console.log(res.data)
    return res.data
  })

  record.value = data.data.phases
  total.value = data.data.count
  listCurrentPage.value = queryCondition.pageNum
  listPageSize.value = queryCondition.pageSize
}

const handlePageSizeChange = (pageSize) => {
  getPhaseListPage({ pageSize: pageSize, pageNum: 1 })
}

const handlePageNumberChange = (currentPage) => {
  getPhaseListPage({ pageSize: listPageSize.value, pageNum: currentPage })
}

const getState = (process) => {
  if (process === 2) {
    return '进行中'
  } else if (process === 1) {
    return '待进行'
  } else {
    return '已终止'
  }
}

const updateProcess = async (id) => {
  await updatePhaseProcess(id).then((res) => {
    if (res.data.code !== 200) {
      ElMessage.error('启动流程失败')
      console.log(res.data)
      throw new Error('启动流程失败')
    }
    return res.data
  })

  getPhaseListPage({
    pageSize: listPageSize.value,
    pageNum: listCurrentPage.value
  })
}

const endPhaseById = async (id) => {
  await endPhase(id).then((res) => {
    if (res.data.code !== 200) {
      ElMessage.error('终止流程失败')
      console.log(res)
      throw new Error('终止流程失败')
    }
    return res.data
  })

  getPhaseListPage({
    pageSize: listPageSize.value,
    pageNum: listCurrentPage.value
  })
}
</script>

<template>
  <div>
    <el-card class="box-card">
      <template #header>
        <div class="card-header" v-show="identity === '教务'">
          <el-button
            type="primary"
            class="addButton"
            color="#000000"
            @click="router.push({ name: 'addPhase' })"
          >
            新增流程
          </el-button>

          <el-button
            type="success"
            class="addButton"
            color="#898989"
            style="color: #fff"
            @click="router.push({ name: 'createUser' })"
          >
            创建用户
          </el-button>
        </div>
      </template>

      <el-table :data="record" border style="width: 100%">
        <el-table-column prop="id" label="编号" align="center" />
        <el-table-column prop="term" label="年级" align="center" />
        <el-table-column label="状态" align="center" v-slot="{ row }">
          {{ getState(row.process) }}
        </el-table-column>
        <el-table-column label="操作" align="center" v-slot="{ row }">
          <el-button
            type="primary"
            color="black"
            @click="router.push({ name: 'userList', params: { id: row.id } })"
            >查看</el-button
          >
          <el-button
            type="primary"
            color="#aaaaaa"
            v-show="row.process === 1 && identity === '教务'"
            @click="updateProcess(row.id)"
            >启动</el-button
          >
          <el-button
            type="primary"
            color="#dddddd"
            v-show="row.process === 2 && identity === '教务'"
            @click="endPhaseById(row.id)"
            >终止</el-button
          >
        </el-table-column>
      </el-table>

      <el-pagination
        :page-sizes="[10, 20, 50]"
        :background="true"
        layout="total, sizes, prev, pager, next, jumper"
        v-model:current-page="listCurrentPage"
        v-model:page-size="listPageSize"
        :total="total || 0"
        @size-change="(pageSize) => handlePageSizeChange(pageSize)"
        @current-change="(currentPage) => handlePageNumberChange(currentPage)"
      />
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.card-header {
  display: flex;
  align-items: center;
}

.item {
  margin-bottom: 18px;
}

.box-card {
  width: auto;
}

.el-form-item {
  margin-bottom: 20px;
}

.el-pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}
</style>
