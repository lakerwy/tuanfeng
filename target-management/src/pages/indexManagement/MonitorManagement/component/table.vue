<template>
  <div class="table">
    <div class="table-title">
      <p>
        <i></i>当前选择：<span>{{ chooseList }}</span>
      </p>
    </div>
    <div class="table-main">
      <a-table
        :columns="columns"
        :data-source="data"
        bordered
        :pagination="pagination"
      >
        <template slot="operation" slot-scope="text, record">
          <a @click="handleEdit(record)">
            <a-icon title="编辑" type="edit" style="font-size:20px" />
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
  props: ["chooseList"],
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
          date: "2019-08-03",
          name: "城乡建设用地面积",
          cycle: "1年",
          period: "2020年",
          time: "2021-09-09",
          value: 1104.0499,
          unit: "平方千米"
        },
        {
          key: "2",
          nation: "团风县",
          date: "2017-05-03",
          name: "城乡建设用地面积",
          cycle: "2年",
          period: "2021年",
          time: "2020-09-09",
          value: 1114.0499,
          unit: "公顷"
        }
      ],
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
          title: "行政区",
          dataIndex: "nation",
          // width: "15%",
          scopedSlots: { customRender: "nation" },
          align: "center"
        },
        {
          title: "指标名称",
          dataIndex: "name",
          // width: "35%",
          scopedSlots: { customRender: "name" },
          align: "center"
        },
        {
          title: "周期",
          dataIndex: "cycle",
          // width: "25%",
          scopedSlots: { customRender: "cycle" },
          align: "center",
          sorter: (a, b) => a.cycle.split("年")[0] - b.cycle.split("年")[0],
          sortDirections: ["descend", "ascend"]
        },
        {
          title: "监测时间段",
          dataIndex: "period",
          // width: "10%",
          scopedSlots: { customRender: "period" },
          align: "center",
          sorter: (a, b) => a.period.split("年")[0] - b.period.split("年")[0],
          sortDirections: ["descend", "ascend"]
        },
        {
          title: "定期监测时间",
          dataIndex: "time",
          // width: "10%",
          scopedSlots: { customRender: "time" },
          align: "center",
          sorter: (a, b) => {
            //将日期转成毫秒数，有利于计算大小
            let atime = new Date(a.time.replace(/-/g, "/")).getTime();
            let btime = new Date(b.time.replace(/-/g, "/")).getTime();
            return atime - btime;
          },
          //两个排序方向
          sortDirections: ["descend", "ascend"]
        },
        {
          title: "监测值",
          dataIndex: "value",
          // width: "10%",
          scopedSlots: { customRender: "value" },
          align: "center",
          sorter: (a, b) => a.value - b.value,
          sortDirections: ["descend", "ascend"]
        },
        {
          title: "单位",
          dataIndex: "unit",
          // width: "10%",
          scopedSlots: { customRender: "unit" },
          align: "center"
        },
        {
          title: "最后更新时间",
          dataIndex: "date",
          // width: "10%",
          scopedSlots: { customRender: "date" },
          align: "center",
          sorter: (a, b) => {
            //将日期转成毫秒数，有利于计算大小
            let atime = new Date(a.date.replace(/-/g, "/")).getTime();
            let btime = new Date(b.date.replace(/-/g, "/")).getTime();
            return atime - btime;
          },
          //两个排序方向
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

.ant-table-row a {
  margin-right: 18px;
}

.table {
  width: 1420 / @vw;
  margin-left: 24 / @vw;
  height: 100%;

  &-title {
    height: 54 / @vh;
    width: 100%;
    line-height: 54 / @vh;
    border-bottom: 1px solid #e8e8e8;
    margin-bottom: 15 / @vh;
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
