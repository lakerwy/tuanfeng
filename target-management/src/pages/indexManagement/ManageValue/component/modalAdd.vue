<template>
  <div>
    <global-modal
      title="对标值管理"
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
            :value="form.year"
            :open="open"
            @openChange="openChange"
            @panelChange="panelChange"
          />
        </a-form-model-item>
        <a-form-model-item label="行政区划名称" ref="arcname" prop="arcname">
          <a-select
            v-model="form.arcname"
            placeholder="请选择行政区划名称"
            allow-clear
            @change="handleChange"
          >
            <a-select-option v-for="item in options" :key="item.name">
              {{ item.value }}
            </a-select-option>
          </a-select>
          <!-- <a-input placeholder="请输入行政区划名称" v-model="form.arcname" /> -->
        </a-form-model-item>
        <template v-if="isShows">
          <a-form-model-item
            v-if="form.arcname"
            label="行政区划编码"
            ref="arcode"
            prop="arcode"
          >
            <a-input
              disabled
              placeholder="请输入行政区划编码"
              v-model="form.arcode"
            />
          </a-form-model-item>
        </template>
        <a-form-model-item label="指标编号" ref="kpiid" prop="kpiid">
          <a-select
            v-model="form.kpiid"
            placeholder="请选择指标编号"
            allow-clear
            @change="handleChanges"
          >
            <a-select-option v-for="item in kpiAllList" :key="item.itemcode">
              {{ item.itemcode }}
            </a-select-option>
          </a-select>
          <!-- <a-input placeholder="请输入指标编号" v-model="form.kpiid" /> -->
        </a-form-model-item>
        <template v-if="isShow">
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
        </template>
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
import { getManageDataAddLists, getAllLists } from "@/api/management";
import globalModal from "@/components/globalModal/globalModal";
import check from "@/utils/rules.js";
import moment from "moment";
export default {
  components: {
    globalModal
  },
  props: ["options"],
  data() {
    let minValue = (rule, value, callback) => {
      if (this.form.valMid) {
        if (value > parseInt(this.form.valMid)) {
          return callback(new Error("最小值必须小于中间值，请重新输入"));
        } else {
          callback();
        }
      }
      if (this.form.valMax) {
        if (value > parseInt(this.form.valMax)) {
          return callback(new Error("最小值必须小于最大值，请重新输入"));
        } else {
          callback();
        }
      }
    };
    let midValue = (rule, value, callback) => {
      if (this.form.valMax && this.form.valMin) {
        if (
          value > parseInt(this.form.valMax) ||
          value < parseInt(this.form.valMin)
        ) {
          return callback(
            new Error("中间值必须介于最小值和最大值之间，请重新输入")
          );
        } else {
          callback();
        }
      }
      if (this.form.valMin) {
        if (value < parseInt(this.form.valMin)) {
          return callback(new Error("中间值必须大于最小值，请重新输入"));
        } else {
          callback();
        }
      }
      if (this.form.valMax) {
        if (value > parseInt(this.form.valMax)) {
          return callback(new Error("中间值必须小于最大值，请重新输入"));
        } else {
          callback();
        }
      }
    };
    let maxValue = (rule, value, callback) => {
      if (this.form.valMin && this.form.valMid == "") {
        if (value < parseInt(this.form.valMid)) {
          return callback(new Error("最大值必须大于最小值，请重新输入"));
        } else {
          callback();
        }
      }
      if (this.form.valMid && this.form.valMin == "") {
        let midValue = this.form.valMid;
        if (value < parseInt(this.form.valMax)) {
          return callback(new Error("最大值必须大于中间值，请重新输入"));
        } else {
          callback();
        }
      }
      if (this.form.valMin && this.form.valMid) {
        if (value < parseInt(this.form.valMid)) {
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
      confirmLoading: false,
      rules: {
        year: [{ required: true, message: "请选择年份", trigger: "change" }],
        arcname: [
          { required: true, message: "请选择行政区划名称", trigger: "change" }
        ],
        kpiid: [
          { required: true, message: "请选择指标编号", trigger: "change" }
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
      },
      form: {
        year: null
      },
      open: false,
      year: null,
      kpiAllList: [],
      isShow: false,
      isShows: false
    };
  },
  mounted() {
    // console.log(this.options)
    this.getMeatData();
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
      this.form.year = value;
      this.open = false;
    },
    handleChange(value) {
      if (value) {
        this.isShows = true;
      }
      this.form.arcode = value;
      this.options.forEach(item => {
        if (value == item.name) {
          this.form.arcname = item.value;
        }
      });
    },
    handleChanges(value) {
      if (value) {
        this.isShow = true;
      }
      this.kpiAllList.forEach(item => {
        if (item.itemcode == value) {
          this.form.kpiname = item.itemname;
          this.form.unit = item.itemunit;
        }
      });
    },
    async meatData() {
      this.form.year = this.form.year.format("YYYY");
      let params = this.form;
      let res = await getManageDataAddLists(params);
      if (res.code == 200) {
        this.$notification.open({
          message: "新增成功",
          icon: <a-icon type="smile" style="color: #108ee9" />
        });
        this.$parent.meatData();
      } else {
        this.$notification.open({
          message: res.msg,
          icon: <a-icon type="close-circle" style="color: rgb(232,97,97)" />
        });
      }
    },
    async getMeatData() {
      let params = {};
      let res = await getAllLists(params);
      if (res.code == 200) {
        this.kpiAllList = res.data;
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
