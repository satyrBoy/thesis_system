import request from '@/utils/request.js'

export const addUsers = (info) => {
  return request({
    method: 'POST',
    url: `/phaseRelation/add`,
    data: info
  })
}
