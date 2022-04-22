<template>
  <div class="rights">
    <div class="table">
      <el-table
        :data="tableData"
        style="width: 100%"
        height="500"
        :header-cell-style="{ 'text-align': 'center' }"
        :cell-style="{ 'text-align': 'center' }"
      >
        <el-table-column label="地类">
          <el-table-column prop="upperTypeName" label="地类" >
          </el-table-column>
          <el-table-column prop="ydlxmc" label="名称" >
          </el-table-column>
        </el-table-column>
        <el-table-column label="规划期(2035年)">
          <el-table-column label="面积(平方千米)">
            <el-table-column
              prop="ghjqnmj"
              label="表格面积"
              
            >
            </el-table-column>
            <el-table-column
              prop="planBasicValues"
              label="图上面积"
             
            >
            </el-table-column>
            <el-table-column prop="areaDifference" label="差值" >
            </el-table-column>
          </el-table-column>
          <el-table-column label="比例">
            <el-table-column prop="ghjqnzzmjb" label="表格比例" >
            </el-table-column>
            <el-table-column prop="planBasicProportion" label="图上比例" >
            </el-table-column>
            <el-table-column prop="areaRatioDifference" label="差值" >
            </el-table-column>
          </el-table-column>
        </el-table-column>
        <el-table-column prop="machineResult" label="机审结果">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { getTsyzxList } from "@/api/auditTaskOthers.js";
export default {
  props: ["rowData"],
  data() {
    return {
      tableData: []
    };
  },
  mounted() {
    this.getTable();
  },
  methods: {
    async getTable() {
      let params = this.rowData.id;
      let res = await getTsyzxList(params);
      if (res.data.code == 0) {
        this.tableData = res.data.data.gdbColumnInfoVoList;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.rights {
  width: 100%;
  background: #fff;
}
.table {
  padding: 18px;
}
</style>
