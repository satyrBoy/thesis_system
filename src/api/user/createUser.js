import request from '@/utils/request.js'

export const createUser = (info) => {
  return request({
    method: 'POST',
    url: `/user/register`,
    data: {
      username: info.username,
      password: info.password,
      identity: info.identity,
      grade: info.grade
    }
  })
}
