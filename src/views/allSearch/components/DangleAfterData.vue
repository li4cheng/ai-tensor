<template>
  <div class="dangle-after-data">

    <!-- 工具栏 -->
    <div class="common-tool">
      <div class="info">
        <img-show class="pic" width="32px" height="32px" text="暂无头像" :img-src="data.identityImg" />
        <div class="name">{{data.name}}</div>
        <p>{{data.identityNo}}</p>
      </div>

      <!-- 表单筛选 -->
      <el-form class="form" @keyup.enter.native="onSubmit">
        <span>时间</span>
        <el-date-picker size="mini" v-model="pickerValue" type="datetimerange" :picker-options="pickerOptions" range-separator="|" @change="onPickerChange" start-placeholder="开始日期" end-placeholder="结束日期" align="center" :clearable="false" :editable="false">
        </el-date-picker>
        <el-button size="mini" type="primary" @click="onSubmit">开始分析</el-button>
        <el-button size="mini" @click="onReset">重置</el-button>
      </el-form>
    </div>

    <!-- 数据展示 -->
    <el-table :data="listTableData.rows" class="table" v-loading="listTableLoading" height="calc(100vh - 256px)">
      <el-table-column align="center" label="尾随人" width="80">
        <template slot-scope="scope">
          <img-show width="48px" height="48px" txt="暂无头像" :img-src="scope.row.strangerImg"></img-show>
        </template>
      </el-table-column>
      <el-table-column label="姓名/证件号" width="180px">
        <template slot-scope="scope">
          <div class="identity">
            <label>{{scope.row.strangerName}}</label>
            <p>{{scope.row.strangerNo}}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="" width="50">
        <template slot-scope="scope">
          <span>尾随</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="被尾随人" width="80">
        <template slot-scope="scope">
          <img-show width="48px" height="48px" txt="暂无头像" :img-src="scope.row.identityImg"></img-show>
        </template>
      </el-table-column>
      <el-table-column label="姓名/证件号" width="180px">
        <template slot-scope="scope">
          <div class="group">
            <label>{{scope.row.name}}</label>
            <p>{{scope.row.identityNo}}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="num" label="次数" min-width="70"></el-table-column>
      <el-table-column prop="lastSnapAddr" label="最后抓拍地址/时间" min-width="180">
        <template slot-scope="scope">
          <div class="group">
            <label>{{scope.row.lastSnapAddr}}</label>
            <p>{{scope.row.lastSnapTime}}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="100">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="onDetail(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="onListLimit" @current-change="onListPaging" :current-page="listQuery.offset" :page-sizes="[15,100,250]" :page-size="listQuery.limit" :total="listTableData.total" layout="total, sizes, prev, pager, next, jumper"> </el-pagination>

    <!-- 尾随详情 -->
    <el-dialog title="尾随详情" class="detail-layer body0" :visible.sync="isDialogDateil" width="1050px">
      <el-row>
        <el-col :span="11" class="info segmentation">
          <img-show width="80px" height="80px" txt="暂无头像" :img-src="detailData.strangerImg"></img-show>
          <div class="title">尾随人：</div>
          <div class="txt name">
            <svg-icon icon-class="user" />
            <b>{{detailData.strangerName}}</b>
          </div>
          <div class="txt">
            <svg-icon icon-class="credentials" />
            <label>{{detailData.strangerNo}}</label>
          </div>
        </el-col>
        <el-col :span="11" class="info">
          <img-show width="80px" height="80px" txt="暂无头像" :img-src="detailData.identityImg"></img-show>
          <div class="title t1">被尾随人：</div>
          <div class="txt name">
            <svg-icon icon-class="user" />
            <b>{{detailData.name}}</b>
            <div class="label-box" v-if="detailData.labelNames">
              <span class="label-item" v-for="(item,index) in detailData.labelNames.split(',')" :key="index" :style="{backgroundColor:item.split('|')[1],color:colorBrightness(item.split('|')[1])}">{{item.split('|')[0]}}</span>
            </div>
          </div>
          <div class="txt">
            <svg-icon icon-class="credentials" />
            <label>{{detailData.identityNo}}</label>
          </div>
        </el-col>
        <el-col :span="2" class="num" v-if="detailData.records"><b>{{detailData.records.length}}</b>次</el-col>
      </el-row>
      <el-table :data="detailData.records" class="table" height="calc(100vh - 540px)">
        <el-table-column align="center" label="尾随人" width="80">
          <template slot-scope="scope">
            <img-show width="48px" height="48px" txt="暂无头像" :img-src="scope.row.strangerImgBase"></img-show>
          </template>
        </el-table-column>
        <el-table-column align="center" label="背景图" width="180">
          <template slot-scope="scope">
            <img-show height="48px" txt="暂无背景" :img-src="scope.row.strangerImgBgUrl" class="bg"></img-show>
          </template>
        </el-table-column>
        <el-table-column align="center" label="" width="50">
          <template slot-scope="scope">
            <span>尾随</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="被尾随人" width="80">
          <template slot-scope="scope">
            <img-show width="48px" height="48px" txt="暂无头像" :img-src="scope.row.identityImgBase"></img-show>
          </template>
        </el-table-column>
        <el-table-column align="center" label="背景图" width="180">
          <template slot-scope="scope">
            <img-show height="48px" txt="暂无背景" :img-src="scope.row.identityImgBgUrl" class="bg"></img-show>
          </template>
        </el-table-column>
        <el-table-column align="center" label="其他被尾随人员" width="180">
          <template slot-scope="scope">
            <span v-if="!scope.row.others.length">无</span>
            <!-- swiper -->
            <swiper class="swiper" ref="swiper" :options="swiperOption" v-else>
              <swiper-slide v-for="(item,index) in scope.row.others" :key="index">
                <img-show class="pic" width="48px" height="48px" txt="暂无头像" :img-src="item.identityImg">
                  <div class="mask">{{item.name}}</div>
                </img-show>
              </swiper-slide>
              <div class="swiper-pagination" slot="pagination"></div>
            </swiper>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="cameraName" label="抓拍地点"></el-table-column>
        <el-table-column align="center" prop="snapTime" label="最后抓拍时间"></el-table-column>
      </el-table>

      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="isDialogDateil=false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import moment from "moment";
