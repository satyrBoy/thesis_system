import request from '@/utils/request.js'

export const getUserListByInfo = (pageCondition) => {
  return request({
    method: 'GET',
    url:
      `/user/condpage?grade=` +
      pageCondition.grade +
      `&identity=` +
      pageCondition.identity +
      `&pageNum=` +
      pageCondition.pageNum +
      `&pageSize=` +
      pageCondition.pageSize
  })
}
