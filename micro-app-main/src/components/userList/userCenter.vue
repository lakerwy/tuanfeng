<template>
  <div>
    <a-modal v-model="visible" title="个人信息" @ok="handleOk" @cancel="handleCancel">
      <a-form-model
        ref="ruleForm"
        :model="form"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        :rules="formRule"
      >
        <a-form-model-item label="用户名" prop="username">
          <a-input v-model="form.username" placeholder="请输入用户名" disabled/>
        </a-form-model-item>
        <a-form-model-item label="真实姓名" prop="realname">
          <a-input v-model="form.realname" placeholder="请输入真实姓名" disabled/>
        </a-form-model-item>
        <a-form-model-item label="手机号码" prop="phone">
          <a-input v-model="form.phone" placeholder="请输入手机号码" disabled /> </a-form-model-item >
       <a-form-model-item label="邮箱" prop="email">
          <a-input v-model="form.email" placeholder="请输入邮箱" disabled />
        </a-form-model-item>
        <a-form-model-item label="地址" prop="address">
          <a-input v-model="form.address" disabled />
        </a-form-model-item>
        <a-form-model-item label="备注">
          <a-input v-model="form.remark" disabled />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
export default {
  data() {
    const validateRealName = (rule, value, callback) => {
      let reg2 = /[\u4E00-\u9FA5\uf900-\ufa2d]{2,6}$/
      if (value !== '' && !reg2.test(value)) {
        callback(new Error('真实姓名必须为汉字'))
      } else {
        callback()
      }
    }
     const validateMobile = (rule, value, callback) => {
      let reg = /^1[3456789]\d{9}$/
      if (value !== '' && !reg.test(value)) {
        callback(new Error('手机号码格式不正确'))
      } else {
        callback()
      }
    }
    return {
      labelCol: { span: 4 },
      wrapperCol: { span: 16 },
      visible: true,
      form: {
        username: "11",
        realname: "",
        phone: "",
        email: "",
        address: "",
        remark: ""
      },
      formRule: {
        username:[
          { required: true, message: "请输入用户名", trigger: "change" }
        ],
        realname:[
          { required: true, message: "请输入真实姓名", trigger: "change" },
          { min: 2,max: 15,message:"真实姓名必须在2到15个字符之内",trigger:"blur"},
          { required:true, validator:validateRealName , trigger:"blur"}
        ],
        phone:[
          { required: true, message: "请输入手机号", trigger: "blur" },
          { required: true, validator:validateMobile, trigger:"blur"}
        ],
        email:[
          { required: true, message: "请输入邮箱账号", trigger: "change" },
          { required: true, pattern: /^[^\s]*$/, message: '不能输入空格', trigger: 'blur' },
          { required: true, type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
        ],
        address:[
          { required: true, message: "请输入地址", trigger: "change" },
          { min: 2, max: 156, message: '地址长度为2到156个字符之间', trigger: 'blur' }
        ]
      }
    };
  },
  created() {
    this.form.username = window.sessionStorage.getItem('uCenterName');
    this.form.realname = window.sessionStorage.getItem('uCenterRealName');
    this.form.phone = window.sessionStorage.getItem('userPhone');
    this.form.email = window.sessionStorage.getItem('userEmail');
    this.form.address = window.sessionStorage.getItem('userAddress');
    this.form.remark = window.sessionStorage.getItem('remark');
  },
  methods: {
    handleOk(e) {
      console.log(e);
      this.$refs.ruleForm.validate(valid=>{
        if(valid){
          alert('sumbit!');
          this.visible = false;
          this.$refs.ruleForm.resetFields()
          // this.$refs.ruleForm.resetFields();
        } else {
          console.log('error submit!!');
          return false;
        }
      })
    },
    handleCancel(){
      this.$refs.ruleForm.resetFields()
    }

  }
};
</script>
