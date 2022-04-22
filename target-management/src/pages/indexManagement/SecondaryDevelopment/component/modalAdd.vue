<template>
  <div>
    <a-modal
      v-model="visible"
      title="添加服务"
      @ok="handleOk"
      @cancel="handleCancel"
      width="80%"
    >
      <a-table
        :row-selection="rowSelection"
        :columns="columns"
        :data-source="data"
        :pagination="false"
      >
        <template slot="create_date" slot-scope="text">
          <span>{{ text | dateTime }}</span>
        </template>
      </a-table>
      <div class="pagination">
        <a-pagination v-model="current" @change="handlePage" :total="total" show-less-items />
      </div>
    </a-modal>
  </div>
</template>

<script>
import { getServeDataLists, getDataListsAdd } from "@/api/px-api.js";
export default {
  inject: ["reload"],
  props: ["queryId"],
  filters: {
    dateTime: function(val) {
      const dateee = new Date(val).toJSON();
      let date = new Date(+new Date(dateee) + 8 * 3600 * 1000)
        .toISOString()
        .replace(/T/g, " ")
        .replace(/\.[\d]{3}Z/, "");
      return date;
    }
  },
  data() {
    return {
      visible: false,
      data: [],
      columns: [
        {
          title: "序号",
          dataIndex: "num",
          customRender: function(t, r, index) {
            return parseInt(index) + 1;
          },
          align: "center"
        },
        {
          title: "服务名称",
          dataIndex: "service_name",
          scopedSlots: { customRender: "service_name" },
          align: "center"
        },
        {
          title: "服务分组",
          dataIndex: "category_code_desc",
          scopedSlots: { customRender: "category_code_desc" },
          align: "center"
        },
        {
          title: "业务场景",
          dataIndex: "type",
          scopedSlots: { customRender: "type" },
          align: "center"
        },
        {
          title: "机构名称",
          dataIndex: "name",
          scopedSlots: { customRender: "name" },
          align: "center"
        },
        {
          title: "服务地址1级",
          dataIndex: "service_url_classification1",
          scopedSlots: { customRender: "service_url_classification1" },
          align: "center"
        },
        {
          title: "服务地址2级",
          dataIndex: "service_url_classification2",
          scopedSlots: { customRender: "service_url_classification2" },
          align: "center"
        },
        {
          title: "是否有服务",
          dataIndex: "is_self",
          scopedSlots: { customRender: "is_self" },
          align: "center"
        },
        {
          title: "是否授权",
          dataIndex: "is_auth",
          scopedSlots: { customRender: "is_auth" },
          align: "center"
        },
        {
          title: "状态",
          dataIndex: "status",
          scopedSlots: { customRender: "status" },
          align: "center"
        },
        {
          title: "创建时间",
          dataIndex: "create_date",
          scopedSlots: { customRender: "create_date" },
          align: "center"
        }
      ],
      current: 1,
      total: 0,
      query: {
        apiId: this.queryId.toString(),
        serviceId: []
      },
      queryTable:{

      }
    };
  },
  mounted() {
    this.getTableData();
  },
  computed: {
    rowSelection() {
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          this.query.serviceId = selectedRowKeys;
        }
      };
    }
  },
  methods: {
    // 获取表格数据
    async getTableData() {
      let params = {
        service_name: "",
        page: this.current || 1,
        rows: 10,
        create_date_begin: "",
        create_date_end: "",
        category_code: ""
      };
      let res = await getServeDataLists(params);
      const { rows,total } = res;
      rows.forEach(element => {
        element.key = element.id;
        if (element.is_self === 0) {
          element.is_self = "否";
        } else {
          element.is_self = "是";
        }
        if (element.is_auth === 0) {
          element.is_auth = "公开";
        } else {
          element.is_auth = "需要授权";
        }
        if (element.status === 1) {
          element.status = "启动";
        } else if (element.status === 2) {
          element.status = "停止";
        } else {
          element.status = "已删除";
        }
      });
      this.data = rows;
      this.total=total
      // console.log(this.data);
    },
    async getAddData() {
      let params = this.query;
      let res = await getDataListsAdd(params);
      // console.log(res)
      if (res == true) {
        this.$notification.open({
          message: "新增服务成功",
          icon: <a-icon type="smile" style="color: #108ee9" />
        });
        this.reload();
      } else {
        this.$notification.open({
          message: "服务新增失败！",
          icon: <a-icon type="close-circle" style="color: rgb(232,97,97)" />
        });
      }
    },
    handlePage (current) {
      this.current = current
      this.getTableData()
    },
    handleOk() {
      this.getAddData();
      this.$parent.isShowAdd = false;
      this.visible = false;
    },
    handleCancel() {
      this.visible = false;
      this.$parent.isShowAdd = false;
    }
  }
};
</script>

<style lang="less" scoped>
@vw: 22.2vw;
@vh: 10.8vh;
* {
  box-sizing: border-box;
}
.pagination {
  text-align: right;
  margin-top: 20px;
}
</style>
