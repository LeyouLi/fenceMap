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
  // 退出登录
  logout() {
    return request({
      url: '/logout',
      method: 'get',
    })
  },
  // 获取用户信息
  queryUserInfo() {
    return request({
      url: '/user/getUserInfo',
      method: 'get',
    })
  },
  // 修改密码
  changePassword(data) {
    return request({
      url: '/user/changePassword',
      method: 'post',
      data,
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
