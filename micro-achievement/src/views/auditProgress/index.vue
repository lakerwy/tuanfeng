<template>
  <!-- 成果管理页面 成果审查进度 -->
  <div class="audit-progress">
    <div class="content">
      <div class="btn">
        <div @click="handleClickBtn1">
          <div class="btn1" v-if="isActive">
            <img src="../../assets/imgs/cglb1.png" alt="" />
            <span>成果列表</span>
          </div>
          <div class="btn1-1" v-if="!isActive">
            <img src="../../assets/imgs/cglb.png" alt="" />
            <span>成果列表</span>
          </div>
        </div>
        <div class="btn2" @click="handleClickBtn2" v-if="isActive">
          <div class="btn2-box">
            <img src="../../assets/imgs/bj.png" alt="" />
            <span>进度布局</span>
          </div>
        </div>
        <div class="btn2-2" @click="handleClickBtn22" v-if="!isActive">
          <div class="btn2-box2">
            <img src="../../assets/imgs/bj1.png" alt="" />
            <span>进度布局</span>
          </div>
        </div>
      </div>
      <div v-if="isActive" class="query">
        <el-form
          :model="form"
          :inline="true"
          label-width="100px"
          label-position="left"
        >
          <el-form-item label="行政区级别：">
            <el-select
              clearable
              v-model="form.regionLevel"
              @change="changeRegions"
            >
              <el-option
                v-for="item in levelOption"
                :key="item.name"
                :label="item.name"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="form.regionLevel" label="行政区：">
            <el-select clearable v-model="form.regions">
              <el-option
                v-for="item in regionOptionsName"
                :key="item.name"
                :label="item.name"
                :value="item.adCode"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="审核状态：">
            <el-select clearable v-model="form.approveStatus">
              <el-option
                v-for="item in checkOptions"
                :key="item.name"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-input
              clearable
              v-model="form.keyword"
              placeholder="请输入任务名称关键字查询"
            >
            </el-input>
          </el-form-item>
          <el-button style="margin-left: 20px;" type="primary" @click="querys"
            >查询</el-button
          >
          <el-button style="margin-left: 20px;" @click="handleResets"
            >重置</el-button
          >
          <!-- <el-button type="primary" class="right-btn" @click="showPlanning">
            <span>查看进度布局</span>
          </el-button> -->
        </el-form>
      </div>
    </div>
    <div class="middle" style="margin-top:20px">
      <div class="middle-top">
        <el-menu
          :default-active="planType"
          class="el-menu-demo"
          mode="horizontal"
          @select="handleSelect"
        >
          <el-menu-item
            style="border-right: 1px solid rgb(245, 245, 245);"
            index="0"
            >总体规划</el-menu-item
          >
          <el-menu-item index="1">详细规划</el-menu-item>
        </el-menu>
      </div>
      <div class="middle-radio" v-if="isRadio">
        <el-radio-group @change="handleClickRadio" v-model="radio">
          <el-radio :label="3">村庄规划</el-radio>
          <el-radio :label="2">控制性详细规划</el-radio>
        </el-radio-group>
      </div>
    </div>
    <template v-if="isActive">
      <div class="p-bottom" v-if="total != 0">
        <div class="audit-item" v-for="(item, index) in lists" :key="index">
          <div class="item-title">
            <div class="item-text">{{ regionFormatter(item.region) }}</div>
            <div
              class="approveStatus"
              :class="
                item.approveStatus === 1
                  ? 'success'
                  : item.approveStatus === 2
                  ? 'warning'
                  : 'info'
              "
            ></div>
          </div>
          <div class="item-content">
            <div>
              <p>
                <img src="../../assets/imgs/icon-list.png" alt="" />
                <span>成果名称：</span><span>{{ item.taskName }}</span>
              </p>
              <p>
                <img src="../../assets/imgs/icon-list.png" alt="" />
                <span>组织单位：</span><span>{{ item.orgName }}</span>
              </p>
              <p>
                <img src="../../assets/imgs/icon-list.png" alt="" />
                <span>编制单位：</span><span>{{ item.unitsName }}</span>
              </p>
              <p>
                <img src="../../assets/imgs/icon-list.png" alt="" />
                <span>审查单位：</span
                ><span>{{
                  item.approveUnitName ? item.approveUnitName : "--"
                }}</span>
              </p>
              <p>
                <img src="../../assets/imgs/icon-list.png" alt="" />
                <span>入库时间：</span
                ><span>{{ item.createTime }}</span>
              </p>
            </div>
          </div>
          <div class="planBtn">
            <el-button
              size="small"
              class="plan"
              round
              @click="achievementDetail(item)"
              >规划成果</el-button
            >
            <el-button
              v-if="item.approveStatus != 2"
              size="small"
              class="planDown"
              round
              @click="handleDownLoad(item)"
              >下载成果包</el-button
            >
          </div>
        </div>
      </div>
      <div class="noneData" v-else>暂无数据</div>
    </template>
    <template v-if="!isActive">
      <div class="map-container">
        <my-map :id="'earth'" :vector="vector" />
      </div>
    </template>
  </div>
