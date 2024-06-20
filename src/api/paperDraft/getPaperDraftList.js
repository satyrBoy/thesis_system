import request from '@/utils/request.js'

export const getPaperDraftList = (instructId) => {
  return request({
    method: 'GET',
    url: `/paper/paperdraft/list?instructId=` + instructId
  })
}
