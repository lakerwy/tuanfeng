<template>
  <div class="table">
    <div class="table-title">
      <p><i></i>指标维度管理</p>
      <div class="butBox" @click="handerClickAdd">+ 新增指标维度</div>
    </div>
    <div class="table-main">
      <a-table
        :columns="columns"
        :data-source="data"
        bordered
        :pagination="pagination"
        @change="handleTableChange"
        :scroll="{ y: 640 }"
      >
        <template slot="operation" slot-scope="text, record">
          <a @click="handleEdit(record)">
            <a-icon title="编辑" type="edit" style="font-size:20px;" />
          </a>
          <a-popconfirm
            v-if="data.length"
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
    <div v-if="isShow">
      <dialog-one
        ref="dialogValue"
        :form="form"
        :nameList="nameList"
      ></dialog-one>
    </div>
    <div v-if="isShows">
      <dialog-two ref="dialogAdd" :nameList="nameList"></dialog-two>
    </div>
  </div>
</template>

<script>
import dialogOne from "./modal";
import dialogTwo from "./add";
import {
  getLatitudeDataLists,
  getLatitudeDataDelLists,
  getDataDictionaryLists
} from "@/api/management";
export default {
  components: {
    dialogOne,
    dialogTwo
  },
  data() {
    return {
      form: "",
      // 编辑页面表单
      data: [],
      meatDataList: [],
      columns: [
        {
          title: "序号",
          dataIndex: "num",
          customRender: function(t, r, index) {
            return parseInt(index) + 1;
          },
          width: 80,
          align: "center"
        },
        {
          title: "维度名称",
          dataIndex: "name",
          width: 120,
          scopedSlots: { customRender: "name" },
          align: "center"
        },
        {
          title: "维度说明",
          dataIndex: "info",
          width: 220,
          scopedSlots: { customRender: "info" },
          align: "center"
        },
        {
          title: "维度值域",
          dataIndex: "names",
          width: 620,
          scopedSlots: { customRender: "names" },
          align: "center"
        },
        {
          title: "更新时间",
          dataIndex: "updatetime",
          scopedSlots: { customRender: "updatetime" },
          width: 120,
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
      query: {
        size:100
      },
      total: 0,
      pagination: {
        showQuickJumper: true
      },
      nameList: [],
      isShow: false,
      isShows: false,
      scroll:"80vh"
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
      // console.log(pagination);
      const pager = { ...this.pagination };
      pager.current = pagination.current;
      this.pagination = pager;
      this.query.page = this.pagination.current;
      this.meatData();
    },
    async meatData1() {
      this.query.page=1
      let params = this.query;
      let res = await getDataDictionaryLists(params);
      let List = res.data.records;
      console.log(List)
      for (var i in List) {
        this.nameList.push({
          id: List[i].id,
          name: List[i].name,
          value: List[i].value
        });
      }
    },
    async meatData() {
      let params = {};
      let res = await getLatitudeDataLists(params);
      this.meatDataList = res.data.records;
      // console.log(this.meatDataList)
      for (var i in this.meatDataList) {
        // 添加Key属性
        this.meatDataList[i].key = this.meatDataList[i].id;

        // 更新时间---截取到年月日
        if (this.meatDataList[i].updatetime === null) {
          this.meatDataList[i].updatetime = "";
        } else {
          this.meatDataList[i].updatetime = this.meatDataList[
            i
          ].updatetime.substr(0, this.meatDataList[i].updatetime.indexOf("T"));
        }
      }
      this.data = this.meatDataList;
      let latitudeData = JSON.stringify(this.data);
      sessionStorage.setItem("latitudeData", latitudeData);
    },
    handleEdit(row) {
      // console.log(row)
      this.form = row;
      this.isShow = true;
      this.$nextTick(() => {
        this.$refs.dialogValue.visible = true;
      });
      this.meatData1();
    },
    // 删除数据
    async meatDataDel() {
      let params = this.id;
      let res = await getLatitudeDataDelLists(params);
      if (res.code === 200) {
        this.$notification.open({
          message: "数据删除成功",
          icon: <a-icon type="smile" style="color: #108ee9" />
        });
        this.meatData();
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
    },
    handerClickAdd() {
      this.meatData1();
      this.isShows = true;
      this.$nextTick(() => {
        this.$refs.dialogAdd.visible = true;
      });
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
  // height: 100%;
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
      width: 152px;
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
