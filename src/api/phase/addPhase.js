import request from '@/utils/request.js'

export const addPhase = (term) => {
  return request({
    method: 'POST',
    url: `/phase/add`,
    data: {
      term: term,
      process: 1
    }
  })
}
