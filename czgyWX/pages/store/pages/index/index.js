var WxAutoImage = require('../../js/wxAutoImageCal.js');
const host = require('../../config').host
var app = getApp()
var util = require("../../utils/util.js");

Page({
  data: {
    imgUrls: [
      '../../images/swiper1.jpg',
      '../../images/swiper1.jpg',
      '../../images/swiper1.jpg'
    ],
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 3000,
    duration: 1200,
    goods: [
      {
        "avatar": "../../images/zhutu.jpg",
        "title": "阿拨茶具蜂窝玲茶jfadsjfdsiaojiowfeiweioewqpp",
        "price": "99",
      },
      {
        "avatar": "../../images/zhutu.jpg",
        "title": "阿拨茶具蜂窝玲珑茶",
        "price": "99",
      },
      {
        "avatar": "../../images/zhutu.jpg",
        "title": "阿拨茶具蜂窝玲珑茶",
        "price": "99",
      },
      {
        "avatar": "../../images/zhutu.jpg",
        "title": "阿拨茶具蜂窝茶",
        "price": "99",
      },
      {
        "avatar": "../../images/zhutu.jpg",
        "title": "阿拨萨",
        "price": "99",
      }

    ]
  },
  onShow: function (e) {
    // app.wxLogin()
    this.getAllNewProduct();
    this.getAllProduct();
  },
  getAllProduct: function (e) {
    var self = this;
    wx.request({
      url: host + 'store/selectAllStoreProduct',
      header: { "openid": app.getSession("openid") },
      success: function (result) {
        console.log(result)
        if (result.statusCode == '200') {
          if (result.data.success) {
            var storeProduct = result.data.data;
            storeProduct.forEach(function (obj, v) {
              var src = host + obj.pic1
              obj.pic1 = src
            })
            self.setData({
              storeProductData: storeProduct
            })
            console.log(storeProduct)
          } else {
            util.resultOper(result)
          }
        } else {
          util.showMsgToash("网络异常")
        }
      }

    })
  },
  getAllNewProduct: function (e) {
    var self = this;
    wx.request({
      url: host + 'store/selectAllNewStoreProduct',
      header: { "openid": app.getSession("openid") },
      success: function (result) {
        console.log(result)
        if (result.statusCode == '200') {
          if (result.data.success) {
            var newProduct = result.data.data;
            newProduct.forEach(function (obj, v) {
              var src = host + obj.pic1
              obj.pic1 = src
            })
            self.setData({
              newProduct: newProduct
            })
            console.log(newProduct)
          } else {
            util.resultOper(result)
          }
        } else {
          util.showMsgToash("网络异常")
        }
      }

    })
  },
  clickSlideIimage: function (e) {
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../spdetail/spdetail?productId=' + e.currentTarget.dataset.id,
    })
  },
  cusImageLoad: function (e) {
    var that = this;
    that.setData(WxAutoImage.wxAutoImageCal(e));
  },
  showDetail: function (e) {
    wx.navigateTo({
      url: '../spdetail/spdetail?productId=' + e.currentTarget.dataset.id,
    })
  },
  aboutus: function () {
    wx.navigateTo({
      url: '../about-us/about-us',
    })
  },
  infoopen: function () {
    wx.navigateTo({
      url: '../info-open/info-open',
    })
  },
  contactus: function () {
    wx.navigateTo({
      url: '../contactus/contactus',
    })
  },
  login: function () {
    var adminSessionId = app.getSession("adminSessionId");
    var adminPage = "/pages/admin/pages/login/login"

    console.log(typeof (adminPage))
    console.log(typeof (adminSessionId))
    console.log(adminSessionId == null && adminSessionId == "")
    console.log(adminPage)
    console.log(adminSessionId)
    console.log(adminSessionId == null || adminSessionId == "")
    if (adminSessionId != null || adminSessionId != "" || adminSessionId.length > 0) {
      adminPage = app.getSession("adminPage")
    }
    wx.navigateTo({
      url: adminPage,
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */

  onPullDownRefresh: function () {
    this.onShow();
  },
  onShareAppMessage: function () {

  },
  searcStore: function () {
    var self = this;
    self.setData({
      storeProductData: []
    })
    console.log(self.data.productName)
    wx.request({
      url: host + 'store/selectAllStoreProductByProductName?productName=' + self.data.storeName,
      header: { "openid": app.getSession("openid") },
      success: function (result) {
        console.log(result)
        if (result.statusCode == '200') {
          if (result.data.success) {
            if (result.data.data.length <= 0) {
              util.showMsgToash("未检测到该商品")
            } else {

              var storeProductData = result.data.data;
              storeProductData.forEach(function (obj, v) {
                var src = host + obj.pic1
                obj.pic1 = src
              })
              self.setData({
                storeProductData: storeProductData
              })
              console.log(storeProductData)
            }
          } else {
            util.resultOper(result)
          }
        } else {
          util.showMsgToash("网络异常")
        }
      }

    })
  },
  searchStroeNameChange: function (e) {
    var storeName = e.detail.value;
    this.setData({
      storeName: storeName
    })
    console.log(storeName)
  }
})