import request from './request'
const commonApi = {
  // 用户登录
  login(data) {
    return request({
      url: '/user/login',
      method: 'post',
      data,
      // formData: true, // 启用formData格式
    })
  },
  //   获取区域列表
  getAreaList(data) {
    return request({
      url: '/map/getAreaList',
      method: 'get',
      data,
    })
  },

  getGisMapData(data) {
    return request({
      url: '/map/gisMapData',
      method: 'get',
      data,
    })
  },
}

export default commonApi
