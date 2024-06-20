import request from '@/utils/requestFile.js'

export const downloadPaperFormal = (filepath) => {
  return request({
    method: 'POST',
    url: `/paper/paperformal/download`,
    data: {
      filepath: filepath
    }
  })
}
