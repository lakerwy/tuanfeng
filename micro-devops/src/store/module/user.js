import Cookies from 'js-cookie'
import actions from "@/shared/actions";
import { getUserByToken } from '@/api/user'
import { Message } from 'iview'
import { setToken, getToken, createTree } from '@/libs/util'
export default {
  state: {
    userName: '',
    userId: '',
    nickName: '',
    avatarImgPath: '',
    token: getToken(),
    access: [],
    hasGetInfo: false,
    userDesc: '',
    mobile: '',
    email: '',
    authLogin: true,
    menus: []// 用户菜单
  },
  mutations: {
    setAvatar (state, avatarPath) {
      state.avatarImgPath = avatarPath
    },
    setNickName (state, nickName) {
      state.nickName = nickName
    },
    setUserId (state, id) {
      state.userId = id
    },
    setUserName (state, name) {
      state.userName = name
    },
    setAccess (state, access) {
      state.access = access
    },
    setToken (state, { token, auto }) {
      state.token = token
      setToken(token, auto)
    },
    setHasGetInfo (state, status) {
      state.hasGetInfo = status
    },
    setUserMenus (state, menus) {
      state.menus = menus
    },
    setMobile (state, mobile) {
      state.mobile = mobile
    },
    setEmail (state, email) {
      state.email = email
    },
    setUserDesc (state, userDesc) {
      state.userDesc = userDesc
    },
    setauthLogin (state, info) {
      state.authLogin = info
    }
  },
  actions: {
    isAdminRole({ state, commit }) {
      return new Promise((resolve, reject) => {
        let params = {
          token: Cookies.get('j_s_id'),
          code: 'userCenter'
        }
        getUserByToken(params).then(res => {
          debugger
          if (res.success) {
            if (res.data.role && res.data.role.code !== '0004') {
              commit('setauthLogin', false)
              Message.info('没有权限登录用户管理中心!')
              localStorage.clear()
              sessionStorage.clear()
              Cookies.set('j_s_id_token', '', -1)
              Cookies.set('j_s_id', '', -1)
              setTimeout(() => {
                window.location.href = window.globalUrl.sso.SSO_BASE_URL + 'logout?service=' + window.globalUrl.sso.OAUTH_REDIRECT_URI
              }, 2000)
            }else {
              debugger
              // router.push('/');
            }
          }
          return res
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 获取用户相关信息
    getUserInfo ({ commit }) {
      let token = null;
      // onGlobalStateChange 第二个入参为 true，代表立即执行一次观察者函数
      actions.onGlobalStateChange(state => {
        const { accessToken } = state;
        token = accessToken;
        // 未登录 - 返回主页
      }, true);
      return new Promise((resolve, reject) => {
        let params = {
          token: token,
          code: 'userCenter'
        }
        getUserByToken(params).then(res => {
          if (res.success) {
            let tempArr = []
            let menuslist = []
            let allmuenName = []
            res.data.systemList[0].sysMenuList.forEach(element => {
              element.meta = {}
              element.meta.title = element.name
              element.name = element.url
              allmuenName.push(element.name)
            })
            tempArr = createTree(res.data.systemList[0].sysMenuList)
            tempArr.forEach(item => {
              menuslist.push(item)
            })
            sessionStorage.setItem('allmenuName', JSON.stringify(allmuenName))
            sessionStorage.setItem('menulist', JSON.stringify(menuslist))
            sessionStorage.setItem('uCenterName', res.data.userInfo.username)
            sessionStorage.setItem('uCenterAvatar', res.data.userInfo.userPic)
            commit('setAvatar', res.data.userInfo.userPic)
            commit('setUserName', res.data.userInfo.username)
            commit('setUserMenus', menuslist)
            commit('setNickName', res.data.nickName)
            commit('setUserId', res.data.userId)
            commit('setEmail', res.data.email)
            commit('setMobile', res.data.mobile)
            commit('setUserDesc', res.data.userDesc)
            const access = []
            if (res.data.authorities) {
              res.data.authorities.map(item => {
                if (item.authority) {
                  access.push(item.authority)
                }
              })
            }
            // 转换权限
            commit('setAccess', access)
            commit('setHasGetInfo', true)
          }
          return res
        }).catch(err => {
          console.log(err)
          reject(err)
        })
      })
    }
  }
}
