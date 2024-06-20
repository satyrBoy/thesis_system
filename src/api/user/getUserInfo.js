import request from '@/utils/request.js'

export const getUserInfo = (id) => {
  return request({
    method: 'GET',
    url: `/user/info?id=` + id
  })
}
