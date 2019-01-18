<template>
  <el-row class="houses-manage">
    <el-col :span="6" class="menu-tree">
      <div class="title">
        <b>实有房屋</b>
        <el-button size="mini" @click="onAddItem('1', 0)" v-permission="'mlphMan:btn_add'">新增楼号</el-button>
      </div>
      <div class="tree-box">
        <el-input size="mini" placeholder="输入关键字进行过滤" v-model="filterText" clearable></el-input>
        <el-tree ref="menuTree" class="tree" :data="menuData" :filter-node-method="filterNode" @node-expand="onTreeExpand" @node-collapse="onTreeExpand" :default-expanded-keys="treeExpandedKeys" node-key="id" highlight-current :expand-on-click-node="false">
          <div class="menu-item" slot-scope="{ node, data }" @click="onMenuClick(data)">
            {{ node.label }}
            <el-dropdown @command="onCommand($event, data)" class="more">
              <div class="icon">
                <svg-icon icon-class="more" />
              </div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="add" v-if="data.type != 3" v-permission="'mlphMan:btn_add'">添加</el-dropdown-item>
                <el-dropdown-item command="upd" v-permission="'mlphMan:btn_edit'">编辑</el-dropdown-item>
                <el-dropdown-item command="del" v-permission="'mlphMan:btn_delete'">删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-tree>
      </div>
    </el-col>
    <el-col :span="18">
      <el-tabs type="border-card" v-model="tabsActive">
        <el-tab-pane label="人员信息" name="labelManage">
          <label-manage ref="labelManage" :data="tabsData" />
        </el-tab-pane>
      </el-tabs>
    </el-col>

    <el-dialog title="编辑房屋" class="form-layer" :visible.sync="isFormDialog" width="400px">
      <el-form ref="form" :model="form" label-width="60px" v-if="currentRow">
        <el-form-item class="m0" prop="id" />
        <el-form-item label="楼号" prop="buildCode" v-if="currentRow.type == 1">
          <el-input v-model="form.buildCode">
            <template slot="append">号楼</template>
          </el-input>
        </el-form-item>
        <el-form-item label="名称" prop="buildName" v-if="currentRow.type == 1">
          <el-input v-model="form.buildName" />
        </el-form-item>
        <el-form-item label="单元" prop="unitCode" v-if="currentRow.type == 2">
          <el-input v-model="form.unitCode">
            <template slot="append">单元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="房间" prop="roomCode" v-if="currentRow.type == 3">
          <el-input v-model="form.roomCode">
            <template slot="append">室</template>
          </el-input>
        </el-form-item>
        <el-form-item label="名称" prop="roomName" v-if="currentRow.type == 3">
          <el-input v-model="form.roomName" />
        </el-form-item>
        <el-form-item label="面积" prop="roomArea" v-if="currentRow.type == 3">
          <el-input v-model="form.roomArea" />
        </el-form-item>
        <el-form-item label="地址" prop="roomAddress" v-if="currentRow.type == 3">
          <el-input v-model="form.roomAddress" />
        </el-form-item>
        <el-form-item label="类型" prop="type" class="m0">
          <el-select v-model="form.type" disabled>
            <el-option label="楼号" value="1"></el-option>
            <el-option label="单元" value="2"></el-option>
            <el-option label="房间" value="3"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button size="mini" type="primary" @click="onSubmit">保 存</el-button>
        <el-button size="mini" @click="isFormDialog = false">取 消</el-button>
      </div>
    </el-dialog>
  </el-row>
