<template>
  <collapse-transition>
    <ul :class="classes">
      <li class="row">
        <template v-for="(column, index) in columns">
          <div
            :class="['cell-wrapper', {'cell-wrapper-border': bottomLine}]"
            :key="`cell-${index}`"
          >
            <div
              :class="['cell', column.className]"
              :style="cellStyle(column, index)"
            >
              <template v-if="index === 0">
                <span
                  :class="arrowClasses"
                  @click="handleExpand"
                  :style="{marginLeft: `${data.nodeLevel * 18}px`}"
                >

                  <span v-if="showArrow">
                    <img  v-if="data.expand" src="../../assets/images/roll-up.png" alt="" srcset="">
                    <img  v-else src="../../assets/images/expand.png" alt="" srcset="">
                  </span>
                  <!--<Icon
                    v-if="showArrow"
                    :type="data.expand ? arrowIconDown : arrowIconRight"
                  ></Icon>-->
                  <Icon
                    v-if="showLoading"
                    :type="loadingIcon"
                    class="ivu-load-loop"
                  ></Icon>
                </span>
                <Checkbox
                  v-if="showCheckbox"
                  :value="data.checked"
                  :indeterminate="data.indeterminate"
                  :disabled="data.disabled || data.disableCheckbox"
                  @click.native.prevent="handleCheck"
                ></Checkbox>
              </template>
              <Render
                v-if="column.render"
                :render="column.render"
                :params="{data, row: data, node, column}"
              ></Render>
              <template v-else>{{ data[column.key] }}</template>
            </div>
          </div>
        </template>
        <Tree-Table-node
          v-if="data.expand"
          v-for="(item, i) in children"
          :key="`child-${i}`"
          :data="item"
          :columns="columns"
          :columns-width="columnsWidth"
          :bottom-line="bottomLine"
          :show-checkbox="showCheckbox"
          :arrow-icon-down="arrowIconDown"
          :arrow-icon-right="arrowIconRight"
          :loading-icon="loadingIcon"
          :children-key="childrenKey"
        >
        </Tree-Table-node>
      </li>
    </ul>
  </collapse-transition>
</template>
<script>
import Render from './render';
import CollapseTransition from 'collapse-transition';

const prefixCls = 's-tree';

export default {
  name: 'TreeTableNode',
  components: {
    Render,
    CollapseTransition
  },
  props: {
    data: {
      type: Object,
      default() {
        return {};
      }
    },
    columns: {
      type: Array,
      default() {
        return [];
      }
    },
    bottomLine: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    },
    childrenKey: {
      type: String,
      default: 'children'
    },
    showCheckbox: {
      type: Boolean,
      default: false
    },
    columnsWidth: {
      type: Object
    },
    arrowIconRight: {
      type: String,
      default: 'ios-arrow-dropup'
    },
    arrowIconDown: {
      type: String,
      default: 'ios-arrow-dropdown'
    },
    loadingIcon: {
      type: String,
      default: 'load-c'
    }
  },
  data() {
    return {
      prefixCls: prefixCls
    };
  },
  computed: {
    classes() {
      return [
        `${prefixCls}-children`
      ];
    },
    arrowClasses() {
      return [
        `${prefixCls}-arrow`,
        {
          [`${prefixCls}-arrow-disabled`]: this.data.disabled
        }
      ];
    },
    showArrow() {
      return (this.data[this.childrenKey] && this.data[this.childrenKey].length) || ('loading' in this.data && !this.data.loading);
    },
    showLoading() {
      return 'loading' in this.data && this.data.loading;
    },
    node() {
      const Tree = this.findComponentUpward(this, 'IviewTreeTable');
      if (Tree) {
        // 将所有的 node（即flatState）和当前 node 都传递
        return [Tree.flatState, Tree.flatState.find(item => item.nodeKey === this.data.nodeKey)];
      } else {
        return [];
      }
    },
    children() {
      return this.data[this.childrenKey];
    }
  },
  methods: {
    cellStyle(cell, index) {
      const style = { width: `${parseInt(this.columnsWidth[cell._index]) + (index === 0 ? 50 : 0)}px` };
      if (cell.ellipsis) {
        style.overflow = 'hidden';
        style.wordWrap = 'normal';
      }
      return style;
    },
    handleExpand() {
      const item = this.data;
      if (item.disabled) return;

      // 异步加载
      if (item[this.childrenKey].length === 0) {
        const tree = this.findComponentUpward(this, 'IviewTreeTable');
        if (tree && tree.loadData) {
          this.$set(this.data, 'loading', true);
          tree.loadData(item, children => {
            this.$set(this.data, 'loading', false);
            if (children.length) {
              this.$set(this.data, this.childrenKey, children);
              this.$nextTick(() => this.handleExpand());
            }
          });
          return;
        }
      }

      if (item[this.childrenKey] && item[this.childrenKey].length) {
        this.$set(this.data, 'expand', !this.data.expand);
        this.dispatch('IviewTreeTable', 'toggle-expand', this.data);
      }
    },
    handleCheck() {
      if (this.data.disabled) return;
      const changes = {
        checked: !this.data.checked && !this.data.indeterminate,
        nodeKey: this.data.nodeKey
      };
      this.dispatch('IviewTreeTable', 'on-check', changes);
    },
    findComponentUpward(context, componentName, componentNames) {
      if (typeof componentName === 'string') {
        componentNames = [componentName];
      } else {
        componentNames = componentName;
      }

      let parent = context.$parent;
      let name = parent.$options.name;
      while (parent && (!name || componentNames.indexOf(name) < 0)) {
        parent = parent.$parent;
        if (parent) name = parent.$options.name;
      }
      return parent;
    }
  }
};
</script>
<style lang="less" scoped>
.tree-table {
  .row {
    .cell-wrapper-border {
      border-bottom: 1px solid #e8eaec;
    }
    .cell-wrapper {
      display: table-cell;
      vertical-align: middle;
      height: 40px;
      border-bottom: 1px solid #e8eaec;
      .cell:first-child {
        // white-space: nowrap;
        white-space: normal;
      }
      .cell {
        display: inline-block;
        word-wrap: break-word;
        text-overflow: ellipsis;
        text-align: left;
        padding: 17px 14px;
        white-space: normal;
      }
    }
  }
}
.s-tree {
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    font-size: 12px;
    // border-bottom: 1px solid #e8e8e8;
    li {
      list-style: none;
      padding: 0;
      white-space: nowrap;
      outline: 0;
    }
  }
}
.s-tree-arrow {
  cursor: pointer;
  width: 24px;
  text-align: center;
  display: inline-block;
  font-size: 18px;
}
</style>
