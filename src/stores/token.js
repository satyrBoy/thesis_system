import { defineStore } from 'pinia'
import { ElMessage } from 'element-plus'
export const useTokenStore = defineStore('token', () => {
  //初始值
  const tokenJson = ref('')

  //计算属性
  const token = computed(() => {
    try {
      return {
        token: tokenJson.value || window.localStorage.getItem('tokenInfo') || ''
      }
    } catch (error) {
      ElMessage.error('token字符串无法转换')
      window.localStorage.setItem('tokenInfo', '')
      throw Error('token字符串无法转换')
    }
  })

  //保存token和role的方法
  function saveToken (tokenInfo) {
    tokenJson.value = tokenInfo
    window.localStorage.setItem('tokenInfo', tokenInfo)
  }

  return { token, saveToken }
})
