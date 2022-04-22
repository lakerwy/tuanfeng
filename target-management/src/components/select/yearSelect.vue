<template>
<!-- 目标值批量新增 -->
  <div>
    <global-modal
      title="批量新增"
      :visible="visible"
      v-if="visible"
      :confirm-loading="confirmLoading"
      @ok="handleOk('ruleForm')"
      @cancel="handleCancel"
      width="40%"
    >
      <a-form-model
        ref="ruleForm"
        :model="form"
        :rules="rules"
        :label-col="{ span: 7 }"
        :wrapper-col="{ span: 15 }"
        slot="modalBody"
      >
        <a-form-model-item label="年份" ref="year" prop="year">
          <a-date-picker
            format="YYYY"
            mode="year"
            :value="year"
            :open="open"
            @openChange="openChange"
            @panelChange="panelChange"
          />
        </a-form-model-item>
      </a-form-model>
    </global-modal>
  </div>
</template>

<script>
import { getTargetManageAddsLists } from "@/api/management";
import globalModal from "@/components/globalModal/globalModal";
import moment from "moment";
export default {
  components: {
    globalModal
  },
  // props: ["form"],
  data() {
    return {
      open: false,
      year: moment(),
      visible: false,
      confirmLoading: false,
      form: {
        year:moment()
      },
      rules: {
        year: [{ required: true, message: "请选择年份", trigger: "change" }]
      }
    };
  },
  methods: {
    moment,
    openChange(status) {
      if (status) {
        this.open = true;
      } else {
        this.open = false;
      }
    },
    panelChange(value) {
      this.year = value;
      this.open = false;
    },
    async meatData() {
      let params = this.year.format('YYYY');
      let res = await getTargetManageAddsLists(params);
      if (res.code == 200) {
        this.$parent.meatData();
      }else{
        this.$notification.open({
          message: res.msg,
          icon: <a-icon type="close-circle" style="color: rgb(232,97,97)" />
        });
      }
    },

    handleOk(value) {
      this.$refs[value].validate(valid => {
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
      this.visible = false;
      this.$refs.ruleForm.resetFields();
    }
  }
};
</script>
