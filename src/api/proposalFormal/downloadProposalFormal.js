import request from '@/utils/requestFile.js'

export const downloadProposalFormal = (filepath) => {
  return request({
    method: 'POST',
    url: `/paper/proposalformal/download`,
    data: {
      filepath: filepath
    }
  })
}
