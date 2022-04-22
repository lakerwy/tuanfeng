<template>
  <div>
    <global-modal
      title="更新关联体系树"
      :visible="visible"
      v-if="visible"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
      width="40%"
    >
      <a-form-model
        ref="form"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 25 }"
        slot="modalBody"
      >
        <a-form-model-item label="选择体系树">
          <a-radio-group v-model="value" @change="onChange">
            <a-radio :value="1">
              基础指标体系
            </a-radio>
            <a-radio :value="2">
              监测指标体系
            </a-radio>
            <a-radio :value="3">
              预警指标体系
            </a-radio>
            <a-radio :value="4">
              评估指标体系
            </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="当前关联指标：">
          {{ value1 }}
        </a-form-model-item>
        <a-form-model-item>
          <item-tree
            style="margin-left:100px"
            @changeChooseList="onChooseList"
            :type="type"
            ref="tree"
          ></item-tree>
        </a-form-model-item>
      </a-form-model>
    </global-modal>
  </div>
</template>

<script>
import globalModal from "@/components/globalModal/globalModal";
import { getTaskTreeLists, getUpdTreeLists } from "@/api/management";
import itemTree from "@/components/itemTree/indexUpd";
export default {
  inject:['reload'],
  props: ["rows"],
  components: {
    globalModal,
    itemTree
  },
  data() {
    return {
      value: 1,
      value1: "",
      visible: false,
      confirmLoading: false,
      type: 1,
      chooseListData: this.rows.useType,
      chooseList: {
        code: "",
        itemId: "",
        treeId: "",
        type: "",
        usetype: ""
      }
    };
  },
  mounted() {
    if (this.rows.useType != null) {
      this.value1 = this.rows.useType[0];
    }else{
      this.value1="无"
    }
  },

  methods: {
    onChange(e) {
      this.type = e.target.value;
      this.value1 = this.rows.useType[this.type - 1];
      if (this.value1 == 0||this.value1 == 1||this.value1 == 2||this.value1 == 3||this.value1 == 4||this.value1==undefined) {
        this.value1 = "无";
      }
      this.$refs.tree.query.id = -1;
      this.$refs.tree.expandedKeys = ["0"];
    },
    // 接收子组件传值
    onChooseList(val) {
      // console.log(val.list);
      if (this.type == 1) {
        if (val.list[0] == 0) {
          val.list[0] = "基础指标";
        } else if (val.list[0] == "无") {
          val.list[0] = 0;
          this.value1 = "无";
        }
      } else if (this.type == 2) {
        if (val.list[0] == 0) {
          val.list[0] = "监测指标体系";
        } else if (val.list[0] == "无") {
          val.list[0] = 0;
          this.value1 = "无";
        }
      } else if (this.type == 3) {
        if (val.list[0] == 0) {
          val.list[0] = "预警指标体系";
        } else if (val.list[0] == "无") {
          val.list[0] = 0;
          this.value1 = "无";
        }
      } else if (this.type == 4) {
        if (val.list[0] == 0) {
          val.list[0] = "评估指标体系";
        } else if (val.list[0] == "无") {
          val.list[0] = 0;
          this.value1 = "无";
        }
      }
      if (val.list[0] != 0) {
        let arr = this.unique(val.list);
        var index = arr.indexOf(0);
        if (index > -1) {
          arr.splice(index, 1);
        }
        this.value1 = arr.join(">");
        if (this.chooseListData) {
          this.chooseListData[this.type - 1] = this.value1;
        } else {
          this.chooseListData = [0, 0, 0, 0];
          this.chooseListData[this.type - 1] = this.value1;
        }
      } else {
        this.value1 = "无";
        if (this.chooseListData) {
          this.chooseListData[this.type - 1] = 0;
        } else {
          this.chooseListData = [0, 0, 0, 0];
          this.chooseListData[this.type - 1] = 0;
        }
      }
      this.chooseList.usetype = this.chooseListData.toString();
      this.chooseList.code = val.code;
      this.chooseList.treeId = val.treeId;
    },
    // 数组去重
    unique(arr) {
      return Array.from(new Set(arr));
    },

    async getUpdTree() {
      let params = this.chooseList;
      let res = await getUpdTreeLists(params);
      // console.log(res);
      if (res.code == 200) {
        this.reload();
        this.$notification.open({
          message: "关联成功",
          icon: <a-icon type="smile" style="color: #108ee9" />
        });
        this.$nextTick(() => {
          this.$parent.meatData();
        });
      } else {
        this.$notification.open({
          message: "关联失败!",
          icon: <a-icon type="close-circle" style="color: rgb(232,97,97)" />
        });
      }
    },

    handleOk() {
      this.confirmLoading = true;
      this.chooseList.itemId = this.rows.itemcode;
      this.chooseList.type = this.type;
      this.getUpdTree();
      setTimeout(() => {
        this.visible = false;
        this.confirmLoading = false;
      }, 1000);
    },
    handleCancel() {
      // this.reload();
      this.$refs.form.resetFields();
      this.visible = false;
      this.$parent.isShowUpd=false
      this.$parent.search=""
      this.$parent.query=sessionStorage.getItem("aKey")
      this.$parent.meatData();
      // 
    }
  }
};
</script>
