import request from '@/utils/request.js'

export const getPaperFinalList = (instructId) => {
  return request({
    method: 'GET',
    url: `/paper/paperfinal/list?instructId=` + instructId
  })
}
