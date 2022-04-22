<template>
  <div>
    <global-modal
      title="编辑预警等级"
      :visible="visible"
      v-if="visible"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
      width="60%"
    >
      <div class="dialog" slot="modalBody">
        <a-form-model
          ref="form"
          :model="form"
          :rules="rules"
          :label-col="{ span: 3 }"
          :wrapper-col="{ span: 17 }"
        >
          <a-form-model-item
            label="阈值计算依据："
            ref="splitfieldname"
            prop="splitfieldname"
          >
            <a-radio-group
              v-model="form.splitfieldname"
              @change="handleRadio(form.splitfieldname)"
            >
              <a-radio value="1">
                规划目标值
              </a-radio>
              <a-radio value="2">
                上级下达指标
              </a-radio>
            </a-radio-group>
          </a-form-model-item></a-form-model
        >
        <div class="btn">
          <a-button icon="plus" @click="handleAdd" style="margin-right:10px"
            >新增</a-button
          >
        </div>
        <div class="dialog-table">
          <a-table
            :columns="columns"
            :data-source="gridData"
            bordered
          >
            <template slot="isHealth" slot-scope="text">
              <span v-if="text === 1">是</span>
              <span v-if="text === 2">否</span>
            </template>
            <template slot="isDefault" slot-scope="text, record">
              <span v-if="text === 1">默认</span>
              <span v-if="text === 2">
                <a-popconfirm
                  v-if="gridData.length"
                  title="确认更改为默认预警等级吗?"
                  @confirm="() => handleDefault(record)"
                >
                  <a href="javascript:;">改为默认预警等级</a>
                </a-popconfirm>
              </span>
            </template>
            <template slot="valueMax" slot-scope="text">
              <span v-if="text === '' || text === null">0</span>
              <span v-else>{{ text }}</span>
            </template>
            <template slot="valueMin" slot-scope="text">
              <span v-if="text === '' || text === null">0</span>
              <span v-else>{{ text }}</span>
            </template>
            <template slot="color" slot-scope="text">
              <colorPicker disabled v-model="text">{{ text }}</colorPicker>
            </template>
            <template slot="operation" slot-scope="text, record">
              <a-popconfirm
                v-if="gridData.length"
                title="确认需要删除吗?"
                @confirm="() => handleDelete(record)"
              >
                <a href="javascript:;" style="color:#e86161">删除</a>
              </a-popconfirm>
            </template>
          </a-table>
        </div>
      </div>
    </global-modal>
    <div>
      <dialog-two ref="dialogAdd" :gridData="gridData"></dialog-two>
    </div>
  </div>
</template>

