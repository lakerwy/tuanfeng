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
        <a-form-model-item label="基期值" ref="basevalue" prop="basevalue">
          <a-input
            placeholder="请输入基期值"
            v-model.number="form.basevalue"
          ></a-input>
        </a-form-model-item>
        <a-form-model-item
          label="近期目标值-本值"
          ref="recentlocalvalue"
          prop="recentlocalvalue"
        >
          <a-input
            placeholder="请输入近期目标值-本值"
            v-model.number="form.recentlocalvalue"
          ></a-input>
        </a-form-model-item>
        <a-form-model-item
          label="近期目标值-上级下达"
          ref="recentupvalue"
          prop="recentupvalue"
        >
          <a-input
            placeholder="请输入近期目标值-上级下达"
            v-model.number="form.recentupvalue"
          ></a-input>
        </a-form-model-item>
        <a-form-model-item
          label="规划目标值-本值"
          ref="planlocalvalue"
          prop="planlocalvalue"
        >
          <a-input
            placeholder="请输入规划目标值-本值"
            v-model.number="form.planlocalvalue"
          ></a-input>
        </a-form-model-item>
        <a-form-model-item
          label="规划目标值-上级下达"
          ref="planupvalue"
          prop="planupvalue"
        >
          <a-input
            placeholder="请输入规划目标值-上级下达"
            v-model.number="form.planupvalue"
          ></a-input>
        </a-form-model-item>
      </a-form-model>
    </global-modal>
  </div>
</template>

<script>
import { getTargetManageDataAddLists, getAllLists } from "@/api/management";
import globalModal from "@/components/globalModal/globalModal";
import check from "@/utils/rules.js";
import moment from "moment";
export default {
  components: {
    globalModal
  },
  props: ["options"],
  data() {
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
        basevalue: [
          { required: true, message: "请输入基期值", trigger: "blur" },
          {
            message: "只能输入数字",
            pattern: /^[0-9]+$/
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
            pattern: /^[0-9]+$/
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
            pattern: /^[0-9]+$/
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
            pattern: /^[0-9]+$/
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
            pattern: /^[0-9]+$/
          }
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
      let res = await getTargetManageDataAddLists(params);
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

<style>
.ant-select-dropdown-menu {
  max-height: 260px !important;
}
</style>
