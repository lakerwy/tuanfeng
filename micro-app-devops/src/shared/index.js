/*
 * @Author: 任继民
 * @Date: 2020-10-17 13:47:20
 * @LastEditors: 任继民
 * @LastEditTime: 2021-01-11 14:09:47
 * @Description:
 */
// class Shared {
//   /**
//    * 获取 Token
//    */
//   getToken() {
//     // 子应用独立运行时，在 localStorage 中获取 token
//     return localStorage.getItem("token") || "";
//   }

//   /**
//    * 设置 Token
//    */
//   setToken(token) {
//     // 子应用独立运行时，在 localStorage 中设置 token
//     localStorage.setItem("token", token);
//   }
// }

// class SharedModule {
//   static shared = new Shared()

//   /**
//    * 重载 shared
//    */
//   static overloadShared(shared) {
//     SharedModule.shared = shared;
//   }

//   /**
//    * 获取 shared 实例
//    */
//   static getShared() {
//     return SharedModule.shared;
//   }
// }

// export default SharedModule;