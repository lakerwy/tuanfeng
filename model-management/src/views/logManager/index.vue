<template>
  <div class="manager logManager">
    <div class="head breadHead">
      <div class="filterBox">
        <div class="label">模型类别:</div>
        <div class="inputBox">
          <el-select v-model="searchForm.moderntype" placeholder="请选择">
            <el-option
              v-for="item in typeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class="label">模型名称:</div>
        <div class="inputBox">
          <el-input
            placeholder="请输入内容"
            size="small"
            v-model="searchForm.modername"
          ></el-input>
        </div>
        <div class="label">运行状态:</div>
        <div class="inputBox">
          <el-select v-model="searchForm.state" placeholder="请选择">
            <el-option
              v-for="item in statusList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class="buttons reset" @click="search">搜索</div>
        <div class="buttons search" @click="reset" style="background: #397DC9">重置</div>
      </div>
    </div>
    <div class="container tableContainer">
      <div class="tableBox">
        <el-table
          :data="tableData"
          border
          style="width: 100%"
          stripe
          :header-cell-style="{ 'background-color': '#f0f6fb' }"
        >
          <el-table-column
            width="50"
            type="index"
            label="序号"
          ></el-table-column>
          <el-table-column
            :formatter="formatterStatus"
            prop="state"
            width="80"
            label="运行状态"
          ></el-table-column>
          <el-table-column
            :formatter="formatterType"
            prop="moderntype"
            label="模型类别"
          ></el-table-column>
          <el-table-column
            prop="modername"
            label="模型名称"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column prop="starttime" label="开始时间" width="180">
            <template slot-scope="scope">
              <div>{{ scope.row.starttime | dataFormat }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="endtime" label="完成时间" width="180">
            <template slot-scope="scope">
              <div>{{ scope.row.endtime | dataFormat }}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="info"
            label="结果"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <div v-if="!showCheckLogBtn(scope.row)">{{ scope.row.info }}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                v-if="showCheckLogBtn(scope.row)"
                @click="checkLog(scope.row)"
                type="text"
                size="small"
                style="padding:0"
                >查看日志</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
    <el-dialog title="日志详情" :visible.sync="dialogVisible" width="30%">
      <!-- <span>选中的详情日志id为:{{ logInfo ? logInfo.id : "" }}</span> -->
      <div>{{ logInfo ? logInfo.info : "" }}</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" type="primary"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getLogList } from "../../api/api.js";
export default {
  data() {
    return {
      dialogVisible: false,
      logInfo: null,
      searchForm: {
        modername: "",
        moderntype: "",
        state: ""
      },
      size: 10,
      page: 1,
      total: 0,
      tableData: [],
      typeList: [
        {
          label: "全部",
          value: null
        },
        {
          label: "双评价模型",
          value: "1"
        },
        {
          label: "编审监一体化模型",
          value: "2"
        },
        {
          label: "评估指标模型",
          value: "3"
        }
      ],
      statusList: [
        {
          label: "全部",
          value: null
        },
        {
          label: "未运行",
          value: "0"
        },
        {
          label: "运行成功",
          value: "1"
        },
        {
          label: "正在运行",
          value: "2"
        },
        {
          label: "运行失败",
          value: "3"
        }
      ]
    };
  },
  filters: {
    dataFormat: function(value) {
      if (value) {
        return value.substr(0, 19).replace("T", " ");
      }
      return null;
    }
  },
  mounted() {
    this.getList();
  },
  methods: {
    showCheckLogBtn(item) {
      if (
        item.moderntype === "Spj41" ||
        item.moderntype === "Spj42" ||
        item.moderntype === "Spj43" ||
        item.moderntype === "Spj44" ||
        item.state === 3
      ) {
        return true;
      }
      return false;
    },
    async getList() {
      var params = this.searchForm;
      for (var i in this.searchForm) {
        if (this.searchForm[i] == "") {
          delete this.searchForm[i];
        }
      }
      params.page = this.page;
      params.size = this.size;
      var res = await getLogList(params);
      // console.log(res);
      if (res.code == 200) {
        this.tableData = res.data.records;
        this.total = res.data.total;
      } else {
        this.$message({
          message: res.msg,
          type: "error"
        });
      }
    },
    formatterType(row, column) {
      for (var i in this.typeList) {
        if (row.moderntype == this.typeList[i].value) {
          return this.typeList[i].label;
        }
      }
    },
    formatterStatus(row, column) {
      for (var i in this.statusList) {
        if (row.state == this.statusList[i].value) {
          return this.statusList[i].label;
        }
      }
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.page = 1;
      this.size = val;
      this.getList();
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.page = val;
      this.getList();
    },
    search() {
      this.page = 1;
      this.getList();
    },
    reset() {
      this.page = 1;
      (this.searchForm = {
        modername: "",
        moderntype: "",
        state: ""
      }),
        this.getList();
    },
    checkLog(data) {
      // console.log(data);
      this.logInfo = data;
      this.dialogVisible = true;
    }
  }
};
</script>

<style lang="less" scoped>
@vw: 19.2vw;
@vh: 10.8vh;

.logManager {
  .breadHead {
    .filterBox {
      height: 36 / @vh;

      .label {
        height: 36 / @vh;
        width: 80 / @vw;
        line-height: 36 / @vh;
        font-size: 14 / @vh;
        color: #6f7583;
        float: left;
        text-align: left;

        &:first-child {
          margin-left: 50 / @vw;
        }
      }

      .inputBox {
        float: left;
      }

      .buttons {
        width: 90 / @vw;
        height: 36 / @vh;
        line-height: 36 / @vh;
        text-align: center;
        box-sizing: border-box;
        font-size: 14px;
        cursor: pointer;
        float: left;
      }

      .reset {
        color: #1890ff;
        border: 1px solid #1890ff;
      }

      .search {
        color: #fff;
        background-color: #1890ff;
        margin-left: 16 / @vw;
      }

      .add {
        color: #fff;
        background-color: #1890ff;
        float: right;
        margin-right: 30 / @vw;
      }
    }
  }
}
</style>
<style lang="less">
@vw: 19.2vw;
@vh: 10.8vh;

.logManager {
  .filterBox {
    .el-select {
      width: 304 / @vw;
      margin-right: 40 / @vw;
    }

    .el-input__icon {
      line-height: 36 / @vh;
    }

    .el-input__inner {
      height: 36 / @vh;
      width: 304 / @vw;
      margin-right: 40 / @vw;
    }
  }

  .el-table td,
  .el-table th {
    text-align: center;
  }

  .el-pagination {
    float: right;
    margin-top: 20 / @vh;
  }
}
</style>
