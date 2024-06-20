import request from '@/utils/request.js'

export const proposalFormalComment = (id, comment) => {
  return request({
    method: 'POST',
    url: `/paper/proposalformal/comment`,
    data: {
      id: id,
      comment: comment
    }
  })
}
