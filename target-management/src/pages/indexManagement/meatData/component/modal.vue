<template>
  <div>
    <global-modal
      title="编辑元数据"
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
        <a-form-model-item label="名称" ref="name" prop="name">
          <a-input
            placeholder="名称"
            v-model="form.name"
            @blur="
              () => {
                $refs.name.onFieldBlur();
              }
            "
          />
        </a-form-model-item>
        <a-form-model-item label="编码" ref="code" prop="code">
          <a-input
            placeholder="编码"
            v-model="form.code"
            @blur="
              () => {
                $refs.code.onFieldBlur();
              }
            "
          />
        </a-form-model-item>
        <a-form-model-item label="说明" ref="info" prop="info">
          <a-input
            placeholder="请输入 说明"
            v-model="form.info"
            @blur="
              () => {
                $refs.info.onFieldBlur();
              }
            "
          />
        </a-form-model-item>
        <a-form-model-item label="是否必填" ref="isNeed" prop="isNeed">
          <a-select v-model="form.isNeed" placeholder="请选择数据库类型">
            <a-select-option value="1">
              是
            </a-select-option>
            <a-select-option value="2">
              否
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="填写方式" ref="style" prop="style">
          <template v-if="form.code != 'itemcode'">
            <a-select v-model="form.style" placeholder="请选择填写方式">
              <a-select-option value="1">
                手动填写
              </a-select-option>
              <a-select-option value="3">
                默认
              </a-select-option>
            </a-select>
          </template>
          <template v-else>
            <a-input
              placeholder="请输入填写方式"
              disabled
              v-model="form.style"
              @blur="
                () => {
                  $refs.style.onFieldBlur();
                }
              "
            />
          </template>
        </a-form-model-item>
        <template v-if="form.style === '1'">
          <a-form-model-item label="值域" ref="valuetext" prop="valuetext">
            <a-input
              placeholder="请输入值域"
              v-model="form.valuetext"
              @blur="
                () => {
                  $refs.valuetext.onFieldBlur();
                }
              "
            />
          </a-form-model-item>
        </template>
      </a-form-model>
    </global-modal>
  </div>
</template>

<script>
import globalModal from "@/components/globalModal/globalModal";
import { getMetadataUpdLists } from "@/api/management";
export default {
  props: ["form"],
  components: {
    globalModal
  },
  data() {
    return {
      visible: false,
      confirmLoading: false,
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        code: [
          {
            required: true,
            message: "请输入编码",
            trigger: "blur"
          }
        ],
        info: [{ required: true, message: "请输入 说明", trigger: "blur" }],
        isNeed: [
          {
            required: true,
            message: "请选择必填",
            trigger: "change"
          }
        ],
        style: [
          {
            required: true,
            message: "请选择填写方式",
            trigger: "change"
          }
        ],
        valuetext: [
          {
            required: true,
            message: "请输入值域",
            trigger: "blur"
          }
        ]
      }
    };
  },
  mounted() {},
  methods: {
    async meatData() {
      if (this.form.isSys === "是") {
        this.form.isSys = 1;
      } else {
        this.form.isSys = 2;
      }
      if (this.form.isNeed === "是") {
        this.form.isNeed = 1;
      } else {
        this.form.isNeed = 2;
      }
      if (this.form.style === "手动填写") {
        this.form.style = 1;
      } else if (this.form.style === "自动填写") {
        this.form.style = 2;
      } else {
        this.form.style = 3;
      }
      let params = this.form;
      let res = await getMetadataUpdLists(params);
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
