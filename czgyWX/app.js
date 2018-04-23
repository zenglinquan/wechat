//app.js
const host = require('config').host
var util = require('utils/util');
var authorityData = [];
App({
  data: {
    userInfo:{}
  },
  insertUser: function (loginCode) {

    var self = this;
    wx.request({
      url: host + 'store/user/insertSelective',
      data: {loginCode:loginCode.code},
      method: 'POST',
      success: function (result) {
        console.log(result)
        if (result.statusCode == '200') {
          if (result.data.success) {
            self.setSession("openid", result.data.data.openId);

            console.log(self.getSession("openid"))
            // util.showMsgToash(result.data.info)
          } else {
            // util.showMsgToash(result.data.info)
          }
        } else {
          util.showMsgToash("网络异常")
        }
      }
    })

  },
  wxLogin: function () {
    var self = this;
    wx.login({
      success: function (loginCode) {
        console.log(loginCode)
        self.insertUser(loginCode)
        // var appid = 'wxa70a5ccfeba9b980'; //填写微信小程序appid
        // var secret = '717660b2c89d5c2a4303aea0a587e250'; //填写微信小程序secret

        //调用request请求api转换登录凭证
        // wx.request({
        //   url: 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appid + '&secret=' + secret + '&grant_type=authorization_code&js_code=' + loginCode.code,
        //   header: {
        //     'content-type': 'application/json'
        //   },
        //   success: function (res) {
        //     console.log(res)
        //     console.log(res.data.openid) //获取openid
        //     res.data.openId = res.data.openid
        //     res.data.sessionKey = res.data.session_key
        //     self.setSession("openid", res.data.openid);
        //     self.insertUser(res)
        //   }
        // })
      }
    })
  },
  onLaunch: function () {
    var self = this;
    // self.setSession("openid", "oVJfv0LELb0t9GcSj53RPI6U-H9k");
    self.setSession("adminPage", "/pages/admin/pages/login/login")
    self.wxLogin();
    self.wxUserInfo();
  },
  wxUserInfo: function () {
    var self = this;
    // 调用微信登录接口
    wx.getSetting({
      success(res) {
        console.log(res)
        if (!res.authSetting['scope.userInfo']) {
          wx.authorize({
            scope: 'scope.userInfo',
            success() {
              // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
              wx.getUserInfo({
                success: function (res) {
                  var userInfo = res.userInfo
                  self.setSession("userInfo", JSON.stringify(userInfo))
                  var nickName = userInfo.nickName
                  var avatarUrl = userInfo.avatarUrl
                  var gender = userInfo.gender //性别 0：未知、1：男、2：女
                  var province = userInfo.province
                  var city = userInfo.city
                  var country = userInfo.country
                }
              })
            }
          })
        }
      }
    })
  },


  headerInfo: function (key) {
    return { "Cookie": this.getSession(key) };
  },
  setSession: function (key, value) {
    try {
      wx.setStorageSync(key, value)
      return true;
    } catch (e) {
      console.log(e)
      return false;
    }
  },
  getSession: function (key) {
    try {
      var value = wx.getStorageSync(key)
      return value;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
  removalSession: function (key) {
    try {
      wx.removeStorageSync(key)
      return true;
    } catch (e) {
      return false;
    }
  },
  showActionSheetModal: function (e) {
    var self = this;

    var authorityData = this.getSession("authorityData");
    var authorityArray = [];
    var authorityNameArray = [];
    for (var i = 0; i < authorityData.length; i++) {
      authorityArray[i] = authorityData[i].id;
      authorityNameArray[i] = authorityData[i].authorityName
    }
    this.setSession("authorityIds", authorityArray.join(","))
    console.log(authorityArray.join(","))
    var self = this;
    wx.showActionSheet({
      itemList: authorityNameArray,
      success: function (res) {
        console.log(!res.cancel)
        if (!res.cancel) {
          console.log(res.tapIndex + "")
          console.log(typeof res.tapIndex)

          console.log(authorityData)
          var key = authorityData[res.tapIndex].id;
          if (key == "1") {
            wx.redirectTo({
              url: '/pages/admin/pages/instock/instock',

            })
            self.setSession("adminPage", "/pages/admin/pages/instock/instock")
          } else if (key == "2") {
            wx.redirectTo({
              url: '/pages/admin/pages/outstock/outstock',
            })
            self.setSession("adminPage", "/pages/admin/pages/outstock/outstock")
          } else if (key == "3") {
            wx.redirectTo({
              url: '/pages/admin/pages/orders/orders',
            })
            self.setSession("adminPage", "/pages/admin/pages/orders/orders")
          } else if (key == "4") {
            wx.redirectTo({
              url: '/pages/admin/pages/sales/sales',
            })
            self.setSession("adminPage", "/pages/admin/pages/sales/sales")
          } else if (key == "5") {
            wx.redirectTo({
              url: '/pages/admin/pages/user/user',
            })
            self.setSession("adminPage", "/pages/admin/pages/user/user")
          } else if (key == "6") {
            wx.redirectTo({
              url: '/pages/admin/pages/product/product',
            })
            self.setSession("adminPage", "/pages/admin/pages/product/product")
          } else if (key == "7") {
            self.logout();
          } else {
            self.showActionSheetModal();
          }
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },
  logout: function () {
    var self = this;
    wx.request({
      url: host + 'logout',
      header: {
        "Cookie": self.getSession("adminSessionId")
      },
      success: function (result) {
        console.log(result)
        if (result.statusCode == '200') {

          self.setSession("adminSessionId", "");
          self.setSession("adminPage","/pages/admin/pages/login/login")
          util.resultOper(result)
        } else {
          util.showMsgToash("网络异常");
        }
      }
    })
  },
  redirectToPage: function () {
    console.log(authorityData)
    var key = authorityData[0].id;
    if (key == "1") {
      wx.redirectTo({
        url: '/pages/admin/pages/instock/instock',
      })
    } else if (key == "2") {
      wx.redirectTo({
        url: '/pages/admin/pages/outstock/outstock',
      })
    } else if (key == "3") {
      wx.redirectTo({
        url: '/pages/admin/pages/orders/orders',
      })
    } else if (key == "4") {
      wx.redirectTo({
        url: '/pages/admin/pages/sales/sales',
      })
    } else if (key == "5") {
      wx.redirectTo({
        url: '/pages/admin/pages/user/user',
      })
    } else if (key == "6") {
      wx.redirectTo({
        url: '/pages/admin/pages/product/product',
      })
    }
  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.getUserInfo({
        withCredentials: false,
        success: function (res) {
          console.log(res)
          that.globalData.userInfo = res.userInfo
          typeof cb == "function" && cb(that.globalData.userInfo)
        }
      })
    }
  },

  globalData: {
    jk: "asd "
  },


})
