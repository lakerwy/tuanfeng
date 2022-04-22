<template>
  <div class="user-avatar-dropdown">
    <Dropdown @on-click="handleClick">
      <Avatar :style="{background: color}" :src="userAvatar">{{getNicknameAt}}</Avatar>
      <label class="user-name" style="font-size:14px">{{userName}}</label>
      <Icon :size="18" type="md-arrow-dropdown"></Icon>
      <DropdownMenu slot="list">
        <!-- <DropdownItem name="setting"><Icon size="16" type="md-person" /> 个人设置</DropdownItem> -->
        <DropdownItem divided name="logout"><Icon size="16" type="md-power" /> 退出登录</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import './user.less'
import { mapActions } from 'vuex'
import { sub } from '@/libs/tools'
// import {getDistrict} from '@/api/amd'

const ColorList = ['#f56a00']
const rnd = (n, m) => {
  let random = Math.floor(Math.random() * (m - n + 1) + n)
  return random
}

export default {
  name: 'User',
  props: {
    userName: {
      type: String,
      default: ''
    },
    nickName: {
      type: String,
      default: ''
    },
    userAvatar: {
      type: String,
      default: ''
    }
  },
  // 		mounted() {
  // 			console.log(this.userName)
  // 		},
  data () {
    return {
      // color: ColorList[rnd(0,ColorList.length-1)]
      color: '#f56a00'
    }
  },
  computed: {
    getNicknameAt () {
      return this.nickName ? sub(this.nickName, 2, false) : ''
    }
  },
  mounted () {
    // let params = {
    //   token: Cookies.get('j_s_id'),
    // }
    // let res = getUserByToken(params);
    // console.log(res)
  },
  methods: {
    ...mapActions([
      'handleLogout'
    ]),
    handleClick (name) {
      switch (name) {
        case 'setting':
          this.$router.push({
            name: 'setting'
          })
          break
        case 'logout':
          localStorage.clear()
          sessionStorage.clear()
          Cookies.set('j_s_id_token', '', -1)
          Cookies.set('j_s_id', '', -1)
          window.location.href = window.globalUrl.sso.SSO_BASE_URL + 'logout?service=' + window.globalUrl.sso.OAUTH_REDIRECT_URI
          // this.handleLogout().then(() => {
          //   // 地址栏重新刷新
          //   location.reload()
          // })
          break
      }
    }
  }
}
</script>
