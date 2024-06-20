import request from '@/utils/request.js'

export const getInstructListByStu = (id) => {
  return request({
    method: 'GET',
    url: `/instruct/oneStu?stuId=` + id
  })
}
