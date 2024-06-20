import request from '@/utils/request.js'

export const updateUserInfo = (id, password, grade) => {
  return request({
    method: 'POST',
    url: `/user/info/update`,
    data: {
      id: id,
      password: password,
      grade: grade
    }
  })
}
