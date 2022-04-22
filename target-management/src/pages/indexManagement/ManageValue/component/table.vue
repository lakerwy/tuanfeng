<template>
  <div class="table">
    <div class="table-title">
      <p>
        <i></i>当前数据:<span> {{ total }}条</span>
      </p>
      <div class="table-btn">
        <a-button
          @click="handleClickAdd"
          type="primary"
          icon="plus"
          style="margin-right: 10px"
          >新增</a-button
        >
        <a-button
          @click="handleClickAddS"
          type="primary"
          icon="plus"
          style="margin-right: 10px"
          >批量新增</a-button
        >
        <a-popconfirm
          :visible="visibleDel"
          @visibleChange="handleVisibleChange"
          title="确认需要删除吗?"
          @confirm="() => handleClickDels()"
        >
          <a-button
            :disabled="!hasSelected"
            :loading="loading"
            type="danger"
            icon="delete"
            style="margin-right: 10px"
            >批量删除</a-button
          >
        </a-popconfirm>
        <!-- <a-button
          @click="handleClickDels"
          :disabled="!hasSelected"
          :loading="loading"
          type="danger"
          icon="delete"
          style="margin-right: 10px"
          >批量删除</a-button
        > -->
      </div>
    </div>
    <div class="table-main">
      <a-table
        :row-selection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange
        }"
        :columns="columns"
        :data-source="data"
        bordered
        :pagination="pagination"
        @change="handleTableChange"
      >
        <template slot="operation" slot-scope="text, record">
          <a @click="handleEdit(record)">
            <a-icon title="编辑" type="edit" style="font-size: 20px" />
          </a>
          <a-popconfirm
            v-if="data.length"
            title="确认需要删除吗?"
            @confirm="() => handleClickDel(record)"
          >
            <a href="javascript:;"
              ><a-icon title="删除" type="delete" style="font-size: 20px"
            /></a>
          </a-popconfirm>
        </template>
      </a-table>
    </div>

    <!-- 新增 -->
    <div>
      <dialog-add :options="options" ref="add"></dialog-add>
    </div>

    <!-- 批量新增 -->
    <div>
      <dialog-addS ref="adds"></dialog-addS>
    </div>
    <!-- 编辑 -->
    <div>
      <dialog-one ref="dialogValue" :form="form"></dialog-one>
    </div>
  </div>
</template>

<script>
import dialogOne from "./modal";
import dialogAdd from "./modalAdd";
import {
  getManageDataLists,
  getManageDataDelsLists,
  getManageDataDelLists
} from "@/api/management";
import dialogAddS from "@/components/select/yearSelect1.vue";
import moment from "moment";

export default {
  components: {
    dialogOne,
    dialogAddS,
    dialogAdd
  },
  props: ["options"],
  data() {
    return {
      loading: false,
      visibleDel: false,
      form: "",
      // 编辑页面表单
      total: 0,
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
          title: "年份",
          dataIndex: "year",
          width: 100,
          scopedSlots: { customRender: "year" },
          align: "center"
        },
        {
          title: "行政区划编码",
          dataIndex: "arcode",
          scopedSlots: { customRender: "arcode" },
          width: 120,
          align: "center"
        },
        {
          title: "行政区划名称",
          dataIndex: "arcname",
          scopedSlots: { customRender: "arcname" },
          width: 120,
          align: "center"
        },
        {
          title: "指标编号",
          dataIndex: "kpiid",
          scopedSlots: { customRender: "kpiid" },
          width: 120,
          align: "center"
        },
        {
          title: "指标名称",
          dataIndex: "kpiname",
          scopedSlots: { customRender: "kpiname" },
          align: "center"
        },
        {
          title: "单位",
          dataIndex: "unit",
          width: 100,
          scopedSlots: { customRender: "unit" },
          align: "center"
        },
        {
          title: "最小值",
          dataIndex: "valMin",
          width: 100,
          scopedSlots: { customRender: "valMin" },
          align: "center"
        },
        {
          title: "中间值",
          dataIndex: "valMid",
          width: 100,
          scopedSlots: { customRender: "valMid" },
          align: "center"
        },
        {
          title: "最大值",
          dataIndex: "valMax",
          width: 100,
          scopedSlots: { customRender: "valMax" },
          align: "center"
        },
        {
          title: "操作",
          dataIndex: "operation",
          fixed: "right",
          width: 120,
          scopedSlots: { customRender: "operation" },
          align: "center"
        }
      ],
      id: "",
      selectedRowKeys: [],
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
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0;
    }
  },
  methods: {
    moment,
    onSelectChange(selectedRowKeys) {
      // console.log(selectedRowKeys);
      this.selectedRowKeys = selectedRowKeys;
    },
    // 新增
    handleClickAdd() {
      this.$refs.add.visible = true;
      this.$refs.add.form = {};
    },
    // 批量新增
    handleClickAddS() {
      this.$refs.adds.visible = true;
    },
    handleVisibleChange(visibleDel) {
      if (!visibleDel) {
        this.visibleDel = false;
        return;
      }
      if (this.selectedRowKeys.length > 0) {
        this.visibleDel = true;
      }
    },
    // 批量删除
    handleClickDels() {
      // console.log("shanchu")
      this.loading = true;
      this.meatDataDels();
      setTimeout(() => {
        this.loading = false;
        this.selectedRowKeys = [];
      }, 1000);
    },
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
      let res = await getManageDataLists(params);
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
    },
    handleEdit(row) {
      if (row.year) {
        let year = moment(row.year, "YYYY");
        row.years = year;
      }
      this.form = row;
      this.$refs.dialogValue.visible = true;
    },
    // 删除数据
    async meatDataDel() {
      let params = this.id;
      let res = await getManageDataDelLists(params);
      if (res.code === 200) {
        this.meatData();
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
    // 批量删除数据
    async meatDataDels() {
      let params = this.selectedRowKeys;
      let res = await getManageDataDelsLists(params);
      if (res.code === 200) {
        this.meatData();
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
      this.loading = false;
      this.selectedRowKeys = [];
    },
    handleClickDel(row) {
      // console.log(row);
      this.id = row.id;
      this.meatDataDel();
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
  // height: 100%;
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
  &-btn {
    float: right;
  }
}
</style>
