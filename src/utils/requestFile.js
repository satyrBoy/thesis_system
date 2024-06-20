import axios from 'axios'
import { useTokenStore } from '@/stores/token'

const request = axios.create({
  // baseURL: 'http://101.132.245.82:8888'
  responseType: 'blob',
  headers: {
    'Content-Type': 'application/json'
  }
})

// 配置请求拦截器.  config 代表着每次请求的配置对象
request.interceptors.request.use((config) => {
  // 以前可能会没有 headers, 可能不要也行
  if (!config.headers) {
    config.headers = {}
  }
  const store = useTokenStore() // 2.获取token
  // 把token添加到每个请求头信息中
  config.headers.Authorization = store.token.token

  return config
})

export default request
