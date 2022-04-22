<!--  -->
<template>
  <div class="kjsx" v-if="showKjsx">
    <Dialog title="空间筛选" :showFooter="false" @handleCancel="handleCancel">
      <template v-slot:content>
        <div class="content">
          <div class="select-wrapper">
            <span style="line-height: 30px; padding-right: 8px">图层:</span>
            <a-select
              v-model="searchLayer"
              placeholder="请选择图层"
              notFoundContent="请勾选左侧资源目录图层"
              style="width: 200px"
              @change="selectLayer"
              ><a-select-option
                v-for="item in options"
                :key="item.id"
                :value="item.id"
              >
                {{ item.title }}
              </a-select-option>
            </a-select>
          </div>
          <div class="item-wrapper">
            <div class="item" @click="draw('Point')">
              <a-button type="primary" class="btn" :disabled="disabled"
                >点选</a-button
              >
            </div>

            <div class="item" @click="draw('Polygon')">
              <a-button type="primary" class="btn" :disabled="disabled"
                >框选</a-button
              >
            </div>
          </div>
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script>
import Dialog from "../dialog";
import { queryArcGISSpatial, test } from "@/mapjs/Query/arcgisQuery.js";
import { drawEvent, removeDrawInteraction } from "@/mapjs/interaction/draw.js";
import { createVectorLayer } from "@/mapjs/layer.js";
import { SpatialQuery } from '@/api/statistics';
import GeoJSON from "ol/format/GeoJSON";
export default {
  name: "",
  data() {
    return {
      showKjsx: false,
      searchLayer: undefined,
      data: [],
      columns: [],
      layerUrl: "",
      layerId: "",
      drawType: "",
      disabled: true,
      currSelectMap: null,
    };
  },

  props: ["map", "options"],
  watch: {
    map(val) {
      if (val) {
        this.map = val;
      }
    },
  },
  components: { Dialog },

  created() { },

  // computed: {
  //   Mapoptions() {
  //     return this.options.filter(item => item.type.toLowerCase() === 'wms');
  //   }
  // },

  mounted() {},

  methods: {
    async handleOk() {
      let res = [];
      if (this.currSelectMap.type =='wms') {
        res = await queryArcGISSpatial({
          url: this.layerUrl,
          layerId: this.layerId,
          geometryType: this.drawType,
          geometry: this.drawGemo,
        });
        this.toTableData(res);
      }else {
        let params = {
          vectorId: this.currSelectMap.resourceid,
          geoString: new GeoJSON().writeGeometry(this.drawGemo)
        };
        let reslist = await SpatialQuery(params);
        if (reslist.code ==200) {
          res = reslist.data;
          this.toOtherTableData(res);
        }else {
          this.$message.warn(reslist.msg)
        }
      }
    },
    handleCancel() {
      this.searchLayer = undefined
      this.disabled = true
      removeDrawInteraction(this.map);
      this.showKjsx = false;

      this.$emit("closeCard");
    },
    // 选择图层
    selectLayer(a, b) {
      this.disabled = false;
      let obj = this.options.filter((i) => i.id == a)[0];
      this.currSelectMap = obj;
      // console.log(obj);
      this.layerUrl = obj.url;
      this.layerId = "0";
    },
    // 绘制事件
    draw(drawType) {
      this.drawType = drawType;
      // 开始绘制
      let params = {
        type: 0,
      };
      let drawLayer = createVectorLayer(params); // 开始绘制时创建空的矢量图层
      drawLayer.set("layerType", "spaceSiftLayer");
      this.map.addLayer(drawLayer);
      drawEvent({
        map: this.map,
        layer: drawLayer,
        drawType: this.drawType,
        startCallback: () => {
          // this.limitEvent();
        },
        endCallback: async (feature) => {
          // console.log(feature);
          this.drawGemo = feature.getGeometry();
          // // console.log(this.drawGemo);
          // // console.log(this.layerUrl, this.layerId, drawType, this.drawGemo);
          this.handleOk();
          removeDrawInteraction(this.map);
          // 设置样式
          //feature.setStyle(style);
        },
      });
    },
    // 查询WMS到的数据转换为表格数据
    toTableData(res) {
      if (res.features.length === 0 || res.data.error) {
        return;
      } else {
        if (res.data.fields) {
          res.data.fields.forEach((i, j) => {
            i.title = i.name;
            i.dataIndex = i.alias;
            i.type = i.type.toLowerCase();
          });
          this.columns = res.data.fields;
        } else {
          this.columns = [];
        }
        let arr = [];
        if (res.data.features) {
          res.data.features.forEach((i, j) => {
            arr[j] = i.attributes;
            arr[j].key = i.attributes.OBJECTID;
            arr[j].geometry = i.geometry;
          });

          this.data = arr;
        }
        this.$emit("showTableWrapper", this.data, this.columns, arr.length);
      }
    },
    // 处理其他类型的数据
    toOtherTableData(data) {
      if (data.fields) {
        data.fields.forEach((i, j) => {
          i.title = i.name;
          i.dataIndex = i.alias;
          i.type = i.type.toLowerCase();
        });
        this.columns = data.fields;
      } else {
        this.columns = [];
      }
      let arr = [];
      // if (data.attributes) {
        // data.attributes.forEach((i, j) => {
        //   arr[j] = i.attributes;
        //   arr[j].key = i.attributes.OBJECTID;
        //   arr[j].geometry = i.geometry;
        // });

        // this.data = arr;
      // }
      this.$emit("showTableWrapper", data.attributes, this.columns, data.attributes.length);
    }
  },
};
</script>
<style lang='less' scoped>
.kjsx {
  position: absolute;
  top: 100px;
  left: 20px;
}
.item-wrapper {
  cursor: pointer;
  display: flex;
  justify-content: flex-start;
  //margin-bottom: 10px;
  .item {
    margin-top: 20px;
    margin-bottom: 24px;
    margin-left: 20px;
  }
  .item:first-child {
    margin-left: 80px;
  }
  .btn {
    width: 60px;
    height: 32px;
  }
  .item-icon {
    display: inline-block;
    width: 20px;
    height: 20px;
    position: absolute;
    top: 0;
    left: 30%;
    font-size: 16px;
  }
  .dx {
    background: url("../../assets/imgs/icon-dx.png") no-repeat center;
  }
  .kx {
    background: url("../../assets/imgs/icon-kx.png") no-repeat center;
  }
  .zh {
    background: url("../../assets/imgs/icon-zh.png") no-repeat center;
  }
}
.select-wrapper {
  margin-top: 20px;
  margin-left: 20px;
  text-align: left;
}
</style>
