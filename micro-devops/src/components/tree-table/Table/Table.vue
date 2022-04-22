<template lang="html">
  <div
    v-if="columns.length > 0"
    ref="table"
    :class="[prefixCls, tableClass]">
    <div
      v-show="showHeader"
      ref="header-wrapper"
      :class="`${prefixCls}__header-wrapper`"
      @mousewheel="handleEvent('header', $event)">
      <TableHeader
        ref="table-header">
      </TableHeader>
    </div>
    <div
      ref="body-wrapper"
      :style="bodyWrapperStyle"
      :class="`${prefixCls}__body-wrapper`"
      @scroll="handleEvent('body', $event)">
      <TableBody
        ref="table-body"
        :class="bodyClass">
      </TableBody>
    </div>
    <div
      v-show="showSummary && data.length > 0"
      ref="footer-wrapper"
      :class="`${prefixCls}__footer-wrapper`"
      @mousewheel="handleEvent('footer', $event)">
      <TableFooter
        ref="table-footer">
      </TableFooter>
    </div>
    <Spin fix size="large" v-if="loading">
      <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
      <div>加载中...</div>
        <!-- <slot name="loading"></slot> -->
    </Spin>
  </div>
</template>

<script>
import TableHeader from './TableHeader'
import TableBody from './TableBody'
import TableFooter from './TableFooter'
import mixins from './utils/mixins'
import getSbw from './utils/scrollBarWidth'
// import { mixins, scrollBarWidth as getSbw } from './utils';

/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
function getBodyData (data, isTreeType, childrenProp, isFold, level = 1, selectTr) {
  let bodyData = []
  data.forEach((row, index) => {
    const children = row[childrenProp]
    const childrenLen = Object.prototype.toString.call(children).slice(8, -1) === 'Array' ? children.length : 0
    bodyData.push({
      _isHover: false,
      _isExpanded: false,
      _isChecked: false,
      _level: level,
      _isHide: isFold ? level !== 1 : false,
      _isFold: isFold,
      _childrenLen: childrenLen,
      _normalIndex: index + 1,
      _selectTr: selectTr,
      ...row
    })
    if (isTreeType) {
      if (childrenLen > 0) {
        bodyData = bodyData.concat(getBodyData(children, true, childrenProp, isFold, level + 1, selectTr))
      }
    }
  })
  return bodyData
}

function initialState (table, expandKey) {
  return {
    bodyHeight: '580px',
    firstProp: expandKey || (table.columns[0] && table.columns[0].key),
    bodyData: getBodyData(table.data, table.treeType, table.childrenProp, table.isFold, table.level, table.selectTr)
  }
}

function initialColumns (table, clientWidth) {
  let columnsWidth = 0
  const minWidthColumns = []
  const otherColumns = []
  const columns = table.columns.concat()
  // if (table.expandType) {
  //   columns.unshift({
  //     width: '50',
  //   });
  // }
  if (table.selectType !== 'text') {
    columns.unshift({
      width: '50'
    })
  }
  if (table.showIndex) {
    columns.unshift({
      width: '50px',
      key: '_normalIndex',
      title: table.indexText
    })
  }
  columns.forEach((column, index) => {
    let width = ''
    let minWidth = ''
    if (!column.width) {
      if (column.minWidth) {
        minWidth = typeof column.minWidth === 'number' ? column.minWidth : parseInt(column.minWidth, 10)
      } else {
        minWidth = 80
      }
      minWidthColumns.push({
        ...column,
        minWidth,
        _index: index
      })
    } else {
      width = typeof column.width === 'number' ? column.width : parseInt(column.width, 10)
      otherColumns.push({
        ...column,
        width,
        _index: index
      })
    }
    columnsWidth += minWidth || width
  })
  const scrollBarWidth = getSbw
  const totalWidth = columnsWidth + scrollBarWidth
  const isScrollX = totalWidth > clientWidth
  if (!isScrollX) {
    const extraWidth = clientWidth - totalWidth
    const averageExtraWidth = Math.floor(extraWidth / minWidthColumns.length)
    minWidthColumns.forEach((column) => {
      column.computedWidth = column.minWidth + averageExtraWidth
    })
  }
  const tableColumns = otherColumns.concat(minWidthColumns)
  tableColumns.sort((a, b) => a._index - b._index)
  return tableColumns
}

