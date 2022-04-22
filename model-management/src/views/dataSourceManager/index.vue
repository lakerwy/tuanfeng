<template>
  <div class="manager dataSource">
    <div class="head breadHead">
      <div class="filterBox">
        <div class="label">连接名称:</div>
        <div class="inputBox">
          <el-input
            placeholder="请输入内容"
            size="small"
            v-model="searchForm.connname"
          ></el-input>
        </div>
        <div class="label">数据库类型:</div>
        <div class="inputBox">
          <el-select v-model="searchForm.conntype" placeholder="请选择">
            <el-option
              v-for="item in typeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <!-- <el-input placeholder="请输入内容" size="small" v-model="searchForm.link"></el-input> -->
        </div>
        <div class="buttons reset" @click="reset">重置</div>
        <div class="buttons search" @click="search">搜索</div>
        <div class="buttons add" @click="add">新增</div>
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
          <el-table-column prop="connname" label="连接名称"></el-table-column>
          <el-table-column
            :formatter="formatterType"
            prop="conntype"
            label="数据库类型"
          ></el-table-column>
          <el-table-column prop="port" label="连接端口"></el-table-column>
          <el-table-column prop="serverip" label="服务器"></el-table-column>
          <el-table-column prop="dbname" label="数据库名"></el-table-column>
          <el-table-column prop="username" label="用户名"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                @click="handleClickTest(scope.row)"
                type="text"
                size="small"
                >测试</el-button
              >
              <el-button
                @click="handleClickDelete(scope.row)"
                type="text"
                size="small"
                >删除</el-button
              >
              <el-button
                @click="handleClickEdit(scope.row)"
                type="text"
                size="small"
                >编辑</el-button
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
    <el-drawer
      :visible.sync="showDrawer"
      size="30%"
      :wrapperClosable="false"
      ref="drawer"
    >
      <div class="formBox">
        <el-form :model="form" label-width="100px" label-position="left">
          <el-form-item label="连接名称:">
            <el-input v-model="form.connname" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="数据库类型:">
            <el-select
              v-model="form.conntype"
              placeholder="请选择"
              style="width: 100%;"
            >
              <el-option
                v-for="item in typeList2"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="连接端口:">
            <el-input v-model="form.port" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="服务器:">
            <el-input v-model="form.serverip" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="用户名:">
            <el-input v-model="form.username" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="数据库名:">
            <el-input v-model="form.dbname" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="数据库密码:">
            <el-input v-model="form.password" placeholder="请输入"></el-input>
          </el-form-item>
        </el-form>
        <div class="buttonBox">
          <el-button @click="cancelForm" size="medium" style="width: 40%;"
            >取 消</el-button
          >
          <el-button
            type="primary"
            size="medium"
            style="width: 40%;"
            @click="submit"
            :loading="loading"
            >{{ loading ? "提交中 ..." : "确 定" }}</el-button
          >
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import qs from "qs";
import {
  getDataSourceLists,
  testDataSource,
  addDataSource,
  delDataSource,
  editDataSource
} from "../../api/api.js";
export default {
  data() {
    return {
      loading: false,
      showDrawer: false,
      drawerTitle: "新增",
      size: 10,
      page: 1,
      total: 0,
      form: {},
      searchForm: {
        connname: "",
        conntype: ""
      },
      tableData: [],
      typeList: [
        {
          label: "全部",
          value: null
        },
        {
          label: "Oracle",
          value: "1"
        },
        {
          label: "MySQL",
          value: "2"
        },
        {
          label: "PostgreSQL",
          value: "3"
        }
      ],
      typeList2: [
        {
          label: "Oracle",
          value: "1"
        },
        {
          label: "MySQL",
          value: "2"
        },
        {
          label: "PostgreSQL",
          value: "3"
        }
      ],
      type: ""
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
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
    add() {
      this.type = "新增";
      this.showDrawer = true;
    },
    async submit() {
      this.loading = true;
      var params = this.form;
      params = qs.stringify(this.form);

      if (this.type == "新增") {
        var res = await addDataSource(params);
        if (res.code == 200) {
          this.$message({
            message: "新增成功",
            type: "success"
          });
          this.loading = false;
        } else {
          this.$message({
            message: res.msg,
            type: "error"
          });
        }
      } else {
        var res = await editDataSource(params);
        if (res.code == 200) {
          this.$message({
            message: "编辑成功",
            type: "success"
          });
          this.loading = false;
        } else {
          this.$message({
            message: res.msg,
            type: "error"
          });
        }
      }

      this.cancelForm();
      this.page = 1;
      this.getList();
    },
    cancelForm() {
      this.form = {};
      this.showDrawer = false;
    },
    async getList() {
      var params = this.searchForm;
      params.page = this.page;
      params.size = this.size;
      for (var i in params) {
        if (params[i] == "") {
          delete params[i];
        }
      }
      var res = await getDataSourceLists(params);
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
    search() {
      this.page = 1;
      this.getList();
    },
    reset() {
      this.page = 1;
      (this.searchForm = {
        connname: "",
        conntype: ""
      }),
        this.getList();
    },
    formatterType(row, column) {
      for (var i in this.typeList) {
        if (row.conntype == this.typeList[i].value) {
          return this.typeList[i].label;
        }
      }
    },
    async handleClickTest(row) {
      let res = await testDataSource(row.id);
      if (res.code == 200) {
        this.$message({
          message: res.data,
          type: "success"
        });
      } else {
        this.$message({
          message: res.msg,
          type: "error"
        });
      }
    },
    async handleClickDelete(row) {
      var res = await delDataSource(row.id);
      if (res.code == 200) {
        this.$message({
          message: "删除成功",
          type: "success"
        });
      } else {
        this.$message({
          message: res.msg,
          type: "error"
        });
      }
      this.getList();
    },
    async handleClickEdit(row) {
      this.type = "编辑";
      for (var key in row) {
        if (row[key] == null) {
          delete row[key];
        }
      }
      this.form = row;
      this.showDrawer = true;
    }
  }
};
</script>

<style lang="less" scoped>
@vw: 19.2vw;
@vh: 10.8vh;
.dataSource {
  .breadHead {
    .filterBox {
      height: 36 / @vh;

      .label {
        height: 36 / @vh;
        width: 100 / @vw;
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

  .formBox {
    width: 80%;
    margin-left: 10%;
    .buttonBox {
      width: 100%;
    }
  }
}
</style>
<style lang="less">
@vw: 19.2vw;
@vh: 10.8vh;

.dataSource {
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
