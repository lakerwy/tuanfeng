<!--
 * @Author: 任继民
 * @Date: 2020-12-09 16:51:29
 * @LastEditors: 任继民
 * @LastEditTime: 2021-05-18 18:52:25
 * @Description: 左侧栏目
-->
<template>
  <div class="left-side">
    <section class="data-tab">
      <div v-for="(item, index) in menulist" :key="item.id" :class="{tabactive: currIndex===index }" @click="changeTab(index)">{{item.name}}</div>
    </section>
    <section class="list">
      <!--<div
        v-infinite-scroll="handleInfiniteOnLoad"
        class="demo-infinite-container"
        :infinite-scroll-disabled="busy"
        :infinite-scroll-distance="10"
      >-->
        <div class="list-item">
          <section v-for="(item,index) in listData.children" :key="item.id">
            <div class="item" @click="listClick(item,index)" :class="{ listActive: currentListIndex===index }">
              <div>{{item.name}}</div>
              <img :src="currentListIndex===index ? require('../../../assets/images/arrow-down.png'): require('../../../assets/images/arrow-up.png')" alt="" srcset="">
            </div>
            <section v-if="currentListIndex===index">
              <div class="sub-list" v-for="itm in item.children" :key="itm.id" @click="detailData(itm)">
                <div class="a-top-col">
                  <div class="text">{{itm.name}}</div>
                  <div v-if="itm.status ==1" class="warnText">预警</div>
                  <div v-else class="heatText">健康</div>
                </div>
                <div class="num">
                  <span>突破量<i>{{(itm.breakValue || 0).toFixed(2)}}</i>{{itm.unit}}</span>
                </div>
              </div>
            </section>
            <div v-if="loading && !busy" class="demo-loading-container">
              <a-spin />
            </div>
          </section>
        </div>
    </section>
  </div>
