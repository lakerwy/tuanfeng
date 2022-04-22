<template>
  <div class="manager resultManager">
    <div class="head breadHead">
      <div class="filterBox">
        <div class="label">区划:</div>
        <div class="inputBox">
          <el-select v-model="searchForm.adcode" clearable placeholder="请选择">
            <el-option
              v-for="item in regionOptions"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>
        </div>
        <div class="label">类型:</div>
        <div class="inputBox">
          <el-select
            v-model="searchForm.beartype"
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="item in typeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class="label">年份:</div>
        <div class="inputBox">
          <el-date-picker
            v-model="searchForm.year"
            type="year"
            placeholder="选择年"
          >
          </el-date-picker>
        </div>
        <div class="buttons reset" @click="search">搜索</div>
        <div class="buttons search" @click="reset" style="background: #397DC9">重置</div>
      </div>
      <div class="buttons add" @click="add" style="background: #397DC9">新增</div>
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
          <el-table-column prop="qhname" label="区划名称"></el-table-column>
          <el-table-column
            prop="type"
            label="类型"
            :formatter="formatterType"
          ></el-table-column>
          <el-table-column prop="year" label="年份">
            <template slot-scope="scope">
              <div>{{ scope.row.year | yearFormat }}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="modelname"
            label="模型"
            :show-overflow-tooltip="true"
            min-width="100"
          ></el-table-column>
          <el-table-column
            prop="warningStatus"
            label="预警状态"
            :formatter="formatterWarningStatus"
          ></el-table-column>
          <el-table-column
            prop="overloadStatus"
            label="超载情况"
            :formatter="formatterOverloadStatus"
          ></el-table-column>
          <el-table-column prop="updateTime" label="更新时间">
            <template slot-scope="scope">
              <div>{{ scope.row.updateTime | dataFormat }}</div>
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
      :title="form ? '模型结果编辑': '模型结果新增'"
      v-if="dialogVisible"
      :visible.sync="dialogVisible"
      width="40%"
      custom-class="result-dialog"
    >
      <formCom
        :data="form"
        :region="regionOptions"
        @submit="submit"
        @cancel="cancel"
      ></formCom>
    </el-dialog>
  </div>
</template>

<script>
import {
  getModelResultListRequest,
  deleteModelResultInfoRequest,
  addModelResultInfoRequest,
  updateModelResultInfoRequest
} from "../../api/modelResultApi";
import { getRegions } from "../../utils/city";
import formCom from "./form";
import { typeList, warningStatusList, overloadStatusList } from "./type";

export default {
  components: {
    formCom
  },
  data() {
    return {
      dialogVisible: false,
      searchForm: {
        adcode: "",
        beartype: "",
        year: ""
      },
      size: 10,
      page: 1,
      total: 0,
      tableData: [],
      regionOptions: [],
      typeList: typeList,
      warningStatusList: warningStatusList,
      overloadStatusList: overloadStatusList,
      form: null
    };
  },
  mounted() {
    this.initRegion();

    this.getList();
  },
  filters: {
    dataFormat: function(value) {
      if (value) {
        return value.substr(0, 19).replace("T", " ");
      }
      return null;
    },
    yearFormat: function(value) {
      if (value) {
        return value.substr(0, 4);
      }
      return null;
    }
  },
  methods: {
    async initRegion() {
      // 加载行政区划列表
      let districts = window.globalUrl.districts;
      let town = await getRegions(districts.town.url, districts.town.id);
      let country = await getRegions(districts.county.url, districts.county.id);
      this.regionOptions = country.concat(town);
    },
    async getList() {
      var params = this.searchForm;
      params.page = this.page;
      params.size = this.size;
      var res = await getModelResultListRequest(params);
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
        if (row.type == this.typeList[i].value) {
          return this.typeList[i].label;
        }
      }
    },
    formatterWarningStatus(row, column) {
      for (var i in this.warningStatusList) {
        if (row.warningStatus == this.warningStatusList[i].value) {
          return this.warningStatusList[i].label;
        }
      }
    },
    formatterOverloadStatus(row, column) {
      for (var i in this.overloadStatusList) {
        if (row.overloadStatus == this.overloadStatusList[i].value) {
          return this.overloadStatusList[i].label;
        }
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
        adcode: "",
        beartype: "",
        year: ""
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
        data: data.id,
        type: data.type
      };
      this.$confirm("确定删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let res = await deleteModelResultInfoRequest(params);
          if (res.code == 200) {
            this.$message.info("删除成功");
            if (this.tableData.length === 1 && this.page !== 1) {
              this.page -= 1;
            }
            this.getList();
          } else {
            this.$message({
              message: res.msg,
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
    async submit(form) {
      let params = {
        data: form,
        type: form.type
      };
      let res = null;
      if (form.id) {
        res = await updateModelResultInfoRequest(params);
      } else {
        res = await addModelResultInfoRequest(params);
      }
      if (res.code == 200) {
        this.$message.info("提交成功");
        this.getList();
        this.cancel();
      } else {
        this.$message({
          message: res.msg,
          type: "error"
        });
      }
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
