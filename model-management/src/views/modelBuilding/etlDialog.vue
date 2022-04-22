<template>
  <el-dialog
    title="流程图"
    v-if="dialogVisible"
    :visible.sync="dialogVisible"
    @close="cancel"
    width="50%"
  >
    <div class="container">
      <div class="container-header">
        <div>
          当前选中值：
          <template v-if="selectItem">
            <span class="container-header-title">
              {{ selectItem.name }}
            </span>
            <span
              class="el-icon-delete btnSpan"
              title="清除当前选中值"
              @click="clearSelectEvent"
            ></span>
          </template>
        </div>
      </div>

      <el-table
        :data="list"
        border
        style="width: 100%"
        size="mini"
        @row-click="selectEvent"
      >
        <el-table-column type="index" width="50" label="序号" align="center"> </el-table-column>
        <el-table-column prop="name" label="名称" :show-overflow-tooltip="true" align="center">
        </el-table-column>
        <el-table-column prop="tbxFile" label="文件路径" :show-overflow-tooltip="true" align="center"></el-table-column>
        <el-table-column
          prop="updatetime"
          label="时间"
          align="center"
          :formatter="dateFormatter"
        >
        </el-table-column>
      </el-table>
      <div class="container-bottom">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="total"
          :current-page="page"
          :page-size="size"
          :hide-on-single-page="true"
          @current-change="pageCurrentChange"
        >
        </el-pagination>
      </div>
    </div>
    <div>
      <el-button type="primary" @click="submit">确定</el-button>
      <el-button @click="cancel">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getETLListRequest } from "@/api/etlApi";

export default {
  data() {
    return {
      dialogVisible: false,
      list: [],
      total: 0,
      page: 1,
      size: 10,
      selectItem: null,
      modelId: null
    };
  },
  methods: {
    init(data) {
      this.dialogVisible = true;
      this.getList();
      this.selectItem = data;
    },
    async getList() {
      let params = {
        page: this.page,
        size: this.size
      };
      let res = await getETLListRequest(params);
      if (res.data && res.data.records) {
        this.list = res.data.records;
        this.total = res.data.total;
      } else {
        this.list = [];
        this.total = 0;
      }
    },
    pageCurrentChange(val) {
      this.page = val;
      this.getList();
    },
    selectEvent(row, column, event) {
      this.selectItem = row;
    },
    clearSelectEvent() {
      this.selectItem = null;
    },
    submit() {
      this.$emit("submit", this.selectItem);
      this.cancel();
    },
    cancel() {
      this.dialogVisible = false;
      this.selectItem = null;
    },
    dateFormatter(row, column, cellValue, index) {
      if (cellValue) {
        return cellValue.replace("T", " ").substring(0, 19);
      }
      return null;
    }
  }
};
</script>

<style lang="less" scoped>
.container {
  margin-top: -40px;
  > * {
    margin-bottom: 10px;
  }
  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    &-title {
      color: #f00;
      font-size: 16px;
      font-weight: bold;
    }
    .btnSpan {
      cursor: pointer;
    }
  }
  &-bottom {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
