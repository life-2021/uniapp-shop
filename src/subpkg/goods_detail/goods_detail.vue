<template>
  <view class="goods-detail">
    <!-- 轮播图 -->
    <view class="swiper-container">
      <swiper class="swiper" interval="3000" duration="1000" autoplay="true" circular="true" :indicator-dots="true">
        <swiper-item v-for="(item, index) in goods_info.pics" :key="index">
          <image class="img" :src="item.pics_big" @click="preview(index)" />
        </swiper-item>
      </swiper>
    </view>
    <!-- end：轮播图 -->

    <!-- 商品信息 -->
    <view class="goodsMsg-container" v-if="goods_info.goods_name">
      <view class="price">￥{{ goods_info.goods_price }}</view>
      <view class="goods-detail">
        <view class="goodsName">{{ goods_info.goods_name }}</view>
        <view class="favorite">
          <uni-icons type="star" size="18"></uni-icons>
          <text>收藏</text>
        </view>
      </view>
      <view class="dispatching">快递：免运费</view>
    </view>
    <!-- end:商品信息 -->

    <!-- 商品详情 -->
    <view class="detail-container">
      <rich-text :nodes="goods_info.goods_introduce"></rich-text>
    </view>
    <!-- end：商品详情 -->

    <!-- 底部导航 -->
    <view class="goods_nav">
      <uni-goods-nav :fill="true" :options="options" :buttonGroup="buttonGroup" @click="onClick"
        @buttonClick="buttonClick" />
    </view>

    <!-- 底部导航 -->
  </view>
</template>

<script>
// import { uniIcons } from '@dcloudio/uni-ui';
export default {
  // components: { uniIcons },
  data() {
    return {
      goods_info: {},// 商品详情对象
      options: [{
        icon: 'shop',
        text: '店铺',
        // info: 2,
      }, {
        icon: 'cart',
        text: '购物车',
        info: 2
      }],
      buttonGroup: [{
        text: '加入购物车',
        backgroundColor: '#ff0000',
        color: '#fff'
      },
      {
        text: '立即购买',
        backgroundColor: '#ffa200',
        color: '#fff'
      }
      ]
    }
  },
  methods: {
    // 获取商品数据
    async getGoodsDetail(id) {
      let res = await uni.$http.get(`/api/public/v1/goods/detail?goods_id=${id}`);
      if (res.statusCode == 200) {
        // 对富文本区域数据异常更正(img标签存在间隙，ios无法加载webp图片)
        res.data.message.goods_introduce = res.data.message.goods_introduce.replace(/<img /g, '<img style="display:block;" ').replace(/.webp/g, '.jpg');
        
        this.goods_info = res.data.message;
        // console.log(this.goods_info);
      } else uni.$showMsg();
    },
    //点击查看大图
    preview(index) {
      // 获取全部图片地址
      let picList = [];
      this.goods_info.pics.forEach(item => {
        picList.push(item.pics_big);
      })

      // 调用自带API查看大图
      uni.previewImage({
        current: index,
        urls: picList,
        loop: true
      })
    },
    // 底部导航左侧点击事件
    onClick(e) {
      console.log(e)
      if (e.content.text === '购物车') {
        console.log(e)
        uni.switchTab({
          url: '/pages/cart/cart',
        })
      }
    },
    // 底部导航右侧点击事件
    buttonClick(e) {
      console.log(e)

    }
  },
  onLoad(options) {
    this.getGoodsDetail(options.goods_id)
  }
} 
</script>

<style scoped lang="scss">
.swiper-container {
  .swiper {
    height: 750rpx;

    .img {
      width: 100%;
      height: 100%;
    }
  }
}

.goodsMsg-container {
  padding: 10px;

  .price {
    color: #c00000;
    font-size: 18px;
    margin: 10px 0;
  }

  .goods-detail {
    display: flex;
    justify-content: space-between;

    .goodsName {
      font-size: 16px;
      padding-right: 20rpx;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }

    .favorite {
      width: 120px;
      font-size: 12px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      border-left: 1px solid #efefef;
      color: gray;
    }
  }

  .dispatching {
    margin: 10px 0;
    font-size: 12px;
    color: gray;
  }
}

.detail-container {
  padding-bottom: 100rpx;
}

.goods_nav {
  // 为商品导航组件添加固定定位
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
}
</style>