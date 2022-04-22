<template>
  <div class="login-box">
    <div class="login-title">用户登录</div>
    <el-form :model="loginForm" class="login-form" :rules="rules" ref="loginForm">
      <el-form-item prop="username">
        <el-input
          v-model="loginForm.username"
          clearable
          placeholder="请输入用户名"
          @keyup.enter.native="submitForm"
        >
          <i slot="prefix" class="el-icon-user-solid"></i>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          type="password"
          v-model="loginForm.password"
          placeholder="请输入密码"
          clearable
          auto-complete="off"
          @keyup.enter.native="submitForm"
        >
          <i slot="prefix" class="el-icon-star-on"></i>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="login-btn" @click="submitForm">
          <span v-show="loginText">登 录</span>
          <span v-show="!loginText">
            登 录 中
            <i class="el-icon-loading"></i>
          </span>
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { login } from "@/api/login";
export default {
  name: "loginForm",
  components: {},
  data() {
    return {
      loginForm: {
        username: "",
        password: "",
      },
      rules: {
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur",
          },
        ],
        username: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur",
          },
        ],
      },
      loginText: true, //登录按钮文字
    };
  },
  methods: {
    submitForm() {
      this.loginText = false;
      this.$refs.loginForm.validate(async (valid) => {
        if (valid) {
          //登录接口
          let res = await login(this.loginForm);
          if (res.success) {
            const tokenStr = res.body.token_type + " " + res.body.access_token;
            sessionStorage.setItem("accessToken", tokenStr);
            this.$router.push({
              path: "/reconnaissanceInfo",
            });
          } else {
            this.loginText = true;
            this.$message.error(res.message);
          }
        } else {
          this.loginText = true;
        }
      });
    },
  },
  created() {},
  mounted() {},
};
</script>

<style lang="less" scoped>
.login-box {
  width: 400px;
  padding: 50px;
  .login-title {
    color: #fff;
    font-size: 30px;
    margin-bottom: 30px;
  }
  .login-form {
    .el-form-item {
      margin-bottom: 30px;
    }
    .el-button {
      width: 400px;
      background: rgb(16, 145, 219);
      border: none;
      color: #fff;
    }
  }
}
.el-icon-user-solid,
.el-icon-star-on {
  padding-top: 10px;
  font-size: 20px;
  color: rgb(16, 145, 219);
}
</style>
