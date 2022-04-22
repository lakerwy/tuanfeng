/*
 * @Author: 任继民
 * @Date: 2021-04-09 09:07:21
 * @LastEditors: 任继民
 * @LastEditTime: 2021-06-24 15:20:48
 * @Description:
 */
const state = {
  mainName: '',
  subName:'',
  thirdName: '',
  openKeys: '',
  selectKeys: '',
  usePhone: '',
  useEmail:'',
  useAddress:''
};
const mutations = {
  ADDMAINNAME: (state: any, value: string) => {
    state.mainName = value;
    sessionStorage.mainName = value;
  },
  ADDSUBNAME: (state: any, value: string) => {
    state.subName = value;
    sessionStorage.subName = value;
  },
  ADDTHIRDNAME: (state: any, value: string) => {
    state.thirdName = value;
    sessionStorage.thirdName = value;
  },
  SETOPENKEYS: (state: any, value: string) => {
    state.openKeys = value;
  },
  SETSELECTKEYS: (state: any, value: string) => {
    state.selectKeys = value;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
};
