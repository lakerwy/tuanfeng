<template>
  <div class="manager resultManager">
    <div class="head breadHead">
      <div class="filterBox">
        <div class="label">名称:</div>
        <div class="inputBox">
          <el-input
            placeholder="请输入名称"
            size="small"
            v-model="searchForm.name"
          ></el-input>
        </div>
        <div class="buttons reset" @click="search">搜索</div>
        <div class="buttons search" @click="reset" style="background: #397DC9">重置</div>
      </div>
      <div class="buttons add" @click="add" style="background: #397DC9">新增</div>
    </div>
    <div class="container tableContainer">
      <div class="tableBox">
        <el-table
          :data="list"
          border
          style="width: 100%"
          stripe
          :header-cell-style="{ 'background-color': '#f0f6fb' }"
        >
          <el-table-column
            type="index"
            width="50"
            label="序号"
          ></el-table-column>
          <el-table-column prop="name" label="名称"></el-table-column>
          <el-table-column
            prop="tbxFile"
            label="文件路径"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column prop="updatetime" label="更新时间">
            <template slot-scope="scope">
              <div>{{ scope.row.updatetime | dataFormat }}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                @click="edit(scope.row)"
                type="text"
                size="small"
                style="padding:0"
                >编辑</el-button
              >
              <el-button
                @click="deleteItem(scope.row)"
                type="text"
                size="small"
                style="padding:0"
                >删除</el-button
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
    <el-dialog
      :title="form ? '模型文件编辑': '模型文件新增'"
      v-if="dialogVisible"
      :visible.sync="dialogVisible"
      width="40%"
      custom-class="result-dialog"
    >
      <formCom :data="form" @cancel="cancel" @submit="submit"></formCom>
    </el-dialog>
  </div>
</template>

<script>
import { getETLListRequest, deleteETLListRequest } from "@/api/etlApi";
import formCom from "./form";

export default {
  components: {
    formCom
  },
  data() {
    return {
      dialogVisible: false,
      searchForm: {
        name: ""
      },
      size: 10,
      page: 1,
      total: 0,
      list: [],
      form: null
    };
  },
  mounted() {
    this.getList();
  },
  filters: {
    dataFormat: function(value) {
      if (value) {
        return value.substr(0, 19).replace("T", " ");
      }
      return null;
    }
  },
  methods: {
    async getList() {
      let params = {
        name: this.searchForm.name,
        page: this.page,
        size: this.size
      };
      let res = await getETLListRequest(params);
      if (res.status && res.data && res.data.records) {
        this.list = res.data.records;
        this.total = res.data.total;
      } else {
        this.list = [];
        this.total = 0;
        this.$message({
          message: res.message,
          type: "error"
        });
      }
    },
    handleSizeChange(val) {
      this.page = 1;
      this.size = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getList();
    },
    search() {
      this.page = 1;
      this.getList();
    },
    reset() {
      this.page = 1;
      this.searchForm = {
        name: ""
      };
      this.getList();
    },
    add() {
      this.dialogVisible = true;
      this.form = null;
    },
    edit(data) {
      this.dialogVisible = true;
      this.form = data;
    },
    async deleteItem(data) {
      let params = {
        id: data.id
      };
      this.$confirm("确定删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let res = await deleteETLListRequest(params);
          if (res.status) {
            this.$message.info("删除成功");
            if (this.list.length === 1 && this.page !== 1) {
              this.page -= 1;
            }
            this.getList();
          } else {
            this.$message({
              message: res.message,
              type: "error"
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    submit() {
      this.getList();
      this.cancel();
    },
    cancel() {
      this.dialogVisible = false;
    }
  }
};
</script>

<style lang="less" scoped>
@vw: 19.2vw;
@vh: 10.8vh;

.resultManager {
  .breadHead {
    display: inline-flex;
    justify-content: space-between;
    align-items: center;
    .filterBox {
      height: 36 / @vh;
      display: inline-flex;
      align-items: center;

      .label {
        font-size: 14 / @vh;
        color: #6f7583;

        &:first-child {
          margin-left: 50 / @vw;
        }
      }

      .inputBox {
        margin: 0 10px;
      }
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
</style>
<style lang="less">
@vw: 19.2vw;
@vh: 10.8vh;

.resultManager {
  .el-table td,
  .el-table th {
    text-align: center;
  }

  .el-pagination {
    float: right;
    margin-top: 20 / @vh;
  }
}

.result-dialog {
  .el-dialog__body {
    padding: 10px 20px;
  }
}
</style>
