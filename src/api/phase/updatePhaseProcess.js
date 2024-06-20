import request from '@/utils/request.js'

export const updatePhaseProcess = (id) => {
  return request({
    method: 'POST',
    url: `/phase/updateProcess`,
    data: {
      id: id,
      process: 2
    }
  })
}
