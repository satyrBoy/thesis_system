import request from '@/utils/request.js'

export const endPhase = (id) => {
  return request({
    method: 'POST',
    url: `/phaseRelation/end`,
    data: {
      id: id
    }
  })
}
