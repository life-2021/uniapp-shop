class Request {
  constructor(options = {}) {
    // 请求的根路径
    this.baseUrl = options.baseUrl || "";
    // 请求的 url 地址
    this.url = options.url || "";
    // 请求方式，默认为 GET
    this.method = "GET";
    // 请求的参数对象，默认为 null
    this.data = null;
    // header 请求头，默认为空对象
    this.header = options.header || {};
    // 请求之前的钩子函数
    this.beforeRequest = null;
    // 请求之后的钩子函数
    this.afterRequest = null;
  }

  // 发送 GET 请求
  get(url, data = {}) {
    this.method = "GET";
    this.url = this.baseUrl + url;
    this.data = data;
    return this._(); // 返回 Promise 对象
  }

  // 发送 POST 请求
  post(url, data = {}) {
    this.method = "POST";
    this.url = this.baseUrl + url;
    this.data = data;
    return this._(); // 返回 Promise 对象
  }

  // 发送 PUT 请求
  put(url, data = {}) {
    this.method = "PUT";
    this.url = this.baseUrl + url;
    this.data = data;
    return this._(); // 返回 Promise 对象
  }

  // 发送 DELETE 请求
  delete(url, data = {}) {
    this.method = "DELETE";
    this.url = this.baseUrl + url;
    this.data = data;
    return this._(); // 返回 Promise 对象
  }

  // 发送 HTTP 请求
  _() {
    // 清空 header 对象
    this.header = {};
    // 如果存在请求之前的钩子函数，则调用它
    if (this.beforeRequest && typeof this.beforeRequest === "function") {
      this.beforeRequest(this);
    }
    // 发起请求，返回 Promise 对象
    return new Promise((resolve, reject) => {
      let weixin = wx;
      // 如果在 uniapp 中运行，则使用 uni.request 方法
      if ("undefined" !== typeof uni) {
        weixin = uni;
      }
      weixin.request({
        url: this.url, // 请求的 URL
        method: this.method, // 请求的方法
        data: this.data, // 请求的参数
        header: this.header, // 请求头
        success: (res) => {
          resolve(res);
        }, // 请求成功的回调函数
        fail: (err) => {
          reject(err);
        }, // 请求失败的回调函数
        complete: (res) => {
          // 如果存在请求之后的钩子函数，则调用它
          if (this.afterRequest && typeof this.afterRequest === "function") {
            this.afterRequest(res);
          }
        },
      });
    });
  }
}

// 导出 $http 对象，即实例化的 Request 类对象
export const $http = new Request();
