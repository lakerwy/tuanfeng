<template>
  <!-- <section style="padding: 20px; color: red;">Vue App</section> -->
  <section style="padding: 20px; color: red;">
    <router-link :to="{path:'indexItems'}"> 1指标项管理</router-link>||
    <router-link :to="{path:'meatDataIndex'}"> 2元数据管理</router-link>||
    <router-link :to="{path:'latitudeIndex'}"> 3维度管理</router-link>||
    <router-link :to="{path:'monitor'}"> 4监测指标体系</router-link>||
    <router-link :to="{path:'warningTarget'}"> 5预警指标体系</router-link>||
    <router-link :to="{path:'assessmentTarget'}"> 6评估指标体系</router-link>||
    <router-link :to="{path:'regionTarget'}"> 7行政区指标体系</router-link>||
    <router-link :to="{path:'targetIndex'}"> 8目标值管理</router-link>||
    <router-link :to="{path:'ManageIndex'}"> 9对标值管理</router-link>||
    <router-link :to="{path:'CalculationIndex'}"> 10计算方法配置</router-link>||
    <router-link :to="{path:'WarningLevelIndex'}"> 11预警等级配置</router-link>||
    <router-link :to="{path:'UpdateWaylIndex'}"> 12更新方式配置</router-link>||
    <router-link :to="{path:'dataDictionaryIndex'}"> 13数据字典管理</router-link>||
    <router-link :to="{path:'monitoringIndex'}"> 14运行监控</router-link>||
    <router-link :to="{path:'dataSourceIndex'}"> 15数据源配置</router-link>||
    <router-link :to="{path:'SecondaryDevelopment'}"> 16二次开发API</router-link>||
    <router-link :to="{path:'reportMonitoring'}"> 17上报监控</router-link>||
  </section>
</template>
<script>
export default {
  name: "Home"
}
</script>