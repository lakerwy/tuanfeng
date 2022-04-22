<template>
  <!-- 数据字典 -->
  <div class="table">
    <div class="table-title">
      <p>
        <i></i>当前数据:<span> {{ total }}条</span>
      </p>
      <div class="butBox" @click="handerClickAdd">+ 新增数据源</div>
    </div>
    <div class="table-main">
      <a-table
        :columns="columns"
        :data-source="data"
        bordered
        :pagination="pagination"
        @change="handleTableChange"
      >
        <template slot="operation" slot-scope="text, record">
          <a @click="handleClickEdit(record)">
            <a-icon title="编辑" type="edit" style="font-size:20px;" />
          </a>
          <a-popconfirm
            v-if="data.length"
            title="确认需要删除吗?"
            @confirm="() => handleClickDel(record)"
          >
            <a href="javascript:;"
              ><a-icon title="删除" type="delete" style="font-size:20px"
            /></a>
          </a-popconfirm>
        </template>
      </a-table>
    </div>
    <div>
      <dialog-one ref="dialogValue" :form="form"></dialog-one>
    </div>
    <div>
      <dialog-two ref="dialogAdd"></dialog-two>
    </div>
  </div>
</template>

<script>
import dialogOne from "./modal";
import dialogTwo from "./add";
import { getdataSourceLists, getdataSourceDelLists } from "@/api/management";
export default {
  props: ["tableData"],
  components: {
    dialogOne,
    dialogTwo
  },
  data() {
    return {
      form: "", // 编辑页面表单
      data: [],
      id: "",
      total: 0,
      pagination: {
        showQuickJumper:true
      },
      meatDataList: [],
      columns: [
        {
          title: "序号",
          dataIndex: "num",
          customRender: function(t, r, index) {
            return parseInt(index) + 1;
          },
          align: "center"
        },
        {
          title: "服务器节点名称",
          dataIndex: "nodename",
          scopedSlots: { customRender: "nodename" },
          align: "center"
        },
        {
          title: "节点IP",
          dataIndex: "nodeip",
          scopedSlots: { customRender: "nodeip" },
          align: "center"
        },
        // {
        //   title: "GPRC端口",
        //   dataIndex: "grpcport",
        //   scopedSlots: { customRender: "grpcport" },
        //   align: "center"
        // },
        {
          title: "数据库类型",
          dataIndex: "dbtype",
          scopedSlots: { customRender: "dbtype" },
          align: "center"
        },
        {
          title: "数据库端口",
          dataIndex: "dbport",
          scopedSlots: { customRender: "dbport" },
          align: "center"
        },
        {
          title: "数据库名称",
          dataIndex: "dbname",
          scopedSlots: { customRender: "dbname" },
          align: "center"
        },
        // {
        //   title: "数据库用户名",
        //   dataIndex: "dbusername",
        //   scopedSlots: { customRender: "dbusername" },
        //   align: "center"
        // },
        // {
        //   title: "集群名称",
        //   dataIndex: "clustername",
        //   scopedSlots: { customRender: "clustername" },
        //   align: "center"
        // },
        {
          title: "操作",
          dataIndex: "operation",
          scopedSlots: { customRender: "operation" },
          align: "center"
        }
      ],
      query: {}
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
      let res = await getdataSourceLists(params);
      this.meatDataList = res.data.records;
      if (this.meatDataList.length > 0) {
        const pagination = { ...this.pagination };
        pagination.total = res.data.total;
        this.pagination = pagination;
        this.total = res.data.total;
        for (var i in this.meatDataList) {
          // 添加Key属性
          this.meatDataList[i].key = this.meatDataList[i].id;
        }
        this.data = this.meatDataList;
      } else {
        this.query.page = this.query.page - 1;
        this.meatData();
      }
    },

    handleClickEdit(row) {
      console.log(row)
      this.form = row;
      this.$refs.dialogValue.visible = true;
    },
    // handleClickTest(row) {
    //   console.log(row);
    // },
    // 删除数据
    async meatDataDel() {
      let params = this.id;
      let res = await getdataSourceDelLists(params);
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
    handleClickDel(row) {
      console.log(row);
      this.id = row.id;
      this.meatDataDel();
    },
    handerClickAdd() {
      this.$refs.dialogAdd.form = {};
      this.$refs.dialogAdd.visible = true;
    }
  }
};
</script>
<style lang="less" scoped>
.ant-table-row a {
  margin-right: 18px;
}

.table {
  // width: 1834px;
  margin-left: 24px;
    height: calc(100vh - 128px);
  overflow-y: auto;
  &-title {
    height: 54px;
    width: 100%;
    line-height: 54px;
    p {
      margin: 0;
      float: left;
      color: #454954;
      font-size: 16px;
      span {
        color: #1890ff;
      }
      i {
        background: url(../../../../assets/img/circle.png) no-repeat;
        background-size: 13px 13px;
        display: inline-block;
        width: 13px;
        height: 13px;
        margin-top: 20px;
        margin-right: 12px;
      }
    }
    .butBox {
      color: #fff;
      width: 140px;
      height: 34px;
      line-height: 34px;
      text-align: center;
      border-radius: 6px;
      background-color: #397DC9;
      float: right;
      margin-top: 10px;
      cursor: pointer;
    }
  }
}
</style>
