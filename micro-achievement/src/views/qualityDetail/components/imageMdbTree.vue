<template>
  <div class="rightMdb">
    <el-container>
      <el-header>
        <el-menu
          :default-active="activeIndex2"
          class="el-menu-demo"
          mode="horizontal"
          @select="handleSelect"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <el-menu-item
            v-for="(item, index) in tableData"
            :key="index"
            :index="index.toString()"
            >{{ item }}</el-menu-item
          >
        </el-menu>
      </el-header>

      <el-main>
        <el-table
          size="small "
          stripe
          border
          height="650"
          style="width: 100%"
          :data="tableDataList"
          :header-cell-style="{ 'text-align': 'center' }"
          :cell-style="{ 'text-align': 'center' }"
        >
          <el-table-column
            v-for="(item, index) of tableDataTitleList"
            :key="index"
            :prop="item.name"
            :label="item.name"
          >
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { getTableDataLists, getTableTitalLists } from "@/api/mdb.js";
export default {
  props: ["mdbId"],
  data() {
    return {
      tableData: [],
      tableDataList: [],
      tableDataTitleList: [],
      activeIndex2: "0",
      query: {
        id: "",
        tableName: ""
      }
    };
  },
  components: {},
  mounted() {
    this.getTableTital();
  },
  methods: {
    async getTableTital() {
      let params = this.mdbId;
      let res = await getTableTitalLists(params);
      this.tableData = res.data.data;
      this.query.tableName = this.tableData[0];
      this.query.id = this.mdbId;
      this.getTableList();
    },
    handleSelect(key) {
      this.query.tableName = this.tableData[key];
      this.getTableList();
    },
    async getTableList() {
      let params = this.query;
      let res = await getTableDataLists(params);
      // console.log(res.data.data)
      if (res.data.data.fields) {
        this.tableDataTitleList = res.data.data.fields;
      }
      if (res.data.data.attributes) {
        this.tableDataList = res.data.data.attributes;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.rightMdb {
  padding: 10px;
}
</style>
