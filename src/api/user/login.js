import request from '@/utils/request.js'

export const login = (username, password) => {
  return request({
    method: 'POST',
    url: `/user/login`,
    data: {
      username: username,
      password: password
    }
  })
}
