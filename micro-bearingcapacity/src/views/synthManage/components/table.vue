<template>
  <a-table :columns="columns" :scroll="{ y: 300 }" :data-source="tableData" bordered :pagination="false">
    <template slot="warningStatus" slot-scope="warningStatus">
      <div v-if="warningStatus==0" class="customText success" >
        <i class="tag"></i>
        <span>健康</span>
      </div>
      <div v-if="warningStatus==1" class="customText info">
        <i class="tag"></i>
        <span>轻警</span>
      </div>
      <div v-else-if="warningStatus==2" class="customText warning" >
        <i class="tag"></i>
        <span>重警</span>
      </div>
    </template>
    <template slot="overloadStatus" slot-scope="overloadStatus">
      <span v-if="overloadStatus==0">不超载</span>
      <span v-else-if="overloadStatus==1">临界超载</span>
      <span v-else>超载</span>
    </template>
    <template slot="farmingStatus" slot-scope="farmingStatus">
      <div v-if="farmingStatus==0" class="customText success" >
        <i class="tag"></i>
        <span>健康</span>
      </div>
      <div v-if="farmingStatus==1" class="customText info">
        <i class="tag"></i>
        <span>轻警</span>
      </div>
      <div v-else-if="farmingStatus==2" class="customText warning" >
        <i class="tag"></i>
        <span>重警</span>
      </div>
    </template>
    <template slot="constructionStatus" slot-scope="constructionStatus">
      <div v-if="constructionStatus==0" class="customText success" >
        <i class="tag"></i>
        <span>健康</span>
      </div>
      <div v-if="constructionStatus==1" class="customText info">
        <i class="tag"></i>
        <span>轻警</span>
      </div>
      <div v-else-if="constructionStatus==2" class="customText warning" >
        <i class="tag"></i>
        <span>重警</span>
      </div>
    </template>
  </a-table>
</template>
<script>
const columns = [
  {
    title: '行政区',
    align: 'center',
    dataIndex: 'qhname',
  },
  {
    title: '预警状态',
    className: 'column-money',
    dataIndex: 'warningStatus',
    align: 'center',
    scopedSlots: { customRender: 'warningStatus' },
  },
  {
    title: '超载情况',
    dataIndex: 'overloadStatus',
    align: 'center',
    scopedSlots: { customRender: 'overloadStatus' },
    className: 'column-money',
  },
  {
    title: '农业生产承载预警状态',
    className: 'column-money',
    dataIndex: 'farmingStatus',
    align: 'center',
    scopedSlots: { customRender: 'farmingStatus' },
  },
  {
    title: '城镇建设承载预警状态',
    align: 'center',
    dataIndex: 'constructionStatus',
    scopedSlots: { customRender: 'constructionStatus' },
  },
];

const data = [
  {
    key: '1',
    name: '团风县',
    name1: '预警',
    name2:'超载',
    name3: '健康',
    name4: '健康'
  },
  {
    key: '1',
    name: '团风县',
    name1: '预警',
    name2:'超载',
    name3: '健康',
    name4: '健康'
  },  {
    key: '1',
    name: '团风县',
    name1: '预警',
    name2:'超载',
    name3: '健康',
    name4: '健康'
  },  {
    key: '1',
    name: '团风县',
    name1: '预警',
    name2:'超载',
    name3: '健康',
    name4: '健康'
  },
  {
    key: '1',
    name: '团风县',
    name1: '预警',
    name2:'超载',
    name3: '健康',
    name4: '健康'
  },  {
    key: '1',
    name: '团风县',
    name1: '预警',
    name2:'超载',
    name3: '健康',
    name4: '健康'
  },  {
    key: '1',
    name: '团风县',
    name1: '预警',
    name2:'超载',
    name3: '健康',
    name4: '健康'
  },
  {
    key: '1',
    name: '团风县',
    name1: '预警',
    name2:'超载',
    name3: '健康',
    name4: '健康'
  },  {
    key: '1',
    name: '团风县',
    name1: '预警',
    name2:'超载',
    name3: '健康',
    name4: '健康'
  },  {
    key: '1',
    name: '团风县',
    name1: '预警',
    name2:'超载',
    name3: '健康',
    name4: '健康'
  },
  {
    key: '1',
    name: '团风县',
    name1: '预警',
    name2:'超载',
    name3: '健康',
    name4: '健康'
  },  {
    key: '1',
    name: '团风县',
    name1: '预警',
    name2:'超载',
    name3: '健康',
    name4: '健康'
  },
];

export default {
  props: {
    tableData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      data,
      columns,
    };
  },
};
</script>
<style>
th.column-money,
td.column-money {
  text-align: right !important;
}
</style>
<style lang="scss" scope>
.customText {
  .tag {
    width: 8px;
    height: 8px;
    display: inline-block;
    font-size: 14px;
    margin-right: 9px;
  }
}
.warning {
  .tag {
    background-color: #eda169;
  }
  color: #eda169;
}
.success {
  .tag {
    background-color: #5ec26d;
  }
  color: #5ec26d
}
.info {
  .tag {
    background-color: #f6d641;
  }
  color: #f6d641
}
</style>
