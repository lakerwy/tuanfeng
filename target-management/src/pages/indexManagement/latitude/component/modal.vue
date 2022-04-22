<template>
  <div>
    <global-modal
      title="指标维度管理"
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
        <a-form-model-item label="维度名称" ref="name" prop="name">
          <a-input placeholder="请输入维度名称" v-model="form.name" disabled />
        </a-form-model-item>
        <a-form-model-item label="维度说明" ref="info" prop="info">
          <a-input placeholder="请输入维度说明" v-model="form.info" />
        </a-form-model-item>
        <a-form-model-item label="维度值域" prop="names">
          <a-select
            v-model="form.names"
            mode="multiple"
            style="width: 100%"
            placeholder="请选择维度值"
            @change="handleChange"
          >
            <a-select-option v-for="item in nameList" :key="item.name">
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-form-model>
    </global-modal>
  </div>
</template>

<script>
import globalModal from "@/components/globalModal/globalModal";
import { getLatitudeDataUpdLists } from "@/api/management";
export default {
  props: ["form", "nameList"],
  components: {
    globalModal,
  },
  data() {
    return {
      valuess: "",
      visible: false,
      confirmLoading: false,
      query: {
        dimension: {},
        list: [],
      },
      rules: {
        info: [
          { required: true, message: "请输入 说明", trigger: "blur" },
          {
            whitespace: true,
            message: "不能输入空格",
          },
        ],
        names: [
          { required: true, message: "请选择指标值域", trigger: "change" },
        ],
      },
      arr: [],
      arrName: [],
      queryData: {},
      namesData: "",
    };
  },
  mounted() {
    if (typeof this.form.names == "string") {
      this.form.names = this.form.names.split(",");
    } else {
      console.log(this.form.names);
    }
  },
  methods: {
    handleChange(value) {
      // this.query.list = value;
      console.log(value);
      if (value.length > 0) {
        for (var i in value) {
          for (var j in this.nameList) {
            if (value[i] === this.nameList[j].name) {
              this.arr.push(this.nameList[j].value);
              this.arrName.push(this.nameList[j].id);
            }
          }
        }
      }
      this.query.list = this.unique(this.arrName);
      this.form.valuess = this.unique(this.arr).toString();
      // this.getQuery();
    },
    // 数组去重
    unique(arr) {
      return Array.from(new Set(arr));
    },
    getQuery() {
      this.namesData = this.unique(this.arrName).toString();
    },
    async meatData() {
      // if (this.namesData !== "") {
      //   this.form.names = this.namesData;
      // }
      this.form.names = this.form.names.toString();
      if (typeof this.form.names == "string") {
        let nameData = this.form.names.split(",");
        for (var i in nameData) {
          for (var j in this.nameList) {
            if (nameData[i] === this.nameList[j].name) {
              this.arr.push(this.nameList[j].id);
            }
          }
        }
        this.query.list = this.unique(this.arr);
      }

      this.query.dimension = this.form;
      let params = this.query;
      let res = await getLatitudeDataUpdLists(params);
      if (res.code == 200) {
        this.$parent.meatData();
        this.$parent.nameList = [];
        this.$notification.open({
          message: "编辑成功",
          icon: <a-icon type="smile" style="color: #108ee9" />,
        });
      } else {
        this.$refs.form.resetFields();
        this.$notification.open({
          message: "编辑失败，" + res.msg,
          icon: <a-icon type="close-circle" style="color: rgb(232,97,97)" />,
        });
      }
    },
    handleOk() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$parent.isShow = false;
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
      this.$parent.isShow = false;
      this.$parent.nameList = [];
      this.$refs.form.resetFields();
      this.visible = false;
      this.confirmLoading = false;
    },
  },
};
</script>
