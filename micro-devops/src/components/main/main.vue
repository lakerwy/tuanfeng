<template >
  <Content :class="mainClass">
    <Layout class="main-layout-content-wrapper">
        <Content class="main-layout-view-wrapper">
          <keep-alive :include="cacheList">
            <router-view/>
          </keep-alive>
          <ABackTop :height="100" :bottom="80" :right="50" container=".main-layout-view-wrapper"></ABackTop>
        </Content>
    </Layout>
  </Content>
</template>

<script>
import SideMenu from './components/side-menu'
import HeaderBar from './components/header-bar'
import TagsNav from './components/tags-nav'
import User from './components/user'
import ABackTop from './components/a-back-top'
import Fullscreen from './components/fullscreen'
import Language from './components/language'
import ErrorStore from './components/error-store'
import siderTrigger from './components/header-bar/sider-trigger'
import customBreadCrumb from './components/header-bar/custom-bread-crumb'
import { mapMutations, mapActions, mapGetters } from 'vuex'
import { getNewTagList, getNextRoute, routeEqual } from '@/libs/util'
import minLogo from '@/assets/images/logo-min.png'
import maxLogo from '@/assets/images/logo.png'
import './main.less'
import Layout from '../../../node_modules/iview/src/components/layout/layout'
// import { menuList } from './option'
// import { userInfo } from 'os';
export default {
  name: 'Main',
  components: {
    Layout,
    SideMenu,
    HeaderBar,
    Language,
    TagsNav,
    Fullscreen,
    ErrorStore,
    User,
    ABackTop,
    customBreadCrumb,
    siderTrigger
  },
  data () {
    return {
      value1: false,
      collapsed: false,
      layout: '',
      minLogo,
      maxLogo,
      isFullscreen: false,
      screenWidth: 0,
      userInfo: JSON.parse(sessionStorage.getItem('userInfo')),
      // menuList: menuList
    }
  },
  computed: {
    ...mapGetters([
      'errorCount'
    ]),
    breadCrumbList () {
      return this.$store.state.app.breadCrumbList
    },
    headerLogoClass () {
      return [
        'main-layout-header-logo',
        this.collapsed ? 'main-layout-header-logo-collapsed' : ''
      ]
    },
    mainClass () {
      return [
        'main-layout-content',
        this.collapsed ? 'main-layout-content-collapsed' : ''
      ]
    },
    tagNavList () {
      return this.$store.state.app.tagNavList
    },
    tagRouter () {
      return this.$store.state.app.tagRouter
    },
    userAvatar () {
      if (this.$store.state.user.avatarImgPath) {
        return this.$store.state.user.avatarImgPath
      } else {
        return sessionStorage.getItem('uCenterAvatar')
      }
      // return this.$store.state.user.avatarImgPath
    },
    userName () {
      if (this.$store.state.user.userName) {
        return this.$store.state.user.userName
      } else {
        return sessionStorage.getItem('uCenterName')
      }
    },
    nickName () {
      return this.$store.state.user.nickName
    },
    cacheList () {
      return this.tagNavList.length ? this.tagNavList.filter(item => !(item.meta && item.meta.notCache)).map(item => item.name) : []
    },
    menuList () {
    	if (this.$store.state.user.menus.length > 0) {
        return this.$store.state.user.menus
      }else {
        return JSON.parse(sessionStorage.getItem('menulist'));
        // return this.userInfo ? this.userInfo.userInfo.menus : {};
      }
      return this.$store.getters.menuList
    },
    local () {
      return this.$store.state.app.local
    },
    hasReadErrorPage () {
      return this.$store.state.app.hasReadErrorPage
    }
  },
  //  beforeRouteEnter (to, from, next) {
  //     next(vm =>{
  //     })
  //   },
  created () {

  },
  methods: {
    ...mapMutations([
      'setBreadCrumb',
      'setTagNavList',
      'addTag',
      'setLocal'
    ]),
    ...mapActions([
      'handleLogin'
    ]),
    turnToPage (route) {
      let { name, params, query } = {}
      if (typeof route === 'string') name = route
      else {
        name = route.name
        params = route.params
        query = route.query
      }
      if (name.indexOf('isTurnByHref_') > -1) {
        window.open(name.split('_')[1])
        return
      }
      if (sessionStorage.getItem('defalutActiveUrl') === route) {
        sessionStorage.setItem('defalutActiveUrl', route)
        this.$router.replace({
          path: '/redirect',
          query: {
            name: encodeURI(route)
          }
        })
      } else {
        sessionStorage.setItem('defalutActiveUrl', route)
        this.$router.push({
          name,
          params,
          query
        })
      }
    },
    changeLayout (layout) {
      if (!layout) {
        layout = 'left'
      }
      localStorage.setItem('layout', layout)
      this.$Message.info('选择布局:' + layout)
      this.layout = layout
    },
    handleCollapsedChange (state) {
      this.collapsed = state
    },
    handleCloseTag (res, type, route) {
      if (type === 'all') {
        this.turnToPage(this.$config.homeName)
      } else if (routeEqual(this.$route, route)) {
        if (type !== 'others') {
          const nextRoute = getNextRoute(this.tagNavList, route)
          this.$router.push(nextRoute)
        }
      }
      this.setTagNavList(res)
    },
    handleClick (item) {
      this.turnToPage(item)
    },
    setLayout () {
      let layout = localStorage.getItem('layout')
      if (!layout) {
        layout = 'left'
        localStorage.setItem('layout', layout)
      }
      this.layout = layout
    }
  },
  watch: {
    screenWidth (val) {
      const that = this
      if (val < 768) {
        // 小于768强制折叠
        that.handleCollapsedChange(true)
      } else {
        that.handleCollapsedChange(false)
      }
    },
    '$route' (newRoute) {
      const { name, query, params, meta } = newRoute
      // console.log(newRoute)
      this.addTag({
        route: { name, query, params, meta },
        type: 'push'
      })
      this.setBreadCrumb(newRoute)
      this.setTagNavList(getNewTagList(this.tagNavList, newRoute))
      this.$refs['sideMenu'].updateOpenName(newRoute.name)
    }
  },
  mounted () {
    const that = this
    // 宽度适应
    that.screenWidth = document.body.clientWidth
    window.onresize = () => {
      return (() => {
        that.screenWidth = document.body.clientWidth
      })()
    }
    // 设置布局
    this.setLayout()
    // 初始化设置面包屑导航和标签导航
    this.setTagNavList()
    this.addTag({
      route: this.$store.state.app.homeRoute
    })
    this.setBreadCrumb(this.$route)
    // 设置初始语言
    this.setLocal(this.$i18n.locale)
    // 如果当前打开页面不在标签栏中，跳到homeName页
    if (!this.tagNavList.find(item => item.name === this.$route.name)) {
      this.$router.push({
        name: this.$config.homeName
      })
    }
  }
}
</script>
