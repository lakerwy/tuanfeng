/*
 * @Author: 任继民
 * @Date: 2020-10-10 11:14:40
 * @LastEditors: 任继民
 * @LastEditTime: 2021-04-09 10:27:04
 * @Description:
 */
import Cookies from 'js-cookie'
import store from "./store";

class Shared {
  /**
   * 获取 Token
   */
  public getToken(): string {
    const state = store.getState();
    return state.token || Cookies.get('j_s_id');
  }

  /**
   * 设置 Token
   */
  public setToken(token: string): void {
    // 将 token 的值记录在 store 中
    store.dispatch({
      type: "SET_TOKEN",
      payload: token
    });
  }
}



const shared = new Shared();

export default shared;
