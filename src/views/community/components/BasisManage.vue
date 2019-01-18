<template>
  <div class="basis-manage">
    <el-row class="main">
      <el-col :span="10" class="left-box">
        <div class="pic">
          <img :src="form.realMapUrl">
        </div>
        <el-upload class="upload" action="" accept=".jpeg,.jpg,.png,.bmp" :auto-upload="false" :show-file-list="false" :on-change="onUpload">
          <el-button size="small">上传小区全景图</el-button>
        </el-upload>
      </el-col>
      <el-col :span="14">
        <el-form ref="form" :model="form" :rules="formRules" label-width="100px">
          <el-form-item label="小区名称" prop="name">
            <el-input v-model="form.name" />
          </el-form-item>
          <el-form-item label="小区地址" prop="address">
            <el-input v-model="form.address" />
          </el-form-item>
          <el-form-item label="小区类型" prop="communityType">
            <dict-select dict-name="community_type" v-model="form.communityType" />
          </el-form-item>
          <el-form-item label="经纬度" prop="lng">
            <el-input :value="form.lng&&form.lat?form.lng+','+form.lat:''" placeholder="请选择经纬度" @focus="showMapLocation" readonly />
          </el-form-item>
          <el-form-item label="小区地图" prop="map">
            <el-button icon="el-icon-edit-outline" @click="dialogVisible = true">编辑</el-button>
            <span>（请先填写准确的小区地址）</span>
          </el-form-item>
          <el-form-item label="物业公司" prop="organizeName">
            <el-input v-model="form.organizeName" />
          </el-form-item>
          <el-form-item prop="lat" class="m0" />
          <el-form-item label="联系人" prop="contactName">
            <el-input v-model="form.contactName" />
          </el-form-item>
          <el-form-item label="联系电话" prop="contactTel">
            <el-input v-model="form.contactTel" />
          </el-form-item>
          <el-form-item label="小区简介" prop="description">
            <el-input type="textarea" resize="none" :autosize="{ minRows: 4 }" v-model="form.description" />
          </el-form-item>
          <div class="heading">
            <el-checkbox v-model="form.appFlag" :true-label="1" :false-label="0">中心联动</el-checkbox>
            <el-form-item prop="appFlag" class="m0" />
          </div>
          <el-form-item label="小区编码" prop="communityCode">
            <el-input v-model="form.communityCode" readonly :disabled="!form.appFlag" />
          </el-form-item>
          <el-form-item label="应用ID" prop="appId">
            <el-input v-model="form.appId" :disabled="!form.appFlag" />
          </el-form-item>
          <el-form-item label="应用密码" prop="appSecret">
            <el-input v-model="form.appSecret" :disabled="!form.appFlag" />
          </el-form-item>
          <el-form-item label="应用URL" prop="appPreUrl">
            <el-input v-model="form.appPreUrl" :disabled="!form.appFlag" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onUpdate" v-permission="'communityMan:btn_edit'">保存</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <el-dialog title="小区地图" class="map-layer body0" :visible.sync="dialogVisible" width="800px">
      <div class="header">
        <el-button size="mini" type="success" icon="el-icon-edit" @click="isEditMap = !isEditMap">{{isEditMap?'结束':'开始'}}绘制小区区域</el-button>
        <el-button size="mini" type="danger" @click="onEmptyPolygon">清空绘制区域</el-button>
        <el-autocomplete size="mini" v-model="locationDetailAddr" :fetch-suggestions="placeSearch" placeholder="请输入查询地址" @select="onAutoSelect"></el-autocomplete>
      </div>
      <div class="map-inner" id="map"></div>
      <div slot="footer">
        <el-button size="mini" @click="dialogVisible = false">取消</el-button>
        <el-button size="mini" type="primary" @click="onMapUpdate">保存</el-button>
      </div>
    </el-dialog>

    <!-- 经纬度选择器 -->
    <map-location ref="locationDialog" :zoom="18" @local="setLocation" />
  </div>