</template>

<script>
import { getTaskOtherLists, getNodeById } from "../../api/auditTaskOthers.js";
import { getRegions } from "../../js/map/region";
import { dateFormatter } from "../../js/utils/util";
import myMap from "../../components/map/index.vue";
import { getTownVectorLayer } from "../../js/map/util";
import { queryArcGISProperties } from "../../js/map/arcgis";
import { downloadFile } from "@/js/utils/downLoad.js";
export default {
  components: {
    myMap
  },
  data() {
    return {
      query0: {
        pageSize: 100,
        pageIndex: 1,
        taskType: "0",
        isSubmit: 1
      },
      numberId: 0,
      radio: 3,
      isActive: true,
      isRadio: false,
      queryOthers: {
        pageSize: 100,
        pageIndex: 1,
        taskType: 1,
        isSubmit: 1,
        approveStatus: null, //是否通过0未通过1通过2审核中
        levels: null, //规划层级(2：县级;3：市级)
        region: null, //行政区划代码/编号
        taskName: null //任务名称
      },
      form: {},
      regionOptionsName: [],
      planType: "",
      planTypes: [
        { label: "国土空间总体规划", value: 0 },
        { label: "专项规划", value: 1 },
        { label: "详细规划", value: 2 },
        { label: "村庄规划", value: 3 }
      ],
      levelOptions: [
        { name: "县级", value: 0 },
        { name: "市级", value: 1 }
      ],
      levelOption: [
        { name: "县级", value: 2 },
        { name: "市级", value: 3 }
      ],
      planOptions: [
        { name: "县级", value: 0 },
        { name: "乡镇", value: 1 }
      ],
      checkOptions: [
        { name: "通过", value: 1 },
        { name: "不通过", value: 0 },
        { name: "未审查", value: 2 }
      ],
      regionOptions: [],
      townList: [],
      countryList: [],
      lists: [], // 列表数据
      list: [], //地图数据
      currentPage: 1,
      pageSize: 10,
      total: 0,
      vector: null,
      geoJson: null
    };
  },
  created() {
    this.initRegions();
  },
  mounted() {
    if (sessionStorage.getItem("planType")) {
      this.planType = JSON.parse(sessionStorage.getItem("planType"));
      if (this.planType == "1") {
        this.isRadio = true;
        this.radio = JSON.parse(sessionStorage.getItem("planTypeRadio"));
        this.queryOthers.taskType = JSON.parse(
          sessionStorage.getItem("planTypeRadio")
        );
      } else {
        this.queryOthers.taskType = this.planType;
      }
    } else {
      this.planType = "0";
      this.queryOthers.taskType = "0";
    }
    this.getOthersList();
  },
  methods: {
    // 获取地图的展示数据（颜色区块）
    async getOthersList0() {
      let params = this.query0;
      let res = await getTaskOtherLists(params);
      let { records } = res.data.data;
      // console.log(records);
      if (res.data.code === 0) {
        if (records.length > 0) {
          records.map(item => {
            this.list.push({
              code: item.region,
              type: item.approveStatus
            });
          });
          var result = [];
          var obj = {};
          for (var i = 0; i < this.list.length; i++) {
            if (!obj[this.list[i].code]) {
              result.push(this.list[i]);
              obj[this.list[i].code] = true;
            }
          }
          this.list = result;
          // console.log(this.lists, "lists");
        } else {
          this.$message.info("暂无数据！");
        }
        this.initXiangGeoJson();
      }
    },
    // 加载乡镇GeoJSON数据
    async initXiangGeoJson() {
      let res = await queryArcGISProperties(
        window.globalUrl.districts.town.url,
        window.globalUrl.districts.town.id,
        { format: "geojson" }
      );
      this.geoJson = res;
      if (res) {
        this.handleGeoJsonData(this.list);
      }
    },
    // 处理数据 将图层数据与GeoJSON数据匹配
    async handleGeoJsonData(data) {
      this.geoJson.features.forEach(item => {
        item.properties.type = 0;
      });
      this.geoJson.features.forEach(feature => {
        data.forEach(item => {
          if (feature.properties.ad_code === item.code) {
            feature.properties.type = item.type ? item.type : 0;
          } else {
            // feature.properties.type = 0;
          }
        });
      });
      // console.log(this.geoJson, 'geojson')
      this.vector = await getTownVectorLayer(this.geoJson);
    },
    // 点击radio选择
    handleClickRadio(key) {
      // console.log(key)
      sessionStorage.setItem("planTypeRadio", key);
      this.planType = "1";
      if (this.isActive) {
        this.queryOthers.taskType = key;
        this.getOthersList();
      } else {
        this.list = [];
        this.query0.taskType = key;
        this.getOthersList0();
      }
    },
    // 点击成果列表
    handleClickBtn1() {
      this.isActive = true;
      // // console.log(sessionStorage.getItem("planType"))
      // if (sessionStorage.getItem("planType")) {
      //   let code = JSON.parse(sessionStorage.getItem("planType"));
      //   if (code == "1") {
      //     this.queryOthers.taskType = sessionStorage.getItem("planTypeRadio");
      //   }
      // }else{
          //  this.queryOthers.taskType="0"
      //   }
      this.planType="0"
      this.handleSelect("0")
    },
    handleClickBtn2() {
      this.isActive = false;
      // console.log(sessionStorage.getItem("planType"));
      // if (sessionStorage.getItem("planType")) {
      //   let code = JSON.parse(sessionStorage.getItem("planType"));
      //   // console.log(sessionStorage.getItem("planTypeRadio"));
      //   if (code == "1") {
      //     this.query0.taskType = sessionStorage.getItem("planTypeRadio");
      //   }
      // }
      this.planType="0"
      this.handleSelect("0")
    },
    handleClickBtn22() {
      
      this.isActive = false;
      this.planType="0"
      this.handleSelect("0")
    },
    querys() {
      // 查询
      this.getOthersList();
    },
    handleResets() {
      this.form = {};
      this.regionOptionsName = [];
      this.queryOthers.levels = null;
      this.getOthersList();
    },
    // 行政区名称下拉列表
    async getRegionData() {
      let res = await getNodeById(this.pId);
      // console.log(res);
      this.regionOptionsName = res.data.data;
    },
    // 列表
    async getOthersList() {
      this.queryOthers.region = this.form.regions;
      this.queryOthers.taskName = this.form.keyword;
      this.queryOthers.approveStatus = this.form.approveStatus;
      let params = this.queryOthers;
      let res = await getTaskOtherLists(params);
      let { records, total } = res.data.data;
      if (res.data.code === 0) {
        this.lists = records;
        this.total = total;
      }
    },
    // 主页面-选择行政区层级
    changeRegions(val) {
      if (val === 2) {
        this.queryOthers.levels = 3;
        this.pId = "15_0";
        this.getRegionData();
      } else if (val === 3) {
        this.queryOthers.levels = 2;
        this.pId = "0_15";
        this.getRegionData();
      } else {
        this.form.regions = "";
        this.regionOptionsName = [];
      }
    },
    handleSelect(key) {
      if (this.isActive) {
        if (key == "0") {
          this.planType = "0";
          this.isRadio = false;
          this.queryOthers.taskType = "0";
        } else {
          this.planType = "1";
          this.isRadio = true;
          this.queryOthers.taskType = "3";
          sessionStorage.setItem("planTypeRadio", "3");
          this.radio=3
        }
        sessionStorage.setItem("planType", JSON.stringify(key));
        this.getOthersList();
      } else {
        if (key == "0") {
          this.isRadio = false;
          this.list = [];
          this.query0.taskType = "0";
        } else {
          this.isRadio = true;
          this.list = [];
          this.query0.taskType = "3";
          this.radio=3
        }
        this.getOthersList0();
      }
    },
    achievementDetail(data) {
      // console.log(sessionStorage.getItem("planTypeRadio"))
      let code = sessionStorage.getItem("planTypeRadio");
      // console.log(data);
      // 审查任务一棵树
      sessionStorage.setItem("currentTask", JSON.stringify(data));
      if (this.planType === "0") {
        this.$router.push({ name: "taskTree", params: { id: data.id } });
        // } else if (this.planType === 1) {
        //   this.$router.push({ name: "taskTreeSpecial", params: { id: data.id } });
      } else if (this.planType === "1" && code === "2") {
        this.$router.push({ name: "taskTreeDetail", params: { id: data.id } });
      } else if (this.planType === "1" && code === "3") {
        this.$router.push({ name: "taskTreeVillage", params: { id: data.id } });
      }
    },
    showPlanning() {
      // 国土空间规划
      this.$router.push({ name: "planning" });
    },
    async initRegions() {
      // 初始化行政区域列表
      this.townList = await getRegions(
        window.globalUrl.districts.town.url,
        window.globalUrl.districts.town.id
      );
      this.countryList = await getRegions(
        window.globalUrl.districts.county.url,
        window.globalUrl.districts.county.id
      );
    },
    async changeRegionLevel(val) {
      // 切换行政区级别
      if (val === 0) {
        this.regionOptions = this.countryList;
      } else {
        this.regionOptions = this.townList;
      }
    },
    regionFormatter(val) {
      // 行政区格式化
      let regions = this.countryList.concat(this.townList);
      let res = regions.filter(item => {
        return item.code == val;
      });
      return res.length > 0 ? res[0].name : "";
    },
    dateFormatter(val) {
      return dateFormatter(val);
    },
    handleDownLoad(data) {
      // console.log(data);
      downloadFile(data.zipUrl, data.taskName);
    }
  }
};
</script>

