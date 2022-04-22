<template>
  <div class="table">
    <div class="table-title">
      <p>
        <i></i>当前数据:<span> {{ total }}条</span>
      </p>
    </div>
    <div class="table-main">
      <a-table
        :columns="columns"
        :data-source="data"
        bordered
        :pagination="pagination"
        @change="handleTableChange"
      >
        <template slot="updatetype" slot-scope="text">
          <span v-if="text === 0">手动更新</span>
          <span v-if="text === 1">定时监测</span>
        </template>
        <template slot="operation" slot-scope="text, record">
          <a @click="handleEdit(record)">
            <a-icon title="编辑" type="edit" style="font-size:20px" />
          </a>
          <a @click="handleUpd(record)">
            <a-icon
              title="更新"
              type="up-square"
              style="margin-left:10px;font-size:20px"
            />
          </a>
        </template>
      </a-table>
    </div>

    <div v-if="isShow">
      <dialog-one ref="dialogValue" :form="form"></dialog-one>
    </div>
  </div>
</template>

<script>
import dialogOne from "./modal";
import { getUpdateWayLists, getUpdCaluLists } from "@/api/management";
export default {
  components: {
    dialogOne
  },
  data() {
    return {
      form: "",
      // 编辑页面表单
      isShow: false,
      data: [],
      total: 0,
      dataList: [], //接口返回的数据
      columns: [
        {
          title: "序号",
          customRender: function(t, r, index) {
            return parseInt(index) + 1;
          },
          align: "center"
        },
        {
          title: "指标编码",
          dataIndex: "kpiid",
          scopedSlots: { customRender: "kpiid" },
          align: "center"
        },
        {
          title: "指标名称",
          dataIndex: "kpiname",
          scopedSlots: { customRender: "kpiname" },
          align: "center"
        },
        {
          title: "更新方式",
          dataIndex: "updatetype",
          scopedSlots: { customRender: "updatetype" },
          align: "center"
        },
        {
          title: "监测周期",
          dataIndex: "monitorNum",
          scopedSlots: { customRender: "monitorNum" },
          align: "center"
        },
        {
          title: "更新时间",
          dataIndex: "dataupdatetime",
          scopedSlots: { customRender: "dataupdatetime" },
          align: "center"
        },
        {
          title: "操作",
          dataIndex: "operation",
          scopedSlots: { customRender: "operation" },
          align: "center"
        }
      ],
      query: {
        id: ""
      },
      queryData: {},
      pagination: {
        showQuickJumper:true
      },
      arrList: [] //指标名称下拉选项的临时存储
    };
  },
  mounted() {
    this.meatData();
  },
  updated() {
    // 设置斑马条纹
    this.renderStripe();
  },
  methods: {
    // 分页按钮
    handleTableChange(pagination, filters, sorter) {
      const pager = { ...this.pagination };
      pager.current = pagination.current;
      this.pagination = pager;
      this.queryData.page = this.pagination.current;
      this.meatData();
    },
    // 获取表格数据
    async meatData() {
      let params = this.queryData;
      let res = await getUpdateWayLists(params);
      this.dataList = res.data.records;
      const pagination = { ...this.pagination };
      pagination.total = res.data.total;
      this.pagination = pagination;
      this.total = res.data.total;
      for (var i in this.dataList) {
        // 添加Key属性
        this.dataList[i].key = this.dataList[i].id;
        this.arrList.push({
          name: this.dataList[i].kpiname,
          value: this.dataList[i].kpiname
        });
        // this.getNewOption(this.arrList);
        if (this.dataList[i].monitorNum === 1) {
          this.dataList[i].monitorNum = "年";
        } else if (this.dataList[i].monitorNum === 2) {
          this.dataList[i].monitorNum = "月";
        } else if (this.dataList[i].monitorNum === 3) {
          this.dataList[i].monitorNum = "实时";
        } else {
          this.dataList[i].monitorNum = "";
        }
        // if (this.dataList[i].updatetype === 0) {
        //   this.dataList[i].dataupdatetime = "";
        // } else {
          if (this.dataList[i].dataupdatetime === null) {
            this.dataList[i].dataupdatetime = "";
          } else {
            this.dataList[i].dataupdatetime = this.dataList[
              i
            ].dataupdatetime.substr(
              0,
              this.dataList[i].dataupdatetime.indexOf("T")
            );
          // }
        }
      }
      this.data = this.dataList;
    },
    // 数组对象去重
    getNewOption(arr) {
      let res = [];
      let repeat = [];
      for (let i = 0; i < arr.length; i++) {
        let name = arr[i].name;
        if (!repeat[name]) {
          res.push(arr[i]);
          repeat[name] = 1;
        }
      }
      this.$parent.nationOptions = res;
      return res;
    },
    // 点击更新按钮接口数据获取
    async getUpdData() {
      let params = this.query;
      let res = await getUpdCaluLists(params);
      if (res.code == 200) {
        this.$notification.open({
          message: res.data,
          icon: <a-icon type="smile" style="color: #108ee9" />
        });
      }
    },
    // 点击编辑按钮
    handleEdit(row) {
      console.log(row)
      this.form = row;
      this.isShow = true;
      this.$nextTick(() => {
        this.$refs.dialogValue.visible = true;
      });
    },
    // 点击更新按钮
    handleUpd(row) {
      if (row.updatetype === 1) {
        this.$notification.open({
          message: "该方式不允许更新",
          icon: <a-icon type="close-circle" style="color: rgb(232,97,97)" />
        });
      } else {
        this.query.id = row.id;
        this.getUpdData();
      }
    }
  }
};
</script>

<style lang="less" scoped>
@vw: 22.2vw;
@vh: 10.8vh;

.table {
  // width: 1834 / @vw;
  margin-left: 24px;
  height: calc(100vh - 208px);
  overflow-y: auto;
  &-title {
    height: 54 / @vh;
    width: 100%;
    line-height: 54 / @vh;
    p {
      margin: 0;
      float: left;
      color: #454954;
      font-size: 16 / @vh;
      span {
        color: #1890ff;
      }
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
  }
  &-pageBox {
    float: right;
    height: 50 / @vh;
    margin-top: 20 / @vh;
  }
}
</style>
