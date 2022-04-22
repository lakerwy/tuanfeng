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
        <el-table-column label="序号" type="index" width="80">
        </el-table-column>
        <el-table-column prop="kpiname" label="指标名称">
        </el-table-column>
        <el-table-column prop="itemUnit" label="单位">
        </el-table-column>
        <el-table-column prop="itemTypeName" label="指标属性" >
        </el-table-column>
        <el-table-column prop="overTypeName" label="规划要求" >
        </el-table-column>
        <el-table-column label="规划期">
          <el-table-column prop="reportValue" label="文本上报数值" >
          </el-table-column>
          <el-table-column
            prop="recentupvalue"
            label="上级下达数值"
            
          >
          </el-table-column>
          <el-table-column prop="subValue" label="差值" >
          </el-table-column>
        </el-table-column>
        <el-table-column prop="machineResult" label="机审结果">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { getZbfhxList } from "@/api/auditTaskOthers.js";
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
      let res = await getZbfhxList(params);
      if (res.data.code == 0) {
        this.tableData = res.data.data.kpiTargetvalues;
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
