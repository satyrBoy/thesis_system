import request from '@/utils/request.js'

export const chooseMentor = (info) => {
  return request({
    method: 'POST',
    url: `/instruct/add`,
    data: {
      stuId: info.stuId,
      teacherId: info.teacherId,
      permit: info.permit
    }
  })
}
