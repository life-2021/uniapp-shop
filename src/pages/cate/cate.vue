<template>
  <view class="cate">
    <!-- 搜索区域 -->
    <view class="search-container">

    </view>
    <!-- 滑动区域 -->
    <view class="scroll-container">
      <!-- 左侧分类滑动区域 -->
      <scroll-view class="leftScroll" scroll-y="true" :style="'height:' + windowHeight + 'px;'">
        <block v-for="(item, index) in cateList" :key="index">
          <view class="leftItem" :class="index == activeIndex ? 'active' : ''" @click="changeActiceIndex(index)">{{
            item.cat_name }}</view>
        </block>

      </scroll-view>
      <!-- end：左侧分类滑动区域 -->

      <!-- 右侧商品滑动区域 -->
      <scroll-view class="rightScroll" scroll-y="true" :style="'height:' + windowHeight + 'px;'" :scroll-top="scrollTop">
        <view class="cate-lv2" v-for="(item, index) in cateListLevel2" :key="index">
          <view class="cate-lv2-title">{{ item.cat_name }}</view>
          <view class="cate-lv3-container">
            <view class="cate-lv3-item" v-for="(item2, index2) in item.children" :key="index2" @click="gotoGoodsList(item2)">
              <view class="item-img">
                <image :src="item2.cat_icon" />
              </view>
              <view class="item-text">{{ item2.cat_name }}</view>
            </view>
          </view>

        </view>
      </scroll-view>
      <!-- end：右侧商品滑动区域 -->
    </view>
    <!-- end：滑动区域 -->
  </view>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      windowHeight: 0,//窗口高度
      cateList: [],//分类数据
      activeIndex: 0,//被选中的分类
      cateListLevel2: [],//二级分类
      scrollTop: 0,//右侧分类滚动距离
    }
  },
  methods: {
    async getCateList() {
      let res = await uni.$http.get('/api/public/v1/categories');
      if (res.statusCode == 200) {
        // 数据处理（处理图片路径错误问题）
        res.data.message.forEach(lev1 => {
          lev1.children.forEach(lev2 => {
            if (lev2.children) {
              lev2.children.forEach(lev3 => {
                lev3.cat_icon = 'https://api-ugo-web.itheima.net/full/' + lev3.cat_icon.split('https://api-ugo-dev.itheima.net/full/')[1]
              })
            }

          })
        })
        // 分类数据
        this.cateList = res.data.message;
        // console.log(this.cateList);
        // 二级分类数据
        this.cateListLevel2 = this.cateList[this.activeIndex].children;
        console.log(this.cateListLevel2);
      } else { uni.$showMsg }
    },
    // 修改分类的选中的index
    changeActiceIndex(index) {
      // 修改被选中项
      this.activeIndex = index;
      // 修改二级分类数据
      this.cateListLevel2 = this.cateList[index].children;
      // 右侧视图回到最顶端(不能赋相同的值！)
      this.scrollTop = this.scrollTop === 0 ? 1 : 0;
    },
    //分类的点击事件
    gotoGoodsList(item) {
      uni.navigateTo({
        url:`/subpkg/goods_list/goods_list?cid=${item.cat_id}`
      })
    }
  },
  onLoad() {
    // 获取设备信息
    let sysIfon = uni.getSystemInfoSync();
    // console.log(sysIfon)
    // 当前可用窗口高度
    this.windowHeight = sysIfon.windowHeight;

    // 获取分类数据
    this.getCateList();
  }
} 
</script>

<style scoped lang="scss">
.scroll-container {
  display: flex;

  .leftScroll {
    width: 240rpx;

    .leftItem {
      background-color: #f7f7f7;
      line-height: 120rpx;
      text-align: center;
      font-size: 12px;
      position: relative;

      // 筛选leftItem里面的active
      &.active {
        background-color: #fff;
        color: #c00000;

        &::before {
          content: '';
          display: block;
          width: 6rpx;
          height: 80rpx;
          background-color: #c00000;
          position: absolute;
          top: 50%;
          left: 0;
          transform: translateY(-50%);
        }
      }
    }
  }

  .rightScroll {
    .cate-lv2 {
      text-align: center;

      .cate-lv2-title {
        font-size: 12px;
        font-weight: bold;
        padding: 30rpx 0;

        &:before {
          content: '/ ';
        }

        &:after {
          content: ' /';
        }
      }

      .cate-lv3-container {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        padding: 0 0 0 30rpx;
      }

      .cate-lv3-item {
        margin: 25rpx;
        display: flex;
        flex-direction: column;
        font-size: 12px;

        image {
          width: 60px;
          height: 60px;
          // border: 1px solid black;
        }

      }
    }
  }
}
</style>