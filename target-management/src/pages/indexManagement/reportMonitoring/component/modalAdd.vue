<template>
  <div>
    <global-modal
      title="新增"
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
        <a-form-model-item
          label="上报科室名称"
          ref="upDepName"
          prop="upDepName"
        >
          <a-tree-select
            v-model="form.upDepName"
            show-search
            style="width: 100%"
            placeholder="请选择上报科室名称"
            :tree-data="treeData"
            @select="onSelect"
            allow-clear
          ></a-tree-select>
        </a-form-model-item>
        <a-form-model-item label="监控周期" ref="mcycle" prop="mcycle">
          <a-date-picker v-model="form.mcycle" @change="onChange" />
        </a-form-model-item>
        <a-form-model-item label="监控值" ref="mvalue" prop="mvalue">
          <a-input placeholder="请输入监控值" v-model="form.mvalue" />
        </a-form-model-item>
        <a-form-model-item label="备注" ref="failtext" prop="failtext">
          <a-input
            type="textarea"
            placeholder="请输入备注"
            v-model="form.failtext"
          />
        </a-form-model-item>
      </a-form-model>
    </global-modal>
  </div>
</template>

<script>
import { getMonitoringDataAddLists, getAllLists } from "@/api/management";
import globalModal from "@/components/globalModal/globalModal";
export default {
  components: {
    globalModal
  },
  props: ["options", "treeData"],
  data() {
    return {
      treeExpandedKeys: [],
      value: undefined,
      visible: false,
      confirmLoading: false,
      rules: {
        arcname: [
          { required: true, message: "请选择行政区划名称", trigger: "change" }
        ],
        kpiid: [
          { required: true, message: "请选择指标编号", trigger: "change" }
        ],
        mcycle: [
          { required: true, message: "请选择监控周期", trigger: "change" }
        ],
        status: [
          { required: true, message: "请选择监控状态", trigger: "change" }
        ],
        upDepName: [
          { required: true, message: "请选择上报科室名称", trigger: "change" }
        ],
        mvalue: [
          { required: true, message: "请输入监控值", trigger: "blur" },
          {
            message: "只能输入数字",
            pattern: /^[0-9]+$/
          }
        ]
      },
      form: {
        mcycle: null
      },
      nationOption: [
        {
          value: "未计算",
          name: 0
        },
        {
          value: "已完成计算",
          name: 1
        },
        {
          value: "计算失败",
          name: 2
        },
        {
          value: "正在执行计算",
          name: 3
        }
      ],

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
    onSelect(value, node, extra) {
      // console.log(value, node, extra);
      this.form.upDepId = node.dataRef.id;
    },
    onChange(date, dateString) {
      // console.log(date, dateString);
      this.form.mcycle = dateString;
    },
    handleChangeState(value) {
      // console.log(value)
      this.form.status = value;
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
      this.form.isup = 1;
      this.form.status = 1;
      this.form.upPerson = sessionStorage.getItem("uCenterName");
      let params = this.form;
      let res = await getMonitoringDataAddLists(params);
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
      this.isShow = false;
      this.$refs.ruleForm.resetFields();
    }
  }
};
</script>
