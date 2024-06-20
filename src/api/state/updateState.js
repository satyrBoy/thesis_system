import request from '@/utils/request.js'

export const updateState = (id, state) => {
  return request({
    method: 'POST',
    url: `/instruct/updateState`,
    data: {
      id: id,
      state: state
    }
  })
}