import { pickerOptions } from "@/utils";
import { getDangleAfterList, getDangleAfterDetail } from "@/api/dangleAfter";

import "swiper/dist/css/swiper.css";
import { swiper, swiperSlide } from "vue-awesome-swiper";

export default {
  name: "dangleAfter",
  components: {
    swiper,
    swiperSlide
  },
  props: {
    data: [Array, Object]
  },
  data() {
    return {
      isDialogDateil: false,
      listQuery: {
        timeStart: moment()
          .subtract(1, "d")
          .format("YYYYMMDDHHmmss"),
        timeEnd: moment().format("YYYYMMDDHHmmss"),
        keyword: "",
        image: "",
        offset: 1,
        limit: 15
      },
      currentUser: null,
      listTableData: {}, // 尾随列表返回的数据
      detailData: {}, // 尾随详情
      listTableLoading: false,
      pickerValue: [moment().subtract(1, "d"), moment()],
      pickerOptions: pickerOptions,

      swiperOption: {
        slidesPerView: "auto",
        spaceBetween: 5,
        freeMode: true
      }
    };
  },
  methods: {
    init() {
      this.listQuery.keyword = this.data.identityNo;

      this.onSubmit();
    },
    // 日期选择器变更
    onPickerChange(date) {
      if (!date) return;
      this.listQuery.timeStart = moment(date[0]).format("YYYYMMDDHHmmss");
      this.listQuery.timeEnd = moment(date[1]).format("YYYYMMDDHHmmss");
    },
    onDetail(row) {
      getDangleAfterDetail({
        identityNo: row.identityNo,
        strangerNo: row.strangerNo
      }).then(res => {
        let isSuccess = res.status === 200;
        // 错误处理
        if (!isSuccess) {
          this.$notify({
            title: "失败",
            message: res.message,
            type: "error",
            duration: 2000
          });
          return;
        }

        this.detailData = res.data;
        this.isDialogDateil = true;
        this.$nextTick(() => {
          this.$refs.swiper.update();
        });
      });
    },
    onReset() {
      this.listQuery = {
        timeStart: moment()
          .subtract(1, "d")
          .format("YYYYMMDDHHmmss"),
        timeEnd: moment().format("YYYYMMDDHHmmss"),
        keyword: this.data.identityNo,
        image: "",
        offset: 1,
        limit: 15
      };
      this.pickerValue = [moment().subtract(1, "d"), moment()];
      this.$refs.pictureSearch.reset();
    },
    // 尾随分析提交
    onSubmit() {
      this.listTableLoading = true;
      getDangleAfterList(this.listQuery)
        .then(res => {
          let isSuccess = res.status === 200;
          // 错误处理
          if (!isSuccess) {
            this.$notify({
              title: "失败",
              message: res.message,
              type: "error",
              duration: 2000
            });
            return;
          }

          this.listTableData = res.data;
        })
        .finally(() => {
          this.listTableLoading = false;
        });
    },
    onListPaging(val) {
      this.listQuery.offset = val;
      this.onSubmit();
    },
    onListLimit(val) {
      this.listQuery.limit = val;
      this.onSubmit();
    }
  }
};
</script>
<style lang="scss" scoped>
.dangle-after-data {
  .common-tool {
    border-top: 0;
    overflow: hidden;
    .info {
      position: relative;
      float: left;
      width: 200px;
      height: 40px;
      line-height: 140%;
      padding: 4px 6px 0 0;
      font-size: 13px;
      color: #9da5af;
      &:before {
        position: absolute;
        top: 50%;
        right: 0;
        background: #d2d5d6;
        width: 1px;
        height: 20px;
        margin-top: -10px;
        content: "";
      }
      .img-show {
        float: left;
        margin-right: 6px;
        border: 1px solid #dfe2e5;
        border-radius: 1px;
      }
      .name {
        font-size: 16px;
        font-weight: bold;
        color: #333;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
  .form {
    overflow: hidden;
    span {
      display: inline-block;
      padding: 0 2px 0 10px;
      text-align: right;
      font-size: 13px;
      color: #3f4041;
    }
    .el-date-editor {
      width: 330px;
    }
    .el-button {
      margin-left: 0;
    }
  }
  .main {
    position: absolute;
    top: 52px;
    right: 0;
    bottom: 0;
    left: 0;
  }
  .table {
    span {
      color: #b1b7bf;
    }
  }
  .img-show {
    margin: 0 auto;
    overflow: hidden;
    border-radius: 4px;
  }
  .group {
    line-height: 140%;
    label {
      font-size: 14px;
    }
    p {
      color: #9da5af;
    }
  }
  .el-pagination {
    padding: 10px;
  }
}

.detail-layer {
  .el-row {
    background: #fafbfd;
    margin-bottom: 4px;
    border-bottom: 1px solid #e5e5e5;
  }
  .label-box {
    display: inline-block;
    height: 22px;
    vertical-align: top;
  }
  .label-item {
    display: inline-block;
    height: 22px;
    line-height: 18px;
    margin: 0 2px;
    padding: 0 3px;
    text-align: center;
    border: 2px #fff solid;
    border-radius: 99px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    vertical-align: top;
    font-size: 12px;
    color: #fff;
  }
  .info {
    padding: 12px 15px;
    &.segmentation {
      border-right: 1px solid #e0e4ea;
    }
    .title {
      line-height: 26px;
      margin-bottom: 4px;
      font-size: 16px;
      font-weight: bold;
      color: #fd0a02;
      &.t1 {
        color: #0fa0ff;
      }
    }
    .img-show {
      float: left;
      margin-right: 20px;
    }
    .txt {
      height: 16px;
      line-height: 16px;
      &.name {
        height: 26px;
        line-height: 26px;
        font-size: 14px;
        color: #333;
      }
      label {
        font-size: 12px;
        color: #9da5af;
      }
      .svg-icon {
        display: inline-block;
        height: 100%;
        margin-right: 4px;
        vertical-align: top;
        color: #b5c0cd;
      }
    }
  }
  .num {
    padding-top: 46px;
    font-size: 12px;
    color: #333;
    b {
      margin-right: 4px;
      font-size: 36px;
      color: #ffc600;
    }
  }
  .swiper-slide {
    width: 48px;
  }
  .bg {
    display: inline-block;
    vertical-align: top;
  }
  .pic {
    position: relative;
    .mask {
      position: absolute;
      right: 0;
      bottom: 0;
      left: 0;
      background: rgba(0, 0, 0, 0.4);
      line-height: 14px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 12px;
      color: #fff;
    }
  }
}
</style>
