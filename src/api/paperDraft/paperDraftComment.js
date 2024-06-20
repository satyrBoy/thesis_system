import request from '@/utils/request.js'

export const paperDraftComment = (id, comment) => {
  return request({
    method: 'POST',
    url: `/paper/paperdraft/comment`,
    data: {
      id: id,
      comment: comment
    }
  })
}
