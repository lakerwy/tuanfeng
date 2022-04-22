<template>
  <div class="table">
    <div class="table-title">
      <p><i></i>基本信息</p>
      <div class="butBox" @click="handerClickAdd">+ 新增元数据管理</div>
    </div>
    <div class="table-main">
      <a-table
        :columns="columns"
        :data-source="data"
        bordered
        :pagination="pagination"
        :scroll="{ y: 450 }"
        @change="handleTableChange"
      >
        <template slot="isNeed" slot-scope="text">
          <span v-if="text === '是'" style="color:#eda169">是</span>
          <span v-if="text === '否'" style="color:#5ec26d">否</span>
        </template>
        <template slot="operation" slot-scope="text, record">
          <a @click="handleEdit(record)">
            <a-icon title="编辑" type="edit" style="font-size:20px;" />
          </a>
          <a-popconfirm
            title="确认需要删除吗?"
            @confirm="() => handleDelete(record)"
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
import { getMetadataLists, getMetadataDelLists } from "@/api/management";
export default {
  components: {
    dialogOne,
    dialogTwo
  },
  data() {
    return {
      form: "",
      data: [],
      query: {},
      total: 0,
      pagination: {
        'show-quick-jumper': true,
      },
      id: "",
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
          title: "名称",
          dataIndex: "name",

          scopedSlots: { customRender: "name" },
          align: "center"
        },
        {
          title: "编码",
          dataIndex: "code",

          scopedSlots: { customRender: "code" },
          align: "center"
        },
        {
          title: "说明",
          dataIndex: "info",

          scopedSlots: { customRender: "info" },
          align: "center"
        },
        {
          title: "是否必填",
          dataIndex: "isNeed",

          scopedSlots: { customRender: "isNeed" },
          align: "center"
        },
        {
          title: "填写方式",
          dataIndex: "style",

          scopedSlots: { customRender: "style" },
          align: "center"
        },
        {
          title: "值域",
          dataIndex: "valuetext",
          scopedSlots: { customRender: "valuetext" },
          align: "center"
        },
        {
          title: "操作",
          dataIndex: "operation",
          scopedSlots: { customRender: "operation" },
          align: "center"
        }
      ]
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
    // 获取元数据
    async meatData() {
      let params = this.query;
      let res = await getMetadataLists(params);
      this.meatDataList = res.data.records;
      const pagination = { ...this.pagination };
      pagination.total = res.data.total;
      this.pagination = pagination;
      this.total = res.data.total;
      for (var i in this.meatDataList) {
        // 添加Key属性
        this.meatDataList[i].key = this.meatDataList[i].id;
        // 是否系统自带用文字显示
        if (this.meatDataList[i].isSys === 1) {
          this.meatDataList[i].isSys = "是";
        } else {
          this.meatDataList[i].isSys = "否";
        }
        // 将是否必须用文字显示
        if (this.meatDataList[i].isNeed === 1) {
          this.meatDataList[i].isNeed = "是";
        } else {
          this.meatDataList[i].isNeed = "否";
        }
        // 将样式用文字显示
        if (this.meatDataList[i].style === 2) {
          this.meatDataList[i].style = "自动填写";
        } else if (this.meatDataList[i].style === 3) {
          this.meatDataList[i].style = "下拉框";
        } else {
          this.meatDataList[i].style = "手动";
        }
      }
      // 获取表格数据
      this.data = this.meatDataList;
    },
    // 删除数据
    async meatDataDel() {
      let params = this.id;
      let res = await getMetadataDelLists(params);
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
    handleEdit(row) {
      this.form = row;
      this.$refs.dialogValue.visible = true;
    },
    handleDelete(row) {
      // console.log(row);
      if (row.isSys === "是") {
        this.$notification.open({
          message: "删除错误",
          description: "该数据为系统初始化数据，不能删除",
          icon: <a-icon type="close" style="color: red" />
        });
      } else {
        this.id = row.id;
        this.meatDataDel();
      }
    },
    // 新增元数据
    handerClickAdd() {
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
  width: 1834 / @vw;
  margin-left: 24 / @vw;
  height: 100%;
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
    .butBox {
      color: #fff;
      width: 132 / @vw;
      height: 34 / @vh;
      line-height: 34 / @vh;
      text-align: center;
      border-radius: 6px;
      background-color: #397DC9;
      float: right;
      margin-top: 10 / @vh;
      cursor: pointer;
    }
  }
}
</style>
