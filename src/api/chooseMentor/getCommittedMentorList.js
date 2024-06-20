import request from '@/utils/request.js'

export const getCommittedMentorList = (pageCondition) => {
  return request({
    method: 'POST',
    url: `/phaseRelation/comittedtist`,
    data: {
      stuid: pageCondition.stuid,
      pageNum: pageCondition.pageNum,
      pageSize: pageCondition.pageSize
    }
  })
}
