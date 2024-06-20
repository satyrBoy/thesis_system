<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { EditPen, Crop, Select, DocumentAdd } from '@element-plus/icons-vue'
import { getUserList } from '@/api/user/getUserList'
import { getUserListByInfo } from '@/api/user/getUserListByInfo'
import { addPhase } from '@/api/phase/addPhase'
import { addUsers } from '@/api/phase/addUsers'

const router = useRouter()
const currentStep = ref(0)
const gradeOptions = computed(() => {
  let currentYear = new Date().getFullYear()
  let options = []
  for (let i = 0; i <= 4; i++) {
    let year = (currentYear - i).toString().slice(-2) + '级'
    options.push({
      value: year,
      label: year
    })
  }
  return options
})
const term = ref('')
const record = ref([])
const identityOptions = [
  {
    value: '学生',
    label: '学生'
  },
  {
    value: '导师',
    label: '导师'
  }
]
const conditionSearch = ref(0)
const searchCondition = reactive({
  grade: '',
  identity: ''
})
const form = reactive({
  grade: '',
  users: []
})

onMounted(() => {
  getUserListPage({
    pageNum: listCurrentPage.value,
    pageSize: listPageSize.value
  })
})

//搜索查询
const selectUserInfo = async (pageCondition) => {
  const data = await getUserListByInfo({
    grade: searchCondition.grade,
    identity: searchCondition.identity,
    pageNum: pageCondition.pageNum,
    pageSize: pageCondition.pageSize
  }).then((res) => {
    if (res.data.code !== 200) {
      ElMessage.error('搜索失败')
      console.log(res.data)
      throw new Error('搜索失败')
    }
    return res.data
  })

  //搜索成功
  conditionSearch.value = 1
  record.value = data.data.users
  listCurrentPage.value = pageCondition.pageNum
  listPageSize.value = pageCondition.pageSize
  total.value = data.data.count
}
//页查询
const listCurrentPage = ref(1)
const listPageSize = ref(5)
const total = ref(0)
const getUserListPage = async (queryCondition) => {
  const data = await getUserList(queryCondition).then((res) => {
    console.log(res)
    if (res.data.code !== 200) {
      ElMessage.error('获取用户列表失败')

      console.log(res.data)

      throw new Error('获取用户列表失败')
    }
    //获取成功

    console.log(res.data)
    return res.data
  })

  record.value = data.data.users
  total.value = data.data.count
  listCurrentPage.value = queryCondition.pageNum
  listPageSize.value = queryCondition.pageSize
}

// 处理页数大小改变
const handlePageSizeChange = (pageSize) => {
  if (conditionSearch.value === 0) {
    getUserListPage({ pageSize: pageSize, pageNum: 1 })
  } else {
    selectUserInfo({ pageSize: pageSize, pageNum: 1 })
  }
}
// 处理页码改变
const handlePageNumberChange = (currentPage) => {
  if (conditionSearch.value === 0) {
    getUserListPage({ pageSize: listPageSize.value, pageNum: currentPage })
  } else {
    selectUserInfo({ pageSize: listPageSize.value, pageNum: currentPage })
  }
}

const multipleSelection = ref([])
const handleSelectionChange = (val) => {
  multipleSelection.value = val.map((item) => item.id)
}
const getRowKeys = (row) => {
  return row.id
}

const isRowSelectable = (row) => {
  return row.identity === '学生' || row.identity === '导师'
}

