import request from '@/utils/request.js'

export const getAllStuList = (id) => {
  return request({
    method: 'GET',
    url: `/instruct/listTeacher?teacherId=` + id
  })
}
