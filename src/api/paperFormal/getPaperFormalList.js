import request from '@/utils/request.js'

export const getPaperFormalList = (instructId) => {
  return request({
    method: 'GET',
    url: `/paper/paperformal/list?instructId=` + instructId
  })
}
