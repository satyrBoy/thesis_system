import request from '@/utils/request.js'

export const getProposalFormalList = (instructId) => {
  return request({
    method: 'GET',
    url: `/paper/proposalformal/list?instructId=` + instructId
  })
}
