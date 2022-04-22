<template>
  <div>
    <global-modal
      title="编辑更新方式"
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
        <a-form-model-item label="更新方式" prop="updatetype">
          <a-radio-group v-model="value" @change="onChange">
            <a-radio
              v-for="item in radioData"
              :key="item.key"
              :value="item.key"
            >
              {{ item.value }}
            </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <template v-if="value === 0">
          <a-form-model-item label="日期：" prop="year" ref="year">
            <a-date-picker
              placeholder="请选择日期"
              v-model="form.year"
              @change="onChangeDate"
            />
          </a-form-model-item>
        </template>
        <template v-if="value === 1">
          <a-form-model-item
            label="监测周期"
            ref="monitorNum"
            prop="monitorNum"
          >
            <a-select
              placeholder="请选择监测周期"
              v-model="form.monitorNum"
              @change="handleChange"
            >
              <a-select-option
                v-for="item in list"
                :key="item.key"
                v-model="item.key"
              >
                {{ item.value }}
              </a-select-option></a-select
            >
          </a-form-model-item>
          <a-form-model-item
            v-show="form.monitorNum != 3 && form.monitorNum != '实时'"
            label="定期监测时间"
            prop="level"
            class="time"
          >
            <!-- <a-date-picker
              placeholder="请选择日期"
              @change="onChangeDate"
            />  -->
            <template v-if="form.monitorNum == '年' || form.monitorNum == 1">
              <a-date-picker
                format="YYYY"
                mode="year"
                :value="form.dataupdatetime"
                :open="open"
                @openChange="openChange"
                @panelChange="panelChange"
                placeholder="请选择年份"
              />
            </template>
            <template v-if="form.monitorNum == 2 || form.monitorNum == '月'">
              <a-month-picker placeholder="请选择月份" @change="onChangeMonth" />
            </template>
          </a-form-model-item>
        </template>
      </a-form-model>
    </global-modal>
  </div>
</template>

<script>
import moment from "moment";
import globalModal from "@/components/globalModal/globalModal";
import { getUpdateWayUpdLists } from "@/api/management";
export default {
  components: {
    globalModal
  },
  props: ["form"],
  data() {
    return {
      //年度计划的打开关闭状态，true为打开，false为关闭
      yearShowOne: false,
      open: false,
      year: null,
      value: "",
      yearValue: "",
      // yearShowOne: false,
      radioData: [
        {
          key: 0,
          value: "手动更新"
        },
        {
          key: 1,
          value: "定时监测"
        }
      ],
      list: [
        {
          key: 1,
          value: "年"
        },
        {
          key: 2,
          value: "月"
        },
        {
          key: 3,
          value: "实时"
        }
      ],
      rules: {
        monitorNum: [
          {
            required: true,
            message: "请选择监测周期",
            trigger: "change"
          }
        ],
        year: [
          { required: true, message: "开始年限不能为空", trigger: "change" }
        ]
      },
      visible: false,
      confirmLoading: false,
      yearData: JSON.parse(sessionStorage.getItem("latitudeData")),
      yearList: [],
      ListYear: []
    };
  },
  mounted() {
    this.value = this.form.updatetype;
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
      console.log(value);
      // value=value+"-01-01"
      this.form.dataupdatetime = value;
      this.open = false;
    },

    // 编辑更新数据
    async meatData1() {
      if (this.form.monitorNum === "年") {
        this.form.monitorNum = 1;
      } else if (this.form.monitorNum === "月") {
        this.form.monitorNum = 2;
      } else if (this.form.monitorNum === "实时") {
        this.form.monitorNum = 3;
      }
      // console.log(this.form.updatetype)
      if (this.form.updatetype == 0) {
        this.form.monitorNum = 1;
      }
      let params = this.form;
      let res = await getUpdateWayUpdLists(params);
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
    // 改变radio组件的值
    onChange(e) {
      this.form.updatetype = e.target.value;
      // debugger
    },
    // 请选择监测周期
    handleChange(value) {
      this.form.monitorNum = value;
    },
    // 改变月份
    onChangeMonth(date, dateString){
      // console.log(date,dateString);
      dateString=dateString+'-01'
      this.form.dataupdatetime = dateString;
    },
    // 改变日期
    onChangeDate(date, dateString) {
       console.log(dateString);
      this.form.dataupdatetime = dateString;
      console.log(this.form.dataupdatetime);
    },
    handleOk() {
      console.log(this.form.year);
      this.$refs.form.validate(valid => {
        if (valid) {
          
          this.confirmLoading = true;
          if (this.form.updatetype === 0) {
            this.form.monitorNum = 0;
            // this.form.dataupdatetime = new Date();
          }
          this.meatData1();
          setTimeout(() => {
            this.visible = false;
            this.confirmLoading = false;
            this.$parent.isShow = false;
          }, 1000);
          console.log(this.form.dataupdatetime);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleCancel() {
      // this.$refs.form.resetFields();
      this.visible = false;
      this.$parent.isShow = false;
      this.$parent.meatData();
    }
  }
};
</script>

<style lang="less" scoped>
@vw: 22.2vw;
@vh: 10.8vh;

.time /deep/ .ant-calendar-picker {
  margin-left: 10px;
  width: 120px;
}
.time /deep/ .ant-time-picker {
  margin-left: 10px;
}

.dialog {
  &-radio {
    margin-top: 20 / @vh;
  }
  &-time {
    margin-top: 20 / @vh;
  }
}
</style>
