<script setup lang="ts">
import { ElTable } from 'element-plus'
import { getStuList } from '@/api/chooseMentor/getStuList'
import { getAllStuList } from '@/api/chooseMentor/getAllStuList'
import { getUsersInPhase } from '@/api/phase/getUsersInPhase'
import { updateInstructPermit } from '@/api/chooseMentor/updateInstructPermit'
import { useRouter } from 'vue-router'
import { onBeforeMount, ref } from 'vue'

const router = useRouter()
const allPhaseStu = ref([])
const teacherid = window.localStorage.getItem('id')

onBeforeMount(() => {
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

  getAllList()
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

  getAllList()
}

const getPhaseStu = async (queryCondition) => {
  const data = await getUsersInPhase({
    id: window.localStorage.getItem('phaseid'),
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

//处理学生申请
const updatePermit = async (stuId, permit) => {
  const instructId = ref('')
  for (let item of allStuList.value) {
    if (item.stuId === stuId) {
      instructId.value = item.id
      break
    }
  }
  await updateInstructPermit(instructId.value, permit).then((res) => {
    if (res.data.code !== 200) {
      ElMessage.error('处理申请失败')
      console.log(res.data)
      throw new Error('处理申请失败')
    }
    return res.data
  })
  ElMessage.success('处理申请成功')
  getPendingList({
    pageNum: listCurrentPage.value,
    pageSize: listPageSize.value
  })
  getAllList()
}

//待处理学生数据
const records = ref([])
const listCurrentPage = ref(1)
const listPageSize = ref(200)
const total = ref(0)
const getPendingList = async (queryCondition) => {
  const data = await getStuList({
    teacherid: teacherid,
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
    teacherid: teacherid,
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
    teacherid: teacherid,
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

//所有数据
const allStuList = ref([])
const getAllList = async () => {
  const data = await getAllStuList(teacherid).then((res) => {
    if (res.data.code !== 200) {
      ElMessage.error('获取学生关系列表失败')
      console.log(res.data)
      throw new Error('获取学生关系列表失败')
    }

    return res.data
  })

  allStuList.value = data.data.instructs
}

const activeIndex = ref('1')
</script>

<template>
  <div>
    <el-tabs v-model="activeIndex" class="tabs" type="card" @tab-click="handleClick">
      <el-tab-pane label="待处理学生" name="1"></el-tab-pane>
      <el-tab-pane label="已同意学生" name="2"></el-tab-pane>
      <el-tab-pane label="已拒绝学生" name="3"></el-tab-pane>
    </el-tabs>
    <div>
      <el-card class="box-card" v-show="activeIndex === '1'">
        <!-- <el-table :data="records" border style="width: 100%" empty-text="暂无待处理学生">
          <el-table-column prop="id" label="学生编号" align="center" />
          <el-table-column prop="username" label="学生姓名" align="center" />
          <el-table-column prop="grade" label="年级" align="center" />
          <el-table-column label="操作" align="center" v-slot="{ row }">
            <el-button type="primary" color="#555555" @click="updatePermit(row.id, '1')"
              >同意</el-button
            >
            <el-button type="primary" color="#F1F6FA" @click="updatePermit(row.id, '2')"
              >拒绝</el-button
            >
          </el-table-column>
        </el-table> -->
        <var-table>
          <thead>
            <tr>
              <th class="first">学生编号</th>
              <th>学生姓名</th>
              <th>年级</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="l in records" :key="l.id">
              <td>{{ l.id }}</td>
              <td>{{ l.username }}</td>
              <td>{{ l.grade }}</td>
              <td>
                <var-button class="left" type="primary" @click="updatePermit(l.id, '1')"
                  >同意</var-button
                ><var-button type="danger" @click="updatePermit(l.id, '2')">拒绝</var-button>
              </td>
            </tr>
          </tbody>
        </var-table>
        <var-paper class="footer" v-show="records.length == 0">
          <var-cell border> 无待处理学生 </var-cell>
        </var-paper>
      </el-card>

      <el-card class="box-card" v-show="activeIndex === '2'">
        <!-- <el-table
          v-show="activeIndex === '2'"
          :data="secondRecords"
          border
          style="width: 100%"
          empty-text="暂无已同意学生"
        >
          <el-table-column prop="id" label="学生编号" align="center" />
          <el-table-column prop="username" label="学生姓名" align="center" />
          <el-table-column prop="grade" label="年级" align="center" />
          <el-table-column label="操作" align="center" v-slot="{ row }">
            <el-button
              type="primary"
              color="#555555"
              @click="router.push({ name: 'stuInfo', params: { stuId: row.id } })"
              >查看</el-button
            >
          </el-table-column>
        </el-table> -->

        <var-table>
          <thead>
            <tr>
              <th class="first">学生编号</th>
              <th>学生姓名</th>
              <th>年级</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="l in secondRecords" :key="l.id">
              <td>{{ l.id }}</td>
              <td>{{ l.username }}</td>
              <td>{{ l.grade }}</td>
              <td>
                <var-button
                  type="info"
                  @click="router.push({ name: 'stuInfo', params: { stuId: l.id } })"
                  >查看</var-button
                >
              </td>
            </tr>
          </tbody>
        </var-table>
        <var-paper class="footer" v-show="secondRecords.length == 0">
          <var-cell border> 暂无已同意学生 </var-cell>
        </var-paper>
      </el-card>

      <el-card class="box-card" v-show="activeIndex === '3'">
        <!-- <el-table
          :data="thirdRecords"
          v-show="activeIndex === '3'"
          border
          style="width: 100%"
          empty-text="暂无已拒绝学生"
        >
          <el-table-column prop="id" label="学生编号" align="center" />
          <el-table-column prop="username" label="学生姓名" align="center" />
          <el-table-column prop="grade" label="年级" align="center" />
        </el-table> -->
        <var-table>
          <thead>
            <tr>
              <th class="first">学生编号</th>
              <th>学生姓名</th>
              <th>年级</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="l in thirdRecords" :key="l.id">
              <td>{{ l.id }}</td>
              <td>{{ l.username }}</td>
              <td>{{ l.grade }}</td>
            </tr>
          </tbody>
        </var-table>
        <var-paper class="footer" v-show="thirdRecords.length == 0">
          <var-cell border> 暂无已拒绝学生 </var-cell>
        </var-paper>
      </el-card>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.el-tabs {
  margin-top: 1rem;
}
.var-table {
  .first {
    width: 20rem;
  }
  th {
    text-align: center;
  }
  td {
    text-align: center;
  }
  .left {
    margin-right: 10px;
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
</style>
