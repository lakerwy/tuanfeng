<template>
    <div class="headerBox">
        <div class="titles">{{titles}}</div>
        <div class="navBox">
            <div :class="index==tabIndex?'navLists choosen':'navLists'" v-for="(item,index) in tabList" :key="index" @click="changeTab(index)">{{item}}</div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            titles:'模型管理',
            tabIndex:0,
            tabList:["模型","平台","任务","定时调度","日志","节点","用户"]
        }
    },
    methods: {
        changeTab(index){
            this.tabIndex = index;
        }
    },
}
</script>
<style lang="less">
    .headerBox{
        width: 100%;
        height: 100%;
        background: #1667ec;
        .titles{
            color:#fff;
            line-height: 60px;
            font-size: 24px;
            float: left;
            padding-left: 36px;
        }
        .navBox{
            float: left;
            height: 60px;
            line-height: 60px;
            margin-left: 130px;
            .navLists{
                color:#fffeff;
                padding: 0 20px;
                float: left;
                font-size: 18px;
                cursor: pointer;
                margin: 0 10px;
            }
            .choosen{
                background: #084fc3;
            }
        }
    }
</style>