</template>
<script>
import { getCommunity, putCommunity } from "@/api/community";
export default {
  data: () => ({
    aMap: null,
    isEditMap: false,
    mapPointArr: [],
    mapPolygon: null,
    locationDetailAddr: "",
    dialogVisible: false,

    image: {
      width: 1200,
      height: 760
    },
    form: {
      name: null,
      address: null,
      description: null,
      communityType: null,
      lng: null,
      lat: null,
      organizeName: null,
      map: [],
      realMap: null,
      contactName: null,
      contactTel: null,
      appFlag: null,
      communityCode: null,
      appId: null,
      appSecret: null,
      appPreUrl: null
    },
    formRules: {
      name: [{ required: true, message: "小区名称不能为空" }],
      address: [{ required: true, message: "小区地址不能为空" }],
      communityType: [{ required: true, message: "请选择小区类型" }],
      lng: [{ required: true, message: "请选择经纬度" }],
      map: [{ required: true, message: "请配置小区地图" }],
      organizeName: [{ required: true, message: "物业公司不能为空" }]
    }
  }),
  watch: {
    dialogVisible(val) {
      if (val && this.aMap == null) {
        // 初始化地图
        this.$nextTick(() => {
          this.initMap();
        });
      }
      if (val) {
        this.mapPointArr = this.form.map.concat();

        if (this.mapPointArr.length > 2) {
          this.mapPolygon.setPath(this.mapPointArr.concat());
        }
      }
    },
    isEditMap(val) {
      if (val) {
        this.mapPointArr.map(item => {
          new AMap.CircleMarker({
            map: this.aMap,
            center: item,
            radius: 4,
            strokeColor: "#000",
            strokeOpacity: 1,
            strokeWeight: 2,
            fillColor: "#000",
            fillOpacity: 0.3
          });
        });
      } else {
        this.aMap.remove(this.aMap.getAllOverlays("CircleMarker"));
      }
    }
  },
  methods: {
    init() {
      getCommunity().then(res => {
        if (res.status == 200) {
          this.form = res.data;
        }
      });
    },
    // 地图初始化地图
    initMap() {
      // 高德地图调用开始
      this.aMap = new AMap.Map("map", {
        resizeEnable: true,
        zoom: 16
      });
      this.mapPolygon = new AMap.Polygon({
        map: this.aMap,
        path: this.mapPointArr,
        strokeColor: "#0fa0ff",
        strokeOpacity: 1,
        strokeWeight: 3,
        fillColor: "#0fa0ff",
        fillOpacity: 0.3
      });

      // 重新定位中心点
      this.aMap.setFitView();

      // 增加点击绘制地图
      this.aMap.on("click", e => {
        if (!this.isEditMap) return;

        let _arr = [e.lnglat.lng, e.lnglat.lat];
        this.mapPointArr.push(_arr);
        new AMap.CircleMarker({
          map: this.aMap,
          center: _arr,
          radius: 4,
          strokeColor: "#000",
          strokeOpacity: 1,
          strokeWeight: 2,
          fillColor: "#000",
          fillOpacity: 0.3
        });

        if (this.mapPointArr.length > 2) {
          this.mapPolygon.setPath(this.mapPointArr.concat());
        }
      });
    },
    placeSearch(txt, cb) {
      // 添加搜索控件
      this.aMap.plugin(["AMap.PlaceSearch"], () => {
        let _placeSearch = new AMap.PlaceSearch({
          //构造地点查询类
          pageSize: 5,
          pageIndex: 1,
          autoFitView: false
        });
        //关键字查询
        _placeSearch.search(txt, (status, data) => {
          if (status === "complete") {
            let _arr = [];
            data.poiList.pois.forEach(item => {
              _arr.push({
                value: item.name,
                lng: item.location.lng,
                lat: item.location.lat
              });
            });
            cb(_arr);
          }
          return false;
        });
      });
    },
    onAutoSelect(val) {
      // 设置中心点
      if (val.lng && val.lat) {
        this.aMap.setCenter(new AMap.LngLat(val.lng, val.lat));
      }
    },
    onUpload(file) {
      let reader = new FileReader();
      reader.readAsDataURL(file.raw);
      reader.addEventListener("load", () => {
        var image = new Image();
        image.addEventListener("load", () => {
          if (
            image.width == this.image.width &&
            image.height == this.image.height
          ) {
            this.form.realMap = reader.result;
            this.form.realMapUrl = reader.result;
          } else {
            this.$notify({
              title: "提示",
              message: `小区全景图尺寸必须为${this.image.width}X${
                this.image.height
              }`,
              type: "warning",
              duration: 2000
            });
          }
        });
        image.src = reader.result;
      });
    },
    onUpdate() {
      this.$refs.form.validate(valid => {
        if (!valid) return false;

        let _form = Object.assign({}, this.form);
        delete _form.realMapUrl;

        putCommunity(this.form.id, _form).then(res => {
          let isSuccess = res.status === 200;
          this.$notify({
            title: isSuccess ? "成功" : "失败",
            message: isSuccess ? "保存成功" : res.message,
            type: isSuccess ? "success" : "error",
            duration: 2000
          });

          // 保存成功更新数据
          isSuccess && this.init();
        });
      });
    },
    onMapUpdate() {
      if (this.isEditMap) {
        this.$notify({
          title: "提示",
          message: `请先结束绘制`,
          type: "warning",
          duration: 2000
        });
        return;
      }

      if (this.mapPointArr.length < 3) {
        this.$notify({
          title: "提示",
          message: `请绘制小区区域`,
          type: "warning",
          duration: 2000
        });
        return;
      }

      this.form.map = this.mapPointArr.concat();
      this.dialogVisible = false;
    },
    onEmptyPolygon() {
      this.mapPointArr = [];
      this.mapPolygon.setPath(this.mapPointArr.concat());
      this.aMap.remove(this.aMap.getAllOverlays("CircleMarker"));
    },
    // 设置经纬度
    showMapLocation() {
      this.$refs.locationDialog.open({
        lng: this.form.lng,
        lat: this.form.lat
      });
    },
    // 返回经纬度设置
    setLocation(location) {
      this.form = Object.assign({}, this.form, {
        lng: location.lng,
        lat: location.lat
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.basis-manage {
  width: 820px;
  padding: 30px 0 0 30px;
  .heading {
    position: relative;
    line-height: 40px;
    /deep/ .el-checkbox__label {
      padding-left: 6px;
      font-size: 13px;
      font-weight: bold;
      color: #3f4041;
    }
    .el-checkbox {
      background: #fff;
      width: 100px;
      padding-right: 12px;
      text-align: right;
      span {
        font-size: 12px;
        color: #f00;
      }
    }
    &:before {
      position: absolute;
      left: 0;
      right: -18px;
      top: 19px;
      background: #eff1f4;
      height: 1px;
      content: "";
    }
  }
  .left-box {
    text-align: center;
    .pic {
      background: #e3e7e9;
      overflow: hidden;
      border-radius: 8px;
      img {
        display: block;
        width: 100%;
      }
    }
    .el-button {
      margin-top: 20px;
    }
  }
  .el-form {
    /deep/ .el-form-item__label {
      font-size: 13px;
      color: #3f4041;
    }
    span {
      font-size: 13px;
      color: #999;
    }
  }
  .map-layer {
    .header {
      height: 46px;
      line-height: 46px;
      padding: 0 10px;
    }
    .el-autocomplete {
      float: right;
      width: 280px;
    }
    .map-inner {
      width: 100%;
      height: 450px;
      /deep/ {
        .amap-logo,
        .amap-copyright {
          display: none !important;
        }
      }
    }
    .dialog-footer {
      margin-top: 20px;
    }
  }
}
</style>