</template>
<script>
import infiniteScroll from 'vue-infinite-scroll';
import { RecycleScroller } from 'vue-virtual-scroller';
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';
import { getWarnTree, getIndexByWarnTree } from '@/api/earlyEval';
export default {
  directives: { infiniteScroll },
  components: {
    RecycleScroller,
  },
  data: () => ({
    currIndex: 0,
    currentListIndex: 0,
    menulist: [
      { name: '管控边界', id: '1' },
      { name: '约束性指标', id: '2' },
    ],
    loading: false,
    busy: false,
    searchInfo: {},
    listData: [],
    treedata: []
  }),
  created() {
    // this.initData({})
  },
  methods: {
    async initData(params) {
      let res = await getWarnTree(params);
      this.searchInfo = params;
      const { code, data } = res;
      if (code === 200) {
        this.treedata = this.treeData(data,'0')
        this.listData = this.treedata[0];
        if (this.listData.children[0].children) {
          this.detailData(this.listData.children[0].children[0])
        }else {
          this.$emit('detailData',[], {});
        }
      }
    },
    treeData(data,parentIdValue) {
      let cloneData = JSON.parse(JSON.stringify(data)) // 对源数据深度克隆
      let tree = cloneData.filter(father => { // 循环所有项
        let branchArr = cloneData.filter((child) => {
          return father.id == child.pid // 返回每一项的子级数组
        })
        if (branchArr.length > 0) {
          father.children = branchArr // 如果存在子级，则给父级添加一个children属性，并赋值
        }
        return father.pid == parentIdValue // 返回第一层
      })
      return tree // 返回树形数据
    },
    changeTab(index) {
      this.currIndex = index;
      this.listData = this.treedata[index];
    },
    async listClick(item,index) {
      if (this.currentListIndex === index) {
        this.currentListIndex = -1
      }else {
        this.currentListIndex = index;
      }
    },
    async detailData(item) {
      let params = {
        arcode: this.searchInfo.areaScope,
        kpiid: item.kpiid,
        year: this.searchInfo.year
      };
      let res = await getIndexByWarnTree(params)
      const { code, data } = res;
      if (code === 200) {
        this.$emit('detailData',data, item);
      }
    },
    handleInfiniteOnLoad() {
      this.loading = true;
      if (this.listData.length > 20) {
        this.$message.warning('Infinite List loaded all');
        this.busy = true;
        this.loading = false;
        return;
      }
      setTimeout(() => {
        for (var i = 0, j = 3; i < j; i++) {
          this.listData = this.listData.concat(this.listData)
        }
        this.loading = false
      }, 1000)
    },
  },
}
</script>
<style lang="scss" scoped>
.left-side {
	width: 342px;
	height: 720px;
	background-color: #ffffff;
	box-shadow: 0px 0px 3px 0px
		rgba(0, 0, 0, 0.25);
	border-radius: 3px;
  .data-tab {
    height: 52px;
    line-height: 52px;
    border-bottom: 1px solid #e8e8e8;
    display: flex;
    justify-content: center;
    align-items: center;
    div {
      width: 85px;
      border-bottom: 2px solid rgba(0, 0, 0, 0);
      text-align: center;
      color: #454954;
      font-size: 16px;
      font-weight: bold;
    }
    div:first-child {
      margin-right: 50px;
    }
    div:hover, .tabactive {
      color: #1890ff;
      border-bottom: 2px solid #1890ff;
    }
  }
  .list {
    height: calc(100% - 80px);
    overflow-y: auto;
    margin-top: 15px;
    .list-item {
      .item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 13px 12px 13px 14px;
        margin: 0 12px 14px 16px;
        background-color: #f3f3f3;
        cursor: pointer;
        img {
          cursor: pointer;
        }
      }
      .item:hover, .listActive {
        background-color: #e6f1ff;
      }
      .sub-list {
        border-bottom: 1px dotted #e8e8e8;
        margin: 0 12px 0 16px;
        padding: 0 12px 0 14px;
        .a-top-col{
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0 0;
          .text {
            color: #454954;
            font-size: 14px;
          }
          .ant-btn {
            height: 28px;
            padding: 0 10px;
          }
          .warnText {
            background: #eda169;
            height: 24px;
            min-width: 42px;
            line-height: 24px;
            padding: 0 7px;
            font-size: 14px;
            border-radius: 4px;
            text-align: center;
          }
          .heatText {
            background: #5ec26d;
            height: 24px;
            min-width: 42px;
            line-height: 24px;
            padding: 0 7px;
            font-size: 14px;
            border-radius: 4px;
            text-align: center;
          }
        }
        .num {
          padding: 5px 0 17px;
          color: #9ba0a9;
           i {
            font-family: DINNextW1G;
            font-size: 22px;
            color: #eda169;
           }
        }
      }
    }
  }
  .control {
    height: calc(100% - 60px);
    overflow-y: auto;
    margin-top: 15px;
    .Control-item {
      .sub-list {
        border-bottom: 1px dotted #e8e8e8;
        margin: 0 12px 0 16px;
        padding: 0 12px 0 14px;
        .a-top-col{
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0 0;
          .text {
            color: #454954;
            font-size: 14px;
          }
          .ant-btn {
            height: 28px;
            padding: 0 10px;
          }
        }
        .num {
          padding: 5px 0 17px;
          color: #9ba0a9;
            i {
            font-family: DINNextW1G;
            font-size: 22px;
            color: #eda169;
            }
        }
      }
    }
  }

  .list::-webkit-scrollbar, .control::-webkit-scrollbar {
    /*滚动条整体样式*/
    width : 4px;  /*高宽分别对应横竖滚动条的尺寸*/
    height: 1px;
  }
  .list::-webkit-scrollbar-thumb, .control::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 2px;
    box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);
    background   : #e8e8e8;
  }
  .list::-webkit-scrollbar-track, .control::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    box-shadow   : inset 0 0 5px rgba(68, 68, 68, 0.2);
    border-radius: 10px;
    background   : #ffffff;
  }
}
</style>