<style lang="less" scoped>
// 设置标题栏input选择框的长度样式
/deep/ .el-input--suffix .el-input__inner {
  width: 174px;
}
// 设置表单前面文字的样式
/deep/ .el-form--inline .el-form-item__label {
  display: inline;
}
// 设置选中的样式
/deep/ .el-menu--horizontal > .el-menu-item.is-active {
  border-bottom: 2px solid #409eff;
  color: #409eff;
  font-size: 16px;
}
// 去掉原有的下划线
/deep/ .el-menu.el-menu--horizontal {
  border-bottom: solid 0px #e6e6e6;
}
// 设置未选中的样式
/deep/ .el-menu-item {
  font-size: 16px;
  color: #162d7a;
}
.content {
  height: 68px;
  background: white;
  border-bottom: solid 1px #3e6efa;
  position: relative;
  .btn {
    width: 337px;
    line-height: 66px;
    background: #eef2fc;
    position: relative;
    .btn1 {
      cursor: pointer;
      text-align: left;
      position: relative;
      background: url("../../assets/imgs/bg-btn.png") no-repeat;
      img {
        position: absolute;
        top: 28px;
        left: 35px;
      }
      span {
        margin-left: 66px;
        width: 68px;
        height: 17px;
        font-family: MicrosoftYaHei;
        font-size: 16px;
        font-weight: bold;
        font-stretch: normal;
        letter-spacing: 0px;
        color: #ffffff;
      }
    }
    .btn1-1 {
      cursor: pointer;
      text-align: left;
      position: relative;

      img {
        position: absolute;
        top: 28px;
        left: 35px;
      }
      span {
        margin-left: 66px;
        width: 68px;
        height: 17px;
        font-family: MicrosoftYaHei;
        font-size: 16px;
        font-weight: bold;
        font-stretch: normal;
        letter-spacing: 0px;
        color: #3e6efa;
      }
    }
    .btn2 {
      cursor: pointer;
      position: absolute;
      top: 0;
      left: 204px;
      &-box {
        position: relative;
        img {
          position: absolute;
          top: 25px;
        }
        span {
          margin-left: 30px;
          width: 67px;
          height: 17px;
          font-family: MicrosoftYaHei;
          font-size: 16px;
          font-weight: bold;
          font-stretch: normal;
          letter-spacing: 0px;
          color: #3e6efa;
        }
      }
    }
    .btn2-2 {
      width: 180px;
      cursor: pointer;
      position: absolute;
      top: 0;
      left: 180px;
      background: url("../../assets/imgs/bg-btn.png") no-repeat;
      .btn2-box2 {
        position: relative;

        img {
          position: absolute;
          top: 25px;
        }
        span {
          margin-left: 30px;
          width: 67px;
          height: 17px;
          font-family: MicrosoftYaHei;
          font-size: 16px;
          font-weight: bold;
          font-stretch: normal;
          letter-spacing: 0px;
          color: #fff;
        }
      }
    }
  }
  .query {
    position: absolute;
    top: 15px;
    right: 10px;
  }
}

