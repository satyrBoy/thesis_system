import request from '@/utils/request.js'

export const getUserList = (pageCondition) => {
  return request({
    method: 'GET',
    url: `/user/page?pageNum=` + pageCondition.pageNum + `&pageSize=` + pageCondition.pageSize
  })
}
