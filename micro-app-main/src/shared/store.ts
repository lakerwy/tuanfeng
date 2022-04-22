/*
 * @Author: 任继民
 * @Date: 2020-10-21 18:58:52
 * @LastEditors: 任继民
 * @LastEditTime: 2021-04-08 19:54:11
 * @Description:
 */
import { createStore } from "redux";

export type State = {
  token?: string;
};

type Action = {
  type: string;
  payload: any;
};

const reducer = (state: State = {}, action: Action): State => {
  switch (action.type) {
    default:
      return state;
    // 设置 Token
    case "SET_TOKEN":
      return {
        ...state,
        token: action.payload,
      };
  }
};



const store = createStore<State, Action, unknown, unknown>(reducer);

// // 注意 subscribe() 返回一个函数用来注销监听器
// let unsubscribe = store.subscribe(() =>
//   console.log(store.getState())
// )

export default store;