.middle {
  width: 100%;
  background: #fff;
  padding: 0 10px;
  border-bottom: solid 1px #e6e6e6;
  position: relative;
  &-top {
    width: 20%;
  }
  &-radio {
    position: absolute;
    top: 20px;
    left: 17%;
  }
}

.audit-progress {
  background: #f5f5f5;
  height: 100%;
  .noneData {
    height: 200px;
    line-height: 200px;
    background: #ffffff;
  }
  .p-bottom {
    margin-top: 0;
    padding: 20px;
    display: grid;
    grid-template-columns: repeat(auto-fill, 363px);
    grid-template-rows: 1fr 1fr 1fr 1fr;
    grid-gap: 20px;
    grid-row-gap: 20px;
    max-height: 811px;
    overflow-y: auto;
    .audit-item {
      padding: 0 20px 0 0;
      width: 365px;
      height: 270px;
      background-color: #f9fdfa;
      border: solid 1px #eeeeee;
      position: relative;
      .item-text {
        width: 91px;
        height: 30px;
        background-color: #e5ecff;
        border-radius: 0px 15px 15px 0px;
        text-align: center;
        line-height: 30px;
        color: #3e6efa;
      }
      .item-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 53px;
        .approveStatus {
          margin-top: 20px;
          width: 55px;
          height: 50px;
        }
        .warning {
          background: url("../../assets/imgs/icon-spz.png");
        }
        .success {
          background: url("../../assets/imgs/icon-newPass.png");
        }
        .info {
          background: url("../../assets/imgs/icon-notPass.png");
        }
      }
      .item-content {
        padding: 7px 20px 10px;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        p {
          margin-bottom: 8px;
          img {
            margin-right: 15px;
            vertical-align: middle;
          }
          span:first-child {
            color: #162d7a;
          }
          span:last-child {
            color: #6a7496;
          }
        }
      }
      .planBtn {
        float: right;
        .el-button {
          border: solid 1px #3e6efa;
          color: #3e6efa;
        }
      }
    }
  }
  .map-container {
    background: #ffffff;
    height: calc(100% - 125px);
    position: relative;
  }
}
</style>
