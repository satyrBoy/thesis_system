import request from '@/utils/request.js'

export const proposalDraftComment = (id, comment) => {
  console.log('id：' + id)
  console.log('comment：' + comment)
  return request({
    method: 'POST',
    url: `/paper/proposaldraft/comment`,
    data: {
      id: id,
      comment: comment
    }
  })
}
