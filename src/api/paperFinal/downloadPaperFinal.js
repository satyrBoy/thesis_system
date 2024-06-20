import request from '@/utils/requestFile.js'

export const downloadPaperFinal = (filepath) => {
  return request({
    method: 'POST',
    url: `/paper/paperfinal/download`,
    data: {
      filepath: filepath
    }
  })
}
