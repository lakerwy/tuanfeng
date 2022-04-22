<template>
  <div>
    <global-modal
      title="对标值管理"
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
            @blur="
              () => {
                $refs.arcode.onFieldBlur();
              }
            "
          />
        </a-form-model-item>
        <a-form-model-item label="行政区划名称" ref="arcname" prop="arcname">
          <a-input
            disabled
            placeholder="请输入行政区划名称"
            v-model="form.arcname"
            @blur="
              () => {
                $refs.arcname.onFieldBlur();
              }
            "
          />
        </a-form-model-item>
        <a-form-model-item label="指标编号" ref="kpiid" prop="kpiid">
          <a-input
            disabled
            placeholder="请输入指标编号"
            v-model="form.kpiid"
            @blur="
              () => {
                $refs.kpiid.onFieldBlur();
              }
            "
          />
        </a-form-model-item>
        <a-form-model-item label="指标名称" ref="kpiname" prop="kpiname">
          <a-input
            disabled
            placeholder="请输入指标名称"
            v-model="form.kpiname"
            @blur="
              () => {
                $refs.kpiname.onFieldBlur();
              }
            "
          />
        </a-form-model-item>
        <a-form-model-item label="单位" ref="unit" prop="unit">
          <a-input disabled placeholder="请输入单位" v-model="form.unit" />
        </a-form-model-item>
        <a-form-model-item label="最小值" ref="valMin" prop="valMin">
          <a-input
            placeholder="请输入最小值"
            v-model="form.valMin"
            @blur="
              () => {
                $refs.valMin.onFieldBlur();
              }
            "
          />
        </a-form-model-item>
        <a-form-model-item label="中间值" ref="valMid" prop="valMid">
          <a-input
            placeholder="请输入中间值"
            v-model="form.valMid"
            @blur="
              () => {
                $refs.valMid.onFieldBlur();
              }
            "
          />
        </a-form-model-item>
        <a-form-model-item label="最大值" ref="valMax" prop="valMax">
          <a-input
            placeholder="请输入最大值"
            v-model="form.valMax"
            @blur="
              () => {
                $refs.valMax.onFieldBlur();
              }
            "
          />
        </a-form-model-item>
      </a-form-model>
    </global-modal>
  </div>
</template>

<script>
import globalModal from "@/components/globalModal/globalModal";
import { getManageDataUpdLists } from "@/api/management";
import moment from "moment";
export default {
  components: {
    globalModal
  },
  props: ["form"],
  data() {
    let minValue = (rule, value, callback) => {
      if (this.form.valMid) {
        let midValue = parseInt(this.form.valMid);
        if (value > midValue) {
          return callback(new Error("最小值必须小于中间值，请重新输入"));
        } else {
          callback();
        }
      }
      if (this.form.valMax) {
        let maxValue = parseInt(this.form.valMax);
        if (value > maxValue) {
          return callback(new Error("最小值必须小于最大值，请重新输入"));
        } else {
          callback();
        }
      }
    };
    let midValue = (rule, value, callback) => {
      if (this.form.valMax && this.form.valMin) {
        let maxValue = parseInt(this.form.valMax);
        let minValue = parseInt(this.form.valMin);
        if (value > maxValue || value < minValue) {
          return callback(
            new Error("中间值必须介于最小值和最大值之间，请重新输入")
          );
        } else {
          callback();
        }
      }
      if (this.form.valMin) {
        let minValue = parseInt(this.form.valMin);
        if (value < minValue) {
          return callback(new Error("中间值必须大于最小值，请重新输入"));
        } else {
          callback();
        }
      }
      if (this.form.valMax) {
        let maxValue = parseInt(this.form.valMax);
        if (value > maxValue) {
          return callback(new Error("中间值必须小于最大值，请重新输入"));
        } else {
          callback();
        }
      }
    };
    let maxValue = (rule, value, callback) => {
      if (this.form.valMin && this.form.valMid == "") {
        let minValue = parseInt(this.form.valMin);
        if (value < minValue) {
          return callback(new Error("最大值必须大于最小值，请重新输入"));
        } else {
          callback();
        }
      }
      if (this.form.valMid && this.form.valMin == "") {
        let midValue = parseInt(this.form.valMid);
        if (value < midValue) {
          return callback(new Error("最大值必须大于中间值，请重新输入"));
        } else {
          callback();
        }
      }
      if (this.form.valMin && this.form.valMid) {
        let midValue = parseInt(this.form.valMid);
        let minValue = parseInt(this.form.valMin);
        if (value < midValue) {
          return callback(
            new Error("最大值必须大于中间值和最小值，请重新输入")
          );
        } else {
          callback();
        }
      }
    };
    return {
      visible: false,
      open: false,
      confirmLoading: false,
      rules: {
        arcode: [
          { required: true, message: "请输入行政区划编码", trigger: "blur" }
        ],
        arcname: [
          { required: true, message: "请输入行政区划名称", trigger: "blur" }
        ],
        kpiid: [{ required: true, message: "请输入指标编号", trigger: "blur" }],
        kpiname: [
          { required: true, message: "请输入指标名称", trigger: "blur" }
        ],
        valMin: [
          { required: true, message: "请输入最小值", trigger: "blur" },
          {
            message: "只能输入数字",
            pattern: /^[0-9]+$/
          },
          { validator: minValue }
        ],
        valMid: [
          { required: true, message: "请输入中间值", trigger: "blur" },
          {
            message: "只能输入数字",
            pattern: /^[0-9]+$/
          },
          { validator: midValue }
        ],
        valMax: [
          { required: true, message: "请输入最大值", trigger: "blur" },
          {
            message: "只能输入数字",
            pattern: /^[0-9]+$/
          },
          { validator: maxValue }
        ]
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
      this.form.years = value;
      this.open = false;
    },
    async meatData() {
      this.form.year = this.form.years.format("YYYY");
      let params = this.form;
      let res = await getManageDataUpdLists(params);
      if (res.code == 200) {
        this.$parent.meatData();
        this.$notification.open({
          message: "编辑成功",
          icon: <a-icon type="smile" style="color: #108ee9" />
        });
      } else {
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
      this.$parent.meatData();
      this.visible = false;
    }
  }
};
</script>

<style lang="less" scoped>
.last {
  position: relative;
  &-removebtn {
    position: absolute;
    bottom: 10px;
    right: 100px;
  }
  &-validationbtn {
    position: absolute;
    bottom: 10px;
    right: 30px;
  }
}
</style>
