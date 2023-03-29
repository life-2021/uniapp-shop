<template>
  <view class="home">
    <!-- 搜索区域 -->
    <view class="search-container">
      <search @click="gotoSearch"></search>
    </view>
    <!-- end:搜索区域 -->
    <!-- 轮播 -->
    <view class="swiperBox">
      <swiper class="swiper" :circular="true" :indicator-dots="true" :autoplay="true" :interval="2000" :duration="500">
        <swiper-item v-for="item in swiperList" :key="item.goods_id">
          <navigator class="swiperItem" :url="'/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id"
            :open-type="item.open_type">
            <image :src="item.image_src" mode="aspectFit" />
          </navigator>
        </swiper-item>
      </swiper>
    </view>
    <!-- end：轮播 -->
    <!-- 导航 -->
    <view class="nav-list">
      <view class="nav-item" v-for="(item, index) in navList" :key="index" @click=navClickHandler(item)>
        <image :src="item.image_src" mode="aspectFit" />
      </view>
    </view>
    <!-- end：导航 -->
    <!-- 楼层 -->
    <view class="floor-list">
      <view class="floor-item" v-for="(item, index) in floorList" :key="index">
        <!-- 头部 -->
        <view class="item-title">
          <image :src="item.floor_title.image_src" />
        </view>
        <!-- end：头部 -->
        <!-- 内容 -->
        <view class="item-content">
          <!-- 左边大图 -->
          <view class="left">
            <image :src="item.product_list[0].image_src" :style="'width:' + item.product_list[0].image_width + 'rpx;'"
              mode="widthFix" />
          </view>
          <!-- end：左边大图 -->

          <!-- 右边小图 -->
          <view class="right">
            <navigator v-for="(item2, index2) in item.product_list" :key="index2" :url="item2.navigator_url"
              open-type="navigate">
              <image v-if="index2 !== 0" :src="item2.image_src" :style="'width:' + item2.image_width + 'rpx;'"
                mode="widthFix"></image>
            </navigator>
          </view>
          <!-- end：右边小图 -->
        </view>
        <!-- end：内容 -->
      </view>
    </view>
    <!-- end：楼层 -->
  </view>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      // 轮播图
      swiperList: [],
      // 分类导航
      navList: [],
      // 楼层
      floorList: [],
    }
  },
  methods: {
    // 获取轮播数据
    async getSwiperList() {
      let res = await uni.$http.get('/api/public/v1/home/swiperdata')
      if (res.statusCode === 200) {
        this.swiperList = res.data.message;
        // console.log(this.swiperList);
      } else { uni.$showMsg }
    },
    //获取分类导航数据
    async getNavList() {
      let res = await uni.$http.get('/api/public/v1/home/catitems')
      if (res.statusCode === 200) {
        this.navList = res.data.message;
        // console.log(this.navList);
      } else { uni.$showMsg }
    },
    //导航跳转
    navClickHandler(item) {
      console.log(item)
      if (item.name === '分类') {
        uni.switchTab({
          url: '/pages/cate/cate'
        })
      }
    },
    // 获取楼层数据
    async getFloorList() {
      let res = await uni.$http.get('/api/public/v1/home/floordata')
      if (res.statusCode === 200) {
        res.data.message.forEach(floor => {
          floor.product_list.forEach(image => {
            image.navigator_url = '/subpkg/goods_list/goods_list?' + image.navigator_url.split('?')[1];
          })
        })
        this.floorList = res.data.message;
        // console.log(this.floorList);
      } else { uni.$showMsg }
    },
    //前往搜索页面
    gotoSearch() {
      uni.navigateTo({
        url: `/subpkg/search/search`
      })
    }
  },


  // 页面周期函数--监听页面加载
  onLoad() {
    this.getSwiperList();
    this.getNavList();
    this.getFloorList();
  },

} 
</script>

<style scoped lang="scss">
.search-container{
  position: sticky;
  top: 0;
  z-index: 999;
}
.swiperBox {
  .swiper {
    width: 100%;
    height: 330rpx;

    .swiperItem {
      width: 100%;
      height: 100%;

      image {
        width: 100%;
        height: 100%;
      }
    }

  }
}

.nav-list {
  display: flex;
  justify-content: space-around;
  margin: 15px 0;

  .nav-item {
    // display: inline-block;
    width: 128rpx;
    height: 140rpx;

    image {
      width: 100%;
      height: 100%;
    }
  }
}

.floor-list {
  margin: 0 15rpx;

  .floor-item {
    margin: 30rpx 0;
    display: flex;

    .item-title {
      image {
        width: 100%;
        height: 60rpx;
      }
    }

    .item-content {
      display: flex;
      // padding-left: 10rpx;

      .right {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        padding-left: 10rpx;
      }
    }
  }

}
</style>