/*
 * @Author: 任继民
 * @Date: 2020-10-17 13:47:28
 * @LastEditors: 任继民
 * @LastEditTime: 2020-10-17 13:58:35
 * @Description:
 */
function IsActionNull() {
  console.warn('当前action为空!');
}
class Actions {
  // 默认值为空 Action
  actions = {
    onGlobalStateChange: IsActionNull,
    setGlobalState: IsActionNull,
  }
  /**
   * 设置actions
   * @param {*} actions
   */
  setActions(actions) {
    this.actions = actions;
  }
    /**
   * 映射
   */
  onGlobalStateChange(...args) {
    return this.actions.onGlobalStateChange(...args);
  }

  /**
   * 映射
   */
  setGlobalState(...args) {
    return this.actions.setGlobalState(...args);
  }
}
const actions = new Actions();
export default actions;
