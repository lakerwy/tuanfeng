<!--
 * @Author: 任继民
 * @Date: 2020-11-26 19:25:23
 * @LastEditors: 任继民
 * @LastEditTime: 2021-05-07 15:56:33
 * @Description: 问题列表组件
-->
<template>
  <div class="quest-list">
    <section class="list-title">问题列表</section>
    <section>
      <div
        v-infinite-scroll="handleInfiniteOnLoad"
        class="demo-infinite-container"
        :infinite-scroll-disabled="busy"
        :infinite-scroll-distance="10"
      >
        <a-list :data-source="listdata">
          <a-list-item slot="renderItem" slot-scope="item, index" @click="listClick(item,index)"
                       :class="activeIndex == index?'activeClass':''">
            <a-list-item-meta>
              <span slot="title" :href="item.href">{{ item.questionName }}</span>
            </a-list-item-meta>
            <div class="quest-tag">
              <div v-if="item.warningStatus=='1'" class="smallWarnText">轻警</div>
              <div v-else-if="item.warningStatus=='2'" class="warnText">重警</div>
              <div v-else class="heathText">健康</div>
            </div>
          </a-list-item>
          <div v-if="loading && !busy" class="demo-loading-container">
            <a-spin />
          </div>
        </a-list>
      </div>
    </section>
  </div>
</template>
<script>
import infiniteScroll from 'vue-infinite-scroll';
import { getQuestionList } from '@/api/decisionsupport'
export default {
  directives: { infiniteScroll },
  data: ()=>({
    listdata: [],
    loading: false,
    busy: false,
    pageInfo: {
      current: 1,
      pageSize: 10,
      total: 0
    },
    activeIndex: 0,
  }),
  created() {
    this.initData();
  },
  methods: {
    async initData() {
      let res= await getQuestionList();
      const { code, data } = res;
      if (code === 200) {
        this.listdata = data;
        this.listClick(this.listdata[0],0);
      }
    },
    handleInfiniteOnLoad() {
      const data = this.listdata;
      this.loading = true;
      if (data.length > 14) {
        this.busy = true;
        this.loading = false;
        return;
      }
      setTimeout(()=>{
        this.data = this.listdata.concat(this.listdata);
        this.loading = false;
      },200)
    },
    listClick(item, index) {
      this.$emit('questList',item)
      this.activeIndex = index;
    }
  },
}
</script>
<style lang="scss" scoped>
@import url('../../../assets/styles/common.scss');
.quest-list {
	width: 344px;
	height: 100%;
	background-color: #ffffff;
  .list-title {
    height: 44px;
    line-height: 44px;
    border-bottom: 1px solid #e8e8e8;
    color: #454954;
    font-size: 16px;
    padding-left: 20px;
  }
  .demo-infinite-container {
    .ant-list-item{
      cursor: pointer;
      .ant-list-item-meta{
        padding-left: 20px;
      }
      .quest-tag{
        padding-right: 20px;
        .warnText {
          background: #eda169;
          height: 24px;
          min-width: 42px;
          line-height: 24px;
          padding: 0 15px;
          font-size: 14px;
          border-radius: 4px;
          text-align: center;
        }
        .smallWarnText {
          background: #f6d641;
          height: 24px;
          min-width: 42px;
          line-height: 24px;
          padding: 0 15px;
          font-size: 14px;
          border-radius: 4px;
          text-align: center;
        }
        .heathText {
          background: #5ec26d;
          height: 24px;
          min-width: 42px;
          line-height: 24px;
          padding: 0 15px;
          font-size: 14px;
          border-radius: 4px;
          text-align: center;
        }
      }
    }
  }
}
.activeClass {
  background-color: #e4eafb;
  span {
    color: #1890ff;
  }
}
</style>
