<!-- 顶部导航栏 -->
<template>
  <div class="header">
    <div class="logo"></div>
    <el-menu :default-active="onRoutes" class="el-menu-demo" mode="horizontal" router>
      <el-menu-item v-for="item in navList" :key="item.id" :index="item.path">{{item.name}}</el-menu-item>
    </el-menu>
    <div class="user-info">
      <el-dropdown trigger="click" style="text-align: center">
        <div class="el-dropdown-link">
          <span class="el-icon-s-custom"></span>
          <span class="username">{{username}}</span>
          <span class="el-icon-caret-bottom"></span>
        </div>
        <el-dropdown-menu slot="dropdown" style="text-align: center">
          <el-dropdown-item @click.native="exit">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
// import { getUserInfo } from "@/api/user";
export default {
  data() {
    return {
      // 导航栏菜单
      navList: [
        {
          id: 0,
          name: "一张图",
          path: "oneMap",
        },
      ],
      username: "admin"
    };
  },

  props: {},

  components: {},

  created() {},

  computed: {
    onRoutes() {
      return this.$route.path.replace("/", "");
    },
  },

  mounted() {
    //this.getUserInfo();
  },

  methods: {
    // 获取用户信息
    async getUserInfo() {
      let res = await getUserInfo()
      if(res.success) {
        this.username = res.body.username
      }else {
        this.$message.error(res.message);
      }
    },
    // 退出登录
    exit() {
      sessionStorage.clear()
      this.$router.push("/");
    },
  },
};
</script>
<style lang="less" scoped>
.header {
  height: 58px;
  width: 100%;
  background: linear-gradient(
    180deg,
    rgba(0, 34, 53, 1) 0%,
    rgba(0, 37, 55, 1) 100%
  );
  display: flex;
  justify-content: center;
}
/deep/.el-menu {
  height: 58px;
  background: linear-gradient(
    180deg,
    rgba(0, 34, 53, 1) 0%,
    rgba(0, 37, 55, 1) 100%
  ) !important;
  border: none;
}
.el-menu-item {
  height: 58px;
  border: none;
  font-size: 16px;
  margin: 0 10px;
  background: linear-gradient(
    180deg,
    rgba(0, 34, 53, 1) 0%,
    rgba(0, 37, 55, 1) 100%
  );
  color: #fff !important;
  transition: none;
}
/deep/.el-menu-item:hover {
  background: rgba(0, 165, 242, 0.2) !important;
  color: #fff !important;
}
.el-menu--horizontal > .el-menu-item.is-active {
  background: linear-gradient(
    180deg,
    rgba(0, 165, 242, 0.6) 0%,
    rgba(0, 165, 242, 0.1) 100%
  );
  border: none;
  color: #fff;
}
.el-dropdown-link {
  color: #fff;
  font-size: 16px;
  padding-top: 20px;
  margin-left: 100px;
  outline: none !important;
  cursor: pointer;
  .username {
    padding: 0 10px;
  }
}
</style>
