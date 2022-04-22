<template>
  <!-- 指标项管理 -->
  <div class="indexItems">
    <div class="topBox">
      <div class="breadcrumbBox">
        <bread-crumb :list="breadList"></bread-crumb>
      </div>
    </div>
    <div class="contentBox">
      <div class="leftTreeBox">
        <div class="contentBoxs">
          <div class="titleBox">基础指标</div>
          <div class="search">
            <a-input-search
              style="margin-bottom: 8px"
              placeholder="Search"
              @change="onChange"
            />
          </div>
          <div class="treeBox">
            <item-tree :filterText="filterText" :type="type"></item-tree>
          </div>
        </div>
      </div>
      <div class="rightListBox">
        <List
          :dataList="dataList"
          :total="total"
          :page="page"
          :chooseData="chooseData"
        />
      </div>
    </div>
    <div v-if="isShow">
      <add-item ref="additem" :chooseData="chooseData" :code="code"></add-item>
    </div>
  </div>
</template>

<script>
import breadCrumb from "@/components/breadCrumb/index";
import itemTree from "@/components/itemTree/index";
import List from "./component/list";
import addItem from "./component/addItem";
import {
  getCodeValue,
  getDataDictionaryLists,
  getLatitudeDataLists,
  getSearchTaskTreeLists
} from "@/api/management";
export default {
  components: {
    breadCrumb,
    itemTree,
    List,
    addItem
  },
  data() {
    return {
      code: "",
      isShow: false,
      breadList: ["运维管理", "指标管理", "指标项管理"],
      searchText: "",
      filterText: "",
      type: 1,
      otherFwList: [],
      dataList: [],
      page: 1,
      total: 0,
      chooseData: {},
      meatDataList: [],
      rightQuery: {
        size: 10,
        page: 1,
        name: ""
      },
    };
  },
  mounted() {
    this.meatDataUnit();
    this.getFwList();
    this.getRightListData();
  },

  methods: {
    async getRightListData() {
      let params = this.rightQuery;
      let res = await getSearchTaskTreeLists(params);
      this.dataList = res.data.records;
      this.total = res.data.total;
      this.current = res.data.current;
      for (var k in this.dataList) {
        if (this.dataList[k].rangetype === "0") {
          this.dataList[k].rangetype = "全域";
        } else if (this.dataList[k].rangetype === "1") {
          this.dataList[k].rangetype = "城区";
        } else if (this.dataList[k].rangetype === "2") {
          this.dataList[k].rangetype = "市域";
        } else if (this.dataList[k].rangetype === "3") {
          this.dataList[k].rangetype = "其它";
        }
        if (this.dataList[k].isbreak === "0") {
          this.dataList[k].isbreak = "否";
        } else {
          this.dataList[k].isbreak = "是";
        }
      }
    },
    // 获取指标范围其它项内容
    async getFwList() {
      let params = { size: 100 };
      let res = await getDataDictionaryLists(params);
      // console.log(res.data.records)
      this.otherFwList = res.data.records;
      this.otherFwList.forEach(item => {
        item.key = item.id;
      });
      let Fwlist = JSON.stringify(this.otherFwList);
      sessionStorage.setItem("otherFwList", Fwlist);
    },
    // 获取新增指标项的指标单位数据
    async meatDataUnit() {
      let params = {};
      let res = await getLatitudeDataLists(params);
      this.meatDataList = res.data.records;
      for (var i in this.meatDataList) {
        // 添加Key属性
        this.meatDataList[i].key = this.meatDataList[i].id;
      }
      let latitudeData = JSON.stringify(this.meatDataList);
      sessionStorage.setItem("latitudeData", latitudeData);
    },

    // 获取指标编码
    async getCode() {
      let res = await getCodeValue();
      this.code = res.data;
    },
    onChange(e) {
      this.filterText = e.target.value;
    },
    toAdd() {
      this.isShow = true;
      this.$nextTick(() => {
        this.$refs.additem.initShow(); // 控制modal打开和关闭
        this.getCode();
      });
    }
  }
};
</script>

<style lang="less" scoped>
@vw: 22.2vw;
@vh: 10.8vh;

* {
  box-sizing: border-box;
}

.indexItems {
  width: 100%;
  .topBox {
    width: 100%;
    height: 60 / @vh;
    background-color: #fff;
    padding: 1px;
    overflow: hidden;

    .breadcrumbBox {
      width: 100%;
    }

    .searchBox {
      width: 602 / @vw;
      height: 42 / @vh;
      margin: 0 auto;
      display: flex;
      margin-top: 10 / @vh;
      .inputBox {
        width: 512 / @vw;
        height: 100%;
      }
      .buttonbox {
        width: 90 / @vw;
        height: 100%;
        background-color: #1890ff;
        color: #fff;
        line-height: 42 / @vh;
        text-align: center;
        font-size: 16 / @vh;
        cursor: pointer;
      }
    }
  }
  .contentBox {
    width: 1860 / @vw;
    margin-left: 30 / @vw;
    margin-top: 16 / @vh;
    display: flex;
    .leftTreeBox {
      width: 374 / @vw;
      height: 830 / @vh;
      background-color: #fff;
      .contentBoxs {
        width: 334 / @vw;
        margin-left: 20 / @vw;
        height: 100%;
        .titleBox {
          height: 66 / @vh;
          width: 100%;
          border-bottom: 1px solid #e8e8e8;
          line-height: 66 / @vh;
          color: #454954;
          font-family: MicrosoftYaHei;
          font-weight: bold;
          font-size: 20 / @vh;
        }
        .search {
          margin-top: 20 / @vh;
        }
        .treeBox {
          width: 100%;
          // margin-top: 20 / @vh;
          height: 734 / @vh;
          overflow: auto;
        }
      }
    }
    .rightListBox {
      width: 1470 / @vw;
      height: 830 / @vh;
      margin-left: 16 / @vw;
      background-color: #fff;
    }
  }
}
</style>
