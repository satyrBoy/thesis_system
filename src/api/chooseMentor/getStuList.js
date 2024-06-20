import request from '@/utils/request.js'

export const getStuList = (pageCondition) => {
  return request({
    method: 'POST',
    url: `/instruct/stulistForTeacher`,
    data: {
      teacherid: pageCondition.teacherid,
      permit: pageCondition.permit,
      pageNum: pageCondition.pageNum,
      pageSize: pageCondition.pageSize
    }
  })
}
