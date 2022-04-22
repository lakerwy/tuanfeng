<template>
  <div class="manage-home">
    <img src="img/BackendIndex.png" alt="">
    <div class="home-wel">欢迎使用用户管理系统</div>
  </div>
</template>
<script>
import store from '@/store'
export default {
  created () {
    // this.initData()
  },
  mounted () {
	  // history.pushState(null,null,document.URL);
    // 	  window.addEventListener('popstate',function(){
    // 	  			  history.pushState(null,null,document.URL)
    // 	  })
  },
  methods: {
    initData () {
      store.dispatch('getUserInfo').then(res => {

      })
    }
  }
}
</script>

<style lang="less">
.manage-home{
  text-align: center;
  padding-top: 100px;
  .home-wel{
    font-size: 18px;
    color: #4e4e4e;;
    line-height: 50px;
  }
  .home-sys{
    font-size: 16px;
    color: #757575;
    line-height: 50px;
  }
}
</style>
