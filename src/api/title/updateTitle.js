import request from '@/utils/request.js'

export const updateTitle = (id, title) => {
  return request({
    method: 'POST',
    url: `/instruct/updateTitle`,
    data: {
      id: id,
      title: title
    }
  })
}
