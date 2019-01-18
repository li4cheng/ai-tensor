<template>
  <div class="data-sync">
    <el-button type="primary" plain @click="onDataUpload">数据上传到中心</el-button>
    <el-button type="primary" plain @click="onRewriteFaceLabel">重写人脸库缓存</el-button>
    <el-button type="primary" plain @click="onResetFaceLabel">重置人脸库</el-button>
  </div>
</template>
<script>
import {
  getCoreSync,
  getRewriteToRedis,
  getResetFaceLabel
} from "@/api/basicConfig/coreSync";
export default {
  methods: {
    // 数据上传到中心
    onDataUpload() {
      getCoreSync().then(res => {
        let isSuccess = res.status === 200;

        // 提示处理
        this.$notify({
          title: isSuccess ? "成功" : "失败",
          message: isSuccess ? "人脸库数据上传成功" : res.message,
          type: isSuccess ? "success" : "error",
          duration: 2000
        });
      });
    },
    // 重写人脸库缓存
    onRewriteFaceLabel() {
      getRewriteToRedis().then(res => {
        let isSuccess = res.status === 200;

        // 提示处理
        this.$notify({
          title: isSuccess ? "成功" : "失败",
          message: isSuccess ? "重写人脸库缓存成功" : res.message,
          type: isSuccess ? "success" : "error",
          duration: 2000
        });
      });
    },
    // 重置人脸库
    onResetFaceLabel() {
      getResetFaceLabel().then(res => {
        let isSuccess = res.status === 200;
        // 提示处理
        this.$notify({
          title: isSuccess ? "成功" : "失败",
          message: isSuccess ? "重置人脸库成功" : res.message,
          type: isSuccess ? "success" : "error",
          duration: 2000
        });
      });
    }
  }
};
</script>
<style>
.data-sync {
  padding: 20px;
}
</style>