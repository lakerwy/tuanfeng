<template>
  <!-- 行政区指标体系 -->
  <div class="indexItems">
    <div class="topBox">
      <div class="breadcrumbBox">
        <bread-crumb :list="breadList"></bread-crumb>
      </div>
      <!-- <div class="searchBox">
        <div class="inputBox">
          <a-input-search
            placeholder="指标关键字"
            size="large"
            enter-button="搜索"
            @search="onSearch"
            v-model="searchText"
          ></a-input-search>
        </div>
      </div> -->
    </div>
    <div class="contentBox">
      <div class="leftTreeBox">
        <div class="contentBoxs">
          <div class="titleBox">监测指标体系</div>
          <div class="treeBox">
            <item-tree
              :defaultProps="defaultProps"
              :data="treeData1"
            ></item-tree>
          </div>
        </div>
      </div>
      <div class="leftTreeBox">
        <div class="contentBoxs">
          <div class="titleBox">预警指标体系</div>
          <div class="treeBox">
            <item-tree
              :defaultProps="defaultProps"
              :data="treeData2"
            ></item-tree>
          </div>
        </div>
      </div>
      <div class="leftTreeBox">
        <div class="contentBoxs">
          <div class="titleBox">评估指标体系</div>
          <div class="treeBox">
            <item-tree
              :defaultProps="defaultProps"
              :data="treeData3"
            ></item-tree>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import breadCrumb from "@/components/breadCrumb/index";
import itemTree from "@/components/itemTree/index";
import { getTaskTreeLists } from "@/api/management";
export default {
  components: {
    breadCrumb,
    itemTree
  },
  data() {
    return {
      breadList: ["运维管理", "指标体系管理", "行政区指标体系"],
      searchText: "",
      defaultProps: {
        children: "children",
        title: "name",
        key: "id"
      },
      treeData1: [],
      treeData2: [],
      treeData3: [],
      query2: {
        type: 3,
        id: 0
      },
      query1: {
        type: 2,
        id: 0
      },
      query3: {
        type: 4,
        id: 0
      }
    };
  },
  mounted() {
    this.meatData1();
    this.meatData2();
    this.meatData3();
  },
  methods: {
    async meatData1() {
      let params = this.query1;
      let res = await getTaskTreeLists(params);
      let treeList = res.data.tree;
      for (var i in treeList) {
        treeList[i].children = [];
      }
      if (treeList[0].level === 1) {
        this.treeData1 = treeList;
      } else if (treeList[0].level === 2) {
        for (var k in this.treeData1) {
          if (this.query1.id === this.treeData1[k].id) {
            this.treeData1[k].children = treeList;
          }
        }
      } else if (treeList[0].level === 3) {
        for (var m in this.treeData1) {
          for (var n in this.treeData1[m].children) {
            if (this.query1.id === this.treeData1[m].children[n].id) {
              this.treeData1[m].children[n].children = treeList;
            }
          }
        }
      }
    },
    async meatData2() {
      let params = this.query2;
      let res = await getTaskTreeLists(params);
      let treeList = res.data.tree;
      for (var i in treeList) {
        treeList[i].children = [];
      }
      if (treeList[0].level === 1) {
        this.treeData2 = treeList;
      } else if (treeList[0].level === 2) {
        for (var k in this.treeData2) {
          if (this.query2.id === this.treeData2[k].id) {
            this.treeData2[k].children = treeList;
          }
        }
      } else if (treeList[0].level === 3) {
        for (var m in this.treeData2) {
          for (var n in this.treeData2[m].children) {
            if (this.query2.id === this.treeData2[m].children[n].id) {
              this.treeData2[m].children[n].children = treeList;
            }
          }
        }
      }
    },
    async meatData3() {
      let params = this.query3;
      let res = await getTaskTreeLists(params);
      let treeList = res.data.tree;
      for (var i in treeList) {
        treeList[i].children = [];
      }
      if (treeList[0].level === 1) {
        this.treeData3 = treeList;
      } else if (treeList[0].level === 2) {
        for (var k in this.treeData3) {
          if (this.query3.id === this.treeData3[k].id) {
            this.treeData3[k].children = treeList;
          }
        }
      } else if (treeList[0].level === 3) {
        for (var m in this.treeData3) {
          for (var n in this.treeData3[m].children) {
            if (this.query3.id === this.treeData3[m].children[n].id) {
              this.treeData3[m].children[n].children = treeList;
            }
          }
        }
      }
    },
    choosenTree(id) {
      console.log(id);
      this.query1.id = id;
      this.meatData1();
      this.query2.id = id;
      this.meatData2();
      this.query3.id = id;
      this.meatData3();
    },
    onSearch(value) {
      console.log(value);
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
    justify-content: space-between;
    .leftTreeBox {
      width: 610 / @vw;
      height: 830 / @vh;
      background-color: #fff;
      .contentBoxs {
        width: 570 / @vw;
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
        .treeBox {
          width: 100%;
          margin-top: 20 / @vh;
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
