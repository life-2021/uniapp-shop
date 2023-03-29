<template>
  <!-- 搜索框 -->
  <view class="search">
    <view class="search-container">
      <uni-search-bar class="uni-mt-10" radius="18" :value="inputData" clearButton="auto" cancelButton="none"
        @input="search" :focus="focusState" />
    </view>
    <!-- end：搜索框 -->

    <!-- 搜索结果 -->
    <view class="result-container" v-if="!searchResultsIsNull">
      <!-- 收搜结果为空 -->
      <view v-if="searchResults[0].goods_id == -1">
        <view class="result-null">{{ searchResults[0].goods_name }}</view>
      </view>
      <!-- end：收搜结果为空 -->

      <!-- 有搜索结果 -->
      <view class="result-item" v-for="(item, index) in searchResults" :key="index" @click="gotoDetail(item)" v-else>
        <view class="result-item-text">
          {{ item.goods_name }}
        </view>
        <uni-icons class="icon" type="right" size="20"></uni-icons>
      </view>
      <!-- end：有搜索结果 -->
    </view>
    <!-- end:搜索结果 -->

    <!-- 搜索历史 -->
    <view class="history-container" v-else>
      <view class="history-title">
        <text>搜索历史</text><uni-icons class="icon" type="trash-filled" size="20" @click="deleteHistory"></uni-icons>
      </view>
      <!-- 无历史记录 -->
      <view class="history-content" v-if="historyListIsNull">
        <view class="history-null">暂无搜索记录</view>
      </view>
      <!-- end：无历史记录 -->

      <!-- 有历史记录  -->
      <view class="history-content" v-else>
        <view class="history-item" v-for="(item, index) in historyList" :key="index" @click="entryInput(item)">
          {{ item }}
        </view>
      </view>
      <!-- end：有历史记录 -->
    </view>
    <!-- end:搜索历史 -->
  </view>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      inputData: '',//搜索框数据
      focusState: false,//搜索框焦点
      timer: null,//节流定时器
      searchResults: [],//搜索结果
      historyList: [],//搜索历史
    }
  },
  computed: {
    historyListIsNull() {
      return (this.historyList.length === 0);
    },
    searchResultsIsNull() {
      return (this.searchResults.length === 0);
    }
  },
  methods: {
    // 搜索
    search(e) {
      // console.log(e);
      // 防抖
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.inputData = e;
        // console.log(this.inputData);
        this.getSearchList()
      }, 500)
    },

    // 获取搜索的数据
    async getSearchList() {
      // 处理搜索内容为空的情况
      if (this.inputData === '') {
        this.searchResults = [];
      } else {
        let res = await uni.$http.get('/api/public/v1/goods/qsearch', { query: this.inputData })
        if (res.statusCode === 200) {
          // 处理返回值为空的情况
          if (res.data.message.length === 0) {
            this.searchResults = [{ goods_id: -1, goods_name: '没有相关商品！' }]
            // console.log(this.searchResults)
          } else {
            this.searchResults = res.data.message;
            // console.log(this.searchResults)
          }

          // 添加到搜索历史记录
          // 检查是否有该记录
          // 有：记录提前到第一位
          if (this.historyList.includes(this.inputData)) {
            let index = this.historyList.indexOf(this.inputData)
            this.historyList.unshift(this.historyList[index])
            this.historyList.splice(index + 1, 1)
          } else {
            // 没有直接添加
            this.historyList.unshift(this.inputData)
          }

          // 将搜索历史保存到本地
          uni.setStorageSync('historyList', this.historyList)
        } else uni.$showMsg()

      }
    },

    // 前往商品详情页
    gotoDetail(item) {
      uni.navigateTo({
        url: `/subpkg/goods_detail/goods_detail?goods_id=${item.id}`
      })
    },

    // 删除搜索历史
    deleteHistory() {
      this.historyList = [];
      // 将搜索历史保存到本地
      uni.setStorageSync('historyList', this.historyList)
    },

    // 点击历史记录填入输入框内
    entryInput(item) {
      // console.log(item)
      this.inputData = item;
      uni.hideKeyboard();	//隐藏软键盘				
      this.focusState = true;
    }
  },
  onLoad() {
    // 加载本地搜索历史
    this.historyList = uni.getStorageSync('historyList') || [];
  }
} 
</script>

<style scoped lang="scss">
.search-container {
  background-color: #c00000;
  position: sticky;
  top: 0;
  z-index: 999;
}

.result-container {
  .result-null {
    width: 100%;
    height: 100rpx;
    padding-top: 40rpx;
    text-align: center;
  }

  .result-item {
    border-bottom: 1px solid #efefef;
    display: flex;
    padding: 10rpx 0 20rpx 20rpx;

    .result-item-text {
      width: 700rpx;
      font-size: 16px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
    }

    .icon {
      width: 50rpx;
    }

  }
}

.history-container {
  .history-title {
    display: flex;
    border-bottom: 1px solid #efefef;

    .icon {
      flex: 1;
      padding: 20rpx;
    }

    text {
      flex: 8;
      padding: 20rpx;
    }
  }

  .history-content {
    .history-item {
      margin: 10rpx;
      display: inline-block;
      font-size: 12px;
      padding: 10rpx;
      border: 1px solid #efefef;
      border-radius: 10rpx;
    }

    .history-null {
      width: 100%;
      height: 100rpx;
      padding-top: 40rpx;
      text-align: center;
    }
  }
}
</style>