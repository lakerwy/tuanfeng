<template>
  <!-- 指标项管理 -->
  <div class="indexItems">
    <div class="contentBox">
      <div class="leftTreeBox">
        <div class="contentBoxs">
          <div class="titleBox">二次开发API</div>
          <div class="treeBox">
            <item-tree></item-tree>
          </div>
        </div>
      </div>

      <div class="rightListBox">
        <List
          :dataList="dataList"
          :queryId="queryId"
          :resultList="resultList"
          :total="total"
          :page="page"
        />
      </div>
    </div>
  </div>
</template>

<script>
import itemTree from "@/components/itemTree/indexApi";
import { getDataLists } from "@/api/px-api";
import List from "./component/list";
export default {
  components: {
    itemTree,
    List
  },
  data() {
    return {
      queryId:1,
      id: 4,
      code: "",
      isShow: false,
      breadList: ["运维管理", "指标管理", "指标项管理"],
      searchText: "",
      resultList: "",
      type: 1,
      query: {
        page: 1,
        serviceName:"",
        size:12,
        id:1
      },
      otherFwList: [],
      dataList: [],
      page: 1,
      total: 0,
      chooseData: {},
      meatDataList: []
    };
  },
  mounted() {
    this.getDataList();
  },
  watch: {
    id(val) {
      this.query.id = val;
      this.getDataList();
    },
    searchText(e){
      this.query.page=1
      this.query.serviceName=e
      this.getDataList();
    }
  },
  methods: {
    async getDataList() {
      let params = this.query;
      let res = await getDataLists(params);
      this.resultList=res
      this.dataList = res.records;
      this.total = res.total;
      this.page = res.pages;
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
      // height: 900 / @vh;
      background-color: #fff;
      padding-right: 15px;
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
          // height: 734 / @vh;
          overflow: auto;
        }
      }
    }
    .rightListBox {
      width: 100%;
      margin-left: 16 / @vw;
      background-color: #fff;
      padding-right: 30px;
    }
  }
}
</style>
