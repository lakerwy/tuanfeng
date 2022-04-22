/*
 * @Author: 任继民
 * @Date: 2020-10-17 13:47:20
 * @LastEditors: 任继民
 * @LastEditTime: 2020-10-17 13:52:31
 * @Description:
 */
class Shared {
  /**
   * 获取token
   */
  getToken() {
    return localStorage.token || '';
  }
  setToken(token) {
    localStorage.token = token;
  }
}

class SharedModule {
  static shared = new Shared();
  /**
   * 重载shared
   * @param {*} shared
   */
  static overloadShared(shared) {
    SharedModule.shared = shared;
  }
  /**
   * 获取shared实例
   */
  static getShared() {
    return SharedModule.shared
  }
}
export default SharedModule;
