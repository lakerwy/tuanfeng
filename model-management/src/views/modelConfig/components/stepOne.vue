<template>
  <div class="step">
    <div class="configContainer">
      <div class="header">
        <div class="saveBut" @click="save">保存</div>
        <div class="title">步骤一：选择评价区域</div>
      </div>
      <div class="content">
        <div class="areaTitle">区域选择</div>
        <div class="areaSelectBox">
          <el-select v-model="area.levelOne" @change="changeLevelOne">
            <el-option
              v-for="item in levelOneList"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>
          <el-select v-model="area.levelTwo">
            <el-option
              v-for="item in levelTwoList"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>
        </div>
        <div class="areaTitle">计算年份</div>
        <div class="areaSelectBox">
          <el-date-picker v-model="year" type="year" placeholder="选择年">
          </el-date-picker>
        </div>
        <div class="areaTitle">
          数据选择（参与计算的数据年份）<span @click="showDialog">配置</span>
        </div>
        <template v-if="dataSource">
          <div class="dataBox" v-for="(item, index) in dataSource" :key="index">
            <div class="operate">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="deleteDataSource(index)"
              ></el-button>
            </div>
            <div class="label">{{ item.name }}</div>
            <div class="yearBox" v-if="item.children">
              <el-tag
                v-for="(tag, i) in item.children"
                :key="i"
                closable
                @close="deleteYearEvent(i, index)"
              >
                {{ tag.year }}
              </el-tag>
            </div>
          </div>
        </template>
        <div class="areaTitle">评价单元</div>
        <div class="accuracyBox">
          <div class="label">栅格精度：</div>
          <div class="chooseItem">
            <div
              :class="rastercell == item ? 'items itemsC' : 'items'"
              @click="chooseAcc(item)"
              v-for="(item, index) in accuracyList"
              :key="index"
            >
              {{ item }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <dataSourceDialog
      ref="dataSourceDialog"
      :data="dataSource"
    ></dataSourceDialog>
  </div>
</template>

<script>
import { getCounty, getTown } from "@/utils/city";
import dataSourceDialog from "./dataSourceDialog";
import { getGroupByList } from "@/utils/listUtil";
import { saveModelStepFirstRequest } from "@/api/modelConfigApi";

export default {
  components: {
    dataSourceDialog
  },
  data() {
    return {
      levelOneList: [],
      levelTwoList: [],
      area: {
        levelOne: null,
        levelTwo: null
      },
      year: new Date(),
      accuracyList: [10, 20, 30, 40, 50],
      rastercell: 10,
      radioOne: 3,
      form: null,
      dataSource: null
    };
  },
  mounted() {
    this.getCounty();
  },
  methods: {
    init(data) {
      if (!data) {
        this.form = null;
        this.dataSource = null;
        return;
      }

      this.form = data.modelInarea;

      this.dataSource = getGroupByList(data.spjInput, "igroup", "igname");
    },
    async getCounty() {
      this.levelOneList = await getCounty();
      // 配置默认值
      if (this.levelOneList && this.levelOneList.length > 0) {
        let code = this.levelOneList[0].code;
        this.area.levelOne = code;
        await this.changeLevelOne(code);
        if (this.levelTwoList.length > 0) {
          this.area.levelTwo = this.levelTwoList[0].code;
        }
      }
    },
    async changeLevelOne(value) {
      this.area.levelTwo = null;
      this.levelTwoList = await getTown(value);
    },
    showDialog() {
      this.$refs.dataSourceDialog.changeVisible();
    },
    deleteYearEvent(i, index) {
      if (this.dataSource) {
        this.dataSource[index].children.splice(i, 1);
        if (this.dataSource[index].children.length === 0) {
          this.dataSource.splice(index, 1);
        }
      }
    },
    deleteDataSource(index) {
      // this.$confirm("确定删除吗?", "提示", {
      //   confirmButtonText: "确定",
      //   cancelButtonText: "取消",
      //   type: "warning"
      // }).then(() => {
      if (this.dataSource) {
        this.dataSource.splice(index, 1);
      }
      // });
    },
    chooseAcc(item) {
      this.rastercell = item;
    },
    async save() {
      if (!this.form) {
        this.$message({
          message: "请选择左侧模型",
          type: "warning"
        });
      } else {
        let list = [];
        this.dataSource.map(x => {
          if (x.children) {
            list = list.concat(x.children);
          }
        });
        let data = {
          modelInarea: {
            id: this.form.id,
            modelid: this.form.modelid,
            year: this.year.getFullYear(),
            dataresid: this.form.dataresid,
            adCode: this.area.levelTwo || this.area.levelOne || "421121", // 默认团风县
            rastercell: this.rastercell
          },
          spjInputList: list
        };
        let res = await saveModelStepFirstRequest(data);

        if (res.code === 200) {
          this.$message("保存成功！");
          this.$emit("next");
        } else {
          this.$message(res.msg);
        }
      }
    }
  }
};
</script>

<style lang="less" scoped>
@vw: 19.2vw;
@vh: 10.8vh;

.dataBox {
  margin-top: 10 / @vh;
  display: grid;
  grid-template-columns: 40 / @vw auto 1fr;
  grid-column-gap: 10 / @vw;
  align-items: center;
  .operate {
  }
  .label {
    font-size: 14px;
    color: #6f7583;
  }
  .yearBox {
    .el-tag {
      & + .el-tag {
        margin-left: 10 / @vw;
      }
    }
  }
}

.accuracyBox {
  height: 26 / @vh;
  .label {
    float: left;
    line-height: 26 / @vh;
    font-size: 14px;
    color: #6f7583;
    text-align: left;
    width: 100 / @vw;
  }
  .chooseItem {
    float: left;
    width: 330 / @vw;
    height: 26 / @vh;
    display: flex;
    justify-content: space-between;
    .items {
      width: 55 / @vw;
      height: 26 / @vh;
      box-sizing: border-box;
      border: 1px solid #dddddd;
      text-align: center;
      line-height: 26 / @vh;
      font-size: 14px;
      color: #454954;
      cursor: pointer;
      transition: all 0.25s;
    }
    .itemsC {
      border: 0;
      background-color: #1890ff;
      color: #fff;
    }
  }
}
</style>
