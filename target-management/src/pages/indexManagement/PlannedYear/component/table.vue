<template>
  <div class="table">
    <div class="table-title">
      <p><i></i>当前数据:<span> 1234条</span></p>
    </div>
    <div class="table-main">
      <a-table
        :columns="columns"
        :data-source="data"
        bordered
        :pagination="pagination"
      >
        <template slot="isResolve" slot-scope="text">
          <span v-if="text === '是'" style="color:#eda169">是</span>
          <span v-if="text === '否'" style="color:#5ec26d">否</span>
        </template>
        <template slot="operation" slot-scope="text, record">
          <a @click="handleEdit(record)">
            <a-icon title="编辑" type="edit" style="font-size:20px" />
          </a>
        </template>
      </a-table>
    </div>

    <div>
      <dialog-one ref="dialogValue" :form="form"></dialog-one>
    </div>
  </div>
</template>

<script>
import dialogOne from "./modal";
export default {
  components: {
    dialogOne
  },
  data() {
    return {
      form: "",
      // 编辑页面表单
      pagination: {
        current: 1,
        pageSize: 5,
        showSizeChanger: true,
        pageSizeOptions: ["5", "10", "15", "20"],
        total: 0,
        showQuickJumper: true
      },
      data: [
        {
          key: "1",
          nation: "团风县",
          year: 2020,
          recent: 2019,
          plan: 2019
        },
        {
          key: "2",
          nation: "团风县",
          year: 2018,
          recent: 2019,
          plan: 2020
        },
        {
          key: "3",
          nation: "团风县",
          year: 2016,
          recent: 2017,
          plan: 2019
        },
        {
          key: "4",
          nation: "团风县",
          year: 2019,
          recent: 2020,
          plan: 2021
        }
      ],
      columns: [
        {
          title: "序号",
          customRender: function(t, r, index) {
            return parseInt(index) + 1;
          },
          align: "center"
        },
        {
          title: "行政区",
          dataIndex: "nation",
          scopedSlots: { customRender: "nation" },
          align: "center"
        },
        {
          title: "基期年",
          dataIndex: "year",
          scopedSlots: { customRender: "year" },
          align: "center",
          sorter: (a, b) => a.year - b.year,
          sortDirections: ["descend", "ascend"]
        },
        {
          title: "近期目标年",
          dataIndex: "recent",
          scopedSlots: { customRender: "recent" },
          align: "center",
          sorter: (a, b) => a.recent - b.recent,
          sortDirections: ["descend", "ascend"]
        },
        {
          title: "规划目标年",
          dataIndex: "plan",
          scopedSlots: { customRender: "plan" },
          align: "center",
          sorter: (a, b) => a.plan - b.plan,
          sortDirections: ["descend", "ascend"]
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
  mounted() {},
  updated() {
    // 设置斑马条纹
    this.renderStripe();
  },
  methods: {
    handleEdit(row) {
      this.form = row;
      this.$refs.dialogValue.visible = true;
    },
    handleDelete(row) {
      console.log(row);
    }
  }
};
</script>

<style lang="less" scoped>
@vw: 22.2vw;
@vh: 10.8vh;

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
  }
  &-pageBox {
    float: right;
    height: 50 / @vh;
    margin-top: 20 / @vh;
  }
}
</style>