</template>
<script>
import {
  getMlphTree,
  postMlph,
  deleteMlph,
  putMlph,
  getMlph
} from "@/api/community";
export default {
  components: {
    LabelManage: () => import("./LabelManage")
  },
  data: () => ({
    filterText: "",
    menuData: null,
    currentRow: null,
    treeExpandedKeys: [],

    tabsActive: "labelManage",
    tabsData: {},

    isFormDialog: false,
    form: {
      id: null,
      buildCode: null,
      buildName: null,
      unitCode: null,
      roomName: null,
      roomCode: null,
      roomArea: null,
      roomAddress: null,
      type: null,
      parentId: 0
    }
  }),
  watch: {
    filterText(val) {
      this.$refs.menuTree.filter(val);
    }
  },
  methods: {
    init() {
      this.currentRow = null;
      this.isFormDialog = false;
      getMlphTree().then(res => {
        this.menuData = res.data;
      });
    },
    onMenuClick(row) {
      this.tabsData = row;
      this.tabsActive = "labelManage";
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    onTreeExpand(data) {
      let _index = this.treeExpandedKeys.indexOf(data.id);
      if (_index < 0) {
        this.treeExpandedKeys.push(data.id);
      } else {
        this.treeExpandedKeys.splice(_index, 1);
      }
    },
    // 更多操作
    onCommand(command, data) {
      if (command == "del") {
        this.$confirm(`确定删除【${data.label}】？`, "提示", {
          cancelButtonText: "取消",
          confirmButtonText: "确定",
          confirmButtonClass: "el-button--mini",
          cancelButtonClass: "el-button--mini fr",
          type: "warning"
        }).then(() => {
          deleteMlph(data.id).then(res => {
            let isSuccess = res.status === 200;
            // 提示处理
            this.$notify({
              title: isSuccess ? "成功" : "失败",
              message: isSuccess ? "删除成功" : res.message,
              type: isSuccess ? "success" : "error",
              duration: 2000
            });

            if (isSuccess) {
              this.init();
              this.currentRow = null;
            }
          });
        });
      }
      if (command == "upd") {
        this.currentRow = data;

        this.$nextTick(() => {
          getMlph(data.id).then(res => {
            if (res.status == 200) {
              this.form = res.data;
              this.isFormDialog = true;
            }
          });
        });
      }
      if (command == "add") {
        this.onAddItem(parseInt(data.type) + 1 + "", data.id);
        this.isFormDialog = true;
      }
    },
    onAddItem(type, pId) {
      this.currentRow = {
        type: type
      };

      this.$nextTick(() => {
        this.form = {
          id: null,
          buildCode: null,
          buildName: null,
          unitCode: null,
          roomCode: null,
          roomArea: null,
          roomAddress: null,
          type: type,
          parentId: pId
        };
      });
      this.isFormDialog = true;
    },
    onSubmit() {
      if (this.form.id) {
        putMlph(this.form).then(res => {
          let isSuccess = res.status === 200;
          // 提示处理
          this.$notify({
            title: isSuccess ? "成功" : "失败",
            message: isSuccess ? "保存成功" : res.message,
            type: isSuccess ? "success" : "error",
            duration: 2000
          });

          if (isSuccess) {
            this.init();
          }
        });
      } else {
        postMlph(this.form).then(res => {
          let isSuccess = res.status === 200;
          // 提示处理
          this.$notify({
            title: isSuccess ? "成功" : "失败",
            message: isSuccess ? "保存成功" : res.message,
            type: isSuccess ? "success" : "error",
            duration: 2000
          });

          if (isSuccess) {
            this.init();
          }
        });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.houses-manage {
  height: 100%;
  & > .el-col {
    height: 100%;
  }
  .menu-tree {
    background: #fafbfd;
    border-right: 1px solid #e1e1e1;
    overflow: auto;
    .title {
      height: 46px;
      line-height: 46px;
      padding: 0 10px 0 16px;
      font-size: 14px;
      color: #333;
      .el-button {
        float: right;
        margin-top: 10px;
      }
    }
    .tree-box {
      height: calc(100% - 46px);
      padding: 0 6px;
      border-top: 1px solid #e1e1e1;
      .el-input {
        margin: 10px 0;
      }
    }
    .tree {
      background: transparent;
      overflow: auto;
      font-size: 13px;
      color: #333;
      .menu-item {
        position: relative;
        flex: 1;
        height: 100%;
        .more {
          position: absolute;
          top: 0;
          right: 0;
          height: 100%;
          .icon {
            display: inline-block;
            height: 100%;
          }
        }
      }
      /deep/ {
        .el-tree-node.is-current {
          & > .el-tree-node__content {
            background-color: #d5e6f9;
          }
        }
        .el-tree-node__content {
          display: flex;
          &:hover {
            background-color: #e7eff8;
          }
          .el-tree-node__expand-icon {
            margin-top: 0;
          }
        }
      }
    }
  }

  .el-form {
    .m0 {
      margin: 0;
    }
    .el-select {
      width: 100%;
    }
  }

  /* 标签切换 */
  .el-tabs {
    position: relative;
    height: 100%;
    border: 0;
    box-shadow: none;
    /deep/ {
      .el-tabs__item {
        height: 48px;
        line-height: 47px;
      }
      .el-tabs__content {
        height: calc(100% - 48px);
      }
    }
  }
}
</style>