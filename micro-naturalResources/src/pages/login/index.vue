<!-- 
 -->
<template>
  <div class="login">
    <div>login</div>
    <div class="login-form">
        <login-form />
    </div>
    
  </div>
</template>

<script>
import LoginForm from "./components/loginForm";
export default {
  data() {
    return {};
  },

  props: {},

  components: {
    LoginForm,
  },

  created() {},

  computed: {},

  mounted() {},

  methods: {},
};
</script>
<style lang="less" scoped>
.login {
    min-height: 960px;
    //background: url("../../assets/imgs/3d-earth.jpg");
    background-size: cover;
    display: flex;
    justify-content: center;
    .login-form {
        margin: 10% 0 0 30%;
    }
}

</style>
