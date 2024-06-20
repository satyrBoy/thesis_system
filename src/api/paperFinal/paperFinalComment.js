import request from '@/utils/request.js'

export const paperFinalComment = (id, comment) => {
  return request({
    method: 'POST',
    url: `/paper/paperfinal/comment`,
    data: {
      id: id,
      comment: comment
    }
  })
}
