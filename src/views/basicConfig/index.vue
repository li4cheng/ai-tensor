<template>
  <div class="app-container">
    <el-tabs type="border-card" v-model="tabsActive" @tab-click="onTabsChange">
      <el-tab-pane label="菜单管理" name="menu">
        <menu-component ref="menu" v-permission="'basicConfig:view_menu'" />
      </el-tab-pane>
      <el-tab-pane label="数据字典" name="dict">
        <dict-component ref="dict" v-permission="'basicConfig:view_dict'" />
      </el-tab-pane>
      <el-tab-pane label="人脸参数配置" name="face">
        <face-component ref="face" v-permission="'basicConfig:view_config'" />
      </el-tab-pane>
      <el-tab-pane label="提示音管理" name="sound">
        <sound-component ref="sound" v-permission="'basicConfig:view_voice'" />
      </el-tab-pane>
      <el-tab-pane label="后台管理" name="system">
        <system-component ref="system" v-permission="'basicConfig:view_system'" />
      </el-tab-pane>
      <el-tab-pane label="中心同步" name="sync">
        <core-sync ref="sync" v-permission="'commonMan:btn_push_center'" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: "base-manager",
  data() {
    return {
      tabsActive: "menu",
      initState: {
        menu: true,
        sync: false,
        dict: false,
        face: false,
        sound: false,
        system: false
      }
    };
  },
  components: {
    "core-sync": () => import("./coreSync"),
    "menu-component": () => import("./menu"),
    "dict-component": () => import("../dict"),
    "sound-component": () => import("./sound"),
    "face-component": () => import("../config/manager"),
    "system-component": () => import("../systemConfig")
  },
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
  .el-tabs {
    height: 100%;
  }
  /deep/ {
    .el-tabs__content {
      height: calc(100% - 45px);
      padding: 0;
      overflow: auto;
    }
    .el-tabs__header {
      background: #fafbfd;
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
    .el-tab-pane {
      height: 100%;
    }
    .input-label {
      margin-right: 10px;
      font-size: 14px;
      font-weight: normal;
    }
    .el-tabs__active-bar {
      display: none;
    }
  }
}
</style>
