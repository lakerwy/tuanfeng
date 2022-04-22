<template>
  <div>
    <global-modal
      title="数据字典管理"
      :visible="visible"
      v-if="visible"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
      width="40%"
    >
      <a-form-model
        ref="form"
        :model="form"
        :rules="rules"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 17 }"
        slot="modalBody"
      >
        <a-form-model-item label="编码" ref="code" prop="code">
          <a-input
            placeholder="请输入字典编码"
            v-model="form.code"
            @blur="
              () => {
                $refs.code.onFieldBlur();
              }"
            
          />
        </a-form-model-item>
        <a-form-model-item label="名称" ref="name" prop="name">
          <a-input
            placeholder="请输入字典名称"
            v-model="form.name"
            @blur="
              () => {
                $refs.name.onFieldBlur();
              }"
            
          />
        </a-form-model-item>
        <a-form-model-item label="值" ref="value" prop="value">
          <a-input
            placeholder="请输入值"
            v-model="form.value"
            @blur="
              () => {
                $refs.value.onFieldBlur();
              }"
            
          />
        </a-form-model-item>
        <!-- <a-form-model-item label="备注" prop="remark">
          <a-input placeholder="请输入备注" v-model="form.remark" />
        </a-form-model-item> -->
      </a-form-model>
    </global-modal>
  </div>
</template>

<script>
import globalModal from "@/components/globalModal/globalModal";
import { getDataDictionaryUpdLists } from "@/api/management";
export default {
  components: {
    globalModal
  },
  props: ["form"],
  data() {
    return {
      visible: false,
      confirmLoading: false,
      rules: {
        code: [{ required: true, message: "请输入编码", trigger: "blur" },{
            min: 2,
            max: 20,
            message: "最小长度为2个字符，最大长度为20个字符"
          }],
        name: [
          {
            required: true,
            message: "请输入名称",
            trigger: "blur"
          },
          {
            min: 2,
            max: 20,
            message: "最小长度为2个字符，最大长度为20个字符"
          }
        ],
        value: [
          { required: true, message: "请选择数据库类型", trigger: "blur" },
          {
            min: 2,
            max: 20,
            message: "最小长度为2个字符，最大长度为20个字符"
          }
        ]
      }
    };
  },
  methods: {
    async meatData() {
      let params = this.form;
      let res = await getDataDictionaryUpdLists(params);
      if (res.code == 200) {
        this.$parent.meatData();
        this.$notification.open({
            message: "编辑成功",
            icon: <a-icon type="smile" style="color: #108ee9" />
          });
      }else {
        this.$notification.open({
          message: "编辑失败，" + res.msg,
          icon: <a-icon type="close-circle" style="color: rgb(232,97,97)" />
        });
      }
    },
    handleOk() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.confirmLoading = true;
          this.meatData();
          setTimeout(() => {
            this.visible = false;
            this.confirmLoading = false;
          }, 1000);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleCancel() {
      this.$refs.form.resetFields();
      this.visible = false;
    }
  }
};
</script>
