import Vue from 'vue'
import App from './App'

import { $http } from "@escook/request-miniprogram";
uni.$http = $http;
// 配置请求根路径
$http.baseUrl = "https://api-ugo-web.itheima.net";

// 请求开始之前做一些事情
$http.beforeRequest = function (options) {
  uni.showLoading({
    title: "数据加载中...",
  });
};

// 封装请求失败弹窗
uni.$showMsg = function (title = '请求失败', duration = 1500,icon = 'none') {
  uni.showToast({
    title,
    duration,
    icon,
  });
}

// 请求完成之后做一些事情
$http.afterRequest = function () {
  uni.hideLoading();
};

Vue.config.productionTip = false

App.mpType = 'app'

function isPromise(obj) {
  return (
    !!obj &&
    (typeof obj === "object" || typeof obj === "function") &&
    typeof obj.then === "function"
  );
}

uni.addInterceptor({
  returnValue(res) {
    if (!isPromise(res)) {
      return res;
    }
    return new Promise((resolve, reject) => {
      res.then((res) => {
        if (res[0]) {
          reject(res[0]);
        } else {
          resolve(res[1]);
        }
      });
    });
  },
});

const app = new Vue({
  ...App
})
app.$mount()
