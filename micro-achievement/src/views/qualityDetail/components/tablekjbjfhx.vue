<template>
  <div class="rights">
    <div class="title"><p>规划分区不符合控制线要求-汇总表</p></div>
    <div class="table mainTables">
      <el-table
        border
        :data="tableData"
        style="width: 100%"
        height="150"
        :header-cell-style="{ 'text-align': 'center' }"
        :cell-style="{ 'text-align': 'center' }"
        @row-click="handleClickRow"
      >
        <el-table-column prop="controlLineTypeName" label="控制线名称">
        </el-table-column>
        <el-table-column prop="conflictCount" label="冲突个数">
        </el-table-column>
        <el-table-column prop="totalArea" label="总面积(平方米)">
        </el-table-column>
      </el-table>
    </div>
    <div class="title"><p>规划分区不符合控制线要求-明细表</p></div>
    <div class="table">
      <el-table
        border
        :data="tableDataDetails"
        style="width: 100%"
        height="190"
        :header-cell-style="{ 'text-align': 'center' }"
        :cell-style="{ 'text-align': 'center' }"
      >
        <el-table-column prop="referencePlotCode" label="参照地块" width="100">
        </el-table-column>
        <el-table-column prop="examinePlotCode" label="审查地块" width="100">
        </el-table-column>
        <el-table-column prop="planningZoneName" label="规划分区名称">
        </el-table-column>
        <el-table-column prop="area" label="面积" width="100">
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage4"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="10"
        layout="total, sizes, prev, pager, next"
        :total="total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import {
  getKjbjfhxList,
  getKjbjfhxDetailsList
} from "@/api/auditTaskOthers.js";
export default {
  data() {
    return {
      tableData: [],
      tableDataDetails: [],
      rowData: JSON.parse(sessionStorage.getItem("rowData")),
      query: {
        pageIndex: 1,
        pageSize: 10,
        taskObjId: ""
      },
      queryDetails: {
        pageIndex: 1,
        pageSize: 10,
        taskObjId: "",
        controlLineType: ""
      },
      currentPage4: 1,
      total: 0
    };
  },
  mounted() {
    this.getTable();
  },
  methods: {
    async getTable() {
      // this.query.taskObjId = 300;
      this.query.taskObjId = this.rowData.id;
      let params = this.query;
      let res = await getKjbjfhxList(params);
      if (res.data.code == 0 && res.data.data.records.length>0) {
        this.tableData = res.data.data.records;
        // this.queryDetails.taskObjId = 300;
        this.query.taskObjId = this.rowData.id;
        this.queryDetails.controlLineType = this.tableData[0].controlLineType;
      this.getDetailsTable();
      }
    },
    handleClickRow(row) {
      // debugger
      // this.queryDetails.taskObjId = 300;
      this.queryDetails.taskObjId = this.rowData.id;
      this.queryDetails.controlLineType = row.controlLineType;
      this.getDetailsTable();
    },
    async getDetailsTable() {
      let params = this.queryDetails;
      let res = await getKjbjfhxDetailsList(params);
      if (res.data.code == 0) {
        this.tableDataDetails = res.data.data.records;
        this.total = res.data.data.total;
      }
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.queryDetails.pageSize = val;
      // this.queryDetails.pageIndex=1
      // this.queryDetails.taskObjId = 300;
      this.query.taskObjId = this.rowData.id;
      this.getDetailsTable();
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.queryDetails.pageIndex = val;
      // this.queryDetails.taskObjId = 300;
      this.query.taskObjId = this.rowData.id;
      this.getDetailsTable();
    }
  }
};
</script>

<style lang="less" scoped>

.rights {
  width: 100%;
  background: #fff;
  .title {
    height: 30px;
    padding: 5px;
    border-bottom: 1px solid #f5f5f5;
    p {
      font-weight: bold;
      margin-left: 18px;
    }
  }
  .mainTables /deep/ .el-table tr :hover{
    cursor: pointer;
  }
  .pagination {
    text-align: center;
  }
}
.table {
  padding: 5px 18px 10px;
}
</style>
