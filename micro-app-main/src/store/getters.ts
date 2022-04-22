/*
 * @Author: 任继民
 * @Date: 2021-04-09 09:06:57
 * @LastEditors: 任继民
 * @LastEditTime: 2021-06-18 09:19:10
 * @Description:
 */
const getter = {
  mainName: (state: any)=> state.crumbs.mainName,
  subName: (state: any)=> state.crumbs.subName,
  thirdName: (state: any)=> state.crumbs.thirdName,
  openKeys: (state: any)=> state.crumbs.openKeys,
  selectKeys: (state: any)=> state.crumbs.selectKeys
}
export default getter
