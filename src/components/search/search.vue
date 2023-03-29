<template>
  <view class="search" @click="gotoSearch">
    <view class="my-search-container" :style="{ 'background-color': bgcolor }">
      <view class="my-search-box" :style="{ 'border-radius': radius + 'px' }">
        <uni-icons type="search" size="17"></uni-icons>
        <text class="placeholder">搜索</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "search",
  props: {
    bgcolor: {
      type: String,
      default: "#C00000",
    },
    radius: {
      // 单位：px
      type: Number,
      default: 18
    }
  },
  methods: {
    gotoSearch() {
      this.$emit('click')
    }
  },
} 
</script>

<style scoped lang="scss">
.my-search-container {
  // 移除背景颜色，改由 props 属性控制
  // background-color: #C00000;
  height: 50px;
  padding: 0 10px;
  display: flex;
  align-items: center;

  .my-search-box {
    height: 36px;
    background-color: #ffffff;
    // 移除圆角尺寸，改由 props 属性控制
    // border-radius: 15px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    .placeholder {
      font-size: 15px;
      margin-left: 5px;
    }
  }
}
</style>