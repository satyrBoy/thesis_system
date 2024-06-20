import request from '@/utils/request.js'

export const getUsersInPhase = (pageCondition) => {
  return request({
    method: 'GET',
    url:
      `/phaseRelation/identitylist?id=` +
      pageCondition.id +
      `&identity=` +
      pageCondition.identity +
      `&pageNum=` +
      pageCondition.pageNum +
      `&pageSize=` +
      pageCondition.pageSize
  })
}
