import request from '@/utils/request.js'

export const getPhaseList = (pageCondition) => {
  return request({
    method: 'GET',
    url: `/phase/termlist?pageNum=` + pageCondition.pageNum + `&pageSize=` + pageCondition.pageSize
  })
}
