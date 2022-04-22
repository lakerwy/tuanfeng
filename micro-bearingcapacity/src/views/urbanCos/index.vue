<!--
 * @Author: 任继民
 * @Date: 2020-11-13 16:55:34
 * @LastEditors: 任继民
 * @LastEditTime: 2020-11-19 16:46:44
 * @Description:
-->
<template>
  <div>
    <breadcrumbs :headHeight='"54px"'/>
    <div class="urbanManage">
      <section class="urbanManage-section">
        <Map :id="'space'" />
        <section class="datatree">
          <section>承载能力监测预警</section>
          <DataTree
            :defaultProps="defaultProps"
            :data="treeData"
          ></DataTree>
        </section>
        <section class="dataChart">
          <Charts />
        </section>
      </section>
    </div>
  </div>
</template>
<script>
import breadcrumbs from '@/components/breadcrumbs/index.vue';
import Map from '@/components/map/index.vue';
import DataTree from './components/tree.vue';
import Charts from './components/chart.vue';
export default {
  components: {
    breadcrumbs,
    Map,
    DataTree,
    Charts
  },
  data: () => ({
    defaultProps: {
      children: 'children',
      title: 'title',
      key: "key"
    },
    treeData: [
      {
        title: '农业生产承载规模',
        key: '1',
        class: 'treeList',
        children: [
          {
            title: '自然资源',
            key: '11',
            children: [
              {
                title: '耕地资源',
                key: '111',
                children: [
                  {
                    title: '耕地保有量',
                    key: '1111',
                  },
                  {
                    title: '高标准农田',
                    key: '1112',
                  },
                  {
                    title: '粮食产量',
                    key: '1113',
                  },
                  {
                    title: '高标准农田面积占比',
                    key: '1114',
                  },
                ]
              },
              {
                title: '矿产资源',
                key: '112',
                children: [
                  {
                    title: 'test',
                    key: '1121',
                  }
                ]
              },
              {
                title: '能源资源',
                key: '113',
                children: [
                  {
                    title: 'test',
                    key: '1131',
                  }
                ]
              },
              {
                title: '水资源',
                key: '114',
                children: [
                  {
                    title: 'test',
                    key: '1141',
                  }
                ]
              },
              {
                title: '森林资源',
                key: '115',
                children: [
                  {
                    title: 'test',
                    key: '1151',
                  }
                ]
              },
              {
                title: '草地资源',
                key: '116',
                children: [
                  {
                    title: 'test',
                    key: '1161',
                  }
                ]
              },
            ]
          },
          {
            title: '生态环境',
            key: '12',
            children: [
              {
                title: 'test',
                key: '121',
              }
            ]
          }
        ]
      },
      {
        title: '城镇建设承载规模',
        key: '2',
        class: 'treeList',
        children: [
          {
            title: '土地资源约束下城镇建设承载规模',
            key: '21',
            children:[
              {
                title: '土地资源约束下城镇建设承载规模',
                key: '21',
              }
            ]
          },
          {
            title: '水资源约束下城镇建设承载规模',
            key: '21',
            children:[
              {
                title: '土地资源约束下城镇建设承载规模',
                key: '21',
              }
            ]
          }
        ]
      }
    ]
  }),
}
</script>
<style lang="scss">
.urbanManage {
  &-section {
    position: relative;
    width: 100%;
    .my-map {
      height: calc(100vh - 180px);
      .containerMap {
        padding: 0 20px;
      }
    }
    .datatree {
      width: 342px;
      height: calc(100vh - 260px);
      background-color: #ffffff;
      box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.25);
      border-radius: 3px;
      position: absolute;
      top: 20px;
      left: 51px;
      section {
        font-size: 16px;
        font-weight: bold;
        color: #454954;
        padding: 24px;
      }
      .itemTree {
        padding-left: 23px;
      }
    }
    .dataChart {
      width: 482px;
      height: calc(100vh - 260px);
      border-radius: 3px;
      position: absolute;
      top: 20px;
      right: 51px;
    }
  }
}
</style>
