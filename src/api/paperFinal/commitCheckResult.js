import request from '@/utils/requestFile.js'

export const commitCheckResult = (id, checkResult) => {
  return request({
    method: 'POST',
    url: `/paper/paperfinal/check`,
    data: {
      id: id,
      checkResult: checkResult
    }
  })
}
