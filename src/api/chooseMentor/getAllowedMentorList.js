import request from '@/utils/request.js'

export const getAllowedMentorList = (pageCondition) => {
  return request({
    method: 'POST',
    url: `/phaseRelation/allowedtist`,
    data: {
      phaseid: pageCondition.phaseid,
      stuid: pageCondition.stuid,
      pageNum: pageCondition.pageNum,
      pageSize: pageCondition.pageSize
    }
  })
}
