import request from '@/utils/request.js'

export const paperFormalComment = (id, comment) => {
  return request({
    method: 'POST',
    url: `/paper/paperformal/comment`,
    data: {
      id: id,
      comment: comment
    }
  })
}
