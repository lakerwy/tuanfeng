<template>
  <div>
    <global-modal
      title="目标值管理"
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
            :value="form.years"
            :open="open"
            @openChange="openChange"
            @panelChange="panelChange"
          />
        </a-form-model-item>
        <a-form-model-item label="行政区划编码" ref="arcode" prop="arcode">
          <a-input
            disabled
            placeholder="请输入行政区划编码"
            v-model="form.arcode"
          />
        </a-form-model-item>
        <a-form-model-item label="行政区划名称" ref="arcname" prop="arcname">
          <a-input
            disabled
            placeholder="请输入行政区划名称"
            v-model="form.arcname"
          />
        </a-form-model-item>
        <a-form-model-item label="指标编号" ref="kpiid" prop="kpiid">
          <a-input disabled placeholder="请输入指标编号" v-model="form.kpiid" />
        </a-form-model-item>
        <a-form-model-item label="指标名称" ref="kpiname" prop="kpiname">
          <a-input
            disabled
            placeholder="请输入指标名称"
            v-model="form.kpiname"
          />
        </a-form-model-item>
        <a-form-model-item label="单位" ref="unit" prop="unit">
            <a-input disabled placeholder="请输入单位" v-model="form.unit" />
          </a-form-model-item>
        <a-form-model-item label="基期值" ref="basevalue" prop="basevalue">
          <a-input
            placeholder="请输入基期值"
            v-model="form.basevalue"
          ></a-input>
        </a-form-model-item>
        <a-form-model-item
          label="近期目标值-本值"
          ref="recentlocalvalue"
          prop="recentlocalvalue"
        >
          <a-input
            placeholder="请输入近期目标值-本值"
            v-model="form.recentlocalvalue"
          ></a-input>
        </a-form-model-item>
        <a-form-model-item
          label="近期目标值-上级下达"
          ref="recentupvalue"
          prop="recentupvalue"
        >
          <a-input
            placeholder="请输入近期目标值-上级下达"
            v-model="form.recentupvalue"
          ></a-input>
        </a-form-model-item>
        <a-form-model-item
          label="规划目标值-本值"
          ref="planlocalvalue"
          prop="planlocalvalue"
        >
          <a-input
            placeholder="请输入规划目标值-本值"
            v-model="form.planlocalvalue"
          ></a-input>
        </a-form-model-item>
        <a-form-model-item
          label="规划目标值-上级下达"
          ref="planupvalue"
          prop="planupvalue"
        >
          <a-input
            placeholder="请输入规划目标值-上级下达"
            v-model="form.planupvalue"
          ></a-input>
        </a-form-model-item>
      </a-form-model>
    </global-modal>
  </div>
</template>

<script>
import { getTargetManageDataUpdLists } from "@/api/management";
import globalModal from "@/components/globalModal/globalModal";
import moment from "moment";
export default {
  components: {
    globalModal
  },
  props: ["form"],
  data() {
    return {
      // form:{},
      visible: false,
      confirmLoading: false,
      open: false,
      rules: {
        basevalue: [
          { required: true, message: "请输入基期值", trigger: "blur" },
          {
            message: "只能输入数字",
            pattern: /^[0-9]+\.?[0-9]*$/
          }
        ],
        recentlocalvalue: [
          {
            required: true,
            message: "请输入近期目标值-本值，必须为 数值 ，如0,1,2,3...",
            trigger: "blur"
          },
          {
            message: "只能输入数字",
            pattern: /^[0-9]+\.?[0-9]*$/
          }
          // {required: true,validator: check,trigger: 'blur' }
        ],
        recentupvalue: [
          {
            required: true,
            message: "请输入近期目标值-上级下达，必须为 数值 ，如0,1,2,3...",
            trigger: "blur"
          },
          {
            message: "只能输入数字",
            pattern: /^[0-9]+\.?[0-9]*$/
          }
        ],
        planlocalvalue: [
          {
            required: true,
            message: "请输入规划目标值-本值,必须为数值，如0,1,2,3...",
            trigger: "blur"
          },
          {
            message: "只能输入数字",
            pattern: /^[0-9]+\.?[0-9]*$/
          }
        ],
        planupvalue: [
          {
            required: true,
            message: "请输入规划目标值-上级下达,必须为数值，如0,1,2,3...",
            trigger: "blur"
          },
          {
            message: "只能输入数字",
            pattern: /^[0-9]+\.?[0-9]*$/
          }
        ]
      }
    };
  },
  mounted(){
    // console.log(this.form)
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
      this.form.years = value;
      this.open = false;
    },
    async meatData() {
      this.form.year = this.form.years.format("YYYY");
      let params = this.form;
      let res = await getTargetManageDataUpdLists(params);
      if (res.code == 200) {
        this.$parent.meatData();
      }
    },

    handleOk(value) {
      this.$refs[value].validate(valid => {
        if (valid) {
          this.confirmLoading = true;
          this.meatData();
          this.$notification.open({
            message: "编辑成功",
            icon: <a-icon type="smile" style="color: #108ee9" />
          });
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
      // this.$refs.ruleForm.resetFields();
      this.visible = false;
      this.meatData();
    }
  }
};
</script>