<script>
import globalModal from "@/components/globalModal/globalModal";
import dialogTwo from "./add";
import {
  getWarningDelDataLists,
  getWarningDelDataDelLists,
  getWarningDelDataDefaultLists,
  getWarningLevelDataInfoLists
} from "@/api/management";
export default {
  components: {
    globalModal,
    dialogTwo
  },
  props: ["form"],
  data() {
    return {
      color: "",
      visible: false,
      confirmLoading: false,
      rules: {
        splitfieldname: [
          {
            required: true,
            message: "请选择阈值计算依据",
            trigger: "change"
          }
        ]
      },
      id: "",
      columns: [
        {
          title: "序号",
          customRender: function(t, r, index) {
            return parseInt(index) + 1;
          },
          align: "center"
        },

        {
          title: "预警等级",
          dataIndex: "warnLevel",
          scopedSlots: { customRender: "warnLevel" },
          align: "center",
        },
        {
          title: "最小值",
          dataIndex: "valueMin",
          scopedSlots: { customRender: "valueMin" },
          align: "center"
        },
        {
          title: "最大值",
          dataIndex: "valueMax",
          scopedSlots: { customRender: "valueMax" },
          align: "center"
        },
        {
          title: "颜色标识",
          dataIndex: "color",
          scopedSlots: { customRender: "color" },
          align: "center"
        },
        {
          title: "是否健康标识",
          dataIndex: "isHealth",
          scopedSlots: { customRender: "isHealth" },
          align: "center"
        },
        {
          title: "是否为默认预警等级",
          dataIndex: "isDefault",
          scopedSlots: { customRender: "isDefault" },
          align: "center"
        },
        {
          title: "操作",
          dataIndex: "operation",
          scopedSlots: { customRender: "operation" },
          align: "center"
        }
      ],
      gridData: [], //展示所需的数据
      dataList: [], //接口返回的数据
      query: {
        warnId: "",
        type: ""
      }
    };
  },
  mounted() {
    this.meatData1();
  },
  updated() {
    // 设置斑马条纹
    this.renderStripe();
  },
  methods: {
    async meatData1() {
      let params = this.form.id;
      let res = await getWarningDelDataLists(params);
      this.$refs.dialogAdd.rowData = this.form;
      this.dataList = res.data;
      for (var j in this.dataList) {
        // 添加Key属性
        this.dataList[j].key = this.dataList[j].id;
      }
      this.gridData = this.dataList;
      // console.log(this.gridData)
      // }
    },
    onChangeCheckbox(e) {
      console.log(`checked = ${e.target.checked}`);
    },
    // 改变radio值
    handleRadio(e) {
      if (e) {
        this.query.type = e;
      } else {
        this.query.type = this.form.splitfieldname;
      }
      this.query.warnId = this.form.id;
      this.meatData2();
    },
    async meatData2() {
      let params = this.query;
      await getWarningLevelDataInfoLists(params);
    },
    handleOk() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.confirmLoading = true;
          this.handleRadio();
          this.$parent.meatData();
          setTimeout(() => {
            this.visible = false;
            this.confirmLoading = false;
            this.$parent.isShow = false;
          }, 1000);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 点击取消按钮
    handleCancel() {
      this.$refs.form.resetFields();
      this.visible = false;
      this.$parent.isShow = false;
      this.$parent.meatData();
    },
    // 点击 添加 按钮
    handleAdd() {
      this.$refs.form.validate(valid => {
        if (valid) {
          // console.log(this.form.value)
          this.$refs.dialogAdd.type = this.form.splitfieldname;
          this.$refs.dialogAdd.form = {color: "#000"};
          this.$refs.dialogAdd.visible = true;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 点击非默认预警等级
    handleDefault(row) {
      this.id = row.id;
      this.meatDataDefault();
    },
    // 非默认预警等级
    async meatDataDefault() {
      let params = this.id;
      let res = await getWarningDelDataDefaultLists(params);
      if (res.code === 200) {
        this.meatData1();
        this.$notification.open({
          message: "修改成功，已恢复默认预警等级",
          icon: <a-icon type="smile" style="color: #108ee9" />
        });
      }
    },

    // 删除数据
    async meatDataDel() {
      let params = this.id;
      let res = await getWarningDelDataDelLists(params);
      if (res.code === 200) {
        this.meatData1();
        this.$notification.open({
          message: "数据删除成功",
          icon: <a-icon type="smile" style="color: #108ee9" />
        });
      } else {
        this.$notification.open({
          message: "数据删除失败，" + res.msg,
          icon: <a-icon type="close-circle" style="color: rgb(232,97,97)" />
        });
      }
    },
    handleDelete(row) {
      this.id = row.id;
      this.meatDataDel();
    }
  }
};
</script>

<style lang="less" scoped>
@vw: 22.2vw;
@vh: 10.8vh;

.dialog {
  .levelText {
    i {
      background: url(../../../../assets/img/circle.png) no-repeat;
      background-size: 13 / @vw 13 / @vw;
      display: inline-block;
      width: 13 / @vw;
      height: 13 / @vw;
      margin-top: 20 / @vh;
      margin-right: 12 / @vw;
    }
  }
  .btn {
    margin-top: 20 / @vh;
    &-right {
      float: right;
    }
  }
  &-table {
    margin-top: 20 / @vh;
  }
  &-text {
    margin-top: 20 / @vh;
    color: #6f7583;
    font-size: 14px;
  }
}
</style>
