<template>
  <view class="goods_list">
    <!-- 数据为空 -->
    <view v-if="goodsList.length === 0">
      <view class="result-null">
        暂无数据！
      </view>
    </view>
    <!-- end：数据为空 -->

    <!-- 存在数据 -->
    <view v-else>
      <view v-for="(item, index) in goodsList" :key="index">
        <goodsListItem :goods="item" @click="gotoDetail(item)"></goodsListItem>
      </view>
      <!-- 底部提示 -->
      <view class="loadAll" v-if="isloadAll">
        ---我是有底线的---
      </view>
      <!-- end：底部提示 -->
    </view>

    <!-- end：存在数据 -->
  </view>
</template>

<script>
import goodsListItem from '../../components/goodsListItem/goodsListItem.vue'
export default {
  components: {
    goodsListItem,
  },
  data() {
    return {
      queryObj: {
        query: '', // 查询关键词
        cid: '', // 商品分类Id
        pagenum: 1,  // 页码值
        pagesize: 10,// 每页显示多少条数据
      },
      goodsList: [],// 商品列表的数据
      total: 0,// 总数量，用来实现分页
      isLoding: false,//列表数据二次请求节流阀
      isloadAll: false,//数据是否全部加载
    }
  },
  methods: {
    // 获取列表数据
    async getGoodsList(callBack) {
      this.isLoding = true;
      let res = await uni.$http.get('/api/public/v1/goods/search', this.queryObj)
      if (res.statusCode === 200) {
        this.total = res.data.message.total;

        // 获取列表初始数据或对第二次列表获取到的数据进行拼接
        this.goodsList = [...(this.goodsList), ...(res.data.message.goods)];
        // console.log(this.goodsList);
      } else uni.$showMsg()
      this.isLoding = false;
      callBack && callBack();
    },

    // 点击跳转
    gotoDetail(item) {
      console.log(item);
      uni.navigateTo({
        url: `/subpkg/goods_detail/goods_detail?goods_id=${item.goods_id}`
      })
    }
  },
  watch: {
    'goodsList.length': {
      handler(newValue) {
        if (newValue === this.total) {
          // uni.$showMsg('全部数据已加载！');
          if (this.total !== 0) {
            this.isloadAll = true;
          }

        }
      },
    }
  },
  // 页面加载事件
  onLoad(options) {
    this.queryObj.query = options.query || '';
    this.queryObj.cid = options.cid || '';
    this.getGoodsList();
  },
  // 页面触底事件
  onReachBottom() {
    // 判断数据是否全部加载
    if (this.isloadAll) { return true; }
    // 节流阀(防止并发请求)
    if (this.isLoding) { return true }

    // 请求下一页的数据
    this.queryObj.pagenum += 1;
    this.getGoodsList();


  },

  // 下拉刷新事件
  onPullDownRefresh() {
    // 重置数据
    this.queryObj.pagenum = 1;
    this.goodsList = [];
    this.total = 0;
    this.isLoding = false;
    this.isloadAll = false;
    // 发起新的请求(请求成功通过回调关闭刷新状态)
    this.getGoodsList(() => uni.stopPullDownRefresh());
  },

} 
</script>

<style scoped lang="scss">
.result-null {
  width: 100%;
  height: 100rpx;
  padding-top: 40rpx;
  text-align: center;
}

.loadAll {
  width: 100%;
  padding: 10rpx;
  text-align: center;
}
</style>