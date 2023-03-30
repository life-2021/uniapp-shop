<template>
  <view class="goodsListItem" @click="gotoDetail">
    <view class="goods-item">
      <view class="item-pic">
        <image class="img" :src="goods.goods_small_logo" mode="aspectFit" />
      </view>
      <view class="item-content">
        <view class="text">{{ goods.goods_name }}</view>
        <view class="price">￥{{ goods.goods_price | formatNumber }}</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "goodsListItem",
  props: {
    goods: {
      type: Object,
      default: {},
    }
  },
  filters: {
    formatNumber(value) {
      if (isNaN(value)) {
        return value; // 如果不是数字则返回原值
      } else {
        return parseFloat(value).toFixed(2); // 将数字格式化为两位小数
      }
      
    }
  },
  methods: {
    gotoDetail() {
      this.$emit('click');
    }
  },
} 
</script>

<style scoped lang="scss">
.goods-item {
  display: flex;
  padding: 10rpx;
  border-bottom: 1px solid #f0f0f0;

  .item-pic {
    width: 200rpx;
    height: 200rpx;
    margin-right: 20rpx;

    .img {
      width: 100%;
      height: 100%;
    }
  }

  .item-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .text {
      padding-top: 10rpx;
      font-size: 16px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }

    .price {
      font-size: 20px;
      color: #c00000;
    }
  }
}
</style>