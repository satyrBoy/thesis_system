import request from '@/utils/requestFile.js'

export const downloadProposalDraft = (filepath) => {
  return request({
    method: 'POST',
    url: `/paper/proposaldraft/download`,
    data: {
      filepath: filepath
    }
  })
}
