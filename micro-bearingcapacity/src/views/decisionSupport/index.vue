<!--
 * @Author: 任继民
 * @Date: 2020-11-19 16:09:10
 * @LastEditors: 任继民
 * @LastEditTime: 2021-05-11 13:39:26
 * @Description:
-->
<template>
  <div class="des-support">
    <!-- <breadcrumbs :headHeight="'54px'"></breadcrumbs> -->
    <div class="support-content">
      <div class="left-menulist">
        <div class="empty-div"></div>
        <div class="menulist" v-for="(item, index) in menulist" :key="item.id" @click="menuClick(item,index)" :class="currentIndex === index ? 'selectMenu': ''">
          <div class="name-text">
            <span>{{item.name}}</span>
          </div>
          <img :src="currentIndex === index ? require('../../assets/imgs/sel-menu-bg.png'):require('../../assets/imgs/menu-bg.png')" alt="" srcset="">
        </div>
      </div>
      <div class="right-content">
        <QuestList v-if="currentIndex ===0" />
        <SupportList v-else/>
      </div>
    </div>
  </div>
</template>
<script>
import breadcrumbs from '@/components/breadcrumbs/index.vue';
import QuestList from './questionable.vue'
import SupportList from './supportlist.vue'
export default {
  components: {
    breadcrumbs,
    QuestList,
    SupportList
  },
  data: () =>({
    menulist:[
      {id: '1', name: '问题决策', },
      {id: '2', name: '决策列表',}
    ],
    currentIndex: 0,
  }),
  methods: {
    menuClick(item,index) {
      this.currentIndex = index;
    },
  },
}
</script>
<style lang="scss" scoped>
.des-support {
  .support-content{
    height: calc(100vh - 135px);
    display: flex;
    justify-content: flex-start;
    .left-menulist {
      height: 100%;
      width: 34px;
      border-left: 4px solid #1890ff;
      .empty-div {
        height: 34px;
      }
      .menulist {
        position: relative;
        z-index: 1;
        cursor: pointer;
        .name-text {
          position: absolute;
          width: 14px;
          font-size: 14px;
          font-weight: bold;
          top: 28px;
          left: 8px;
          color: #6f7583;
        }
      }
      .menulist:first-child {
        margin-bottom: -8px;
      }
      .selectMenu{
        z-index: 2;
        .name-text {
          color: #ffffff;
        }
      }
    }
    .right-content {
      margin-left: 16px;
      width: calc(100% - 54px);
    }
  }
}
</style>
