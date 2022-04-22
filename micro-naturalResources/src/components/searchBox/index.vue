<!--  -->
<template>
  <div>
    <div class="search-wrapper">
      <div class="city" @click="showCity">
        <span class="city-name" :title="locationInfo.name">{{
          locationInfo.name
        }}</span>
        <span class="icon-arrow-down" :class="{ show: isShow }">
          <a-icon type="down" />
        </span>
      </div>
      <a-input
        placeholder="请输入关键字(地名地址)"
        v-model="queryStr"
        @change="searchAddress"
        @pressEnter="searchDesc"
      >
        <div
          slot="suffix"
          class="icon-clear"
          v-show="showClear"
          @click="queryStr = ''"
        ></div>
      </a-input>
      <div class="search" @click="searchDesc">
        <div></div>
      </div>
    </div>
    <div class="content-wrapper" v-show="isShow">
      <div class="city-top">
        <div>
          <span>当前位置：</span
          ><span
            @click="currentLocation(locationInfo)"
            style="cursor: pointer; color: #1890ff"
            >{{ locationInfo.name }}</span
          >
          <a-icon
            type="eye"
            theme="outlined"
            class="eye"
            v-show="showLayer"
            title="点击关闭图层"
            @click="changeXzLayer"
          />
          <a-icon
            type="eye-invisible"
            theme="outlined"
            class="eye"
            title="点击开启图层"
            @click="changeXzLayer"
            v-show="!showLayer"
          />
        </div>
        <div @click="closeCityBox"><a-icon type="close" /></div>
      </div>
      <div class="city-tab">
        <div
          v-for="(tab, index) in cityTabs"
          :key="index"
          class="city-letter"
          @click="handleTabClick(tab, index)"
        >
          {{ tab }}
        </div>
      </div>
      <div class="city-wrapper">
        <div
          v-for="(city, index) in cityLi"
          :key="index"
          class="city-mc"
          @click="handleCityClick(city, index)"
        >
          {{ city.name }}
        </div>
      </div>
    </div>
    <div class="desc-drop-down" v-if="showDesc">
      <div v-show="showDesc && descList.length < 1" class="loading">
        <a-icon type="loading" class="loading-icon" v-show="!showEmpty" />
        <span v-show="showEmpty">未搜索到匹配项</span>
      </div>
      <div class="desc-wrapper">
        <div
          v-for="item in descList"
          :key="item.id"
          class="drop-down-desc"
          @click="clickDesc(item)"
          @mouseover="hoverDesc(item)"
          @mouseout="outHover(item)"
        >
          <div class="desc-title">
            {{ item.id }}. <span v-html="item.title"></span>
          </div>
          <div class="desc-content">{{ item.position }}</div>
        </div>
        <a-pagination
          size="small"
          :total="total"
          v-show="descList.length > 0"
          :defaultCurrent="1"
          :defaultPageSize="20"
          @change="currentChange"
        />
      </div>
    </div>
    <div class="search-drop-down" v-if="showList">
      <div v-show="showList && searchList.length < 1" class="loading">
        <a-icon type="loading" class="loading-icon" v-show="!showEmpty" />
        <span v-show="showEmpty">未搜索到匹配项</span>
      </div>
      <div
        v-for="(item, index) in searchList"
        :key="index"
        class="drop-down-item"
        @click="clickAddress(item)"
      >
        <div :class="item.lonlat ? 'icon-location' : 'icon-search'"></div>
        <span v-html="item.title" class="address-name"></span>
        <span class="address-desc" :title="item.address">{{
          item.address
        }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { getTDTAddressInfo, getTFAddressInfo } from "@/api/oneMap.js"; // getDXAddressInfo
import { getFeatureByCode } from "@/pages/oneMap/featureEvents";
export default {
  name: "",
  data() {
    return {
      isShow: false, // 是否展开下拉城市
      cityName: "团风县",
      queryStr: "",
      cityTabs: [],
      cityLi: [], // 城市名称数组 array<object>
      showList: false, // 展示下拉搜索
      showDesc: false, // 展示详细搜索
      showClear: false, // 清除按钮的显示
      searchList: [], // 搜素的下拉框
      descList: [], // 详细搜索列表
      total: 0, // 总条数
      page: 1, // 当前页
      locationInfo: {
        name: "",
        code: "",
        extent: []
      }, // 当前位置信息
      showLayer: false,
      showEmpty: false
    };
  },
  props: ["cities"],
  watch: {
    cities(val) {
      this.cities = val;
      this.dealCityData();
    },
    queryStr(val) {
      // console.log(val);
      if (val == "") {
        this.showEmpty = false;
        this.showClear = false;
        this.searchList = [];
        this.showDesc = false;
        this.showList = false;
        this.$emit("clearPoint");
      } else {
        this.showClear = true;
        this.isShow = false;
      }
    }
  },
  components: {},

  created() {},

  computed: {},

  mounted() {},
  updated() {
    this.cityLi.forEach((item,j) => {
      if (item.name == this.locationInfo.name) {
        this.locationInfo.code = item.code;
        // 获取县范围
        let extent = getFeatureByCode(this.locationInfo.code);
        if (extent) {
          this.locationInfo.extent = extent;
        }
        this.$nextTick(() => {
        let doms1 = document.querySelectorAll(".city-mc");
        // 指定的添加类名
        doms1.forEach((item, index) => {
          // 移除所有active的类名
          item.classList.remove("activeCity")
          if (index == j) {
            item.classList.add("activeCity");
          }
        });
      });
      }
    });

  },
  methods: {
    showCity() {
      this.isShow = !this.isShow;
    },
    closeCityBox() {
      this.isShow = false;
      // let doms1 = document.querySelectorAll(".city-mc");
      // // 移除所有active的类名
      // doms1.forEach((item) => item.classList.remove("activeCity"));
      this.$emit("closeCityBox");
    },
    // 当前位置点击
    currentLocation(e) {
      this.$emit("currentLocation", e);
    },
    // 分离城市数据
    async dealCityData() {
      this.cities.forEach(item => {
        this.cityTabs.push(item.title);
      });
      let arr = [];
      this.cityLi = this.cities.filter(item => item.title == "热门")[0].lists;
      this.locationInfo.name = this.cityLi[0].name;
      this.locationInfo.code = this.cityLi[0].code;
      // 获取县范围
      let extent = getFeatureByCode(this.cityLi[0].code);
      if (extent) {
        this.locationInfo.extent = extent;
      }
      this.$nextTick(() => {
        let doms = document.querySelectorAll(".city-letter");
        // 移除所有active的类名
        doms[0].classList.add("activeLetter");
        let doms1 = document.querySelectorAll(".city-mc");
        // 移除所有active的类名
        doms1[0].classList.add("activeCity");
        // console.log(this.locationInfo.extent.join(","));
      });
    },
    // 城市tab切换
    handleTabClick(i, j) {
      // 更换城市数据
      let arr = [];
      this.cityLi = this.cities.filter(item => item.title == i)[0].lists;
      // 当dom加载完成之后执行
      this.$nextTick(() => {
        let doms = document.querySelectorAll(".city-letter");
        // 移除所有active的类名
        doms.forEach(item => item.classList.remove("activeLetter"));
        // let doms1 = document.querySelectorAll(".city-mc");
        // // 移除所有active的类名
        // doms1.forEach((item) => item.classList.remove("activeCity"));
        // 指定的添加类名
        doms.forEach((item, index) => {
          if (index == j) {
            item.classList.add("activeLetter");
          }
        });
        this.handleCityClick(this.cityLi[0]);
      });
    },
    // 城市名称点击
    handleCityClick(i) {
      // 当dom加载完成之后执行
      this.$nextTick(() => {
        this.locationInfo.name = i.name;
        this.locationInfo.code = i.code;
        let doms = document.querySelectorAll(".city-mc");
        // 移除所有active的类名
        doms.forEach(item => item.classList.remove("activeCity"));
        // 指定的添加类名
        doms.forEach((item, index) => {
          if (item.innerText == i.name) {
            item.classList.add("activeCity");
          }
        });
      });
      this.$emit("handleCityClick", i, this.showLayer, this.locationInfo);
    },
    // 天地图接口
    async searchByTDT(count, start) {
      let query = {
        keyWord: this.queryStr,
        level: "11",
        mapBound: this.locationInfo.extent.join(","),
        queryType: "2",
        count,
        start
      };
      let res = await getTDTAddressInfo(query);
      // console.log("tdt", res);
      return {
        data: res.data.pois,
        total: res.data.count,
        status: res.status
      };
    },
    // 地信接口
    // async searchByDX(page, size) {
    //   let query = {
    //     code: 420000, //this.locationInfo.code,
    //     keyword: this.queryStr,
    //     pagenum: page,
    //     pagesize: size,
    //   };
    //   let res = await getDXAddressInfo(query);
    //   // console.log("dx", res);
    //   return {
    //     data: res.data.data,
    //     total: res.data.dataNum,
    //     status: res.status,
    //   };
    // },
    // 团风接口
    async searchByTF(page, size) {
      let params = {
        keyword: this.queryStr,
        pageIndex: page,
        pageSize: size
      };
      let res = await getTFAddressInfo(params, this.locationInfo.code);
      // console.log("tf", res);
      return {
        data: res.data.responseObj.data,
        total: res.data.count,
        status: res.status
      };
    },
    // 天地图地名地址搜索
    async searchAddress(e) {
      // console.log(e);
      this.searchList = [];
      this.showEmpty = false;
      this.showList = true;
      if (this.queryStr == "") {
        this.showDesc = false;
      }
      // 天地图走得通
      this.searchByTDT("10", "0")
        .then(res => {
          // console.log("天地图走得通", res);
          let { data, total, status } = res;
          if (total > 0) {
            this.searchList = this.dealTDTData(this.queryStr, data);
          } else {
            this.showEmpty = true;
            this.searchList = [];
          }
        })
        // 天地图走不通
        .catch(async err => {
          // console.log("天地图走不通", err);
          let res = await this.searchByTF(1, 10);
          // console.log("dx不分页", res);
          let { data, total, status } = res;
          if (total > 0) {
            this.searchList = this.dealTFData(this.queryStr, data);
          } else {
            this.showEmpty = true;
            this.searchList = [];
          }
        });
      // let res = await this.searchByTDT("10","0");
      // // console.log("tdt不分页", res);
      // let { data, total, status } = res;
      // if (status == 200) {
      //   if (total > 0) {
      //     this.searchList = this.dealTDTData(this.queryStr, data);
      //   } else {
      //     this.showEmpty = true;
      //     this.searchList = [];
      //   }
      // } else {
      //   let res = await this.searchByDX(1, 10);
      //   // console.log("dx不分页", res);
      //   let { data, total, status } = res;
      //   if (total > 0) {
      //     this.searchList = this.dealDXData(this.queryStr, data);
      //   } else {
      //     this.showEmpty = true;
      //     this.searchList = [];
      //   }
      // }
    },
    // 处理天地图数据
    dealTDTData(keyWord, arr) {
      let data = [...arr];
      // 匹配关键字正则
      let replaceReg = new RegExp(keyWord, "g");
      let replaceString = '<span class="search-text">' + keyWord + "</span>";
      data.forEach((item, index) => {
        // 正则替换
        item.title = item.name.replace(replaceReg, replaceString);
        // 搜索的关键词
        item.keyWord = keyWord;
        item.position = item.address;
        item.location = item.lonlat.split(" ");
        item.id = index + 1;
      });
      // console.log(data);
      return data;
    },
    // 处理地信数据
    // dealDXData(keyWord, arr) {
    //   let data = [...arr];
    //   // 匹配关键字正则
    //   let replaceReg = new RegExp(keyWord, "g");
    //   let replaceString = '<span class="search-text">' + keyWord + "</span>";
    //   data.forEach((item, index) => {
    //     // 正则替换
    //     item.title = item.name.replace(replaceReg, replaceString);
    //     // 搜索的关键词
    //     item.keyWord = keyWord;
    //     item.position = item.address;
    //     item.location = [item.jd, item.wd];
    //     item.id = index + 1;
    //   });
    //   // console.log(data);
    //   return data;
    // },
    // 处理团风数据
    dealTFData(keyWord, arr) {
      let data = [...arr];
      // 匹配关键字正则
      let replaceReg = new RegExp(keyWord, "g");
      let replaceString = '<span class="search-text">' + keyWord + "</span>";
      data.forEach((item, index) => {
        item.name = item.name2;
        // 正则替换
        item.title = item.name2.replace(replaceReg, replaceString);

        // 搜索的关键词
        item.keyWord = keyWord;
        item.position = item.showname;
        item.location = [item.x, item.y];
        item.id = index + 1;
      });
      // console.log(data);
      return data;
    },
    // 地名地址点击
    async clickAddress(e) {
      // console.log(e);
      // 判断是否有坐标
      if (e.location) {
        // 有坐标定位过去
        // let lonlat = e.lonlat.split(" ");
        // e.location = lonlat;
        this.$emit("mapPosition", e);
      } else {
        // 没坐标地名详细搜索
        this.getDescList();
      }
    },
    // 获取详细信息
    async getDescList() {
      this.descList = [];
      this.showEmpty = false;
      this.showDesc = true;
      // 天地图走得通
      this.searchByTDT("20", (this.page - 1) * 20)
        .then(res => {
          // console.log("天地图走得通", res);
          let { data, total, status } = res;
          if (total > 0) {
            this.total = total;
            this.descList = this.dealTDTData(this.queryStr, data);
            this.$emit("pois", this.descList);
          } else {
            this.showEmpty = true;
            this.descList = [];
          }
        })
        // 天地图走不通
        .catch(async err => {
          // console.log("天地图走不通", err);
          let res = await this.searchByTF(this.page, 20);
          // console.log("dx不分页", res);
          let { data, total, status } = res;
          if (total > 0) {
            this.total = total;
            this.descList = this.dealTFData(this.queryStr, data);
            this.$emit("pois", this.descList);
          } else {
            this.showEmpty = true;
            this.descList = [];
          }
        });
      // let res = await this.searchByTDT("20", (this.page - 1) * 20);
      // // console.log("tdt分页", res);
      // let { data, status, total } = res;
      // if (status == 200) {
      //   if (total > 0) {
      //     this.total = total;
      //     this.descList = this.dealTDTData(this.queryStr, data);
      //     this.$emit("pois", this.descList);
      //   } else {
      //     this.showEmpty = true;
      //     this.descList = [];
      //   }
      // } else {
      //   let res = await this.searchByDX(this.page, 20);
      //   // console.log("dx分页", res);
      //   let { data, status, total } = res;
      //   if (total > 0) {
      //     this.total = total;
      //     this.descList = this.dealDXData(this.queryStr, data);
      //     this.$emit("pois", this.descList);
      //   } else {
      //     this.showEmpty = true;
      //     this.descList = [];
      //   }
      // }
    },
    // 页面改变时
    currentChange(e) {
      this.page = e;
      this.getDescList();
    },
    // 搜索详细信息
    searchDesc() {
      if (this.queryStr == "") {
        return;
      }
      this.searchList = [];
      this.showList = false;
      this.getDescList();
    },
    // 详细信息点击
    clickDesc(e) {
      this.$emit("clickDesc", e);
    },
    // 详情列表鼠标移入
    hoverDesc(e) {
      this.$emit("hoverDesc", e);
    },
    // 详情鼠标移出
    outHover(e) {
      this.$emit("outHover", e);
    },
    // 行政区划查询
    // async getInfoByName(name) {
    //   let params = {
    //     searchWord: name,
    //     searchType: "1",
    //     needSubInfo: "false",
    //     needAll: "false",
    //     needPre: "true",
    //   };
    //   let res = await getAddressNameInfo(params);
    //   // console.log(res.data.data);
    //   this.$emit("locationAddress", res.data.data);
    // },
    // 乡镇图层是否显示
    changeXzLayer() {
      this.showLayer = !this.showLayer;
      this.$emit("changeXzLayer", this.showLayer, this.locationInfo);
    }
  }
};
</script>
<style lang="less" scoped>
.search-wrapper {
  width: 322px;
  height: 36px;
  position: absolute;
  top: 21px;
  left: 20px;
  box-shadow: 0px 0px 8px 0px rgba(57, 75, 125, 0.3);
  background: #fff;
  display: flex;
  justify-content: flex-start;
  .city {
    width: 68px;
    height: 20px;
    font-size: 12px;
    color: #6f7583;
    margin-top: 10px;
    border-right: 1px solid #e9e9e9;
    cursor: pointer;
    position: relative;
    padding-right: 12px;
    padding-left: 5px;
    .city-name {
      display: inline-block;
      width: 40px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin-right: 2px;
      // padding-right: 5px;
    }
    /deep/.icon-arrow-down {
      cursor: pointer;
      position: absolute;
      top: 0px;
      right: 5px;
      font-size: 10px;
    }
    /deep/.icon-arrow-down.show {
      transform: rotate(180deg);
    }
  }
  /deep/.ant-input {
    font-size: 12px;
  }
  .ant-input-affix-wrapper {
    height: 36px;
    width: 214px;
    border: 0px;
    /deep/.ant-input {
      height: 36px;
      width: 214px;
      border: 0px;
    }
    /deep/.ant-input:hover {
      border-color: #000;
    }
    .icon-clear {
      cursor: pointer;
      background: url("../../assets/imgs/icon-clear.png") no-repeat center;
      width: 20px;
      height: 40px;
    }
    .icon-clear:hover {
      background: url("../../assets/imgs/icon-clear-hover.png") no-repeat center;
    }
  }
  .search {
    div {
      background: url("../../assets/imgs/icon-search-big.png") no-repeat center;
      height: 18px;
    }
    width: 40px;
    height: 20px;
    border-left: 1px solid #e9e9e9;
    margin-top: 10px;
    cursor: pointer;
  }
}
.content-wrapper {
  width: 530px;
  height: 272px;
  position: absolute;
  top: 65px;
  left: 20px;
  background: #fff;
  box-shadow: 0px 0px 8px 0px rgba(57, 75, 125, 0.3);
  z-index: 5;
  .city-top {
    display: flex;
    justify-content: space-between;
    height: 36px;
    border-bottom: 1px solid #eee;
    line-height: 36px;
    text-align: left;
    padding: 0 10px;
    span {
      font-size: 12px;
    }
    .eye {
      cursor: pointer;
      padding-left: 8px;
    }
    .eye:hover {
      color: #1890ff;
    }
    div:last-child {
      cursor: pointer;
    }
  }
  .city-tab {
    height: 36px;
    border-bottom: 1px solid #eee;
    padding: 0 10px;
    display: flex;
    justify-content: space-between;
    .city-letter {
      text-align: center;
      line-height: 20px;
      padding-top: 10px;
      font-size: 12px;
      cursor: pointer;
    }
    .activeLetter {
      color: #1890ff;
      border-bottom: 2px solid #1890ff;
    }
  }
  .city-wrapper {
    padding: 10px;
    // height: 100%;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    max-height: 190px;
    overflow: auto;
    margin-right: 5px;
    .city-mc {
      height: 20px;
      font-size: 12px;
      padding: 0px 5px;
      cursor: pointer;
      margin: 1px;
    }
    .activeCity {
      background: #1890ff;
      color: #fff;
      border-radius: 3px;
    }
  }
}
.search-drop-down {
  width: 322px;
  position: absolute;
  top: 65px;
  left: 20px;
  box-shadow: 0px 0px 8px 0px rgba(57, 75, 125, 0.3);
  background: #fff;
  text-align: left;
  z-index: 4;
  .drop-down-item {
    position: relative;
    font-size: 12px;
    color: #454954;
    padding: 10px;
    cursor: pointer;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    .icon-location {
      display: inline-block;
      background: url("../../assets/imgs/icon-location.png") no-repeat center;
      width: 13px;
      height: 17px;
      position: absolute;
      top: 10px;
      left: 10px;
    }
    .icon-search {
      display: inline-block;
      background: url("../../assets/imgs/icon-search.png") no-repeat center;
      width: 13px;
      height: 17px;
      position: absolute;
      top: 10px;
      left: 10px;
    }
    .address-name {
      line-height: 18px;
      margin-left: 18px;
    }
    .address-desc {
      color: #9ba0a9;
      font-size: 12px;
      padding-left: 8px;
    }
  }
  .drop-down-item:first-child {
    margin-top: 10px;
  }
  .drop-down-item:last-child {
    margin-bottom: 10px;
  }
  .drop-down-item:hover {
    background: #e6f1ff;
  }
  /deep/.search-text {
    color: #1890ff;
  }
}
.desc-drop-down {
  width: 322px;
  position: absolute;
  top: 65px;
  left: 20px;
  box-shadow: 0px 0px 8px 0px rgba(57, 75, 125, 0.3);
  background: #fff;
  text-align: left;
  z-index: 3;
  padding-right: 4px;
  .desc-wrapper {
    max-height: 500px;
    overflow: auto;
  }
  .drop-down-desc {
    padding: 10px 20px;
    cursor: pointer;
    // overflow: hidden;
    // text-overflow: ellipsis;
    // white-space: nowrap;
    border-bottom: 1px solid #eee;
    margin-right: 10px;
    .desc-title {
      color: #454954;
      font-size: 14px;
      line-height: 30px;
    }
    .desc-content {
      color: #9ba0a9;
      font-size: 12px;
      line-height: 20px;
    }
  }
  .drop-down-desc:first-child {
    margin-top: 10px;
  }
  .drop-down-desc:last-child {
    margin-bottom: 10px;
  }
  .drop-down-desc:hover {
    background: #e6f1ff;
  }
  .ant-pagination {
    margin: 16px 0;
    text-align: right;
  }
  /deep/.search-text {
    color: #1890ff;
  }
}
.loading {
  height: 36px;
  text-align: center;
  .loading-icon {
    color: #1890ff;
    font-size: 18px;
    line-height: 36px;
  }
  span {
    font-size: 12px;
    line-height: 36px;
  }
}
</style>
