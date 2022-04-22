<template>
  <div>
    <a-modal v-model="visibles" title="修改密码" @ok="handleOk('ruleForm')" @cancel="handleCance('ruleForm')">
      <a-form-model
        ref="ruleForm"
        :model="form"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        :rules="rule"
      >
        <a-form-model-item label="原始密码" prop="oldPasswd">
          <a-input v-model="form.oldPasswd" type="password" autocomplete="off" placeholder="请输入原始密码"/>
        </a-form-model-item>
        <a-form-model-item has-feedback label="新密码" prop="newPasswd">
          <a-input v-model="form.newPasswd" type="password" autocomplete="off" placeholder="请输入新密码"/>
        </a-form-model-item>
        <a-form-model-item has-feedback label="再次输入新密码" prop="againPasswd">
          <a-input v-model="form.againPasswd" type="password" autocomplete="off" placeholder="请再次输入新密码"/>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>

import {getPasswdChange} from "@/apis";

export default {
  data() {
    let validatePass = (rule,value,callback)=>{
        if (value==''){
          callback (new Error('请输入密码'));
        } else{
          if(value.length<6){
            callback (new Error('密码过短'));
          } else{
          if(this.form.againPasswd!==''){
            this.$refs.ruleForm.validateField('againPasswd');
          }
          callback();
          }
        }
      }
      let validatePass2 = (rule,value,callback)=>{
        if (value==''){
          callback (new Error('请再次输入密码'));
        } else {
          if(value!==this.form.newPasswd){
            callback(new Error('与新密码不一致'));
          } else{
            callback();
          }
        }
      }
    return {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
      visibles: true,
      form: {
        oldPasswd: "",
        newPasswd: "",
        againPasswd: ""
      },
      rule:{
         oldPasswd:[
           {required: true, message: "请输入旧密码", trigger: "change"}
         ],
         newPasswd:[
           {
             required: true, message:"密码不能为空",trigger:"blur"
           },
           { required: true, min: 6, max: 18, message: '密码长度为6到18个字符', trigger: 'blur' },
           { required: true, pattern: /^[^\s]*$/, message: '密码不能输入空格', trigger: 'blur' }
          //  {
          //    min:6,message:"密码过短",trigger:"blur"
          //  }
         ],
         againPasswd:[
           {
            required:true, validator:validatePass2,trigger:"change"
           }
         ]

      }
    };
  },
  methods: {
    handleOk(formName) {
      this.$refs[formName].validate(async (valid)=>{
        if(valid){
          let params = {
            id: window.sessionStorage.getItem('passwordId'),
            oldPassword: this.form.oldPasswd,
            newPassword: this.form.newPasswd
          }
          console.log(formName);
          this.visibles = false;
          this.$refs[formName].resetFields();
          let res = await getPasswdChange(params);
          if (res.success) {
            this.visibles = false;
            this.$message.success('修改密码成功!')
            this.$parent.$parent.$parent.$parent.logout();
            // this.$root.$children
          } else {
            this.$message.info(res.status.message)
          }
        }
        else {
          console.log('error submit!!');
          return false;
        }
      })
    },
    handleCance(formName){
      this.$refs[formName].resetFields()
    }

  }
};
</script>
