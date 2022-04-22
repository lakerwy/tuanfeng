/*
 * @Author: 任继民
 * @Date: 2020-10-10 11:14:40
 * @LastEditors: 任继民
 * @LastEditTime: 2020-10-21 19:04:42
 * @Description:
 */
import { initGlobalState, MicroAppStateActions } from "qiankun";

const initialState = {};
const actions: MicroAppStateActions = initGlobalState(initialState);

export default actions;
