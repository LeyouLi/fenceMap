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

  //采棉机状态
  getPickerState(data) {
    return request({
      url: '/picker/getPickerState',
      method: 'get',
      data,
    })
  },

  //采收进度
  getTotalHarvest(data) {
    return request({
      url: '/bale/getTotalHarvest',
      method: 'get',
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

  //   获取区域列表（分页）
  getAreaPage(data) {
    return request({
      url: '/map/getAreaPage',
      method: 'post',
      data,
    })
  },

  // 采棉机监控
  getPickerMonitor(data) {
    return request({
      url: '/picker/getPickerMonitor',
      method: 'post',
      data,
    })
  },

  // 采棉机实时数据
  getPickerLiveData(data) {
    return request({
      url: '/picker/getPickerLiveData',
      method: 'post',
      data,
    })
  },

  // 获取地块列表
  getFenceList(data) {
    return request({
      url: '/map/getFenceList',
      method: 'get',
      params: data,
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
