<template>
  <!-- 数据字典 -->
  <div class="table">
    <div class="table-title">
      <p>
        <i></i>当前数据:<span> {{ total }}条</span>
      </p>
      <div class="search">
        <span>请输入名称关键字：</span>
        <a-input-search style="width:300px" @change="onSearch" />
      </div>
      <div class="butBox" @click="handerClickAdd">+ 新增数据字典</div>
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
import {
  getDataDictionaryLists,
  getDataDictionaryDelLists
} from "@/api/management";
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
      query: {},
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
          align: "center",
          ellipsis: true
        },
        {
          title: "编码",
          dataIndex: "code",
          scopedSlots: { customRender: "code" },
          align: "center",
          ellipsis: true
        },
        {
          title: "名称",
          dataIndex: "name",
          scopedSlots: { customRender: "name" },
          align: "center",
          ellipsis: true
        },
        {
          title: "值",
          dataIndex: "value",
          scopedSlots: { customRender: "value" },
          align: "center",
          ellipsis: true
        },
        // {
        //   title: "备注",
        //   dataIndex: "remark",
        //   scopedSlots: { customRender: "remark" },
        //   align: "center",
        //   ellipsis: true
        // },
        {
          title: "操作",
          dataIndex: "operation",
          scopedSlots: { customRender: "operation" },
          align: "center"
        }
      ],
      filterText: ""
    };
  },
  mounted() {
    this.meatData();
  },
  updated() {
    this.renderStripe();
  },
  methods: {
    onSearch(e) {
      this.filterText = e.target.value;
      // console.log(this.filterText);
      // if (this.filterText == "") {
        this.pagination.current = 1;
      // }
      this.query.name = this.filterText;
      this.query.page = null;
      this.meatData();
    },
    // 分页按钮
    handleTableChange(pagination, filters, sorter) {
      // console.log(pagination);
      const pager = { ...this.pagination };
      pager.current = pagination.current;
      this.pagination = pager;
      this.query.page = this.pagination.current;
      this.meatData();
      // if (this.meatDataList.length == 0) {
      //   this.query.page = this.pagination.current - 1;
      //   this.meatData();
      // }
    },
    async meatData() {
      let params = this.query;
      let res = await getDataDictionaryLists(params);
      this.meatDataList = res.data.records;
      // console.log(this.meatDataList);
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

      // if (this.data.length == 0){
      //     this.query.page=this.query.page-1
      //     this.meatData();
      //   }
    },

    handleClickEdit(row) {
      this.form = row;
      this.$refs.dialogValue.visible = true;
    },
    // handleClickTest(row) {
    //   console.log(row);
    // },
    // 删除数据
    async meatDataDel() {
      let params = this.id;
      let res = await getDataDictionaryDelLists(params);
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
      // console.log(row);
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
@vw: 22.2vw;
@vh: 10.8vh;

.ant-table-row a {
  margin-right: 18px;
}

.table {
  // width: 1834 / @vw;
  margin-left: 24px;
      height: calc(100vh - 128px);
  overflow-y: auto;
  &-title {
    height: 54 / @vh;
    width: 100%;
    line-height: 54 / @vh;
    position: relative;
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
    .search {
      position: absolute;
      left: 170px;
    }
    .butBox {
      color: #fff;
      width: 129 / @vw;
      height: 34 / @vh;
      line-height: 34 / @vh;
      text-align: center;
      border-radius: 6px;
      background-color: #397DC9;
      // float: right;
      // margin-top: 10 / @vh;
      position: absolute;
      right: 10px;
      top: 10px;
      cursor: pointer;
    }
  }
}
</style>