export default {
  name: 'TreeTable',
  mixins: [mixins],
  components: {
    TableHeader,
    TableBody,
    TableFooter
  },
  props: {
    data: {
      type: Array,
      default: () => []
    },
    columns: {
      type: Array,
      default: () => []
    },
    Height: {
      type: [String, Number],
      default: 'auto'
    },
    maxHeight: {
      type: [String, Number],
      default: 'auto'
    },
    stripe: {
      type: Boolean,
      default: false
    },
    border: {
      type: Boolean,
      default: false
    },
    treeType: {
      type: Boolean,
      default: true
    },
    childrenProp: {
      type: String,
      default: 'children'
    },
    isFold: {
      type: Boolean,
      default: true
    },
    expandType: {
      type: Boolean,
      default: true
    },
    selectable: {
      type: Boolean,
      default: true
    },
    selectType: {
      type: String,
      default: 'text'
    },
    emptyText: {
      type: String,
      default: '暂无数据'
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    showIndex: {
      type: Boolean,
      default: false
    },
    indexText: {
      type: String,
      default: '序号'
    },
    showSummary: {
      type: Boolean,
      default: false
    },
    sumText: {
      type: String,
      default: '合计'
    },
    summaryMethod: Function,
    showRowHover: {
      type: Boolean,
      default: true
    },
    rowKey: Function,
    rowClassName: [String, Function],
    cellClassName: [String, Function],
    rowStyle: [Object, Function],
    cellStyle: [Object, Function],
    expandKey: String,
    selectTr: {
      type: String,
      default: ''
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      computedWidth: '',
      computedHeight: '',
      tableColumns: [],
      ...initialState(this, this.expandKey)
    }
  },
  computed: {
    bodyWrapperStyle () {
      return {
        height: this.bodyHeight,
        overflowY: 'scroll'
      }
    },
    tableClass () {
      return {
        [`${this.prefixCls}--border`]: this.border
      }
    },
    bodyClass () {
      return {
        [`${this.prefixCls}--stripe`]: this.stripe
      }
    }
  },
  methods: {
    handleEvent (type, $event) {
      this.validateType(type, ['header', 'body', 'footer'], 'handleEvent')
      const eventType = $event.type
      if (eventType === 'scroll') {
        this.$refs['header-wrapper'].scrollLeft = $event.target.scrollLeft
        this.$refs['footer-wrapper'].scrollLeft = $event.target.scrollLeft
      }
      if (eventType === 'mousewheel') {
        const deltaX = $event.deltaX
        const $body = this.$refs['body-wrapper']
        if (deltaX > 0) {
          $body.scrollLeft += 10
        } else {
          $body.scrollLeft -= 10
        }
      }
      return this.$emit(`${type}-${eventType}`, $event)
    },
    // computedWidth, computedHeight, tableColumns
    measure () {
      this.$nextTick(() => {
        const { clientWidth, clientHeight } = this.$el
        this.computedWidth = clientWidth + 2
        this.computedHeight = clientHeight + 2
        const maxHeight = parseInt(this.maxHeight, 10)
        // if (this.maxHeight !== 'auto' && this.computedHeight > maxHeight) {
        if (this.maxHeight !== 'auto') {
          this.bodyHeight = `${maxHeight - 83}px`
        }
        this.tableColumns = initialColumns(this, clientWidth)
      })
    },
    getCheckedProp (key = 'index') {
      if (!this.selectable) {
        return []
      }
      const checkedIndexs = []
      this.bodyData.forEach((item, index) => {
        if (item._isChecked) {
          if (key === 'index') {
            checkedIndexs.push(index)
          } else {
            checkedIndexs.push(item[key])
          }
        }
      })
      return checkedIndexs
    }
  },
  watch: {
    data: {
      deep: true,
      immediate: true,
      handler () {
        let temparr = this.bodyData
        Object.assign(this.$data, initialState(this, this.expandKey))
        this.bodyData.forEach(item => {
          temparr.forEach(itm => {
            if (item.id === itm.id) {
              item._isHover = itm._isHover
              item._isExpanded = itm._isExpanded
              item._isChecked = itm._isChecked
              item._level = itm._level
              item._isHide = itm._isHide
              item._isFold = itm._isFold
              item._normalIndex = itm._normalIndex
              item._selectTr = itm._selectTr
            }
          })
        })
      }
    }
  },
  updated () {
    // this.measure()
  },
  mounted () {
    this.measure()
    window.addEventListener('resize', this.measure)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.measure)
  }
}
</script>

<style lang="less" src="./Table.less"></style>
