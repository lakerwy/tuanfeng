<template>
  <div class="container">
    <div class="header">
      <img src="img/logo.png" alt="" style="height: 61px;float: left;margin-left: 20px;">
      <h1>时空大数据平台</h1>
      <!--<p><a href="/">首页</a></p>-->
    </div>
    <div class="findPwd">
      <h1>邮箱找回密码</h1>
      <Form ref="forgetForm"
        class="forgetForm"
        :model="formItem"
        :rules="formItemRules"
        inline
        >
        <FormItem label="" prop="mail">
          <Input type="email" v-model.trim="formItem.mail" placeholder="请输入邮箱账号"/>
        </FormItem>
        <FormItem label="" prop="passwd">
          <Input type="password" v-model.trim="formItem.passwd" placeholder="请设置新密码"/>
        </FormItem>
        <FormItem label="" prop="againpasswd">
          <Input type="password" v-model.trim="formItem.againpasswd" placeholder="请再次输入新密码"/>
        </FormItem>
        <FormItem label="" prop="code">
          <Input type="text" v-model.trim="formItem.code" placeholder="请输入验证码"/>
          <div class="sendCode">
            <span @click="getCode" v-show="!flag" style="cursor: pointer;">发送验证码</span>
            <span v-show="flag" style="color: #c7c9ce;">已发送({{count}})</span>
        </div>
        </FormItem>
      </Form>
      <!-- <input type="text" v-model="formItem.mail" placeholder="请输入邮箱账号" class="one">
      <span class="warning">
        <img src="img/warn.png" alt="" class="icon">
        <span>邮箱未注册</span>
      </span>
      <input type="text" v-model="formItem.passwd" placeholder="请设置新密码" class="two">
      <input type="text" v-model="formItem.againpasswd" placeholder="请再次输入密码" class="two border">
      <span class="warning">
        <img src="img/warn.png" alt="" class="icon">
        <span>密码不一致</span>
      </span>
      <div class="three">
        <input type="text" v-model="formItem.code" placeholder="请输入验证码">
        <div class="sendCode">
          <span @click="getCode" v-show="!flag" style="cursor: pointer;">发送验证码</span>
          <span v-show="flag" style="color: #c7c9ce;">已发送({{count}})</span>
        </div>
      </div> -->
      <div class="submit" @click="submitData">提交</div>
    </div>
  </div>
