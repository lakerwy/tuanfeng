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
        :scroll="{ y: 580 }"
        >>
        <template slot="splitfieldname" slot-scope="text">
          <span v-if="text === '1'">规划目标值</span>
          <span v-if="text === '2'">上传下达值</span>
        </template>
        <template slot="operation" slot-scope="text, record">
          <a @click="handleEdit(record)">
            <a-icon title="编辑" type="edit" style="font-size: 20px" />
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
import { getWarningLevelDataLists } from "@/api/management";
export default {
  components: {
    dialogOne
  },
  data() {
    return {
      // 编辑页面表单
      total: 0,
      isShow: false,
      dataList: [], //接口返回的数据
      data: [],
      columns: [
        {
          title: "序号",
          customRender: function(t, r, index) {
            return parseInt(index) + 1;
          },
          width: 80,
          align: "center"
        },
        {
          title: "行政区划代码",
          dataIndex: "arcode",
          scopedSlots: { customRender: "arcode" },
          align: "center"
        },
        {
          title: "行政区划名称",
          dataIndex: "arcname",
          scopedSlots: { customRender: "arcname" },
          align: "center"
        },
        {
          title: "指标编号",
          dataIndex: "kpiid",
          width: 120,
          scopedSlots: { customRender: "kpiid" },
          align: "center"
        },
        {
          title: "指标名称",
          dataIndex: "kpiname",
          width: 320,
          scopedSlots: { customRender: "kpiname" },
          align: "center"
        },
        {
          title: "预警等级数量",
          dataIndex: "splitnum",
          scopedSlots: { customRender: "splitnum" },
          align: "center"
        },
        {
          title: "预警等级",
          dataIndex: "splittext",
          scopedSlots: { customRender: "splittext" },
          align: "center"
        },
        {
          title: "分级参考名称",
          dataIndex: "splitfieldname",
          scopedSlots: { customRender: "splitfieldname" },
          align: "center"
        },
        {
          title: "操作",
          dataIndex: "operation",
          scopedSlots: { customRender: "operation" },
          width: 80,
          align: "center"
        }
      ],
      form: [],
      query: {},
      pagination: {
        showQuickJumper: true
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
      console.log(pagination);
      const pager = { ...this.pagination };
      pager.current = pagination.current;
      this.pagination = pager;
      this.query.page = this.pagination.current;
      this.meatData();
    },
    async meatData() {
      let params = this.query;
      let res = await getWarningLevelDataLists(params);
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
      }
      this.data = this.dataList;
    },
    handleEdit(row) {
      this.isShow = true;
      this.form = row;
      this.$nextTick(() => {
        this.$refs.dialogValue.visible = true;
      });
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
      this.$parent.nationOption = res;
      return res;
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
  // height: 100%;
  height: calc(100vh - 215px);
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
