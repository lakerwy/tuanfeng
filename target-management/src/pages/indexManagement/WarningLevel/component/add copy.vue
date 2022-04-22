<template>
  <div>
    <global-modal
      title="新增数据"
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
        <a-form-model-item label="预警等级" ref="warnLevel" prop="warnLevel">
          <a-input
            placeholder="请输入预警等级"
            v-model="form.warnLevel"
            @blur="
              () => {
                $refs.warnLevel.onFieldBlur();
              }
            "
          />
        </a-form-model-item>
        <a-form-model-item label="最小值" ref="valueMin" prop="valueMin">
          <a-input
            placeholder="请输入最小值"
            v-model="form.valueMin"
            @blur="
              () => {
                $refs.valueMin.onFieldBlur();
              }
            "
          />
        </a-form-model-item>
        <a-form-model-item label="最大值" ref="valueMax" prop="valueMax">
          <a-input
            placeholder="请输入最大值"
            v-model="form.valueMax"
            @blur="
              () => {
                $refs.valueMax.onFieldBlur();
              }
            "
          />
        </a-form-model-item>
        <a-form-model-item label="颜色标识" ref="color" prop="color">
          <colorPicker v-model="form.color" @change="headleChangeColor(form.color)" />
          <!-- <a-input placeholder="请输入颜色标识" v-model="form.color" /> -->
        </a-form-model-item>
        <a-form-model-item label="是否健康标识" ref="isHealth" prop="isHealth">
          <a-select placeholder="请选择是否健康标识" v-model="form.isHealth">
            <a-select-option
              v-for="item in list"
              :key="item.value"
              v-model="item.value"
            >
              {{ item.name }}
            </a-select-option></a-select
          >
        </a-form-model-item>
      </a-form-model>
    </global-modal>
  </div>
</template>

<script>
import globalModal from "@/components/globalModal/globalModal";
import { getWarningDelDataUpdLists } from "@/api/management";
export default {
  components: {
    globalModal
  },
  props: ["gridData"],
  data() {
    let level=(rule,value,callback)=>{
      this.gridData.forEach(item=>{
        if(value==item.warnLevel){
          return callback(new Error("预警等级重复，请重新输入"));
        }else{
          callback()
        }
      })
    }
    let minValue = (rule, value, callback) => {
      // console.log(this.form.valueMax)
      console.log(value)
      if(this.form.valueMax){
        let maxValue=this.form.valueMax
        if (value > maxValue) {
          return callback(new Error("最小值必须小于最大值，请重新输入"));
        }else{
          callback()
        }
      }
    };
    let maxValue = (rule, value, callback) => {
      // console.log(this.form.valueMin)
      console.log(value)
      if(this.form.valueMin){
        let minValue=this.form.valueMin
        if (value < minValue) {
          return callback(new Error("最大值必须大于最小值，请重新输入"));
        }else{
          callback()
        }
      }
    };
    return {
      rowData: {},
      type: "",
      color: "#000",
      form: {
        color: "#000",
      },
      list: [
        {
          name: "是",
          value: 1
        },
        {
          name: "否",
          value: 2
        }
      ],
      rules: {
        warnLevel: [
          { required: true, message: "请输入预警等级", trigger: "blur" },
          { validator: level }
        ],
        valueMin: [
          {
            required: true,
            message: "请输入最小值",
            trigger: "blur"
          },
          {
            whitespace: true,
            message: "不能输入空格"
          },
          {
            message: "只能输入数字",
            pattern: /^[0-9]+$/
          },
          { validator: minValue }
        ],
        valueMax: [
          { required: true, message: "请输入最大值", trigger: "blur" },
          {
            whitespace: true,
            message: "不能输入空格"
          },
          {
            message: "只能输入数字",
            pattern: /^[0-9]+$/
          },
          { validator: maxValue }
        ],
        color: [
          {
            required: true,
            message: "请选择预警颜色",
            trigger: "change"
          }
        ],
        isHealth: [
          {
            required: true,
            message: "请选择是否健康",
            trigger: "change"
          }
        ]
      },
      visible: false,
      confirmLoading: false
    };
  },
  mounted() {},
  methods: {
    headleChangeColor(val) {
      // console.log(val);
      this.color = val;
    },
    async meatData() {
      // this.form.warnLevel=this.gridData.length+1
      this.form.warnId = this.rowData.id;
      this.form.type = this.type;
      this.form.color = this.color;
      let params = this.form;
      let res = await getWarningDelDataUpdLists(params);
      if (res.code == 200) {
        this.$parent.form.value = this.type;
        this.$nextTick(() => {
          this.$parent.meatData1();
        });
        this.$notification.open({
          message: "新增数据成功",
          icon: <a-icon type="smile" style="color: #108ee9" />
        });
      } else {
        this.$notification.open({
          message: "新增数据失败，" + res.msg,
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