</template>
<script>
import { sendEmail, checkCode } from '@/api/account'
export default{

  data () {
    const validatePass = (rule, value, callback) => {
      let reg2 = /^.{6,18}$/
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (value !== '' && !reg2.test(value)) {
        callback(new Error('密码长度为6到18个字符'))
      } else {
        callback()
      }
    }
    const validateagainPass = (rule, value, callback) => {
      let reg2 = /^.{6,18}$/
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (value !== this.formItem.againpasswd) {
        callback(new Error('两次输入的密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      flag: false,
      count: '',
      timer: null,
      formItem: {},
      formItemRules: {
        mail: [
          { required: true, type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '验证码不能为空', trigger: 'blur' }
        ],
        passwd: [
          { required: true, message: '新密码不能为空', trigger: 'blur' },
          { required: true, validator: validatePass, trigger: 'blur' }
        ],
        againpasswd: [
          { required: true, message: '新密码不能为空', trigger: 'blur' },
          { required: true, validator: validateagainPass, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async getCode () {
      if (!this.formItem.mail) {
        this.$Message.error('请填写邮箱再发送验证码!')
        return
      }
      // 定义倒计时总时间
      const TIME = 60

      if (!this.timer) {
        this.count = TIME
        // 倒计时显示
        this.flag = true
        // 开启定时器
        this.timer = setInterval(() => {
          // 做判断
          if (this.count > 0 && this.count <= TIME) {
            this.count--
          } else {
            // 关闭倒计时
            this.flag = false
            // 清除定时器
            clearInterval(this.timer)
            this.timer = null
          }
        }, 1000)
      }
      let params = {
        mail: this.formItem.mail
      }
      let res = await sendEmail(params)
      if (res.success) {
        this.$Message.success('已发送到当前邮箱!')
        window.close()
      } else {
        this.$Message.error(res.status.message)
      }
    },
    submitData () {
      this.$refs.forgetForm.validate(async valid => {
        if (valid) {
          let params = {
            code: this.formItem.code,
            mail: this.formItem.mail,
            passwd: this.formItem.passwd
          }
          let res = await checkCode(params)
          if (res.success) {
            this.$Message.success('修改密码成功!')
            window.close()
          } else {
            this.$Message.error(res.status.message)
          }
        }
      })
    }
  }
}
</script>
<style lang="less">
  *{
    margin: 0;
    padding: 0;
  }
  .container{
    width: 100vw;
    height: 100vh;
    background: #f1f2f6;
  }
  .header{
    width: 100vw;
    height: 62px;
    background-color: #292c36;
    text-align: center;
  }
  .header h1{
    /* width: 181px; */
    height: 26px;
    font-family: MicrosoftYaHei;
    font-size: 26px;
    font-weight: normal;
    font-stretch: normal;
    line-height: 62px;
    letter-spacing: 0px;
    color: #feffff;
    float: left;
    margin-left: 6px;
  }
  .header p{
    float: right;
    color: white;
    /* margin-top: 25px; */
    margin-right: 40px;
    font-family: MicrosoftYaHei;
    font-size: 16px;
    line-height: 62px;
  }
  .findPwd{
    width: 880px;
    height: 504px;
    margin: 15vh auto;
    background-color: #ffffff;
    /* text-align: center; */
  }
  .findPwd h1{
    /* width: 200px; */
    /* height: 29px; */
    text-align: center;
    font-family: MicrosoftYaHei;
    font-size: 30px;
    font-weight: normal;
    font-stretch: normal;
    line-height: 32px;
    /* letter-spacing: 0px; */
    color: #4c5056;
    padding: 51px 0 39px;
    /* padding-left: 352px;
    padding-top: 51px; */
  }
  .findPwd input{
    width: 338px;
    height: 40px;
    border: solid 1px #bfbfbf;
    margin-left: 265px;
    padding-left: 12px;
  }
  input::-webkit-input-placeholder{
    /* 修改input框placeholder字体颜色 */
    color: #c7c9ce;
    font-size: 14px;
  }
  .findPwd input:first-child{
    margin-top: 39px;
    color: #0C7BEC;
  }
  .one{
    margin-top: 39px;
  }
  .warning{
    margin-left: 22px;
  }
  .icon{
    margin-right: 10px;
    vertical-align: middle;
    margin-bottom: 2px;

  }
  .warning span{
    font-family: MicrosoftYaHei;
    font-size: 14px;
    color: #f95e5e;
  }
  .two, .three{
    margin-top: 22px;
  }
  .border{
    border: solid 1px #f95e5e!important;
  }
  .three{
    width: 350px;
    height: 40px;
    margin-left: 265px;
    border: solid 1px #bfbfbf;
    display: flex;
  }
  .three input{
    border: none;
    width: 233px;
    height: 39px;
    float: left;
    margin: 0!important;
  }
  .sendCode{
    position: absolute;
    top: 0;
    right: 5px;
    width: 87px;
    height: 30px;
    border-left: 1px solid #bfbfbf;
    float: left;
    font-family: MicrosoftYaHei;
    font-size: 14px;
    color: #11a7f5;
    line-height: 30px;
    padding-left: 12px;
    margin-top: 5px;
  }
  .submit{
    width: 350px;
    height: 41px;
    font-size: 16px;
    background-color: #11a7f5;
    margin-top: 38px;
    margin-left: 265px;
    text-align: center;
    color: #ffffff;
    line-height: 41px;
  }
  .forgetForm {
    .ivu-form-item-error-tip {
      left: 270px;
    }
  }

</style>
