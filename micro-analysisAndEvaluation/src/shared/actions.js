/*
 * @Author: 任继民
 * @Date: 2020-10-17 13:47:28
 * @LastEditors: 任继民
 * @LastEditTime: 2020-10-21 19:05:34
 * @Description:
 */
function emptyAction() {
  // 警告：提示当前使用的是空 Action
  console.warn("Current execute action is empty!");
}

class Actions {
  // 默认值为空 Action
  actions = {
    onGlobalStateChange: emptyAction,
    setGlobalState: emptyAction
  };

  /**
   * 设置 actions
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
