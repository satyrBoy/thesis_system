<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { getStuList } from '@/api/chooseMentor/getStuList'
import { getUsersInPhase } from '@/api/phase/getUsersInPhase'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const teacherid = ref('')
const phaseId = ref('')
const activeIndex = ref('1')
const allPhaseStu = ref([])

onBeforeMount(() => {
  teacherid.value = String(route.params.id)
  phaseId.value = String(route.params.phaseid)
  getPhaseStu({
    pageNum: 1,
    pageSize: 200
  })
  getPendingList({
    pageNum: 1,
    pageSize: listPageSize.value
  })

  getAcceptedList({
    pageNum: 1,
    pageSize: listSecondPageSize.value
  })

  getRejectedList({
    pageNum: 1,
    pageSize: listThirdPageSize.value
  })
})

const handleClick = () => {
  getPendingList({
    pageNum: 1,
    pageSize: listPageSize.value
  })

  getAcceptedList({
    pageNum: 1,
    pageSize: listSecondPageSize.value
  })

  getRejectedList({
    pageNum: 1,
    pageSize: listThirdPageSize.value
  })
}

const getPhaseStu = async (queryCondition) => {
  const data = await getUsersInPhase({
    id: phaseId.value,
    identity: '学生',
    pageNum: queryCondition.pageNum,
    pageSize: queryCondition.pageSize
  }).then((res) => {
    if (res.data.code !== 200) {
      ElMessage.error('获取流程中所有学生数据失败')
      throw new Error('获取流程中所有学生数据失败')
    }
    return res.data
  })

  allPhaseStu.value = data.data.users
}

//待处理学生数据
const records = ref([])
const listCurrentPage = ref(1)
const listPageSize = ref(200)
const total = ref(0)
const getPendingList = async (queryCondition) => {
  const data = await getStuList({
    teacherid: teacherid.value,
    permit: '0',
    pageNum: queryCondition.pageNum,
    pageSize: queryCondition.pageSize
  }).then((res) => {
    if (res.data.code !== 200) {
      ElMessage.error('获取待处理学生列表失败')
      console.log(res.data)
      throw new Error('获取待处理学生列表失败')
    }

    return res.data
  })

  records.value = data.data.users
  const temp = ref([])
  for (let item of records.value) {
    for (let phaseStu of allPhaseStu.value) {
      if (item.id === phaseStu.id) {
        temp.value.push(item)
        break
      }
    }
  }
  records.value = temp.value
  total.value = temp.value.length
  listCurrentPage.value = queryCondition.pageNum
  listPageSize.value = queryCondition.pageSize
}

//已同意学生数据
const secondRecords = ref([])
const listSecondCurrentPage = ref(1)
const listSecondPageSize = ref(200)
const secondTotal = ref(0)
const getAcceptedList = async (queryCondition) => {
  const data = await getStuList({
    teacherid: teacherid.value,
    permit: '1',
    pageNum: queryCondition.pageNum,
    pageSize: queryCondition.pageSize
  }).then((res) => {
    if (res.data.code !== 200) {
      ElMessage.error('获取已同意学生列表失败')
      console.log(res.data)
      throw new Error('获取已同意学生列表失败')
    }
    return res.data
  })

  secondRecords.value = data.data.users
  const temp = ref([])
  for (let item of secondRecords.value) {
    for (let phaseStu of allPhaseStu.value) {
      if (item.id === phaseStu.id) {
        temp.value.push(item)
        break
      }
    }
  }
  secondRecords.value = temp.value
  secondTotal.value = temp.value.length
  listSecondCurrentPage.value = queryCondition.pageNum
  listSecondPageSize.value = queryCondition.pageSize
}

//已拒绝学生数据
const thirdRecords = ref([])
const listThirdCurrentPage = ref(1)
const listThirdPageSize = ref(200)
const thirdTotal = ref(0)
const getRejectedList = async (queryCondition) => {
  const data = await getStuList({
    teacherid: teacherid.value,
    permit: '2',
    pageNum: queryCondition.pageNum,
    pageSize: queryCondition.pageSize
  }).then((res) => {
    if (res.data.code !== 200) {
      ElMessage.error('获取已拒绝学生列表失败')
      console.log(res.data)
      throw new Error('获取已拒绝学生列表失败')
    }
    return res.data
  })

  thirdRecords.value = data.data.users
  const temp = ref([])
  for (let item of thirdRecords.value) {
    for (let phaseStu of allPhaseStu.value) {
      if (item.id === phaseStu.id) {
        temp.value.push(item)
        break
      }
    }
  }
  thirdRecords.value = temp.value
  thirdTotal.value = temp.value.length
  listThirdCurrentPage.value = queryCondition.pageNum
  listThirdPageSize.value = queryCondition.pageSize
}
</script>

