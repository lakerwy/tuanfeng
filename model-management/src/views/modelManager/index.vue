<template>
  <div class="manager modelManager">
    <div class="breadHead">
      <div class="navBox">
        <div
          :class="navId == 1 ? 'navItem navItemC' : 'navItem'"
          @click="changeItem(1)"
        >
          双评价模型
        </div>
        <div
          :class="navId == 2 ? 'navItem navItemC' : 'navItem'"
          @click="changeItem(2)"
        >
          编审监一体化模型
        </div>
        <div
          :class="navId == 3 ? 'navItem navItemC' : 'navItem'"
          @click="changeItem(3)"
        >
          评估指标模型
        </div>
      </div>
      <div class="navBtn">
        <el-button type="primary" @click="showAddModelDialogVisible">
          新增
        </el-button>
        <el-button type="danger" @click="deleteModel">删除</el-button>
      </div>
    </div>
    <div class="container tableContainer">
      <el-scrollbar style="height: 100%">
        <div class="content">
          <div
            class="listsBox"
            v-for="(item, index) in itemList"
            :key="index"
            @click="selectEvent(item)"
            :class="{ active: selectItemId.includes(item.id) }"
          >
            <div class="imgBox"></div>
            <div class="textBox">
              <el-tooltip
                class="item"
                effect="dark"
                :content="item.modername"
                placement="top"
              >
                <p class="title">{{ item.modername }}</p>
              </el-tooltip>
              <P>{{ item.updatetime ? item.updatetime.slice(0, 10) : null }}</P>
              <el-tooltip
                class="item"
                effect="dark"
                :content="item.moderndesc"
                placement="top"
              >
                <P class="desc">{{ item.moderndesc }}</P>
              </el-tooltip>
            </div>
            <div class="btnBox">
              <div class="infoBut" @click.stop="toEdit(item)">编辑</div>
              <div class="infoBut" @click.stop="toDetail(item)">构建</div>
              <!--<div class="infoBut" @click.stop="toConfig(item)">配置</div>-->
              <div class="infoBut" @click.stop="toExe(item)">执行</div>
            </div>
          </div>
        </div>
      </el-scrollbar>
    </div>

    <el-dialog
      :title="form ? '模型编辑': '模型新增'"
      v-if="addModelDialogVisible"
      :visible.sync="addModelDialogVisible"
      width="30%"
    >
      <addModelForm
        ref="addmodelForm"
        :data="form"
        @change="modelChangeEvent"
      ></addModelForm>
    </el-dialog>
  </div>
</template>

<script>
import qs from "qs";
import { getModelLists } from "@/api/api.js";
import addModelForm from "./addModelForm";
import {
  deleteBatchModelRequest,
  exeModelRequest
} from "@/api/modelManagerApi";

export default {
  components: { addModelForm },
  data() {
    return {
      navId: 1,
      itemList: [],
      addModelDialogVisible: false,
      selectItemId: [],
      form:null,
    };
  },
  mounted() {
    this.getData(this.navId);
  },
  methods: {
    changeItem(val) {
      this.navId = val;
      this.getData(val);
    },
    selectEvent(item) {
      let id = item.id;
      let index = this.selectItemId.indexOf(id);
      if (index === -1) {
        this.selectItemId.push(id);
      } else {
        this.selectItemId.splice(index, 1);
      }
    },
    toEdit(item) {
      this.showAddModelDialogVisible();
      this.form = item;
    },
    toDetail(val) {
      this.$router.push({ name: "modelBuilding", params: { model: val } });
    },
    toConfig(val) {
      this.$router.push({ name: "modelConfig", params: { model: val } });
    },
    toExe(val) {
      let params = {
        modelId: val.id,
        nd: new Date().getFullYear(),
        unit: "m",
        userId: null,
        xzqDm: "0000",
        xzqName: "模型测试",
        zbbh: null
      };
      exeModelRequest(params);
      this.$message.success("任务已启动");
    },
    showAddModelDialogVisible() {
      this.addModelDialogVisible = true;
      this.form = null;
    },
    modelChangeEvent() {
      this.addModelDialogVisible = !this.addModelDialogVisible;
      this.getData(this.navId);
    },
    deleteModel() {
      if (this.selectItemId.length === 0) {
        this.$message.error("请选择模型项！");
        return;
      }

      this.$confirm("确定删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let res = await deleteBatchModelRequest(this.selectItemId);
          if (res.code == 200) {
            this.selectItemId = [];
            this.getData(this.navId);

            this.$message({
              type: "success",
              message: "删除成功!"
            });
          } else {
            this.$message.erro(res.msg);
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    async getData(val) {
      var params = {
        modetype: val
      };
      params = qs.stringify(params);
      var res = await getModelLists(params);
      if (res.code == 200) {
        this.itemList = res.data;
      }
    }
  }
};
</script>

<style lang="less" scoped="scoped">
@vw: 19.2vw;
@vh: 10.8vh;
.modelManager {
  .breadHead {
    width: 100%;
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    .navBox {
      height: 56 / @vh;
      margin-left: 50 / @vw;
      .navItem {
        float: left;
        line-height: 56 / @vh;
        text-align: center;
        padding: 0 10 / @vw;
        margin: 0 20 / @vw;
        font-size: 16 / @vh;
        color: #454954;
        cursor: pointer;
        box-sizing: border-box;
        // transition: all 0.25s;
      }
      .navItemC {
        color: #1890ff;
        box-sizing: border-box;
        border-bottom: 2px solid #1890ff;
      }
    }
    .navBtn {
      margin-right: 30 / @vw;
      align-self: center;
    }
  }

  .tableContainer {
    padding: 10 / @vh 10 / @vw;

    .content {
      overflow: auto;
      display: flex;
      flex-wrap: wrap;
      .listsBox {
        box-sizing: border-box;
        border: solid 1px #dddddd;
        width: 440 / @vw;
        height: 190 / @vh;
        margin: 10 / @vh 10 / @vw;
        position: relative;
        display: grid;
        grid-template-columns: 114 / @vw 1fr 68 / @vw;
        padding: 16 / @vh 10 / @vw;
        &.active {
          border: 1px solid #ff0000;
        }
        .btnBox {
          .infoBut {
            height: 34 / @vh;
            border-radius: 17 / @vh;
            border: solid 1px #1890ff;
            line-height: 34 / @vh;
            color: #1890ff;
            font-size: 14 / @vh;
            box-sizing: border-box;
            cursor: pointer;
            text-align: center;
          }
          .infoBut + .infoBut {
            margin-top: 5 / @vh;
          }
        }

        .imgBox {
          background: url(../../assets/imgs/modelImg.png) no-repeat;
        }
        .textBox {
          margin-left: 20 / @vw;
          .title {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          p {
            text-align: left;
            &:nth-child(1) {
              font-size: 18 / @vh;
              color: #454954;
              font-weight: bold;
              width: 200 / @vw;
            }
            &:nth-child(2) {
              font-size: 12 / @vh;
              color: #6f7583;
              padding-top: 16 / @vh;
            }
            &:nth-child(3) {
              font-size: 14 / @vh;
              color: #454954;
              line-height: 1.8;
              padding-top: 16 / @vh;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 3;
              overflow: hidden;
              word-break: break-all;
              text-overflow: ellipsis;
            }
          }
        }
      }
    }
  }
}
</style>
<style lang="less">
.modelManager {
  .el-scrollbar__wrap {
    overflow-x: hidden;
  }
}
</style>
