<template>
  <!-- 评估指标体系 -->
  <div class="indexItems">
    <!-- <div class="topBox">
      <div class="breadcrumbBox">
        <bread-crumb :list="breadList"></bread-crumb>
      </div>
    </div> -->
    <div class="contentBox">
      <div class="leftTreeBox">
        <div class="contentBoxs">
          <div class="titleBox">评估指标体系</div>
          <div class="search">
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
          :current="current"
          :chooseData="chooseData"
          :type="type"
        />
      </div>
    </div>
  </div>
</template>

<script>
import breadCrumb from "@/components/breadCrumb/index";
import itemTree from "@/components/itemTree/index";
import List from "../components/list.vue";
import { getTaskTreeLists } from "@/api/management";
export default {
  components: {
    breadCrumb,
    itemTree,
    List
  },
  data() {
    return {
      breadList: ["运维管理", "指标体系管理", "评估指标体系"],
      searchText: "",
      filterText: "",
      defaultProps: {
        children: "children",
        title: "name",
        key: "id"
      },
      treeData: [],
      query: {
        size: 9,
        current: 1,
        type: 4,
        id: 0
      },
      type: 4,
      dataList: [],
      current: 1,
      total: 0,
      chooseData: {},
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
      ]
    };
  },
  mounted() {
    this.meatData();
  },

  methods: {
    async meatData() {
      let params = this.query;
      let res = await getTaskTreeLists(params);
      this.dataList = res.data.itemList.records;
      this.total = res.data.itemList.total;
      // this.current = res.data.itemList.current;
      // console.log(this.current)
      this.dataList.forEach(item => {
        this.rangetypeList.forEach(items => {
          if (item.rangetype === items.value) {
            item.rangetype = items.name;
          }
        });
      });
    },
    choosenTree(id, dataList) {
      this.chooseData = dataList;
      this.query.id = id;
      this.meatData();
    },
    onChange(e) {
      this.filterText = e.target.value;
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
        margin-left: 20 / @vw;height: 100%;
        .titleBox {
          height: 66 / @vh;
          width: 100%;
          border-bottom: 1px solid #e8e8e8;
          line-height: 66 / @vh;
          color: #454954;
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
          height: 734 / @vh;
          overflow: auto;
        }
      }
    }
    .rightListBox {
      width: 100%;
      // margin-right: 16 / @vw;
      background-color: #fff;
      padding-right: 10px;
    }
  }
}
</style>
