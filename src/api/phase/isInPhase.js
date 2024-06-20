import request from '@/utils/request.js'

export const isInPhase = (userid) => {
  return request({
    method: 'POST',
    url: `/phaseRelation/inphase`,
    data: {
      userid: userid
    }
  })
}
