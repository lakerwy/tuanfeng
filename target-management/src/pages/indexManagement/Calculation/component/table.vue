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
        >>
        <template slot="operation" slot-scope="text, record">
          <div class="tableButtonBoxs">
            <div
              class="editIcon"
              @click="handleEdit(record)"
              title="编辑"
            ></div>
          </div>
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
import { getCalculatLists } from "@/api/management";
export default {
  components: {
    dialogOne
  },
  data() {
    return {
      isShow: false,
      form: "",
      // 编辑页面表单
      data: [],
      dataList: [], //接口返回的数据
      columns: [
        {
          title: "序号",
          customRender: function(t, r, index) {
            return parseInt(index) + 1;
          },
          align: "center"
        },
        // {
        //   title: "行政区代码",
        //   dataIndex: "arcode",
        //   scopedSlots: { customRender: "arcode" },
        //   align: "center"
        // },
        // {
        //   title: "行政区名称",
        //   dataIndex: "arcname",
        //   scopedSlots: { customRender: "arcname" },
        //   align: "center"
        // },

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
          title: "计算方法名称",
          dataIndex: "calname",
          scopedSlots: { customRender: "calname" },
          align: "center"
        },
        {
          title: "计算访问类型",
          dataIndex: "caltype",
          scopedSlots: { customRender: "caltype" },
          align: "center"
        },
        {
          title: "操作",
          dataIndex: "operation",
          scopedSlots: { customRender: "operation" },
          align: "center"
        }
      ],
      query: {},
      total: 0,
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
    this.renderStripe();
  },
  methods: {
    // 分页按钮
    handleTableChange(pagination, filters, sorter) {
      const pager = { ...this.pagination };
      pager.current = pagination.current;
      this.pagination = pager;
      this.query.page = this.pagination.current;
      this.meatData();
    },
    async meatData() {
      let params = this.query;
      let res = await getCalculatLists(params);
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
        this.getNewOption(this.arrList);
        if (this.dataList[i].caltype === 0) {
          this.dataList[i].caltype = "SQL";
        } else if (this.dataList[i].caltype === 1) {
          this.dataList[i].caltype = "URL接口";
        } else if (this.dataList[i].caltype === 2) {
          this.dataList[i].caltype = "接口url自定义";
        } else {
          this.dataList[i].caltype = "";
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
    handleEdit(row) {
      // console.log(row);
      this.isShow = true;
      this.form = row;
      this.$nextTick(() => {
        this.$refs.dialogValue.visible = true;
        // if (this.form.caltype === "SQL") {
        //   this.$refs.dialogValue.getParamsValue();
        // }
        if (this.form.calinterPort === "mxjs") {
          this.$refs.dialogValue.isActive = false;
          this.$refs.dialogValue.selectedRowKeys = this.form.resourceId;
        }
        // let a= this.form.resourceId.split("")

        // if (this.form.calinterPort === "mxjs") {
        //   this.$refs.dialogValue.getUrlmxjsTable();
        // }
      });
    },
    handleClick(row) {
      console.log(row);
    }
  }
};
</script>
<style lang="less" scoped>
@vw: 22.2vw;
@vh: 10.8vh;

.ant-table-row a {
  margin-right: 18px;
}

.table {
  // width: 1834 / @vw;
  margin-left: 24 / @vw;
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
}
</style>
