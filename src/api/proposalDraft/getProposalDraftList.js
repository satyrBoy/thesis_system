import request from '@/utils/request.js'

export const getProposalDraftList = (instructId) => {
  return request({
    method: 'GET',
    url: `/paper/proposaldraft/list?instructId=` + instructId
  })
}
