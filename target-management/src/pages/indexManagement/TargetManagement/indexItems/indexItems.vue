<template>
  <!-- 指标项管理 -->
  <div class="indexItems">
    <div class="contentBox">
      <div class="leftTreeBox">
        <div class="contentBoxs">
          <div class="titleBox">基础指标体系</div>
          <div class="search">
          </div>
          <div class="treeBox">
            <item-tree
              ref="treeBox"
              :filterText="filterText"
              @changeChooseList="onChooseList"
              :type="type"
            ></item-tree>
          </div>
        </div>
      </div>

      <div class="rightListBox">
        <List
          :dataList="dataList"
          :total="total"
          :value1="value1"
          :page="page"
          :chooseData="chooseData"
          ref="list"
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
  getTaskTreeLists,
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
      value1: "基础指标",
      code: "",
      isShow: false,
      breadList: ["运维管理", "指标管理", "指标项管理"],
      searchText: "",
      filterText: "",
      type: 1,
      query: {
        size: 9,
        current: 1,
        type: 1,
        id: 0
      },
      otherFwList: [],
      dataList: [],
      page: 1,
      total: 0,
      chooseData: {},
      meatDataList: [],
      rightQuery: {
        size: 9,
        page: 1,
        name: ""
      },
      rangetypeList: [
        {
          name: "全域",
          value: "0"
        },
        {
          name: "城区",
          value: "1"
        },
        {
          name: "市域",
          value: "2"
        },
        {
          name: "其它",
          value: "3"
        }
      ],
      chooseUpdList: [
        [0, 0, 0, 0], //基础
        [0, 0, 0, 0], //监测
        [0, 0, 0, 0], //预警
        [0, 0, 0, 0] //评估
      ]
    };
  },
  watch: {},
  mounted() {
    this.meatData();
    this.meatDataUnit();
    this.getFwList();
    // this.getRightListData();
  },

  methods: {
    onChooseList(val) {
      let arr = this.unique(val);
      var index = arr.indexOf(0);
      if (index > -1) {
        arr.splice(index, 1);
      }
      this.value1 = arr.join(">");
      // console.log(this.value1)
    },
    getReset() {
      this.$refs.treeBox.expandedKeys = ["-1"];
    },
    getChangeText() {
      this.$refs.list.search = "";
    },
    async meatData() {
      let params = this.query;
      let res = await getTaskTreeLists(params);
      this.dataList = res.data.itemList.records;
      this.total = res.data.itemList.total;
      this.current = res.data.itemList.current;
      this.dataList.forEach(item => {
        this.rangetypeList.forEach(items => {
          if (item.rangetype === items.value) {
            item.rangetype = items.name;
          }
        });
        if (item.useType) {
          let arr = item.useType.split(",");
          // let newArr = this.unique(arr).sort();
          // let newArr=arr[0]
          // item.useType = arr[0]
          item.useType = arr;
        }

        // item.useType = newArr.toString();
      });
    },
    // 数组去重
    unique(arr) {
      return Array.from(new Set(arr));
    },
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
        if (this.dataList[k].useType) {
          let arr = this.dataList[k].useType.split(",");
          this.dataList[k].useType = arr;
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
    onSearch(e) {
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
    height: 60px;
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
    height: calc(100vh - 128px);
    display: flex;
    .leftTreeBox {
      width: 374 / @vw;
      background-color: #fff;
      padding-right: 15px;
      border-right: solid 1px #edeeef;
      .contentBoxs {
        width: 334 / @vw;
        margin-left: 20 / @vw;
        height: 100%;
        .titleBox {
          height: 66 / @vh;
          width: 100%;
          border-bottom: 1px solid #e8e8e8;
          line-height: 66 / @vh;
          color: #162d7a;
          font-family: MicrosoftYaHei;
          font-weight: bold;
          font-size: 20 / @vh;
          text-align: center;
        }
        .search {
          margin-top: 20 / @vh;
        }
        .treeBox {
          width: 100%;
          height: 75vh;
          // height: 734 / @vh;
          overflow: auto;
        }
      }
    }
    .rightListBox {
      width: 100%;
      background-color: #fff;
      padding-right: 10px;
    }
  }
}
</style>
