<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getUsersInPhase } from '@/api/phase/getUsersInPhase'

const router = useRouter()
const route = useRoute()
const phaseid = ref('')
onBeforeMount(() => {
  phaseid.value = String(route.params.id)
  getMentorsList({
    pageNum: listCurrentPage.value,
    pageSize: listPageSize.value
  })

  getStudentList({
    pageNum: listSecondCurrentPage.value,
    pageSize: listSecondPageSize.value
  })
})

//切换事件
const handleClick = () => {
  getMentorsList({
    pageNum: 1,
    pageSize: listPageSize.value
  })

  getStudentList({
    pageNum: 1,
    pageSize: listSecondPageSize.value
  })
}

//导师数据
const Mentors = ref([])
const listCurrentPage = ref(1)
const listPageSize = ref(10)
const total = ref(0)
const getMentorsList = async (queryCondition) => {
  const data = await getUsersInPhase({
    id: phaseid.value,
    identity: '导师',
    pageNum: queryCondition.pageNum,
    pageSize: queryCondition.pageSize
  }).then((res) => {
    if (res.data.code !== 200) {
      ElMessage.error('获取流程中导师列表失败')
      throw new Error('获取流程中导师列表失败')
    }
    return res.data
  })

  Mentors.value = data.data.users
  total.value = data.data.count
  listCurrentPage.value = queryCondition.pageNum
  listPageSize.value = queryCondition.pageSize
}

//学生数据
const Students = ref([])
const listSecondCurrentPage = ref(1)
const listSecondPageSize = ref(10)
const secondTotal = ref(0)
const getStudentList = async (queryCondition) => {
  const data = await getUsersInPhase({
    id: phaseid.value,
    identity: '学生',
    pageNum: queryCondition.pageNum,
    pageSize: queryCondition.pageSize
  }).then((res) => {
    if (res.data.code !== 200) {
      ElMessage.error('获取流程中学生列表失败')
      throw new Error('获取流程中列表失败')
    }
    return res.data
  })

  Students.value = data.data.users
  secondTotal.value = data.data.count
  listSecondCurrentPage.value = queryCondition.pageNum
  listSecondPageSize.value = queryCondition.pageSize
}

const activeIndex = ref('1')
</script>

<template>
  <div>
    <el-page-header @back="router.push({ name: 'phaseList' })">
      <template #content>
        <div class="flex items-center">
          <span class="text-large font-600 mr-3"> 查看流程 </span>
        </div>
      </template>
    </el-page-header>
    <el-tabs v-model="activeIndex" class="tabs" type="card" @tab-click="handleClick">
      <el-tab-pane label="导师" name="1"></el-tab-pane>
      <el-tab-pane label="学生" name="2"></el-tab-pane>
    </el-tabs>
    <el-card class="box-card" v-show="activeIndex === '1'">
      <el-table :data="Mentors" border style="width: 100%" empty-text="无导师">
        <el-table-column prop="id" label="导师编号" align="center" />
        <el-table-column prop="username" label="导师姓名" align="center" />
        <el-table-column prop="grade" label="年级" align="center" />
        <el-table-column label="操作" align="center" v-slot="{ row }">
          <el-button
            type="primary"
            color="#000"
            @click="
              router.push({
                name: 'phaseMentorInfo',
                params: {
                  id: row.id,
                  phaseid: phaseid
                }
              })
            "
            >查看</el-button
          >
        </el-table-column>
      </el-table>

      <el-pagination
        :page-sizes="[5, 10]"
        :background="true"
        layout="total, sizes, prev, pager, next, jumper"
        v-model:current-page="listCurrentPage"
        v-model:page-size="listPageSize"
        :total="total || 0"
        @size-change="(pageSize) => getMentorsList({ pageSize: pageSize, pageNum: 1 })"
        @current-change="
          (currentPage) => getMentorsList({ pageSize: listPageSize, pageNum: currentPage })
        "
      />
    </el-card>

    <el-card class="box-card" v-show="activeIndex === '2'">
      <el-table :data="Students" border style="width: 100%" empty-text="无学生">
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
                  phaseid: phaseid
                }
              })
            "
            >进入</el-button
          >
        </el-table-column>
      </el-table>

      <el-pagination
        :page-sizes="[5, 10]"
        :background="true"
        layout="total, sizes, prev, pager, next, jumper"
        v-model:current-page="listSecondCurrentPage"
        v-model:page-size="listSecondPageSize"
        :total="secondTotal || 0"
        @size-change="(pageSize) => getStudentList({ pageSize: pageSize, pageNum: 1 })"
        @current-change="
          (currentPage) => getStudentList({ pageSize: listSecondPageSize, pageNum: currentPage })
        "
      />
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
