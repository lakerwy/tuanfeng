<template>
  <div>
    <global-modal
      title="新增数据源"
      :visible="visible"
      v-if="visible"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
      width="40%"
    >
      <a-form-model
        ref="ruleForm"
        :model="form"
        :rules="rules"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 17 }"
        slot="modalBody"
      >
        <a-form-model-item
          label="服务器节点名称"
          ref="nodename"
          prop="nodename"
        >
          <a-input
            placeholder="请输入服务器节点名称"
            v-model="form.nodename"
            :disabled="disabled"
            @blur="
              () => {
                $refs.nodename.onFieldBlur();
              }
            "
          />
        </a-form-model-item>
        <a-form-model-item label="节点IP" ref="nodeip" prop="nodeip">
          <a-input
            placeholder="请输入节点IP"
            v-model="form.nodeip" :disabled="disabled"
            @blur="
              () => {
                $refs.nodeip.onFieldBlur();
              }
            "
          />
        </a-form-model-item>
        <!-- <a-form-model-item label="GPRC端口" prop="grpcport">
          <a-input :disabled="disabled" placeholder="请输入GPRC端口" v-model="form.grpcport" />
        </a-form-model-item> -->
        <a-form-model-item label="数据库类型" ref="dbtype" prop="dbtype">
          <a-select :disabled="disabled" v-model="form.dbtype" placeholder="请选择数据库类型">
            <a-select-option value="mysql">
              mysql
            </a-select-option>
            <a-select-option value="oracle">
              oracle
            </a-select-option>
            <a-select-option value="postgres">
              postgres
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="数据库端口" ref="dbport" prop="dbport">
          <a-input :disabled="disabled"
            placeholder="请输入数据库端口"
            v-model="form.dbport"
            @blur="
              () => {
                $refs.dbport.onFieldBlur();
              }
            "
          />
        </a-form-model-item>
        <a-form-model-item label="数据库名称" ref="dbname" prop="dbname">
          <a-input :disabled="disabled"
            placeholder="请输入数据库名称"
            v-model="form.dbname"
            @blur="
              () => {
                $refs.dbname.onFieldBlur();
              }
            "
          />
        </a-form-model-item>
        <a-form-model-item
          label="数据库用户名"
          ref="dbusername"
          prop="dbusername"
        >
          <a-input :disabled="disabled"
            placeholder="请输入数据库用户名"
            v-model="form.dbusername"
            @blur="
              () => {
                $refs.dbusername.onFieldBlur();
              }
            "
          />
        </a-form-model-item>
        <a-form-model-item
          label="数据库密码"
          ref="dbpassword"
          prop="dbpassword"
        >
          <a-input :disabled="disabled"
            placeholder="请输入数据库密码"
            v-model="form.dbpassword"
            @blur="
              () => {
                $refs.dbpassword.onFieldBlur();
              }"
            
          />
        </a-form-model-item>
         <!-- <a-form-model-item label="集群名称" prop="clustername"> -->
          <!-- <a-input :disabled="disabled" placeholder="请输入集群名称" v-model="form.clustername" /> -->
        <!-- </a-form-model-item> -->
        <a-form-model-item> 
          <a-button :loading="loading" @click="handleClickTest" class="btn" type="primary">
            测试连接
          </a-button>
        </a-form-model-item>
      </a-form-model>
    </global-modal>
  </div>
</template>

