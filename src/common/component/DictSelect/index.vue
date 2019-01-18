<template>
  <el-select v-model="currentValue" @change="update" :placeholder="placeholder">
    <el-option v-for="item in typeList" :key="item.id" :label="item.labelDefault" :value="item.value+''"></el-option>
  </el-select>
</template>
<script>
import { getTypeValue } from "@/api/dict/dictValue";

export default {
  model: {
    //      prop: 'modelVal',
    event: "change"
  },
  props: {
    value: {
      type: [String, Number]
    },
    dictName: {
      required: true,
      type: [String, Number]
    },
    placeholder: String
  },
  watch: {
    value(newVal) {
      this.currentValue = newVal && newVal.toString();
    },
    currentValue(newVal) {
      this.$emit("input", newVal);
    },
    dictName() {
      this.getTypeValue();
    }
  },
  data() {
    return {
      currentValue: this.value ? this.value : null,
      typeList: []
    };
  },
  created() {
    this.getTypeValue();
  },
  methods: {
    getTypeValue() {
      getTypeValue(this.dictName).then(resp => {
        this.typeList = resp.data.rows;
      });
    },
    update(val) {
      this.$emit("change", val);
    }
  }
};
</script>
<style lang="scss" scoped></style>
