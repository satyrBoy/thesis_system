import request from '@/utils/requestFile.js'

export const downloadPaperDraft = (filepath) => {
  return request({
    method: 'POST',
    url: `/paper/paperdraft/download`,
    data: {
      filepath: filepath
    }
  })
}