<script>
import globalModal from "@/components/globalModal/globalModal";
import { getdataSourceAddLists,getdataSourceTestLists } from "@/api/management";
export default {
  components: {
    globalModal
  },
  data() {
    // 验证IP
    let validateIPAddress = (rule, value, callback) => {
      let regexp = /^((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}$/;
      let valdata = value.split(",");
      let isCorrect = true;
      if (valdata.length) {
        for (let i = 0; i < valdata.length; i++) {
          if (regexp.test(valdata[i]) == false) {
            isCorrect = false;
          }
        }
      }

      if (value == "") {
        return callback(new Error("请输入iP地址"));
      } else if (!isCorrect) {
        callback(new Error("请输入正确对ip地址"));
      } else {
        callback();
      }
    };
    // 端口号验证
    let validatePort = (rule, value, callback) => {
      let reg = /^(([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-5]{2}[0-3][0-5]))$/;
      if (value == "") {
        return callback(new Error("请输入端口号"));
      } else if (reg.test(value) == false) {
        callback(new Error("请输入正确的端口号"));
      } else {
        callback();
      }
    };
    return {
      loading: false,
      disabled: false,
      isSuccess:0,
      form: {},
      visible: false,
      confirmLoading: false,
      rules: {
        nodename: [
          { required: true, message: "请输入服务器节点名称", trigger: "blur" },
          {
            whitespace: true,
            message: "不能输入空格"
          },
          {min:1,max:20,message:"名称不能超过20，请重新输入"}
        ],
        nodeip: [
          {
            required: true,
            message: "请输入节点IP",
            // validator: validateIPAddress,
            trigger: "blur"
          },
          {
            validator: validateIPAddress,
            trigger: "blur"
          },
          {
            whitespace: true,
            message: "不能输入空格"
          }
        ],
        dbtype: [
          { required: true, message: "请选择数据库类型", trigger: "change" }
        ],
        dbport: [
          {
            required: true,
            message: "请输入数据库端口",
            trigger: "blur"
          },
          {
            // required: true,
            validator: validatePort,
            trigger: "blur"
          },
          {
            whitespace: true,
            message: "不能输入空格"
          }
        ],
        dbname: [
          {
            required: true,
            message: "请输入数据库名称",
            trigger: "blur"
          },
          {
            whitespace: true,
            message: "不能输入空格"
          }
        ],
        dbusername: [
          {
            required: true,
            message: "请输入数据库用户名",
            trigger: "blur"
          },
          {
            whitespace: true,
            message: "不能输入空格"
          }
        ],
        dbpassword: [
          {
            required: true,
            message: "请输入数据库密码",
            trigger: "blur"
          },
          {
            whitespace: true,
            message: "不能输入空格"
          }
        ]
      }
    };
  },
  mounted() {},
  methods: {
    async meatData() {
      let params = this.form;
      let res = await getdataSourceAddLists(params);
      if (res.code == 200) {
        this.$parent.pagination.current = 1;
        this.$parent.meatData();
        this.$notification.open({
          message: "新增数据源成功",
          icon: <a-icon type="smile" style="color: #108ee9" />
        });
      } else {
        this.$notification.open({
          message: "新增数据失败，" + res.msg,
          icon: <a-icon type="close-circle" style="color: red" />
        });
      }
    },
    async meatDataTest() {
      let params = this.form;
      let res = await getdataSourceTestLists(params);
      if (res.code == 200) {
        this.isSuccess=1
        this.$notification.open({
          message: "测试连接成功",
          icon: <a-icon type="smile" style="color: #108ee9" />
        });
      } else {
        this.$notification.open({
          message:  res.msg,
          icon: <a-icon type="close-circle" style="color: red" />
        });
      }
      this.loading = false;
      this.disabled = false;
    },
    // 点击测试
    handleClickTest() {
      this.loading = true;
      this.disabled = true;
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.confirmLoading = true;
          this.meatDataTest();
          setTimeout(() => {
            this.confirmLoading = false;
          }, 1000);
        } else {
           this.$notification.open({
          message: "测试连接失败!",
          icon: <a-icon type="close-circle" style="color: red" />
        });
          return false;
        }
      });
    },
    handleOk() {
      if(this.isSuccess==1){
        this.visible = false;
        this.meatData();
      }else{
        this.$notification.open({
          message: "请先点击测试连接按钮，进行测试连接" ,
          icon: <a-icon type="close-circle" style="color: red" />
        });
      }
    },
    handleCancel() {
      this.$refs.ruleForm.resetFields();
      this.visible = false;
    }
  }
};
</script>

<style lang="less" scoped>
.btn {
  margin-left: 60px;
}
</style>
