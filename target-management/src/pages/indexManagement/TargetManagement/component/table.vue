<template>
  <!-- 目标值管理 -->
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
        :scroll="{ y: 485 }"
      >
        <template slot="isResolve" slot-scope="text">
          <span v-if="text === '是'" style="color: #eda169">是</span>
          <span v-if="text === '否'" style="color: #5ec26d">否</span>
        </template>
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
  getTargetManageDataLists,
  getTargetManageDelLists,
  getTargetManageDelsLists
} from "@/api/management";
import dialogAddS from "@/components/select/yearSelect.vue";
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

          scopedSlots: { customRender: "year" },
          align: "center"
        },
        {
          title: "行政区划编码",
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

          scopedSlots: { customRender: "kpiid" },
          align: "center"
        },
        {
          title: "指标名称",
          dataIndex: "kpiname",
          width: 220,
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
          title: "基期值",
          dataIndex: "basevalue",

          scopedSlots: { customRender: "basevalue" },
          align: "center"
        },
        {
          title: "近期目标值",
          children: [
            {
              title: "本值",
              dataIndex: "recentlocalvalue",

              scopedSlots: { customRender: "recentlocalvalue" },
              align: "center"
            },
            {
              title: "上级下达",
              dataIndex: "recentupvalue",

              scopedSlots: { customRender: "recentupvalue" },
              align: "center"
            }
          ]
        },
        {
          title: "规划目标值",
          children: [
            {
              title: "本值",
              dataIndex: "planlocalvalue",

              scopedSlots: { customRender: "planlocalvalue" },
              align: "center"
            },
            {
              title: "上级下达",
              dataIndex: "planupvalue",

              scopedSlots: { customRender: "planupvalue" },
              align: "center"
            }
          ]
        },
        {
          title: "更新时间",
          dataIndex: "updatetime",
          width: 120,
          scopedSlots: { customRender: "updatetime" },
          align: "center"
        },
        {
          title: "操作",
          dataIndex: "operation",
          scopedSlots: { customRender: "operation" },
          width: 120,
          align: "center"
        }
      ],
      id: "",
      selectedRowKeys: [],
      pagination: {
        showQuickJumper: true
      },
      query: {},
      arrList: [] //指标名称下拉选项的临时存储
    };
  },
  mounted() {
    // console.log(new Date(moment("2020")).getFullYear())
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
      this.loading = true;
      this.meatDataDels();
    },
    // 分页按钮
    handleTableChange(pagination, filters, sorter) {
      // console.log(pagination);
      const pager = { ...this.pagination };
      pager.current = pagination.current;
      this.pagination = pager;
      this.query.page = this.pagination.current;
      this.meatData();
    },
    // 获取 列表数据
    async meatData() {
      let params = this.query;
      let res = await getTargetManageDataLists(params);
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
        // 更新时间---截取到年月日
        if (this.dataList[i].updatetime === null) {
          this.dataList[i].updatetime = "--";
        } else {
          this.dataList[i].updatetime = this.dataList[i].updatetime.substr(
            0,
            this.dataList[i].updatetime.indexOf("T")
          );
        }
      }
      this.data = this.dataList;
    },
    // 数组对象去重
    // getNewOption(arr) {
    //   let res = [];
    //   let repeat = [];
    //   for (let i = 0; i < arr.length; i++) {
    //     let name = arr[i].name;
    //     if (!repeat[name]) {
    //       res.push(arr[i]);
    //       repeat[name] = 1;
    //     }
    //   }
    //   this.$parent.nationOption = res;
    //   return res;
    // },

    // 编辑
    handleEdit(row) {
      // console.log(row)
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
      let res = await getTargetManageDelLists(params);
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
      let res = await getTargetManageDelsLists(params);
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
  // padding-bottom: 24 / @vw;
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
  &-pageBox {
    float: right;
    height: 50 / @vh;
    margin: 20 / @vh 0;
  }
}
</style>
