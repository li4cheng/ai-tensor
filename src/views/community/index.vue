<template>
  <el-tabs type="border-card" class="app-container" @tab-click="onTabsChange" v-model="tabsActive">
    <el-tab-pane label="基础信息" name="basisManage">
      <basis-manage ref="basisManage" />
    </el-tab-pane>
    <el-tab-pane label="实有信息" name="housesManage">
      <houses-manage ref="housesManage" />
    </el-tab-pane>
  </el-tabs>
</template>
<script>
export default {
  name: "communityManager",
  components: {
    BasisManage: () => import("./components/BasisManage"),
    HousesManage: () => import("./components/HousesManage")
  },
  data: () => ({
    tabsActive: "basisManage",
    initState: {
      basisManage: true,
      HousesManage: false
    }
  }),
  mounted() {
    this.initRecursion();
  },
  methods: {
    onTabsChange(tab) {
      this.tabsActive = tab.name;
      // 判断是否需要初始化
      if (!this.initState[this.tabsActive]) {
        this.initState[this.tabsActive] = true;
        this.$refs[this.tabsActive].init && this.$refs[this.tabsActive].init();
      }
    },
    initRecursion() {
      this.$nextTick(() => {
        if (this.$refs[this.tabsActive]) {
          this.$refs[this.tabsActive].init();
        } else {
          setTimeout(() => {
            this.initRecursion();
          }, 200);
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.app-container {
  position: relative;
  height: 100%;
  /deep/ {
    .el-tabs__content {
      height: calc(100% - 46px);
      padding: 0;
      overflow: auto;
    }
    .el-tabs__header {
      background: #fafbfd;
    }
    .el-tab-pane {
      height: 100%;
    }
    .el-tabs__item {
      width: 120px;
      height: 46px;
      line-height: 46px;
      padding: 0 !important;
      border-right: 1px solid #e4e5e6;
      text-align: center;
      font-size: 14px;
      color: #666;
      &.is-active {
        background: #eaeaea;
        font-weight: bold;
        color: #353535;
      }
    }
  }
}
</style>
