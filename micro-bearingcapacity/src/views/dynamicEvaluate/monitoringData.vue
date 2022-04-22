<!--
 * @Author: 任继民
 * @Date: 2020-12-01 13:44:37
 * @LastEditors: 任继民
 * @LastEditTime: 2020-12-01 19:03:09
 * @Description:
-->
<template>
  <div class="monitor-data">
    <breadcrumbs />
    <div class="content">
      <section class="left-tree">
        <div class="text-title">
          <div @click="listTab(index)" v-for="(item,index) in dataListTab" :key="item.id" :class="{'activeIds': currnetIds === index}">{{item.name}}</div>
        </div>
        <DataTree :defaultProps="defaultProps" :data="treeData"/>
      </section>
      <section class="right-table">
        <a-table :columns="columns" :data-source="data" bordered>
          <template slot="action">
            <a href="">结果</a>
            <a href="">报告</a>
          </template>
        </a-table>
      </section>
    </div>
  </div>
</template>
<script>
import breadcrumbs from '@/components/breadcrumbs/index.vue';
import DataTree from './components/tree.vue';
const columns = [
  {
    title: '获取时间',
    dataIndex: 'areaType',
  },
  {
    title: '数据年份',
    className: 'column-money',
    dataIndex: 'area',
  },
  {
    title: '行政区',
    className: 'column-money',
    dataIndex: 'quest',
  },
  {
    title: '监测指标',
    className: 'column-money',
    dataIndex: 'status',
  },
  {
    title: '指标值',
    className: 'column-money',
    dataIndex: 'time',
  },
  {
    title: '单位',
    className: 'column-money',
    dataIndex: 'money',
  },
  {
    title: '数据来源',
    className: 'column-money',
    dataIndex: 'money',
  },
  {
    title: '被调用模型',
    className: 'column-money',
    dataIndex: 'money',
  }
];

const data = [
  {
    key: '1',
    areaType: '行政区',
    area: '团风县',
    quest: '城镇建设承载预警',
    status:'重警',
    name: 'John Brown',
    money: '￥300,000.00',
    time : '2020-11-30 14:14:14',
    address: 'New York No. 1 Lake Park',
  },
  {
    key: '2',
    areaType: '行政区',
    area: '杜皮乡',
    quest: '城镇建设承载预警',
    status:'重警',
    name: 'Jim Green',
    money: '￥1,256,000.00',
    time : '2020-11-30 14:14:14',
    address: 'London No. 1 Lake Park',
  },
  {
    key: '3',
    areaType: '行政区',
    area: '淋山河镇',
    quest: '城镇建设承载预警',
    status:'重警',
    name: 'Joe Black',
    money: '￥120,000.00',
    time : '2020-11-30 14:14:14',
    address: 'Sidney No. 1 Lake Park',
  },
];
export default {
  components: {
    breadcrumbs,
    DataTree
  },
  data: () =>({
    data,
    columns,
    dataListTab:[
      {id: '1', name:'部门监测数据'},
      {id: '2', name:'区域监测数据'}
    ],
    currnetIds: 0,
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
  created() {

  },
  methods: {
    listTab(index) {
      this.currnetIds = index;
      // TODO 切换树形数据
    }
  },
}
</script>
<style lang="scss" scoped>
.monitor-data{
  .content {
    display: flex;
    justify-content: flex-start;
    margin: 16px 16px 0;
    .left-tree{
      width: 342px;
      background-color: #ffffff;
      .text-title{
        display: flex;
        align-items: center;
        border-bottom: 1px solid #e5e5e5;
        margin-bottom: 27px;
        div {
          cursor: pointer;
          padding: 15px 0;
          margin: 0 40px;
          border-bottom: 2px solid #ffffff;
        }
        div:hover,.activeIds {
          border-bottom: 2px solid #1890ff;
        }
      }
      .itemTree {
        padding: 0 20px;
      }
    }
    .right-table {
      margin-left: 16px;
      background-color: #ffffff;
      width: calc(100% - 360px);
    }
  }
}
</style>
