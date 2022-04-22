<template>
  <div class="table">
    <!-- <div class="table-title">
      <p>
        <i></i>计算完成:<span> {{ Stotal }}个</span>
      </p>
      <p>
        正在计算：<span> {{ Ntotal }}个</span>
      </p>
      <p>
        计算失败：<span> {{ Ftotal }}个</span>
      </p>
    </div> -->
    <div class="table-main">
      <a-table
        :columns="columns"
        :data-source="tableData"
        bordered
        :pagination="pagination"
        @change="handleTableChange"
        :scroll="{ y: 580 }"
      >
        <template slot="status" slot-scope="text">
          <span v-if="text === '已完成计算'" style="color:#5ec26d">已完成</span>
          <span v-if="text === '执行计算中'" style="color:rgb(237,161,105)"
            >计算中</span
          >
          <span v-if="text === '计算失败'" style="color:rgb(232,97,97)"
            >计算失败</span
          >
          <span v-if="text === '未计算'">未计算</span>
        </template>
        <template slot="operation" slot-scope="text, record">
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
  </div>
</template>

<script>
import {
  getMonitoringDataLists,
  getMonitoringDataDelLists
} from "@/api/management";
export default {
  components: {},
  data() {
    return {
      form: "",
      // 编辑页面表单
      Stotal: 0, //计算完成个数
      Ftotal: 0, //计算失败个数
      Ntotal: 0, //正在计算个数
      pagination: {
        showQuickJumper:true
      },
      columns: [
        {
          title: "序号",
          customRender: function(t, r, index) {
            return parseInt(index) + 1;
          },
          align: "center",
          width: 80,
        },
        {
          title: "行政区划代码",
          dataIndex: "arcode",
          scopedSlots: { customRender: "arcode" },
          // width: 150,
          align: "center"
        },
        {
          title: "行政区划名称",
          dataIndex: "arcname",
          scopedSlots: { customRender: "arcname" },
          // width: 150,
          align: "center"
        },
        {
          title: "指标编号",
          dataIndex: "kpiid",
          // width: 120,
          scopedSlots: { customRender: "kpiid" },
          align: "center"
        },
        {
          title: "指标名称",
          dataIndex: "kpiname",
          width: 240,
          scopedSlots: { customRender: "kpiname" },
          align: "center"
        },
        // {
        //   title: "监控周期",
        //   dataIndex: "mcycle",
        //   scopedSlots: { customRender: "mcycle" },
        //   width: 120,
        //   align: "center"
        // },
        {
          title: "单位",
          dataIndex: "unit",
          scopedSlots: { customRender: "unit" },
          align: "center"
        },
        {
          title: "监控周期",
          dataIndex: "mcycle",
          scopedSlots: { customRender: "mcycle" },
          // width: 120,
          align: "center"
        },
        {
          title: "监控值",
          dataIndex: "mvalue",
          scopedSlots: { customRender: "mvalue" },
          // width: 120,
          align: "center"
        },
        {
          title: "运行状态",
          dataIndex: "status",
          scopedSlots: { customRender: "status" },
          // width: 120,
          align: "center"
        },
        {
          title: "失败原因",
          dataIndex: "failtext",
          scopedSlots: { customRender: "failtext" },
          // width: 220,
          align: "center",
          ellipsis: true
        },
        {
          title: "更新时间",
          dataIndex: "updatetime",
          scopedSlots: { customRender: "updatetime" },
          // width: 120,
          align: "center"
        },
        // {
        //   title: "距离下次定时计算时间",
        //   dataIndex: "nextTime",
        //   scopedSlots: { customRender: "nextTime" },
        //   // width: 120,
        //   align: "center"
        // },
        {
          title: "操作",
          dataIndex: "operation",
          scopedSlots: { customRender: "operation" },
          width: 80,
          align: "center"
        }
      ],
      tableData: [],
      id: "",
      query: {
        isup:2
      },
      ListData: {}
    };
  },
  mounted() {
    this.meatData();
    var ListData = setInterval(() => {
      setTimeout(() => {
        this.meatData();
      }, 0);
    }, 30000);
    // 清除定时器
    this.$once("hook:beforeDestroy", () => {
      clearInterval(ListData);
    });
  },
    updated(){
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
    async meatData() {
      let params = this.query;
      let res = await getMonitoringDataLists(params);
      // console.log(res);
      this.dataList = res.data.records;
      const pagination = { ...this.pagination };
      pagination.total = res.data.total;
      this.pagination = pagination;
      this.total = res.data.total;
      let Arr = [];
      let Arr1 = [];
      let Arr2 = [];
      // console.log(this.dataList);
      for (var i in this.dataList) {
        // 添加Key属性
        this.dataList[i].key = this.dataList[i].id;
        if (this.dataList[i].status === 0) {
          this.dataList[i].status = "未计算";
        } else if (this.dataList[i].status === 1) {
          Arr.push(this.dataList[i].status);
          this.dataList[i].status = "已完成计算";
        } else if (this.dataList[i].status === 2) {
          Arr1.push(this.dataList[i].status);
          this.dataList[i].status = "计算失败";
        } else if (this.dataList[i].status === 3) {
          Arr2.push(this.dataList[i].status);
          this.dataList[i].status = "执行计算中";
        }
        if (this.dataList[i].mvalue !== null) {
          if (this.dataList[i].mvalue.toString().split(".")[1] != undefined) {
            if (this.dataList[i].mvalue.toString().split(".")[1].length > 4) {
              this.dataList[i].mvalue = Number(this.dataList[i].mvalue).toFixed(
                4
              );
            }
          }
        }
         // 监控周期---截取到年月日
        if (this.dataList[i].mcycle === null) {
          this.dataList[i].mcycle = "--";
        }
        // 更新时间---截取到年月日
        if (this.dataList[i].updatetime === null) {
          this.dataList[i].updatetime = "--";
        } else {
          this.dataList[i].updatetime = this.dataList[i].updatetime.substr(
            0,
            this.dataList[i].updatetime.indexOf("T")
          );
        }
        // 监测周期---截取到年月日
        if (this.dataList[i].mcycle === null) {
          this.dataList[i].mcycle = "--";
        } else if(this.dataList[i].mcycle.indexOf("T")!=-1) {
          this.dataList[i].mcycle = this.dataList[i].mcycle.substr(
            0,
            this.dataList[i].mcycle.indexOf("T")
          );
        }

      }
      this.tableData = this.dataList;
      this.Stotal = Arr.length;
      this.Ftotal = Arr1.length;
      this.Ntotal = Arr2.length;
    },
    async meatDataDel() {
      let params = this.id;
      let res = await getMonitoringDataDelLists(params);
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
    handleDelete(row) {
      this.id = row.id;
      this.meatDataDel();
    }
  }
};
</script>

<style lang="less" scoped>
@vw: 22.2vw;
@vh: 10.8vh;

.table {
  // width: 1834 / @vw;
  margin-left: 24 / @vw;
    height: calc(100vh - 227px);
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
      margin-right: 30 / @vw;
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