const onSubmit = async () => {
  if (term.value === '') {
    ElMessage.error('年级不可为空')
    return
  }

  form.users = multipleSelection.value
  if (form.grade === '' && form.users.length === 0) {
    ElMessage.error('添加用户不可为空')
    return
  }
  const data = await addPhase(term.value).then(async (res) => {
    if (res.data.code !== 200) {
      console.log(res.data)
      if (res.data.code === -100) {
        ElMessage.error('该年级流程已存在')

        throw new Error('该年级流程已存在')
      } else {
        ElMessage.error('添加流程失败')

        throw new Error('添加流程失败')
      }
    }
    let phaseId = res.data.data.phaseid
    let info = ref({})
    if (form.grade[0] === '') {
      info.value = {
        id: phaseId,
        users: form.users
      }
    } else if (form.users.length === 0) {
      info.value = {
        id: phaseId,
        grade: form.grade[0]
      }
    } else {
      info.value = {
        id: phaseId,
        grade: form.grade[0],
        users: form.users
      }
    }
    await addUsers(info.value).then((res) => {
      if (res.data.code !== 200) {
        console.log(res.data)
        ElMessage.error('添加流程失败')
        throw new Error('添加流程失败')
      }
      return res
    })
    return res.data
  })

  ElMessage.success('添加流程成功')
  router.push({ name: 'phaseList' })
}
</script>

<template>
  <div>
    <el-page-header @back="router.push({ name: 'phaseList' })">
      <template #content>
        <div class="flex items-center">
          <span class="text-large font-600 mr-3"> 创建流程 </span>
        </div>
      </template>
    </el-page-header>
    <el-card class="box-card">
      <template #header>
        <el-steps :space="200" :active="currentStep" simple>
          <el-step title="年级" :icon="EditPen" @click="currentStep = 0" />
          <el-step title="手动添加" :icon="Select" @click="currentStep = 1" />
          <el-step title="创建流程" :icon="DocumentAdd" @click="currentStep = 2" />
        </el-steps>
      </template>
      <div v-show="currentStep === 0">
        <el-form-item label="年级" style="margin-left: 3rem">
          <el-input v-model="term" placeholder="请输入该流程年级" style="width: 30rem" />
        </el-form-item>
      </div>

      <div v-show="currentStep === 1">
        <el-card>
          <template #header>
            <div class="card-header">
              <el-form :inline="true" class="form-inline" :model="searchCondition">
                <el-form-item label="年级">
                  <el-cascader
                    :options="gradeOptions"
                    v-model="searchCondition.grade"
                    placeholder="选择年级"
                  />
                </el-form-item>
                <el-form-item label="角色">
                  <el-cascader
                    :options="identityOptions"
                    v-model="searchCondition.identity"
                    placeholder="选择角色"
                  />
                </el-form-item>
                <el-form-item>
                  <el-button
                    type="primary"
                    @click="selectUserInfo({ pageNum: 1, pageSize: listPageSize })"
                    >查询
                  </el-button>
                </el-form-item>
              </el-form>
            </div>
          </template>
          <el-table
            :data="record"
            border
            style="width: 100%"
            :row-key="getRowKeys"
            @selection-change="handleSelectionChange"
          >
            <el-table-column
              type="selection"
              prop="id"
              :reserve-selection="true"
              :selectable="isRowSelectable"
              width="55"
            />
            <el-table-column prop="id" label="编号" align="center" />
            <el-table-column prop="username" label="用户名" align="center" />
            <el-table-column prop="identity" label="角色" align="center" />
            <el-table-column prop="grade" label="年级" align="center" />
          </el-table>

          <el-pagination
            :page-sizes="[5, 10]"
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

      <div v-show="currentStep === 2"></div>
      <div class="bottom-btn">
        <el-button v-show="currentStep !== 0" @click="currentStep--">上一步</el-button>
        <el-button v-show="currentStep !== 2" @click="currentStep++">下一步</el-button>
        <el-button v-show="currentStep === 2" type="primary" color="black" @click="onSubmit"
          >确认创建</el-button
        >
      </div>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.box-card {
  margin-top: 0.5rem;
}
.bottom-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 0.5rem;
}

.el-form-item {
  margin-bottom: 0px;
}

.form-inline {
  display: flex;
  align-items: center;
  justify-content: center;
}

.el-pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 0.5rem;
}
</style>