<template>
  <div>
    <el-page-header @back="router.go(-1)">
      <template #content>
        <div class="flex items-center">
          <span class="text-large font-600 mr-3"> 查看导师 </span>
        </div>
      </template>
    </el-page-header>
    <el-tabs v-model="activeIndex" class="tabs" type="card" @tab-click="handleClick">
      <el-tab-pane label="待处理学生" name="1"></el-tab-pane>
      <el-tab-pane label="已同意学生" name="2"></el-tab-pane>
      <el-tab-pane label="已拒绝学生" name="3"></el-tab-pane>
    </el-tabs>
    <el-card class="box-card" v-show="activeIndex === '1'">
      <el-table :data="records" border style="width: 100%" empty-text="暂无待处理学生">
        <el-table-column prop="id" label="学生编号" align="center" />
        <el-table-column prop="username" label="学生姓名" align="center" />
        <el-table-column prop="grade" label="年级" align="center" />
        <el-table-column label="操作" align="center" v-slot="{ row }">
          <el-button
            type="primary"
            color="#000"
            @click="
              router.push({
                name: 'phaseStuInfo',
                params: {
                  id: row.id,
                  phaseid: phaseId
                }
              })
            "
            >进入</el-button
          >
        </el-table-column>
      </el-table>

      <!-- <el-pagination
        :page-sizes="[5, 10]"
        :background="true"
        layout="total, sizes, prev, pager, next, jumper"
        v-model:current-page="listCurrentPage"
        v-model:page-size="listPageSize"
        :total="total || 0"
        @size-change="(pageSize) => getPendingList({ pageSize: pageSize, pageNum: 1 })"
        @current-change="
          (currentPage) => getPendingList({ pageSize: listPageSize, pageNum: currentPage })
        "
      /> -->
    </el-card>

    <el-card class="box-card" v-show="activeIndex === '2'">
      <el-table :data="secondRecords" border style="width: 100%" empty-text="暂无已同意学生">
        <el-table-column prop="id" label="学生编号" align="center" />
        <el-table-column prop="username" label="学生姓名" align="center" />
        <el-table-column prop="grade" label="年级" align="center" />
        <el-table-column label="操作" align="center" v-slot="{ row }">
          <el-button
            type="primary"
            color="#000"
            @click="
              router.push({
                name: 'phaseStuInfo',
                params: {
                  id: row.id,
                  phaseid: phaseId
                }
              })
            "
            >进入</el-button
          >
        </el-table-column>
      </el-table>

      <!-- <el-pagination
        :page-sizes="[5, 10]"
        :background="true"
        layout="total, sizes, prev, pager, next, jumper"
        v-model:current-page="listSecondCurrentPage"
        v-model:page-size="listSecondPageSize"
        :total="secondTotal || 0"
        @size-change="(pageSize) => getAcceptedList({ pageSize: pageSize, pageNum: 1 })"
        @current-change="
          (currentPage) => getAcceptedList({ pageSize: listSecondPageSize, pageNum: currentPage })
        "
      /> -->
    </el-card>

    <el-card class="box-card" v-show="activeIndex === '3'">
      <el-table :data="thirdRecords" border style="width: 100%" empty-text="暂无已拒绝学生">
        <el-table-column prop="id" label="学生编号" align="center" />
        <el-table-column prop="username" label="学生姓名" align="center" />
        <el-table-column prop="grade" label="年级" align="center" />
        <el-table-column label="操作" align="center" v-slot="{ row }">
          <el-button
            type="primary"
            color="#000"
            @click="
              router.push({
                name: 'phaseStuInfo',
                params: {
                  id: row.id,
                  phaseid: phaseId
                }
              })
            "
            >进入</el-button
          >
        </el-table-column>
      </el-table>

      <!-- <el-pagination
        :page-sizes="[5, 10]"
        :background="true"
        layout="total, sizes, prev, pager, next, jumper"
        v-model:current-page="listThirdCurrentPage"
        v-model:page-size="listThirdPageSize"
        :total="thirdTotal || 0"
        @size-change="(pageSize) => getRejectedList({ pageSize: pageSize, pageNum: 1 })"
        @current-change="
          (currentPage) => getRejectedList({ pageSize: listThirdPageSize, pageNum: currentPage })
        "
      /> -->
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
</style>
