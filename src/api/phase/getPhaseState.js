import request from '@/utils/request.js'

export const getPhaseState = (phaseid) => {
  return request({
    method: 'POST',
    url: `/phase/phaseinfo`,
    data: {
      phaseid: phaseid
    }
  })
}
