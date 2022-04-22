<!--  -->
<template>
  <div class="map-dialog" v-if="isReload">
    <div class="dialog-header">
      <div v-if="type==1" class="dialog-title">土地利用现状分析结果</div>
      <div v-else class="dialog-title">闲置用地分析结果</div>
      <div class="dialog-close" @click="closeDialog"></div>
    </div>
    <div class="dialog-content">
      <a-table
        style="height: 300px; overflow: auto"
        :data-source="data"
        :columns="columns1"
        :pagination="pagination"
        :customRow="rowClick"
        bordered
      >
      </a-table>
    </div>
  </div>
</template>

<script>

export default {
  name: "",
  data() {
    return {
      isReload: true,
      // 需要的展示的表格数据
      columns1: [
        {
          title: '行政区名称',
          dataIndex: '行政区名称',
          key: '行政区名称',
        },
        {
          title: '行政区代码',
          dataIndex: '行政区代码',
        },
        {
          title: '国土用途规划分类名称',
          dataIndex: '国土用途规划分类名称',
        },
        {
          title: '国土用途规划分类代码',
          dataIndex: '国土用途规划分类代码',
        },
        {
          title: '面积(平方米)',
          dataIndex: '面积',
        },
      ],
      items: [
        "XMMC",
        "CASENO",
        "XMXZQDM",
        "XMXZQH",
        "SJPFWH",
        "SJPFSJ",
        "SJPFMJ",
      ],
    };
  },

  props: ["columns","type", "data", "pagination"],
  watch: {
    columns(val) {
      // this.columns1 = this.dealColumns(val);
    },
    data(val) {
      this.data = val;
    }
  },
  components: {},

  created() {},

  computed: {},

  mounted() {},

  methods: {
    reload() {
      this.isReload = false;
      this.$nextTick(()=>{
        this.isReload = true;
      })
    },
    closeDialog() {
      this.$emit("closeDialog");
    },
    // 表格行的点击事件
    rowClick(record, index) {
      return {
        on: {
          click: () => {
            // console.log(record, index);
            this.$emit("getDetailData", record)
            // let geom = new EsriJSON().readGeometry(record.geometry);
            // let extent = geom.getExtent();
            // this.map.getView().fit(extent);
          },
        },
      };
    },
    // 处理表头数据
    dealColumns(data) {
      let arr = [];
      data.filter((i) => {
        this.items.forEach((item) => {
          if (i.dataIndex == item) {
            arr.push(i);
          }
        });
      });
      return arr;
    },
  },
};
</script>
<style lang='less' scoped>

</style>

