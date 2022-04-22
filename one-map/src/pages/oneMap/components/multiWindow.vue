<!--  -->
<template>
  <div class="multiWindow">
    <div class="map-wrapper">
      <div class="left-map">
        <div id="map3"></div>
        <div class="map3-title title">主</div>
        <div class="map3-select">
          <a-select
            show-search
            option-filter-prop="children"
            style="width: 200px"
            v-model="one"
            :filter-option="filterOption"
            @change="change1"
            ><a-select-option
              v-for="item in options"
              :key="item.id"
              :value="item.value"
            >
              {{ item.label }}
            </a-select-option>
          </a-select>
        </div>
        <base-tools
          ref="baseTools"
          :map="map3"
          @handleDtChange="changeLayer1"
        ></base-tools>
      </div>
      <div class="right-map">
        <div id="map4"></div>
        <div class="map4-title title">副</div>
        <div class="map4-select">
          <a-select
            show-search
            option-filter-prop="children"
            v-model="two"
            style="width: 200px"
            :filter-option="filterOption"
            @change="change2"
            ><a-select-option
              v-for="item in options"
              :key="item.id"
              :value="item.value"
            >
              {{ item.label }}
            </a-select-option>
          </a-select>
        </div>
        <base-tools
          ref="baseTools"
          :map="map4"
          @handleDtChange="changeLayer2"
        ></base-tools>
      </div>
    </div>
    <div class="bottom-wrapper">
      <!-- <div class="top-wrapper">
        <div class="tabs">
          <div
            :class="[isActive1 ? 'activeClass' : '', 'tabWrapper']"
            @click="clickTab(name1, 1)"
          >
            {{ name1 }}
          </div>
          <div
            v-show="name1 != name2"
            :class="[isActive2 ? 'activeClass' : '', 'tabWrapper']"
            @click="clickTab(name2, 2)"
          >
            {{ name2 }}
          </div>
        </div>
        <div class="btns-wrapper">
          <a-icon
            type="vertical-align-bottom"
            :class="[!showContent ? 'btn-trans' : '', 'btn1']"
            :title="showContent ? '收缩' : '展开'"
            @click="clickContract"
          />
        </div>
      </div> -->
      <div class="content" v-show="showContent">
        <div class="left">
          <a-tree
            class="layer-tree"
            :tree-data="treeData"
            @select="onSelect"
            @expand="onExpand"
            :selectedKeys="selectedKeys"
            :expandedKeys="expandedKeys"
          />
        </div>
        <div class="table-wrapper">
          <div class="search">
            <a-form-model ref="form" :model="form" layout="inline" size="small">
              <a-form-model-item
                label="请选择要查询的字段"
                prop="searchLabel"
                
              >
                <a-select
                  v-model="form.searchLabel"
                  allow-clear
                  style="width: 200px"
                  @change="handleChange"
                  ><a-select-option
                    v-for="(item, index) in columns"
                    :key="index"
                    :value="item.dataIndex"
                  >
                    {{ item.title }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
              <!-- <a-form-model-item>:</a-form-model-item> -->
              <template v-if="form.searchLabel">
                <a-form-model-item
                  label="请选择要查询的值"
                  prop="searchValue"
                 
                >
                  <a-select
                    v-model="form.searchValue"
                    allow-clear
                    style="width: 200px"
                    @change="handleChangeValue"
                    ><a-select-option
                      v-for="(item, index) in tableValue"
                      :key="index"
                      :value="item"
                    >
                      {{ item }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </template>
              <!-- <a-form-model-item
                label="请输入内容"
                prop="searchValue"
                :rules="[
                  {
                    required: true,
                    message: '请输入内容',
                    trigger: 'blur'
                  }
                ]"
              >
                <a-input allowClear v-model="form.searchValue" />
              </a-form-model-item> -->
              <a-form-model-item label="">
                <a-button type="primary" @click="searchTable">查询</a-button>
              </a-form-model-item>
              <a-form-model-item label="">
                <a-button @click="resetTable">重置</a-button>
              </a-form-model-item>
            </a-form-model>
          </div>
          <div class="table">
            <a-table
              :columns="columns"
              :data-source="data"
              :pagination="pagination"
              :customRow="rowClick"
              bordered
            >
            </a-table>
          </div>
        </div>
      </div>
    </div>
    <div class="exit" @click="exit">返回</div>
  </div>
</template>

<script>
import { initMap, removeBaseLayers, addBaseLayers } from "@/mapjs/map.js";
import { registerProj } from "@/mapjs/projections.js";
import { createImageLayer, createVectorLayer } from "@/mapjs/layer.js";
import { getBaseLayers, getCountyVectorLayer, allChange } from "../function";
import { queryArcGISProperties } from "@/mapjs/Query/arcgisQuery.js";
import { queryArcGISPropertie } from "@/mapjs/Query/arcgisQueryTable.js";
import BaseTools from "@/components/baseTools/index";
import EsriJSON from "ol/format/EsriJSON";
export default {
  name: "",
  data() {
    return {
      map3: null,
      map4: null,
      loading1: false,
      options: [
        {
          id: 1,
          label: "团风县县级图层",
          value: 1,
          url:
            "http://192.168.250.200/arcgis/rest/services/tuanfengxian/MapServer"
        },
        {
          id: 0,
          label: "团风县乡镇图层",
          value: 0,
          url:
            "http://192.168.250.200/arcgis/rest/services/tuanfengxian/MapServer"
        }
      ],
      one: undefined,
      two: undefined,
      columns: [],
      data: [],
      pagination: {
        size: "small",
        total: 0,
        showTotal: total => `共 ${total} 条数据`,
        hideOnSinglePage: true
      },
      selectedKeys: [],
      expandedKeys: [],
      layer1: null,
      layer2: null,
      name1: "",
      name2: "",
      treeData: [],
      tableValue: [],
      url: "",
      isActive1: false,
      isActive2: false,
      form: {
        searchLabel: "",
        searchValue: ""
      },
      showContent: true
    };
  },

  props: {},

  components: { BaseTools },
  created() {},

  computed: {},

  mounted() {
    registerProj();
    this.initTwoMap();
  },

  methods: {
    // 根据表格属性获取相应的值
    async getTableValue(value) {
      let params = {
        outFields: value
      };
      let res = await queryArcGISPropertie(
        this.url,
        this.selectedKeys[0],
        params
      );

      let arr = res.data.features;
      let newArr = [];
      arr.forEach(item => {
        // console.log(item.attributes);
        newArr.push(item.attributes);
        // this.tableValue.push(item.attributes)
      });
      newArr.forEach(item => {
        // console.log(item)
        let str = JSON.stringify(item);
        // console.log(str.split(":"))
        let str1 = str.split(":");
        // console.log(str1)
        let str2 = str1[1].split("}");
        // console.log(JSON.parse(str2[0]))
        this.tableValue.push(JSON.parse(str2[0]));
        this.tableValue = this.unique(this.tableValue);
      });
      console.log(this.tableValue);
    },
    // 数组去重
    unique(arr) {
      return Array.from(new Set(arr));
    },
    handleChange(value) {
      console.log(`selected ${value}`);
      this.form.searchLabel = value;
      this.tableValue = [];
      this.form.searchValue = "";
      this.getTableValue(value);
    },
    handleChangeValue(value) {

      console.log(`selected ${value}`);
      this.form.searchValue = value;
    },
    // 初始化两个地图
    async initTwoMap() {
      this.map3 = initMap("map3", {
        center: window.globalUrl.viewConfig.center,
        zoom: window.globalUrl.viewConfig.zoom
      });
      this.changeLayer1(1);
      this.change1(0);
      this.map4 = initMap("map4", {
        center: window.globalUrl.viewConfig.center,
        zoom: window.globalUrl.viewConfig.zoom
      });
      this.changeLayer2(1);
      this.change2(1);
      this.clickTab(this.name1, 1);

      let oneView = this.map3.getView();
      let twoView = this.map4.getView();
      // 左侧地图事件
      let oneChange = () => {
        allChange(oneView, twoView);
      };
      // 右侧地图事件
      let twoChange = () => {
        allChange(twoView, oneView);
      };
      // 给两个地图添加事件
      oneView.on("change", oneChange);
      twoView.on("change", twoChange);
    },
    async change1(e) {
      this.one = e;
      this.name1 = this.options.filter(i => i.value == e)[0].label;
      this.clickTab(this.name1, 1);
      let layer;
      if (e == 0) {
        let { url, id, type } = window.globalUrl.districts.town;
        let params = {
          url,
          type,
          layers: `show:${id}`
        };
        layer = await createImageLayer(params);
        this.map3.addLayer(layer);
        //this.map4.getView().fit(window.extent);
      } else {
        let { url, id, type } = window.globalUrl.districts.county;
        let params = {
          url,
          type,
          layers: `show:${id}`
        };
        layer = await createImageLayer(params);
        this.map3.addLayer(layer);
        //this.map4.getView().fit(window.extent);
      }
      if (this.layer1) {
        this.map3.removeLayer(this.layer1);
      }
      this.layer1 = layer;
      this.map3.addLayer(layer);
    },
    async change2(e) {
      this.two = e;
      this.name2 = this.options.filter(i => i.value == e)[0].label;
      this.clickTab(this.name2, 2);
      let layer;
      if (e == 0) {
        let { url, id, type } = window.globalUrl.districts.town;
        let params = {
          url,
          type,
          layers: `show:${id}`
        };
        layer = await createImageLayer(params);
        this.map4.addLayer(layer);
        //this.map4.getView().fit(window.extent);
      } else {
        let { url, id, type } = window.globalUrl.districts.county;
        let params = {
          url,
          type,
          layers: `show:${id}`
        };
        layer = await createImageLayer(params);
        this.map4.addLayer(layer);
        //this.map4.getView().fit(window.extent);
      }

      if (this.layer2) {
        this.map4.removeLayer(this.layer2);
      }
      this.layer2 = layer;
      this.map4.addLayer(layer);
    },
    // 点击tab
    clickTab(e, i) {
      if (i == 1) {
        this.isActive1 = true;
        this.isActive2 = false;
      } else if (i == 2) {
        this.isActive2 = true;
        this.isActive1 = false;
      }
      let url = this.options.filter(i => i.label == e)[0].url;
      this.url = url;
      // console.log(url);
      this.getLayerTree(url);
    },
    // 获取服务左侧的图层树
    async getLayerTree(url) {
      let response = await fetch(url + "?f=pjson", {
        method: "POST"
      });
      const data = await response.json();
      // console.log(22, data);
      let { layers } = data;
      layers.forEach(i => {
        i.title = i.name;
        i.key = i.id;
      });
      // console.log(layers);
      let res = this.toTreeData(layers);
      this.getFirstLeaf(res);
      this.treeData = res;
      this.onSelect(this.selectedKeys);
    },
    // 树选择
    onSelect(a) {
      this.selectedKeys = a;
      this.pagination.total = 0;
      this.getLayerTable(this.url, this.selectedKeys[0]);
    },
    // 树展开
    onExpand(a) {
      this.expandedKeys = a;
    },
    // 获取某个图层的table数据
    async getLayerTable(url, id) {
      let res = await queryArcGISProperties(url, id);
      // console.log(11, res);
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
        this.pagination.total = arr.length;
        this.data = arr;
      }
    },
    // 切换底图
    async changeLayer1(e) {
      // remove
      removeBaseLayers(this.map3);
      // add
      let layers = await getBaseLayers(e);
      addBaseLayers(this.map3, layers);
    },
    // 切换底图
    async changeLayer2(e) {
      // remove
      removeBaseLayers(this.map4);
      // add
      let layers = await getBaseLayers(e);
      addBaseLayers(this.map4, layers);
    },
    //格式化数据
    toTreeData(data) {
      let result = [];
      if (!Array.isArray(data)) {
        return result;
      }
      data.forEach(item => {
        if (item.subLayerIds) {
          item.selectable = false;
        }
        delete item.children;
      });
      let map = {};
      data.forEach(item => {
        map[item.id] = item;
      });
      data.forEach(item => {
        let parent;
        if (item.parentLayerId != -1) {
          parent = map[item.parentLayerId];
        }
        if (parent) {
          (parent.children || (parent.children = [])).push(item);
        } else {
          result.push(item);
        }
      });
      return result;
    },
    // 获取第一个叶子节点
    getFirstLeaf(data) {
      if (data[0].children) {
        this.expandedKeys.push(data[0].key);
        this.getFirstLeaf(data[0].children);
      } else {
        this.selectedKeys = [data[0].key];
      }
      // console.log("www", this.selectedKeys);
    },
    exit() {
      this.$router.push("/oneMap");
    },
    // 表格行的点击事件
    rowClick(record, index) {
      return {
        on: {
          click: () => {
            // console.log(record, index, this.isActive1, this.isActive2);
            let geom = new EsriJSON().readGeometry(record.geometry);
            let extent = geom.getExtent();
            if (this.name1 == this.name2) {
              this.map3.getView().fit(extent);
              this.map4.getView().fit(extent);
            } else {
              if (this.isActive1) {
                this.map3.getView().fit(extent);
              } else {
                this.map4.getView().fit(extent);
              }
            }
          }
        }
      };
    },
    // 表格查询
    async searchTable() {
      
        if (this.form.searchValue) {  
          // 获取key的type
          
          let operator, value;
          let type = this.columns.filter(
            i => i.dataIndex == this.form.searchLabel
          )[0].type;
          // console.log(type);
          if (type.indexOf("string") != -1) {
            operator = "like";
            value = `'%${this.form.searchValue}%'`;
          } else {
            operator = "=";
            value = this.form.searchValue;
          }
          let params = {
            where: [
              {
                key: this.form.searchLabel,
                value: value,
                operator: operator
              }
            ]
          };
          // // console.log(where);
          let res = await queryArcGISProperties(
            this.url,
            this.selectedKeys[0],
            params
          );
          // console.log(res);
          let arr = [];
          if (res.data.features) {
            res.data.features.forEach((i, j) => {
              arr[j] = i.attributes;
              arr[j].key = i.attributes.OBJECTID;
              arr[j].geometry = i.geometry;
            });
            this.pagination.total = arr.length;
            this.data = arr;
          }
        } else {
           let res = await queryArcGISProperties(
        this.url,
        this.selectedKeys[0],
        null
      );
      // console.log(res);
      let arr = [];
      if (res.data.features) {
        res.data.features.forEach((i, j) => {
          arr[j] = i.attributes;
          arr[j].key = i.attributes.OBJECTID;
          arr[j].geometry = i.geometry;
        });
        this.pagination.total = arr.length;
        this.data = arr;
      }
          
        }
      
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    },
    // 表格重置
    async resetTable() {
      this.$refs.form.resetFields();
      let res = await queryArcGISProperties(
        this.url,
        this.selectedKeys[0],
        null
      );
      // console.log(res);
      let arr = [];
      if (res.data.features) {
        res.data.features.forEach((i, j) => {
          arr[j] = i.attributes;
          arr[j].key = i.attributes.OBJECTID;
          arr[j].geometry = i.geometry;
        });
        this.pagination.total = arr.length;
        this.data = arr;
      }
    },
    // 下方div的收缩与展开
    clickContract() {
      let mapWrapper = document.querySelector(".map-wrapper");
      let bottomWrapper = document.querySelector(".bottom-wrapper");
      if (this.showContent) {
        this.showContent = false;
        mapWrapper.style.height = "calc(100% - 40px)";
        bottomWrapper.style.height = "40px";
        this.$nextTick(() => {
          this.map3.updateSize();
          this.map4.updateSize();
        });
      } else {
        this.showContent = true;
        mapWrapper.style.height = "60%";
        bottomWrapper.style.height = "40%";
        this.$nextTick(() => {
          this.map3.updateSize();
          this.map4.updateSize();
        });
      }
    }
  },
  beforeDestroy() {
    oneView.un("change", oneChange);
    twoView.un("change", twoChange);
  }
};
</script>
<style lang="less" scoped>
.multiWindow {
  width: 100%;
  height: calc(100vh - 88px);
}
.map-wrapper {
  height: 60%;
  padding: 16px 30px 0 30px;
  display: flex;
  justify-content: space-between;
  .left-map {
    width: 55%;
    height: 100%;
    border-right: 1px solid #1890ff;
    position: relative;
    #map3 {
      width: 100%;
      height: 100%;
      background: #eee;
    }
    .map3-title {
      position: absolute;
      top: 0px;
      left: 0px;
    }
    .map3-select {
      position: absolute;
      top: 20px;
      left: 20px;
    }
  }
  .right-map {
    width: 45%;
    height: 100%;
    border-left: 1px solid #1890ff;
    position: relative;
    #map4 {
      width: 100%;
      height: 100%;
      background: #eee;
    }
    .map4-title {
      position: absolute;
      top: 0px;
      left: 0px;
    }
    .map4-select {
      position: absolute;
      top: 20px;
      left: 20px;
    }
  }

  .title {
    width: 20px;
    height: 20px;
    font-size: 14px;
    background: rgba(255, 255, 255, 0.6);
  }
}
.bottom-wrapper {
  height: 40%;
  margin: 0 30px;
  box-shadow: 0px 0px 8px 0px rgba(57, 75, 125, 0.3);
  background: #fff;
  .top-wrapper {
    display: flex;
    justify-content: space-between;
    height: 40px;
    background: #eee;
    padding-right: 30px;
  }
  .tabs {
    display: flex;
    justify-content: flex-start;
    .tabWrapper {
      padding: 0 20px;
      line-height: 40px;
      cursor: pointer;
    }
    .activeClass {
      background: #fff;
      color: #1890ff;
    }
    .tabWrapper:hover {
      color: #1890ff;
    }
  }
  .btns-wrapper {
    .btn1 {
      font-size: 20px;
      line-height: 40px;
    }
    .btn1:hover {
      cursor: pointer;
      color: #1890ff;
    }
    .btn-trans {
      transform: rotate(180deg);
    }
  }
  .content {
    display: flex;
    height: calc(100% - 40px);
    justify-content: flex-start;
    .left {
      width: 200px;
      margin: 5px 10px;
      box-shadow: 0px 0px 8px 0px rgba(57, 75, 125, 0.3);
      overflow: auto;
      .layer-tree {
        text-align: left;
      }
    }
    .table-wrapper {
      width: calc(100% - 200px);
      // background: cornsilk;
      height: 100%;
      padding: 10px 10px 0 10px;

      .search {
        text-align: left;
        height: 40px;
      }
      .table {
        height: calc(100% - 40px);
        overflow: auto;
      }
    }
  }
}
/deep/.box2,
/deep/.box3 {
  display: none;
}
/deep/.ant-select-selection__placeholder {
  display: block !important;
}
.exit {
  cursor: pointer;
  position: absolute;
  top: 100px;
  right: 50px;
  height: 30px;
  line-height: 30px;
  border-radius: 3px;
  background: #fff;
  box-shadow: 0px 0px 8px 0px rgba(57, 75, 125, 0.3);
  font-size: 14px;
  padding: 0 10px;
}
</style>
