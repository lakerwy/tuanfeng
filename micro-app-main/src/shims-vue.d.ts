/*
 * @Author: 任继民
 * @Date: 2020-10-10 11:14:40
 * @LastEditors: 任继民
 * @LastEditTime: 2021-04-08 16:57:53
 * @Description:
 */
declare module "*.vue" {
  import Vue from "vue";
  export default Vue;
}

declare module "nprogress" {
  class NProgress {
    /** 开始加载 */
    static start: Function;
    /** 结束加载 */
    static done: Function;
  }
  export default NProgress;
}
declare module 'ant-design-vue' {
  const Ant: any
  export default Ant;
}

declare module 'js-cookie';
