import request from '@/utils/request.js'

export const updateInstructPermit = (id, permit) => {
  return request({
    method: 'POST',
    url: `/instruct/update`,
    data: {
      id: id,
      permit: permit
    }
  })
}
